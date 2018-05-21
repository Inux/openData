"use strict;"

//set with and height
var width = 960;
var height = 1000;

console.log("Window -> Width: " + width + ", Height: " + height)

//svg - d3.js configuration
let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//force - d3.js configuration
let force = d3.layout.force()
    .size([width, height])

var graph = {};
graph.draw = (csv) => {
    //tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.dsv(';')(csv, (error, links) => {
        if (error) throw error;

        var nodesByName = {};

        // Create nodes for each unique source and target.
        links.forEach(function (link) {
            link.source = nodeByName(link.AbsenderIn);
            link.target = nodeByName(link.AdressatIn);
        });

        // Extract the array of nodes from the map by name.
        var nodes = d3.values(nodesByName);
        console.log(nodes)

        // Create the link lines.
        var link = svg.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link")
            .on("mouseover", onLinkMouseOver)
            .on("mouseout", onMouseOut);

        // Create the node circles.
        var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("r", function (d) { return Math.sqrt(d.weight) / 10 || 4.5; })
            .style("fill", color)
            .on("mouseover", onNodeMouseOver)
            .on("mouseout", onMouseOut)
            .call(force.drag);

        // Start the force layout.
        force
            .nodes(nodes)
            .links(links)
            .on("tick", tick)
            .start();

        function nodeByName(name) {
            return nodesByName[name] || (nodesByName[name] = { name: name });
        }

        function tick() {
            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node.attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
                .attr("r", function (d) { return Math.sqrt(d.weight) / 10 || 4.5; });
        }

        function color(d) {
            return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
        }

        function getNodeText(node) {
            console.log(node);
            return "<strong>Node</strong><br/>" + 
                "Name: " + node.name + "<br/>";
        }

        function getLinkText(link) {
            console.log(link);
            return "<strong>Link</strong><br/>" + 
                "AbsenderIn: " + link.AbsenderIn + "<br/>" +
                "AdressatIn: " + link.AdressatIn + "<br/>" +
                "Titel: " + link.Titel_Name + "<br/>";
        }

        function drawTooltip(data, isNode) {
            var text = "";
            if (isNode) {
                text = getNodeText(data);
            } else {
                text = getLinkText(data);
            }

            div.transition()
                .duration(200)
                .style("opacity", .9);

            div.html(text);
        }

        function onNodeMouseOver(e) {
            if (!e.preventDefault) {
                drawTooltip(e, true);
            }
        }

        function onLinkMouseOver(e) {
            if (!e.preventDefault) {
                drawTooltip(e, false);
            }
        }

        function onMouseOut(e) {
            if (!e.preventDefault) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            }
        }
    });
}
