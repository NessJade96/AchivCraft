import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

export function Button(props: ButtonProps) {
  return (
    <button
      className="bg-purple-600 rounded-lg py-2 w-full text-white font-medium"
      {...props}
    />
  );
}
