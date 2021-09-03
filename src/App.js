/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { extent } from 'd3';

export default function App() {
  const [url] = useState(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  );
  const [req] = useState(new XMLHttpRequest());
  const width = 1200;
  const height = 800;
  const padding = 120;
  useEffect(() => {
    // Getting XMLTttpReques from url
    req.open('GET', url, true);
    req.onload = () => {
      // Parsing json fomr url
      data = JSON.parse(req.responseText);
      // Our data which contains data's what we need
      values = data;
      drawCanvas();
      generateScales();
      drawCircles();
      generateAxis();
      infoText();
    };
    req.send();
    // Declare global data for using json data's
    let data;
    let values = [];
    // Declare global xScale and yScale parameters
    let xScale;
    let yScale;
    // Declare global xAxisScale and yAxisScale parameters
    let xAxisScale;
    let yAxisScale;
    // Declare global svg parameter
    let svg = d3.select('svg');
    // Declare global color parameter
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    const infoText = () => {
      // Text notaion for declaring Title, Legend and Time paremeter's
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

    // Declare global drawCanvas which using like background canvas contains all our visualization data
    const drawCanvas = () => {
      svg.attr('width', width).attr('height', height);
    };

    const generateScales = () => {
      // Declare parsing data Time for declaring minutes and seconds for better understanding
      values.forEach((item) => {
        const parsedTime = item.Time.split(':');
        item.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
      });
      // Declare yScale our data parameters
      yScale = d3
        .scaleLinear()
        .domain(extent(values))
        .range([padding, height - padding]);
      // Declare formatting dataYear for parsing data time
      const dataYear = values.map((item) => {
        return new Date(item.Year);
      });
      // Declare xScale our data parameters
      xScale = d3
        .scaleLinear()
        .domain(extent(dataYear))
        .range([padding, width - padding]);
      // Declare xAxisScale what scaling dataYear
      xAxisScale = d3
        .scaleLinear()
        .domain(extent(dataYear))
        .range([padding, width - padding]);
      // Declare yAxisScale what scaling dataTime
      yAxisScale = d3
        .scaleLinear()
        .domain(
          extent(values, (item) => {
            return item.Time;
          })
        )
        .range([padding, height - padding]);
    };

    const drawCircles = () => {
      // Declare tooltip what decribe information which contains every info circle
      const tooltip = d3
        .select('.hoverHolder')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('width', 'auto')
        .style('height', 'auto');
      // Declaring circles by x and y axis
      svg
        .selectAll('.dot')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', (item) => {
          return item.Year;
        })
        .attr('data-yvalue', (item) => {
          return item.Time.toISOString();
        })
        .attr('cx', (item) => {
          return xScale(item.Year);
        })
        .attr('cy', (item) => {
          return yScale(item.Time);
        })
        .style('fill', (item) => {
          return color(item.Doping !== '');
        })
        .attr('r', 5);

      // svg
      //   .selectAll('text')
      //   .data(values)
      //   .enter()
      //   .append('text')
      //   .text(
      //     () =>
      //       xScale +
      //       // .toFixed(1).replace(/(\d)\,(\d{3})/g, /(d)(d{3})/g)
      //       ',' +
      //       yScale
      //   )
      //   .attr('x', (item) => xScale(item.Year))
      //   .attr('y', (item) => yScale(item.Time));
    };
    // Declare generateAxis what create y and x axis in format y(M:S) and x(tick)
    const generateAxis = () => {
      const formatTime = d3.timeFormat('%M:%S');
      const xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format('d'));
      const yAxis = d3.axisLeft(yAxisScale).tickFormat(formatTime);
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
