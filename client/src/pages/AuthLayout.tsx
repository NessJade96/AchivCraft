import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Form, Outlet } from "react-router-dom";

export function AuthLayout() {
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
          <Link variant="text" to="/login">
            Log in
          </Link>
          <Link variant="button" to="/signup">
            Sign up
          </Link>
          <Form method="POST" action="/logout">
            <Button>Logout</Button>
          </Form>
        </div>
      </div>
      <main className="max-w-2xl mx-auto">
        <Outlet></Outlet>
      </main>
    </>
  );
}
