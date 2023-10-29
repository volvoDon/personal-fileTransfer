import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Sam Segal" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-15xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://media0.giphy.com/media/0oYBxMzAFU3iHhsPk6/giphy.gif?cid=ecf05e47jrx94yzd1rpmwbtq13b3ht0at59ba2rx5cfs03dh&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                alt="moving thing"
              />
              <div className="absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply" />
            </div>
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl text-white font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase drop-shadow-md">
                  Sam Segal
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-2xl text-white sm:max-w-3xl">
                Full Stack Developer | Ecommerce Specialist
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center pb-6">
                {user ? (
                  <Link
                    to="/notes"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                  >
                    View Notes for {user.email}
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/join"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md bg-purple-500 px-4 py-3 font-medium text-white hover:bg-purple-600"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
              <div className="relative flex overflow-x-hidden font-extrabold">
              <div className="py-12 animate-marquee whitespace-nowrap">
              <span className="mx-4 text-4xl">Python,</span>
              <span className="mx-4 text-4xl">Rust,</span>
              <span className="mx-4 text-4xl">PostgreSQL,</span>
              <span className="mx-4 text-4xl">JavaScript,</span>
              <span className="mx-4 text-4xl">Anything...</span>
            </div>

            <div className="absolute top-0 py-12 animate-marquee2 whitespace-nowrap font-extrabold">
            <span className="mx-4 text-4xl">Python,</span>
              <span className="mx-4 text-4xl">Rust,</span>
              <span className="mx-4 text-4xl">PostgreSQL,</span>
              <span className="mx-4 text-4xl">JavaScript,</span>
              <span className="mx-4 text-4xl">Anything...</span>
            </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
