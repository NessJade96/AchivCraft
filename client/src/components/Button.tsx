import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">; 

export function Button(props: ButtonProps) {
  return (
    <button
    {...props}
      className={`bg-purple-600 rounded-lg py-0.5 sm:py-2 px-3 text-white font-medium min-w-20 sm:min-w-28 ${props.className}`}
    />
  );
}
