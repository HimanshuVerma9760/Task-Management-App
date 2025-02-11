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
import WelcomePage from "./Pages/WelcomePage";
import UserProfileLoader from "./util/UserProfileLoader";
import AdminWelcomePage from "./Pages/Admin/Pages/AdminWelcomePage";
import AdminHeader from "./Pages/Admin/Components/AdminHeader";
import AddUser from "./Pages/Admin/Pages/AddUser";
import RemoveBlockUser from "./Pages/Admin/Pages/RemoveBlockUser";

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
          path: "/user-profile/",
          loader: UserProfileLoader,
          element: <UserProfilePage />,
        },
        {
          path: "/welcome-user",
          element: <WelcomePage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminHeader />,
      children: [
        {
          path: "/admin",
          element: <AdminWelcomePage />,
        },
        {
          path: "add-user",
          element: <AddUser />,
        },
        {
          path: "remove-block-user",
          element: <RemoveBlockUser />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
