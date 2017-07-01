
exports.makeChart = function servicesChart(canvas,values,labels) {
    var data = {
      labels: services.nombres,
      datasets: [{
        label: "Clientes",
        fill: true,
        backgroundColor: ["rgba(3,169,244 ,1)", "rgba(3,169,244 ,.8)", "rgba(3,169,244 ,.6)","rgba(3,169,244 ,.4)"],
        borderColor: "rgba(3,169,244 ,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "#555",
        pointBackgroundColor: "dodgerblue",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "dodgerblue",
        pointHoverBorderColor: "#555",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data:values,
        spanGaps: false,
      }]
    }
    var options = {
      responsive: true,
      maintainAspectRatio: false
    };
    var myPieChart = new Chart(canvas, {
      type: 'doughnut',
      data: data,
      options: options
    });
  }