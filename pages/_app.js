import '../styles/globals.css'
function MyApp({ Component, pageProps }) {

    return (
        <>
          <head>
            <title>UAT - Ukrainian Army Test</title>
            <link rel="icon" href="/LOGO.png"  />
          </head>
          <Component {...pageProps} />
        </>
      );
}

export default MyApp
