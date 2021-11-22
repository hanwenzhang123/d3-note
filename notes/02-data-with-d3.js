//html.js
//select single element / using arrow function
const data = [
  {width: 200, height: 100, fill: 'purple'}
];

// select the svg container first
const svg = d3.select('svg');

// svg.select('rect')
//   .data(data)
//   .attr('width', function(d,i,n){ return d.width })    //i is the index which is 0, n is the current selection which here is the rect
//   .attr('height', function(d){ return d.height })
//   .attr('fill', function(d){ return d.fill });

//this keyword in arrow function - Window
//this keyword in regular function - the element of the data property belongs to

//using arrow function 
svg.select('rect')    //only select the first element matches ('rect')
  .data(data)
  .attr('width', (d,i,n) => d.width)    //console.log(n[i]) -> can be referred to as "this" in arrow function to grab the current element
  .attr('height', d => d.height)
  .attr('fill', d => d.fill);


//joining data to multiple elements
const data = [
  {width: 200, height: 100, fill: 'purple'},
  {width: 100, height: 60, fill: 'pink'},
  {width: 50, height: 30, fill: 'red'}
];

// select the svg container first
const svg = d3.select('svg');

// console.log(d3.selectAll('rect').data(data))
const rects = svg.selectAll('rect')   //select all the ('rect')
  .data(data)
  .attr('width', d => d.width)
  .attr('height', d => d.height)
  .attr('fill', d => d.fill);


// join the data to rects
const data = [
  {width: 200, height: 100, fill: 'purple'},
  {width: 100, height: 60, fill: 'pink'},
  {width: 50, height: 30, fill: 'red'}
];

// select the svg conatiner first
const svg = d3.select('svg');

// join the data to rects
const rects = svg.selectAll('rect')
  .data(data);

// add attrs to rects already in the DOM
rects.attr('width', d => d.width)
  .attr('height', d => d.height)
  .attr('fill', d => d.fill);

// append the enter selection to the DOM
const added = rects.enter()
  .append('rect')
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('fill', d => d.fill);


//external data from JSON
// select the svg conatiner first
const svg = d3.select('svg');

d3.json('planets.json').then(data => {    //return a promise

  // join the data to circs
  const circs = svg.selectAll('circle')
    .data(data);    //join the data

  // add attrs to circs already in the DOM
  circs.attr('cy', 200)
    .attr('cx', d => d.distance)
    .attr('r', d => d.radius)
    .attr('fill', d => d.fill);

  // append the enter selection to the DOM
  circs.enter()
    .append('circle')
      .attr('cy', 200)
      .attr('cx', d => d.distance)
      .attr('r', d => d.radius)
      .attr('fill', d => d.fill);

});


//index.html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>SVG Basics</title>
</head>
<body>
  
    <div class="canvas">
      <svg width="600" height="600">
//         <rect></rect>
//         <rect></rect>  -> no needs for enter(), dynamically append the tag
//         <rect></rect>
      </svg>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.7.0/d3.js"></script>
    <script src="index.js"></script>
</body>
</html>


// planets.json
[
  {
    "radius": 50,
    "distance": 110,
    "fill": "orange"
  },
  {
    "radius": 70,
    "distance": 260,
    "fill": "red"
  },
  {
    "radius": 35,
    "distance": 400,
    "fill": "brown"
  },
  {
    "radius": 55,
    "distance": 530,
    "fill": "green"
  }
]
