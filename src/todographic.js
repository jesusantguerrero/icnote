var myPieChart = null;
exports.makeChart = function(canvas,values,labels,tasksInfo) {
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
    

    if(tasksInfo){
      $('.done').text(tasksInfo.done)
      $('.todo').text(tasksInfo.todo)
      $('.avg').text(tasksInfo.avg)
    }
      myPieChart = new Chart(canvas, {
        type: 'doughnut',
        data: data,
        options: options
      }); 
  
  }

  