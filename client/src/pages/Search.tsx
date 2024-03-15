import {
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useFetcher,
} from "react-router-dom";

export function Search() {
  const data: any = useLoaderData();
  const fetcher = useFetcher();
  return (
    <>
      <Form method="GET">
        <label>
          Select a realm:
          <select required name="realmSlug">
            <option value="frostmourne">Frostmourne</option>
            <option value="silver-hand">Silver Hand</option>
          </select>
        </label>
        <label>
          Characters Name:
          <input
            required
            type="text"
            name="characterName"
            //placeholder="Name"
            defaultValue="astraxi"
          />
        </label>
        <button name="intent" value="search">
          Search
        </button>
      </Form>
      {data ? (
        <>
          <h3>Search Results:</h3>
          <ul>
            <li>Realm: {data.realmSlug}</li>
            <li>Name: {data.name}</li>
            <li>Faction: {data.faction}</li>
            <li>Race: {data.race}</li>
            <li>Class: {data.class}</li>
            <li>Achievement Points: {data.achievementPoints}</li>
          </ul>
          {data.isFollowing ? (
            <fetcher.Form method="POST" action="/unfollow">
              <button>Unfollow {data.name}</button>
              <input name="followId" value={data.followId} type="hidden" />
            </fetcher.Form>
          ) : (
            <fetcher.Form method="POST" action="/follow">
              <button>Follow {data.name}</button>
              <input name="id" value={data.id} type="hidden" />
              <input name="name" value={data.name} type="hidden" />
              <input name="faction" value={data.faction} type="hidden" />
              <input name="race" value={data.race} type="hidden" />
              <input name="class" value={data.class} type="hidden" />
              <input
                name="achievementPoints"
                value={data.achievementPoints}
                type="hidden"
              />
              <input name="realmSlug" value={data.realmSlug} type="hidden" />
            </fetcher.Form>
          )}
        </>
      ) : null}
      <Link to="/">Back to home</Link>
      <pre style={{ textAlign: "left" }}>
        {JSON.stringify(data, undefined, 2)}
      </pre>
    </>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const hasRequiredKeys =
    params.has("realmSlug") && params.has("characterName");

  if (hasRequiredKeys) {
    const searchResponse = await fetch(
      `http://localhost:3000/search${url.search}`,
      {
        credentials: "include",
      }
    );
    if (!searchResponse.ok) {
      return redirect("/login");
    }
    console.log(searchResponse);
    return searchResponse;
  }
  return null;
};
