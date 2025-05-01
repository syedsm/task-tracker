import { format } from "date-fns";
import { FiTrash2 } from "react-icons/fi";

function TaskList({ tasks = [], onUpdateTask, onDeleteTask }) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updates = {
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date() : null,
    };
    onUpdateTask(taskId, updates);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4 min-w-0">
            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-base truncate">
                {task.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 break-words max-w-full">
                {task.description}
              </p>
              <div className="mt-2 space-y-1 text-xs text-gray-500">
                <p>
                  Created: {format(new Date(task.createdAt), "MMM d, yyyy")}
                </p>
                {task.status === "completed" && task.completedAt && (
                  <p>
                    Completed:{" "}
                    {format(new Date(task.completedAt), "MMM d, yyyy")}
                  </p>
                )}
              </div>
            </div>

            {/* Action Panel */}
            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className={`text-xs sm:text-sm rounded-full px-3 py-1 border transition ${
                  statusColors[task.status] || "bg-gray-100"
                }`}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={() => onDeleteTask(task._id)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs sm:text-sm transition"
              >
                <FiTrash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {tasks.length === 0 && (
        <p className="text-sm text-gray-600 mt-1 break-words max-w-full">
          No tasks yet
        </p>
      )}
    </div>
  );
}

export default TaskList;
