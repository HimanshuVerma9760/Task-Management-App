import {
  Block,
  Home,
  Logout,
  People,
  PersonAdd,
  PersonRemove,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  CircularProgress,
  Grid2,
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAdminAuth from "../../../util/hooks/useAdminAuth";
import ModalContent from "../../../components/Modal/ModalContent";

export default function AdminHeader() {
  const nav = useNavigate();
  const path = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
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

  useEffect(() => {
    async function checkAuth() {
      const verifyingUser = localStorage.getItem("token");
      if (verifyingUser) {
        const verifyToken = await useAdminAuth();
        console.log("verifying token: ", verifyToken);
        if (!verifyToken.response) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setShowSignupPrompt(true);
        }
      } else {
        setShowSignupPrompt(true);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [path.pathname]);

  const handleCloseSignupPrompt = () => {
    setShowSignupPrompt(false);
  };
  if (!isLoggedIn) {
    return (
      <>
        <ModalContent
          isOpen={showSignupPrompt}
          onClose={handleCloseSignupPrompt}
          message={{
            message: "Kindly Login",
            caption:
              "You can only access this part of the site by logging in as an Admin!",
          }}
          btn={{
            text: "Go to Log in",
            loc: "/user-login",
          }}
        />
      </>
    );
  }
  if (isLoading) {
    return (
      <>
        <Typography align="center">
          <CircularProgress />
        </Typography>
      </>
    );
  }
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
        <Grid2>
          <Typography variant="h3">Welcome Admin</Typography>
        </Grid2>
        <Grid2 container sx={{ alignItems: "center", gap: "1rem" }}>
          <LightTooltip title="Home">
            <IconButton>
              <Link to="/admin" style={{ color: "white" }}>
                <Home />
              </Link>
            </IconButton>
          </LightTooltip>
          <LightTooltip title="Add User">
            <IconButton>
              <Link to="add-user" style={{ color: "white" }}>
                <PersonAdd />
              </Link>
            </IconButton>
          </LightTooltip>
          <LightTooltip title="Remove User">
            <IconButton>
              <Link to="remove-block-user" style={{ color: "white" }}>
                <PersonRemove />
              </Link>
            </IconButton>
          </LightTooltip>
          <LightTooltip title="Blocked Users">
            <IconButton>
              <Link style={{ color: "white" }}>
                <Block />
              </Link>
            </IconButton>
          </LightTooltip>
          <LightTooltip title="Logout">
            <IconButton
              onClick={() => {
                localStorage.removeItem("token");
                nav("/user-login");
              }}
            >
              <Link style={{ color: "white" }}>
                <Logout />
              </Link>
            </IconButton>
          </LightTooltip>
        </Grid2>
      </AppBar>

      <Box sx={{ marginTop: "6.3rem" }}>
        <Outlet />
      </Box>
    </>
  );
}
