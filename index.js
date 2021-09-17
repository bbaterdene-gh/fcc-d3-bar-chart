const drawBarChart = (data) => {
  const graphWidth = 900
  const graphHeight = 460
  const paddingBottom = 50
  const barWidth = 3
  const svg = d3.select('svg')
                .attr('width', graphWidth)
                .attr('height', graphHeight + paddingBottom)

  const xScale = d3.scaleBand()
                   .domain(data.map(d => new Date(d[0])))
                   .range([0, graphWidth])
                   .padding(1)
  const yScale = d3.scaleLinear()
                   .domain(d3.extent(data, d => d[1]))
                   .range([graphHeight, 0])

  svg.selectAll('rect')
     .data(data)
     .join('rect')
     .attr('x', d => xScale(new Date(d[0])))
     .attr('y', d => yScale(d[1]))
     .attr('width', barWidth)
     .attr('height', d => graphHeight - yScale(d[1]))
     .style('fill', '#33adff')
     .on('mouseover', function() {
       d3.select(this).style('fill', '#ffffff')
     })
     .on('mouseleave', function() {
       d3.select(this).style('fill', '#33adff')
    })
  console.log(data.length)
}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(resp => resp.json())
  .then(resp => {
    drawBarChart(resp.data)
  })