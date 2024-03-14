import { ActionFunctionArgs, Form, redirect } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Link } from "../components/Link";

export function Login() {
  return (
    <>
      <Form method="POST">
        <Input
          label="Email"
          required
          type="email"
          name="email"
          defaultValue="vkellyy@gmail.com"
          //placeholder="Enter your email"
        />

        <Input
          label="Password"
          required
          type="password"
          name="password"
          defaultValue="V_HHicBASx5_P2M"
          //placeholder="********"
        />

        <Button>Login</Button>
      </Form>
      <p className="text-center py-6 text-gray-500">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
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
