import React, { useState } from "react";
import ChartSwitchButton from "./ChartSwitchButton";
import { processCompareForGroupedBar } from "./GraphFunctions";
import LegendComponent from "./LegendComponent";
import MetricsDropdown from "./MetricsDropdown";
import GroupedStackedGraph from "./GroupedStackedGraph";
import GroupStackedDendrogram from "./GroupStackedDendrogram";
import { barColorsData, allKeys } from "../InsightsTableConfig";

const AnalyticsBarGraph = ({
  chartType,
  graphData,
  graphState,
  selectedList,
  showOnlyClickCount,
  chartOptions,
  setGraphState,
}) => {
  let dimensions = [];
  const [keys, setKeys] = useState([]);
  const [colors, setColors] = useState({});
  const [activeLegend, selectLegend] = useState();
  const [keyBarDimension, setKeyDimension] = useState("");
  const [primaryGroupData, setPrimaryGrouped] = useState({});
  const [metericSelected, setMetericSelected] = useState("Sends");
  const [barData, setBarData] = useState([]);
  const [showDengrogram, setShowDengrogram] = useState(false);

  const { primary, secondary, tertiary } = graphState["dimensions"];

  React.useEffect(() => {
    if ((primary && secondary) || (primary && secondary && tertiary)) {
      setShowDengrogram(true);
    } else {
      setShowDengrogram(false);
    }
  }, [primary, secondary, tertiary]);

  console.log(primary);
  console.log(secondary);
  console.log(tertiary);

  React.useEffect(() => {
    let { nestedStackData, colors, keyDimension, primaryGrouped } =
      processCompareForGroupedBar({
        graphData: graphData,
        dimensions: graphState["dimensions"],
        selectedList,
      });

    dimensions = graphState["dimensions"];
    setBarData(nestedStackData);
    setKeyDimension(keyDimension);
    setColors(colors);
    setPrimaryGrouped(primaryGrouped);
  }, [selectedList, graphData]);
  React.useEffect(() => {
    if (showOnlyClickCount) {
      setMetericSelected("Clicks");
    } else {
      setMetericSelected("Sends");
    }
  }, [graphState["dimensions"]]);

  console.log(colors);
  console.log(activeLegend);

  return (
    <div className="analytic-root-chart">
      <div className="bar-grph-fltr-cntnr">
        <MetricsDropdown
          showOnlyClickCount={showOnlyClickCount}
          graphState={graphState}
          firstMetric={metericSelected}
          setFirstMetric={setMetericSelected}
        />
        <div
          style={{
            display: "flex",
          }}
        >
          <ChartSwitchButton
            chartOptions={chartOptions}
            graphState={graphState}
            setGraphState={setGraphState}
          />
        </div>
      </div>
      {showDengrogram ? (
        <div>
          <LegendComponent
            data={barColorsData}
            chartType={chartType}
            chartRep={graphState.chartRepresentation}
            activeLegend={activeLegend}
            selectLegend={selectLegend}
          />

          <GroupStackedDendrogram
            primary={primary}
            secondary={secondary}
            tertiary={tertiary}
            graphData={graphData}
            colors={barColorsData}
            allKeys={allKeys}
            activeLegend={activeLegend}
            selectLegend={selectLegend}
          />
        </div>
      ) : (
        <div>
          <LegendComponent
            data={colors}
            chartType={chartType}
            chartRep={graphState.chartRepresentation}
            activeLegend={activeLegend}
            selectLegend={selectLegend}
          />
          <GroupedStackedGraph
            barData={barData}
            dimensions={graphState.dimensions}
            keys={keys}
            colors={colors}
            primary={graphState.dimensions["primary"]}
            metericSelected={metericSelected}
            keyDimension={keyBarDimension}
            primaryGrouped={primaryGroupData}
            activeLegend={activeLegend}
            selectLegend={selectLegend}
          />
        </div>
      )}
    </div>
  );
};
export default AnalyticsBarGraph;
