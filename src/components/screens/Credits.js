import React from "react";
import { config } from "./../../config";
import kraski from "./../../assets/images/kraski@2x.png";

const Credits = () => {
  return (
    <div className="credits-container">
      <img className="kraski" src={kraski} width="220" />
      <p className="game-info">
        LINNR Version {config.version}
        <br />© 2020 - Hamburg/Berlin
      </p>
      <ul className="dev-info">
        <ul>
          <li>Code</li>
          <li>
            Stefan Kracht{" "}
            <a href="https://twitter.com/stefan_kracht" target="_blank">
              
            </a>{" "}
            <a href="https://stefankracht.de" target="_blank">
              ⌂
            </a>
          </li>
        </ul>
        <ul>
          <li>Design</li>
          <li>
            Christian Wischnewski{" "}
            <a href="https://www.instagram.com/wischnikdraws/" target="_blank">
              
            </a>{" "}
            <a href="https://www.wischnik.de/" target="_blank">
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
        <a href="https://itch.io/jam/jamuary-second-chances" target="_blank">
          Jamuary: Second Chances
        </a>
        .<br />
        Powered by{" "}
        <a href="https://www.pixijs.com/" target="_blank">
          PixiJS
        </a>
        ,{" "}
        <a href="https://www.aseprite.org//" target="_blank">
          Aseprite
        </a>
        ,{" "}
        <a href="https://beepbox.co/" target="_blank">
          Beepbox
        </a>
        ,{" "}
        <a
          href="https://www.pentacom.jp/pentacom/bitfontmaker2/"
          target="_blank"
        >
          Bitfontmaker
        </a>
        .
        <br />
        Download Game Fonts{" "}
        <a href="https://www.dafont.com/poppkorn.font" target="_blank">
          Unikorn Beta
        </a>{" "}
        <a href="https://www.dafont.com/poppkorn.font" target="_blank">
          Poppkorn
        </a>
        .
      </p>
    </div>
  );
};

export default Credits;
