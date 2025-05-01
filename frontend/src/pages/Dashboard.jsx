import { useContext, useState, useEffect } from "react";
import { Contextapi } from "../App";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import { FiLogOut, FiUser } from "react-icons/fi";

function Dashboard() {
  const { logout, username, token } = useContext(Contextapi);
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = async (newProject) => {
    try {
      const response = await fetch(
        "https://task-tracker-backend-jur5.onrender.com/api/projects/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newProject.title }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProjects((prev) => [...prev, data]);
      } else {
        console.error("Error creating project:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error.message);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://task-tracker-backend-jur5.onrender.com/api/projects/fetch", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // console.log("Fetched projects:", data);
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects", err.message);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  const handleDeleteProject = async (projectId) => {
    // console.log("Attempting to delete project with ID:", projectId); // Debugging step 1
    try {
      const res = await fetch(
        `https://task-tracker-backend-jur5.onrender.com/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        // console.log("Project deleted successfully");
        setProjects((prev) => prev.filter((p) => p._id !== projectId));
      } else {
        const data = await res.json();
        console.error("Delete error:", data.error || "Unknown error occurred");
        alert(
          `Failed to delete project: ${data.error || "Unknown error occurred"}`
        );
      }
    } catch (err) {
      console.error("Failed to delete project:", err.message);
      alert(`An error occurred while deleting the project: ${err.message}`);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-primary-600">
              Task Tracker
            </h1>
            <div className="flex items-center gap-4">
              {/* User Icon and Username */}
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-700 w-6 h-6" />
                <span className="text-sm sm:text-base text-gray-700 font-medium">
                  {username}
                </span>
              </div>

              {/* Logout Button with Icon */}
              <button
                className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-white bg-gray-100 hover:bg-primary-600 rounded-lg transition duration-200 flex items-center gap-2"
                onClick={logout}
              >
                <FiLogOut className="w-5 h-5" /> {/* Logout Icon */}
                <span className="hidden sm:inline">Logout</span>{" "}
                {/* Text appears on larger screens */}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Your Projects
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and track your project progress
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={projects.length >= 4}
          >
            + Create Project
          </button>
        </div>

        {/* Projects Section */}
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No projects created yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first project
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onUpdate={(updatedProject) =>
                    setProjects(
                      projects.map((p) =>
                        p._id === updatedProject._id ? updatedProject : p
                      )
                    )
                  }
                  onDelete={handleDeleteProject}
                />
              ))
            ) : (
              <div className="col-span-full w-full bg-white text-center text-gray-500 py-10 rounded-xl shadow-sm">
                No projects found. Start by creating one.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
        user={username}
      />
    </div>
  );
}

export default Dashboard;
