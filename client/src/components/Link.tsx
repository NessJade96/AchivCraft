import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";

type LinkProps = ReactRouterLinkProps & {
  variant?: "button" | "text";
};

const variants = {
  button:
    "bg-purple-600 rounded-lg py-2 text-white font-medium px-3 inline-block",
  text: " rounded-lg py-2 text-black font-medium px-3 inline-block",
};

export function Link({ variant = "text", ...props }: LinkProps) {
  return <ReactRouterLink className={variants[variant]} {...props} />;
}
