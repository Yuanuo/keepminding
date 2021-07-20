import { Logger, createLogger, format, transports } from "winston";
import { getLogDirectoryPath } from "./path";
import { join } from "path";
import { naotuConf } from "./conf";

interface LeveledLogMethod {
  (message: string): void;
  (message: string, error?: Error): void;
}

/**
 * 定义日志类的接口
 */
declare interface INaotuLogger {
  error: LeveledLogMethod;
  warn: LeveledLogMethod;
  info: LeveledLogMethod;
  debug: LeveledLogMethod;
}

/**
 * 日志类
 */
class NaotuLogger implements INaotuLogger {
  //#region 日志的方法
  // 日志对象
  private logger: Logger;

  public error(message: string, error?: Error) {
    this.logger.error(message, error);
  }
  public warn(message: string, error?: Error) {
    this.logger.warn(message, error);
  }
  public info(message: string, error?: Error) {
    this.logger.info(message, error || "");
  }
  public debug(message: string, error?: Error) {
    this.logger.debug(message, error);
  }
  //#endregion

  //#region 单例化
  // 单例对象
  private static instance: NaotuLogger;

  /**
   * 私有的构造方法
   */
  private constructor() {

    console.log(">>> Logger initialize!")

    let dir = getLogDirectoryPath();

    this.logger = createLogger({
      level: "info",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(
          info =>
            `${info.timestamp} [${process.platform},${process.pid}] ${
              info.level
            }: ${info.message}`
        )
      )
    });

    // 读取配置文件，确定是否把日志保存到磁盘
    // 若确定保存，则添加transport
    let conf = naotuConf.getModel();
    if (conf.ifSaveLogToDisk) {
      this.logger.add(
        new transports.File({
          filename: join(dir, "naotu.err.log"),
          level: "error"
        })
      );
      this.logger.add(
        new transports.File({
          filename: join(dir, "naotu.log"),
          maxsize: 104857600, // 100M
          maxFiles: 50,
          tailable: true
        })
      )

      console.log(">>> Log will be saved to disk.")
    } else {
      console.log(">>> Log will NOT be saved to disk.")
    }


    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new transports.Console({
          format: format.simple()
        })
      );
    }
  }
  /**
   * 获取日志对象
   */
  public static getInstance(): NaotuLogger {
    if (!this.instance) {
      this.instance = new NaotuLogger();
    }
    return this.instance;
  }
  //#endregion
}

/**
 * 日志对象
 */
export let logger: NaotuLogger = NaotuLogger.getInstance();
