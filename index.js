const drawBarChart = (data) => {
  const graphWidth = 900
  const graphHeight = 460
  const paddingBottom = 50
  const paddingLeft = 80
  const paddingRight = 50
  const paddingTop =50
  const barWidth = 3.3
  const svg = d3.select('svg')
                .attr('width', graphWidth + paddingLeft + paddingRight)
                .attr('height', graphHeight + paddingBottom + paddingTop)

  const xScale = d3.scaleBand()
                   .domain(data.map(d => new Date(d[0])))
                   .range([0, graphWidth])

  const yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, d => d[1])])
                   .range([graphHeight, 0])

  const xAxis = d3.axisBottom()
                  .scale(xScale)
                  .tickValues(xScale.domain().filter(d => {
                    const quarter = Math.floor((d.getMonth() + 3) / 3);
                    return d.getFullYear() % 5 === 0 && quarter === 1
                  }))
                  .tickFormat(d3.timeFormat('%Y'));

  const yAxis = d3.axisLeft()
                  .scale(yScale)

  const tooltip = d3.select('#tooltip')

  const graph = svg.append('g')
                    .selectAll('rect')
                    .data(data)
                    .join('rect')
                    .attr('x', d => xScale(new Date(d[0])))
                    .attr('y', d => yScale(d[1]))
                    .attr('width', barWidth)
                    .attr('height', d => graphHeight - yScale(d[1]))
                    .style('fill', '#33adff')
                    .on('mouseover', function(e) {
                      _this = d3.select(this)
                      _this.style('fill', '#ffffff')
                      const [date, gdp] = _this.datum()
                      const year = date.split('-')[0]
                      const month = date.split('-')[1]
                      const quarter = Math.floor((+month + 2) / 3);
                      const formatter = d3.format(",")
                      const animation = d3.transition().duration(100)
                      tooltip
                      .html(`
                        ${year} Q${quarter}
                        <br />
                        $${formatter(gdp)} Billion
                      `)
                      .style('left', `${e.clientX + paddingLeft}px`)
                      .style('transform', `translateY(${paddingTop + paddingBottom}px)`)
                      .transition(animation)
                      .style('opacity', '0.9')

                    })
                    .on('mouseleave', function() {
                      d3.select(this).style('fill', '#33adff')
                      tooltip.style('opacity', 0)
                    })

  svg.append('g')
     .call(xAxis)
     .attr('transform', `translate(${paddingLeft}, ${graphHeight + paddingTop})`)

  svg.append('g')
     .call(yAxis)
     .attr('transform', `translate(${paddingLeft}, ${paddingTop})`)

  graph.attr('transform', `translate(${paddingLeft}, ${paddingTop})`)

  svg.append('text')
     .text('Gross Domestic Product')
     .attr('transform', `translate(${paddingLeft + 20}, ${paddingTop*3})rotate(-90)`)
     .attr('text-anchor', 'middle')

  svg.append('text')
     .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
     .attr('transform', `translate(${graphWidth - paddingLeft - paddingRight}, ${graphHeight + paddingTop + paddingBottom - 10})`)
     .attr('text-anchor', 'middle')

}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(resp => resp.json())
  .then(resp => {
    drawBarChart(resp.data)
  })