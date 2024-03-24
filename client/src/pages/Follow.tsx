import { ActionFunctionArgs } from "react-router-dom";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const characterName = formData.get("name");
  const characterfaction = formData.get("faction");
  const characterRace = formData.get("race");
  const characterClass = formData.get("class");
  const characterAchievementPoints = formData.get("achievementPoints");
  const characterRealmSlug = formData.get("realmSlug");

  return fetch(`${import.meta.env.VITE_API_URL}/follow`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      characterName,
      characterfaction,
      characterRace,
      characterClass,
      characterAchievementPoints,
      characterRealmSlug,
    }),
  });
}
