import { appConfig } from "./conf";
import { join } from "path";
import { readJson } from "./io";
import { sLocaleDir } from "../define";
import { existsSync } from "fs";

/**
 * 国际化接口
 */
export namespace I18n {
    /**
     * 应该显示什么语言
     */
    export function getLang(): string {
        let locale = appConfig.getModel().locale || "en";

        return locale.replace("-", "_");
    }

    /**
     * 已加载语言的资源
     */
    let loadedLanguage: any;

    /**
     * 对应语言的内容
     * @param key 编码
     */
    export function V(key: string): string {
        if (!loadedLanguage) {
            let path = join(__dirname, sLocaleDir, getLang() + ".json");

            if (!existsSync(path)) {
                path = join(__dirname, sLocaleDir, "en.json");
            }

            loadedLanguage = readJson(path);
        }

        let translation = loadedLanguage[key];
        if (translation === undefined) {
            translation = key;
        }
        return translation;
    }
}
