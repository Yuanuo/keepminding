import { appConfig, IRecentDoc } from "../core/conf";
import { logger } from "../core/logger";
import moment = require("moment");

// /**
//  * 打开一个最近打开的文件
//  * @param menuItem
//  */
// export function openRecentByRender() {
// }

export function openRecentDocuments() {
    let confModel = appConfig.getModel();
    let listGroup = [] as String[];
    if (confModel.recents && confModel.recents.length > 0) {
        let maxNum = confModel.recentMaxNum || 10;

        for (let i = 0; i < Math.min(confModel.recents.length, maxNum); i++) {
            // console.info('recent.' + i + ': ' + confModel.recents[i].path);
            // { label: confModel.recents[i].path, click: openRecentDocument }
            listGroup.push(`
            <a onclick="openRecentDocument1(this)" class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex">
                    <h5 class="mb-2 h5">${confModel.recents[i].path}</h5>
                </div>
                <small class="text-muted">${confModel.recents[i].time}</small>
            </a>
            `);
        }

        // 加入清除菜单
        // menu.append(new MenuItem({ type: "separator" }));
        // menu.append(new MenuItem({ id: 'clearRecentDocuments', label: I18n.V("miClearRecent"), click: () => clearRecentDocuments() }));
    }

    bootbox.alert({
        title: 'Recent Documents',
        size: 'extra-large',
        message: `
    <div class="list-group modal-dialog modal-dialog-scrollable">
      ${listGroup.join('')}
    </div>
    ` });
}
function openRecentDocument1(itm: any) {
    alert($(itm).children('h5').text());
}