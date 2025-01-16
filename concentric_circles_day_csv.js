// Set up dimensions
const width = 900;
const height = 950;
const margin = 55;
const innerRadius = 100;
const outerRadius = Math.min(width, height) / 2 - margin;


// !!! NEED uniform scale

// years not snaking around, snow bands not showing up right

// Sample data structure (you can replace with your actual data)

// must convert day to day of month
// data should come in m/d/y  and converted programatically
// load all temperature data in at same time so can have high low + maniulated like temp varability
// fade between different data aspects
// sort by high

/*
const data = [
    // Year 2020
    { year: 2020, day: 1, temp: 5 },
    { year: 2020, day: 2, temp: 7 },
    // ... add all months
    { year: 2020, day: 12, temp: 4 },
    // Year 2021
    { year: 2021, day: 1, temp: 6 },
    // ... and so on
];

*/






// beginning of function


document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const csvData = event.target.result;
        // Process your CSV data here
        // console.log(csvData);
		
		// hide file input
		$('#fileInput').hide();
		// show reload
		$('#other_file').show();
		
// Split into lines and filter out any empty lines
const lines = csvData.split('\n').filter(line => line.trim());

csv_headers = 'date,  tavg, tmin,  tmax,  prcp,  snow,  wdir,  wspd,  wpgt,  pres,  tsun';

// Get headers from first line
const headers = csv_headers.split(',').map(header => header.trim());

// Convert remaining lines into objects
const data = lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    return headers.reduce((obj, header, index) => {
        // Convert string values to numbers where possible
        const value = values[index];
        obj[header] = value === '' ? null : isNaN(value) ? value : Number(value);
        return obj;
    }, {});
});

// console.log(data);

   


    // actually data is array of objects
	
	
	 for (let i = 0; i < data.length; i++)
	 {
	 //  console.log(data[i].year + " is " + data[i].temp + " degrees.");
	   
	   date_parts = data[i].date.split('-');
	   
	   
	   
	   d365 = day_of_year(date_parts[0],date_parts[1],date_parts[2]);
	   
      // console.log(d365);	   
		   
	   data[i].day_365 = d365;
		
      data[i].year = date_parts[0];  // year add kludge
	  data[i].month = date_parts[1];  // month add kludge
	    data[i].day = date_parts[2];  // day add kludge
	  
	 // data[i].t_using = data[i].tmax; // kludge to get var we want
	  
	 which_attribute = document.getElementById("which").value;
     
	 data[i].tvar = data[i].tmax - data[i].tmin;
	 
	 /*
	 if (which_attribute == 'tmax'){ 
	    data[i].t_using = data[i].tmax;
	 }
	 else if  (which_attribute == 'tmin'){ 
		data[i].t_using = data[i].tmin;
	 }
	 	 else if  (which_attribute == 'snow'){ 
		data[i].t_using = data[i].snow;
	 }
	 
*/

     }
	
	
	 
  


// Create SVG
const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

// Set up scales
const years = [...new Set(data.map(d => d.year))];
const numYears = years.length;



/*
which_scale = document.getElementById("which_scale").value;

console.log(which_scale);

if (which_scale == 'generated'){
	
// Color scale for temperature based on data itself
const colorScale = d3.scaleSequential()
    .domain([d3.min(data, d => d.temp), d3.max(data, d => d.temp)])
    .interpolator(d3.interpolateRdBu);

}
else if (which_scale == 'normal'){
	
	// must convert F to C from old script
const colorScale = d3.scaleLinear()
    .domain([-17.8, -12.2, -6.7, -1.1, 4.4, 10.0, 15.6, 21.1, 26.7, 32.2, 37.8, 43.3])
    .range([
        '#555555',
        '#000000',
        '#000088',
        '#0000ff',
        '#0088ff',
        '#00ddff',
        '#00aa00',
        '#88ff00',
        '#ffff00',
        '#ff8800',
        '#ff0000',
        '#ff6666'
    ]);
	
	
}
*/


