import {
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useFetcher,
} from "react-router-dom";
import { Input } from "../components/Input";
import { Text } from "../components/Text";
import { FormItem } from "../components/FormItem";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { Link } from "../components/Link";

export function Search() {
  const data: any = useLoaderData();
  const fetcher = useFetcher();
  return (
    <div className="px-80">
      <div className="pt-40">
        <Text tag="h1">Search characters</Text>
      </div>
      <div className="py-8">
        <Text tag="h2">
          Follow your frineds by entering their charcter details below
        </Text>
      </div>
      <Form method="GET">
        <FormItem label="Select a realm:">
          <Select required name="realmSlug">
            <option value="frostmourne">Frostmourne</option>
            <option value="silver-hand">Silver Hand</option>
          </Select>
        </FormItem>
        <FormItem label="Characters Name:">
          <Input
            required
            type="text"
            name="characterName"
            //placeholder="Name"
            defaultValue="astraxi"
          />
        </FormItem>

        <div className="py-6">
          <Button name="intent" value="search">
            Search
          </Button>
        </div>
      </Form>
      {data ? (
        <div>
          <Text tag="h2">Search Results:</Text>
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
              <Button>Unfollow {data.name}</Button>
              <input name="followId" value={data.followId} type="hidden" />
            </fetcher.Form>
          ) : (
            <fetcher.Form method="POST" action="/follow">
              <Button>Follow {data.name}</Button>
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
        </div>
      ) : null}
      <div className="py-6">
        <Link to="/">Back to home</Link>
      </div>
    </div>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const hasRequiredKeys =
    params.has("realmSlug") && params.has("characterName");

  if (hasRequiredKeys) {
    const searchResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/search${url.search}`,
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
