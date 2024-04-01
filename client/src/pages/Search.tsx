import {
  Form,
  LoaderFunctionArgs,
  useLoaderData,
  useFetcher,
  useLocation,
  useNavigation,
} from "react-router-dom";
import { Input } from "../components/Input";
import { Text } from "../components/Text";
import { FormItem } from "../components/FormItem";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Link } from "../components/Link";

export function Search() {
  const data: any = useLoaderData();
  const fetcher = useFetcher();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigation = useNavigation();
  console.log("🚀 ~ Search ~ navigation:", navigation);

  const searchButtonText =
    navigation.state === "submitting"
      ? "Searching..."
      : navigation.state === "loading" &&
        navigation.location?.pathname === "/search"
      ? "Searching..."
      : "Search";

  const followButtonText =
    fetcher.state === "submitting"
      ? "Following..."
      : fetcher.state === "loading"
      ? "Following..."
      : "Follow";

  const unfollowButtonText =
    fetcher.state === "submitting"
      ? "Unfollowing..."
      : fetcher.state === "loading"
      ? "Unfollowing..."
      : "Unfollow";

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
            key={params.get("realmSlug") ?? ""}
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
            key={params.get("characterName") ?? ""}
          />
        </FormItem>
        <div className="flex items-center">
          <Text className="text-gray-500">Not sure what to search? Try:</Text>
          <Link to="/search?realmSlug=frostmourne&characterName=astraxi&intent=search">
            Astraxi
          </Link>
          <Link to="/search?realmSlug=bleeding-hollow&characterName=bullshifts&intent=search">
            Bullshifts
          </Link>
          <Link to="/search?realmSlug=silver-hand&characterName=rustycogs&intent=search">
            Rustycogs
          </Link>
        </div>
        <div className="py-6">
          <Button name="intent" value="search">
            {searchButtonText}
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
                <div className="py-6">
                  <Button>
                    {unfollowButtonText} {data.name}
                  </Button>
                  <input name="followId" value={data.followId} type="hidden" />
                </div>
              </fetcher.Form>
            ) : (
              <fetcher.Form method="POST" action="/follow">
                <div className="py-6">
                  <Button>
                    {followButtonText} {data.name}
                  </Button>
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
