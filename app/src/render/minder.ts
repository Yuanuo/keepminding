import { appBase } from "./base";
import { I18n } from "../core/i18n";
import { ipcRenderer } from "electron";
import { join } from "path";
import { appConfig } from "../core/conf";
import { getBackupDirectoryPath } from "../core/path";
import { existsSync } from "fs";
import { logger } from "../core/logger";

export function setMinder(json: JSON | any) {
    editor.minder.importJson(json);
}

export function getMinder() {
    return editor.minder.exportJson();
}

/**
 * 检查是不是空白的数据
 */
export function hasData() {
    let nodes = editor.minder.getAllNode().length;
    let rootText = editor.minder.getRoot().data.text;

    return nodes != 1 || rootText != I18n.V("sMainTopic");
}

/**
 * 初始化根节点
 */
export function initRoot() {
    appBase.setCurrentDocument(null);

    ipcRenderer.send('setTitle', I18n.V("sAppName"));

    setMinder({
        root: { data: { text: I18n.V("sMainTopic") } },
        template: "filetree",
        theme: "fresh-blue"
    });

    editor.minder.select(minder.getRoot(), true);
}

/**
 * 获取一个默认路径
 */
export function getDefaultPath(path?: string | undefined): string {
    // 使用`中心主题`做文件名
    let rootText = editor.minder.getRoot().data.text;

    // 如果没有配置默认路径，就用备份目录
    let dir = appConfig.getModel().defSavePath || getBackupDirectoryPath();

    // 如果指定了，就用指定的路径
    if (path) dir = path;

    let counter = 0;
    let filePath = join(dir, `${rootText}.km`);

    do {
        filePath = join(dir, `${rootText}${counter++ || ""}.km`);
    } while (existsSync(filePath));

    return filePath;
}

/**
 * 设置选择菜单触发
 * @param isSelected
 */
export function onSelectedNodeItem(isSelected: boolean) {
    try {
        ipcRenderer.send('setEditMemuEnable', isSelected);
    } catch (ex) {
        logger.error(ex);
    }
}
