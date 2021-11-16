import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./Dendrogram.css";

export default function DendrogramTwo() {
  // main svg
  const width = 500;
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
  const treeStructure = d3.tree().size([500, 300]);
  //get the information from data
  const information = treeStructure(dataStructure);

  const circles = svg
    .append("g")
    .selectAll("circle")
    .data(information.descendants());
  circles
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", 5)
    .style("fill", "blue");

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
        d.source.x +
        "," +
        d.source.y +
        " C " +
        d.source.x +
        "," +
        (d.source.y + d.target.y) / 2 +
        " " +
        d.target.x +
        "," +
        (d.source.y + d.target.y) / 2 +
        " " +
        d.target.x +
        "," +
        d.target.y
      );
    })
    .style("fill", "none")
    .attr("stroke", "black");

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
      return d.x + 7;
    })
    .attr("y", function (d) {
      return d.y + 4;
    });

  return (
    <div>
      <svg ref={d3Chart}></svg>
    </div>
  );
}
