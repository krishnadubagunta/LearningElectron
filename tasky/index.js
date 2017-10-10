const path = require('path');
const electron = require('electron');
const { app, ipcMain } = electron;
const TimerTray = require('./app/timer_tray');
const MainWindow = require('./app/MainWindow');

let mainWindow, tray;

app.on('ready', () => {
	app.dock.hide();
	mainWindow = new MainWindow(`file://${__dirname}/src/index.html`);
	const iconName =
		process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
	const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
	tray = new TimerTray(iconPath, mainWindow);
});

ipcMain.on('updated-timer', (event, timeLeft) => {
	tray.setTitle(timeLeft);
});
