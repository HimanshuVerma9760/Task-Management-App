import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid2,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import useAuth from "../util/hooks/useAuth";
import ModalContent from "../components/Modal/ModalContent";

export default function UserLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const verifiedUser = await useAuth();
      if (verifiedUser.result) {
        setIsLoggedIn(true);
        setShowSignupPrompt(true);
      } else {
        localStorage.removeItem("token");
      }
    }
    checkLogin();
  }, []);

  const [errors, setErrors] = useState({
    userNameError: {
      state: false,
      message: "",
    },
    passwordError: {
      state: false,
      message: "",
    },
  });
  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));
  function onChangeHandler(event) {
    const id = event.target.id;
    const value = event.target.value;

    switch (id) {
      case "userName":
        setUserName(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  }

  function onBlurHandler(event) {
    const id = event.target.id;
    const value = event.target.value;

    switch (id) {
      case "password":
        if (value.length < 8) {
          setErrors((prevState) => ({
            ...prevState,
            passwordError: {
              ...prevState.passwordError,
              state: true,
              message: "Password must be atleast 8 character long!",
            },
          }));
          return;
        }
        setErrors((prevState) => ({
          ...prevState,
          passwordError: {
            ...prevState.passwordError,
            state: false,
            message: "",
          },
        }));
        break;
      case "userName":
        if (value.trim().length === 0) {
          setErrors((prevState) => ({
            ...prevState,
            userNameError: {
              ...prevState.userNameError,
              state: true,
              message: "Invalid Username!",
            },
          }));
          return;
        }
        setErrors((prevState) => ({
          ...prevState,
          userNameError: {
            ...prevState.userNameError,
            state: false,
            message: "",
          },
        }));
    }
  }
  async function onSubmitHandler(event) {
    event.preventDefault();
    if (
      errors.userNameError.state ||
      errors.passwordError.state ||
      password.trim().length === 0
    ) {
      setMessage("Error! Kindly Fill All Values Properly!!!");
      console.log(message);
      return;
    }
    setIsLoading(true);
    const formData = {
      userName,
      password,
    };
    const response = await fetch("http://localhost:3000/user-login", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const result = await response.json();
      if (result.response !== "not verified") {
        localStorage.setItem("token", result.token);
        nav("/welcome-user");
      } else {
        setShowSignupPrompt(true);
        setIsVerified(false);
      }
    } else {
      setMessage("Invalid Credentials");
    }
    setIsLoading(false);
  }
  async function adminSubmitHandler() {
    if (
      errors.userNameError.state ||
      errors.passwordError.state ||
      password.trim().length === 0
    ) {
      setMessage("Error! Kindly Fill All Values Properly!!!");
      console.log(message);
      return;
    }
    const formData = {
      userName,
      password,
    };
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/admin/admin-login", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const result = await response.json();
      if (result.response !== "not verified") {
        localStorage.setItem("token", result.token);
        nav("/admin");
      } else {
        setShowSignupPrompt(true);
        setIsVerified(false);
      }
    } else {
      setMessage("Invalid Credentials");
    }
    setIsLoading(false);
  }

  const handleCloseSignupPrompt = () => {
    setShowSignupPrompt(false);
  };
  if (isLoggedIn) {
    return (
      <ModalContent
        isOpen={showSignupPrompt}
        onClose={handleCloseSignupPrompt}
        message={{
          message: "Kindly Logout",
          caption: "You need to logout to login again.",
        }}
        btn={{ text: "Tasks", loc: "/my-task-list" }}
      />
    );
  }
  if (!isVerified) {
    return (
      <ModalContent
        isOpen={showSignupPrompt}
        onClose={handleCloseSignupPrompt}
        message={{
          message: "Kindly Verify your Email first!",
          caption: "You need to verify to login.",
        }}
        btn={{ text: "Resend", loc: null }}
        type="btn"
      />
    );
  }
  return (
    <>
      <Form onSubmit={onSubmitHandler}>
        <Grid2
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "50%",
            margin: "auto",
            gap: "1rem",
          }}
        >
          <Typography variant="h4" align="center">
            Login
          </Typography>
          <Typography variant="caption" color="red" align="center">
            {isLoading ? <CircularProgress /> : message}
          </Typography>
          <TextField
            name="userName"
            id="userName"
            onBlur={onBlurHandler}
            label="Enter Username"
            value={userName}
            error={errors.userNameError.state}
            helperText={
              errors.userNameError.state && errors.userNameError.message
            }
            onChange={onChangeHandler}
          />
          <TextField
            name="password"
            label="Enter Password"
            type={isVisible ? "text" : "password"}
            id="password"
            value={password}
            error={errors.passwordError.state}
            helperText={
              errors.passwordError.state && errors.passwordError.message
            }
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setIsVisible((prevState) => !prevState)}
                  >
                    {!isVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Grid2
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "right",
              gap: "1rem",
            }}
          >
            <Button
              type="submit"
              sx={{
                paddingLeft: "1rem",
                paddingRight: "1rem",
                textAlign: "center",
              }}
            >
              User Login
            </Button>
            <BootstrapTooltip title="Only for Admins">
              <Button
                onClick={adminSubmitHandler}
                sx={{
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  textAlign: "center",
                }}
              >
                Admin Login
              </Button>
            </BootstrapTooltip>
          </Grid2>
        </Grid2>
      </Form>
    </>
  );
}
