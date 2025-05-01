import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import Project from '../models/Project.js';
const router = express.Router();

// Create project
router.post('/create',
  auth,
  [body('title').notEmpty().trim()],
  async (req, res) => {
    try {
      // console.log('Request body:', req.body); 
      // console.log('Authenticated user:', req.user); 

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // console.error('Validation errors:', errors.array()); 
        return res.status(400).json({ errors: errors.array() });
      }

      const userProjects = await Project.countDocuments({ user: req.user._id });
      // console.log('User project count:', userProjects); 
      if (userProjects >= 4) {
        console.error('Maximum project limit reached'); 
        return res.status(400).json({ error: 'Maximum project limit reached' });
      }

      const project = new Project({
        title: req.body.title,
        user: req.user._id
      });

      await project.save();
      // console.log('Project saved successfully:', project); 
      res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error.message); 
      res.status(400).json({ error: error.message });
    }
  });

// Get user's projects
router.get('/fetch', auth, async (req, res) => {
  try {
    // console.log('Authenticated user:', req.user); 

    const projects = await Project.find({ user: req.user._id });
    // console.log('Fetched projects:', projects); 
    res.json(projects);
  } catch (error) {
    // console.error('Error fetching projects:', error.message); 
    res.status(500).json({ error: error.message });
  }
});


router.delete('/:projectId', auth, async (req, res) => {
  try {

    const project = await Project.findOneAndDelete({
      _id: req.params.projectId,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found or you are not authorized to delete it' });
    }

    // console.log('Project deleted successfully:', project); 
    res.json({ message: 'Project deleted successfully', project });
  } catch (error) {
    console.error('Error deleting project:', error.message); 
    res.status(500).json({ error: 'An error occurred while deleting the project' });
  }
});


export default router;