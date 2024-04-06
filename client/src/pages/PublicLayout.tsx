import { Text } from "../components/Text";
import { Link } from "../components/Link";
import { Outlet, redirect } from "react-router-dom";
import { Button } from "../components/Button";

export function PublicLayout() {
  return (
    <>
      <div className="border flex items-center px-4 py-2 sm:p-6">
        <Text className="text-2xl font-semibold text-purple-800 text-center ">
          AchivCraft
        </Text>
        <Button className="ml-auto px-4 sm:hidden">Menu</Button>
        <div className=" ml-auto gap-2 hidden sm:flex">
          <Link variant="text" to="/login">
            Log in
          </Link>
          <Link variant="button" to="/signup">
            Sign up
          </Link>
        </div>
      </div>
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