// Create a function to generate the color scale
function generate_tooltip(which_attribute, d) {
	
	  
	 
	 // which_attribute = document.getElementById("which").value;
     
			if (which_attribute == 'prcp'){
				 tooltip_html = `Year: ${d.year}<br/>Day:${d.month}/${d.day} - ${d.day_365}<br/>Precipitation: ${d[which_attribute].toFixed(1)} mm` + ' or ' + (d[which_attribute] / 25.4).toFixed(1) + ' inches';
			}
			else if (which_attribute == 'snow'){
				
				 inches = (d[which_attribute] / 25.4).toFixed(1);
				 feet = Math.floor(inches / 12);
				 remainingInches = (inches % 12).toFixed(1);;
				
				 if (inches > 12){
					 inches_say = feet + ' feet ' + remainingInches
				 }
				 else {
					inches_say = inches;
				 }
				 
				
				 tooltip_html = `Year: ${d.year}<br/>Day:${d.month}/${d.day} - ${d.day_365}<br/>Snow Depth: ${d[which_attribute].toFixed(1)} mm`
				 + ' or ' + inches_say + ' inches';
			}
			else if (which_attribute == 'pres'){
				tooltip_html = `Year: ${d.year}<br/>Day:${d.month}/${d.day} - ${d.day_365}<br/>Barometric Pressure: ${d[which_attribute].toFixed(1)} millibars or  ` + (d[which_attribute] * 0.02953).toFixed(2) + ' inches';
				
			}
			
			else {
			
          tooltip_html = `Year: ${d.year}<br/>Day:${d.month}/${d.day} - ${d.day_365}<br/>Temperature: ${d[which_attribute].toFixed(1)} &deg;C,  ${convertToF(d[which_attribute]).toFixed(1)} &deg;F`;
		  
			}
	
	return tooltip_html;
	
}



// Create a function to generate the color scale
function createColorScale(scaleType, data) {
	
	
	which_attribute = document.getElementById("which").value;
    // Define the scales as constants
    const TEMPERATURE_COLORS = {
        normal: {
            domain: [-17.8, -12.2, -6.7, -1.1, 4.4, 10.0, 15.6, 21.1, 26.7, 32.2, 37.8, 43.3],
            range: [
                '#555555', '#000000', '#000088', '#0000ff', '#0088ff', 
                '#00ddff', '#00aa00', '#88ff00', '#ffff00', '#ff8800', 
                '#ff0000', '#ff6666'
            ]
        }
    };


    if (scaleType == 'generated'){
		
		return d3.scaleSequential()
    .domain([d3.min(data, d => d[which_attribute]), d3.max(data, d => d[which_attribute])])
    .interpolator(d3.interpolateHslLong("purple", "orange"));
	
	
	
	}
	else {
		
		 return d3.scaleLinear()
            .domain(TEMPERATURE_COLORS.normal.domain)
            .range(TEMPERATURE_COLORS.normal.range)
			.interpolate(d3.interpolateRgb.gamma(2.2));
			
			
	}
	
	/*
	
    // Return the appropriate scale based on type
    return scaleType === 'generated'
        ? d3.scaleSequential()
            .domain(d3.extent(data, d => d.temp))
            .interpolator(d3.interpolateRdBu)
        : d3.scaleLinear()
            .domain(TEMPERATURE_COLORS.normal.domain)
            .range(TEMPERATURE_COLORS.normal.range);
			
			*/
}


var whichScale = d3.select('#which_scale').property('value');

var colorScale = createColorScale(whichScale, data);


/*
// Color scale for temperature based on data itself
const colorScale = d3.scaleSequential()
    .domain([d3.min(data, d => d[which_attribute]), d3.max(data, d => d[which_attribute])])
    .interpolator(d3.interpolateHslLong("purple", "orange"));
*/
	
	
/*
const colorScale = d3.scaleSequential()
    .domain([d3.min(data, d => d[which_attribute]), d3.max(data, d => d[which_attribute])])
    .interpolator(d3.interpolateHslLong("purple", "orange"));
*/


