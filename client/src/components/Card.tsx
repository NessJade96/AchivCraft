import { Text } from "../components/Text";
import alliance from "../assets/Alliance.png";
import horde from "../assets/Horde.png";

type CardProps = {
  achievementName: string;
  characterName: string;
  completedTimestamp: string;
  characterRace: string;
  characterClass: string;
  characterFaction: "Alliance" | "Horde";
  characterRealm: string;
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
}: CardProps) {
  const realm =
    characterRealm.charAt(0).toUpperCase() + characterRealm.slice(1);
  const achievementTimestamp = new Date(completedTimestamp);
  const formattedDate = achievementTimestamp
    .toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
  return (
    <div className="border rounded-lg w-1/2 py-2 px-3">
      <div>{logos[characterFaction]}</div>
      <div>
        <div>
          <Text>{characterName}</Text>
          {realm}
        </div>
        <Text>
          {characterRace} {characterClass}
        </Text>
        <Text>{achievementName}</Text>
        <Text>{formattedDate}</Text>
      </div>
    </div>
  );
}
