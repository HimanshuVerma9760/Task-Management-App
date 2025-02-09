import {
  Box,
  Button,
  Grid2,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { motion } from "motion/react";

import { useState, useEffect } from "react";
import { Form, useSubmit } from "react-router-dom";
import ModalContent from "./Modal/ModalContent";
import useAuth from "../util/hooks/useAuth";

export default function InputBox() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = await useAuth();
      if (!token.result) {
        setShowSignupPrompt(true);
      } else {
        setIsAuthenticated(true);
      }
    }
    checkAuth();
  }, []);

  const handleCloseSignupPrompt = () => {
    setShowSignupPrompt(false);
  };
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [taskPriority, setTaskPriority] = useState("Task Priority");

  const submit = useSubmit();
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    nameError: false,
    dateError: false,
    detailsError: false,
    priorityError: false,
  });

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

  const addTaskHandler = (event) => {
    event.preventDefault();
    const newErrors = {
      nameError: taskName.trim().length === 0,
      dateError: taskDate.trim().length === 0,
      detailsError: taskDetails.trim().length === 0,
      priorityError:
        taskPriority.trim().length === 0 || taskPriority === "Task Priority",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setMessage("Please fill out all fields correctly!");
    } else {
      setMessage("Task Added Successfully!");
      setTaskName("");
      setTaskDate("");
      setTaskDetails("");
      setTaskPriority("Task Priority");
      submit(event.target, { method: "POST" });
    }
  };

  return (
    <Box>
      {!isAuthenticated ? (
        <ModalContent
          isOpen={showSignupPrompt}
          onClose={handleCloseSignupPrompt}
          message={{
            message: "Sign Up Required",
            caption: "You need to sign up to add tasks.",
          }}
          btn={{ text: "Go to Sign up", loc: "/" }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0, transition: "1.8s" }}
        >
          <Box align="center">
            <Grid2>
              <Typography variant="h4">Add Task</Typography>
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
                  label="Task Name"
                  value={taskName}
                  error={errors.nameError}
                  helperText={errors.nameError && "Task Name is required"}
                  onChange={onChangeHandler}
                />
                <TextField
                  value={taskDate}
                  type="date"
                  name="taskDate"
                  id="taskDate"
                  error={errors.dateError}
                  helperText={errors.dateError && "Task Date is required"}
                  onChange={onChangeHandler}
                />
                <TextField
                  name="taskDetails"
                  id="taskDetails"
                  label="Task Details"
                  multiline
                  minRows={5}
                  value={taskDetails}
                  error={errors.detailsError}
                  helperText={
                    errors.detailsError && "Task Details are required"
                  }
                  onChange={onChangeHandler}
                />
                <Select
                  name="taskPriority"
                  id="taskPriority"
                  value={taskPriority}
                  error={errors.priorityError}
                  onChange={onChangeHandler}
                >
                  <MenuItem disabled value="Task Priority">
                    Task Priority
                  </MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
                <Button type="submit">Add Task</Button>
              </Grid2>
            </Form>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
