import { ActionFunctionArgs, Form, Link, redirect } from "react-router-dom";

export function Login() {
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
        <button>Login</button>
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
  const email = formData.get("email");
  const password = formData.get("password");

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
  if (loginResponse.ok) {
    return redirect("/home");
  }
  return loginResponse;
}
