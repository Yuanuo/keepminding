import { ipcRenderer, shell } from "electron";
import { I18n } from "../core/i18n";
import { appBase } from "./base";
import { copy, writeText, writeBuffer } from "../core/io";
import execAsync from "../core/exec";
import { logger } from "../core/logger";
import { initRoot, getDefaultPath } from "./minder";
import { basename } from "path";

//#region 3. 窗口对话框相关

/**
 * 新建窗口
 *
 * 快捷键：Ctrl + Shift + N
 * 行为：新窗口打开一个空白文档
 */
export function newDialog() {
    // 获取当前执行程序的路径
    // FIXME: 仍未解决——Windows不支持空格转义。
    // TODO: 最好的办法还是借鉴Typora、VSCode，不开新实例      
    let appPath = convertPathSpaces(process.execPath);
    let command = "";

    switch (process.platform) {
        case "win32":
            command = "start " + appPath;
            break;
        case "darwin":
            // TODO： 待验证
            command = appPath;
            break;
        default:
        case "linux":
            // TODO： 待验证
            command = appPath;
            break;
    }

    // 执行打开该文件的命令
    execAsync(command, "")
        .then(output => {
            logger.info(output);
        })
        .catch(err => {
            logger.error("asyncExec err: ", err);
        });
}

/**
 * 新建文件
 *
 * 快捷键：Ctrl + N
 * 行为：在当前窗口打开一个空白文档
 */
export function newFile() {
    // 实际上新建文件的动作和关闭文件相同，最多只是提示信息不同
    if (appBase.hasSaved()) {
        doCloseFile();
    } else {
        bootbox.confirm({
            message: I18n.V("sNewFileTip"),
            callback: (result: boolean) => {
                if (result) {
                    doCloseFile();
                }
            }
        });
    }
}

function doCloseFile() {
    appBase.setState("closing");

    // 若已保存，则直接初始化
    initRoot();

    ipcRenderer.send('setFileNameToTitle', '');

    logger.info(`关闭文件: "${appBase.getCurrentDocument()}"`);

    appBase.setState("none");
}

/**
 * 关闭文件
 *
 * 快捷键：Ctrl + W
 * 行为：关闭当前文件，如文件有修改，则提示是否保存
 */
export function closeFile() {
    // 如果关闭成功，也触发一次保存事件
    if (appBase.hasSaved()) {
        doCloseFile();
    } else {
        bootbox.confirm({
            message: I18n.V("sCloseTip"),
            callback: (result: boolean) => {
                if (result) {
                    doCloseFile();
                }
            }
        });
    }
}

/**
 * 生成副本
 *
 * Ctrl+Alt+N
 * 复制一个副本，可选择在当前窗口或新窗口打开
 * 
 * TODO: 未完成，还要考虑：
 *     1. 同上，不开新实例
 *     2. 如文件有修改，先询问是否把更改同步到副本当中
 */
export function cloneFile() {
    // 创建一个新文件，并在新窗口打开它
    let srcPath = appBase.getCurrentDocument();
    if (srcPath) {
        let rootPath = srcPath.replace(basename(srcPath), "");
        let dstKmPath = getDefaultPath(rootPath); // 生成一个文件的地址
        copy(srcPath, dstKmPath); // 复制一份

        // 获取当前执行程序的路径
        let appPath = convertPathSpaces(process.execPath);
        let command = "";

        switch (process.platform) {
            case "win32":
                command = "start " + appPath;
                break;
            case "darwin":
                // TODO： 待验证
                command = appPath;
                break;
            default:
            case "linux":
                // TODO： 待验证
                command = appPath;
                break;
        }

        // 执行打开该文件的命令
        execAsync(command, `"${dstKmPath}"`)
            .then(output => {
                logger.info(output);
            })
            .catch(err => {
                logger.error("asyncExec err: ", err);
            });
    } else {
        //new Error("No files are currently open.");
        bootbox.alert(I18n.V("sNoOpenFile"));
    }
}

// /**
//  * 打开新窗口
//  * tag: absolete
//  */
// export function openWindow() {
//   let newWin: Electron.BrowserWindow | null;

//   newWin = new remote.BrowserWindow({
//     minWidth: 700,
//     minHeight: 700,
//     width: 1000,
//     height: 800,

//     fullscreenable: true,
//     show: false,
//     backgroundColor: "#fbfbfb"
//   });

//   newWin.on("close", function() {
//     if (newWin) newWin = null;
//   });

//   logger.info(`open new window '${sIndexUrl}' `);

//   newWin.loadURL(sIndexUrl);
//   newWin.show();
// }

/**
 * 在文件夹中打开文件
 */
export function openFileInFolder() {
    let path = appBase.getCurrentDocument();
    if (path) {
        shell.showItemInFolder(path);
    } else {
        bootbox.alert(I18n.V("sNoOpenFile"));
    }
}

// inner function.
export function exportFile(protocol: any, filename: string) {
    let options = {
        download: true,
        filename: filename
    };

    minder.exportData(protocol.name, options).then(function (data: any) {
        switch (protocol.dataType) {
            case "text":
                writeText(filename, data);
                break;
            case "base64":
                let base64Data = data.replace(/^data:image\/\w+;base64,/, "");
                let dataBuffer = new Buffer(base64Data, "base64");

                writeBuffer(filename, dataBuffer);
                break;
            case "blob":
                break;
        }

        return null;
    });
}

// inner function.
// 将路径中的空格转义。
function convertPathSpaces(filePath: String) {
    return filePath.replace(/[ ]/g, "\\ ");
}
//#endregion
