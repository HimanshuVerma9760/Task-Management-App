import React from "react";
import Portal from "./Portal";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ModalContent = ({ isOpen, onClose, message, btn, type }) => {
  if (!isOpen) return null;

  function resendHandler() {
    console.log("resent");
  }

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
          {message.message}
        </Typography>
        <Typography variant="caption" color="red">
          {message.caption}
        </Typography>
        {!type ? (
          <Button>
            <Link to={btn.loc} style={{ textDecoration: "none" }}>
              {btn.text}
            </Link>
          </Button>
        ) : (
          <>
            <Button onClick={resendHandler}>Resend</Button>
          </>
        )}
      </Box>
    </Portal>
  );
};

export default ModalContent;
