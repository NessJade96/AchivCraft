import { Text } from "../components/Text";
import { Link } from "../components/Link";
import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <>
      <div className="border flex items-center">
        <Text className="text-2xl font-semibold text-purple-800 text-center px-6">
          AchivCraft
        </Text>
        <div className="p-6 ml-auto flex gap-2">
          <Link variant="text" to="/login">
            Log in
          </Link>
          <Link variant="button" to="/signup">
            Sign up
          </Link>
        </div>
      </div>
      <main className="max-w-2xl mx-auto">
        <Outlet></Outlet>
      </main>
    </>
  );
}
