import { PropsWithChildren } from "react";

export function Button(props: PropsWithChildren) {
  return <button>{props.children}</button>;
}
