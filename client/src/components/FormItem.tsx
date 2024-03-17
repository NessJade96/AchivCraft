import { PropsWithChildren } from "react";

type FormItemProps = {
  label: string;
};
export function FormItem({
  label,
  children,
}: PropsWithChildren<FormItemProps>) {
  return (
    <label>
      <span className="block py-2 font-medium">{label}</span>
      {children}
    </label>
  );
}
