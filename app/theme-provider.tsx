"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  return (
    <NextThemesProvider {...props}>
      <div className={!mounted ? "transition-none [&_*]:transition-none" : ""}>
        {children}
      </div>
    </NextThemesProvider>
  );
}
