"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/images/logo.svg";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <>
      <header className="w-full bg-white shadow-sm py-3 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={Logo}
              alt="Lock In.io Logo"
              width={50}
              height={50}
              className="mr-2"
            />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
              LockIn.io
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 text-sm">{user.email}</span>
              </div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
                className="text-sm bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {!user && (
        <div className="w-full bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 py-2 px-6 text-center">
          <p className="text-sm text-green-800">
            <span className="font-medium">
              🔥 Sign in to track your study streaks and earn achievement
              points!
            </span>{" "}
            <Link
              href="/login"
              className="underline font-semibold hover:text-green-700"
            >
              Get started now
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
