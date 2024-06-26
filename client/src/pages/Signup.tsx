import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Text } from "../components/Text";
import { FormItem } from "../components/FormItem";

export function Signup() {
  const data = useActionData();
  const navigation = useNavigation();

  const buttonText =
    navigation.state === "submitting"
      ? "Creating..."
      : navigation.state === "loading"
      ? "Created!"
      : "Create Account";
  return (
    <>
      <div className="pt-40">
        <Text tag="h1">Sign up to create an account</Text>
      </div>
      <div className="py-8">
        <Text tag="h2">Want to join? Please enter your details.</Text>
      </div>
      <Form method="POST">
        <FormItem label="Email">
          <Input
            required
            type="email"
            name="email"
            placeholder="Example@email.com"
          />
        </FormItem>
        <FormItem label="Password">
          <Input
            required
            type="password"
            name="password"
            placeholder="New Password"
          />
        </FormItem>

        <div className="py-6">
          <Button>{buttonText}</Button>
        </div>
      </Form>
      <p className="text-center py-6 text-gray-500">
        If you already have an account?
        <Link to="/login">Log in</Link>
      </p>
      {JSON.stringify(data)}
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const signupResponse = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
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
  if (signupResponse.ok) {
    return redirect("/");
  }
  return signupResponse;
}
