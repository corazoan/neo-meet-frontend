import { splitProps } from "solid-js";

type buttonProps = {
  children?: any;
  class?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  onClick?: (event: MouseEvent) => void;
};
export default function Button(props: buttonProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "variant",
    "size",
    "onClick",
  ]);

  const baseStyles = "flex justify-center items-center  rounded ";

  const variantStyles: Record<"primary" | "secondary", string> = {
    primary: "hover:bg-white/80 bg-white text-black",
    secondary: "hover:bg-white/10 bg-white/20 text-white",
  };
  const sizeStyles: { sm: string; md: string; lg: string } = {
    sm: "px-2.5 py-1.5 text-sm leading-4",
    md: "px-4 py-2 text-md leading-5",
    lg: "px-6 py-2.5 text-lg leading-6",
  };

  const variant = variantStyles[local.variant || "primary"];
  const size = sizeStyles[local.size || "md"];

  return (
    <button
      {...rest}
      class={`${baseStyles} ${variant} ${size} ${local.class || ""}`}
      onClick={local.onClick}
    >
      {local.children}
    </button>
  );
}
