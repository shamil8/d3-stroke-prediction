async function getAsyncData() {
    const data = await d3.csv('./data/healthcare-dataset-stroke-data.csv')

    return data
}

const drawBarChart = (data, height = 500, color = 'steelblue') => {
    const width = window.innerWidth
    const margin = ({top: 30, right: 0, bottom: 30, left: 40})

    const x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top])

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0))

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, data.format))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(data.y))


    const svg = d3.create('svg').attr("viewBox", [0, 0, width, height])

    svg.append("g")
        .attr("fill", color)
        .selectAll("rect")
        .data(data)
        .join('rect')
        .attr('x', (d, i) => x(i))
        .attr('y', d => y(d.value))
        .attr('height', d => y(0) - y(d.value))
        .attr('width', x.bandwidth())

    svg.append('g')
        .call(xAxis)

    svg.append('g')
        .call(yAxis)

    return svg.node()
}


getAsyncData().then((data) => {
    let uniqueData = new Map()


    data.forEach(({ age }) => {
        if (age < 1) { return }

        age = Math.round(age).toString()

        uniqueData.set(age,uniqueData.has(age) ? uniqueData.get(age) + 1 : 1)
    })


    const uniqueAges = []
    uniqueData.forEach((value, key) => uniqueAges.push({ name: key, value }))

    // uniqueData.delete()

    const barChart = document.getElementById('bar-chart')

    barChart.appendChild(drawBarChart(uniqueAges, 300, '#00539CFF'))
})
