import "./styles/app.css";

import Debugger from "./components/Debugger";
import Dpad from "./components/Dpad";
import Game from "./components/Game";
import React from "react";

let App = () => (
  <>
    <div className="logo"></div>
    <div className="game">
      <Game />
      <Dpad />
    </div>
    <Debugger />
  </>
);

export default App;
