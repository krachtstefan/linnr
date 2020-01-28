import ExitWithEscape from "./../utils/ExitWithEscape";
import React from "react";
import { config } from "./../../config";
import kraski from "./../../assets/images/kraski@2x.png";

const Credits = () => {
  return (
    <div className="about-container">
      <ExitWithEscape />
      <img className="kraski" alt="Kraski Logo" src={kraski} width="220" />
      <p className="game-info">
        LINNR Version {config.version}
        <br />© 2020 - Hamburg/Berlin
      </p>
      <ul className="dev-info">
        <ul>
          <li>Code</li>
          <li>
            Stefan Kracht{" "}
            <a
              href="https://twitter.com/stefan_kracht"
              target="_blank"
              rel="noopener noreferrer"
            >
              
            </a>{" "}
            <a
              href="https://stefankracht.de"
              target="_blank"
              rel="noopener noreferrer"
            >
              ⌂
            </a>
          </li>
        </ul>
        <ul>
          <li>Design</li>
          <li>
            Christian Wischnewski{" "}
            <a
              href="https://www.instagram.com/wischnikdraws/"
              target="_blank"
              rel="noopener noreferrer"
            >
              
            </a>{" "}
            <a
              href="https://www.wischnik.de/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ⌂
            </a>
          </li>
        </ul>
        <ul>
          <li></li>
        </ul>
      </ul>
      <p className="software-info">
        Made for{" "}
        <a
          href="https://itch.io/jam/jamuary-second-chances"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jamuary: Second Chances
        </a>
        .<br />
        Powered by{" "}
        <a
          href="https://www.pixijs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          PixiJS
        </a>
        ,{" "}
        <a
          href="https://www.aseprite.org//"
          target="_blank"
          rel="noopener noreferrer"
        >
          Aseprite
        </a>
        ,{" "}
        <a href="https://beepbox.co/" target="_blank" rel="noopener noreferrer">
          Beepbox
        </a>
        ,{" "}
        <a
          href="https://www.pentacom.jp/pentacom/bitfontmaker2/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bitfontmaker
        </a>
        .
        <br />
        Download Game Fonts{" "}
        <a
          href="https://www.dafont.com/poppkorn.font"
          target="_blank"
          rel="noopener noreferrer"
        >
          Unikorn Beta
        </a>{" "}
        and{" "}
        <a
          href="https://www.dafont.com/poppkorn.font"
          target="_blank"
          rel="noopener noreferrer"
        >
          Poppkorn
        </a>
        .
      </p>
    </div>
  );
};

export default Credits;
