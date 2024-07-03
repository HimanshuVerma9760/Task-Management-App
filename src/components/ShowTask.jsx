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

    updateList(taskId, updatedTaskData); // Assuming updateList takes taskId as argument
    setEditingTaskId(null);
  };

  return (
    <>
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
                <tr key={task.task}>
                  <td>
                    {editingTaskId === task.task ? (
                      <form
                        onSubmit={(event) => handleSubmit(event, task.task)}
                      >
                        <input
                          type="text"
                          name="task"
                          defaultValue={task.task}
                        />
                        <input type="text" name="det" defaultValue={task.det} />
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancelClick}>
                          Cancel
                        </button>
                      </form>
                    ) : (
                      task.task
                    )}
                  </td>
                  <td>{task.level}</td>
                  <td>{task.det}</td>
                  <td>
                    <button
                      className="btn-primary"
                      onClick={() => DeleteHandler(task.task)}
                    >
                      Delete
                    </button>
                    {editingTaskId === task.task ? null : ( // Conditionally render the Edit button
                      <button
                        className="btn-primary"
                        onClick={() => handleEditClick(task.task)}
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
    </>
  );
}