function day_of_year(year,month,day){

  // console.log('year' + year + ' month ' + month + ' day ' + day);
  
  const date = new Date(year + '-' + month + '-' + day);
  
  const start = new Date(year, 0, 0);
    const diff = date - start;
    const oneDay = (1000 * 60 * 60 * 24)  // adding 1 ms to the end fixed it
    done_this = Math.floor(diff / oneDay);
  
     return done_this;
  
}
    
	
// Create the circular segments
const arc = d3.arc()
    .innerRadius((d, i) => innerRadius + (d.year - years[0]) * (outerRadius - innerRadius) / numYears)
    .outerRadius((d, i) => innerRadius + (d.year - years[0] + 1) * (outerRadius - innerRadius) / numYears)
	.startAngle(d => (d.day_365 - 1) * 2 * Math.PI / daysInYear(d.year))
    .endAngle(d => d.day_365 * 2 * Math.PI / daysInYear(d.year));
	
	/*  need YEAR LENGTH
    .startAngle((d => (d.day_365 - 1) * 2 * Math.PI / 360)
    .endAngle((d => (d.day_365 * 2 * Math.PI / 360));
*/


// Draw the segments    passing in data as d?
svg.selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", arc)
    .style("fill", d => colorScale(d[which_attribute]))
    .style("stroke", "none")
    .style("stroke-width", "0")
	// Add mouse events for tooltip
    .on("mouseover", function(event, d) {
        d3.select(this)
            .style("opacity", 0.7);
            
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
            
			
			/*
			if (which_attribute == 'snow' || which_attribute == 'prcp'){
				 tooltip_html = `Year: ${d.year}<br/>Day:${d.month}/${d.day} - ${d.day_365}<br/>Precipitation: ${d[which_attribute].toFixed(1)} ° mm`;
			}
			else {
			
          tooltip_html = `Year: ${d.year}<br/>Day:${d.month}/${d.day} - ${d.day_365}<br/>Temperature: ${d[which_attribute].toFixed(1)} &deg;C,  ${convertToF(d[which_attribute]).toFixed(1)} &deg;F`;
		  
			}
			*/
			
			// tooltip_html = generate_tooltip(which_attribute,data);
			
			
			
        tooltip.html(generate_tooltip(which_attribute,d))
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
			
    })
    .on("mouseout", function(d) {
        d3.select(this)
            .style("opacity", 1);
            
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });





if (years.length < 20){
	
// Add year labels
svg.selectAll(".year-label")
    .data(years)
    .enter()
    .append("text")
    .attr("class", "year-label")
    .attr("y", (d, i) => -innerRadius - (i + 0.5) * (outerRadius - innerRadius) / numYears)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text(d => d);

}


const offsetAngle = 15 * Math.PI / 180; 

// Add month labels
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

svg.selectAll(".month-label")
    .data(monthLabels)
    .enter()
    .append("text")
    .attr("class", "month-label")
    .attr("x", (d, i) => (outerRadius + 30) * Math.sin(i * 2 * Math.PI / 12 + offsetAngle))
    .attr("y", (d, i) => -(outerRadius + 30) * Math.cos(i * 2  * Math.PI / 12 + offsetAngle))
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text(d => d);

// Add a legend
const legendWidth = 400;
const legendHeight = 20;

/*
const legendScale = d3.scaleSequential()
    .domain([d3.min(data, d => d[which_attribute]), d3.max(data, d => d[which_attribute])])
    .interpolator(d3.interpolateHslLong("purple", "orange"));
*/

 whichScale = document.getElementById("which_scale").value;

 var legendScale = createColorScale(whichScale, data);



 function toFMaybe(temperature){
	 
	 temp_unit_type = document.getElementById("temp_unit_type").value;
	 
	 if (temp_unit_type == 'c'){
		 return temperature;
	 }
	 else {
	     return (Math.round(temperature * (9 / 5)) + 32);
	 }
	 
	 
	 
 }
 

const legendAxis = d3.axisBottom(d3.scaleLinear()
    .domain([d3.min(data, d => d[which_attribute]), d3.max(data, d => d[which_attribute])])
    .range([0, legendWidth]))
    .tickFormat(d => toFMaybe(d));

	
const legend = svg.append("g")
    .attr("transform", `translate(${-legendWidth/2},${height/2 - margin + 12})`);

const legendGradient = legend.append("defs")
    .append("linearGradient")
    .attr("id", "legend-gradient")
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "0%");

