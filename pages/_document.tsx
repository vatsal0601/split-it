import { Html, Main, NextScript, Head } from "next/document";
import { ReactElement } from "react";
import Document, { DocumentInitialProps, DocumentContext } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): ReactElement {
    return (
      <Html
        lang="en"
        className="h-full scroll-smooth"
      >
        <Head>
          <meta charSet="UTF-8" />
        </Head>
        <body className="relative min-h-full bg-slate-50 subpixel-antialiased selection:bg-blue-200 selection:text-slate-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
