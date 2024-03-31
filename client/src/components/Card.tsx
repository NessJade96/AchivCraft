import { Text } from "../components/Text";
import alliance from "../assets/Alliance.png";
import horde from "../assets/Horde.png";
import { Achievement } from "./Achievement";

type CardProps = {
  achievementName?: string;
  characterName: string;
  completedTimestamp?: string ;
  characterRace: string;
  characterClass: string;
  characterFaction: "Alliance" | "Horde";
  characterRealm: string;
  achievementPoints?: string;
};

const logos = {
  Alliance: <img className="size-16" src={alliance} alt="Alliance Symbol" />,
  Horde: <img className="size-16" src={horde} alt="Horde Symbol" />,
};

export function Card({
  achievementName,
  characterName,
  completedTimestamp,
  characterFaction,
  characterClass,
  characterRace,
  characterRealm,
  achievementPoints,
}: CardProps) {
  const realm =
    characterRealm.charAt(0).toUpperCase() + characterRealm.slice(1);
  return (
    <div className="bg-purple-50 border border-purple-300 rounded-lg py-2 px-4 flex items-center gap-8 w-full">
      <div className="min-w-16">{logos[characterFaction]}</div>
      <div className="">
        <div className="flex gap-2">
          <Text className="text-xl font-medium">{characterName}</Text>
          <Text className="text-gray-500 text-xl">{realm}</Text>
        </div>
        <Text className="text-gray-500">
          {characterRace} {characterClass}
        </Text>
        {achievementName && completedTimestamp ? (
          <Achievement
            achievementName={achievementName}
            completedTimestamp={completedTimestamp}
          />
        ) : (
          <Text className="text-xl font-medium text-purple-800 py-4">
            {achievementPoints}
          </Text>
        )}
      </div>
    </div>
  );
}
