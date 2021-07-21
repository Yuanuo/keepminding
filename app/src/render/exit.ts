import { ipcRenderer } from "electron";
import { I18n } from "../core/i18n";
import { appBase } from "./base";
import { logger } from "../core/logger";

export function monitorExitRequest() {
    logger.info(`invoke monitorExitRequest()`);

    // 监听与主进程的通信
    ipcRenderer.on("action", (event: Event, arg: string) => {
        switch (arg) {
            case "exit":
                if (appBase.hasSaved()) {
                    ipcRenderer.sendSync("reqaction", "exit");
                } else {
                    // 退出提示
                    bootbox.confirm(I18n.V("sExitTip"), (result: boolean) => {
                        if (result) {
                            ipcRenderer.sendSync("reqaction", "exit");
                        }
                    });
                }
                break;
        }
    });
}
