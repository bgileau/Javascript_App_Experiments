    
        // enter code to define margin and dimensions for svg
        var width = 1600,
            height = 800,
            margin = ({top: 20, right: 30, bottom: 30, left: 40});
        
        // enter code to create svg
        var svg = d3.select("body")
                    .append("svg")
                    .attr("id", "chloropleth")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)

        var countries = svg.append("g")
                            .attr("id", "countries")
                            .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");

        var legend = svg.append("g")
                        .attr("id", "legend")
                        .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");


        var selected_value
        
        // enter code to create color scale
        var colorArray = ["rgb(237,248,251)", "rgb(178,226,226)", "rgb(102,194,164)", "rgb(35,139,69)"]
        
        // enter code to define tooltip
        var tooltip = d3.tip().attr('class', 'tooltip').attr("id", "tooltip").html("test") // function(d) { return d; }
        
        // enter code to define projection and path required for Choropleth
        // For grading, set the name of functions for projection and path as "projection" and "path"
        var projection = d3.geoNaturalEarth().translate([width/2, height/2])
        var path = d3.geoPath().projection(projection);
        
        // define any other global variables 
        var ratings_by_country = d3.dsv(",", "ratings-by-country.csv")
        var world_countries = d3.json("world_countries.json") 

        Promise.all([
            ratings_by_country, world_countries
        ]).then(function(data){
            // enter code to call ready() with required arguments
            console.log(data)
            ready(null, data[1], data[0])
            
        });
        
        // this function should be called once the data from files have been read
        // world: topojson from world_countries.json
        // gameData: data from ratings-by-country.csv
        
        function ready(error, world, gameData) {
            console.log(error, world, gameData)
            console.log("gameData", gameData)
            // enter code to extract all unique games from gameData
            game_list = []
            for(i=0; i < gameData.length; i++){
                game_list.push(gameData[i].Game)
            }
            game_list_unique = Array.from(new Set(game_list)) // stack
            console.log(game_list_unique)

            var selected_value = game_list_unique[0]

            // sort
            game_list_unique.sort()

            // enter code to append the game options to the dropdown
            var gamedata_dropdown_gen = d3.select("#gameDropdown")
                .selectAll("option")
                .data(game_list_unique)

            gamedata_dropdown_gen.enter()
                .append("option")
                .attr("value", function(d) { return d; })
                .attr("id", function(d) { return d; })
                .append("text")
                .merge(gamedata_dropdown_gen)
                .text(function(d) { return d; })

            var gamedata_dropdown = d3.select("#gameDropdown") // this line is NECESSARY for the event to be listened to
                
            // event listener for the dropdown. Update choropleth and legend when selection changes. Call createMapAndLegend() with required arguments.
            gamedata_dropdown.on("change", function() {
                selected_value = d3.select("#gameDropdown").property("value")
                d3.select("#chloropleth").remove()
                d3.select("#tooltip").remove()
                // enter code to create svg
                var svg = d3.select("body")
                        .append("svg")
                        .attr("id", "chloropleth")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)

                var countries = svg.append("g")
                                .attr("id", "countries")
                                .attr("transform",
                                "translate(" + margin.left + "," + margin.top + ")");

                var legend = svg.append("g")
                            .attr("id", "legend")
                            .attr("transform",
                                "translate(" + margin.left + "," + margin.top + ")");

                createMapAndLegend(world, gameData, selected_value)
            });

            // create Choropleth with default option. Call createMapAndLegend() with required arguments. 
            createMapAndLegend(world, gameData, selected_value)
        }

        // this function should create a Choropleth and legend using the world and gameData arguments for a selectedGame
        // also use this function to update Choropleth and legend when a different game is selected from the dropdown
        function createMapAndLegend(world, gameData, selectedGame){ 
            console.log(`Drawing map/legend for ${selectedGame}`)
            
            createPath(world, gameData, selectedGame)
        }

        function searchForUsers(gameData, selectedGame, country_name){

            var nested_gameData = d3.nest()
                .key(function(d){ return d.Game })
                .key(function(d){ return d.Country })
                .entries(gameData)

            // console.log("nested_gameData", nested_gameData)

            // console.log("Searching for: ", country_name)

            for(game_idx = 0; game_idx < nested_gameData.length; game_idx++){ // 
                if(nested_gameData[game_idx].key == selectedGame){
                    var countries_per_game = nested_gameData[game_idx].values
                    // console.log("countries_per_game", countries_per_game)
                    // console.log("Country: ", country_name)
                    for(country_idx = 0; country_idx < countries_per_game.length; country_idx++){
                        // console.log(countries_per_game, countries_per_game[country_idx].key)
                        if (countries_per_game[country_idx].key == country_name){
                            console.log(countries_per_game[country_idx].values[0])
                            var avg_rating = countries_per_game[country_idx].values[0]["Average Rating"]
                            var num_users = countries_per_game[country_idx].values[0]["Number of Users"]
                            // console.log("found val", val)
                            return [avg_rating, num_users]
                        }
                    }

                }
            }

            return [undefined, undefined]

        }

        function createPath(world, gameData, selectedGame){
            console.log("world", world)

            var not_found_color = "rgb(150, 150, 150)"

            country_colors = []
            for (i=0; i < world.features.length; i++){
                console.log(world.features[i])
                var country_name = world.features[i].properties.name
                        
                var [avg_rating, num_users] = searchForUsers(gameData, selectedGame, country_name)
                var num_users_color = null
                console.log(country_name, avg_rating)

                if (avg_rating == undefined){
                    num_users_color = not_found_color
                }

                country_colors.push({
                    country: country_name,
                    game: selectedGame,
                    avg_rating: avg_rating,
                    num_users: num_users,
                    num_users_color: num_users_color
                })
            }

            // getting min and max values for scale
            var temp_num_colors = []
            for(country_obj of country_colors){
                console.log(country_obj)
                // if (country_obj.num_users != undefined){
                    // temp_num_colors.push(parseInt(country_obj.num_users))
                //     // temp_num_colors.push(+country_obj.num_users)
                // }
                temp_num_colors.push(parseFloat(country_obj.avg_rating))
            }

            console.log("extent ",temp_num_colors)
            var quantile_func = d3.scaleQuantile()
                                .domain(temp_num_colors.sort()) // pass only the extreme values
                                .range(colorArray)
            var tooltip = d3.tip().attr('id', 'tooltip')
                                .html(function(d, i) {
                                    var rating_tooltip = country_colors[i].avg_rating
                                    var num_users_tooltip = country_colors[i].num_users
                                    if (rating_tooltip == undefined){
                                        rating_tooltip = "N/A"
                                    }
                                    if (num_users_tooltip == undefined){
                                        num_users_tooltip = "N/A"
                                    }
                                    return `Country: ${d.properties.name}<br/>Game: ${country_colors[i].game}<br/>Avg Rating: ${rating_tooltip}<br/>Number of Users: ${num_users_tooltip}`
                                    // return `${d.Country}\n${d.Game}`

                                })
                                .attr("class", "tooltip")

            var countries = d3.select("#countries")
            countries.call(tooltip)

            console.log("Drawing paths")
            countries.selectAll("path")
                    .data(world.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .style("stroke", "black")
                    .style("fill", function(d, i){
                        
                        if (country_colors[i].avg_rating == undefined){
                            return not_found_color
                        }
                        else {
                            return quantile_func(country_colors[i].avg_rating)
                        }
                    })
                    .on("mouseover", tooltip.show)  // tooltip.show
                    .on("mouseout", tooltip.hide)

            var legend_display = d3.legendColor()
                            .labelFormat(d3.format(".2f"))
                            .scale(quantile_func);

            var legend = d3.select("#legend").call(legend_display)

            var svg = d3.select("#chloropleth").append("text").style("font-size", "15px").style("fill", "black").attr("x", width/2).attr("y",height -margin.bottom).text("bgileau3")
            
        }

        console.log("completed")