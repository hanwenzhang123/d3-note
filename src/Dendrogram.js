import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./Dendrogram.css";

export default function Dendrogram() {
  const width = 460;
  const height = 460;
  const margin = { top: 50, right: 30, bottom: 30, left: 60 };
  const d3Chart = useRef();
  const svg = d3
    .select(d3Chart.current)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("fill", "none")
    .append("g")
    .attr("transform", "translate(40,0)"); // bit of margin on the left = 40

  // read json data
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram.json"
  ).then(function (data) {
    // Create the cluster layout:
    const cluster = d3.cluster().size([height, width - 100]); // 100 is the margin I will have on the right side

    // Give the data to this cluster layout:
    const root = d3.hierarchy(data, function (d) {
      return d.children;
    });
    cluster(root);

    // Add the links between nodes:
    svg
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("d", function (d) {
        return (
          "M" +
          d.y +
          "," +
          d.x +
          "C" +
          (d.parent.y + 50) +
          "," +
          d.x +
          " " +
          (d.parent.y + 150) +
          "," +
          d.parent.x + // 50 and 150 are coordinates of inflexion, play with it to change links shape
          " " +
          d.parent.y +
          "," +
          d.parent.x
        );
      })
      .style("fill", "none")
      .attr("stroke", "#ccc");

    // Add a circle for each node.
    svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", function (d) {
        return `translate(${d.y},${d.x})`;
      })
      .append("circle")
      .attr("r", 7)
      .style("fill", "#69b3a2")
      .attr("stroke", "black")
      .style("stroke-width", 2);
  });

  return (
    <div>
      <svg ref={d3Chart}></svg>
    </div>
  );
}
