import { Link, redirect, useFetcher, useLoaderData } from "react-router-dom";

export function Home() {
  const data: any = useLoaderData();
  const fetcher = useFetcher();
  return (
    <>
      <h1>Recent Achievements</h1>
      <Link to="/search">Search new characters to follow</Link>
      <p>
        Most recent achievement:{JSON.stringify(data[0].name)} completed by{" "}
        {JSON.stringify(data[0].character.name)} at{" "}
        {JSON.stringify(data[0].completed_timestamp)}
      </p>
      <p>{JSON.stringify(data)}</p>
      <fetcher.Form method="POST" action="/logout">
        <button>Logout</button>
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
