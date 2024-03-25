type CardProps = {
  achievementName: string;
  characterName: string;
  completedTimestamp: string;
};

export function Card({
  achievementName,
  characterName,
  completedTimestamp,
}: CardProps) {
  return (
    <div className="border rounded-lg w-1/2 py-2 px-3">
      Most recent achievement:{achievementName} completed by {characterName} at{" "}
      {completedTimestamp}
    </div>
  );
}
