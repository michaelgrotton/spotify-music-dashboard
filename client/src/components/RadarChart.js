import React, { Component } from "react";
import * as d3 from "d3";
import { connect } from "react-redux";

const margin = { top: 100, right: 35, bottom: 20, left: 35 };
const allAxis = [
  "danceability",
  "energy",
  "speechiness",
  "acousticness",
  "instrumentalness",
  "liveness",
  "valence"
];
const config = { levels: 4 };

class RadarChart extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [[]], track: 0, title: "" };
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    const { width, height } = this.props;
    var axisGrid = d3.select(".axisWrapper");
    var angleSlice = (Math.PI * 2) / allAxis.length;
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    const Format = d3.format(".0%");

    var rScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, width / 2 - margin.left - margin.right]);

    //Draw the background circles
    var circles = axisGrid
      .selectAll(".gridCircle")
      .data(d3.range(1, config.levels + 1).reverse());

    circles
      .enter()
      .append("circle")
      .merge(circles)
      .attr("class", "gridCircle")
      .transition()
      .attr("r", function(d, i) {
        return ((width / 2 - margin.left - margin.right) / config.levels) * d;
      })
      .style("fill", "whitesmoke")
      .style("stroke", "#CDCDCD");

    var circleLabels = axisGrid
      .selectAll(".axisLabel")
      .data(d3.range(1, config.levels + 1).reverse());

    circleLabels
      .enter()
      .append("text")
      .merge(circleLabels)
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", function(d) {
        return (-d * (width / 2 - margin.left - margin.right)) / config.levels;
      })
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text(function(d, i) {
        return Format((1 * d) / config.levels);
      });

    var radarLine = d3
      .lineRadial()
      .radius(function(d) {
        return rScale(d.value);
      })
      .angle(function(d, i) {
        return i * angleSlice;
      });

    var axis = axisGrid
      .selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line");
    axis.append("text");

    axisGrid
      .selectAll(".axis")
      .select("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function(d, i) {
        return (
          rScale((width / 2 - margin.left - margin.right) * 1.1) *
          Math.cos(angleSlice * i - Math.PI / 2)
        );
      })
      .attr("y2", function(d, i) {
        return (
          rScale((width / 2 - margin.left - margin.right) * 1.1) *
          Math.sin(angleSlice * i - Math.PI / 2)
        );
      })
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    axisGrid
      .selectAll(".axis")
      .select("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", function(d, i) {
        return rScale(1.25) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr("y", function(d, i) {
        return rScale(1.25) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .text(function(d) {
        return d;
      });

    var blobWrapper = d3
      .select(this.refs.chart)
      .select(".container")
      .select(".radarWrapper")
      .selectAll("path")
      .data(this.props.data);

    blobWrapper
      .enter()
      .append("path")
      .merge(blobWrapper)
      .style("fill", function(d, i) {
        return color(i);
      })
      .style("fill-opacity", 0.5)
      .attr("d", function(d, i) {
        return radarLine(d);
      });

    blobWrapper.exit().remove();
  }

  render() {
    const { width, height } = this.props;
    const svgHeight = height / 2;
    const svgWidth = width / 2;
    console.log(svgHeight, svgWidth);
    return (
      <svg width={width} height={height} ref="chart">
        <g
          className="container"
          transform={"translate(" + svgHeight + "," + svgWidth + ")"}
        >
          <g className="axisWrapper"></g>
          <g className="radarWrapper"></g>
        </g>
      </svg>
    );
  }
}

const mapStateToProps = ({ tracks }) => {
  return { tracks };
};

export default connect(mapStateToProps)(RadarChart);
