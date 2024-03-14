import { PropsWithChildren } from "react";

export function Button(props: PropsWithChildren) {
  return (
    <button
      className="bg-purple-600 rounded-lg py-2 w-full text-white font-medium"
      {...props}
    />
  );
}
