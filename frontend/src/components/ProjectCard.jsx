import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import TaskList from "./TaskList";
import CreateTaskModal from "./CreateTaskModal";
import { Contextapi } from "../App";
import { FiTrash2, FiPlus } from "react-icons/fi";

function ProjectCard({ project, onUpdate, onDelete }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const { token } = useContext(Contextapi);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/tasks/project/${project._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        // console.log("Fetched tasks:", data);
        if (res.ok && Array.isArray(data) && data.length > 0) {
          setTasks(data);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err.message);
      }
    };

    fetchTasks();
  }, [project._id, token]);

  const handleCreateTask = async (taskData) => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...taskData,
          projectId: project._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedTasks = [...tasks, data];
        setTasks(updatedTasks);
        onUpdate({ ...project, tasks: updatedTasks });
        setIsTaskModalOpen(false);
      } else {
        console.error("Task creation error:", data.error);
      }
    } catch (err) {
      console.error("Task creation failed:", err.message);
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (res.ok) {
        const updatedTasks = tasks.map((t) => (t._id === taskId ? data : t));
        setTasks(updatedTasks);
        setSuccessMsg("Task updated successfully!");
        onUpdate({ ...project, tasks: updatedTasks });
        setTimeout(() => setSuccessMsg(""), 2000);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Task update failed:", err.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const updatedTasks = tasks.filter((t) => t._id !== taskId);
        setTasks(updatedTasks);
        onUpdate({ ...project, tasks: updatedTasks });
      } else {
        const data = await res.json();
        console.error(data.error);
      }
    } catch (err) {
      console.error("Task delete failed:", err.message);
    }
  };

  return (
    <div className="card bg-white rounded-2xl shadow-sm p-4 sm:p-5 hover:shadow-md transition-all overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4 min-w-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            Created on {format(new Date(project.createdAt), "MMM d, yyyy")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition"
          >
            <FiPlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project._id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 border border-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <FiTrash2 className="w-4 h-4" />
            
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="text-green-600 text-sm mb-3">{successMsg}</div>
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
}

export default ProjectCard;
