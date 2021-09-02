/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { extent, min } from 'd3';

export default function App() {
  const [url] = useState(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  );
  const [req] = useState(new XMLHttpRequest());
  const width = 1200;
  const height = 800;
  const padding = 120;
  useEffect(() => {
    req.open('GET', url, true);
    req.onload = () => {
      data = JSON.parse(req.responseText);
      values = data;
      drawCanvas();
      generateScales();
      drawCircles();
      generateAxis();
      infoText();
    };
    req.send();
    let data;
    let values = [];

    let xScale;
    let yScale;

    let xValue = values.map((item) => item.Year);
    let yValue = (item) => item.Time;

    let xAxisScale;
    let yAxisScale;

    let svg = d3.select('svg');

    const infoText = () => {
      let textContainer = d3
        .select('svg')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      textContainer
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -350)
        .attr('y', 150)
        .text('Timer Minutes');

      textContainer
        .append('text')
        .attr('x', width - 850)
        .attr('y', height - 720)
        .attr('id', 'title')
        .text('Drivers who alleged drug from 90 to now')
        .style('font-size', '1.5em');

      textContainer
        .append('text')
        .attr('x', 1050)
        .attr('y', 150)
        .attr('id', 'legend')
        .text('Legend')
        .style('font-size', '1.5em');
    };

    // const formatTime = (time) => {
    //   const minutes = Math.floor(time / 60);
    //   const ss = time % 60;
    //   return (
    //     (minutes < 10 ? '0' + minutes : minutes) +
    //     ':' +
    //     (ss < 10 ? '0' + ss : ss)
    //   );
    // };

    const drawCanvas = () => {
      svg.attr('width', width);
      svg.attr('height', height);
    };
    const generateScales = () => {
      const dataTime = values.map((item) => {
        return item.Time;
      });
      yScale = d3
        .scaleLinear()
        .domain(extent(dataTime))
        .range([0, height - 2 * padding]);

      const dataYear = values.map((item) => {
        return new Date(item.Year);
      });

      xScale = d3
        .scaleLinear()
        .domain(extent(dataYear))
        .range([padding, width - padding]);

      xAxisScale = d3
        .scaleLinear()
        .domain(extent(dataYear))
        .range([padding, width - padding]);

      yAxisScale = d3
        .scaleLinear()
        .domain(
          extent(values, (item) => {
            return item.Time;
          })
        )
        .range([height - padding, padding]);
    };

    const drawCircles = () => {
      const tooltip = d3
        .select('.hoverHolder')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('width', 'auto')
        .style('height', 'auto');

      svg
        .selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', (item) => {
          return item.Year;
        })
        .attr('data-yvalue', (item) => {
          return item.Time;
        })
        .attr('r', 5);

      svg
        .selectAll('text')
        .data(values)
        .enter()
        .append('text')
        .text(
          () =>
            xScale +
            // .toFixed(1).replace(/(\d)\,(\d{3})/g, /(d)(d{3})/g)
            ',' +
            yScale
        )
        .attr('x', (item) => xScale(item.Year))
        .attr('y', (item) => yScale(item.Time));
    };

    const generateAxis = () => {
      const xAxis = d3.axisBottom(xAxisScale);
      const yAxis = d3.axisLeft(yAxisScale);
      svg
        .append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
        .style('font-size', '18px');

      svg
        .append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ',  0)')
        .style('font-size', '18px');

      return { xAxis, svg, yAxis };
    };
  }, []);

  return (
    <div>
      <h2 className='text-center text-4xl p-4'>
        Visualize Data with a Scatterplot Graph
      </h2>
      <svg>
        <text x={width - 900} y={height - 20}></text>
      </svg>
      <div className='hoverHolder shadow-inner rounded-t-lg font-bold '></div>
    </div>
  );
}
