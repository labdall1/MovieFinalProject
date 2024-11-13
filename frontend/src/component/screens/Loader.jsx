// Loader.js

import React from "react";
import { RingLoader, ClipLoader, BounceLoader } from "react-spinners"; // Import desired loaders

const Loader = ({ loading, type = "ring", color = "#3498db", size = 50 }) => {
  if (!loading) return null;

  let LoaderComponent;

  // Choose the loader based on the "type" prop
  switch (type) {
    case "ring":
      LoaderComponent = RingLoader;
      break;
    case "clip":
      LoaderComponent = ClipLoader;
      break;
    case "bounce":
      LoaderComponent = BounceLoader;
      break;
    default:
      LoaderComponent = RingLoader;
      break;
  }

  return (
    <div
      className="loader-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <LoaderComponent color={color} size={size} />
    </div>
  );
};

export default Loader;
