import { useState } from "react";
import "../components/css/InputBox.css";

export default function InputBox({ handleList }) {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Low");
  const [details, setDetails] = useState("");
  function handleChange(value, id) {
    if (id === "task") {
      setTaskName(value);
    } else {
      setDetails(value);
    }
  }
  function handleOption(priorityLevel) {
    setPriority(priorityLevel);
  }
  function handleSubmit(event) {
    event.preventDefault();
    handleList({
      task: taskName,
      level: priority,
      det: details,
    });
    setTaskName("");
    setDetails("");
    setPriority("Low");
  }

  return (
    <body>
      <main>
        <section className="input-section">
          <h2>Add a New Task</h2>
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className="form-group">
              <label htmlFor="task-name">Task Name</label>
              <input
                type="text"
                id="task-name"
                name="task-name"
                value={taskName}
                onChange={(event) => handleChange(event.target.value, "task")}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" required>
                <option value={priority} disabled selected>
                  Select priority
                </option>
                <option onClick={() => handleOption("Low")} value="Low">
                  Low
                </option>
                <option onClick={() => handleOption("Medium")} value="Medium">
                  Medium
                </option>
                <option onClick={() => handleOption("High")} value="High">
                  High
                </option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="details">Details</label>
              <textarea
                id="details"
                name="details"
                rows="4"
                value={details}
                onChange={(event) =>
                  handleChange(event.target.value, "details")
                }
                required
              ></textarea>
            </div>
            <button type="Submit">Add Task</button>
          </form>
        </section>
      </main>
    </body>
  );
}
