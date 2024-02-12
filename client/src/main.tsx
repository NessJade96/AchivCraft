import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import { Home } from "./pages/Home.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login, action as loginAction } from "./pages/Login.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home name="Adam" last="Bloom" age={27} />,
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
