import { I18n } from "../core/i18n";
import { app, BrowserWindow, Menu } from "electron";
import { appConfig } from "../core/conf";
import { MenuItemConstructorOptions } from "electron/main";
import { clearRecentDocuments, openRecentDocument } from "./recently";

export const enum RecentsMode {
    standard, renderer, managed
}

function _render(channel: string, ...args: any[]): void {
    BrowserWindow.getFocusedWindow()?.webContents.send(channel, args);
}

class AppMenu {
    constructor() { }

    getTemplate(recentsMode: RecentsMode): MenuItemConstructorOptions[] {
        const isMac = process.platform === 'darwin';
        const confModel = appConfig.getModel();

        return [
            // { role: 'appMenu' }
            ...(isMac ? [{
                label: app.name,
                submenu: [
                    { role: 'about', label: I18n.V("miAbout"), },
                    { type: 'separator' },
                    { label: I18n.V("miPreferences"), click: () => _render('preferencesDialog') },/* 打开偏好设置 */
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideothers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            }] : []) as MenuItemConstructorOptions[],
            // { role: 'fileMenu' }
            {
                label: I18n.V("mFile"),
                submenu: [
                    { label: I18n.V("miNewFile"), accelerator: "CmdOrCtrl+N", click: () => _render('newFile') },
                    { label: I18n.V("miOpenFile"), accelerator: "CmdOrCtrl+O", click: () => _render('openDialog') },
                    { label: I18n.V("miCloseFile"), accelerator: "CmdOrCtrl+W", click: () => _render('closeFile') },
                    { label: I18n.V("miCloneFile"), accelerator: "CmdOrCtrl+Alt+N", click: () => _render('cloneFile') },
                    { type: "separator" },
                    { label: I18n.V("miOpenFolder"), accelerator: "CmdOrCtrl+Shift+O", click: () => _render('openFileInFolder') },
                    ...(this.buildRecentsMenu(recentsMode, confModel) as MenuItemConstructorOptions[]),
                    { type: "separator" },
                    { label: I18n.V("miSave"), accelerator: "CmdOrCtrl+S", click: () => _render('saveDialog') },
                    { label: I18n.V("miSaveAs"), accelerator: "CmdOrCtrl+Shift+S", click: () => _render('saveAsDialog') },
                    { label: I18n.V("miExport"), accelerator: "CmdOrCtrl+E", click: () => _render('exportDialog') },
                    { type: "separator" },
                    { label: I18n.V("miAutoSave"), type: "checkbox", checked: confModel.isAutoSave, click: (itm: Electron.MenuItem) => _render('autoSave', itm.checked) },
                    { label: I18n.V("miSavePath"), accelerator: "CmdOrCtrl+R", click: () => _render('setSavePath') }, /* AutoSave Directory */
                    ...(!isMac ? [
                        { type: "separator" },
                        { role: 'close' }
                    ] : []) as MenuItemConstructorOptions[]
                ]
            },
            // { role: 'editMenu' }
            {
                label: I18n.V("mEdit"),
                submenu: [
                    { role: "undo", label: I18n.V("miUndo"), click: () => _render('undo') },
                    { role: "redo", label: I18n.V("miRedo"), click: () => _render('redo') },
                    { type: "separator" },
                    { role: "cut", label: I18n.V("miCut"), id: "idMenuCut" },
                    { role: "copy", label: I18n.V("miCopy"), id: "idMenuCopy" },
                    { role: "paste", label: I18n.V("miPaste"), id: "idMenuPaste" }
                ]
            },
            // { role: 'customizeMenu' }
            ...(!isMac ? [
                {
                    label: I18n.V("mCustomize"),  /* 设置 */
                    submenu: [
                        { label: I18n.V("miPreferences"), click: () => _render('preferencesDialog') } /* 打开偏好设置 */
                    ]
                }
            ] : []) as MenuItemConstructorOptions[],
            // { role: 'viewMenu' }
            {
                label: 'View',
                submenu: [
                    { role: 'resetZoom' },
                    { role: 'zoomIn' },
                    { role: 'zoomOut' },
                    { type: 'separator' },
                    { role: 'togglefullscreen' }
                ]
            },
            // { role: 'windowMenu' }
            {
                label: I18n.V("mWindow"),
                submenu: [
                    { label: I18n.V("miMaxWin"), click: () => BrowserWindow.getFocusedWindow()?.maximize() },
                    { role: 'minimize', label: I18n.V("miMinWin") },
                    ...(isMac ? [
                        { type: 'separator' },
                        { role: 'front' },
                        { type: 'separator' },
                        { role: 'window' }
                    ] : []) as MenuItemConstructorOptions[],
                    { type: 'separator' },
                    { role: 'reload' },
                    { role: 'forceReload' },
                    { role: 'toggleDevTools', label: I18n.V("miToggleDevTools") }
                ]
            },
            {
                role: 'help', label: I18n.V("mHelp"),
                submenu: [
                    { label: I18n.V("miShortcut"), accelerator: "CmdOrCtrl+/", click: () => _render('shortcutDialog') }, /* 快捷键 */
                    { type: "separator" },
                    { label: I18n.V("miBackup"), click: () => _render('license') },  /* 备份百度脑图到本地 */
                    { label: I18n.V("miCheckVer"), click: () => _render('checkVersion') },  /* 检查更新 */
                    ...(!isMac ? [
                        { type: "separator" },
                        { label: I18n.V("miAbout") + ' #', click: () => _render('about') }
                    ] : []) as MenuItemConstructorOptions[]
                ]
            }
        ];
    }

    private buildRecentsMenu(recentsMode: RecentsMode, confModel: any): MenuItemConstructorOptions[] {
        this.recentsMode = recentsMode;

        switch (recentsMode) {
            case RecentsMode.renderer: {
                return [
                    { label: I18n.V("miOpenRecent"), click: () => _render('listRecentDocuments') }
                ] as MenuItemConstructorOptions[];
            }

            case RecentsMode.managed: {
                const submenuTemplate = [] as MenuItemConstructorOptions[];
                if (confModel.recents && confModel.recents.length > 0) {
                    const maxNum = confModel.recentMaxNum || 10;

                    for (let i = 0; i < Math.min(confModel.recents.length, maxNum); i++) {
                        submenuTemplate.push({ label: confModel.recents[i].path, click: openRecentDocument });
                    }
                    submenuTemplate.push({ type: "separator" });
                    submenuTemplate.push({
                        label: I18n.V("miClearRecent"), click: () => {
                            clearRecentDocuments();
                            Menu.setApplicationMenu(appMenu.buildMenuWithManagedRecents());
                        }
                    });
                }
                return [
                    {
                        label: I18n.V("miOpenRecent"),
                        submenu: submenuTemplate
                    }
                ] as MenuItemConstructorOptions[];
            }

            case RecentsMode.standard:
            default: {
                return [
                    {
                        role: 'recentDocuments', label: I18n.V("miOpenRecent"),
                        submenu: [
                            { role: 'clearRecentDocuments', label: I18n.V("miClearRecent") }
                        ]
                    }
                ] as MenuItemConstructorOptions[];
            }
        }
    }

    private recentsMode = RecentsMode.standard;

    getRecentsMode() {
        return this.recentsMode;
    }

    buildMenuWithRoleRecents(): Menu {
        return Menu.buildFromTemplate(this.getTemplate(RecentsMode.standard));
    }

    buildMenuWithRenderRecents(): Menu {
        return Menu.buildFromTemplate(this.getTemplate(RecentsMode.renderer));
    }

    buildMenuWithManagedRecents(): Menu {
        return Menu.buildFromTemplate(this.getTemplate(RecentsMode.managed));
    }
}

export let appMenu = new AppMenu();