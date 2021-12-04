import React from "react";
import LineChart from "./LineChart/LineChart";
import ResponsiveBar from "./Bar/ResponsiveBar";
import StackedBar from "./Bar/StackedBar";
import StackedBarChart from "./Bar/StackedBarChart";
import Dendrogram from "./Dendrogram/Dendrogram";
import DendrogramTwo from "./Dendrogram/DendrogramTwo";
import DendrogramThree from "./Dendrogram/DendrogramThree";
import DendrogramFour from "./Dendrogram/DendrogramFour";
import DendrogramStackedBar from "./Starling/DendrogramStackedBar";
import NestedYAxisBar from "./Bar/NestedyAxisBar";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NestedYAxisBar />
        {/* <DendrogramStackedBar />
        <StackedBarChart />
        <StackedBar />
        <DendrogramFour />
        <DendrogramThree />
        <DendrogramTwo />
        <Dendrogram /> */}
        <ResponsiveBar />
        {/* <LineChart /> */}
      </header>
    </div>
  );
}

export default App;
