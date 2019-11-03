import React, { Component } from "react";
import * as d3 from "d3";
import { connect } from "react-redux";

const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class RadarChart extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [[]], track: 0, title: "" };
  }

  getData = () => {
    if (
      this.state.data[0].length == 0 ||
      this.state.track != this.props.track
    ) {
      var data = [];
      this.setState({ track: this.props.track });
      this.setState({ title: this.props.tracks[this.props.track].name });
      this.props.tracks.map(track => {
        track.analysis.map(features => {
          var analysis = Object.keys(features).map(function(feature) {
            if (
              [
                "danceability",
                "valence",
                "liveness",
                "speechiness",
                "energy",
                "instrumentalness",
                "acousticness"
              ].includes(feature)
            ) {
              var obj = {};
              obj["value"] = features[feature];
              obj["axis"] = feature;
              return obj;
            }
          });
          data.push(analysis.filter(feature => feature != undefined));
        });
      });

      data = data[this.props.track];
      this.setState({ data: [data] });
    }
  };

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    this.getData();
    if (this.state.data[0].length > 0) {
      console.log(this.state.data);
      const { width, height } = this.props;
      var axisGrid = d3.select(".axisWrapper");
      var angleSlice = (Math.PI * 2) / 7;
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      var allAxis = [
        "danceability",
        "energy",
        "speechiness",
        "acousticness",
        "instrumentalness",
        "liveness",
        "valence"
      ];
      const Format = d3.format(".0%");

      var rScale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, width / 2 - 75]);

      //Draw the background circles
      var circles = axisGrid
        .selectAll(".gridCircle")
        .data(d3.range(1, 5).reverse());

      circles
        .enter()
        .append("circle")
        .merge(circles)
        .attr("class", "gridCircle")
        .transition()
        .attr("r", function(d, i) {
          return ((width / 2 - 75) / 4) * d;
        })
        .style("fill", "whitesmoke")
        .style("stroke", "#CDCDCD");

      var circleLabels = axisGrid
        .selectAll(".axisLabel")
        .data(d3.range(1, 5).reverse());

      circleLabels
        .enter()
        .append("text")
        .merge(circleLabels)
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function(d) {
          return (-d * (width / 2 - 75)) / 4;
        })
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function(d, i) {
          return Format((1 * d) / 4);
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
        .attr("class", "axis")
        .append("line");

      axisGrid
        .selectAll(".axis")
        .select("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i) {
          return (
            rScale((width / 2 - 75) * 1.1) *
            Math.cos(angleSlice * i - Math.PI / 2)
          );
        })
        .attr("y2", function(d, i) {
          return (
            rScale((width / 2 - 75) * 1.1) *
            Math.sin(angleSlice * i - Math.PI / 2)
          );
        })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

      //Append the labels at each axis
      var axisLabels = axisGrid
        .selectAll(".axis")
        .selectAll(".legend")
        .data(allAxis);

      axisLabels
        .enter()
        .append("text")
        .merge(axisLabels)
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
        .data(this.state.data);

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

      var tips = d3
        .select(this.refs.chart)
        .select(".container")
        .select(".radarWrapper")
        .selectAll(".radarCircle")
        .data(this.state.data[0]);

      tips
        .enter()
        .append("circle")
        .attr("class", "radarCircle")
        .attr("r", 4)
        .merge(tips)
        .transition()
        .attr("cx", function(d, i) {
          return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("cy", function(d, i) {
          return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .style("fill", function(d) {
          return color(0);
        })
        .style("fill-opacity", 0.8);
    }
  }

  render() {
    const { width, height } = this.props;

    return (
      <>
        <div
          style={{
            margin: "40px auto"
          }}
        >
          <p>
            We can also explore characteristics of any of your favorite songs.
            Click a song in the table above to explore it with the radar chart
            below!
          </p>
          <p>
            Now showing:{" "}
            <span style={{ color: "#3182CE" }}>{this.state.title}</span>
          </p>
        </div>
        <svg width={width} height={height} ref="chart">
          <g
            className="container"
            transform={"translate(" + width / 2 + "," + height / 2 + ")"}
          >
            <g className="axisWrapper"></g>
            <g className="radarWrapper"></g>
          </g>
        </svg>
      </>
    );
  }
}

const mapStateToProps = ({ tracks }) => {
  return { tracks };
};

export default connect(mapStateToProps)(RadarChart);
