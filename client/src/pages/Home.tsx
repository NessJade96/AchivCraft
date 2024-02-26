import {
  Link,
  LoaderFunctionArgs,
  redirect,
  useFetcher,
  useLoaderData,
} from "react-router-dom";

export function Home() {
  const data: any = useLoaderData();
  const fetcher = useFetcher();
  return (
    <>
      <h1>Recent Achievements</h1>
      <fetcher.Form method="POST" action="/achievement">
        <button>Load Achievements</button>
      </fetcher.Form>
      <Link to="/search">Search new characters to follow</Link>
      <p>{data.total_points}</p>
      <p>{JSON.stringify(data.achievements[0])}</p>

      {JSON.stringify(data.total_points)}
      <fetcher.Form method="POST" action="/logout">
        <button>Logout</button>
      </fetcher.Form>
    </>
  );
}

export const loader = async () => {
  const characterResponse = await fetch(
    "http://localhost:3000/character/achievement",
    {
      credentials: "include",
    }
  );
  if (!characterResponse.ok) {
    return redirect("/login");
  }

  return characterResponse;
};
