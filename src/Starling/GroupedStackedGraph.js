import React, { useEffect, useState, useRef } from 'react';
import {
  select,
  selectAll,
  scaleBand,
  axisBottom,
  stack,
  max,
  scaleLinear,
  axisLeft,
  format,
  event,
  stackOrderDescending,
  nest,
  scaleOrdinal
} from 'd3';
import { titleMap } from '../InsightsTableConfig';
const GroupedStackedGraph = ({
  barData,
  selectedList,
  colors,
  primary,
  dimensions,
  metericSelected,
  keyDimension,
  primaryGrouped,
  activeLegend,
  selectLegend
}) => {
  const [seriesData, setSeriesData] = useState([]);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const prevFirstRun = useRef(true);
  let svg = select(svgRef.current);
  const { secondary, tertiary } = dimensions;
  let barWidth = window.innerWidth * 0.91;
  let tooltip;
  let barHeight = 320;
  let g = svg;
  const margin = { top: 1, right: 80, bottom: 27, left: 20 };
  const height = barHeight - margin.top - margin.bottom;

  let xScale = scaleLinear();

  let y0Scale = scaleOrdinal();
  let yaxisScale = scaleOrdinal();

  let y1Scale = scaleBand();

  const getLayers = series => {
    let stackGen = stack().keys(Object.keys(colors));
    return stackGen(series);
  };

  const getScale = (xScale, val) => {
    return Number.isNaN(val) ? 0 : xScale(val);
  };

  const xAxisTickFormat = number =>
    number > 1000 ? format('.3s')(number).replace('G', 'B') : number;

  const percentFormat = number => format('.2f')(number);

  const updateXaxis = (xScale, leftMargin, maxDomain) => {
    const xAxis = axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
      .tickSize(10);
    svg
      .select('.x-axis')
      .attr('transform', `translate(${leftMargin}, ${height})`)
      .call(xAxis);

    if (maxDomain === 0) {
      svg.select('.x-axis .tick').attr('transform', `translate(0, 0)`);
    }
    //set style ticks,text and line for x axis
  };

  const updateToolTip = (tooltip, sequence, subgroupName) => {
    selectAll('.toolTipBar > *').remove();

    let sequenceData = sequence.data;

    let tooltipData = Object.keys(sequenceData);

    let tooltipContent = tooltip
      .append('div')
      .attr('class', 'tooltip-content')
      .style('width', '100%')
      .style('height', 'auto')
      .style('top', '9%');
    let tooltipListContainer = tooltipContent
      .append('ul')
      .style('width', '100%')
      .style('display', 'flex')
      .style('flex-direction', 'column');
    let list = tooltipListContainer
      .selectAll()
      .data(tooltipData.slice(1, tooltipData.length - 1))
      .enter()
      .append('li')
      .style('font-size', '14px')
      .style('color', eachKey => {
        return colors[eachKey];
      })
      .style('display', 'flex')
      .style('align-items', 'center');
    let span1 = list
      .append('span')
      .attr('class', 'name')
      .style('font-weight', d => (d === subgroupName ? 'bold' : 'normal'));

    span1
      .append('span')
      .text(eachKey => titleMap[eachKey] || eachKey.replace(/['"]+/g, ''));
    let span2 = list
      .append('span')
      .text(eachKey => {
        if (eachKey === secondary) return sequenceData[eachKey];
        return metericSelected.includes('%')
          ? percentFormat(sequenceData[eachKey]) + '%'
          : xAxisTickFormat(sequenceData[eachKey]);
      })
      .attr('class', eachKey => {
        if (eachKey === secondary) return 'name';
        return 'value';
      })
      .style('font-weight', d => (d === subgroupName ? 'bold' : 'normal'));
  };

  const updateGroupedBars = (
    layers,
    xScale,
    y0Scale,
    secondaryScale,
    tooltip
  ) => {
    var barg = g
      .selectAll('.layer')
      .data(layers)
      .join('g')
      .attr(
        'class',
        d => 'layer sbc' + (d.key || '').replace(/[^a-zA-Z0-9_]/g, '_')
      )
      .attr('fill', layer => {
        let colorKey = layer.key;
        return colors[colorKey];
      });

    barg
      .selectAll('rect')
      .data(layer => layer)
      .join('rect')
      .attr('class', d => d.key)
      .attr('y', (sequence, i) => {
        const parent = sequence.data[secondary];
        return (
          y0Scale(parent) + secondaryScale.get(parent)(sequence.data[tertiary])
        );
      })
      .attr('x', sequence => getScale(xScale, sequence[0]))
      .attr('width', 0)
      .attr('height', sequence =>
        secondaryScale.get(sequence.data[secondary]).bandwidth()
      )
      .on('mousemove', sequence => {
        tooltip
          .style('left', event.pageX - 50 + 'px')
          .style('top', event.pageY - 70 + 'px')
          .style('display', 'inline-block');
      })
      .on('mouseover', function(sequence) {
        var subgroupName = select(this.parentNode).datum().key;
        tooltip
          .style('left', event.pageX - 50 + 'px')
          .style('top', event.pageY - 70 + 'px')
          .style('display', 'inline-block');
        updateToolTip(tooltip, sequence, subgroupName);
        selectLegend();
        selectAll('rect').style('stroke-width', 0);
        select(this)
          .style('stroke-width', 2)
          .style('stroke', '#333');
      })
      .on('mouseout', sequence => {
        tooltip.style('display', 'none');
        selectLegend();
        selectAll('rect').style('stroke-width', 0);
      });

    svg
      .selectAll('rect')
      .transition()
      .duration(400)
      .attr('width', sequence =>
        Math.max(
          0,
          getScale(xScale, sequence[1]) - getScale(xScale, sequence[0])
        )
      );
  };

  const updateBars = (layers, xScale, y1Scale, tooltip) => {
    g.selectAll('.layer')
      .data(layers)
      .join('g')
      .attr(
        'class',
        d => 'layer sbc' + (d.key || '').replace(/[^a-zA-Z0-9_]/g, '_')
      )
      .attr('fill', layer => {
        let colorKey = layer.key;
        return colors[colorKey];
      })
      .selectAll('rect')
      .data(layer => layer)
      .join('rect')
      .attr('x', sequence => getScale(xScale, sequence[0]))
      .attr('width', sequence => 0)
      .attr('y', sequence => y1Scale(sequence.data[primary]))
      .attr('height', y1Scale.bandwidth())
      .on('mousemove', sequence => {
        tooltip
          .style('left', event.pageX - 50 + 'px')
          .style('top', event.pageY - 70 + 'px')
          .style('display', 'inline-block');
      })
      .on('mouseover', function(sequence) {
        var subgroupName = select(this.parentNode).datum().key;
        tooltip
          .style('left', event.pageX - 50 + 'px')
          .style('top', event.pageY - 70 + 'px')
          .style('display', 'inline-block');
        updateToolTip(tooltip, sequence, subgroupName);
        selectLegend();
        selectAll('rect').style('stroke-width', 0);
        select(this)
          .style('stroke-width', 2)
          .style('stroke', '#333');
      })
      .on('mouseout', sequence => {
        tooltip.style('display', 'none');
        selectLegend();
        selectAll('rect').style('stroke-width', 0);
      });

    svg
      .selectAll('rect')
      .transition()
      .duration(400)
      .attr('width', sequence =>
        Math.max(
          0,
          getScale(xScale, sequence[1]) - getScale(xScale, sequence[0])
        )
      );
  };

  useEffect(() => {
    if (prevFirstRun.current) {
      prevFirstRun.current = false;
      return;
    }

    const sData = barData.map(eachBar => {
      let barKeys = Object.keys(eachBar);
      let newBarRow = {};
      barKeys.forEach(k => {
        if (eachBar[k][metericSelected] !== undefined)
          newBarRow[k] = eachBar[k][metericSelected];
        else newBarRow[k] = eachBar[k];
      });
      return newBarRow;
    });
    selectAll('#chartVis .x.axis').remove();
    selectAll('.toolTipBar').remove();
    selectAll('.mouse-over-effects').remove();
    selectAll('#chartVis .layer').remove();
    setSeriesData(sData);
  }, [metericSelected, barData]);

  useEffect(() => {
    selectLegend();
    let layers = getLayers(seriesData);
    svg = select(svgRef.current);

    const maxLengthPrimary = max(Object.keys(primaryGrouped), pr => pr.length);
    const marginLeftVal = maxLengthPrimary
      ? Math.max(margin.left, maxLengthPrimary * 3.1)
      : margin.left;

    const width = barWidth - marginLeftVal - margin.right;

    xScale.range([0, width]);

    svg.selectAll('.plot').remove();

    g = svg
      .append('g')
      .attr('class', 'plot')
      .attr('width', width + marginLeftVal + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('transform', `translate(${marginLeftVal},${margin.top})`);

    selectAll('.toolTipBar').remove();
    tooltip = select('#chartVis')
      .append('div')
      .attr('class', 'toolTipBar')
      .style('background-color', '#FFFFF')
      .style('padding', 2);
    selectAll('#chartVis .layer').remove();

    let maxDomain = max(layers, layer => max(layer, sequence => sequence[1]));

    xScale.domain([0, maxDomain]);

    //need to work on from here
    if (keyDimension === tertiary) {
      //Nested Data Structure
      const selectedGroupValue = [];
      seriesData.map(data => {
        selectedGroupValue.push({
          group: data[primary],
          value: data[secondary]
        });
      });
      console.log('selectedGroupValue', selectedGroupValue);
      console.log('selectedList', selectedList);

      const groupedData = nest()
        .key(function(d) {
          return d.group;
        })
        .entries(selectedGroupValue);

      // console.log('groupedData', groupedData);
      // console.log('seriesData', seriesData);

      let barHeight = height / seriesData.length;

      const dom_primary = seriesData.map(d => d[primary]);
      const dom_secondary = seriesData.map(d => d[secondary]);
      // console.log('dom_primary : ', dom_primary);
      // console.log('dom_secondary: ', dom_secondary);

      y0Scale.domain(dom_secondary);
      yaxisScale.domain([''].concat(dom_secondary).concat(['']));

      const y0Range = [0];
      const yaxisRange = [0];
      let secondaryScale = nest()
        .key(d => d[secondary])
        .rollup(d => {
          let barSpace = barHeight * d.length;
          yaxisRange.push(y0Range[y0Range.length - 1] + barSpace / 2);
          y0Range.push(y0Range[y0Range.length - 1] + barSpace);
          return scaleBand()
            .domain(d.map(p => p[tertiary]))
            .rangeRound([0.04 * barSpace, barSpace * 0.96])
            .padding(0.24);
        })
        .map(seriesData);

      yaxisRange.push(height); //the height of the graph
      y0Scale.range(y0Range); //bar range empty space
      yaxisScale.range(yaxisRange); //yaxis label range
      xScale.range([150, width]); //change xScale range size
      updateGroupedBars(layers, xScale, y0Scale, secondaryScale, tooltip);

      //outer y-axis range for the primary dimensions
      const yaxisOuterRange = [0];
      const verticalLine = [];
      let tempValue = 0;
      groupedData.forEach(d => {
        let axisSpace = barHeight * d.values.length;
        tempValue = tempValue + axisSpace;
        yaxisOuterRange.push(
          yaxisOuterRange[yaxisOuterRange.length - 1] + tempValue / 2
        );
        if (d.values.length > 1) {
          const index = dom_secondary.indexOf(d.values[0].value);
          const startPoint = yaxisRange[index + 1];
          const lengthIndex = index + d.values.length;
          const endPoint = yaxisRange[lengthIndex];
          verticalLine.push({
            start: startPoint,
            length: endPoint - startPoint
          });
        }
      });
      yaxisOuterRange.push(height);

      const yaxisLine = yaxisRange.slice(1, -1);
      const yaxisOuterLine = yaxisOuterRange.slice(1, -1);

      // console.log('yaxisRange: ', yaxisRange);
      // console.log('yaxisOuterRange: ', yaxisOuterRange);
      // console.log('yaxisLine: ', yaxisLine);
      // console.log('yaxisOuterLine: ', yaxisOuterLine);
      // console.log('verticalLine: ', verticalLine);

      const container = svg
        .select('.y-axis')
        .attr('transform', `translate(${marginLeftVal + 150}, 0)`) //move y-axes to the right by 150
        .call(axisLeft(yaxisScale))
        .attr('text-anchor', 'end');

      container.append('g').attr('class', 'group-labels');
      container.append('g').attr('class', 'outer-lines');
      container.append('g').attr('class', 'vertical-lines');
      container.append('g').attr('class', 'inner-lines');

      g.selectAll('.group-label')
        .data(groupedData)
        .enter()
        .append('text')
        .attr('class', 'group-label')
        .attr('text-anchor', 'end')
        .attr('font-size', '10')
        .attr('font', 'sans-serif')
        .attr('y', (d, i) => yaxisOuterRange[i + 1] + 3)
        .text(function(d, i) {
          return d.key;
        });

      g.selectAll('.outer-lines')
        .data(yaxisOuterLine)
        .enter()
        .append('line')
        .attr('class', 'outer-lines')
        .attr('transform', (d, i) => `translate(5, ${d})`)
        .attr('stroke', 'currentColor')
        .attr('x2', 20);

      g.selectAll('.vertical-lines')
        .data(verticalLine)
        .enter()
        .append('line')
        .attr('class', 'vertical-lines')
        .attr('transform', (d, i) => `translate(25, ${d.start})`) //where the vertical line starts
        .attr('stroke', 'currentColor')
        .attr('y2', d => d.length); //how long the vertical line is

      g.selectAll('.inner-lines')
        .data(yaxisLine)
        .enter()
        .append('line')
        .attr('class', 'inner-lines')
        .attr('transform', (d, i) => `translate(25, ${d})`)
        .attr('stroke', 'currentColor')
        .attr('x2', 20);
    } else {
      y1Scale
        .domain(seriesData.map(d => d[primary]))
        .range([0, height])
        .padding(0.4);

      updateBars(layers, xScale, y1Scale, tooltip);

      svg
        .select('.y-axis')
        .attr('transform', `translate(${marginLeftVal}, 0)`)
        .call(axisLeft(y1Scale));
    }

    selectAll('#chartVis .x.axis').remove();
    updateXaxis(xScale, marginLeftVal, maxDomain);

    g.exit().remove();
  }, [seriesData, barWidth]);

  useEffect(() => {
    g.selectAll('.layer')
      .selectAll('rect')
      .style('stroke-width', 0);
    if (!activeLegend) return;
    const layers = g.selectAll(
      '.sbc' + activeLegend.replace(/[^a-zA-Z0-9_]/g, '_')
    );
    layers
      .selectAll('rect')
      .style('stroke-width', 2)
      .style('stroke', '#333');
  }, [activeLegend]);

  return (
    <div
      ref={wrapperRef}
      className="bar-grph-cntnr"
      style={{ marginBottom: '2rem' }}
      id="chartVis"
    >
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};
export default GroupedStackedGraph;
