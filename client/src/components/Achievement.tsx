import { Text } from "./Text";

type AchievementProps = {
  achievementName: string;
  completedTimestamp: string;
};

export function Achievement({achievementName, completedTimestamp}: AchievementProps) {
  return (
    <div>
      <Text className="text-xl font-medium text-purple-800 py-4">
        {achievementName}
      </Text>
      <Text className="text-gray-500 self-center">{completedTimestamp}</Text>
    </div>
  );
}
