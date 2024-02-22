import { ActionFunctionArgs } from "react-router-dom";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const followId = formData.get("followId");

  return fetch("http://localhost:3000/unfollow", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      followId,
    }),
  });
}
