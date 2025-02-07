import Header from "./components/Header";
import InputBox from "./components/InputBox";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TaskDetailPage from "./Pages/TaskDetailPage";
import { TasksLoader } from "./util/TasksLoader";
import { AddTaskAction } from "./util/AddTaskAction";
import { TaskDetailLoader } from "./util/TaskDetailLoader";
import CustomPaginationActionsTable from "./components/CustomPaginationActionsTable";
import SignUpPage from "./Pages/SignUpPage";
import UserLoginPage from "./Pages/UserLoginPage";
import UserProfilePage from "./Pages/UserProfilePage";

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
          path: "/user-login",
          element: <UserLoginPage />,
        },
        {
          path: "/my-task-list",
          element: <CustomPaginationActionsTable />,
        },
        {
          path: "/user-profile",
          element: <UserProfilePage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
