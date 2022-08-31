import { default as NextHead } from "next/head";
import type { FC } from "react";

interface Props {
  title?: string;
  description?: string;
  keywords?: string;
}

const Head: FC<Props> = ({ title, description, keywords }) => {
  return (
    <NextHead>
      <title>{title}</title>
      <meta
        name="description"
        content={description}
      />
      <meta
        name="keywords"
        content={keywords}
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
    </NextHead>
  );
};

export default Head;

Head.defaultProps = {
  title: "Split It",
  description: "An app created using which user can split their bills more easily",
  keywords: "Money, Bill, Split, SplitIt",
};
