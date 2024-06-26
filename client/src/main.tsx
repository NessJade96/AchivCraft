import React from "react";
import ReactDOM from "react-dom/client";
import { Home, loader as homeLoader } from "./pages/Home.tsx";
import { action as followAction } from "./pages/Follow.tsx";
import { action as unfollowAction } from "./pages/Unfollow.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login, action as loginAction } from "./pages/Login.tsx";
import { action as logoutAction } from "./pages/Logout.tsx";
import { Signup, action as signupAction } from "./pages/Signup.tsx";
import { Search, loader as searchLoader } from "./pages/Search.tsx";
import { AuthLayout, loader as authLoader } from "./pages/AuthLayout.tsx";
import { PublicLayout, loader as publicLoader } from "./pages/PublicLayout.tsx";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    loader: authLoader,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: homeLoader,
        index: true,
      },
      {
        path: "/search",
        element: <Search />,
        loader: searchLoader,
      },
      {
        path: "/follow",
        action: followAction,
      },
      {
        path: "/unfollow",
        action: unfollowAction,
      },
      {
        path: "/logout",
        action: logoutAction,
      },
    ],
  },
  {
    element: <PublicLayout />,
    loader: publicLoader,
    children: [
      {
        path: "/login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "/signup",
        element: <Signup />,
        action: signupAction,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
