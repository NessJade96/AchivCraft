import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
} from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Link } from "../components/Link";
import { Text } from "../components/Text";
import { FormItem } from "../components/FormItem";

export function Login() {
  const loginResponse = useActionData();
  console.log("🚀 ~ Login ~ loginResponse:", loginResponse);
  return (
    <>
      <div className="pt-40">
        <Text tag="h1">Log in to your account</Text>
      </div>
      <div className="py-8">
        <Text tag="h2">Welcome back! Please enter your details</Text>
      </div>
      <Form method="POST">
        <FormItem label="Email">
          <Input
            required
            type="email"
            name="email"
            defaultValue="vkellyy@gmail.com"
            //placeholder="Enter your email"
          />
        </FormItem>
        <FormItem label="Password">
          <Input
            required
            type="password"
            name="password"
            defaultValue="V_HHicBASx5_P2M"
            //placeholder="********"
          />
        </FormItem>
        {loginResponse === "Unauthorized" ? (
          <Text className="text-red-600 py-3">
            Incorrect email or password, please try again
          </Text>
        ) : null}
        <div className="py-6">
          <Button>Login</Button>
        </div>
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

  const loginResponse = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
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
    return redirect("/");
  }
  return loginResponse;
}
