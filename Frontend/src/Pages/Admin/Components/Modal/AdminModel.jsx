import React from "react";
import Portal from "./Portal";
import { Box, Button, Grid2, Typography } from "@mui/material";

const AdminModal = ({ isOpen, onClose, type, id }) => {
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
          Are you sure?
        </Typography>
        <Typography variant="caption" color="red">
          {type.message}
        </Typography>
        <Grid2 display="flex" justifyContent="center" sx={{marginTop:"1rem"}}>
          <Button onClick={() => type.func(id)}>Yes</Button>
          <Button onClick={() => onClose()}>Cancel</Button>
        </Grid2>
      </Box>
    </Portal>
  );
};

export default AdminModal;
