var parseTime = d3.timeParse("%Y-%m-%d");

var width = 1200,
        height = 1600,
        margin = ({top: 20, right: 30, bottom: 30, left: 40});

var height_component = 400

// need to change data passed to have d.count and d.rating for part B. But, might as well for part a too.
var dataset = d3.csv("boardgame_ratings.csv");
var games_lines = ['Catan', 'Dominion', 'Codenames', 'Terraforming Mars', 'Gloomhaven', 'Magic: The Gathering', 'Dixit', 'Monopoly']
var games_circles = ['Catan', 'Codenames', 'Terraforming Mars', 'Gloomhaven']
dataset.then(function(data) {

    console.log("data", data)

    // slices is used to generate the line graphs for all items
    var slices = games_lines.map(function(id) { // each col
        //console.log(data, id)
        return {
            id: id,
            values: data.map(function(d){
                //console.log("d", d) // each loop is a row
                return {
                    date: parseTime(d.date),
                    count: +d[`${id}=count`],
                    rank: +d[`${id}=rank`]
                };
            })
        };
    });
    console.log("slice", slices)

    // circle data for specific games
    var slices_circles = games_circles.map(function(id) { // each col
        //console.log(data, id)
        return {
            id: id,
            values: data.map(function(d){
                //console.log("d", d) // each loop is a row
                return {
                    date: parseTime(d.date),
                    count: +d[`${id}=count`],
                    rank: +d[`${id}=rank`]
                };
            })
        };
    });
    console.log("slices_circles", slices_circles)

    //----------------------------SCALES----------------------------//
var xScale = d3.scaleTime().range([margin.left*2, width - (margin.right*6)]);
var yScale_a = d3.scaleLinear().range([height_component-(margin.bottom*1), margin.top]);
var yScale_c1 = d3.scaleSqrt().range([height_component-(margin.bottom*1), margin.top]);
var yScale_c2 = d3.scaleLog().range([height_component-(margin.bottom*1), margin.top]);

xScale.domain(d3.extent(data, function(d){
    return parseTime(d.date)}));

yScale_a.domain([(0), d3.max(slices, function(c) {
    return d3.max(c.values, function(d) {
        return d.count + 4; });
        })
    ]);
yScale_c1.domain([(0), d3.max(slices, function(c) {
    return d3.max(c.values, function(d) {
        return d.count + 4; });
        })
    ]);
yScale_c2.domain([(1), d3.max(slices, function(c) {
    return d3.max(c.values, function(d) {
        return d.count + 4; });
        })
    ]);

console.log("moving onto axes")
//-----------------------------AXES-----------------------------//
xaxis = g => g
      .attr("transform", `translate(0,${height_component - (margin.bottom*1)})`)
      .call(d3.axisBottom(xScale).scale(xScale).tickFormat(d3.timeFormat('%b %y')))

yaxis_a = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale_a).scale(yScale_a).ticks(10))
yaxis_c1 = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale_c1).scale(yScale_c1).ticks(10))
yaxis_c2 = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale_c2).scale(yScale_c2).ticks(10))

console.log("moving onto lines")

//----------------------------LINES-----------------------------//
var line = d3.line()  // TODO: modify for (c)?
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale_a(d.count); });
var line_c1 = d3.line()  // TODO: modify for (c)?
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale_c1(d.count); });
var line_c2 = d3.line()  // TODO: modify for (c)?
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale_c2(d.count); });

//---------------------------TOOLTIP----------------------------//

var svg_a = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height_component)
        .attr("id", "svg-a")
        .attr("transform", "translate(" + margin.left*2 + "," + margin.top + ")");
var svg_b = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height_component)
        .attr("id", "svg-b")
        .attr("transform", "translate(" + margin.left*2 + "," + margin.top + ")");
var svg_c1 = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height_component)
        .attr("id", "svg-c-1")
        .attr("transform", "translate(" + margin.left*2 + "," + margin.top + ")");
var svg_c2 = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height_component)
        .attr("id", "svg-c-2")
        .attr("transform", "translate(" + margin.left*2 + "," + margin.top + ")");

console.log("moving onto drawing")

//-------------------------2. DRAWING---------------------------//
//-----------------------------AXES-----------------------------//

var plot_a = svg_a.append("g").attr("id", "plot-a")
var plot_b = svg_b.append("g").attr("id", "plot-b")
var plot_c1 = svg_c1.append("g").attr("id", "plot-c-1")
var plot_c2 = svg_c2.append("g").attr("id", "plot-c-2")

