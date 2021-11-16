import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const data = [
  {
    year: 1980,
    "🥑": 10,
    "🍌": 20,
    "🍆": 30,
  },
  {
    year: 1990,
    "🥑": 20,
    "🍌": 40,
    "🍆": 60,
  },
  {
    year: 2000,
    "🥑": 30,
    "🍌": 45,
    "🍆": 80,
  },
  {
    year: 2010,
    "🥑": 40,
    "🍌": 60,
    "🍆": 100,
  },
  {
    year: 2020,
    "🥑": 50,
    "🍌": 80,
    "🍆": 120,
  },
];

const allKeys = ["🥑", "🍌", "🍆"];

const colors = {
  "🥑": "green",
  "🍌": "orange",
  "🍆": "purple",
};

export default function StackedBarChart() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const svgRef = useRef();
  const wrapperRef = useRef();
  const update = useRef(false);

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

  //create svg layout
  const margin = { top: 1, right: 80, bottom: 30, left: 50 };
  let barWidth = window.innerWidth * 0.91 - margin.left - margin.right;
  let barHeight = 320 - margin.top - margin.bottom;

  const svg = d3
    .select(svgRef.current)
    .attr("width", barWidth + margin.left + margin.right)
    .attr("height", barHeight + margin.top + margin.bottom)
    .style("background-color", "skyblue")
    .attr("transform", "translate(50,50)");

  // stacks/layers
  const stackGenerator = d3.stack().keys(allKeys);
  const layers = stackGenerator(data);
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
    .domain(data.map((d) => d.year))
    .range([0, barHeight])
    .padding(0.1);

  //axes
  const xAxis = d3.axisBottom(xScale);
  svg
    .select(".x-axis")
    .attr("transform", `translate(0, ${barHeight})`)
    .call(xAxis)
    .attr("fill", "none")
    .style("color", "black")
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  const yAxis = d3.axisLeft(yScale);
  svg
    .select(".y-axis")
    .attr("transform", `translate(${margin.left}, 0 )`)
    .call(yAxis)
    .attr("fill", "none")
    .style("color", "black");

  //rendering
  svg
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
    .attr("y", (sequence) => yScale(sequence.data.year))
    .attr("width", (sequence) => xScale(sequence[1]) - xScale(sequence[0]));

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}
