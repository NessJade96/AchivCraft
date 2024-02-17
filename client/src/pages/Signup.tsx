import {
  Link,
  ActionFunctionArgs,
  Form,
  useActionData,
} from "react-router-dom";

export function Signup() {
  const data = useActionData();
  return (
    <>
      <Form method="POST">
        <input
          required
          type="email"
          name="email"
          placeholder="Example@email.com"
        />
        <input
          required
          type="password"
          name="password"
          placeholder="New Password"
        />
        <button name="intent" value="Signup">
          Create Account
        </button>
      </Form>
      <Link to="/login">
        If you already have an account, click here to go to login page
      </Link>
      {JSON.stringify(data)}
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  fetch("http://localhost:3000/signup", {
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
  return null;
}
