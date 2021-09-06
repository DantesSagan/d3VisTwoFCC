/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { extent, pointer } from 'd3';

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
      tooltipAndLegend();
    };
    req.send();

    // Declare global data for using json data's
    let data;
    let values;

    // Declare global xAxisScale and yAxisScale parameters
    let xAxisScale;
    let yAxisScale;
    // Declare global svg parameter
    let svg = d3.select('svg');
    // Declare global color parameter
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    const formatTime = d3.timeFormat('%M:%S');
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
        .attr('y', height - 750)
        .attr('id', 'title')
        .text('Drivers who alleged drug from 90 to now')
        .style('font-size', '1.5em');

      textContainer
        .append('text')
        .attr('x', 1050)
        .attr('y', 150)
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
      values.forEach((item) => {
        const parsedTime = item.Time.split(':');
        item.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
      });
      // Declare parsing data Time for declaring minutes and seconds for better understanding
      // Declare yScale our data parameters
      const yScale = d3
        .scaleTime()
        .domain(extent(values))
        .range([padding, height - padding]);
      // Declare formatting dataYear for parsing data time
      const dataYear = values.map((item) => {
        return new Date(item.Year);
      });
      // Declare xScale our data parameters
      const xScale = d3
        .scaleLinear()
        .domain(extent(dataYear))
        .range([padding, width - padding]);
      // Declare xAxisScale what scaling dataYear
      xAxisScale = d3
        .scaleLinear()
        .domain([new Date(1994), new Date(2016)])
        // This is for left line which looks better but don't get passed all test's .domain([new Date(1992), new Date(2016)])
        .range([padding, width - padding]);
      // Declare yAxisScale what scaling dataTime
      yAxisScale = d3
        .scaleTime()
        .domain(
          extent(values, (item) => {
            return item.Time;
          })
        )
        .range([padding, height - padding]);
      return { xScale, yScale };
    };
    const tooltipAndLegend = () => {
      const legend = d3.select('svg').append('svg').attr('id', 'legend');
      const legendColors = legend
        .selectAll('#legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          return 'translate(0,' + (height / 2 - i * 20) + ')';
        });

      legendColors
        .append('rect')
        .attr('x', 930)
        .attr('y', -192)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);

      legendColors
        .append('text')
        .attr('x', 950)
        .attr('y', -180)
        .attr('id', 'legend-sign')
        .text((item) => {
          if (item) {
            return 'Riders = Doping test positive';
          } else {
            return 'Riders = Doping test negative';
          }
        })
        .style('font-size', '0.7em');
    };
    const drawCircles = () => {
      // Declare tooltip what decribe information which contains every info circle
      const tooltip = d3
        .select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden');
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
          return item.Time;
        })
        .attr('cx', (item) => {
          return xAxisScale(item.Year);
        })
        .attr('cy', (item) => {
          return yAxisScale(item.Time);
        })
        .style('fill', (item) => {
          return color(item.Doping !== '');
        })
        .attr('r', 5)
        .on('mouseover', (event, item) => {
          const [x, y] = pointer(event);
          tooltip.transition().duration(200).style('visibility', 'visible');
          tooltip.attr('data-year', item.Year);
          tooltip
            .html(
              'Name: ' +
                item.Name +
                '</br> Nat: ' +
                item.Nationality +
                '</br> Time: ' +
                formatTime(item.Time) +
                '</br> Year: ' +
                (item.Doping ? '<br/>' + item.Doping : '')
            )
            .style('left', x + 'px')
            .style('top', y - 50 + 'px');
        })
        .on('mouseout', () => {
          tooltip.transition().duration(200).style('visibility', 'hidden');
        });
    };
    // Declare generateAxis what create y and x axis in format y(M:S) and x(tick)
    const generateAxis = () => {
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
      <h2
        className='text-center text-4xl p-4'
        style={{ marginRight: '300px', marginLeft: '300px' }}
      >
        Visualize Data with a Scatterplot Graph
      </h2>
      <svg>
        <text x={width - 900} y={height - 20}></text>
      </svg>
    </div>
  );
}
