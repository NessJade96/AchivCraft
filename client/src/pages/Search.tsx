import {
  Form,
  LoaderFunctionArgs,
  useLoaderData,
  useFetcher,
  useLocation,
} from "react-router-dom";
import { Input } from "../components/Input";
import { Text } from "../components/Text";
import { FormItem } from "../components/FormItem";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export function Search() {
  const data: any = useLoaderData();
  const fetcher = useFetcher();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return (
    <>
      <div className="pt-40">
        <Text tag="h1">Search characters</Text>
      </div>
      <div className="py-8">
        <Text tag="h2">
          Follow your friends by entering their charcter details below
        </Text>
      </div>
      <Form method="GET">
        <FormItem label="Select a realm:">
          <Select
            required
            name="realmSlug"
            defaultValue={params.get("realmSlug") ?? ""}
          >
            <option value="frostmourne">Frostmourne</option>
            <option value="silver-hand">Silver Hand</option>
            <option value="bleeding-hollow">Bleeding Hollow</option>
          </Select>
        </FormItem>
        <FormItem label="Characters Name:">
          <Input
            required
            type="text"
            name="characterName"
            placeholder="Name eg. astraxi"
            defaultValue={params.get("characterName") ?? ""}
          />
        </FormItem>
        <div className="py-6">
          <Button name="intent" value="search">
            Search
          </Button>
        </div>
      </Form>
      {data ? (
        typeof data === "string" ? (
          <Text className="text-red-600">Character Not Found</Text>
        ) : (
          <div>
            <Text className="text-purple-800 text-center text-2xl py-4">
              Search Results:
            </Text>
            <Card
              characterName={data.name}
              characterRace={data.race}
              characterClass={data.class}
              characterFaction={data.faction}
              characterRealm={data.realmSlug}
              achievementPoints={data.achievementPoints}
            />
            {data.isFollowing ? (
              <fetcher.Form method="POST" action="/unfollow">
                <Button>Unfollow {data.name}</Button>
                <input name="followId" value={data.followId} type="hidden" />
              </fetcher.Form>
            ) : (
              <fetcher.Form method="POST" action="/follow">
                <div className="py-6">
                  <Button>Follow {data.name}</Button>
                </div>
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
        )
      ) : null}
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
      `${import.meta.env.VITE_API_URL}/search${url.search}`,
      {
        credentials: "include",
      }
    );
    const searchResult = await searchResponse.json();
    if (!searchResult) {
      return "Character not found";
    }
    return searchResult;
  }
  return null;
};
