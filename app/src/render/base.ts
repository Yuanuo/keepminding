import { ipcRenderer } from "electron";
import { StatusList } from "../define";

/**
 * 当做状态机类用
 */
class AppBase {
    /**
     * 当前打开文件的路径
     */
    private _documentPath: string | null;
    public getCurrentDocument(): string | null {
        return this._documentPath;
    }
    public setCurrentDocument(value: string | null) {
        this._documentPath = value;

        // // 记录到最近文档
        if (value) {
            ipcRenderer.send('addRecentDocument', value);
        }
    }

    private _state: StatusList;
    public getState() {
        return this._state;
    }
    public setState(str: StatusList) {
        this._state = str;
    }

    // 保存序号
    private _savedNum: number;
    // 修改序号
    private _changedNum: number;

    /**
     * 保存时调用
     */
    public onSaved() {
        this._savedNum = this._changedNum;
    }

    /**
     * 修改时调用
     */
    public onEdited() {
        this._changedNum++;
    }

    /**
     * 是否保存了
     */
    public hasSaved() {
        // 修改的序号 与 保存的序号一致
        return this._changedNum === this._savedNum;
    }

    //#region 单例化
    // 单例对象
    private static instance: AppBase;

    /**
     * 私有的构造方法
     */
    private constructor() {
        this._state = "none";
        this._documentPath = null;
        this._changedNum = 0;
        this._savedNum = 0;
    }
    /**
     * 获取日志对象
     */
    public static getInstance(): AppBase {
        if (!this.instance) {
            this.instance = new AppBase();
        }
        return this.instance;
    }
    //#endregion
}

export let appBase: AppBase = AppBase.getInstance();
