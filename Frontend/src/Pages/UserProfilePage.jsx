import { Typography } from "@mui/material";
import { useLoaderData } from "react-router-dom";

export default function UserProfilePage() {
  const profile=useLoaderData();
  console.log(profile);
  return (
    <>
      <Typography variant="h5" color="green" align="center">
        Profile..
      </Typography>
    </>
  );
}