// Create a tooltip div
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");
	
	
legendGradient.selectAll("stop")
    .data(d3.range(0, 1.1, 0.1))
    .enter()
    .append("stop")
    .attr("offset", d => d * 100 + "%")
    .attr("stop-color", d => legendScale(d3.min(data, d => d[which_attribute]) + d * (d3.max(data, d => d[which_attribute]) - d3.min(data, d => d[which_attribute]))));

legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)");

legend.append("g")
    .attr("transform", `translate(0,${legendHeight})`)
    .call(legendAxis);


  // ai generated
  function update(selectedGroup) {
    // Update the t_using property for all data points
    data.forEach(d => {
        // d.t_using = d[selectedGroup];
    });

/*
    // Update color scale with new domain
    colorScale.domain([
        d3.min(data, d => d[selectedGroup]),
        d3.max(data, d => d[selectedGroup])
    ]);
*/

     whichScale = document.getElementById("which_scale").value;

     colorScale = createColorScale(whichScale, data);

     legendScale = createColorScale(whichScale, data);
	 
	 

    // Update the paths with new colors
    svg.selectAll("path")
        .data(data)
        .transition()
        .duration(1000)
        .style("fill", d => colorScale(d[selectedGroup]));


/*
    // Update the legend
    const legendScale = d3.scaleSequential()
        .domain([
            d3.min(data, d => d[selectedGroup]),
            d3.max(data, d => d[selectedGroup])
        ])
        .interpolator(d3.interpolateHslLong("purple", "orange"));
*/


    const legendAxis = d3.axisBottom(d3.scaleLinear()
        .domain([
            d3.min(data, d => d[selectedGroup]),
            d3.max(data, d => d[selectedGroup])
        ])
        .range([0, legendWidth]))
		.tickFormat(d => toFMaybe(d));


    // Update legend gradient
    legendGradient.selectAll("stop")
        .data(d3.range(0, 1.1, 0.1))
        .transition()
        .duration(1000)
        .attr("stop-color", d => legendScale(
            d3.min(data, d => d[selectedGroup]) + 
            d * (d3.max(data, d => d[selectedGroup]) - d3.min(data, d => d[selectedGroup]))
        ));

    // Update legend axis
    legend.select("g")
        .transition()
        .duration(1000)
        .call(legendAxis);



 // do need to reload tool tip
 
 
			
 
    // Update tooltip content
    svg.selectAll("path")
        .on("mouseover", function(event, d) {
			
			tooltip_html = generate_tooltip(which_attribute,d);
			
			
			/*
			 which_attribute = document.getElementById("which").value;
     
			if (which_attribute == 'snow' || which_attribute == 'prcp'){
				 tooltip_html = `Year: ${d.year}<br/>Day:${d.month}/${d.day} - ${d.day_365}<br/>Precipitation: ${d[which_attribute].toFixed(1)} mm`;
			}
			else {
			
          tooltip_html = `Year: ${d.year}<br/>Day:${d.month}/${d.day} - ${d.day_365}<br/>Temperature: ${d[which_attribute].toFixed(1)} &deg;C,  ${convertToF(d[which_attribute]).toFixed(1)} &deg;F`;
		  
			}
			
			*/
			
			
            d3.select(this)
                .style("opacity", 0.7);
                
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
                
            // tooltip.html(`Year: ${d.year}<br/>Day:${d.month}/${d.day} - ${d.day_365}<br/>${selectedGroup}: ${d[selectedGroup].toFixed(1)}`)
			
			 tooltip.html(tooltip_html)
			
			
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        });
		
	
		
}
	

// When the button is changed, run the updateChart function
    d3.select("#which").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })



// which scale
    d3.select("#which_scale").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption  = document.getElementById("which").value;
        // run the updateChart function with this selected option
        update(selectedOption)
    })


// which scale
    d3.select("#temp_unit_type").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption  = document.getElementById("which").value;
        // run the updateChart function with this selected option
        update(selectedOption)
    })



 // end CSV read
    };
    
    reader.readAsText(file);
});



function convertToF(celsius) {
  // make the given fahrenheit variable equal the given celsius value
  // multiply the given celsius value by 9/5 then add 32
  let fahrenheit = celsius * 9/5 + 32
  // return the variable fahrenheit as the answer
  return fahrenheit;
}

function daysInYear(year) {
	
    return ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365;
}

