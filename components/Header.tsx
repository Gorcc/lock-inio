'use client';

import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
              Lock In.io
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
            <span className="font-medium">🔥 Sign in to track your study streaks and earn achievement points!</span>
            {" "}
            <Link href="/login" className="underline font-semibold hover:text-green-700">
              Get started now
            </Link>
          </p>
        </div>
      )}
    </>
  );
}