import React, { useState } from "react";
const Conn = import.meta.VITE_CONN_URI;
import {
  Box,
  CssBaseline,
  Grid,
  Typography,
  Paper,
  Button,
  Drawer,
} from "@mui/material";
import { useLoaderData } from "react-router-dom";
import UpdateTaskPage from "./UpdateTaskPage";

const TaskDetailPage = () => {
  const [drawer, toggleDrawer] = useState(false);
  const loaderData = useLoaderData() || {};
  const [taskDetails, setTaskDetails] = useState(loaderData);

  const formatDate = (dateString) => {
    return dateString ? dateString.split("T")[0] : "N/A";
  };

  const onDeleteHandler = async (id) => {
    setTaskDetails("");
    const response = await fetch(`http://localhost:3000/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.log("Failed to delete");
    } else {
      console.log("Deleted successfully");
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTaskDetails(updatedTask);
  };

  if (taskDetails.length === 0) {
    return (
      <>
        <Typography variant="h4" align="center">
          Task Deleted
        </Typography>
      </>
    );
  }

  return (
    <Box
      sx={{
        padding: "2rem",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        minHeight: "100vh",
      }}
    >
      <Drawer open={drawer} onClose={() => toggleDrawer(false)}>
        <Box width="50rem">
          <UpdateTaskPage
            taskDetails={taskDetails}
            onTaskUpdate={handleTaskUpdate}
          />
        </Box>
      </Drawer>

      <CssBaseline />
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper
            elevation={6}
            sx={{
              backgroundColor: "white",
              padding: "3rem",
              borderRadius: "20px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                color: "#3f51b5",
                fontWeight: "bold",
                marginBottom: "2rem",
                textTransform: "uppercase",
              }}
            >
              Task Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    padding: "1.5rem",
                    backgroundColor: "#f0f4ff",
                    borderRadius: "10px",
                    transition: "background-color 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#e0e8ff",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "#3f51b5", fontWeight: "bold" }}
                  >
                    Name
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#555", marginTop: "0.5rem" }}
                  >
                    {taskDetails.taskName || "N/A"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    padding: "1.5rem",
                    backgroundColor: "#f0f4ff",
                    borderRadius: "10px",
                    transition: "background-color 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#e0e8ff",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "#3f51b5", fontWeight: "bold" }}
                  >
                    Date
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#555", marginTop: "0.5rem" }}
                  >
                    {formatDate(taskDetails.taskDate)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    padding: "1.5rem",
                    backgroundColor: "#f0f4ff",
                    borderRadius: "10px",
                    transition: "background-color 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#e0e8ff",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "#3f51b5", fontWeight: "bold" }}
                  >
                    Priority
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#555", marginTop: "0.5rem" }}
                  >
                    {taskDetails.taskPriority || "N/A"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid display="flex" justifyContent="center" marginTop="10px">
              <Button onClick={() => toggleDrawer(true)}>Update</Button>
              <Button onClick={() => onDeleteHandler(taskDetails._id)}>
                Delete
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={6}
            sx={{
              backgroundColor: "white",
              padding: "3rem",
              borderRadius: "20px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                color: "#3f51b5",
                fontWeight: "bold",
                marginBottom: "2rem",
                textTransform: "uppercase",
              }}
            >
              Details
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{
                color: "#555",
                lineHeight: "1.8",
                fontSize: "1.1rem",
              }}
            >
              {taskDetails.taskDetail || "No details available."}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskDetailPage;
