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
        <rect></rect>
        <rect></rect>
        <rect></rect>
      </svg>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.7.0/d3.js"></script>
    <script src="index.js"></script>
</body>
</html>
