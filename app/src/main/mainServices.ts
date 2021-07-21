import { ipcMain, app, Menu, BrowserWindow, dialog } from "electron";
import { I18n } from "../core/i18n";
import { addRecentDocument } from "./recently";

export function initializationMainServices() {

    ipcMain.on('getLocale', (event) => {
        event.returnValue = app.getLocale();
    });

    ipcMain.on('getArgv', (event) => event.returnValue = process.argv);

    ipcMain.on('getUserData', (event) => event.returnValue = app.getPath('userData'));

    /* 设置编辑菜单的可选择性 */
    ipcMain.on('setEditMemuEnable', (_event, isSelected) => {
        let menu = Menu.getApplicationMenu(), item;
        if (menu) {
            (item = menu.getMenuItemById('idMenuCut')) && item && (item.enabled = isSelected);
            (item = menu.getMenuItemById('idMenuCopy')) && item && (item.enabled = isSelected);
            (item = menu.getMenuItemById('idMenuPaste')) && item && (item.enabled = isSelected);
        }
    });

    ipcMain.on('setTitle', (_event, title) => BrowserWindow.getFocusedWindow()?.setTitle(title));

    ipcMain.on('setFileNameToTitle', (_event, fileName) => {
        let title = "";
        if (fileName) {
            let index = fileName.lastIndexOf("/");

            if (fileName.lastIndexOf("\\") > -1) index = fileName.lastIndexOf("\\");
            title = fileName.substring(index + 1) + " - ";
        }

        let appInstance = BrowserWindow.getFocusedWindow();
        if (appInstance) {
            appInstance.setTitle(title + I18n.V("sAppName"));
        }
    });

    ipcMain.on('openDialog', (event, argvString) => {
        let argv = JSON.parse(argvString);
        dialog.showOpenDialog(argv)
            .then(result => {
                event.sender.send('openDialog-reply', JSON.stringify(result));
            })
    });

    ipcMain.on('saveDialog', (event, argvString) => {
        let argv = JSON.parse(argvString);
        dialog.showOpenDialog(argv)
            .then(result => {
                event.sender.send('saveDialog-reply', JSON.stringify(result));
            })
    });

    ipcMain.on('addRecentDocument', (event, argv) => {
        if (argv) {
            addRecentDocument(argv);
            return event.returnValue = true;
        }
        event.returnValue = false;
    });
}