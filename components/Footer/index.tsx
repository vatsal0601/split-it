import type { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="absolute bottom-0 w-full bg-blue-100 py-2 text-center lg:py-4">
      <p className="space-x-1 text-sm text-slate-600 lg:text-base">
        <span>
          Made with <span className="text-red-600">&hearts;</span> by
        </span>
        <a
          href="https://github.com/vatsal0601"
          target="_blank"
          rel="noreferrer"
        >
          Vatsal Sakariya
        </a>
      </p>
    </footer>
  );
};

export default Footer;
