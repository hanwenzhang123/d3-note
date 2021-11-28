import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

export default function NestedYAxisBar() {
  // const svgRef = useRef();
  // const wrapperRef = useRef();
  // const update = useRef(false);
  // <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
  //   <svg ref={svgRef}>
  //     <g className="x-axis" />
  //     <g className="y-axis" />
  //   </svg>
  // </div>

  const data = [
    {
      keyOuter: "A",
      values: [
        {
          keyInner: "Apple",
        },
        {
          keyInner: "Avocado",
        },
      ],
    },
    {
      keyOuter: "B",
      values: [
        {
          keyInner: "Banana",
        },
      ],
    },
    {
      keyOuter: "C",
      values: [
        {
          keyInner: "Cherry",
        },
        {
          keyInner: "Clementine",
        },
        {
          keyInner: "Cranberry",
        },
        {
          keyInner: "Coconut",
        },
      ],
    },
  ];

  // Dimension
  const margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 20,
  };
  const width = 960 - margin.left - margin.right;
  const height = 40 - margin.left - margin.right;

  // Scales
  // Inner scale we can use d3.scalePoint directly
  const xInner = d3
    .scalePoint()
    .domain(data.flatMap((d) => d.values.map((v) => v.keyInner)))
    .range([0, width])
    .padding(0.5);

  // Outer scale isn't uniform, we need to roll out our own solution
  // In our case, outer scale is a function that accepts a keyOuter value and returns a pixel value that represents the x middle position where that keyOuter should render
  const xOuter = (keyOuter) => {
    const values = data.find((d) => d.keyOuter === keyOuter).values;
    const xMid = d3.mean(values, (v) => xInner(v.keyInner)); // The mid position can be calculated using the average of all KeyInners' positions
    return xMid;
  };

  // We need to know the right edge position of each keyOuter to render a tick line
  const xOuterRightEdge = (keyOuter) => {
    const values = data.find((d) => d.keyOuter === keyOuter).values;
    const xRightEdge =
      xInner(values[values.length - 1].keyInner) + xInner.step() / 2; // The right edge is located at the last keyInner's position plus half of the xInner's step width
    return xRightEdge;
  };

  // Render
  const svg = d3
    .select(".example")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Inner axis we can use d3.axisBottom directly
  const gInner = g.append("g").call(
    d3.axisBottom(xInner).tickSizeOuter(100) // Make domain path edges longer
  );

  // Outer axis we need to DIY
  // If you inspect d3 rendered axis, each axis consists of
  // 1. domain path
  // 2. ticks
  //   a. tick line
  //   b. tick text
  // Here we don't need to render domain path since it can use the inner axis's domain path
  const gOuter = g
    .append("g")
    .attr("fill", "none")
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle");
  const gOuterTick = gOuter
    .selectAll(".tick")
    .data(data.map((d) => d.keyOuter))
    .join("g")
    .attr("class", "tick");
  gOuterTick
    .append("line")
    .attr("transform", (d) => `translate(${xOuterRightEdge(d)},0)`)
    .attr("stroke", "currentColor")
    .attr("y2", 40);
  gOuterTick
    .append("text")
    .attr("transform", (d) => `translate(${xOuter(d)},0)`)
    .attr("fill", "currentColor")
    .attr("y", 30)
    .attr("dy", "0.71em")
    .text((d) => d);

  return <div class="example"></div>;
}
