import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./Dendrogram.css";

export default function DendrogramFour() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const svgRef = useRef();
  const update = useRef(false);

  const margin = { top: 1, right: 80, bottom: 27, left: 20 };

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

  const data = [
    { child: "John", parent: "" },
    { child: "Aaron", parent: "Kevin" },
    { child: "Kevin", parent: "John" },
    { child: "Hannah", parent: "Ann" },
    { child: "Rose", parent: "Sarah" },
    { child: "Ann", parent: "John" },
    { child: "Sarah", parent: "Kevin" },
    { child: "Mark", parent: "Ann" },
    { child: "Angel", parent: "Sarah" },
    { child: "Tom", parent: "Hannah" },
  ];

  const svg = d3
    .select(svgRef.current)
    .attr("width", dimensions.width - margin.left - margin.right)
    .attr("height", 320)
    .style("fill", "none")
    .append("g")
    .attr("transform", "translate(40,20)");

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
    .size([320 - margin.top - margin.bottom, dimensions.width * 0.3]);
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
        "h 80 V" +
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
    .attr("height", 25);

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
    .style("font-size", 15)
    .style("text-anchor", "left")
    .style("dominant-baseline", "middle");

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
}
