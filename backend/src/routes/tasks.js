import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

const router = express.Router();

// Create task
router.post('/',
  auth,
  [
    body('title').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('projectId').notEmpty()
  ],
  async (req, res) => {
    // console.log("data received", req.body);

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const project = await Project.findOne({
        _id: req.body.projectId,
        user: req.user._id
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const task = new Task({
        title: req.body.title,
        description: req.body.description,
        project: project._id
      });

      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Get project tasks
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = await Task.find({ project: project._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.patch('/:taskId',
  auth,
  [
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('status').optional().isIn(['pending', 'in-progress', 'completed'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await Task.findOne({
        _id: req.params.taskId,
        project: { $in: await Project.find({ user: req.user._id }).select('_id') }
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const updates = req.body;
      if (updates.status === 'completed' && task.status !== 'completed') {
        updates.completedAt = new Date();
      } else if (updates.status !== 'completed') {
        updates.completedAt = null;
      }

      Object.assign(task, updates);
      await task.save();
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Delete task
router.delete('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      project: { $in: await Project.find({ user: req.user._id }).select('_id') }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get single project with tasks
router.get('/:projectId/details', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = await Task.find({ project: project._id });
    res.json({ ...project.toObject(), tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;