(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.freelogLibrary = global.freelogLibrary || {}, global.freelogLibrary.abcdddd = global.freelogLibrary.abcdddd || {}, global.freelogLibrary.abcdddd.bbb = {})));
})(this, (function (exports) { 'use strict';

    function abc() {
        console.log("abc! beta2");
    }

    function sayHello() {
        abc();
        console.log("Hello World! beta2");
    }

    exports.sayHello = sayHello;

}));
