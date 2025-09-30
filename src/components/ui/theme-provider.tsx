"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ModeToggle({ ...props }: React.HTMLAttributes<HTMLButtonElement>) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} {...props} className={cn("p-2 cursor-pointer", props.className)}>
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
    );
}
