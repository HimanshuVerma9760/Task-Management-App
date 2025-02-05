import {
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
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";
export default function SignUpPage() {
  const check = useRef();
  check.current = false;
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
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

  const [message, setMessage] = useState("");
  const res = useRef();
  res.current = "";
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
      res.current = result.message;
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

  const onChangeHandler = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    switch (id) {
      case "userName":
        setUserName(value);
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

  const addUserHandler = () => {};
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0, transition: "1.8s" }}
      >
        <Box align="center">
          <Grid2>
            <Typography variant="h4" sx={{ marginBottom: "10px" }}>
              Sign Up
            </Typography>
          </Grid2>
          <Typography
            variant="caption"
            color={message.includes("Error") ? "error" : "green"}
          >
            {message}
          </Typography>
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
                label="User Name"
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
                        <CheckCircleOutline />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {isChecked && !errors.userNameError.state && (
                <Typography variant="caption" color="blue">
                  {res.current}
                </Typography>
              )}

              <TextField
                value={fullName}
                name="fullName"
                label="Full Name"
                id="fullName"
                error={errors.fullNameError.state}
                helperText={
                  errors.fullNameError.state && "Full Name is required"
                }
                onChange={onChangeHandler}
              />
              <TextField
                name="email"
                id="email"
                label="Enter Email"
                value={email}
                error={errors.emailError.state}
                helperText={errors.emailError.state && "Email is required"}
                onChange={onChangeHandler}
              />
              <TextField
                name="password"
                label="Enter Password"
                type={isVisible ? "text" : "password"}
                id="password"
                value={password}
                error={errors.passwordError.state}
                onChange={onChangeHandler}
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
                id="confirmPassword"
                value={confirmPassword}
                error={errors.confirmPasswordError.state}
                onChange={onChangeHandler}
              />
              <Button type="submit">Sign up</Button>
            </Grid2>
          </Form>
        </Box>
      </motion.div>
    </>
  );
}
