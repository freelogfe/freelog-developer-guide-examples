/**
 * EmulatorJS 配置选项
 */
export interface EmulatorConfig {
  /**
   * 游戏ROM文件的URL
   */
  gameUrl: string;
  
  /**
   * 游戏名称
   */
  gameName?: string;
  
  /**
   * BIOS文件的URL（如果需要）
   */
  biosUrl?: string;
  
  /**
   * 使用的核心（例如 'nes', 'snes', 'gba' 等）
   */
  core?: string;
  
  /**
   * EmulatorJS数据文件夹的路径
   */
  pathtodata?: string;
  
  /**
   * 容器
   */
  container: string | HTMLElement;
  
  /**
   * 是否启用线程支持
   */
  threads?: boolean;
  
  /**
   * 是否禁用数据库
   */
  disableDatabases?: boolean;
}

/**
 * 运行游戏的主要函数
 * @param config EmulatorJS配置选项
 * @returns Promise<void>
 */
export function runGame(config: EmulatorConfig): Promise<void>;



// 模块声明
declare module 'freelog-emulatorjs' {
  export = EmulatorJS;
}

declare module 'freelog-emulatorjs/dist/esm/data/emulator.css' {
  const css: string;
  export default css;
}