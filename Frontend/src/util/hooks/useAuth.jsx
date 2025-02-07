export default async function useAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    return { result: false };
  }
  const response = await fetch(`http://localhost:3000/auth/${token}`);
  if (response.ok) {
    return { result: true };
  } else {
    return { result: false };
  }
}
