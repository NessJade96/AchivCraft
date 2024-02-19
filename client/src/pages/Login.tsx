import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useActionData,
} from "react-router-dom";

export function Login() {
  const data = useActionData();
  return (
    <>
      <Form method="POST">
        <input
          required
          type="email"
          name="email"
          defaultValue="vkellyy@gmail.com"
        />
        <input
          required
          type="password"
          name="password"
          defaultValue="V_HHicBASx5_P2M"
        />
        <button name="intent" value="login">
          Login
        </button>
      </Form>
      <Form method="POST">
        <button name="intent" value="getCharacterAchievements">
          Character Achievements
        </button>
      </Form>
      <Link to="/signup">Create Account?</Link>
      {
        //JSON.stringify(data)
      }
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const email = formData.get("email");
  const password = formData.get("password");

  if (intent === "login") {
    const loginResponse = await fetch("http://localhost:3000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    console.log("🚀 ~ action ~ loginResponse:", loginResponse);
    if (loginResponse.ok) {
      return redirect("/home");
    }
    return loginResponse;
  } else if (intent === "getCharacterAchievements") {
    return fetch("http://localhost:3000/profile/wow/character/achievement", {
      credentials: "include",
    });
  }
  return null;
}
