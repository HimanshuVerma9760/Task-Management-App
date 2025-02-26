import useAuth from "./hooks/useAuth";

const Conn = import.meta.VITE_CONN_URI;
export const AddTaskAction = async ({ request }) => {
  const verified = await useAuth();
  if (verified.result) {
    const token = localStorage.getItem("token");
    const task = await request.formData();
    const data = {
      taskName: task.get("taskName"),
      taskDate: task.get("taskDate"),
      taskDetail: task.get("taskDetails"),
      taskPriority: task.get("taskPriority"),
    };
    const result = await fetch(`http://localhost:3000/add/${token}`, {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result) {
      return result;
    } else {
      return { message: "Some error ocured in the backend!" };
    }
  } else {
    return { message: "Some error ocured in the backend!" };
  }
};
