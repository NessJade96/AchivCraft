import { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  label: string;
};

export function Input({ label, ...props }: InputProps) {
  return (
    <label>
      <span className="block py-2 font-medium">{label}</span>
      <input className="border rounded-lg w-full py-2 px-3" {...props} />
    </label>
  );
}
