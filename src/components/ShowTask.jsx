import { useState } from "react";
import "../components/css/ShowTask.css";

export default function ShowTask({ list, DeleteHandler, updateList }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const handleEditClick = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleCancelClick = () => {
    setEditingTaskId(null);
  };

  const handleSubmit = (event, taskId) => {
    event.preventDefault();

    const updatedTaskData = {
      task: event.target.elements.task.value,
      det: event.target.elements.det.value,
    };

    updateList(taskId, updatedTaskData);
    setEditingTaskId(null);
  };

  return (
    <main>
      <section className="table-section">
        <h2>Tasks</h2>
        <table id="task-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Priority</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((task) => (
              <tr key={task._id === undefined ? task.name : task._id}>
                <td>
                  {editingTaskId === task._id ? (
                    <form onSubmit={(event) => handleSubmit(event, task.name)}>
                      <input
                        type="text"
                        name="task"
                        defaultValue=""
                        placeholder="Edit Task"
                      />
                      <input
                        type="text"
                        name="det"
                        style={{ marginTop: "5px", marginBottom: "5px" }}
                        defaultValue=""
                        placeholder="Edit Description"
                      />
                      <button type="submit">Save</button>
                      <button
                        className="midSize-btn"
                        type="button"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    task.name
                  )}
                </td>
                <td>{task.priority}</td>
                <td>{task.desc}</td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => DeleteHandler(task._id)}
                  >
                    Delete
                  </button>
                  {editingTaskId === task._id ? null : ( // Conditionally render the Edit button
                    <button
                      className="btn-primary"
                      onClick={() => handleEditClick(task._id)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
