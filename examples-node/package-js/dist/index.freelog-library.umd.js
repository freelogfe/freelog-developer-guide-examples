(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.freelogLibrary = global.freelogLibrary || {}, global.freelogLibrary.abcdddd = global.freelogLibrary.abcdddd || {}, global.freelogLibrary.abcdddd.bbb = {})));
})(this, (function (exports) { 'use strict';

    function abc() {
        console.log("工具函数引用的函数");
    }

    function sayHello() {
        abc();
        return "Hello World! 我是工具函数返回值";
    }

    exports.sayHello = sayHello;

}));
