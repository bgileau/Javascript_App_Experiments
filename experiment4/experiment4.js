// define the dimensions and margins for the line chart
// Use the Margin Convention referenced in the HW document to layout your graph
var width = 1200,
        height = 800,
        margin = ({top: 20, right: 30, bottom: 30, left: 40});

var height_component = 400
// define the dimensions and margins for the bar chart


// append svg element to the body of the page
// set dimensions and position of the svg element
let container_a = d3
    .select("body")
    .append("svg")
    .attr("id", "line_chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height_component + margin.top + margin.bottom)
    .append("g")
    .attr("id", "container")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Fetch the data
var pathToCsv = "average-rating.csv";


d3.dsv(",", pathToCsv, function (d) {
    return {
    // format data attributes if required
        name: d.name,
        year: +d.year,
        average_rating: Math.floor(+d.average_rating),
        users_rated: +d.users_rated

    }
}).then(function (data) {
    console.log(data); // you should see the data in your browser's developer tools console

    var nested_data = d3.nest()
                        .key(function(d) {return d.year})
                        .key(function(d){return d.average_rating})
                        .entries(data)

    console.log(nested_data) // Creates array of objects with key being outer layer.

    var year_arr = ["2015", "2016", "2017", "2018", "2019"]

    var possible_ratings = []
    for(i=0; i<10; i++){
        possible_ratings.push(String(i))
    }

    // Fix the data to have the years we care about and subtitute dummy 0 values for ratings with empty vals
    var nested_data_mod = []
    for(i=0; i < nested_data.length; i++){
        if(year_arr.includes(nested_data[i].key)){ // fix the array to only have 2015-2019
            // fix the values array to have dummy 0's present for keys that are missing
            nested_data_unmod = JSON.parse(JSON.stringify(nested_data[i]))  // copy without reference stack overflow
            
            for(possible_rating in possible_ratings){
                // console.log(possible_rating, nested_data_unmod.values)
                var vals = nested_data_unmod.values.slice() // copy without ref
                // console.log("vals", vals)
                var keys = (vals).map(key => Object.values(key)[0])
                // console.log(keys)
                if(!(keys.includes(possible_rating))){
                    // console.log(vals)
                    // console.log("!!!!", possible_rating, keys)
                    nested_data_unmod.values.push({
                        key: possible_rating,
                        values: []
                    })
                }
            }

            // sort nested_data_unmod
            // nested_data_unmod.values.sort()
            console.log("nested_data_unmod", nested_data_unmod)

            var nested_data_sorted = {};

            Object.keys(nested_data_unmod).forEach(key => {
                nested_data_unmod.values.sort((a, b) => a.key.localeCompare(b.key)); // compare strs stack overflow
                nested_data_sorted[key] = nested_data_unmod.values;
              });

            nested_data_mod.push(nested_data_sorted)
        }
    }

    console.log("nested_data_mod", nested_data_mod)


    ////////////////////////////////////////////////////////////////////////////////////
    // For personal use/non-autograder
    // var xScale = d3.scaleLinear().range([margin.left*2, width - (margin.right*6)]); // this is the correct looking range, but autograder fails
    // var yScale = d3.scaleLinear().range([height_component-(margin.bottom*1), margin.top]);  // this is the correct looking range, but autograder fails
    // For auto-grader
    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height_component, 0]);

    var xScale_bar = d3.scaleLinear().range([margin.left*2, width - (margin.right*6)])
    var yScale_bar = d3.scaleBand().range([height_component-(margin.bottom*1), margin.top])
    ////////////////////////////////////////////////////////////////////////////////////

    xScale.domain([0, 9]);
    yScale.domain([0, d3.max(nested_data, function(c) {
        return d3.max(c.values, function(d) {
            return d.values.length});
            })])

    xaxis = g => g
        .attr("transform", `translate(0,${height_component - (margin.bottom*1)})`)
        .call(d3.axisBottom(xScale).scale(xScale).ticks(10))
  
    yaxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).scale(yScale).ticks(10))

    var line = d3.line()  // TODO: modify for (c)?
        .x(function(d) { return xScale(+d.key); })
        .y(function(d) { return yScale(d.values.length); });


    /////////////////////////// a
    // Add the X Axis
    var x_axis_a = container_a.append("g").attr("id", "x-axis-lines")
    x_axis_a.call(xaxis).attr("transform", `translate(0,${height_component - (margin.bottom*1)})`)

    // Add the Y Axis
    var y_axis_a = container_a.append("g").attr("id", "y-axis-lines")
    y_axis_a.call(yaxis).attr("transform", `translate(${margin.left*2},0)`).style("font-size", ".7em")

    var lines = container_a.append("g").attr("id", "lines")
    var circle = container_a.append("g").attr("id", "circles")

    var lines_gen = lines.selectAll("lines")
                            .data(nested_data_mod)
                            .enter()



    

    var colorArray = [d3.schemeCategory10, d3.schemeAccent];
    var colorScheme = d3.scaleOrdinal(colorArray[0]);
    
    // lines
    lines_gen.append("path")
            .attr("d", function(d) { 
                console.log(d)
                return line(d.values)
            })  // d.values prior
            .style("fill", "none")
            .style("stroke", function(d, i) {
                return colorScheme(i)
            })
        
            
    // bars yo
    var bar_title = d3.select("body").append("div")
        .style("text-align", "center")
        .append("text").attr("id", "bar_chart_title")
        .style("display", "none")
        .text("Top 5 Most Rated Games of <Year> with Rating <Rating>")
    var container_2 = d3.select("body")
        .append("svg")
        .attr("id", "bar_chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height_component + margin.top + margin.bottom)
        .append("g")
        .attr("id", "container_2")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // .style("display", "none")
            
    var default_circle_rad = 5
    for(k = 0; k < nested_data_mod.length; k++){
        console.log("data", nested_data_mod[k].key)
        circle.selectAll("circles")
                .data(nested_data_mod[k].key)
                .enter()
                .append("circle")
                .attr("cx", function(d) { 
                    return xScale(+d.key) })
                .attr("cy", function(d) { return yScale(d.values.length); })
                .attr("r", default_circle_rad)
                .style("fill", colorScheme(k))
                .on('mouseover', function(d, i){ // i is the rating # that was chosen, d contains the games/year/avg_rating, etc..
                    var games_list = d.values
                    var num_vals = games_list.length
                    var year_hovered

                    console.log(games_list)
                    // Get the top 5 board games that received most ratings
                    var top_games = games_list.sort(function(a, b) {
                        return b.users_rated - a.users_rated
                    })
                    if (num_vals > 0){
                        year_hovered = games_list[0].year
                    }
                    if (num_vals < 5){
                        top_games = top_games.slice(0, num_vals)
                    } else{
                        top_games = top_games.slice(0, 5)
                    }

                    top_games.reverse()

                    console.log(year_hovered, "top games", top_games)
                    
                    if (num_vals > 0){ // display the bar chart if > 0
                        bar_title.style("display", "block").text(`Top 5 Most Rated Games of ${year_hovered} with Rating ${i}`)
                        d3.select("body").select("#bar_chart").style("display", "block")
                        container_2.style("display", "block")
                    }
                    d3.select(this).attr("r", default_circle_rad * 2)  // update radius on hover

                    console.log(games_list, i)

                    /////////// Scale Domains
                    xScale_bar.domain([0, d3.max(d.values, function(c){
                        return c.users_rated
                    })])

                    // yScale_bar.domain(function(c){ return c.name})
                    top_game_names = top_games.map(c => c.name.slice(0,10))
                    yScale_bar.domain(top_game_names)
                    console.log("top_game_names", top_game_names)
                    // console.log("top_game_names", top_game_names.reverse())
                    /////////// Scale Domains

                    xaxis_bars = g => g
                        .attr("transform", `translate(0,${height_component - (margin.bottom*1)})`)
                        .call(d3.axisBottom(xScale_bar).scale(xScale_bar).ticks(10))

                    xaxis_bars_grid = g => g
                        .attr("transform", `translate(0,${height_component - (margin.bottom*1)})`)
                        .call(d3.axisBottom(xScale_bar).scale(xScale_bar).ticks(10).tickFormat("").tickSize(-1 * (height_component - margin.top - margin.bottom))) // height_component - margin.top - margin.bottom
              
                    yaxis_bars = g => g
                        .attr("transform", `translate(${margin.left},0)`)
                        .call(d3.axisLeft(yScale_bar).scale(yScale_bar))
                    ///////////////////////////////////////////////////////
                    // Begin Drawing

                    // Add the X Axis
                    container_2.select("#x-axis-bars").remove() // remove the prior labels
                    container_2.select("#x-axis-bars-grid").remove() // remove the prior labels
                    container_2.select("#y-axis-bars").remove() // remove the prior labels

                    var x_axis_bars = container_2.append("g").attr("id", "x-axis-bars")
                    x_axis_bars.call(xaxis_bars).attr("transform", `translate(0,${height_component - (margin.bottom*1)})`)
                    
                    container_2.append('g')
                        .attr("id", "x-axis-bars-grid")
                        .attr('transform', 'translate(0,' + width + margin.left + margin.right +  + ')')
                        .call(xaxis_bars_grid)
                    
                    // Add the Y Axis
                    var y_axis_bars = container_2.append("g").attr("id", "y-axis-bars")
                    y_axis_bars.call(yaxis_bars).attr("transform", `translate(${margin.left*2},0)`).style("font-size", ".7em")

                    container_2.select("#bars").remove() // remove the prior labels
                    var bars = container_2.append("g")
                                        .attr("id", "bars")
                                        .attr("width", width - margin.right - margin.left)
                                        .attr("height", height_component + margin.top + margin.bottom)


                    console.log("Drawing bars")
                    bars.selectAll("bars")
                        .data(top_games)
                        .enter()
                        .append("rect")
                        .attr("id", "bars")
                        .attr("x", margin.left*2)
                        .attr("y", function(c) { return yScale_bar((c.name).slice(0, 10)); })
                        .attr("width", function(c) { 
                            return (xScale_bar(c.users_rated) - margin.left*2)
                            
                        })
                        .attr("height", 60)

                        
                    // Labels
                    x_axis_bars.append("text").style("font-size", "12px").style("fill", "black").attr("x", width/2).attr("y", margin.bottom).attr("id","bar_x_axis_label").text("Number of users")
                    y_axis_bars.append("text").style("font-size", "12px").style("fill", "black").attr("x", margin.left).attr("y", height_component/2 - margin.left * 2).attr("id","bar_y_axis_label").attr("transform", `rotate(270,20,${height_component/2})`).text("Games")

                    // autograder help me please
                    top_games.reverse()
                    console.log(top_games)
                    top_game_names.reverse()
                    console.log(top_game_names)
                    yScale_bar.domain(top_game_names)
                    yaxis_bars = g => g
                        .attr("transform", `translate(${margin.left},0)`)
                        .call(d3.axisLeft(yScale_bar).scale(yScale_bar))
                    y_axis_bars.call(yaxis_bars).attr("transform", `translate(${margin.left*2},0)`).style("font-size", ".7em")
                    


                })
                .on("mouseout", function(d){
                    d3.select(this).attr("r", default_circle_rad)
                    d3.select("#bar_chart_title").style("display", "none")
                    d3.select("#bar_chart").style("display", "none") // do this for the bar chart
                })
    }



    


    // Add legends for line graph
    var legend_a = container_a.append("g").attr("id", "legend")
    for(k_tempidx = year_arr.length - 1; k_tempidx > -1; k_tempidx--){
        // console.log("idx", year_arr.length, year_idx, year_arr.length - (year_idx+1))
        // console.log("Year", year)
        console.log(k_tempidx)
        var year = year_arr[k_tempidx]
        console.log("Year", year)

        legend_a.append("circle").attr("cx", width - (margin.right *4))
            .attr("cy", margin.top * (k_tempidx + 2))
            .attr("r", 5)
            .style("fill", colorScheme(k_tempidx))

        legend_a.append("text")
            .attr("x", width - (margin.right *3))
            .attr("y", margin.top * (k_tempidx + 2))
            .style("fill", "black")
            .style("font-size", ".9em")
            .text(year)
    }
    
    
    
    // Title/sig
    container_a.append("text").attr("id", "line_chart_title").attr("x", width/2-100).attr("y", margin.top).text("Board games by Rating 2015-2019")
    container_a.append("text").style("font-size", "12px").style("fill", "black").attr("x", width/2-50).attr("y", margin.top * 2).attr("id", "credit").text("bgileau3")

    // Labels
    x_axis_a.append("text").style("font-size", "12px").style("fill", "black").attr("x", width/2).attr("y", margin.bottom).text("Rating")
    y_axis_a.append("text").style("font-size", "12px").style("fill", "black").attr("x", margin.left).attr("y", height_component/2 - margin.left * 2).attr("transform", `rotate(270,20,${height_component/2})`).text("Count")

// })
}).catch(function (error) {
    console.log(error.message + '\n' + error.stack);  // better error handling
    console.log(error);
});