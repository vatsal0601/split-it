import { Head, Input } from "@components";
import { useText } from "@hooks";
import type { FC } from "react";

const Split: FC = () => {
  const {
    state: totalAmount,
    setState: setTotalAmount,
    handleBlur,
  } = useText({
    initialValue: { value: "", errorMessage: "" },
    required: true,
    regex: /^[\d\.\/*+-]+$/,
    errorMessage: "Only letters and symbols like /,*,+,- are allowed",
  });

  return (
    <>
      <Head title="Split Bill" />
      <main className="container pt-24 lg:pt-32">
        <section>
          <h1 className="bg-gradient-to-br from-pink-500 to-violet-500 bg-clip-text text-center text-4xl font-bold tracking-tighter text-transparent lg:text-5xl">
            Split Bill
          </h1>
          <form onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Total Amount"
              state={totalAmount}
              setState={setTotalAmount}
              required={true}
              onBlur={() => handleBlur()}
            />
          </form>
        </section>
      </main>
    </>
  );
};

export default Split;
