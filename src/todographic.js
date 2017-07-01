exports.makeChart = function(canvas,values,labels) {
    var data = {
      labels: labels,
      datasets: [{
        label: "Clientes",
        fill: true,
        backgroundColor: ["#555", "#ccc"],
        borderColor: "#fff",
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
        data: values,
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

    console.log('creado chart');
    console.log(canvas);
    console.log(values)
    console.log(labels)
    
  }