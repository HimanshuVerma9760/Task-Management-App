export default async function useAdminAuth() {
  const token = localStorage.getItem("token");
  if (token) {
    const response = await fetch(`http://localhost:3000/admin/auth/${token}`);
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      return { response: false };
    }
  } else {
    return { response: false };
  }
}
