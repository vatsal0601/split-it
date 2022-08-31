import Link from "next/link";
import { useRouter } from "next/router";
import { GoogleIcon } from "@components";
import type { FC } from "react";

const Navbar: FC = () => {
  const router = useRouter();

  return (
    <header className="py-2 lg:py-4">
      <nav className="container flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold tracking-tighter text-slate-900 lg:text-3xl">
            Split<span className="bg-gradient-to-br from-pink-500 to-violet-500 bg-clip-text text-transparent">It</span>
          </a>
        </Link>
        <ul className="inline-flex items-center space-x-2 lg:space-x-4">
          <li>
            <Link href="/split">
              <a
                className={`${
                  router.pathname == "/split" ? "font-semibold text-slate-900" : "font-normal text-slate-600"
                } rounded-lg px-2 py-1 text-sm transition-colors hover:bg-blue-100 active:text-blue-600 lg:px-4 lg:py-2 lg:text-base`}
              >
                Split Bill
              </a>
            </Link>
          </li>
          <li>
            <button className="inline-flex items-center space-x-1 rounded-lg bg-blue-600 px-2 py-1 font-semibold text-white transition-colors active:bg-blue-700 lg:space-x-2 lg:px-4 lg:py-2">
              <GoogleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>LogIn/Register</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
