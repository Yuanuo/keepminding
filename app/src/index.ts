// --> ipcRender 渲染线程的入口
import { logger } from "./core/logger";
import { I18n } from "./core/i18n";
import { appConfig } from "./core/conf";
import { openFileByDrop, openDocument } from "./render/file";
import { saveDialog } from "./render/dialog";
import { monitorExitRequest } from "./render/exit";
import { appBase } from "./render/base";
import { onSelectedNodeItem, hasData } from "./render/minder";
import { ipcRenderer } from "electron";
import { initializationRendererServices } from "./render/renderServices";

// 进入即记录日志
logger.info("ipcRender init");

// 初始化渲染事件服务
initializationRendererServices();

// 开启拖动打开文件的功能
openFileByDrop();

// 监听退出请求
monitorExitRequest();

angular
    .module("kityminderDemo", ["kityminderEditor"])
    .config(function (configProvider: any) {
        configProvider.set("lang", I18n.getLang());

        // configProvider.set('imageUpload', '../server/imageUpload.php');
    })
    .controller("MainController", function ($scope: any) {
        $scope.initEditor = function (editor: any, minder: any) {
            editor = editor;
            minder = minder;
        };
    });

$(function () {
    if (minder != null) {
        // auto saving
        minder.on("contentchange", function (argv: any) {
            // 操作完成之后才触发事件
            if (appBase.getState() == "none") {
                logger.info(`invoked contentchange()`);

                appBase.onEdited();

                // 即使开启自动保存，必须有数据才保存
                if (appConfig.getModel().isAutoSave) {
                    saveDialog();
                }
            }
        });

        minder.on("selectionchange", function () {
            let node = minder.getSelectedNode();

            // 修改菜单的状态
            onSelectedNodeItem(!!node);
        });

        // 通过参数打开文件
        // 此方法需要放在注册 contentchange 事件之后。
        let argv = ipcRenderer.sendSync('getArgv');
        logger.info(`process.argv: ${argv}`);

        if (argv.length >= 2) {
            let filePath = argv[1] as string;

            if (filePath.indexOf("km") > -1) {
                openDocument(filePath);
            }
        }
    }
});

function openUrl(url: string) {
    require("electron").shell.openExternal(url);
}
