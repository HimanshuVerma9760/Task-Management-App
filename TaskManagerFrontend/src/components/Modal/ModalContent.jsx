import React from "react";
import Portal from "./Portal";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ModalContent = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Portal onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "1rem",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "10px" }}>
          Sign Up Required
        </Typography>
        <Typography variant="caption" color="red">
          You need to sign up to add tasks.
        </Typography>
        <Button>
          <Link to="/" style={{ textDecoration: "none" }}>
            Go to Signup
          </Link>
        </Button>
      </Box>
    </Portal>
  );
};

export default ModalContent;
