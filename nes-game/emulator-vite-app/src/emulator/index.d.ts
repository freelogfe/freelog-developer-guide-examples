export interface EmulatorConfig {
  container: string;
  gameName?: string;
  gameCore?: string;
  biosUrl?: string;
  gameUrl: string;
  core?: string;
  pathtodata?: string;
  debug?: boolean;
  threads?: boolean;
  disableDatabases?: boolean;
}

export interface EmulatorController {
  // 根据实际使用情况，可以进一步完善这个接口
  [key: string]: any;
}

export function runGame(config: EmulatorConfig): Promise<EmulatorController>;