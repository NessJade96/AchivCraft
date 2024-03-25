import { redirect, useFetcher, useLoaderData } from "react-router-dom";
import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Card } from "../components/Card";

export function Home() {
  const data: any = useLoaderData();
  const fetcher = useFetcher();
  return (
    <>
      <Text tag="h1">Recent Achievements</Text>
      <Link to="/search">Search new characters to follow</Link>
      <Card
        achievementName={JSON.stringify(data[0].name)}
        characterName={JSON.stringify(data[0].character.name)}
        completedTimestamp={JSON.stringify(data[0].completed_timestamp)}
      />
      <p>{JSON.stringify(data)}</p>
      <fetcher.Form method="POST" action="/logout">
        <Button>Logout</Button>
      </fetcher.Form>
    </>
  );
}

export const loader = async () => {
  const characterResponse = await fetch(
    `${import.meta.env.VITE_API_URL}/character/achievement`,
    {
      credentials: "include",
    }
  );
  if (!characterResponse.ok) {
    return redirect("/login");
  }
  console.log("characterResponse", characterResponse);
  return characterResponse;
};
