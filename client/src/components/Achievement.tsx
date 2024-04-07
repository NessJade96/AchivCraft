import { Text } from "./Text";

type AchievementProps = {
  achievementName: string;
  completedTimestamp: string;
};

export function Achievement({
  achievementName,
  completedTimestamp,
}: AchievementProps) {
  const achievementTimestamp = new Date(completedTimestamp);
  const formattedDate = achievementTimestamp
    .toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
  return (
    <div>
      <Text className="text-xl font-medium text-purple-800 sm:py-4">
        {achievementName}
      </Text>
      <Text className="text-gray-500 self-center">{formattedDate}</Text>
    </div>
  );
}
