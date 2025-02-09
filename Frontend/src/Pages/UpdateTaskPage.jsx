import {
  Box,
  Button,
  Drawer,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Form, useActionData } from "react-router-dom";

export default function UpdateTaskPage({ taskDetails, onTaskUpdate }) {
  const [message, setMessage] = useState("");
  const [taskName, setTaskName] = useState(taskDetails.taskName);
  const [taskDate, setTaskDate] = useState(taskDetails.taskDate.split("T")[0]);
  const [taskDetail, setTaskDetails] = useState(taskDetails.taskDetail);
  const [taskPriority, setTaskPriority] = useState(taskDetails.taskPriority);

  const addTaskHandler = async (event) => {
    event.preventDefault();
    if (
      (taskName === taskDetails.taskName || taskName.length === 0) &&
      (taskDetail === taskDetails.taskDetail || taskDetail.length === 0) &&
      taskPriority === taskDetails.taskPriority
    ) {
      setMessage("No Updates Required!");
    } else {
      const formData = {
        taskName,
        taskDetail,
        taskDate,
        taskPriority,
      };
      const res = await fetch(
        `http://localhost:3000/update/${taskDetails._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setMessage("Task Updated Successfully!");
        const updatedTask = await res.json();
        onTaskUpdate(updatedTask);
      } else {
        setMessage("Duplicate Entry");
        console.error("Failed to update task");
      }
    }

    setTaskName(taskDetails.taskName);
    setTaskDate(taskDetails.taskDate.split("T")[0]);
    setTaskDetails(taskDetails.taskDetail);
    setTaskPriority(taskDetails.taskPriority);
    // onTaskUpdate(updatedTask);
  };

  const onChangeHandler = (event) => {
    const id = event.target.id || event.target.name;
    const value = event.target.value;
    switch (id) {
      case "taskName":
        setTaskName(value);
        break;
      case "taskDate":
        setTaskDate(value);
        break;
      case "taskPriority":
        setTaskPriority(value);
        break;
      case "taskDetails":
        setTaskDetails(value);
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Box align="center" marginTop="5rem">
        <Grid2>
          <Typography variant="h4" paddingBottom="2rem">
            Update Task
          </Typography>
        </Grid2>
        <Typography
          variant="caption"
          color={message.includes("Error") ? "error" : "green"}
        >
          {message}
        </Typography>
        <Form onSubmit={addTaskHandler}>
          <Grid2
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{ width: "40%" }}
          >
            <TextField
              name="taskName"
              id="taskName"
              label={taskDetails.taskName}
              value={taskName}
              onChange={onChangeHandler}
            />
            <TextField
              value={taskDate}
              type="date"
              name="taskDate"
              id="taskDate"
              onChange={onChangeHandler}
            />
            <TextField
              name="taskDetail"
              id="taskDetail"
              label={taskDetails.taskDetail}
              multiline
              minRows={5}
              value={taskDetail}
              onChange={onChangeHandler}
            />
            <Select
              name="taskPriority"
              id="taskPriority"
              value={taskPriority}
              onChange={onChangeHandler}
            >
              <MenuItem disabled value="Task Priority">
                Task Priority
              </MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
            <Button type="submit">Update Task</Button>
          </Grid2>
        </Form>
      </Box>
    </>
  );
}
