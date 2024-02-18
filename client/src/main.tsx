import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import { Home, loader as homeLoader } from "./pages/Home.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login, action as loginAction } from "./pages/Login.tsx";
import { Signup, action as signupAction } from "./pages/Signup.tsx";
import {
  Search,
  loader as searchLoader,
  action as searchAction,
} from "./pages/Search.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home name="Adam" last="Bloom" age={27} />,
    loader: homeLoader,
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction,
  },
  {
    path: "/Signup",
    element: <Signup />,
    action: signupAction,
  },
  {
    path: "/Search",
    element: <Search />,
    loader: searchLoader,
    action: searchAction,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
