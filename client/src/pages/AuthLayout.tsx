import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Form, Outlet, redirect, useNavigation } from "react-router-dom";
import { useState } from "react";

export function AuthLayout() {
  const navigation = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-auto px-4 sm:hidden"
        >
          Menu
        </Button>
        <nav className="gap-2 hidden sm:flex">
          <ul className="flex">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
          </ul>
        </nav>
        <div className="p-6 ml-auto hidden gap-2 sm:flex">
          <Form method="POST" action="/logout">
            <Button>{buttonText}</Button>
          </Form>
        </div>
      </div>
      {isMenuOpen ? (
        <div className="bg-gray-100 border-r shadow-lg w-1/2 h-full absolute top-0 left-0">
          <nav className="gap-2 flex">
            <ul className="flex">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/search">Search</Link>
              </li>
            </ul>
          </nav>
          <div className="p-6 ml-auto  gap-2 flex">
            <Form method="POST" action="/logout">
              <Button>{buttonText}</Button>
            </Form>
          </div>
        </div>
      ) : null}
      <main className="max-w-2xl mx-auto ">
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
