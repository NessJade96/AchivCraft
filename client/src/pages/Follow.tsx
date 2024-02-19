import { ActionFunctionArgs } from "react-router-dom";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const characterName = formData.get("name");
  const characterfaction = formData.get("faction");
  const characterRace = formData.get("race");
  const characterClass = formData.get("class");
  const characterAchievementPoints = formData.get("achievementPoints");
  const characterRealmSlug = formData.get("realmSlug");
  
  return fetch("http://localhost:3000/follow", {
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
