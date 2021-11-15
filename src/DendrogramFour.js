import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./Dendrogram.css";

export default function DendrogramFour() {
  const width = 900;
  const height = 500;
  const margin = { top: 50, right: 30, bottom: 30, left: 60 };
  const d3Chart = useRef();
  const svg = d3
    .select(d3Chart.current)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("fill", "none")
    .append("g")
    .attr("transform", "translate(40,40)");

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

  const dataStructure = d3
    .stratify()
    .id(function (d) {
      return d.child;
    })
    .parentId(function (d) {
      return d.parent;
    })(data);
  //define tree structure layout
  const treeStructure = d3.tree().size([400, 600]);
  //get the information from data
  const information = treeStructure(dataStructure);
  console.log(information.descendants());
  console.log(information.links());

  const connections = svg
    .append("g")
    .selectAll("path")
    .data(information.links());

  connections
    .enter()
    .append("path")
    .attr("d", function (d) {
      console.log(d);
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
    .attr("stroke", "gray");

  const rectangles = svg
    .append("g")
    .selectAll("rect")
    .data(information.descendants());
  rectangles
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return d.y - 40;
    })
    .attr("y", function (d) {
      return d.x - 20;
    })
    .style("fill", "white")
    .attr("stroke", "white")
    .attr("width", 80)
    .attr("height", 40);

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
      return d.y;
    })
    .attr("y", function (d) {
      return d.x;
    })
    .style("text-anchor", "middle")
    .style("dominant-baseline", "middle");

  return (
    <div>
      <svg ref={d3Chart}></svg>
    </div>
  );
}
