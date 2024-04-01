import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Form, Outlet, redirect, useNavigation } from "react-router-dom";

export function AuthLayout() {
  const navigation = useNavigation();

  const buttonText =
    navigation.state === "submitting"
      ? "Logging out..."
      : navigation.state === "loading"
      ? "Logging out..."
      : "Logout";
  return (
    <>
      <div className="border flex items-center">
        <Text className="text-2xl font-semibold text-purple-800 text-center px-6">
          AchivCraft
        </Text>
        <nav>
          <ul className="flex">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
          </ul>
        </nav>
        <div className="p-6 ml-auto flex gap-2">
          <Form method="POST" action="/logout">
            <Button>{buttonText}</Button>
          </Form>
        </div>
      </div>
      <main className="max-w-2xl mx-auto">
        <Outlet></Outlet>
      </main>
    </>
  );
}

export const loader = async () => {
  const isLoggedIn = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
    credentials: "include",
  });

  if (!isLoggedIn.ok) {
    return redirect("/login");
  }
  return isLoggedIn;
};
