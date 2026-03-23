import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "outline" | "filled" | "ghost";
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = "filled",
    fullWidth = false,
    className,
    ...props
}: ButtonProps) {

    const baseStyles = "inline-flex items-center justify-center px-10 py-4 text-sm uppercase tracking-[0.2em] cursor-pointer transition-all duration-500 relative overflow-hidden font-medium rounded-none";

    const variants = {
        outline: "border border-[#111111] text-[#111111] bg-transparent hover:bg-[#111111] hover:text-white shadow-sm hover:shadow-lg",
        filled: "bg-[#111111] text-white border border-[#111111] hover:bg-black hover:shadow-xl group",
        ghost: "text-[#111111] hover:bg-black/5 hover:shadow-sm",
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                fullWidth ? "w-full" : "",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
