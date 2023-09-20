d3.dsv(",", "board_games.csv", function(d) {
    return {
      source: d.source,
      target: d.target,
      value: +d.value
    }
  }).then(function(data) {
  
    var links = data;
  
    var nodes = {};
    var node_degrees = {}
    
    // compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
        //console.log(link.source, link.target)
    });

    // var calculate_degrees = 

    links.forEach(function(link){
        var target_source_arr = [link.source, link.target]
        target_source_arr.forEach(function(link_item) {
            if (link_item.name in node_degrees){
                node_degrees[link_item.name] += 1
            } else {
                //console.log(node_degrees)
                node_degrees[link_item.name] = 1

                console.log(node_degrees)
            }
        })       
    })
    console.log("node degrees", node_degrees)
    // for (node_degree in node_degrees){

    // }
    
    var width = 1200,
        height = 700;

  
    var force = d3.forceSimulation()
        .nodes(d3.values(nodes))
        .force("link", d3.forceLink(links).distance(100))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("charge", d3.forceManyBody().strength(-250))
        .alphaTarget(1)
        .on("tick", tick);
  
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
  
    // add the links
    var path = svg.append("g")
        .selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("class", function(d) { return "link " + d.type; })
        .attr("stroke-dasharray", function(d){
            if(d.value == 0) {
                return ""  // set it to blank to avoid making it dashed
            } else if (d.value == 1){
                return "10,10"
            }
         })
        .style("stroke", function(d){
            if(d.value == 0) {
                return "gray"  // set it to blank to avoid making it dashed
            } else if (d.value == 1){
                return "green"
            }
         })
         .style("stroke-width", function(d){
            if(d.value == 0) {
                return 3  // set it to blank to avoid making it dashed
            } else if (d.value == 1){
                return 1
            }
         })

    console.log(path)
  
    // define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
            .on("dblclick", function(d){
                d.fx = null
                d.fy = null
                var d_name = d.name.replace(/\s+/g,'').toLowerCase()
                node.select(`#${d_name}`).style("fill", d.fill_color)
            })
  
    // add the nodes
    node.append("circle")
        .attr("id", function(d){
           return (d.name.replace(/\s+/g,'').toLowerCase());
        })
        .attr("r", function(d){
            // console.log(node_degrees[d.name]) // node_degrees
            var degree_of_node = node_degrees[d.name]
            var min_val = 3
            var max_val = 20

            var scaled_radius = ((min_val + degree_of_node) * 1.5)
            if (scaled_radius > max_val){
                scaled_radius = max_val
            }
            return scaled_radius
        })
        .style("fill", function(d){
            var radius = this.getAttribute("r")
            var fill_color = ""
            console.log(radius) // get the radius from the current d3 object (avoided using globals!)
            if (radius < 7){
                fill_color = "rgb(254,224,210)"
            } else if (radius >= 7 & radius <= 13){
                fill_color = "rgb(252,146,114)"
            } else { 
                fill_color = "rgb(222,45,38)"
            }
            d.fill_color = fill_color
            return fill_color
        })
    
    node.append("text")
        .attr("dx", 10)
        .attr("dy", 0)
        .text(function(d) { return d.name });

    console.log(nodes)

    // Add credit gatech ID
    svg.append("text").attr("x", width-50).attr("y", 20).attr("id", "credit").text("bgileau3")
  
    // add the curvy lines
    function tick() {
        path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
        });
  
        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"; 
        })
    };
  
    function dragstarted(d) {
        if (!d3.event.active) force.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    };
  
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;

        d.fixed = true;
        
    };
  
    function dragended(d) {
        if (!d3.event.active) force.alphaTarget(0);

        
        var d_name = d.name.replace(/\s+/g,'').toLowerCase()

        // var original_color = node.select(`#${d_name}`).attr("style").replace("fill: ", "")
        // console.log(original_color)

        node.select(`#${d_name}`).style("fill", "rgb(255, 247, 111)")

        if (d.fixed == true) {
            d.fx = d.x;
            d.fy = d.y;
        }
        else {
            d.fx = null;
            d.fy = null;
        }
    };
    
  }).catch(function(error) {
    console.log(error);
  });