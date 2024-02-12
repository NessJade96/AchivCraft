import { ActionFunctionArgs, Form, useActionData } from "react-router-dom";

export function Login() {
  const data = useActionData();

  return (
    <Form method="POST">
      <input type="text" name="userName" />
      <button name="intent" value="Login">
        Login
      </button>
      <p>{data?.ping ? "true" : "false"}</p>
    </Form>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const response = await fetch("http://localhost:3000/ping");
  const responseJSON = await response.json();
  console.log(responseJSON);
  return new Response(JSON.stringify(responseJSON), {
    headers: { "Content-Type": "application/json" },
  });
}
