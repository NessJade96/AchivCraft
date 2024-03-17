import { ComponentProps } from "react";

type SelectProps = ComponentProps<"select">;

export function Select(props: SelectProps) {
  return <select className="border rounded-lg w-full py-2 px-3" {...props} />;
}
