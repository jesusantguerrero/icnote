const electron = require('electron'),
      cp = require('child_process'),
      {app, BrowserWindow, shell,systemPreferences,ipcMain} = electron,
      $ = require('jquery');
      os = require('os');


var winSearcher = null,
    winClock = null,
    winNewNote = null,
    dataTip = false;

// inicio de la app


app.on('ready', () => {
  const {screen} = electron;
  const mainScreen = screen.getPrimaryDisplay();
  var accentColor = systemPreferences.getAccentColor();
  accentColor = accentColor.slice(0,6);
  let x = mainScreen.bounds.width / 2 - 600 / 2;

  winSearcher = new BrowserWindow({width: 600,height: 50,show: false,skipTaskbar: true,transparent: true,frame: false,
                                      y: 30,x: x,resizable: false});

  winSearcher.loadURL(`file://${__dirname}/index` + ".html");
  winSearcher.once('ready-to-show', () => {
    winSearcher.show();
    var styles = `#buscador:hover{ border: 1px solid #${accentColor} !important;box-shadow: 0px 0px 5px #${accentColor} !important;}`
    winSearcher.webContents.insertCSS(styles);
    console.log(styles);
    getClock();
  });

  // all the tools of the program / todas as herramientas del programa

  // el reloj
  function getClock() {
    let xPos = mainScreen.size.width - 500;
    let yPos = mainScreen.size.height / 2 - 100;

    winClock = new BrowserWindow({ width: 600, height: 300,x: xPos,y: yPos, transparent: true, show: false,frame: false,
                                    resizable: false, skipTaskbar: true });

    winClock.loadURL(`file://${__dirname}/tools/clock.html`);
    winClock.on('ready-to-show', () => {
      winClock.show();
    });
  }

  // notas
  function newNote() {
    winNewNote = new BrowserWindow({width: 900,height: 600, show: false, transparent: true, frame: false});
    winNewNote.loadURL(`file://${__dirname}/tools/newnote.html`);
    winNewNote.on('ready-to-show', () => {
      winNewNote.show();
      winNewNote.webContents.openDevTools();
    });   


    ipcMain.on('note-close',()=>{
      winNewNote.close();
      winNewNote = null;

    });

    ipcMain.on('note-min',()=>{
     winNewNote.minimize();
    });
    
  }


  // comunicacion con los renderer

  ipcMain.on('data-tip', () => {
    if (!dataTip) {
      winSearcher.setSize(600, 170, true);
      dataTip = true;
    } else {
      winSearcher.setSize(600, 50, true);
      dataTip = false;
    }

  });

  ipcMain.on('note', () => {
    if (winNewNote == null) {
        newNote();
    } 
  });



  ipcMain.on('clock', () => {
    if (winClock == null) {
      getClock();
    } else {
      winClock.close();
      winClock = null;
    }
  });

  ipcMain.on('exit', () => {
    app.exit();
  });



  // ejecucion para los comandos para la llamada de programas desde el searcher
  exports.command = function (cmd) {

    // recibimos el comando y lo ejecutamos con el child process
    var command = cp.exec("start " + [cmd]);

    command.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    command.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    command.on('exit', (code) => {
      console.log(`Child exited with code ${code}`);
    });

  }

  // para visualizar los logs por consola desde el renderer
  exports.log = function (word) {
    console.log(word);
  }

});