import { ipcRenderer } from "electron";
import { sExportTitle, openFileTypes, saveFileTypes } from "../define";
import { appBase } from "./base";
import { saveDocument, openDocument } from "./file";
import { appConfig } from "../core/conf";
import { join, basename } from "path";
import { getUserDataDir } from "../core/path";
import { I18n } from "../core/i18n";
import { logger } from "../core/logger";
import { exportFile } from "./window";
import { getDefaultPath } from "./minder";

/**
 * 打开脑图文件
 *
 * 快捷键：Ctrl + O
 * 行为：弹出打开对话框，并在新窗口中载入选择的文件
 */
export function openDialog() {
    if (appBase.hasSaved()) {
        // 已经保存了，本窗口打开

        ipcRenderer.once('openDialog-reply', (event, resultString) => {
            let result = JSON.parse(resultString);
            console.log(result);
            let fileNames = result.filePaths;
            if (!fileNames) return;

            openDocument(fileNames[0]);
        });

        ipcRenderer.send('openDialog', JSON.stringify({ filters: [{ name: sExportTitle, extensions: openFileTypes }] }));

    } else {
        bootbox.alert(I18n.V("sSaveTip"));
    }
}

/**
 * 保存脑图文件
 *
 * 快捷键：Ctrl + S
 * 行为：新建文件=另存为；老文件=保存修改
 */
export function saveDialog() {
    let path = appBase.getCurrentDocument();
    if (path) {
        saveDocument(path);
    } else {
        let conf = appConfig.getModel();
        if (conf.isAutoSave) {
            // 如果开启了自动保存，就获取一个路径，直接保存
            saveDocument(getDefaultPath());
        } else {
            // 否则，调用另存为
            saveAsDialog();
        }
    }
}

/**
 * 另存为脑图
 *
 * 快捷键：Ctrl + Shift + S
 * 行为：弹出保存对话框，选择保存路径及文件名后，保存当前文件
 */
export function saveAsDialog() {
    let newPath = join(getUserDataDir(), `${minder.getRoot().data.text}.kmind`);

    // 如果有，通过当前文件路径，生成一个新的文件路径
    let srcPath = appBase.getCurrentDocument();
    if (srcPath) {
        let rootPath = srcPath.replace(basename(srcPath), "");
        newPath = getDefaultPath(rootPath); // 生成一个文件的地址
    }

    ipcRenderer.once('saveDialog-reply', (event, resultString) => {
        let result = JSON.parse(resultString);
        console.log(result);
        let fileName = result.filePath;
        if (!fileName) return;

        saveDocument(fileName);

        appBase.setCurrentDocument(fileName);
    });

    ipcRenderer.send('saveDialog', JSON.stringify({ title: I18n.V("sSaveKm"), defaultPath: newPath, filters: [{ name: sExportTitle, extensions: saveFileTypes }] }));
}

/**
 * 重选自动保存的目录
 */
export function setSavePath() {
    try {
        let conf = appConfig.getModel();

        ipcRenderer.once('openDialog-reply', (event, resultString) => {
            let result = JSON.parse(resultString);
            console.log(result);
            let fileNames = result.filePaths;
            if (!fileNames) return;

            conf.defSavePath = fileNames[0];
            appConfig.save(conf);
        });

        ipcRenderer.send('openDialog', JSON.stringify({ properties: ["openDirectory"], defaultPath: conf.defSavePath }));
    } catch (ex: any) {
        logger.error(ex);
    }
}

/**
 * 导出文件
 */
export function exportDialog() {
    // 目录应该为当前文件的目录
    let newPath = join(getUserDataDir(), minder.getRoot().data.text);

    // 如果有，通过当前文件路径，生成一个新的文件路径
    let srcPath = appBase.getCurrentDocument();
    if (srcPath) {
        let rootPath = srcPath.replace(basename(srcPath), "");
        newPath = getDefaultPath(rootPath); // 生成一个文件的地址
    }

    let filters = [];
    let pool = kityminder.data.getRegisterProtocol();
    for (let name in pool) {
        // 目前导出 md 文件有问题，暂时跳过
        if (name === "markdown") continue;
        if (name === "json") {
            filters.push({
                name: sExportTitle,
                extensions: saveFileTypes
            });
            continue;
        }

        if (pool.hasOwnProperty(name) && pool[name].encode) {
            filters.push({
                name: pool[name].fileDescription,
                extensions: [pool[name].fileExtension.replace(".", "")]
            });
        }
    }

    ipcRenderer.once('saveDialog-reply', (event, resultString) => {
        let result = JSON.parse(resultString);
        console.log(result);
        let fileName = result.filePath;
        if (!fileName) return;

        let ext = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
        let protocol = null;
        let pool = kityminder.data.getRegisterProtocol();
        for (let name in pool) {
            if (pool.hasOwnProperty(name) && pool[name].encode) {
                if (pool[name].fileExtension === ext) {
                    protocol = pool[name];
                    break;
                }
            }
        }

        exportFile(protocol, fileName);
    });

    ipcRenderer.send('saveDialog', JSON.stringify({ title: I18n.V("sExportKm"), defaultPath: newPath, filters: filters }));
}
