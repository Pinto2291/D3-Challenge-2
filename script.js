// Get the Data

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then((n) => n.json()).then((n) => {

    // Data Information
    const data = n;

    /* Change the time inside the data to a unique year with different minutes and seconds for each athlete
    by separating the minutes and seconds string and changing each 'Time' element with the new format */

    const newTime = data.map((n) => {
        let separateTime = n.Time.split(':');
        n.Time = new Date(2000, 0, 0, 0, separateTime[0], separateTime[1])
    })

    //Get the max and min values for each line
    const minX = d3.min(data, (d) => d['Year']);
    const maxX = d3.max(data, (d) => d['Year']);
    
    const minY = d3.min(data, (d) => (d['Time']));
    const maxY = d3.max(data, (d) => (d['Time']));
    
    // Size of the SVG graph
    const w = 1000;
    const h = 500;
    const l = 80;
    const padding = 50;

    let general = d3.select('#main')
        .append('svg')
        .attr('width', w+padding*3)
        .attr('height', h+padding*2)
        .attr('class', 'main-svg')

    const xScale = d3.scaleLinear()
    .domain([(minX)-1, (maxX)+1])
    .range([0, w])

    const yScale = d3.scaleTime()
    .domain([minY, maxY])
    .range([0, h])

    let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .attr('class', 'tooltip')
        .style('visibility', 'hidden')

    general.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) =>  xScale(d.Year) + l)
    .attr('cy', (d) => yScale(d.Time) + padding)
    .attr('r', (d) => 5)
    .attr('class', 'dot')
    .attr('data-xvalue', (d) => d.Year)
    .attr('data-yvalue', (d) => d.Time)
    .style('fill', (d) => (d.Doping == '' ? '#26de81': '#fd9644'))
    .style('opacity', 0.8)
    .style('stroke', 'black')
    .on('mouseover', (e, d) => {
        tooltip.transition()
        .duration(600)
        .style('opacity', 0.7)
        .style('visibility', 'visible')
        .style('background-color', `${d.Doping == '' ? '#26de81': '#fd9644'}`)
        .attr('data-year', d.Year);
        tooltip.html(` <strong>Athlete:</strong> ${d.Name} <br> <strong>Nationality:</strong> ${d.Nationality} <br> <strong>Year:</strong> ${d.Year} <br>  <strong>Doping:</strong> ${(d.Doping == '' ? 'none' : d.Doping)}`);
    })
    .on('mousemove', (e, d) => {
        tooltip.style('top', (event.pageY-80)+'px')
        .style('left', (event.pageX+20)+'px')
        .attr('data-year', d.Year);
    })
    .on('mouseout', (e, d) => {
        tooltip.transition()
        .duration(500)
        .style('opacity', 0.9)
        .style('visibility', 'hidden');
    })

    const square1 = d3.select('.legendSquares')
    .append('div')
    .attr('class', 'square square1')
    .style('background-color', '#fd9644')
    
    const square2 = d3.select('.legendSquares')
    .append('div')
    .attr('class', 'square square2')
    .style('background-color', '#26de81')

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    general.append('g').attr('transform', `translate(${l}, ${h + padding})`).call(xAxis).attr('id', 'x-axis').attr('class', 'xAxisClass');

    general.append('g').attr('transform', `translate(${l}, ${padding})`).call(yAxis).attr('id', 'y-axis').attr('class', 'yAxisClass');
    
})