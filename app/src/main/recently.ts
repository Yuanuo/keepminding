import { appConfig, IRecentDoc } from "../core/conf";
import { logger } from "../core/logger";
import { BrowserWindow, Menu } from "electron";
import moment = require("moment");
import { appMenu, RecentsMode } from "./menu";

/**
 * 保存一个文件打开记录
 * @param filePath 文件路径
 */
export function addRecentDocument(filePath: string) {
    try {
        const time = moment().format("YYYY-MM-DD HH:mm:ss");

        const confModel = appConfig.getModel();

        const items: IRecentDoc[] = [{ time: time, path: filePath }];

        if (confModel.recents) {
            items.push(...(confModel.recents.filter((value: IRecentDoc) => value.path !== filePath)));
        }

        confModel.recents = items;

        appConfig.save(confModel);

        // rebuild app menu
        if (appMenu.getRecentsMode() === RecentsMode.managed) {
            Menu.setApplicationMenu(appMenu.buildMenuWithManagedRecents());
        }
    } catch (ex: any) {
        logger.error(ex);
    }
}

/**
 * 清除最近打开的文件记录
 */
export function clearRecentDocuments() {
    try {
        const confModel = appConfig.getModel();

        confModel.recents = [];

        appConfig.save(confModel);

        // rebuild app menu
        if (appMenu.getRecentsMode() === RecentsMode.managed) {
            Menu.setApplicationMenu(appMenu.buildMenuWithManagedRecents());
        }
    } catch (ex: any) {
        logger.error(ex);
    }
}

/**
 * 打开一个最近打开的文件
 * @param menuItem
 */
export function openRecentDocument(menuItem: Electron.MenuItem) {
    BrowserWindow.getFocusedWindow()?.webContents.send('openDocument', menuItem.label)
}
