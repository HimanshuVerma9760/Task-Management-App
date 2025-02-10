import useAuth from "./hooks/useAuth";

export default async function UserProfileLoader() {
  const verifyToken = await useAuth();
  if (verifyToken.result) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3000/get-user-profile/${token}`
    );
    if (response.ok) {
      const { decodedToken } = await response.json();
      return decodedToken;
    }
  }
}
