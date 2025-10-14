let exitFunction: any = null;
export function exit(callBack: Function) {
    exitFunction(callBack)
}

export function register(func: Function) {
  exitFunction = func;
}
