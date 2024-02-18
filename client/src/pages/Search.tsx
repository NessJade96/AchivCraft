import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";

export function Search() {
  const data = useLoaderData();
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
        <ul>
          Search Results:
          <li>Name: {data.name}</li>
          <li>Faction: {data.faction.name}</li>
          <li>Race: {data.race.name}</li>
          <li>Class: {data.character_class.name}</li>
          <li>Level: {data.level}</li>
          <button name="intent" value="follow">
            Follow {data.name}
          </button>
        </ul>
      ) : null}
      <Link to="/home">Back to home</Link>
      <pre style={{ textAlign: "left" }}>
        {
          //{JSON.stringify(data, undefined, 2)}
        }
      </pre>
    </>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  console.log("🚀 ~ loader ~ url:", url);
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
    return searchResponse;
  }
  return null;
};

// What data do we need to send to the DB for this character (think what formdata we need to have.)
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  //   const email = formData.get("email");
  //   const password = formData.get("password");
  const intent = formData.get("intent");
  if (intent === "follow") {
    // fetch("http://localhost:3000/signup", {
    //   method: "POST",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email,
    //     password,
    //   }),
    // });
  }
  return null;
}
