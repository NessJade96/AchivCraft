import { ActionFunctionArgs, Form, useActionData } from "react-router-dom";

export function Login() {
  const data = useActionData();
  console.log("🚀 ~ Login ~ data:", data);
  const totalPoints = data?.total_points;
  return (
    <>
      <Form method="POST">
        <input type="text" name="userName" />
        <button name="intent" value="login">
          Login
        </button>
        <p>{data?.ping ? "true" : "false"}</p>
        <p>{data?.success ? "true" : "false"}</p>
      </Form>
      <Form method="POST">
        <button name="intent" value="getCharacterAchievements">
          Character Achievements
        </button>
        <p>{data ? `Total points: ${totalPoints}` : ""}</p>
      </Form>
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intentFormData = formData.get("intent");
  const cookie = request.headers.getSetCookie();
  console.log("cookie", cookie);
  if (intentFormData === "login") {
    return fetch("http://localhost:3000/login", {
      credentials: "include",
    });
  } else if (intentFormData === "getCharacterAchievements") {
    return fetch("http://localhost:3000/profile/wow/character", {
      credentials: "include",
    });
  }
  return null;
}
