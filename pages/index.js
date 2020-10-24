import React from "react";
import Head from "next/head";

const quoteExamples = [
  "It has not been easy for me and, you know, I started off in brooklyn. My father gave me a small loan of a million dollars",
  "...she does have a very nice figure. I've said if Ivanka weren't my daughter, perhaps I'd be dating her",
  "It's freezing and snowing in New York! We need global warming",
];

const alternateCaps = (originalText) => {
  const alternatingCaps = [...originalText.trim().toLowerCase()]
    .map((char, idx) => {
      if ((idx + 1) % 2 === 0) return char.toUpperCase();
      return char;
    })
    .join("");

  return alternatingCaps.charAt(0) !== '"' &&
    alternatingCaps.charAt(alternatingCaps.length) !== '"'
    ? `\"${alternatingCaps}\"`
    : alternatingCaps;
};

const QUOTE_CONTAINERR = {
  border: "1px solid",
  borderRadius: 4,
  padding: 24,
  boxShadow: "inset 0px 0px 20px 2px white",
};

const LINK = {
  textDecoration: "underline",
  cursor: "pointer",
};

const Home = () => {
  const [exampleQuote, setExampleQuote] = React.useState("");
  const [perms, setPerms] = React.useState({ read: "", write: "" });
  const [text, setText] = React.useState("");
  const [alternatedText, setAlternatedText] = React.useState("");
  const [isCopied, setIsCopied] = React.useState(false);

  const checkperms = async () => {
    const [canRead, canWrite] = await Promise.all([
      navigator.permissions.query({ name: "clipboard-read" }),
      navigator.permissions.query({ name: "clipboard-write" }),
    ]);

    setPerms({ read: canRead.state, write: canWrite.state });

    if (canRead.state === "granted") {
      const originalText = await navigator.clipboard.readText();

      setText(originalText);
      setAlternatedText(alternateCaps(originalText));
    }
  };

  /**
   * For the case that they have "prompt" permissions
   */
  const requestPerms = async () => {
    const originalText = await navigator.clipboard.readText();
    setText(originalText);
    setAlternatedText(alternateCaps(originalText));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(alternatedText);
    setIsCopied(true);
  };

  React.useEffect(checkperms, []);

  React.useState(() => {
    const quoteIndex = Math.floor(Math.random() * quoteExamples.length);
    setExampleQuote(quoteExamples[quoteIndex]);
  }, []);

  React.useEffect(() => {
    window.addEventListener("focus", checkperms);
    return () => window.removeEventListener("focus", checkperms);
  }, []);

  React.useEffect(() => {
    window.addEventListener("copy", checkperms);
    return () => window.removeEventListener("copy", checkperms);
  });

  return (
    <>
      <Head>
        <title>aLtErNaTiNg CaPs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f06000",
          fontWeight: "bold",
          color: "white",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "column",
            padding: 100,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h1>
            Alternating caps reads what you have copied and turns it into
            "aLtErNaTiNg CaPs"
          </h1>
          {JSON.stringify(perms)}

          {(perms.read === "denied" || perms.write === "denied") && (
            <p>
              Whoops, looks like we don't have permissions to read or write from
              your clipboard. Open browser settings and allow this to use your
              clipboard from your browser (your data is never saved outside of
              your clipboard)
            </p>
          )}

          {(perms.read === "prompt" || perms.write === "prompt") && (
            <>
              <h2>
                <a onClick={requestPerms} style={LINK}>
                  Accept permissions
                </a>{" "}
                to be able to use examples like:
              </h2>
              <div></div>

              <div style={QUOTE_CONTAINERR}>
                <p>original: {exampleQuote}</p>
                <p>modified: {alternateCaps(exampleQuote)}</p>
              </div>
            </>
          )}

          {perms.read === "granted" && perms.write === "granted" && (
            <div style={QUOTE_CONTAINERR}>
              {!text && (
                <p>
                  Copy some text and come back to this page to see your
                  alternating text!
                </p>
              )}
              {text && (
                <>
                  <p>original</p>
                  <p>{text}</p>
                </>
              )}
              <br />
              {alternatedText && (
                <>
                  <p>
                    alternated (
                    <a onClick={copyToClipboard} style={LINK}>
                      {isCopied ? "copied!" : "copy to clipboard"}
                    </a>
                    )
                  </p>
                  <p>{alternatedText}</p>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        html,
        body {
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        #__next {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
};

export default Home;
