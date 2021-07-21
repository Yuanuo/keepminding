import { ipcRenderer } from "electron";
import { preferencesDialog } from "../ui/pref_dialog";
import { shortcutDialog } from "../ui/shortcut";
import { exportDialog, openDialog, saveAsDialog, saveDialog, setSavePath } from "./dialog";
import { redo, undo } from "./edit";
import { autoSave, openDocument } from "./file";
import { about, checkVersion, license } from "./help";
import { openRecentDocuments as listRecentDocuments } from "./recently";
import { cloneFile, closeFile, newDialog, newFile, openFileInFolder } from "./window";

export function initializationRendererServices() {

    ipcRenderer.on('newFile', newFile);

    ipcRenderer.on('newDialog', newDialog);

    ipcRenderer.on('openDialog', openDialog);

    ipcRenderer.on('closeFile', closeFile);

    ipcRenderer.on('cloneFile', cloneFile);

    ipcRenderer.on('openFileInFolder', openFileInFolder);

    ipcRenderer.on('listRecentDocuments', listRecentDocuments);

    ipcRenderer.on('saveDialog', saveDialog);

    ipcRenderer.on('saveAsDialog', saveAsDialog);

    ipcRenderer.on('exportDialog', exportDialog);

    ipcRenderer.on('autoSave', (_evt, checked) => autoSave(checked));

    ipcRenderer.on('setSavePath', setSavePath);

    ipcRenderer.on('undo', undo);

    ipcRenderer.on('redo', redo);

    ipcRenderer.on('preferencesDialog', preferencesDialog);

    ipcRenderer.on('shortcutDialog', shortcutDialog);

    ipcRenderer.on('license', license);

    ipcRenderer.on('checkVersion', checkVersion);

    ipcRenderer.on('about', about);

    /*  */

    ipcRenderer.on('openDocument', (_evt, path) => openDocument(path));
}