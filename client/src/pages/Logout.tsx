import { redirect } from "react-router-dom";

export async function action() {
  const logoutResponse = await fetch("http://localhost:3000/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("🚀 ~ action ~ logoutResponse:", logoutResponse);
  if (logoutResponse.ok) {
    return redirect("/login");
  }
  return logoutResponse;
}
