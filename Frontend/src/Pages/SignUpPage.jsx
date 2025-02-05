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
  Grid2,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "motion/react";
import { useState } from "react";
import { Form } from "react-router-dom";

export default function SignUpPage() {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState("");
  const [res, setRes] = useState("");
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

  async function checkUserName(userName) {
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
          if (!isNaN(element)) {
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
        console.log(value);
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
      console.log(message);
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
      setMessage("Signup Successfull");
    }
  };
  return (
    <>
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
                      <IconButton onClick={() => checkUserName(userName)}>
                        {!isChecked ? <CheckCircleOutline /> : <CheckCircle />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {isChecked && !errors.userNameError.state && (
                <Typography variant="caption" color="blue">
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
                        onClick={() => setIsVisible((prevState) => !prevState)}
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
    </>
  );
}
