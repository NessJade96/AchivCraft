import { redirect } from "react-router-dom";

export async function action() {
  const logoutResponse = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (logoutResponse.ok) {
    return redirect("/login");
  }
  return logoutResponse;
}
