const Conn = import.meta.VITE_CONN_URI;
export const TasksLoader = async () => {
  const result = await fetch(`http://localhost:3000`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (result) {
    const response=await result.json();
    return response;
  } else {
    return result.message;
  }
};