/////////////////////////// a
// Add the X Axis
var x_axis_a = plot_a.append("g").attr("id", "x-axis-a")
x_axis_a.call(xaxis).attr("transform", `translate(0,${height_component - (margin.bottom*1)})`)

// Add the Y Axis
var y_axis_a = plot_a.append("g").attr("id", "y-axis-a")
y_axis_a.call(yaxis_a).attr("transform", `translate(${margin.left*2},0)`).style("font-size", ".7em")

/////////////////////////// b
var x_axis_b = plot_b.append("g").attr("id", "x-axis-b")
x_axis_b.call(xaxis).attr("transform", `translate(0,${height_component - (margin.bottom*1)})`)

// Add the Y Axis
var y_axis_b = plot_b.append("g").attr("id", "y-axis-b")
y_axis_b.call(yaxis_a).attr("transform", `translate(${margin.left*2},0)`).style("font-size", ".7em")

/////////////////////////// c1
var x_axis_c1 = plot_c1.append("g").attr("id", "x-axis-c-1")
x_axis_c1.call(xaxis).attr("transform", `translate(0,${height_component - (margin.bottom*1)})`)

// Add the Y Axis
var y_axis_c1 = plot_c1.append("g").attr("id", "y-axis-c-1")
y_axis_c1.call(yaxis_c1).attr("transform", `translate(${margin.left*2},0)`).style("font-size", ".7em")

/////////////////////////// c2
var x_axis_c2 = plot_c2.append("g").attr("id", "x-axis-c-2")
x_axis_c2.call(xaxis).attr("transform", `translate(0,${height_component - (margin.bottom*1)})`)

// Add the Y Axis
var y_axis_c2 = plot_c2.append("g").attr("id", "y-axis-c-2")
y_axis_c2.call(yaxis_c2).attr("transform", `translate(${margin.left*2},0)`).style("font-size", ".7em")

//----------------------------LINES-----------------------------//

var lines_a = plot_a.append("g").attr("id", "lines-a")
var lines_b = plot_b.append("g").attr("id", "lines-b")
var circle_b = plot_b.append("g").attr("id", "symbols-b")

var lines_c1 = plot_c1.append("g").attr("id", "lines-c-1")
var circle_c1 = plot_c1.append("g").attr("id", "symbols-c-1")

var lines_c2 = plot_c2.append("g").attr("id", "lines-c-2")
var circle_c2 = plot_c2.append("g").attr("id", "symbols-c-2")

var lines_gen_a = lines_a.selectAll("lines")
    .data(slices)
    .enter()
    .append("g")
var lines_gen_b = lines_b.selectAll("lines")
    .data(slices)
    .enter()
    .append("g")
var lines_gen_c1 = lines_c1.selectAll("lines")
    .data(slices)
    .enter()
    .append("g")
var lines_gen_c2 = lines_c2.selectAll("lines")
    .data(slices)
    .enter()
    .append("g")

var colorArray = [d3.schemeCategory10, d3.schemeAccent];
var colorScheme = d3.scaleOrdinal(colorArray[0]);

lines_gen_a.append("path")
    .attr("d", function(d) { return line(d.values); })  // d.values prior
    .style("fill", "none")
    .style("stroke", function(d, i) {
        return colorScheme(i)
    })
lines_gen_b.append("path")
    .attr("d", function(d) { 
        console.log("line time", d.values)
        return line(d.values); 
    })  // d.values prior
    .style("fill", "none")
    .style("stroke", function(d, i) {
        return colorScheme(i)
    })
lines_gen_c1.append("path")
    .attr("d", function(d) { 
        console.log("line time", d.values)
        return line_c1(d.values); 
    })  // d.values prior
    .style("fill", "none")
    .style("stroke", function(d, i) {
        return colorScheme(i)
    })
lines_gen_c2.append("path")
    .attr("d", function(d) { 
        console.log("line time", d.values)
        return line_c2(d.values); 
    })  // d.values prior
    .style("fill", "none")
    .style("stroke", function(d, i) {
        return colorScheme(i)
    })

