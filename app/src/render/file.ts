import { logger } from "../core/logger";
import { I18n } from "../core/i18n";
import { existsSync } from "fs";
import { readJson, writeJson } from "../core/io";
import { appBase } from "./base";
import { ipcRenderer } from "electron";
import { setMinder, getMinder } from "./minder";
import { appConfig } from "../core/conf";

/**
 * 打开一个脑图文件
 * @param filePath 文件路径
 */
export function openDocument(filePath: string) {
    try {
        logger.info(`open file: ${filePath}`);
        if (!existsSync(filePath)) throw new Error(`file not found, ${filePath}`);

        // 开启状态保护
        appBase.setState("opening");

        appBase.setCurrentDocument(filePath);

        setMinder(readJson(filePath));

        ipcRenderer.send('setFileNameToTitle', filePath);

        appBase.setState("none");
    } catch (error: any) {
        logger.error("openKm error, ", error);
    }
}

/**
 * 保存一个脑图文件
 * @param filePath 文件路径
 */
export function saveDocument(filePath: string) {
    try {
        var minder = getMinder();

        // 修改内容时，记录日志
        logger.info(`${filePath} => ${JSON.stringify(minder)}`);

        appBase.setState("saving");

        appBase.setCurrentDocument(filePath);

        writeJson(filePath, minder);

        ipcRenderer.send('setFileNameToTitle', filePath);

        appBase.onSaved();

        appBase.setState("none");
    } catch (error: any) {
        logger.error("saveKm error, ", error);
    }
}

/**
 * 拖拽打开文件
 */
export function openFileByDrop() {
    logger.info("Start drag and drop Open File.");

    let body = document.body;

    body.ondrop = e => {
        e.preventDefault();
        if (e.dataTransfer) {
            let file = e.dataTransfer.files[0];
            let fileName = file.name.toLowerCase();
            if (!fileName.endsWith(".km") && !fileName.endsWith(".kmind")) {
                bootbox.alert(I18n.V("sLoadedError"));
                return false;
            }

            openDocument(file.path);
        }

        return false;
    };

    body.ondragover = body.ondragleave = body.ondragend = function () {
        return false;
    };
}

/**
 * 切换自动保存状态
 * @param menuItem
 */
export function autoSave(checked: boolean) {
    try {
        // 获取配置文件
        let confObj = appConfig.getModel();

        // 修改自动保存状态
        confObj.isAutoSave = checked;

        // 保存配置文件
        appConfig.save(confObj);
    } catch (ex: any) {
        logger.error(ex);
    }
}