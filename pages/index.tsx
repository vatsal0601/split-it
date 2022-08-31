import Link from "next/link";
import { Head, GoogleIcon } from "@components";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Head />
      <main className="container pt-24 lg:pt-32">
        <section className="mx-auto max-w-lg space-y-2 text-center lg:space-y-4">
          <h1 className="bg-gradient-to-br from-pink-500 to-violet-500 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl">
            Bill splitting just got a whole lot easier.
          </h1>
          <p className="text-slate-600">
            SplitIt allows you to split bills more simply while still keeping track of them.
          </p>
          <div className="inline-flex items-center space-x-2 lg:space-x-4">
            <button className="inline-flex items-center space-x-1 rounded-lg bg-blue-600 px-2 py-1 font-semibold text-white transition-colors active:bg-blue-700 lg:space-x-2 lg:px-4 lg:py-2">
              <GoogleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Get Started</span>
            </button>
            <Link href="/split">
              <a className="inline-flex items-center space-x-1 rounded-lg px-2 py-1 text-blue-600 transition-colors hover:bg-blue-100 lg:space-x-2 lg:px-4 lg:py-2">
                <span>Split Bill</span>
                <ArrowRightIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              </a>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
