import { PropsWithChildren } from "react";

type TextProps = { tag?: "h1" | "h2"; className?: string };

export function Text(props: PropsWithChildren<TextProps>) {
  if (props.tag === "h1") {
    return <h1 className="font-bold text-3xl text-center">{props.children}</h1>;
  } else if (props.tag === "h2") {
    return (
      <h2 className={`${props.className} text-lg text-gray-500 text-center`}>
        {props.children}
      </h2>
    );
  } else {
    return <p className={props.className}>{props.children}</p>;
  }
}
