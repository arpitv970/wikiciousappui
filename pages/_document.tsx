import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:wght@200;300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto Mono&display=swap"
            rel="stylesheet"
          ></link>
          <Script
            src="/datafeeds/udf/dist/bundle.js"
            strategy="beforeInteractive"
          ></Script>
        </Head>
        <body className="overflow-hidden bg-th-bkg-1">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