// Adding circles to the lines (b)
for (l = 0; l < games_lines.length; l++){
    console.log(slices[l], slices[l].id, slices[l].values)
    if (games_circles.includes(slices[l].id)){
        console.log("temp", slices[l].values)
        slices_temp = []
        for(h = 2; h < slices[l].values.length; h = h+3){
            slices_temp.push(slices[l].values[h])
        }
        console.log("slices_temp", slices_temp)

        circle_b.selectAll("circles")
                .data(slices_temp)
                .enter()
                .append("circle")
                .attr("cx", function(d, i){
                    return xScale(d.date)
                })
                .attr("cy", function(d, i){
                    return yScale_a(d.count)
                })
                .attr("r", 10)
                .style("fill", colorScheme(l))

        circle_b.selectAll("circles")
                .data(slices_temp)
                .enter().append("text")
                .attr("x", function(d, i){
                    return xScale(d.date)
                })
                .attr("y", function(d, i){
                    return yScale_a(d.count)
                })
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", ".6em")
                .text(function(d){
                    return d.rank
                })
    }
}

// Adding circles to the lines (c1)
for (l = 0; l < games_lines.length; l++){
    console.log(slices[l], slices[l].id, slices[l].values)
    if (games_circles.includes(slices[l].id)){
        console.log("temp", slices[l].values)
        slices_temp = []
        for(h = 2; h < slices[l].values.length; h = h+3){
            slices_temp.push(slices[l].values[h])
        }
        console.log("slices_temp", slices_temp)

        circle_c1.selectAll("circles")
                .data(slices_temp)
                .enter()
                .append("circle")
                .attr("cx", function(d, i){
                    return xScale(d.date)
                })
                .attr("cy", function(d, i){
                    return yScale_c1(d.count)
                })
                .attr("r", 10)
                .style("fill", colorScheme(l))

        circle_c1.selectAll("circles")
                .data(slices_temp)
                .enter().append("text")
                .attr("x", function(d, i){
                    return xScale(d.date)
                })
                .attr("y", function(d, i){
                    return yScale_c1(d.count)
                })
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", ".6em")
                .text(function(d){
                    return d.rank
                })
    }
}

// Adding circles to the lines (c2)
for (l = 0; l < games_lines.length; l++){
    console.log(slices[l], slices[l].id, slices[l].values)
    if (games_circles.includes(slices[l].id)){
        console.log("temp", slices[l].values)
        slices_temp = []
        for(h = 2; h < slices[l].values.length; h = h+3){
            slices_temp.push(slices[l].values[h])
        }
        console.log("slices_temp", slices_temp)

        circle_c2.selectAll("circles")
                .data(slices_temp)
                .enter()
                .append("circle")
                .attr("cx", function(d, i){
                    return xScale(d.date)
                })
                .attr("cy", function(d, i){
                    return yScale_c2(d.count)
                })
                .attr("r", 10)
                .style("fill", colorScheme(l))

                circle_c2.selectAll("circles")
                .data(slices_temp)
                .enter().append("text")
                .attr("x", function(d, i){
                    return xScale(d.date)
                })
                .attr("y", function(d, i){
                    return yScale_c2(d.count)
                })
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", ".6em")
                .text(function(d){
                    return d.rank
                })
    }
}
    
    
// Line Labeling
lines_gen_a.append("text")
.datum(function(d) {
    return {
        id: d.id,
        value: d.values[d.values.length - 1]}; })
.attr("transform", function(d) {
    return "translate(" + (xScale(d.value.date) + 10)  
    + "," + (yScale_a(d.value.count) + 5 )+ ")"; })
.attr("x", 5)
.text(function(d) { return d.id })
.style("stroke", function(d, i) {
    return colorScheme(i)
})
lines_gen_b.append("text")
.datum(function(d) {
    return {
        id: d.id,
        value: d.values[d.values.length - 1]}; })
.attr("transform", function(d) {
    return "translate(" + (xScale(d.value.date) + 10)  
    + "," + (yScale_a(d.value.count) + 5 )+ ")"; })
.attr("x", 5)
.text(function(d) { return d.id })
.style("stroke", function(d, i) {
    return colorScheme(i)
})
lines_gen_c1.append("text")
.datum(function(d) {
    return {
        id: d.id,
        value: d.values[d.values.length - 1]}; })
.attr("transform", function(d) {
    return "translate(" + (xScale(d.value.date) + 10)  
    + "," + (yScale_c1(d.value.count) + 5 )+ ")"; })
.attr("x", 5)
.text(function(d) { return d.id })
.style("stroke", function(d, i) {
    return colorScheme(i)
})
lines_gen_c2.append("text")
.datum(function(d) {
    return {
        id: d.id,
        value: d.values[d.values.length - 1]}; })
