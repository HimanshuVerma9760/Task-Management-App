import { AppBar, Box, Grid2, IconButton, Typography } from "@mui/material";
import {
  Help,
  AccountCircle,
  MessageSharp,
  Settings,
  TaskSharp,
  Home,
  AddTask,
} from "@mui/icons-material";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  return (
    <>
      <AppBar
        sx={{
          padding: "0.8rem",
          boxShadow: "none",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#3f51b5",
        }}
      >
        <Typography variant="h3">Task Manager</Typography>
        <Grid2 container sx={{ alignItems: "center" }}>
          <Typography
            variant="ul"
            sx={{ display: "flex", listStyle: "none", gap: "1rem" }}
          >
            <IconButton sx={{ color: "white" }}>
              <AccountCircle />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <Link to="/">
                <Home sx={{ color: "white" }} />
              </Link>
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <Help />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <MessageSharp />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <Settings />
            </IconButton>
            <IconButton >
              <Link to='/add-task-page' style={{color:"white"}}>
                <AddTask />
              </Link>
            </IconButton>
            <IconButton >
              <Link to='/my-task-list' style={{color:"white"}}>
                <TaskSharp />
              </Link>
            </IconButton>
          </Typography>
        </Grid2>
      </AppBar>
      <Box marginTop="7rem">
        <Outlet />
      </Box>
    </>
  );
}
