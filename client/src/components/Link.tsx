import { Link as ReactRouterLink, LinkProps } from "react-router-dom";

export function Link(props: LinkProps) {
  return <ReactRouterLink className="text-purple-600 font-medium" {...props} />;
}
