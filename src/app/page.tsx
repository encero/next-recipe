import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";

import { redirect } from "next/navigation";

export default async function Home() {

    const {userId} = await auth();

    if (userId !== null) {
        return redirect("/home");
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                    Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
                </h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                    <SignInButton mode="modal"/>
                </div>
                <div className="flex flex-col items-center gap-2">
                </div>
            </div>
        </main>
    );
}
