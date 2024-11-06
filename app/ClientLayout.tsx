"use client";

import React, { Suspense } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

import { Navbar } from "@/components/navbar";
import Background from "@/components/Background";

// Create a context for isQuizPage
const QuizContext = React.createContext(false);

function SearchParamsWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isQuizPage = searchParams.get("quiz") === "true";
  return (
    <QuizContext.Provider value={isQuizPage}>{children}</QuizContext.Provider>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapper>
          <LayoutContent>{children}</LayoutContent>
        </SearchParamsWrapper>
      </Suspense>
    </ThemeProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isQuizPage = React.useContext(QuizContext);

  React.useEffect(() => {
    if (isQuizPage) {
      setTheme("light");
    }
  }, [isQuizPage, setTheme]);

  return (
    <div
      className={clsx(
        "min-h-screen font-sans antialiased",
        isQuizPage && "overflow-hidden"
      )}
    >
      {isQuizPage ? (
        <div className="h-screen w-screen overflow-hidden">{children}</div>
      ) : (
        <>
          <Background />
          <div className="relative flex flex-col min-h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl p-4 flex-grow">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
}
