import React from "react";
import Head from "next/head";

const Home = () => {
  const [perms, setPerms] = React.useState({ read: "", write: "" });
  const [text, setText] = React.useState("");
  const [alternatedText, setAlternatedText] = React.useState("");

  const checkperms = async () => {
    const [canRead, canWrite] = await Promise.all([
      navigator.permissions.query({ name: "clipboard-read" }),
      navigator.permissions.query({ name: "clipboard-write" }),
    ]);
    console.log(canRead, canWrite);

    setPerms({ read: canRead.state, write: canWrite.state });

    if (canRead.state === "granted") {
      const originalText = await navigator.clipboard.readText();
      const alternatingCaps = [...originalText.trim().toLowerCase()]
        .map((char, idx) => {
          if ((idx + 1) % 2 === 0) return char.toUpperCase();
          return char;
        })
        .join("");
      setText(originalText);
      setAlternatedText(
        alternatingCaps.charAt(0) !== '"' &&
          alternatingCaps.charAt(alternatingCaps.length) !== '"'
          ? `\"${alternatingCaps}\"`
          : alternatingCaps
      );
    }
  };

  React.useEffect(checkperms, []);

  React.useEffect(() => {
    window.addEventListener("focus", checkperms);
    return () => window.removeEventListener("focus", checkperms);
  });
  console.log("_perms", perms);

  return (
    <>
      <Head>
        <title>Create Next App</title>
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
          }}
        >
          {(perms.read === "denied" || perms.write === "denied") && (
            <div>
              Whoops, looks like we don't have permissions to read or write from
              your clipboard
            </div>
          )}

          {perms.read !== "denied" && perms.write !== "write" && (
            <>
              {text && <div style={{ alignSelf: "center" }}>{text}</div>}
              <br />
              <br />
              <br />
              {alternatedText && (
                <div style={{ alignSelf: "center" }}>{alternatedText}</div>
              )}
            </>
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
