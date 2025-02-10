import {
  AppBar,
  Box,
  Grid2,
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  TaskSharp,
  Home,
  AddTask,
  Login,
  Logout,
} from "@mui/icons-material";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../util/hooks/useAuth";

export default function Header() {
  const nav = useNavigate();
  const navigation = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const verifiedUser = await useAuth();
      if (verifiedUser.result) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("token");
      }
    }
    checkLogin();
  }, [navigation.pathname]);

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));

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
            {isLoggedIn && (
              <LightTooltip title="Profile">
                <IconButton sx={{ color: "white" }}>
                  <Link to="/user-profile">
                    <AccountCircle sx={{ color: "white" }} />
                  </Link>
                </IconButton>
              </LightTooltip>
            )}

            <LightTooltip title="Home">
              <IconButton sx={{ color: "white" }}>
                <Link to={isLoggedIn ? "/welcome-user" : "/"}>
                  <Home sx={{ color: "white" }} />
                </Link>
              </IconButton>
            </LightTooltip>
            <LightTooltip title="Add Task">
              <IconButton>
                <Link to="/add-task-page" style={{ color: "white" }}>
                  <AddTask />
                </Link>
              </IconButton>
            </LightTooltip>
            <LightTooltip title="Your Tasks">
              <IconButton>
                <Link to="/my-task-list" style={{ color: "white" }}>
                  <TaskSharp />
                </Link>
              </IconButton>
            </LightTooltip>
            <LightTooltip title="Login">
              <IconButton>
                <Link to="/user-login" style={{ color: "white" }}>
                  <Login />
                </Link>
              </IconButton>
            </LightTooltip>
            {isLoggedIn && (
              <LightTooltip title="Logout">
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    nav("/user-login");
                  }}
                >
                  <div>
                    <Logout />
                  </div>
                </IconButton>
              </LightTooltip>
            )}
          </Typography>
        </Grid2>
      </AppBar>
      <Box marginTop="7rem">
        <Outlet />
      </Box>
    </>
  );
}
