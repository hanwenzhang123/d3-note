import React from "react";
import LineChart from "./LineChart";
import Chart from "./ResponsiveBar";
import Dendrogram from "./Dendrogram";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Dendrogram />
        <Chart />
        <LineChart />
      </header>
    </div>
  );
}

export default App;
