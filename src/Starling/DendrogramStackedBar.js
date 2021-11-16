import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

export default function DendrogramStackedBar() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const svgRef = useRef();
  const svgBarRef = useRef();
  const wrapperRef = useRef();
  const update = useRef(false);

  d3.selectAll(".container").style("grid-template-columns", "30% 70%");

  const margin = { top: 1, right: 80, bottom: 30, left: 50 };
  let barWidth = (window.innerWidth * 0.91 - margin.left - margin.right) * 0.85;
  let barHeight = 320 - margin.top - margin.bottom;

  useEffect(() => {
    // Listen for any resize event update
    window.addEventListener("resize", () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      console.log(dimensions.width, dimensions.height);

      // If resize, remove the previous chart
      if (update.current) {
        d3.selectAll("g").remove();
      } else {
        update.current = true;
      }
    });

    // // Draw chart using the data and updated dimensions
    // DrawChart(sample, dimensions);
  }, [dimensions]);

  const svg = d3
    .select(svgRef.current)
    .attr("width", (dimensions.width - margin.left - margin.right) / 3.1)
    .attr("height", 320 - margin.top - margin.bottom)
    .style("fill", "none")
    .attr("transform", "translate(0,0)");

  const dataStructure = d3
    .stratify()
    .id(function (d) {
      return d.child;
    })
    .parentId(function (d) {
      return d.parent;
    })(data);
  //define tree structure layout
  const treeStructure = d3
    .tree()
    .size([320 - margin.top - margin.bottom, dimensions.width * 0.18]);
  //get the information from data
  const information = treeStructure(dataStructure);

  const connections = svg
    .append("g")
    .selectAll("path")
    .data(information.links());

  connections
    .enter()
    .append("path")
    .attr("d", function (d) {
      return (
        "M" +
        d.source.y +
        "," +
        d.source.x +
        "h 40 V" +
        d.target.x +
        " H" +
        d.target.y
      );
    })
    .style("fill", "none")
    .attr("stroke", "gray")
    .attr("stroke-width", "1px");

  const rectangles = svg
    .append("g")
    .selectAll("rect")
    .data(information.descendants());
  rectangles
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return d.y;
    })
    .attr("y", function (d) {
      return d.x - 15;
    })
    .style("fill", "white")
    .attr("stroke", "white")
    .attr("width", function (d) {
      return d.data.child.length * 12;
    })
    .attr("height", 20);

  const names = svg
    .append("g")
    .selectAll("text")
    .data(information.descendants());
  names
    .enter()
    .append("text")
    .text(function (d) {
      return d.data.child;
    })
    .attr("x", function (d) {
      return d.y + 8;
    })
    .attr("y", function (d) {
      return d.x;
    })
    .style("fill", "black")
    .style("font-size", 12)
    .style("text-anchor", "left")
    .style("dominant-baseline", "middle");

  //Stacked Bar

  const svgBar = d3
    .select(svgBarRef.current)
    .attr("width", barWidth + margin.left + margin.right)
    .attr("height", barHeight + margin.top + margin.bottom);

  // stacks/layers
  const stackGenerator = d3.stack().keys(allKeys);
  const layers = stackGenerator(statistics);
  console.log(layers);
  const extent = [
    0,
    d3.max(layers, (layer) => d3.max(layer, (sequence) => sequence[1])),
  ];

  //scales
  const xScale = d3
    .scaleLinear()
    .domain(extent)
    .range([margin.left, barWidth - margin.right]);

  const yScale = d3
    .scaleBand()
    .domain(statistics.map((d) => d.total_sends))
    .range([0, barHeight])
    .padding(0.1);

  //axes
  const xAxis = d3.axisBottom(xScale);
  svgBar
    .select(".x-axis")
    .attr("transform", `translate(0, ${barHeight})`)
    .call(xAxis)
    .attr("fill", "none")
    .style("color", "black")
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(0)")
    .style("text-anchor", "end")
    .style("font-size", 12);

  const yAxis = d3.axisLeft(yScale);
  svgBar
    .select(".y-axis")
    .attr("transform", `translate(${margin.left}, 0 )`)
    .call(yAxis)
    .attr("fill", "none")
    .style("color", "black")
    .selectAll("text")
    .style("font-size", 12);

  //rendering
  svgBar
    .selectAll(".layer")
    .data(layers)
    .join("g")
    .attr("class", "layer")
    .attr("fill", (layer) => colors[layer.key])
    .selectAll("rect")
    .data((layer) => layer)
    .join("rect")
    .attr("x", (sequence) => xScale(sequence[0]))
    .attr("height", yScale.bandwidth())
    .attr("y", (sequence) => yScale(sequence.data.total_sends))
    .attr("width", (sequence) => xScale(sequence[1]) - xScale(sequence[0]));

  return (
    <div ref={wrapperRef} style={{ display: "grid" }} className="container">
      <svg ref={svgRef}></svg>
      <svg ref={svgBarRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

const data = [
  { child: "Apple TV App", parent: "" },
  { child: "ATV WTWP BRA 1", parent: "Apple TV App" },
  { child: "ATV WTWP BRA 2", parent: "Apple TV App" },
  { child: "ATV WTWP BRA 3", parent: "Apple TV App" },
  { child: "ATV WTWP BRA 4", parent: "Apple TV App" },
  { child: "Frio_ET_BRA 1", parent: "ATV WTWP BRA 1" },
  { child: "Harmony_ET_BRA 2", parent: "ATV WTWP BRA 2" },
  { child: "Harmony_PT_BRA 3", parent: "ATV WTWP BRA 3" },
  { child: "Video_Transactors_PT_BRA 4", parent: "ATV WTWP BRA 4" },
];
const statistics = [
  {
    bounces_pct: 0.21,
    campaign_name: "ATV WTWP BRA",
    click_pct: 1.29,
    delivered_pct: 99.79,
    lob: "Apple TV App",
    project_id: "ISS",
    segment: "Frio_ET_BRA",
    total_bounces: 8,
    total_clicks: 49,
    total_delivered: 3798,
    total_dropoffs: 8,
    total_sends: 3806,
    total_unsubs: 1,
    unsub_pct: 0.03,
  },
  {
    bounces_pct: 0.38,
    campaign_name: "ATV WTWP BRA",
    click_pct: 1.02,
    delivered_pct: 99.62,
    lob: "Apple TV App",
    project_id: "ISS",
    segment: "Harmony_ET_BRA",
    total_bounces: 604,
    total_clicks: 1627,
    total_delivered: 15388,
    total_dropoffs: 197,
    total_sends: 15992,
    total_unsubs: 28,
    unsub_pct: 0.02,
  },
  {
    bounces_pct: 0.48,
    campaign_name: "ATV WTWP BRA",
    click_pct: 0.67,
    delivered_pct: 99.52,
    lob: "Apple TV App",
    project_id: "ISS",
    segment: "Harmony_PT_BRA",
    total_bounces: 8495,
    total_clicks: 11705,
    total_delivered: 17481,
    total_dropoffs: 2452,
    total_sends: 17576,
    total_unsubs: 331,
    unsub_pct: 0.02,
  },
  {
    bounces_pct: 0.41,
    campaign_name: "ATV WTWP BRA",
    click_pct: 0.35,
    delivered_pct: 99.59,
    lob: "Apple TV App",
    project_id: "ISS",
    segment: "Video_Transactors_PT_BRA",
    total_bounces: 49,
    total_clicks: 42,
    total_delivered: 11981,
    total_dropoffs: 15,
    total_sends: 12030,
    total_unsubs: 3,
    unsub_pct: 0.02,
  },
];

const allKeys = ["total_sends", "total_delivered", "total_clicks"];

const colors = {
  total_sends: "green",
  total_delivered: "orange",
  total_clicks: "purple",
};
