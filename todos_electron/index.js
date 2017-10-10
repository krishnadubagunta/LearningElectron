const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow, addWindow;
app.on('ready', () => {
	const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
	mainWindow = new BrowserWindow({
		width,
		height
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.on('close', () => app.quit());
	const fileMenu = Menu.buildFromTemplate(fileTemplate);
	Menu.setApplicationMenu(fileMenu);
});

ipcMain.on('todo:add', (event, value) => {
	addWindow.close();
	mainWindow.webContents.send('todo:add', value);
});

const fileTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Todo',
				accelerator: 'CommandOrControl+N',
				click() {
					createAddWindow();
				}
			},
			{
				label: 'Clear Todo',
				accelerator: 'CommandOrControl+Alt+c',
				click() {
					mainWindow.webContents.send('todo:clear');
				}
			},
			{
				label: 'Quit',
				accelerator: 'CommandOrControl+Q',
				click() {
					app.quit();
				}
			}
		]
	}
];

function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 400,
		height: 250,
		title: 'New Todo Item'
	});
	addWindow.loadURL(`file://${__dirname}/add.html`);
	addWindow.on('close', () => (addWindow = null));
}

if (process.platform === 'darwin') {
	fileTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
	fileTemplate.push({
		label: 'Developer',
		submenu: [
			{
				role: 'reload'
			},
			{
				label: 'Developer Console',
				accelerator: 'CommandOrControl+Alt+i',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			}
		]
	});
}
