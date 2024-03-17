import { ComponentProps } from "react";

type InputProps = ComponentProps<"input">;

export function Input(props: InputProps) {
  return <input className="border rounded-lg w-full py-2 px-3" {...props} />;
}
