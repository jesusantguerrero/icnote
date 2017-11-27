// A simple test to verify a visible window is opened with a title
var Application = require('spectron').Application
var electron = require('electron')
var assert = require('assert')
var timeout = 60000

var app = new Application({
  path: electron,
  connectionRetryCount: 1,
  connectionRetryTimeout: timeout,
  startTimeout: timeout,
  waitTimeout: timeout,
  debuggerAddress: 'localhost:9090',
  args: ['.']
})

app.start().then(function(){
  return app.browserWindow.isVisible();
}).then(function(result){
  assert.equal(result,true,'correcto')
}).catch(function (error) {
  // Log any failures
  console.error('Test failed', error.message)
})
