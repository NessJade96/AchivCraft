import { useLoaderData } from "react-router-dom";
import { Text } from "../components/Text";
import { Card } from "../components/Card";

export function Home() {
  const data: any = useLoaderData();
  return (
    <>
      <div className="p-6 py-8 sm:pt-20">
        <Text tag="h1">Recent Achievements</Text>
      </div>
      <div className="flex flex-col gap-4 ">
        {data.length > 0 ? (
          data.map((achievement: any) => {
            const achievementKey = `
            ${achievement.character_id}-${achievement.wow_api_id}`;
            return (
              <Card
                achievementName={achievement.name}
                characterName={achievement.character.name}
                characterRace={achievement.character.race}
                characterClass={achievement.character.class}
                characterFaction={achievement.character.faction}
                characterRealm={achievement.character.realm_slug}
                completedTimestamp={achievement.completed_timestamp}
                key={achievementKey}
              />
            );
          })
        ) : (
          <Text className="text-center text-gray-500">Follow characters to see recent achievements</Text>
        )}
      </div>
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
  return characterResponse;
};
