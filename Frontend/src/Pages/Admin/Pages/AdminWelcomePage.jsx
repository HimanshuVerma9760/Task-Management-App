import { Box, Grid2, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function AdminWelcomePage() {
  return (
    <>
      <Box>
        <Grid2 sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Grid2 sx={{ marginBottom: "2rem" }}>
            <Typography variant="h2" align="center" color="#3f51b5">
              Welcome to Task Master!
            </Typography>
            <Typography variant="h5" align="center" color="green">
              We're thrilled to have you here!
            </Typography>
          </Grid2>
          <Grid2
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              gap: "1rem",
            }}
          >
            <Typography
              variant="h6"
              boxShadow=" 0px 0px 3px 0px"
              padding="1rem"
              sx={{ fontSize: "1.1rem", borderRadius: "10px" }}
            >
              Your ultimate companion for staying organized, productive, and
              stress-free! Whether you're managing daily tasks, big projects, or
              just keeping track of your goals, TaskMaster is here to make your
              life easier.
            </Typography>
            <Typography
              variant="h6"
              boxShadow=" 0px 0px 3px 0px"
              padding="1rem"
              sx={{ fontSize: "1.1rem", borderRadius: "10px" }}
            >
              With intuitive features like task prioritization, reminders, and
              progress tracking, you’ll never miss a deadline or forget an
              important task again.
            </Typography>
            <Typography
              variant="h6"
              boxShadow="0px 0px 3px 0px"
              padding="1rem"
              sx={{ fontSize: "1.1rem", borderRadius: "10px" }}
            >
              This Admin Console let you manage users of your application as you
              want! Ready to take control ?
              Your Admin journey begins here!
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
}
