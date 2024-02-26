import { ActionFunctionArgs, redirect } from "react-router-dom";

export async function action({ request }: ActionFunctionArgs) {
  const characterResponse = await fetch("http://localhost:3000/achievement", {
    credentials: "include",
  });
  if (!characterResponse.ok) {
    return redirect("/login");
  }

  return characterResponse;
}
