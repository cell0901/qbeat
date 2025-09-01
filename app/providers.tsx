"use client"
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
    // because of Context Api in React
    return <SessionProvider> {/**using next auth,recoil or provider these needs to run on th client*/}
        {children}
    </SessionProvider>
}