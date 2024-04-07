import { Text } from "../components/Text";
import { Link } from "../components/Link";
import { Outlet, redirect } from "react-router-dom";
import { Button } from "../components/Button";
import { useState } from "react";

export function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <div className="border flex items-center px-4 py-2 sm:p-6">
        <Text className="text-2xl font-semibold text-purple-800 text-center ">
          AchivCraft
        </Text>
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-auto px-4 sm:hidden"
        >
          Menu
        </Button>
        <div className=" ml-auto gap-2 hidden sm:flex">
          <Link variant="text" to="/login">
            Log in
          </Link>
          <Link variant="button" to="/signup">
            Sign up
          </Link>
        </div>
      </div>
      {isMenuOpen ? (
        <div
          className="bg-black bg-opacity-30 sm:hidden fixed h-full w-full top-0 left-0"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="bg-gray-100 border-r shadow-lg w-3/4 max-w-[240px] top-0 rounded-r left-0 flex flex-col h-full">
            <Text className="text-2xl font-semibold text-purple-800 text-center p-6">
              AchivCraft
            </Text>
            <nav className="gap-2 flex">
              <ul className="flex flex-col">
                <li className="px-2 py-3">
                  <Link variant="text" to="/login">
                    Log in
                  </Link>
                </li>
                <li className="px-2 py-3">
                  <Link variant="button" to="/signup">
                    Sign up
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
      <main className="max-w-2xl mx-auto px-4 ">
        <Outlet></Outlet>
      </main>
    </>
  );
}

export const loader = async () => {
  const isLoggedIn = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
    credentials: "include",
  });

  if (isLoggedIn.ok) {
    return redirect("/");
  }
  return isLoggedIn;
};
