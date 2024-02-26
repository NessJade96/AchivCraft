import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import { Home, loader as homeLoader } from "./pages/Home.tsx";
import { action as followAction } from "./pages/Follow.tsx";
import { action as unfollowAction } from "./pages/Unfollow.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { action as achievementAction } from "./pages/Achievement.tsx";

import { Login, action as loginAction } from "./pages/Login.tsx";
import { action as logoutAction } from "./pages/Logout.tsx";
import { Signup, action as signupAction } from "./pages/Signup.tsx";
import { Search, loader as searchLoader } from "./pages/Search.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home />,
    loader: homeLoader,
  },
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
  {
    path: "/achievement",
    action: achievementAction,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
