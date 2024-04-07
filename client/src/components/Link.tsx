import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";

type LinkProps = ReactRouterLinkProps & {
  variant?: "button" | "text";
};

const variants = {
  button:
    "bg-purple-600 rounded-lg py-0.5 sm:py-2 px-3 text-white font-medium min-w-20 sm:min-w-28 text-center",
  text: " rounded-lg py-2 text-black font-medium px-3 ",
};

export function Link({ variant = "text", ...props }: LinkProps) {
  return <ReactRouterLink className={variants[variant]} {...props} />;
}
