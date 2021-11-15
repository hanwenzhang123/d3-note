import React from "react";
import LineChart from "./LineChart";
import Chart from "./ResponsiveBar";
import Dendrogram from "./Dendrogram";
import DendrogramTwo from "./DendrogramTwo";
import DendrogramThree from "./DendrogramThree";
import DendrogramFour from "./DendrogramFour";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DendrogramFour />
        <DendrogramThree />
        <DendrogramTwo />
        <Dendrogram />
        <Chart />
        <LineChart />
      </header>
    </div>
  );
}

export default App;
