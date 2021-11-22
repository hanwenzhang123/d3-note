//linear scale - length of the bar driver by the data
//brand scales - scale the different categories in a bar chart
domain - input value
range - output value


//index.js
const svg = d3.select('svg');

d3.json('menu.json').then(data => {

  const y = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, 500]);

  //console.log(y(400)) //200 - output value
  //console.log(y(0)) //0
  //console.log(y(800)) //400
  
  const x = d3.scaleBand()
   .domain(data.map(item => item.name))
   .range([0, 500])
   .paddingInner(0.2)
   .paddingOuter(0.2);
  
//   console.log(x('veg burger'));
//   console.log(x('veg curry'));

  // join the data to circs
  const rects = svg.selectAll('rect')
    .data(data);

  // add attrs to circs already in the DOM
  rects.attr('width', 50)
    .attr("height", d => y(d.orders))   //scale the y linear scale
    .attr('fill', 'orange')
    .attr('x', (d, i) => i * 70)

  // append the enter selection to the DOM
  rects.enter()
    .append('rect')
      .attr('width', 50)
      .attr("height", d => y(d.orders)) //scale the y linear scale
      .attr('fill', 'orange')
      .attr('x', (d, i) => i * 70)

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
          <rect></rect>
      </svg>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.7.0/d3.js"></script>
    <script src="index.js"></script>
</body>


//menu.json
[
  {
    "name": "veg soup",
    "orders": 200
  },
  {
    "name": "veg curry",
    "orders": 600
  },
  {
    "name": "veg pasta",
    "orders": 300
  },
  {
    "name": "veg surprise",
    "orders": 900
  }
]
</html>
