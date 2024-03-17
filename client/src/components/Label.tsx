import { ComponentProps } from "react";

type LabelProps = ComponentProps<"label">;

export function Label(props: LabelProps) {
  return <label className="text-purple-600 font-medium" {...props} />;
}
