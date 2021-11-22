//index.html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>SVG Basics</title>
</head>
<body>
  
  <svg width="600" height="600">
    <rect x="300" y="100" fill="blue" width="100" height="200"></rect>
    <circle cx='200' cy='200' r='50' fill='pink' stroke="red" stroke-width="2"></circle>
    <line x1="100" y1="100" x2="120" y2="300" stroke="grey" stroke-width="3"></line>
    
<!-- triangle -->
    <path d="M 150 50 L 75 200 L 225 200 Z" fill="orange" />
<!-- curve using path - 1st set start position of control point, 2nd set end control state, 3rd set end position of the control point-->
    <path d="M 150 50 L 75 200 L 225 200 C 225 200 150 150 150 50" fill="orange" />
<!-- check our end control point -->
    <circle cx='150' cy='150' r='5' fill='grey'></circle>
    <line x1="225" y1="200" x2="150" y2="150" stroke="grey" stroke-width="1"></line>
  </svg>

<!-- <div></div> -->
    <div class="canvas"></div>
  
<!-- d3.library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.7.0/d3.js"></script>
    <script src="index.js"></script>
</body>
</html>


//index.js
// const a = document.querySelectorAll('div');
// const b = d3.selectAll('div');
// console.log(a, b)

const canvas = d3.select('.canvas');

// append the SVG container
const svg = canvas.append('svg');

// append the SVG container
const svg = canvas.append('svg')
  .attr('width', 600)
  .attr('height', 600);

// create a group
const group = svg.append('g')
  .attr('transform', 'translate(0, 100)');    //translate the whole group by the x-axis and y-axis

// append the SVG elements (shapes) to the SVG container
svg.append('rect')
  .attr('width', 200)
  .attr('height', 100)
  .attr('fill', 'blue')
  .attr('x', 20)
  .attr('y', 20);

svg.append('circle')
  .attr('r', 50)
  .attr('cx', 300)
  .attr('cy', 70)
  .attr('fill', 'pink');

svg.append('line')
  .attr('x1', 370)
  .attr('x2', 400)
  .attr('y1', 20)
  .attr('y2', 120)
  .attr('stroke', 'red');

svg.append('text')
  .attr('x', 20)
  .attr('y', 200)
  .attr('fill', 'grey')
  .text('hello, ninjas')
  .style('font-family', 'arial')
  .attr('transform', 'translate(0, -100)');
 
