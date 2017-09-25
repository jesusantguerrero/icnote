
export default class {
  constructor(canvas,values,labels,tasksInfo) {
    const data = {
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

    const options = {
      responsive: true,
      maintainAspectRatio: false
    } 

    
    this.$doneCount = $('.done')
    this.$todoCount = $('.todo')
    this.$avgCount = $('.avg')
    
    this.myPieChart = new Chart(canvas, {
      type: 'doughnut',
      data: data,
      options: options
    }) 

    if(tasksInfo){
      this.updateTaskInfo(tasksInfo)
    }
  }
  
  update (values, tasksInfo) {
    this.myPieChart.config.data.datasets[0].data = values
    this.myPieChart.update()
    this.updateTaskInfo(tasksInfo)
  }

  updateTaskInfo (tasksInfo) {
    this.$doneCount.text(tasksInfo.done)
    this.$todoCount.text(tasksInfo.todo)
    this.$avgCount.text(tasksInfo.avg)
  }
  
}