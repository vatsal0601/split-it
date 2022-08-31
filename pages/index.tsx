import { Head } from "@components";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Head />
      <main className="container pt-24 lg:pt-32">
        <section className="mx-auto max-w-lg space-y-2 text-center lg:space-y-4">
          <h1 className="bg-gradient-to-br from-pink-500 to-violet-500 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl">
            Lorem ipsum dolor sit amet.
          </h1>
          <p className="text-slate-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt laboriosam officiis, qui atque voluptate porro
            eaque deleniti ut labore earum.
          </p>
        </section>
      </main>
    </>
  );
};

export default Home;
