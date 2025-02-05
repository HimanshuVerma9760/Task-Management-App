import Header from "./components/Header";
import InputBox from "./components/InputBox";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TaskDetailPage from "./Pages/TaskDetailPage";
import { TasksLoader } from "./util/TasksLoader";
import { AddTaskAction } from "./util/AddTaskAction";
import { TaskDetailLoader } from "./util/TaskDetailLoader";
// import MyTaskList from "./Pages/MyTaskListPage";
import CustomPaginationActionsTable from "./components/CustomPaginationActionsTable";
import SignUpPage from "./Pages/SignUpPage";
// import { UpdateTaskAction } from "./util/UpdateTaskAction";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
      children: [
        {
          path: "/",
          element: <SignUpPage />,
        },
        {
          path: "/add-task-page",
          action: AddTaskAction,
          loader: TasksLoader,
          element: <InputBox />,
        },
        {
          path: "/taskDetailPage/:id",
          loader: TaskDetailLoader,
          element: <TaskDetailPage />,
        },
        {
          path: "/my-task-list",
          element: <CustomPaginationActionsTable />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
