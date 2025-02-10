import {
  CheckCircle,
  CheckCircleOutline,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
const Conn = import.meta.env.VITE_CONN_URI;
import {
  Box,
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
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import ModalContent from "../components/Modal/ModalContent";
import useAuth from "../util/hooks/useAuth";
// import CustomPaginationActionsTable from "../components/CustomPaginationActionsTable";
import WelcomePage from "./WelcomePage";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    async function checkAuth() {
      const verifiedUser = await useAuth();
      if (verifiedUser.result) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState("");
  const [res, setRes] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [errors, setErrors] = useState({
    userNameError: {
      state: false,
      message: "",
    },
    fullNameError: {
      state: false,
      message: "",
    },
    emailError: {
      state: false,
      message: "",
    },
    passwordError: {
      state: false,
      message: "",
    },
    confirmPasswordError: {
      state: false,
      message: "",
    },
  });

  const handleCloseSignupPrompt = () => {
    setShowSignupPrompt(false);
  };

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

  async function checkUserName(userName) {
    if (userName.trim().length === 0) {
      setErrors((prevState) => ({
        ...prevState,
        userNameError: {
          ...prevState.userNameError,
          state: true,
          message: "Invalid Name!!",
        },
      }));
      return;
    }
    const user = {
      userName: userName,
    };
    const response = await fetch(`http://localhost:3000/verify-user-name`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      setIsChecked(true);
      setRes(result.message);
      setErrors((prevState) => ({
        ...prevState,
        userNameError: {
          ...prevState.userNameError,
          state: false,
          message: "",
        },
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        userNameError: {
          ...prevState.userNameError,
          state: true,
          message: "User Name already exists!!",
        },
      }));
    }
  }

  const onBlurHandler = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    switch (id) {
      case "fullName":
        let nameArr = value.split("");
        for (let index = 0; index < nameArr.length; index++) {
          const element = nameArr[index];
          if (
            (!isNaN(element) && element !== " ") ||
            value.trim().length === 0
          ) {
            setErrors((prevState) => ({
              ...prevState,
              fullNameError: {
                ...prevState.fullNameError,
                state: true,
                message: "Invalid Name!!",
              },
            }));
            return;
          }
          setErrors((prevState) => ({
            ...prevState,
            fullNameError: {
              ...prevState.fullNameError,
              state: false,
              message: "",
            },
          }));
        }
        break;
      case "email":
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          setErrors((prevState) => ({
            ...prevState,
            emailError: {
              ...prevState.emailError,
              state: true,
              message: "Invalid email!",
            },
          }));
          return;
        }
        setErrors((prevState) => ({
          ...prevState,
          emailError: {
            ...prevState.emailError,
            state: false,
            message: "",
          },
        }));
        break;
      case "password":
        let passArr = value.split("");
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
        for (let index = 0; index < passArr.length; index++) {
          const element = passArr[index];
          if (element === " ") {
            setErrors((prevState) => ({
              ...prevState,
              passwordError: {
                ...prevState.passwordError,
                state: true,
                message: "Password must not contain spaces!",
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
        }
        break;
      case "confirmPassword":
        if (value !== password) {
          setErrors((prevState) => ({
            ...prevState,
            confirmPasswordError: {
              ...prevState.confirmPasswordError,
              state: true,
              message: "Password Mismatched!",
            },
          }));
          return;
        }
        setErrors((prevState) => ({
          ...prevState,
          confirmPasswordError: {
            ...prevState.confirmPasswordError,
            state: false,
            message: "",
          },
        }));
        break;
      default:
        break;
    }
  };

  const onChangeHandler = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    switch (id) {
      case "userName":
        setUserName(value);
        if (isChecked) {
          setRes("");
          setIsChecked(false);
        }
        break;
      case "fullName":
        setFullName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };
  const addUserHandler = async (event) => {
    event.preventDefault();
    if (
      errors.userNameError.state ||
      errors.fullNameError.state ||
      errors.emailError.state ||
      errors.confirmPasswordError.state ||
      errors.passwordError.state ||
      fullName.trim().length === 0 ||
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      confirmPassword !== password
    ) {
      setMessage("Error! Kindly Fill All Values Properly!!!");
      return;
    }
    const formData = {
      userName,
      fullName,
      email,
      password,
    };

    const response = await fetch("http://localhost:3000/add-user", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      setMessage("Error! while signup");
    } else {
      setMessage("Sign up Successfull");
      setShowSignupPrompt(true);
      setIsSignedUp(true);
    }
  };

  if (isSignedUp) {
    return (
      <>
        <ModalContent
          isOpen={showSignupPrompt}
          onClose={handleCloseSignupPrompt}
          message={{
            message: "Kindly verify your email!",
            caption: "Verification link has been sent to your email!",
          }}
          btn={{
            text: "Go to Log in",
            loc: "/user-login",
          }}
        />
      </>
    );
  }

  return (
    <>
      {!isLoading ? (
        isLoggedIn ? (
          <WelcomePage />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0, transition: "1.8s" }}
          >
            <Box align="center">
              <Grid2 sx={{ marginBottom: "1rem" }}>
                <Typography variant="h4" sx={{ marginBottom: "10px" }}>
                  Sign Up
                </Typography>
                <Typography
                  variant="caption"
                  color={message.includes("Error") ? "error" : "green"}
                >
                  {message}
                </Typography>
              </Grid2>
              <Form onSubmit={addUserHandler}>
                <Grid2
                  display="flex"
                  flexDirection="column"
                  gap={2}
                  sx={{ width: "40%" }}
                >
                  <TextField
                    name="userName"
                    id="userName"
                    autoFocus={true}
                    label="Choose a Username for yourself"
                    value={userName}
                    error={errors.userNameError.state}
                    helperText={
                      errors.userNameError.state && errors.userNameError.message
                    }
                    onChange={onChangeHandler}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <BootstrapTooltip title="Check Username availability!">
                            <IconButton
                              onClick={() => checkUserName(userName)}
                              sx={{ color: "#3f51b5" }}
                            >
                              {!isChecked ? (
                                <CheckCircleOutline />
                              ) : (
                                <CheckCircle />
                              )}
                            </IconButton>
                          </BootstrapTooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {isChecked && !errors.userNameError.state && (
                    <Typography variant="caption" color="#3f51b5">
                      {res}
                    </Typography>
                  )}

                  <TextField
                    value={fullName}
                    disabled={!isChecked}
                    name="fullName"
                    label="Full Name"
                    onBlur={onBlurHandler}
                    id="fullName"
                    error={errors.fullNameError.state}
                    helperText={
                      errors.fullNameError.state && errors.fullNameError.message
                    }
                    onChange={onChangeHandler}
                  />
                  <TextField
                    name="email"
                    disabled={!isChecked}
                    id="email"
                    onBlur={onBlurHandler}
                    label="Enter Email"
                    value={email}
                    error={errors.emailError.state}
                    helperText={
                      errors.emailError.state && errors.emailError.message
                    }
                    onChange={onChangeHandler}
                  />
                  <TextField
                    name="password"
                    disabled={!isChecked}
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
                            onClick={() =>
                              setIsVisible((prevState) => !prevState)
                            }
                            sx={{ color: "#3f51b5" }}
                            disabled={!isChecked}
                          >
                            {!isVisible ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    disabled={!isChecked}
                    id="confirmPassword"
                    value={confirmPassword}
                    error={errors.confirmPasswordError.state}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    helperText={
                      errors.confirmPasswordError.state &&
                      errors.confirmPasswordError.message
                    }
                  />
                  <Button disabled={!isChecked} type="submit">
                    Sign up
                  </Button>
                </Grid2>
              </Form>
            </Box>
          </motion.div>
        )
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </>
      )}
    </>
  );
}
