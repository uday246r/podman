import React from "react";

const loadRemote = async (importPromise, remoteName) => {
  try {
    return await importPromise;
  } catch (error) {
    console.error(`${remoteName} failed to load`, error);

    return {
      default: () =>
        React.createElement(
          "div",
          {
            style: {
              padding: "40px",
              textAlign: "center",
              color: "#ef4444",
            },
          },
          React.createElement("h2", null, `${remoteName} service unavailable`),
          React.createElement("p", null, "Please try again later.")
        ),
    };
  }
};

export default loadRemote;