.attr("transform", function(d) {
    return "translate(" + (xScale(d.value.date) + 10)  
    + "," + (yScale_c2(d.value.count) + 5 )+ ")"; })
.attr("x", 5)
.text(function(d) { return d.id })
.style("stroke", function(d, i) {
    return colorScheme(i)
})

// Add legends for b, c
svg_b.append("circle").attr("cx", width - margin.right - 50)
    .attr("cy", height_component - 70)
    .attr("r", 15)
    .style("fill", "black")

svg_b.append("text")
    .attr("x", width - margin.right - 50)
    .attr("y", height_component - 70)
    .style("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", ".6em")
    .text("rank")

svg_b.append("text")
    .attr("x", width - margin.right - 120)
    .attr("y", height_component - 30)
    .style("font-size", ".8em")
    .text("BoardGameGeek Rank")

svg_c1.append("circle").attr("cx", width - margin.right - 50)
    .attr("cy", height_component - 70)
    .attr("r", 15)
    .style("fill", "black")

svg_c1.append("text")
    .attr("x", width - margin.right - 50)
    .attr("y", height_component - 70)
    .style("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", ".6em")
    .text("rank")

svg_c1.append("text")
    .attr("x", width - margin.right - 120)
    .attr("y", height_component - 30)
    .style("font-size", ".8em")
    .text("BoardGameGeek Rank")

svg_c2.append("circle").attr("cx", width - margin.right - 50)
    .attr("cy", height_component - 70)
    .attr("r", 15)
    .style("fill", "black")

svg_c2.append("text")
    .attr("x", width - margin.right - 50)
    .attr("y", height_component - 70)
    .style("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", ".6em")
    .text("rank")

svg_c2.append("text")
    .attr("x", width - margin.right - 120)
    .attr("y", height_component - 30)
    .style("font-size", ".8em")
    .text("BoardGameGeek Rank")

// Titling/Labels
x_axis_a.append("text").style("font-size", "12px").style("fill", "black").attr("x", width/2).attr("y", margin.bottom).text("Month")
y_axis_a.append("text").style("font-size", "12px").style("fill", "black").attr("x", margin.left).attr("y", height_component/2 - margin.left * 2).attr("transform", `rotate(270,20,${height_component/2})`).text("Num of Ratings")
svg_a.append("text").text("Number of Ratings 2016-2020").attr("x", width/2-50).attr("y", margin.top).attr("id", "title-a")

x_axis_b.append("text").style("font-size", "12px").style("fill", "black").attr("x", width/2).attr("y", margin.bottom).text("Month")
y_axis_b.append("text").style("font-size", "12px").style("fill", "black").attr("x", margin.left).attr("y", height_component/2 - margin.left * 2).attr("transform", `rotate(270,20,${height_component/2})`).text("Num of Ratings")
svg_b.append("text").text("Number of Ratings 2016-2020 with Rankings").attr("x", width/2-50).attr("y", margin.top).attr("id", "title-b")

x_axis_c1.append("text").style("font-size", "12px").style("fill", "black").attr("x", width/2).attr("y", margin.bottom).text("Month")
y_axis_c1.append("text").style("font-size", "12px").style("fill", "black").attr("x", margin.left).attr("y", height_component/2 - margin.left * 2).attr("transform", `rotate(270,20,${height_component/2})`).text("Num of Ratings")
svg_c1.append("text").text("Number of Ratings 2016-2020 (Square root Scale)").attr("x", width/2-50).attr("y", margin.top).attr("id", "title-c-1")

x_axis_c2.append("text").style("font-size", "12px").style("fill", "black").attr("x", width/2).attr("y", margin.bottom).text("Month")
y_axis_c2.append("text").style("font-size", "12px").style("fill", "black").attr("x", margin.left).attr("y", height_component/2 - margin.left * 2).attr("transform", `rotate(270,20,${height_component/2})`).text("Num of Ratings")
svg_c2.append("text").text("Number of Ratings 2016-2020 (Log Scale)").attr("x", width/2-50).attr("y", margin.top).attr("id", "title-c-2")
    
svg_c2.append("text").style("font-size", "12px").style("fill", "black").attr("x", width - margin.right - 50).attr("y", height_component - 10).attr("id", "signature").text("bgileau3")
// })
}).catch(function(error) {
    console.log(error);
});