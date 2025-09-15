declare global {
  interface Window {
    EJS?: any;
    EJS_player?: string;
    EJS_gameName?: string;
    EJS_biosUrl?: string;
    EJS_gameUrl?: string;
    EJS_core?: string;
    EJS_pathtodata?: string;
    EJS_startOnLoaded?: boolean;
    EJS_DEBUG_XX?: boolean;
    EJS_disableDatabases?: boolean;
    EJS_threads?: boolean;
    EJS_paths?: Record<string, string>;
  }
}

export {}
