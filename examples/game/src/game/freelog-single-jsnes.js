! function (t) {
    var e = {};

    function i(s) {
        if (e[s]) return e[s].exports;
        var r = e[s] = {
            i: s,
            l: !1,
            exports: {}
        };
        return t[s].call(r.exports, r, r.exports, i), r.l = !0, r.exports
    }
    i.m = t, i.c = e, i.d = function (t, e, s) {
        i.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: s
        })
    }, i.r = function (t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, i.t = function (t, e) {
        if (1 & e && (t = i(t)), 8 & e) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var s = Object.create(null);
        if (i.r(s), Object.defineProperty(s, "default", {
            enumerable: !0,
            value: t
        }), 2 & e && "string" != typeof t)
            for (var r in t) i.d(s, r, function (e) {
                return t[e]
            }.bind(null, r));
        return s
    }, i.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return i.d(e, "a", e), e
    }, i.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, i.p = "", i(i.s = 19)
}([function (t, e, i) {
    t.exports = {
        Controller: i(2),
        NES: i(13)
    }
}, function (t, e) {
    t.exports = {
        copyArrayElements: function (t, e, i, s, r) {
            for (var h = 0; h < r; ++h) i[s + h] = t[e + h]
        },
        copyArray: function (t) {
            return t.slice(0)
        },
        fromJSON: function (t, e) {
            for (var i = 0; i < t.JSON_PROPERTIES.length; i++) t[t.JSON_PROPERTIES[i]] = e[t.JSON_PROPERTIES[i]]
        },
        toJSON: function (t) {
            for (var e = {}, i = 0; i < t.JSON_PROPERTIES.length; i++) e[t.JSON_PROPERTIES[i]] = t[t.JSON_PROPERTIES[i]];
            return e
        }
    }
}, function (t, e) {
    var i = function () {
        this.state = new Array(8);
        for (var t = 0; t < this.state.length; t++) this.state[t] = 64
    };
    i.BUTTON_A = 0, i.BUTTON_B = 1, i.BUTTON_SELECT = 2, i.BUTTON_START = 3, i.BUTTON_UP = 4, i.BUTTON_DOWN = 5, i.BUTTON_LEFT = 6, i.BUTTON_RIGHT = 7, i.prototype = {
        buttonDown: function (t) {
            this.state[t] = 65
        },
        buttonUp: function (t) {
            this.state[t] = 64
        }
    }, t.exports = i
}, function (t, e) {
    var i = function () {
        this.pix = new Array(64), this.fbIndex = null, this.tIndex = null, this.x = null, this.y = null, this.w = null, this.h = null, this.incX = null, this.incY = null, this.palIndex = null, this.tpri = null, this.c = null, this.initialized = !1, this.opaque = new Array(8)
    };
    i.prototype = {
        setBuffer: function (t) {
            for (this.y = 0; this.y < 8; this.y++) this.setScanline(this.y, t[this.y], t[this.y + 8])
        },
        setScanline: function (t, e, i) {
            for (this.initialized = !0, this.tIndex = t << 3, this.x = 0; this.x < 8; this.x++) this.pix[this.tIndex + this.x] = (e >> 7 - this.x & 1) + ((i >> 7 - this.x & 1) << 1), 0 === this.pix[this.tIndex + this.x] && (this.opaque[t] = !1)
        },
        render: function (t, e, i, s, r, h, n, a, o, l, p, u, c) {
            if (!(h < -7 || h >= 256 || n < -7 || n >= 240))
                if (this.w = s - e, this.h = r - i, h < 0 && (e -= h), h + s >= 256 && (s = 256 - h), n < 0 && (i -= n), n + r >= 240 && (r = 240 - n), l || p)
                    if (l && !p)
                        for (this.fbIndex = (n << 8) + h, this.tIndex = 7, this.y = 0; this.y < 8; this.y++) {
                            for (this.x = 0; this.x < 8; this.x++) this.x >= e && this.x < s && this.y >= i && this.y < r && (this.palIndex = this.pix[this.tIndex], this.tpri = c[this.fbIndex], 0 !== this.palIndex && u <= (255 & this.tpri) && (t[this.fbIndex] = o[this.palIndex + a], this.tpri = 3840 & this.tpri | u, c[this.fbIndex] = this.tpri)), this.fbIndex++, this.tIndex--;
                            this.fbIndex -= 8, this.fbIndex += 256, this.tIndex += 16
                        } else if (p && !l)
                        for (this.fbIndex = (n << 8) + h, this.tIndex = 56, this.y = 0; this.y < 8; this.y++) {
                            for (this.x = 0; this.x < 8; this.x++) this.x >= e && this.x < s && this.y >= i && this.y < r && (this.palIndex = this.pix[this.tIndex], this.tpri = c[this.fbIndex], 0 !== this.palIndex && u <= (255 & this.tpri) && (t[this.fbIndex] = o[this.palIndex + a], this.tpri = 3840 & this.tpri | u, c[this.fbIndex] = this.tpri)), this.fbIndex++, this.tIndex++;
                            this.fbIndex -= 8, this.fbIndex += 256, this.tIndex -= 16
                        } else
                        for (this.fbIndex = (n << 8) + h, this.tIndex = 63, this.y = 0; this.y < 8; this.y++) {
                            for (this.x = 0; this.x < 8; this.x++) this.x >= e && this.x < s && this.y >= i && this.y < r && (this.palIndex = this.pix[this.tIndex], this.tpri = c[this.fbIndex], 0 !== this.palIndex && u <= (255 & this.tpri) && (t[this.fbIndex] = o[this.palIndex + a], this.tpri = 3840 & this.tpri | u, c[this.fbIndex] = this.tpri)), this.fbIndex++, this.tIndex--;
                            this.fbIndex -= 8, this.fbIndex += 256
                        } else
                    for (this.fbIndex = (n << 8) + h, this.tIndex = 0, this.y = 0; this.y < 8; this.y++) {
                        for (this.x = 0; this.x < 8; this.x++) this.x >= e && this.x < s && this.y >= i && this.y < r && (this.palIndex = this.pix[this.tIndex], this.tpri = c[this.fbIndex], 0 !== this.palIndex && u <= (255 & this.tpri) && (t[this.fbIndex] = o[this.palIndex + a], this.tpri = 3840 & this.tpri | u, c[this.fbIndex] = this.tpri)), this.fbIndex++, this.tIndex++;
                        this.fbIndex -= 8, this.fbIndex += 256
                    }
        },
        isTransparent: function (t, e) {
            return 0 === this.pix[(e << 3) + t]
        },
        toJSON: function () {
            return {
                opaque: this.opaque,
                pix: this.pix
            }
        },
        fromJSON: function (t) {
            this.opaque = t.opaque, this.pix = t.pix
        }
    }, t.exports = i
}, function (t, e, i) {
    var s = i(5);
    "string" == typeof s && (s = [
        [t.i, s, ""]
    ]);
    var r = {
        hmr: !0,
        transform: void 0,
        insertInto: void 0
    };
    i(10)(s, r);
    s.locals && (t.exports = s.locals)
}, function (t, e, i) {
    var s = i(6);
    (t.exports = i(7)(!1)).push([t.i, ".freelog-single-jsnes-app{overflow:hidden}.freelog-single-jsnes-app #nes-wrapper{position:relative;margin:1vh auto;color:#000}.freelog-single-jsnes-app #nes-wrapper .nes-title{box-sizing:border-box;height:52px;padding:12px 0;background-color:#f6f6f6;font-size:20px;font-weight:500;text-align:center}.freelog-single-jsnes-app #nes-wrapper .nes-loud-speaker{display:none;position:absolute;top:12px;left:10px;z-index:10;width:30px;height:30px;line-height:30px;text-align:right;cursor:pointer;background-image:url(" + s(i(8)) + ");background-size:100% 100%}.freelog-single-jsnes-app #nes-wrapper .nes-loud-speaker.visible{display:block}.freelog-single-jsnes-app #nes-wrapper .nes-loud-speaker.active{background-image:url(" + s(i(9)) + ')}.freelog-single-jsnes-app #nes-wrapper .nes-loud-speaker.active i{visibility:hidden}.freelog-single-jsnes-app #nes-wrapper .full-screen-btn{position:absolute;top:18px;right:10px;z-index:10;cursor:pointer}.freelog-single-jsnes-app #nes-wrapper .full-screen-btn i{font-size:22px;transition:transform .3s ease-out}.freelog-single-jsnes-app #nes-wrapper .full-screen-btn i:hover{color:#409eff;transform:scale(1.3)}.freelog-single-jsnes-app #nes-wrapper .controls-btn{position:absolute;top:12px;right:65px;z-index:10;padding:6px 12px;border:1px solid #333;transform:scale(.75);font-size:14px;cursor:pointer}.freelog-single-jsnes-app #nes-wrapper .controls-btn:hover{background-color:#333;color:#fff}.freelog-single-jsnes-app #nes-wrapper .refresh-btn{position:absolute;top:18px;right:42px;z-index:10;cursor:pointer}.freelog-single-jsnes-app #nes-wrapper .refresh-btn i{font-size:22px;transition:transform .3s ease-out}.freelog-single-jsnes-app #nes-wrapper .refresh-btn i:hover{color:#409eff;transform:scale(1.3)}.freelog-single-jsnes-app #nes-wrapper .nes-box{position:relative;background-color:rgba(0,0,0,.6)}.freelog-single-jsnes-app #nes-wrapper .nes-box .nes-btn-group{display:none;justify-content:center;align-items:center;position:absolute;top:50%;left:50%;z-index:1;width:100%;height:100%;transform:translateY(-50%) translateX(-50%)}.freelog-single-jsnes-app #nes-wrapper .nes-box .nes-btn-group img{display:none;position:absolute;left:0;top:0;z-index:-1;width:100%;height:100%}.freelog-single-jsnes-app #nes-wrapper .nes-box .nes-btn-group img.visible{display:block}.freelog-single-jsnes-app #nes-wrapper .nes-box .nes-btn-group.visible{display:flex}.freelog-single-jsnes-app #nes-wrapper .nes-box .start-btn{padding:3px 15px;border-radius:6px;outline:0;font-size:48px;cursor:pointer;background-color:rgba(0,0,0,.6);color:#fff}.freelog-single-jsnes-app .nes-bg{position:absolute;top:0;left:0;z-index:0;width:100%;height:100%}.freelog-single-jsnes-app .nes-bg img{display:block;width:100%;background-size:100% 400%}.freelog-single-jsnes-app p{margin-top:10px;text-align:center}.f-loading{display:none;pointer-events:none;position:absolute;top:0;left:0;z-index:1000;width:100%;height:100%}.f-loading.visible{display:block}.f-loading .f-loading-inner{position:absolute;top:40vh;z-index:10;width:100%;text-align:center}.f-loading .f-loading-inner .f-loading-spinner{display:block;position:relative;width:40px;height:40px;line-height:40px;margin:0 auto 2px;border-radius:1px;-webkit-animation:rectangle-to-circle 2s cubic-bezier(.75,0,.5,1) infinite normal;animation:rectangle-to-circle 2s cubic-bezier(.75,0,.5,1) infinite normal;background-color:#008fff;color:#fff;font-size:24px}.f-loading .f-loading-inner .f-loading-message{line-height:32px;font-size:14px;color:#f5f5f5}@-webkit-keyframes rectangle-to-circle{50%{border-radius:50%;-webkit-transform:scale(.5) rotate(1turn);transform:scale(.5) rotate(1turn)}to{-webkit-transform:scale(1) rotate(2turn);transform:scale(1) rotate(2turn)}}@keyframes rectangle-to-circle{50%{border-radius:50%;-webkit-transform:scale(.5) rotate(1turn);transform:scale(.5) rotate(1turn)}to{-webkit-transform:scale(1) rotate(2turn);transform:scale(1) rotate(2turn)}}.app-footer,.modal-box{display:none}.modal-box .modal{overflow:hidden;position:fixed;top:0;left:0;z-index:1050;width:100%;height:100%;outline:0}.modal-box .modal.show .modal-dialog{transform:none}.modal-box .modal-dialog{width:600px;margin:1.75em auto;border-radius:2px;background-color:#fff;text-align:left;pointer-events:none;-webkit-transition:-webkit-transform .5s ease-out;transition:-webkit-transform .5s ease-out;transition:transform .5s ease-out;transition:transform .5s ease-out,-webkit-transform .5s ease-out;-webkit-transform:translateY(-50px);transform:translateY(-50px)}.modal-box .modal-dialog .modal-content{position:relative;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;width:100%;border:1px solid rgba(0,0,0,.2);pointer-events:auto;outline:0}.modal-box .modal-dialog .modal-content .modal-header{padding:12px 20px}.modal-box .modal-dialog .modal-content .modal-header .modal-close-btn{float:right;padding:0 8px;cursor:pointer}.modal-box .modal-dialog .modal-content .modal-body{padding:10px 20px}.modal-box .modal-dialog .modal-content .modal-body .gamepad-list li{position:relative;margin-bottom:10px;padding:10px 80px 10px 10px;list-style-type:none}.modal-box .modal-dialog .modal-content .modal-body .gamepad-list li .gp-switch-btn{position:absolute;top:50%;right:10px;z-index:10;height:28px;border-radius:6px;border:none;font-size:12px;outline:0;transform:translateY(-50%);cursor:pointer}.modal-box .modal-dialog .modal-content .modal-body .gamepad-list li.active{background-color:#d9ecff}.modal-box .modal-dialog .modal-content .modal-body .gamepad-list li.active .gp-switch-btn{background-color:#cfcfd2;color:#000}.modal-box .modal-dialog .modal-content .modal-body .gamepad-list li.inactive{background-color:#e9e9eb}.modal-box .modal-dialog .modal-content .modal-body .gamepad-list li.inactive:before{content:"";position:absolute;top:0;left:0;z-index:5;width:100%;height:100%;background-color:hsla(0,0%,100%,.7)}.modal-box .modal-dialog .modal-content .modal-body .gamepad-list li.inactive .gp-switch-btn{background-color:#67c23a;color:#fff}.modal-box .modal-dialog .modal-content .modal-body table{width:100%}.modal-box .modal-dialog .modal-content .modal-body thead{border-bottom:1px solid #333}.modal-box .modal-dialog .modal-content .modal-body tbody tr{border-bottom:1px solid #f5f5f5}.modal-box .modal-dialog .modal-content .modal-body td,.modal-box .modal-dialog .modal-content .modal-body th{min-width:120px;padding:12px 10px}.modal-box .modal-dialog .modal-content .modal-body th{position:relative}.modal-box .modal-dialog .modal-content .modal-body th button{position:absolute;top:50%;right:10px;z-index:10;height:28px;border-radius:6px;font-size:12px;outline:0;border:none;transform:translateY(-50%);cursor:pointer}.modal-box .modal-dialog .modal-content .modal-body th.active button{background-color:#cfcfd2;color:#000}.modal-box .modal-dialog .modal-content .modal-body th.inactive{background-color:#e9e9eb}.modal-box .modal-dialog .modal-content .modal-body th.inactive:before{content:"";position:absolute;top:0;left:0;z-index:5;width:100%;height:100%;background-color:hsla(0,0%,100%,.7)}.modal-box .modal-dialog .modal-content .modal-body th.inactive button{background-color:#67c23a;color:#fff}.modal-box .modal-dialog .modal-content .modal-body td{position:relative}.modal-box .modal-dialog .modal-content .modal-body td.inactive{background-color:#e9e9eb;pointer-events:none}.modal-box .modal-dialog .modal-content .modal-body td.inactive:before{content:"";position:absolute;top:0;left:0;z-index:5;width:100%;height:100%;background-color:hsla(0,0%,100%,.7)}.modal-box .modal-dialog .modal-content .modal-footer{padding:12px 20px}.modal-box .modal-dialog .modal-content .modal-footer .modal-save-btn{float:right;cursor:pointer;margin-left:15px;padding:6px 12px;border:1px solid #333;border-radius:2px}.modal-box .modal-dialog .modal-content .modal-footer .modal-save-btn:hover{background-color:#333;color:#fff}.modal-box .modal-dialog .modal-content .modal-footer .modal-close-btn{float:right;cursor:pointer;padding:6px 12px;border:1px solid #333;border-radius:2px}.modal-box .modal-dialog .modal-content .modal-footer .modal-close-btn:hover{background-color:#333;color:#fff}.modal-mask{pointer-events:none;position:fixed;top:0;left:0;z-index:1040;width:100vw;height:100vh;background-color:#000;opacity:0;transition:opacity .15s linear}.modal-mask.show{opacity:.8}', ""])
}, function (t, e) {
    t.exports = function (t) {
        return "string" != typeof t ? t : (/^['"].*['"]$/.test(t) && (t = t.slice(1, -1)), /["'() \t\n]/.test(t) ? '"' + t.replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"' : t)
    }
}, function (t, e) {
    t.exports = function (t) {
        var e = [];
        return e.toString = function () {
            return this.map(function (e) {
                var i = function (t, e) {
                    var i = t[1] || "",
                        s = t[3];
                    if (!s) return i;
                    if (e && "function" == typeof btoa) {
                        var r = (n = s, "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(n)))) + " */"),
                            h = s.sources.map(function (t) {
                                return "/*# sourceURL=" + s.sourceRoot + t + " */"
                            });
                        return [i].concat(h).concat([r]).join("\n")
                    }
                    var n;
                    return [i].join("\n")
                }(e, t);
                return e[2] ? "@media " + e[2] + "{" + i + "}" : i
            }).join("")
        }, e.i = function (t, i) {
            "string" == typeof t && (t = [
                [null, t, ""]
            ]);
            for (var s = {}, r = 0; r < this.length; r++) {
                var h = this[r][0];
                "number" == typeof h && (s[h] = !0)
            }
            for (r = 0; r < t.length; r++) {
                var n = t[r];
                "number" == typeof n[0] && s[n[0]] || (i && !n[2] ? n[2] = i : i && (n[2] = "(" + n[2] + ") and (" + i + ")"), e.push(n))
            }
        }, e
    }
}, function (t, e) {
    t.exports = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCABBAEEDASIAAhEBAxEB/8QAHAAAAgIDAQEAAAAAAAAAAAAAAAcGCAMFCQIE/8QARhAAAQIFBAADAwQKEwAAAAAAAQIDBAUGBxEACBIhEzFBCSJRFDJCYRUjMzdxcoGRsbMWGBkkNThSU1RVVmR0dXaTlKHS/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAIDAQT/xAAeEQEBAAICAwEBAAAAAAAAAAABAAIREiEDEzFBUf/aAAwDAQACEQMRAD8A6d6XV577UxYyTwUTPVxEVMZm4qHlUmlzJejJi8MYbabHZJUpCcnrK057Pfq+t5YGyFDLnj8C9OpnEPogZVJYVeH5jFuHi2w2ME5J8ylKiBnAOO4HYKwUXATFNy7mBM5urM0+I4477zUoaOeMNDJyQgJClAqBOSpXZzqw/WUZhZduHv08iOiZvC2SpJxQWxAw0OIucuN9Y8UqwlskEgjrj17iiNbCL2CW8qKHh01dOawriLhyoNRk+nzrziArzSkJ4pAH1AfXnVldJ7cruVp/bhR6Y+PSZlP44KalMlZVh2LdxjJ9UoSVJ5KxnsYBJAPRXolCYH2fVrafLz9NPVNSk0W2ppEzk08eZiGgfMpOSPTyUCPiDr4o62m4GzLyouhq6YufIGQCJBWDfGN4JAASiJSRzUcqPJRR2BkK9dbsh3K13eGpK7pe4cGwxPJI4h9IZhgwYcKJSphSc/RKQQT32rkT1i22uqjpkpLJ7kJDeSMjpGuXzClK3lrKXplS87ZLMXDJOMKAIHNBCkEKA8loJA5abek/fvbxKruwaJzALVILgypHiSWo4M8H2HE5KELI+e2ckKSr0UrGNedt17I66UjmclqiWLp+4dLuNwM/lTpGfFKMoiG0+fhugcknGO8JUoYUYQTZJxaNGjUyq3KZeu++8qdTGYNLfpS2EO1BwDTqT4K5q7763QOwpSEgZIIKcN9d6ZO5fcPKtttv01DHwLs1i4p8QkBL2lcC++UKUApfEhKQEkkkfgBOoF7P6LaqGyMzqwwqYSPqepJlN41ttZUgPLeIwnJPQSlIx9Wl57VT71NEf6iT+od1qG8+LL0rfHeYpIG1+rknsA+FGnB+OPketnto2z1LVtaOXmvegx9YxRC5ZJYpB4SxsHKCWzngU5PFH0cknKicXG0a5y/hKjW02Nbl277cpFu8i1DxLzq+IyeIiHCcD8h067Tb3rTXhngksrny5XNlkJYhJ02IUxKicBLaieKlkkYSDyOTgEZ0m9oAB3l7iwQCPlrg7H96XqdbydqVJXBtZOahk0oYklYyGGcmEDGytlDKn/DBWplwDAUFd4OcpVxOSAoKp05aZWk1V7cdAOWdvbby8cpZWiGi4xFM1OllBKXYV/AZdcAH0FpHvKUBkNDvOplsxuxGXk270zPJpEIiZ0wlyXR7iEkcnWVFKVKz9JTfhrVjrKzgems286Twk82vXFYjGvFbaliopAyRhxpQcQr8ikpP6c6jHrLUnL8oa/nE/n0a5L/ulVwf6ikX+27/AO9GtvWyur7PiAVINvyqeiVtfZWRzyYy6PZadC/BfQ+rkkkeuCDkehB+Gl37VYFNpKMc4qKG6gSpRSM4HgO+foPh3qd2wjFWb3d17QkVxhJDXDaaokoKAlCowDjFISUg+8rjyPIj7mOve7eF17VU7eih5hSlTwhiZZFp+c2oJdYcGSlxtWOlJPYJBHoQQSDmuststsxWtPxTTbjM9lrqHAFIUiMbIUCMjBz5EEa3WqYzD2V9rXIGITAT6q4aNLagw69FsOIQ5g8VKSGRkA4JAI8ujrT2Y3L1Ptxr1qzt9HlJhm1BiTVc6FFp5onDZcX3yQcgcz8w9LxhRTziPeMsu0V5uG3jbjnnXENNNxjqlrWrilKRFOEkn4DByTrBuc3w09X9JRNuLQtu1vUdSpclbjrMM82iHQvKFcOQQXFqBPEpPEZ5EnGDl2hIZj94W4xKgh+HeinAQcKStColzP4QQf8AvVtaNtDQ9vIl2IpikZLIIhwcVuy6BaZWoD0KkpHxPr6nVZIO0lGtsNonrG2Npij4txt+ZQjK3o1xpIAL7rinVgHJ5cOfAKPmED46+DeFGsy/bFcdx99thKpQ60lTigkFa8JSnJx2okAD4kacWqx7uZgu5FW28spLVB9yopm3M56zwCwmWQx8VQXyGAlS0pIIUD9qAGQvBg7y3LnX+0hvH/Zhv/mN6NdovsHAf0Vr82jWvtZLPcdZWJvDSkudkMbDyat6ejUTWn5u+jkmHiUHISrzHhr4gKBSodD3TjWPb1fiHu3IFS+cIbktwZT+9p7T7vuPQ7yeitCCTltXmlSSR3jPR03tJ69W3CWXRm8qqmTTJ6jLgyZRcl1SS5pBcJx03EJx9uayBlCj5FYHS1ZyHrTJw6WO4Db9TG4mh3afqFktPoy5ATNkDx4J7yC0n1SfJST0R9YSQq5duJuZZ15mUXgt5MZrCNrS0Kyo9oRcK8kkJDjjAwpHQUpWO+ukHI1OJNvQsnPZe3GMXFk7DbmQERi1QzowcHKHEpUOx6gennnQE+SjG0PZ+nbKuoo6NqD9kc5m5ba+UNsllCGU9hJSVElRUSSc/DVkdJuO3iWWl0E/FOXHkbiGUKcUlh8urUAD81CQSonHQAz5dag0x3bVFcd5UustbmcVSp0IDdSzpkwEqSFJCgtJcwtYA5eYTkgY5AjJMl2ycF5rz09ZGj4idzyI5Pq+1wMtZ96Jj4g/MaaR5qUo48hgDskAHUC2z2nqCVxU5udcNbMRcWrUNqeaba4iVwfRagkY/kgI54HagORWRyJafbO7K6uNw7mzhNd3HeYQ2mJdZSmClYHkiEawAnGAPEwFH3j0Vqy+tN66kaNGjUSNGjRpLy79zX+Kf0a5P+0y++lSn+UK/Xr0aNb+L7KA7C/4ykl/wUZ+oVrsrKf4MhvxBo0arzfZfXo0aNeaRo0aNJf/2Q=="
}, function (t, e) {
    t.exports = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCABBAEEDASIAAhEBAxEB/8QAHQAAAgMAAwEBAAAAAAAAAAAAAAYFBwgCAwQBCf/EADoQAAEDAwIDBAYIBgMAAAAAAAECAwQABREGIQcSMUFRYXETFEKBkbEIFSIjMjWh8BckM1NiwXPR8f/EABwBAAICAwEBAAAAAAAAAAAAAAYHAQUCBAgAA//EADQRAAECBAIHBgQHAAAAAAAAAAECBAADBREGIRITQVFhkbEUFSIjMTIWM3GhJDRSgcHR4f/aAAwDAQACEQMRAD8A/TuoLVes7Zo6EH7g8Q4v+nHb3ccx1wPDvPhRrPVcfR1ienvjnc/AyyDguLOcDPuPuzWY75fJmork7OnvF59w9TsEjsCe4D97ml5inFKaKjUSM5x5JG8/xBDS6WXp05mSB94ctScar7eFrRCUm1RjsEs4U5jxWf8AWKR5d0mz1c0qW/JUepedK/nmvNRXPT2qvaisrczSq/HLl6QwpDWQ2AEpIEd0adJhqCo8h1hXXLayk/EU46e4v6hsSkJdk/WUcdWpf2lY7cL658yaSKKwaVF2wWFtphSRuMTObSXAKZiQY0/oviHa9aM8sdRjzUJ5nIjp+0B2lJ9of9jvpprHsGdItstqVFdWxIaVzIcQcEHv/e3Ya0rw4103razFbgS3cI+ESG09DtsoDuODt59cU/cKYtFX/CO8puzcr/YAarSeyebK9nSG2iiimfAxGeONWpFXjVaoSF5jW8eiAHQrIys/HA93jVfV6bpLNwucyUo5U+8t0nzOf917NJRm5uqrNHfQl1h2YyhaFbhSSsAgjtG5rj164mVipKmE5zFWHOw5CHBIQlm1Cbe0RGNNLecQ22grcUeVKUjJJJwAB1yTVuaC4Dybj6KbqEriRjhSYST94sf5n2R02679hq57do6x2uQiTDtMKLISNnWo6UqHfuBUzjanLRsAt2q9a+VrCPQbP33/AEgMeV+ZOToSBo8dsZ148aettgmWZq2wWYaVNLCgygJK8FOM953O9KFs0em96flSoEsu3aHzLk2xbfKsND20H2sdo93dmw/pGOrj3awutqKHEIcUlQ2KSFJIIPhUI7qIuRdPa4CQ1cY8z1G4FtIT6xhOebHTJQSDt2+AoNqzJoutOkKHhTbIZWFgLi20Xva2YvFu1nzkspRSczfPjnkeB3xWVM/DfUitM6uhSCrljvK9A+OzkVtk+RwfdXRr+yJ09rK7QWwlLSHudtCBgJQoBaQPIKApfoFlrm0l9pJPilq6GL4hDxvn6KHWNj8w76Kof+L0z+8fjRTy+OWsBHcU3dFbToyoc2RHVkKZcU2fDBwflUnotaW9Y2JSiEpTOYJJPT7wVPcX9PKsWspLqUcseb/MNnG2T+MZ8/mKSKSLmSuk1Ey1jOWrocucG0tYdtgoH3CNtpdQsAJWknwNc6xVbblKtE1qXCkORZLZylxs4I/98fgRV46C48sTfRQdRBMV/ZKZyR92s/5D2ezfp16U9aPjllUF6lynVK2XNxzytAI8oU9unTlnSH3iL+kl+Y2T/id+aaW1WV5rRentPLBRcbvc/XEtEfaab5Q2CodRnr5A9xpn4+XYxL3pydCdbW40hbra8BaeqSDjofClVrWEWzsrvf1i5etWzGikOraKW4IIwcZGFKxkDH2RuPMJq0xsmsu5kxVr2BOVtGwvbO5J9AAOMXDZM0spISL+vPO19w2xEcULm3dtfXmQ2CEB4M79pbSEE/FJpXo6nvJ76ndDafVqbVMGCEczSnPSPbZAbTurPmBgeYpdnWVR/wCAeKYrqYJUhLRuATkkdImv4bTv7SvhRWjvRp7qKcvwJJ3mA7v5cLPEPRbetbCuOkpROZPPHdV2KxuCeuFAfLbaszToMi2S3YsppbEhpXKttYwQf3+lbCpR11w4t2tmQ4s+qXBCcIlIGSe5KhtzD97Zq2xbhTvcdraZTRs/UP7jUpNV7H5U32dIzLRTPqThtftMrWZEJb8cdJMYc6MePaPfSxXPrlk4ZL1bhBSRvhgyp0uekKlquIKKKntP6Gvep3EiDAcU0rH37g5GwO/mPd4Z8qxkNnDxehJQVE7s4lc2XJGksgCIJttTriUISpa1HlCUgkqJ2AA7zWiuFGgTpG1qlTED60lAFY6lpHYjPf2nH64FGgeFELSKkTZSkzrpjZZGENHt5B+mflmn2n1hLCSqcoPnw8zYN3E8YAqvVw5Goke3ad8FFFFNiBPKCiiipiY+K/Caobi3+YPeZoopT44/KwWUP5sRHDb81a860c1/TT5UUVpYE+SfrH0rvvEc6KKKckB2yCiiivRMf//Z"
}, function (t, e, i) {
    var s, r, h = {},
        n = (s = function () {
            return window && document && document.all && !window.atob
        }, function () {
            return void 0 === r && (r = s.apply(this, arguments)), r
        }),
        a = function (t, e) {
            return e ? e.querySelector(t) : document.querySelector(t)
        },
        o = function (t) {
            var e = {};
            return function (t, i) {
                if ("function" == typeof t) return t();
                if (void 0 === e[t]) {
                    var s = a.call(this, t, i);
                    if (window.HTMLIFrameElement && s instanceof window.HTMLIFrameElement) try {
                        s = s.contentDocument.head
                    } catch (t) {
                        s = null
                    }
                    e[t] = s
                }
                return e[t]
            }
        }(),
        l = null,
        p = 0,
        u = [],
        c = i(11);

    function d(t, e) {
        for (var i = 0; i < t.length; i++) {
            var s = t[i],
                r = h[s.id];
            if (r) {
                r.refs++;
                for (var n = 0; n < r.parts.length; n++) r.parts[n](s.parts[n]);
                for (; n < s.parts.length; n++) r.parts.push(S(s.parts[n], e))
            } else {
                var a = [];
                for (n = 0; n < s.parts.length; n++) a.push(S(s.parts[n], e));
                h[s.id] = {
                    id: s.id,
                    refs: 1,
                    parts: a
                }
            }
        }
    }

    function m(t, e) {
        for (var i = [], s = {}, r = 0; r < t.length; r++) {
            var h = t[r],
                n = e.base ? h[0] + e.base : h[0],
                a = {
                    css: h[1],
                    media: h[2],
                    sourceMap: h[3]
                };
            s[n] ? s[n].parts.push(a) : i.push(s[n] = {
                id: n,
                parts: [a]
            })
        }
        return i
    }

    function R(t, e) {
        var i = o(t.insertInto);
        if (!i) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
        var s = u[u.length - 1];
        if ("top" === t.insertAt) s ? s.nextSibling ? i.insertBefore(e, s.nextSibling) : i.appendChild(e) : i.insertBefore(e, i.firstChild), u.push(e);
        else if ("bottom" === t.insertAt) i.appendChild(e);
        else {
            if ("object" != typeof t.insertAt || !t.insertAt.before) throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
            var r = o(t.insertAt.before, i);
            i.insertBefore(e, r)
        }
    }

    function f(t) {
        if (null === t.parentNode) return !1;
        t.parentNode.removeChild(t);
        var e = u.indexOf(t);
        e >= 0 && u.splice(e, 1)
    }

    function _(t) {
        var e = document.createElement("style");
        if (void 0 === t.attrs.type && (t.attrs.type = "text/css"), void 0 === t.attrs.nonce) {
            var s = function () {
                0;
                return i.nc
            }();
            s && (t.attrs.nonce = s)
        }
        return g(e, t.attrs), R(t, e), e
    }

    function g(t, e) {
        Object.keys(e).forEach(function (i) {
            t.setAttribute(i, e[i])
        })
    }

    function S(t, e) {
        var i, s, r, h;
        if (e.transform && t.css) {
            if (!(h = "function" == typeof e.transform ? e.transform(t.css) : e.transform.default(t.css))) return function () { };
            t.css = h
        }
        if (e.singleton) {
            var n = p++;
            i = l || (l = _(e)), s = C.bind(null, i, n, !1), r = C.bind(null, i, n, !0)
        } else t.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (i = function (t) {
            var e = document.createElement("link");
            return void 0 === t.attrs.type && (t.attrs.type = "text/css"), t.attrs.rel = "stylesheet", g(e, t.attrs), R(t, e), e
        }(e), s = y.bind(null, i, e), r = function () {
            f(i), i.href && URL.revokeObjectURL(i.href)
        }) : (i = _(e), s = D.bind(null, i), r = function () {
            f(i)
        });
        return s(t),
            function (e) {
                if (e) {
                    if (e.css === t.css && e.media === t.media && e.sourceMap === t.sourceMap) return;
                    s(t = e)
                } else r()
            }
    }
    t.exports = function (t, e) {
        if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
        (e = e || {}).attrs = "object" == typeof e.attrs ? e.attrs : {}, e.singleton || "boolean" == typeof e.singleton || (e.singleton = n()), e.insertInto || (e.insertInto = "head"), e.insertAt || (e.insertAt = "bottom");
        var i = m(t, e);
        return d(i, e),
            function (t) {
                for (var s = [], r = 0; r < i.length; r++) {
                    var n = i[r];
                    (a = h[n.id]).refs--, s.push(a)
                }
                t && d(m(t, e), e);
                for (r = 0; r < s.length; r++) {
                    var a;
                    if (0 === (a = s[r]).refs) {
                        for (var o = 0; o < a.parts.length; o++) a.parts[o]();
                        delete h[a.id]
                    }
                }
            }
    };
    var A, b = (A = [], function (t, e) {
        return A[t] = e, A.filter(Boolean).join("\n")
    });

    function C(t, e, i, s) {
        var r = i ? "" : s.css;
        if (t.styleSheet) t.styleSheet.cssText = b(e, r);
        else {
            var h = document.createTextNode(r),
                n = t.childNodes;
            n[e] && t.removeChild(n[e]), n.length ? t.insertBefore(h, n[e]) : t.appendChild(h)
        }
    }

    function D(t, e) {
        var i = e.css,
            s = e.media;
        if (s && t.setAttribute("media", s), t.styleSheet) t.styleSheet.cssText = i;
        else {
            for (; t.firstChild;) t.removeChild(t.firstChild);
            t.appendChild(document.createTextNode(i))
        }
    }

    function y(t, e, i) {
        var s = i.css,
            r = i.sourceMap,
            h = void 0 === e.convertToAbsoluteUrls && r;
        (e.convertToAbsoluteUrls || h) && (s = c(s)), r && (s += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(r)))) + " */");
        var n = new Blob([s], {
            type: "text/css"
        }),
            a = t.href;
        t.href = URL.createObjectURL(n), a && URL.revokeObjectURL(a)
    }
}, function (t, e) {
    t.exports = function (t) {
        var e = "undefined" != typeof window && window.location;
        if (!e) throw new Error("fixUrls requires window.location");
        if (!t || "string" != typeof t) return t;
        var i = e.protocol + "//" + e.host,
            s = i + e.pathname.replace(/\/[^\/]*$/, "/");
        return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (t, e) {
            var r, h = e.trim().replace(/^"(.*)"$/, function (t, e) {
                return e
            }).replace(/^'(.*)'$/, function (t, e) {
                return e
            });
            return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(h) ? t : (r = 0 === h.indexOf("//") ? h : 0 === h.indexOf("/") ? i + h : s + h.replace(/^\.\//, ""), "url(" + JSON.stringify(r) + ")")
        })
    }
}, function (t, e) {
    t.exports = '<div class=freelog-single-jsnes-app>\n  <div id=nes-wrapper>\n    <h2 class=nes-title></h2>\n    <div class=full-screen-btn><i class=el-icon-full-screen></i></div>\n    <div class=refresh-btn><i class=el-icon-refresh></i></div>\n    <div class=controls-btn>\n      Controls\n    </div>\n    <div class=nes-loud-speaker>\n      <i class=el-icon-close></i>\n    </div>\n    <div class=nes-box>\n      <div class=nes-btn-group>\n        <div class=start-btn><i class=el-icon-video-play></i></div>\n      </div>\n      <canvas id=nes-canvas width=256 height=240 style=width:100%;height:100% />\n    </div>\n    <div class=f-loading>\n      <div class=f-loading-inner>\n        <div class=f-loading-spinner>F</div>\n        <p class=f-loading-message>Loading...</p>\n      </div>\n    </div>\n  </div>\n  \n\n  <div class=modal-box>\n    <div class=modal role=dialog>\n      <div class=modal-dialog>\n        <div class=modal-content>\n          <div class=modal-header>\n            <h3>\n              Controls\n              <span class=modal-close-btn>×</span>\n            </h3>\n          </div>\n          <div class=modal-body>\n            <ul class=gamepad-list>\n            </ul>\n            <table class="">\n              <thead>\n                <tr>\n                  <th>Button</th>\n                  <th class=active data-index=0>\n                    Player 1 \n                    <button type=text>禁用</button>\n                  </th>\n                  <th class=active data-index=1>\n                    Player 2 \n                    <button type=text>禁用</button>\n                  </th>\n                </tr>\n              </thead>\n              <tbody></tbody>\n            </table>\n          </div>\n          <div class=modal-footer>\n            <div class=modal-save-btn>Save</div>\n            \n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=modal-mask></div>\n  </div>\n</div>\n\n\n<style lang=less type=text/less>\n  \n</style>\n'
}, function (t, e, i) {
    var s = i(14),
        r = i(2),
        h = i(15),
        n = i(16),
        a = i(17),
        o = function (t) {
            var e;
            if (this.opts = {
                onFrame: function () { },
                onAudioSample: null,
                onStatusUpdate: function () { },
                onBatteryRamWrite: function () { },
                preferredFrameRate: 60,
                emulateSound: !0,
                sampleRate: 44100
            }, void 0 !== t)
                for (e in this.opts) void 0 !== t[e] && (this.opts[e] = t[e]);
            this.frameTime = 1e3 / this.opts.preferredFrameRate, this.ui = {
                writeFrame: this.opts.onFrame,
                updateStatus: this.opts.onStatusUpdate
            }, this.cpu = new s(this), this.ppu = new h(this), this.papu = new n(this), this.mmap = null, this.controllers = {
                1: new r,
                2: new r
            }, this.ui.updateStatus("Ready to load a ROM."), this.frame = this.frame.bind(this), this.buttonDown = this.buttonDown.bind(this), this.buttonUp = this.buttonUp.bind(this), this.zapperMove = this.zapperMove.bind(this), this.zapperFireDown = this.zapperFireDown.bind(this), this.zapperFireUp = this.zapperFireUp.bind(this)
        };
    o.prototype = {
        fpsFrameCount: 0,
        romData: null,
        reset: function () {
            null !== this.mmap && this.mmap.reset(), this.cpu.reset(), this.ppu.reset(), this.papu.reset(), this.lastFpsTime = null, this.fpsFrameCount = 0
        },
        frame: function () {
            this.ppu.startFrame();
            var t = 0,
                e = this.opts.emulateSound,
                i = this.cpu,
                s = this.ppu,
                r = this.papu;
            t: for (; ;)
                for (0 === i.cyclesToHalt ? (t = i.emulate(), e && r.clockFrameCounter(t), t *= 3) : i.cyclesToHalt > 8 ? (t = 24, e && r.clockFrameCounter(8), i.cyclesToHalt -= 8) : (t = 3 * i.cyclesToHalt, e && r.clockFrameCounter(i.cyclesToHalt), i.cyclesToHalt = 0); t > 0; t--) {
                    if (s.curX === s.spr0HitX && 1 === s.f_spVisibility && s.scanline - 21 === s.spr0HitY && s.setStatusFlag(s.STATUS_SPRITE0HIT, !0), s.requestEndFrame && (s.nmiCounter--, 0 === s.nmiCounter)) {
                        s.requestEndFrame = !1, s.startVBlank();
                        break t
                    }
                    s.curX++, 341 === s.curX && (s.curX = 0, s.endScanline())
                }
            this.fpsFrameCount++
        },
        buttonDown: function (t, e) {
            this.controllers[t].buttonDown(e)
        },
        buttonUp: function (t, e) {
            this.controllers[t].buttonUp(e)
        },
        zapperMove: function (t, e) {
            this.mmap && (this.mmap.zapperX = t, this.mmap.zapperY = e)
        },
        zapperFireDown: function () {
            this.mmap && (this.mmap.zapperFired = !0)
        },
        zapperFireUp: function () {
            this.mmap && (this.mmap.zapperFired = !1)
        },
        getFPS: function () {
            var t = +new Date,
                e = null;
            return this.lastFpsTime && (e = this.fpsFrameCount / ((t - this.lastFpsTime) / 1e3)), this.fpsFrameCount = 0, this.lastFpsTime = t, e
        },
        reloadROM: function () {
            null !== this.romData && this.loadROM(this.romData)
        },
        loadROM: function (t) {
            this.rom = new a(this), this.rom.load(t), this.reset(), this.mmap = this.rom.createMapper(), this.mmap.loadROM(), this.ppu.setMirroring(this.rom.getMirroringType()), this.romData = t
        },
        setFramerate: function (t) {
            this.opts.preferredFrameRate = t, this.frameTime = 1e3 / t, this.papu.setSampleRate(this.opts.sampleRate, !1)
        },
        toJSON: function () {
            return {
                romData: this.romData,
                cpu: this.cpu.toJSON(),
                mmap: this.mmap.toJSON(),
                ppu: this.ppu.toJSON()
            }
        },
        fromJSON: function (t) {
            this.loadROM(t.romData), this.cpu.fromJSON(t.cpu), this.mmap.fromJSON(t.mmap), this.ppu.fromJSON(t.ppu)
        }
    }, t.exports = o
}, function (t, e, i) {
    var s = i(1),
        r = function (t) {
            this.nes = t, this.mem = null, this.REG_ACC = null, this.REG_X = null, this.REG_Y = null, this.REG_SP = null, this.REG_PC = null, this.REG_PC_NEW = null, this.REG_STATUS = null, this.F_CARRY = null, this.F_DECIMAL = null, this.F_INTERRUPT = null, this.F_INTERRUPT_NEW = null, this.F_OVERFLOW = null, this.F_SIGN = null, this.F_ZERO = null, this.F_NOTUSED = null, this.F_NOTUSED_NEW = null, this.F_BRK = null, this.F_BRK_NEW = null, this.opdata = null, this.cyclesToHalt = null, this.crash = null, this.irqRequested = null, this.irqType = null, this.reset()
        };
    r.prototype = {
        IRQ_NORMAL: 0,
        IRQ_NMI: 1,
        IRQ_RESET: 2,
        reset: function () {
            this.mem = new Array(65536);
            for (var t = 0; t < 8192; t++) this.mem[t] = 255;
            for (var e = 0; e < 4; e++) {
                var i = 2048 * e;
                this.mem[i + 8] = 247, this.mem[i + 9] = 239, this.mem[i + 10] = 223, this.mem[i + 15] = 191
            }
            for (var s = 8193; s < this.mem.length; s++) this.mem[s] = 0;
            this.REG_ACC = 0, this.REG_X = 0, this.REG_Y = 0, this.REG_SP = 511, this.REG_PC = 32767, this.REG_PC_NEW = 32767, this.REG_STATUS = 40, this.setStatus(40), this.F_CARRY = 0, this.F_DECIMAL = 0, this.F_INTERRUPT = 1, this.F_INTERRUPT_NEW = 1, this.F_OVERFLOW = 0, this.F_SIGN = 0, this.F_ZERO = 1, this.F_NOTUSED = 1, this.F_NOTUSED_NEW = 1, this.F_BRK = 1, this.F_BRK_NEW = 1, this.opdata = (new h).opdata, this.cyclesToHalt = 0, this.crash = !1, this.irqRequested = !1, this.irqType = null
        },
        emulate: function () {
            var t, e;
            if (this.irqRequested) {
                switch (t = this.F_CARRY | (0 === this.F_ZERO ? 1 : 0) << 1 | this.F_INTERRUPT << 2 | this.F_DECIMAL << 3 | this.F_BRK << 4 | this.F_NOTUSED << 5 | this.F_OVERFLOW << 6 | this.F_SIGN << 7, this.REG_PC_NEW = this.REG_PC, this.F_INTERRUPT_NEW = this.F_INTERRUPT, this.irqType) {
                    case 0:
                        if (0 !== this.F_INTERRUPT) break;
                        this.doIrq(t);
                        break;
                    case 1:
                        this.doNonMaskableInterrupt(t);
                        break;
                    case 2:
                        this.doResetInterrupt()
                }
                this.REG_PC = this.REG_PC_NEW, this.F_INTERRUPT = this.F_INTERRUPT_NEW, this.F_BRK = this.F_BRK_NEW, this.irqRequested = !1
            }
            var i = this.opdata[this.nes.mmap.load(this.REG_PC + 1)],
                s = i >> 24,
                r = 0,
                h = i >> 8 & 255,
                n = this.REG_PC;
            this.REG_PC += i >> 16 & 255;
            var a = 0;
            switch (h) {
                case 0:
                    a = this.load(n + 2);
                    break;
                case 1:
                    a = this.load(n + 2), a += a < 128 ? this.REG_PC : this.REG_PC - 256;
                    break;
                case 2:
                    break;
                case 3:
                    a = this.load16bit(n + 2);
                    break;
                case 4:
                    a = this.REG_ACC;
                    break;
                case 5:
                    a = this.REG_PC;
                    break;
                case 6:
                    a = this.load(n + 2) + this.REG_X & 255;
                    break;
                case 7:
                    a = this.load(n + 2) + this.REG_Y & 255;
                    break;
                case 8:
                    (65280 & (a = this.load16bit(n + 2))) != (a + this.REG_X & 65280) && (r = 1), a += this.REG_X;
                    break;
                case 9:
                    (65280 & (a = this.load16bit(n + 2))) != (a + this.REG_Y & 65280) && (r = 1), a += this.REG_Y;
                    break;
                case 10:
                    (65280 & (a = this.load(n + 2))) != (a + this.REG_X & 65280) && (r = 1), a += this.REG_X, a &= 255, a = this.load16bit(a);
                    break;
                case 11:
                    (65280 & (a = this.load16bit(this.load(n + 2)))) != (a + this.REG_Y & 65280) && (r = 1), a += this.REG_Y;
                    break;
                case 12:
                    a = (a = this.load16bit(n + 2)) < 8191 ? this.mem[a] + (this.mem[65280 & a | 1 + (255 & a) & 255] << 8) : this.nes.mmap.load(a) + (this.nes.mmap.load(65280 & a | 1 + (255 & a) & 255) << 8)
            }
            switch (a &= 65535, 255 & i) {
                case 0:
                    t = this.REG_ACC + this.load(a) + this.F_CARRY, 0 == (128 & (this.REG_ACC ^ this.load(a))) && 0 != (128 & (this.REG_ACC ^ t)) ? this.F_OVERFLOW = 1 : this.F_OVERFLOW = 0, this.F_CARRY = t > 255 ? 1 : 0, this.F_SIGN = t >> 7 & 1, this.F_ZERO = 255 & t, this.REG_ACC = 255 & t, s += r;
                    break;
                case 1:
                    this.REG_ACC = this.REG_ACC & this.load(a), this.F_SIGN = this.REG_ACC >> 7 & 1, this.F_ZERO = this.REG_ACC, 11 !== h && (s += r);
                    break;
                case 2:
                    4 === h ? (this.F_CARRY = this.REG_ACC >> 7 & 1, this.REG_ACC = this.REG_ACC << 1 & 255, this.F_SIGN = this.REG_ACC >> 7 & 1, this.F_ZERO = this.REG_ACC) : (t = this.load(a), this.F_CARRY = t >> 7 & 1, t = t << 1 & 255, this.F_SIGN = t >> 7 & 1, this.F_ZERO = t, this.write(a, t));
                    break;
                case 3:
                    0 === this.F_CARRY && (s += (65280 & n) != (65280 & a) ? 2 : 1, this.REG_PC = a);
                    break;
                case 4:
                    1 === this.F_CARRY && (s += (65280 & n) != (65280 & a) ? 2 : 1, this.REG_PC = a);
                    break;
                case 5:
                    0 === this.F_ZERO && (s += (65280 & n) != (65280 & a) ? 2 : 1, this.REG_PC = a);
                    break;
                case 6:
                    t = this.load(a), this.F_SIGN = t >> 7 & 1, this.F_OVERFLOW = t >> 6 & 1, t &= this.REG_ACC, this.F_ZERO = t;
                    break;
                case 7:
                    1 === this.F_SIGN && (s++, this.REG_PC = a);
                    break;
                case 8:
                    0 !== this.F_ZERO && (s += (65280 & n) != (65280 & a) ? 2 : 1, this.REG_PC = a);
                    break;
                case 9:
                    0 === this.F_SIGN && (s += (65280 & n) != (65280 & a) ? 2 : 1, this.REG_PC = a);
                    break;
                case 10:
                    this.REG_PC += 2, this.push(this.REG_PC >> 8 & 255), this.push(255 & this.REG_PC), this.F_BRK = 1, this.push(this.F_CARRY | (0 === this.F_ZERO ? 1 : 0) << 1 | this.F_INTERRUPT << 2 | this.F_DECIMAL << 3 | this.F_BRK << 4 | this.F_NOTUSED << 5 | this.F_OVERFLOW << 6 | this.F_SIGN << 7), this.F_INTERRUPT = 1, this.REG_PC = this.load16bit(65534), this.REG_PC--;
                    break;
                case 11:
                    0 === this.F_OVERFLOW && (s += (65280 & n) != (65280 & a) ? 2 : 1, this.REG_PC = a);
                    break;
                case 12:
                    1 === this.F_OVERFLOW && (s += (65280 & n) != (65280 & a) ? 2 : 1, this.REG_PC = a);
                    break;
                case 13:
                    this.F_CARRY = 0;
                    break;
                case 14:
                    this.F_DECIMAL = 0;
                    break;
                case 15:
                    this.F_INTERRUPT = 0;
                    break;
                case 16:
                    this.F_OVERFLOW = 0;
                    break;
                case 17:
                    t = this.REG_ACC - this.load(a), this.F_CARRY = t >= 0 ? 1 : 0, this.F_SIGN = t >> 7 & 1, this.F_ZERO = 255 & t, s += r;
                    break;
                case 18:
                    t = this.REG_X - this.load(a), this.F_CARRY = t >= 0 ? 1 : 0, this.F_SIGN = t >> 7 & 1, this.F_ZERO = 255 & t;
                    break;
                case 19:
                    t = this.REG_Y - this.load(a), this.F_CARRY = t >= 0 ? 1 : 0, this.F_SIGN = t >> 7 & 1, this.F_ZERO = 255 & t;
                    break;
                case 20:
                    t = this.load(a) - 1 & 255, this.F_SIGN = t >> 7 & 1, this.F_ZERO = t, this.write(a, t);
                    break;
                case 21:
                    this.REG_X = this.REG_X - 1 & 255, this.F_SIGN = this.REG_X >> 7 & 1, this.F_ZERO = this.REG_X;
                    break;
                case 22:
                    this.REG_Y = this.REG_Y - 1 & 255, this.F_SIGN = this.REG_Y >> 7 & 1, this.F_ZERO = this.REG_Y;
                    break;
                case 23:
                    this.REG_ACC = 255 & (this.load(a) ^ this.REG_ACC), this.F_SIGN = this.REG_ACC >> 7 & 1, this.F_ZERO = this.REG_ACC, s += r;
                    break;
                case 24:
                    t = this.load(a) + 1 & 255, this.F_SIGN = t >> 7 & 1, this.F_ZERO = t, this.write(a, 255 & t);
                    break;
                case 25:
                    this.REG_X = this.REG_X + 1 & 255, this.F_SIGN = this.REG_X >> 7 & 1, this.F_ZERO = this.REG_X;
                    break;
                case 26:
                    this.REG_Y++, this.REG_Y &= 255, this.F_SIGN = this.REG_Y >> 7 & 1, this.F_ZERO = this.REG_Y;
                    break;
                case 27:
                    this.REG_PC = a - 1;
                    break;
                case 28:
                    this.push(this.REG_PC >> 8 & 255), this.push(255 & this.REG_PC), this.REG_PC = a - 1;
                    break;
                case 29:
                    this.REG_ACC = this.load(a), this.F_SIGN = this.REG_ACC >> 7 & 1, this.F_ZERO = this.REG_ACC, s += r;
                    break;
                case 30:
                    this.REG_X = this.load(a), this.F_SIGN = this.REG_X >> 7 & 1, this.F_ZERO = this.REG_X, s += r;
                    break;
                case 31:
                    this.REG_Y = this.load(a), this.F_SIGN = this.REG_Y >> 7 & 1, this.F_ZERO = this.REG_Y, s += r;
                    break;
                case 32:
                    4 === h ? (t = 255 & this.REG_ACC, this.F_CARRY = 1 & t, t >>= 1, this.REG_ACC = t) : (t = 255 & this.load(a), this.F_CARRY = 1 & t, t >>= 1, this.write(a, t)), this.F_SIGN = 0, this.F_ZERO = t;
                    break;
                case 33:
                    break;
                case 34:
                    t = 255 & (this.load(a) | this.REG_ACC), this.F_SIGN = t >> 7 & 1, this.F_ZERO = t, this.REG_ACC = t, 11 !== h && (s += r);
                    break;
                case 35:
                    this.push(this.REG_ACC);
                    break;
                case 36:
                    this.F_BRK = 1, this.push(this.F_CARRY | (0 === this.F_ZERO ? 1 : 0) << 1 | this.F_INTERRUPT << 2 | this.F_DECIMAL << 3 | this.F_BRK << 4 | this.F_NOTUSED << 5 | this.F_OVERFLOW << 6 | this.F_SIGN << 7);
                    break;
                case 37:
                    this.REG_ACC = this.pull(), this.F_SIGN = this.REG_ACC >> 7 & 1, this.F_ZERO = this.REG_ACC;
                    break;
                case 38:
                    t = this.pull(), this.F_CARRY = 1 & t, this.F_ZERO = 1 == (t >> 1 & 1) ? 0 : 1, this.F_INTERRUPT = t >> 2 & 1, this.F_DECIMAL = t >> 3 & 1, this.F_BRK = t >> 4 & 1, this.F_NOTUSED = t >> 5 & 1, this.F_OVERFLOW = t >> 6 & 1, this.F_SIGN = t >> 7 & 1, this.F_NOTUSED = 1;
                    break;
                case 39:
                    4 === h ? (t = this.REG_ACC, e = this.F_CARRY, this.F_CARRY = t >> 7 & 1, t = (t << 1 & 255) + e, this.REG_ACC = t) : (t = this.load(a), e = this.F_CARRY, this.F_CARRY = t >> 7 & 1, t = (t << 1 & 255) + e, this.write(a, t)), this.F_SIGN = t >> 7 & 1, this.F_ZERO = t;
                    break;
                case 40:
                    4 === h ? (e = this.F_CARRY << 7, this.F_CARRY = 1 & this.REG_ACC, t = (this.REG_ACC >> 1) + e, this.REG_ACC = t) : (t = this.load(a), e = this.F_CARRY << 7, this.F_CARRY = 1 & t, t = (t >> 1) + e, this.write(a, t)), this.F_SIGN = t >> 7 & 1, this.F_ZERO = t;
                    break;
                case 41:
                    if (t = this.pull(), this.F_CARRY = 1 & t, this.F_ZERO = 0 == (t >> 1 & 1) ? 1 : 0, this.F_INTERRUPT = t >> 2 & 1, this.F_DECIMAL = t >> 3 & 1, this.F_BRK = t >> 4 & 1, this.F_NOTUSED = t >> 5 & 1, this.F_OVERFLOW = t >> 6 & 1, this.F_SIGN = t >> 7 & 1, this.REG_PC = this.pull(), this.REG_PC += this.pull() << 8, 65535 === this.REG_PC) return;
                    this.REG_PC--, this.F_NOTUSED = 1;
                    break;
                case 42:
                    if (this.REG_PC = this.pull(), this.REG_PC += this.pull() << 8, 65535 === this.REG_PC) return;
                    break;
                case 43:
                    t = this.REG_ACC - this.load(a) - (1 - this.F_CARRY), this.F_SIGN = t >> 7 & 1, this.F_ZERO = 255 & t, 0 != (128 & (this.REG_ACC ^ t)) && 0 != (128 & (this.REG_ACC ^ this.load(a))) ? this.F_OVERFLOW = 1 : this.F_OVERFLOW = 0, this.F_CARRY = t < 0 ? 0 : 1, this.REG_ACC = 255 & t, 11 !== h && (s += r);
                    break;
                case 44:
                    this.F_CARRY = 1;
                    break;
                case 45:
                    this.F_DECIMAL = 1;
                    break;
                case 46:
                    this.F_INTERRUPT = 1;
                    break;
                case 47:
                    this.write(a, this.REG_ACC);
                    break;
                case 48:
                    this.write(a, this.REG_X);
                    break;
                case 49:
                    this.write(a, this.REG_Y);
                    break;
                case 50:
                    this.REG_X = this.REG_ACC, this.F_SIGN = this.REG_ACC >> 7 & 1, this.F_ZERO = this.REG_ACC;
                    break;
                case 51:
                    this.REG_Y = this.REG_ACC, this.F_SIGN = this.REG_ACC >> 7 & 1, this.F_ZERO = this.REG_ACC;
                    break;
                case 52:
                    this.REG_X = this.REG_SP - 256, this.F_SIGN = this.REG_SP >> 7 & 1, this.F_ZERO = this.REG_X;
                    break;
                case 53:
                    this.REG_ACC = this.REG_X, this.F_SIGN = this.REG_X >> 7 & 1, this.F_ZERO = this.REG_X;
                    break;
                case 54:
                    this.REG_SP = this.REG_X + 256, this.stackWrap();
                    break;
                case 55:
                    this.REG_ACC = this.REG_Y, this.F_SIGN = this.REG_Y >> 7 & 1, this.F_ZERO = this.REG_Y;
                    break;
                case 56:
                    t = this.REG_ACC & this.load(a), this.F_CARRY = 1 & t, this.REG_ACC = this.F_ZERO = t >> 1, this.F_SIGN = 0;
                    break;
                case 57:
                    this.REG_ACC = this.F_ZERO = this.REG_ACC & this.load(a), this.F_CARRY = this.F_SIGN = this.REG_ACC >> 7 & 1;
                    break;
                case 58:
                    t = this.REG_ACC & this.load(a), this.REG_ACC = this.F_ZERO = (t >> 1) + (this.F_CARRY << 7), this.F_SIGN = this.F_CARRY, this.F_CARRY = t >> 7 & 1, this.F_OVERFLOW = 1 & (t >> 7 ^ t >> 6);
                    break;
                case 59:
                    t = (this.REG_X & this.REG_ACC) - this.load(a), this.F_SIGN = t >> 7 & 1, this.F_ZERO = 255 & t, 0 != (128 & (this.REG_X ^ t)) && 0 != (128 & (this.REG_X ^ this.load(a))) ? this.F_OVERFLOW = 1 : this.F_OVERFLOW = 0, this.F_CARRY = t < 0 ? 0 : 1, this.REG_X = 255 & t;
                    break;
                case 60:
                    this.REG_ACC = this.REG_X = this.F_ZERO = this.load(a), this.F_SIGN = this.REG_ACC >> 7 & 1, s += r;
                    break;
                case 61:
                    this.write(a, this.REG_ACC & this.REG_X);
                    break;
                case 62:
                    t = this.load(a) - 1 & 255, this.write(a, t), t = this.REG_ACC - t, this.F_CARRY = t >= 0 ? 1 : 0, this.F_SIGN = t >> 7 & 1, this.F_ZERO = 255 & t, 11 !== h && (s += r);
                    break;
                case 63:
                    t = this.load(a) + 1 & 255, this.write(a, t), t = this.REG_ACC - t - (1 - this.F_CARRY), this.F_SIGN = t >> 7 & 1, this.F_ZERO = 255 & t, 0 != (128 & (this.REG_ACC ^ t)) && 0 != (128 & (this.REG_ACC ^ this.load(a))) ? this.F_OVERFLOW = 1 : this.F_OVERFLOW = 0, this.F_CARRY = t < 0 ? 0 : 1, this.REG_ACC = 255 & t, 11 !== h && (s += r);
                    break;
                case 64:
                    t = this.load(a), e = this.F_CARRY, this.F_CARRY = t >> 7 & 1, t = (t << 1 & 255) + e, this.write(a, t), this.REG_ACC = this.REG_ACC & t, this.F_SIGN = this.REG_ACC >> 7 & 1, this.F_ZERO = this.REG_ACC, 11 !== h && (s += r);
                    break;
                case 65:
                    t = this.load(a), e = this.F_CARRY << 7, this.F_CARRY = 1 & t, t = (t >> 1) + e, this.write(a, t), t = this.REG_ACC + this.load(a) + this.F_CARRY, 0 == (128 & (this.REG_ACC ^ this.load(a))) && 0 != (128 & (this.REG_ACC ^ t)) ? this.F_OVERFLOW = 1 : this.F_OVERFLOW = 0, this.F_CARRY = t > 255 ? 1 : 0, this.F_SIGN = t >> 7 & 1, this.F_ZERO = 255 & t, this.REG_ACC = 255 & t, 11 !== h && (s += r);
                    break;
                case 66:
                    t = this.load(a), this.F_CARRY = t >> 7 & 1, t = t << 1 & 255, this.write(a, t), this.REG_ACC = this.REG_ACC | t, this.F_SIGN = this.REG_ACC >> 7 & 1, this.F_ZERO = this.REG_ACC, 11 !== h && (s += r);
                    break;
                case 67:
                    t = 255 & this.load(a), this.F_CARRY = 1 & t, t >>= 1, this.write(a, t), this.REG_ACC = this.REG_ACC ^ t, this.F_SIGN = this.REG_ACC >> 7 & 1, this.F_ZERO = this.REG_ACC, 11 !== h && (s += r);
                    break;
                case 68:
                    break;
                case 69:
                    this.load(a), 11 !== h && (s += r);
                    break;
                default:
                    this.nes.stop(), this.nes.crashMessage = "Game crashed, invalid opcode at address $" + n.toString(16)
            }
            return s
        },
        load: function (t) {
            return t < 8192 ? this.mem[2047 & t] : this.nes.mmap.load(t)
        },
        load16bit: function (t) {
            return t < 8191 ? this.mem[2047 & t] | this.mem[t + 1 & 2047] << 8 : this.nes.mmap.load(t) | this.nes.mmap.load(t + 1) << 8
        },
        write: function (t, e) {
            t < 8192 ? this.mem[2047 & t] = e : this.nes.mmap.write(t, e)
        },
        requestIrq: function (t) {
            this.irqRequested && t === this.IRQ_NORMAL || (this.irqRequested = !0, this.irqType = t)
        },
        push: function (t) {
            this.nes.mmap.write(this.REG_SP, t), this.REG_SP--, this.REG_SP = 256 | 255 & this.REG_SP
        },
        stackWrap: function () {
            this.REG_SP = 256 | 255 & this.REG_SP
        },
        pull: function () {
            return this.REG_SP++, this.REG_SP = 256 | 255 & this.REG_SP, this.nes.mmap.load(this.REG_SP)
        },
        pageCrossed: function (t, e) {
            return (65280 & t) != (65280 & e)
        },
        haltCycles: function (t) {
            this.cyclesToHalt += t
        },
        doNonMaskableInterrupt: function (t) {
            0 != (128 & this.nes.mmap.load(8192)) && (this.REG_PC_NEW++, this.push(this.REG_PC_NEW >> 8 & 255), this.push(255 & this.REG_PC_NEW), this.push(t), this.REG_PC_NEW = this.nes.mmap.load(65530) | this.nes.mmap.load(65531) << 8, this.REG_PC_NEW--)
        },
        doResetInterrupt: function () {
            this.REG_PC_NEW = this.nes.mmap.load(65532) | this.nes.mmap.load(65533) << 8, this.REG_PC_NEW--
        },
        doIrq: function (t) {
            this.REG_PC_NEW++, this.push(this.REG_PC_NEW >> 8 & 255), this.push(255 & this.REG_PC_NEW), this.push(t), this.F_INTERRUPT_NEW = 1, this.F_BRK_NEW = 0, this.REG_PC_NEW = this.nes.mmap.load(65534) | this.nes.mmap.load(65535) << 8, this.REG_PC_NEW--
        },
        getStatus: function () {
            return this.F_CARRY | this.F_ZERO << 1 | this.F_INTERRUPT << 2 | this.F_DECIMAL << 3 | this.F_BRK << 4 | this.F_NOTUSED << 5 | this.F_OVERFLOW << 6 | this.F_SIGN << 7
        },
        setStatus: function (t) {
            this.F_CARRY = 1 & t, this.F_ZERO = t >> 1 & 1, this.F_INTERRUPT = t >> 2 & 1, this.F_DECIMAL = t >> 3 & 1, this.F_BRK = t >> 4 & 1, this.F_NOTUSED = t >> 5 & 1, this.F_OVERFLOW = t >> 6 & 1, this.F_SIGN = t >> 7 & 1
        },
        JSON_PROPERTIES: ["mem", "cyclesToHalt", "irqRequested", "irqType", "REG_ACC", "REG_X", "REG_Y", "REG_SP", "REG_PC", "REG_PC_NEW", "REG_STATUS", "F_CARRY", "F_DECIMAL", "F_INTERRUPT", "F_INTERRUPT_NEW", "F_OVERFLOW", "F_SIGN", "F_ZERO", "F_NOTUSED", "F_NOTUSED_NEW", "F_BRK", "F_BRK_NEW"],
        toJSON: function () {
            return s.toJSON(this)
        },
        fromJSON: function (t) {
            s.fromJSON(this, t)
        }
    };
    var h = function () {
        this.opdata = new Array(256);
        for (var t = 0; t < 256; t++) this.opdata[t] = 255;
        this.setOp(this.INS_ADC, 105, this.ADDR_IMM, 2, 2), this.setOp(this.INS_ADC, 101, this.ADDR_ZP, 2, 3), this.setOp(this.INS_ADC, 117, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_ADC, 109, this.ADDR_ABS, 3, 4), this.setOp(this.INS_ADC, 125, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_ADC, 121, this.ADDR_ABSY, 3, 4), this.setOp(this.INS_ADC, 97, this.ADDR_PREIDXIND, 2, 6), this.setOp(this.INS_ADC, 113, this.ADDR_POSTIDXIND, 2, 5), this.setOp(this.INS_AND, 41, this.ADDR_IMM, 2, 2), this.setOp(this.INS_AND, 37, this.ADDR_ZP, 2, 3), this.setOp(this.INS_AND, 53, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_AND, 45, this.ADDR_ABS, 3, 4), this.setOp(this.INS_AND, 61, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_AND, 57, this.ADDR_ABSY, 3, 4), this.setOp(this.INS_AND, 33, this.ADDR_PREIDXIND, 2, 6), this.setOp(this.INS_AND, 49, this.ADDR_POSTIDXIND, 2, 5), this.setOp(this.INS_ASL, 10, this.ADDR_ACC, 1, 2), this.setOp(this.INS_ASL, 6, this.ADDR_ZP, 2, 5), this.setOp(this.INS_ASL, 22, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_ASL, 14, this.ADDR_ABS, 3, 6), this.setOp(this.INS_ASL, 30, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_BCC, 144, this.ADDR_REL, 2, 2), this.setOp(this.INS_BCS, 176, this.ADDR_REL, 2, 2), this.setOp(this.INS_BEQ, 240, this.ADDR_REL, 2, 2), this.setOp(this.INS_BIT, 36, this.ADDR_ZP, 2, 3), this.setOp(this.INS_BIT, 44, this.ADDR_ABS, 3, 4), this.setOp(this.INS_BMI, 48, this.ADDR_REL, 2, 2), this.setOp(this.INS_BNE, 208, this.ADDR_REL, 2, 2), this.setOp(this.INS_BPL, 16, this.ADDR_REL, 2, 2), this.setOp(this.INS_BRK, 0, this.ADDR_IMP, 1, 7), this.setOp(this.INS_BVC, 80, this.ADDR_REL, 2, 2), this.setOp(this.INS_BVS, 112, this.ADDR_REL, 2, 2), this.setOp(this.INS_CLC, 24, this.ADDR_IMP, 1, 2), this.setOp(this.INS_CLD, 216, this.ADDR_IMP, 1, 2), this.setOp(this.INS_CLI, 88, this.ADDR_IMP, 1, 2), this.setOp(this.INS_CLV, 184, this.ADDR_IMP, 1, 2), this.setOp(this.INS_CMP, 201, this.ADDR_IMM, 2, 2), this.setOp(this.INS_CMP, 197, this.ADDR_ZP, 2, 3), this.setOp(this.INS_CMP, 213, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_CMP, 205, this.ADDR_ABS, 3, 4), this.setOp(this.INS_CMP, 221, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_CMP, 217, this.ADDR_ABSY, 3, 4), this.setOp(this.INS_CMP, 193, this.ADDR_PREIDXIND, 2, 6), this.setOp(this.INS_CMP, 209, this.ADDR_POSTIDXIND, 2, 5), this.setOp(this.INS_CPX, 224, this.ADDR_IMM, 2, 2), this.setOp(this.INS_CPX, 228, this.ADDR_ZP, 2, 3), this.setOp(this.INS_CPX, 236, this.ADDR_ABS, 3, 4), this.setOp(this.INS_CPY, 192, this.ADDR_IMM, 2, 2), this.setOp(this.INS_CPY, 196, this.ADDR_ZP, 2, 3), this.setOp(this.INS_CPY, 204, this.ADDR_ABS, 3, 4), this.setOp(this.INS_DEC, 198, this.ADDR_ZP, 2, 5), this.setOp(this.INS_DEC, 214, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_DEC, 206, this.ADDR_ABS, 3, 6), this.setOp(this.INS_DEC, 222, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_DEX, 202, this.ADDR_IMP, 1, 2), this.setOp(this.INS_DEY, 136, this.ADDR_IMP, 1, 2), this.setOp(this.INS_EOR, 73, this.ADDR_IMM, 2, 2), this.setOp(this.INS_EOR, 69, this.ADDR_ZP, 2, 3), this.setOp(this.INS_EOR, 85, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_EOR, 77, this.ADDR_ABS, 3, 4), this.setOp(this.INS_EOR, 93, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_EOR, 89, this.ADDR_ABSY, 3, 4), this.setOp(this.INS_EOR, 65, this.ADDR_PREIDXIND, 2, 6), this.setOp(this.INS_EOR, 81, this.ADDR_POSTIDXIND, 2, 5), this.setOp(this.INS_INC, 230, this.ADDR_ZP, 2, 5), this.setOp(this.INS_INC, 246, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_INC, 238, this.ADDR_ABS, 3, 6), this.setOp(this.INS_INC, 254, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_INX, 232, this.ADDR_IMP, 1, 2), this.setOp(this.INS_INY, 200, this.ADDR_IMP, 1, 2), this.setOp(this.INS_JMP, 76, this.ADDR_ABS, 3, 3), this.setOp(this.INS_JMP, 108, this.ADDR_INDABS, 3, 5), this.setOp(this.INS_JSR, 32, this.ADDR_ABS, 3, 6), this.setOp(this.INS_LDA, 169, this.ADDR_IMM, 2, 2), this.setOp(this.INS_LDA, 165, this.ADDR_ZP, 2, 3), this.setOp(this.INS_LDA, 181, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_LDA, 173, this.ADDR_ABS, 3, 4), this.setOp(this.INS_LDA, 189, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_LDA, 185, this.ADDR_ABSY, 3, 4), this.setOp(this.INS_LDA, 161, this.ADDR_PREIDXIND, 2, 6), this.setOp(this.INS_LDA, 177, this.ADDR_POSTIDXIND, 2, 5), this.setOp(this.INS_LDX, 162, this.ADDR_IMM, 2, 2), this.setOp(this.INS_LDX, 166, this.ADDR_ZP, 2, 3), this.setOp(this.INS_LDX, 182, this.ADDR_ZPY, 2, 4), this.setOp(this.INS_LDX, 174, this.ADDR_ABS, 3, 4), this.setOp(this.INS_LDX, 190, this.ADDR_ABSY, 3, 4), this.setOp(this.INS_LDY, 160, this.ADDR_IMM, 2, 2), this.setOp(this.INS_LDY, 164, this.ADDR_ZP, 2, 3), this.setOp(this.INS_LDY, 180, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_LDY, 172, this.ADDR_ABS, 3, 4), this.setOp(this.INS_LDY, 188, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_LSR, 74, this.ADDR_ACC, 1, 2), this.setOp(this.INS_LSR, 70, this.ADDR_ZP, 2, 5), this.setOp(this.INS_LSR, 86, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_LSR, 78, this.ADDR_ABS, 3, 6), this.setOp(this.INS_LSR, 94, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_NOP, 26, this.ADDR_IMP, 1, 2), this.setOp(this.INS_NOP, 58, this.ADDR_IMP, 1, 2), this.setOp(this.INS_NOP, 90, this.ADDR_IMP, 1, 2), this.setOp(this.INS_NOP, 122, this.ADDR_IMP, 1, 2), this.setOp(this.INS_NOP, 218, this.ADDR_IMP, 1, 2), this.setOp(this.INS_NOP, 234, this.ADDR_IMP, 1, 2), this.setOp(this.INS_NOP, 250, this.ADDR_IMP, 1, 2), this.setOp(this.INS_ORA, 9, this.ADDR_IMM, 2, 2), this.setOp(this.INS_ORA, 5, this.ADDR_ZP, 2, 3), this.setOp(this.INS_ORA, 21, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_ORA, 13, this.ADDR_ABS, 3, 4), this.setOp(this.INS_ORA, 29, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_ORA, 25, this.ADDR_ABSY, 3, 4), this.setOp(this.INS_ORA, 1, this.ADDR_PREIDXIND, 2, 6), this.setOp(this.INS_ORA, 17, this.ADDR_POSTIDXIND, 2, 5), this.setOp(this.INS_PHA, 72, this.ADDR_IMP, 1, 3), this.setOp(this.INS_PHP, 8, this.ADDR_IMP, 1, 3), this.setOp(this.INS_PLA, 104, this.ADDR_IMP, 1, 4), this.setOp(this.INS_PLP, 40, this.ADDR_IMP, 1, 4), this.setOp(this.INS_ROL, 42, this.ADDR_ACC, 1, 2), this.setOp(this.INS_ROL, 38, this.ADDR_ZP, 2, 5), this.setOp(this.INS_ROL, 54, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_ROL, 46, this.ADDR_ABS, 3, 6), this.setOp(this.INS_ROL, 62, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_ROR, 106, this.ADDR_ACC, 1, 2), this.setOp(this.INS_ROR, 102, this.ADDR_ZP, 2, 5), this.setOp(this.INS_ROR, 118, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_ROR, 110, this.ADDR_ABS, 3, 6), this.setOp(this.INS_ROR, 126, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_RTI, 64, this.ADDR_IMP, 1, 6), this.setOp(this.INS_RTS, 96, this.ADDR_IMP, 1, 6), this.setOp(this.INS_SBC, 233, this.ADDR_IMM, 2, 2), this.setOp(this.INS_SBC, 229, this.ADDR_ZP, 2, 3), this.setOp(this.INS_SBC, 245, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_SBC, 237, this.ADDR_ABS, 3, 4), this.setOp(this.INS_SBC, 253, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_SBC, 249, this.ADDR_ABSY, 3, 4), this.setOp(this.INS_SBC, 225, this.ADDR_PREIDXIND, 2, 6), this.setOp(this.INS_SBC, 241, this.ADDR_POSTIDXIND, 2, 5), this.setOp(this.INS_SEC, 56, this.ADDR_IMP, 1, 2), this.setOp(this.INS_SED, 248, this.ADDR_IMP, 1, 2), this.setOp(this.INS_SEI, 120, this.ADDR_IMP, 1, 2), this.setOp(this.INS_STA, 133, this.ADDR_ZP, 2, 3), this.setOp(this.INS_STA, 149, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_STA, 141, this.ADDR_ABS, 3, 4), this.setOp(this.INS_STA, 157, this.ADDR_ABSX, 3, 5), this.setOp(this.INS_STA, 153, this.ADDR_ABSY, 3, 5), this.setOp(this.INS_STA, 129, this.ADDR_PREIDXIND, 2, 6), this.setOp(this.INS_STA, 145, this.ADDR_POSTIDXIND, 2, 6), this.setOp(this.INS_STX, 134, this.ADDR_ZP, 2, 3), this.setOp(this.INS_STX, 150, this.ADDR_ZPY, 2, 4), this.setOp(this.INS_STX, 142, this.ADDR_ABS, 3, 4), this.setOp(this.INS_STY, 132, this.ADDR_ZP, 2, 3), this.setOp(this.INS_STY, 148, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_STY, 140, this.ADDR_ABS, 3, 4), this.setOp(this.INS_TAX, 170, this.ADDR_IMP, 1, 2), this.setOp(this.INS_TAY, 168, this.ADDR_IMP, 1, 2), this.setOp(this.INS_TSX, 186, this.ADDR_IMP, 1, 2), this.setOp(this.INS_TXA, 138, this.ADDR_IMP, 1, 2), this.setOp(this.INS_TXS, 154, this.ADDR_IMP, 1, 2), this.setOp(this.INS_TYA, 152, this.ADDR_IMP, 1, 2), this.setOp(this.INS_ALR, 75, this.ADDR_IMM, 2, 2), this.setOp(this.INS_ANC, 11, this.ADDR_IMM, 2, 2), this.setOp(this.INS_ANC, 43, this.ADDR_IMM, 2, 2), this.setOp(this.INS_ARR, 107, this.ADDR_IMM, 2, 2), this.setOp(this.INS_AXS, 203, this.ADDR_IMM, 2, 2), this.setOp(this.INS_LAX, 163, this.ADDR_PREIDXIND, 2, 6), this.setOp(this.INS_LAX, 167, this.ADDR_ZP, 2, 3), this.setOp(this.INS_LAX, 175, this.ADDR_ABS, 3, 4), this.setOp(this.INS_LAX, 179, this.ADDR_POSTIDXIND, 2, 5), this.setOp(this.INS_LAX, 183, this.ADDR_ZPY, 2, 4), this.setOp(this.INS_LAX, 191, this.ADDR_ABSY, 3, 4), this.setOp(this.INS_SAX, 131, this.ADDR_PREIDXIND, 2, 6), this.setOp(this.INS_SAX, 135, this.ADDR_ZP, 2, 3), this.setOp(this.INS_SAX, 143, this.ADDR_ABS, 3, 4), this.setOp(this.INS_SAX, 151, this.ADDR_ZPY, 2, 4), this.setOp(this.INS_DCP, 195, this.ADDR_PREIDXIND, 2, 8), this.setOp(this.INS_DCP, 199, this.ADDR_ZP, 2, 5), this.setOp(this.INS_DCP, 207, this.ADDR_ABS, 3, 6), this.setOp(this.INS_DCP, 211, this.ADDR_POSTIDXIND, 2, 8), this.setOp(this.INS_DCP, 215, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_DCP, 219, this.ADDR_ABSY, 3, 7), this.setOp(this.INS_DCP, 223, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_ISC, 227, this.ADDR_PREIDXIND, 2, 8), this.setOp(this.INS_ISC, 231, this.ADDR_ZP, 2, 5), this.setOp(this.INS_ISC, 239, this.ADDR_ABS, 3, 6), this.setOp(this.INS_ISC, 243, this.ADDR_POSTIDXIND, 2, 8), this.setOp(this.INS_ISC, 247, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_ISC, 251, this.ADDR_ABSY, 3, 7), this.setOp(this.INS_ISC, 255, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_RLA, 35, this.ADDR_PREIDXIND, 2, 8), this.setOp(this.INS_RLA, 39, this.ADDR_ZP, 2, 5), this.setOp(this.INS_RLA, 47, this.ADDR_ABS, 3, 6), this.setOp(this.INS_RLA, 51, this.ADDR_POSTIDXIND, 2, 8), this.setOp(this.INS_RLA, 55, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_RLA, 59, this.ADDR_ABSY, 3, 7), this.setOp(this.INS_RLA, 63, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_RRA, 99, this.ADDR_PREIDXIND, 2, 8), this.setOp(this.INS_RRA, 103, this.ADDR_ZP, 2, 5), this.setOp(this.INS_RRA, 111, this.ADDR_ABS, 3, 6), this.setOp(this.INS_RRA, 115, this.ADDR_POSTIDXIND, 2, 8), this.setOp(this.INS_RRA, 119, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_RRA, 123, this.ADDR_ABSY, 3, 7), this.setOp(this.INS_RRA, 127, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_SLO, 3, this.ADDR_PREIDXIND, 2, 8), this.setOp(this.INS_SLO, 7, this.ADDR_ZP, 2, 5), this.setOp(this.INS_SLO, 15, this.ADDR_ABS, 3, 6), this.setOp(this.INS_SLO, 19, this.ADDR_POSTIDXIND, 2, 8), this.setOp(this.INS_SLO, 23, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_SLO, 27, this.ADDR_ABSY, 3, 7), this.setOp(this.INS_SLO, 31, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_SRE, 67, this.ADDR_PREIDXIND, 2, 8), this.setOp(this.INS_SRE, 71, this.ADDR_ZP, 2, 5), this.setOp(this.INS_SRE, 79, this.ADDR_ABS, 3, 6), this.setOp(this.INS_SRE, 83, this.ADDR_POSTIDXIND, 2, 8), this.setOp(this.INS_SRE, 87, this.ADDR_ZPX, 2, 6), this.setOp(this.INS_SRE, 91, this.ADDR_ABSY, 3, 7), this.setOp(this.INS_SRE, 95, this.ADDR_ABSX, 3, 7), this.setOp(this.INS_SKB, 128, this.ADDR_IMM, 2, 2), this.setOp(this.INS_SKB, 130, this.ADDR_IMM, 2, 2), this.setOp(this.INS_SKB, 137, this.ADDR_IMM, 2, 2), this.setOp(this.INS_SKB, 194, this.ADDR_IMM, 2, 2), this.setOp(this.INS_SKB, 226, this.ADDR_IMM, 2, 2), this.setOp(this.INS_IGN, 12, this.ADDR_ABS, 3, 4), this.setOp(this.INS_IGN, 28, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_IGN, 60, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_IGN, 92, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_IGN, 124, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_IGN, 220, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_IGN, 252, this.ADDR_ABSX, 3, 4), this.setOp(this.INS_IGN, 4, this.ADDR_ZP, 2, 3), this.setOp(this.INS_IGN, 68, this.ADDR_ZP, 2, 3), this.setOp(this.INS_IGN, 100, this.ADDR_ZP, 2, 3), this.setOp(this.INS_IGN, 20, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_IGN, 52, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_IGN, 84, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_IGN, 116, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_IGN, 212, this.ADDR_ZPX, 2, 4), this.setOp(this.INS_IGN, 244, this.ADDR_ZPX, 2, 4), this.cycTable = new Array(7, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 4, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, 6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 4, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, 6, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 3, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, 6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 5, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, 2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 2, 6, 2, 6, 4, 4, 4, 4, 2, 5, 2, 5, 5, 5, 5, 5, 2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 2, 5, 2, 5, 4, 4, 4, 4, 2, 4, 2, 4, 4, 4, 4, 4, 2, 6, 2, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, 2, 6, 3, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7), this.instname = new Array(70), this.instname[0] = "ADC", this.instname[1] = "AND", this.instname[2] = "ASL", this.instname[3] = "BCC", this.instname[4] = "BCS", this.instname[5] = "BEQ", this.instname[6] = "BIT", this.instname[7] = "BMI", this.instname[8] = "BNE", this.instname[9] = "BPL", this.instname[10] = "BRK", this.instname[11] = "BVC", this.instname[12] = "BVS", this.instname[13] = "CLC", this.instname[14] = "CLD", this.instname[15] = "CLI", this.instname[16] = "CLV", this.instname[17] = "CMP", this.instname[18] = "CPX", this.instname[19] = "CPY", this.instname[20] = "DEC", this.instname[21] = "DEX", this.instname[22] = "DEY", this.instname[23] = "EOR", this.instname[24] = "INC", this.instname[25] = "INX", this.instname[26] = "INY", this.instname[27] = "JMP", this.instname[28] = "JSR", this.instname[29] = "LDA", this.instname[30] = "LDX", this.instname[31] = "LDY", this.instname[32] = "LSR", this.instname[33] = "NOP", this.instname[34] = "ORA", this.instname[35] = "PHA", this.instname[36] = "PHP", this.instname[37] = "PLA", this.instname[38] = "PLP", this.instname[39] = "ROL", this.instname[40] = "ROR", this.instname[41] = "RTI", this.instname[42] = "RTS", this.instname[43] = "SBC", this.instname[44] = "SEC", this.instname[45] = "SED", this.instname[46] = "SEI", this.instname[47] = "STA", this.instname[48] = "STX", this.instname[49] = "STY", this.instname[50] = "TAX", this.instname[51] = "TAY", this.instname[52] = "TSX", this.instname[53] = "TXA", this.instname[54] = "TXS", this.instname[55] = "TYA", this.instname[56] = "ALR", this.instname[57] = "ANC", this.instname[58] = "ARR", this.instname[59] = "AXS", this.instname[60] = "LAX", this.instname[61] = "SAX", this.instname[62] = "DCP", this.instname[63] = "ISC", this.instname[64] = "RLA", this.instname[65] = "RRA", this.instname[66] = "SLO", this.instname[67] = "SRE", this.instname[68] = "SKB", this.instname[69] = "IGN", this.addrDesc = new Array("Zero Page           ", "Relative            ", "Implied             ", "Absolute            ", "Accumulator         ", "Immediate           ", "Zero Page,X         ", "Zero Page,Y         ", "Absolute,X          ", "Absolute,Y          ", "Preindexed Indirect ", "Postindexed Indirect", "Indirect Absolute   ")
    };
    h.prototype = {
        INS_ADC: 0,
        INS_AND: 1,
        INS_ASL: 2,
        INS_BCC: 3,
        INS_BCS: 4,
        INS_BEQ: 5,
        INS_BIT: 6,
        INS_BMI: 7,
        INS_BNE: 8,
        INS_BPL: 9,
        INS_BRK: 10,
        INS_BVC: 11,
        INS_BVS: 12,
        INS_CLC: 13,
        INS_CLD: 14,
        INS_CLI: 15,
        INS_CLV: 16,
        INS_CMP: 17,
        INS_CPX: 18,
        INS_CPY: 19,
        INS_DEC: 20,
        INS_DEX: 21,
        INS_DEY: 22,
        INS_EOR: 23,
        INS_INC: 24,
        INS_INX: 25,
        INS_INY: 26,
        INS_JMP: 27,
        INS_JSR: 28,
        INS_LDA: 29,
        INS_LDX: 30,
        INS_LDY: 31,
        INS_LSR: 32,
        INS_NOP: 33,
        INS_ORA: 34,
        INS_PHA: 35,
        INS_PHP: 36,
        INS_PLA: 37,
        INS_PLP: 38,
        INS_ROL: 39,
        INS_ROR: 40,
        INS_RTI: 41,
        INS_RTS: 42,
        INS_SBC: 43,
        INS_SEC: 44,
        INS_SED: 45,
        INS_SEI: 46,
        INS_STA: 47,
        INS_STX: 48,
        INS_STY: 49,
        INS_TAX: 50,
        INS_TAY: 51,
        INS_TSX: 52,
        INS_TXA: 53,
        INS_TXS: 54,
        INS_TYA: 55,
        INS_ALR: 56,
        INS_ANC: 57,
        INS_ARR: 58,
        INS_AXS: 59,
        INS_LAX: 60,
        INS_SAX: 61,
        INS_DCP: 62,
        INS_ISC: 63,
        INS_RLA: 64,
        INS_RRA: 65,
        INS_SLO: 66,
        INS_SRE: 67,
        INS_SKB: 68,
        INS_IGN: 69,
        INS_DUMMY: 70,
        ADDR_ZP: 0,
        ADDR_REL: 1,
        ADDR_IMP: 2,
        ADDR_ABS: 3,
        ADDR_ACC: 4,
        ADDR_IMM: 5,
        ADDR_ZPX: 6,
        ADDR_ZPY: 7,
        ADDR_ABSX: 8,
        ADDR_ABSY: 9,
        ADDR_PREIDXIND: 10,
        ADDR_POSTIDXIND: 11,
        ADDR_INDABS: 12,
        setOp: function (t, e, i, s, r) {
            this.opdata[e] = 255 & t | (255 & i) << 8 | (255 & s) << 16 | (255 & r) << 24
        }
    }, t.exports = r
}, function (t, e, i) {
    var s = i(3),
        r = i(1),
        h = function (t) {
            this.nes = t, this.vramMem = null, this.spriteMem = null, this.vramAddress = null, this.vramTmpAddress = null, this.vramBufferedReadValue = null, this.firstWrite = null, this.sramAddress = null, this.currentMirroring = null, this.requestEndFrame = null, this.nmiOk = null, this.dummyCycleToggle = null, this.validTileData = null, this.nmiCounter = null, this.scanlineAlreadyRendered = null, this.f_nmiOnVblank = null, this.f_spriteSize = null, this.f_bgPatternTable = null, this.f_spPatternTable = null, this.f_addrInc = null, this.f_nTblAddress = null, this.f_color = null, this.f_spVisibility = null, this.f_bgVisibility = null, this.f_spClipping = null, this.f_bgClipping = null, this.f_dispType = null, this.cntFV = null, this.cntV = null, this.cntH = null, this.cntVT = null, this.cntHT = null, this.regFV = null, this.regV = null, this.regH = null, this.regVT = null, this.regHT = null, this.regFH = null, this.regS = null, this.curNt = null, this.attrib = null, this.buffer = null, this.bgbuffer = null, this.pixrendered = null, this.validTileData = null, this.scantile = null, this.scanline = null, this.lastRenderedScanline = null, this.curX = null, this.sprX = null, this.sprY = null, this.sprTile = null, this.sprCol = null, this.vertFlip = null, this.horiFlip = null, this.bgPriority = null, this.spr0HitX = null, this.spr0HitY = null, this.hitSpr0 = null, this.sprPalette = null, this.imgPalette = null, this.ptTile = null, this.ntable1 = null, this.currentMirroring = null, this.nameTable = null, this.vramMirrorTable = null, this.palTable = null, this.showSpr0Hit = !1, this.clipToTvSize = !0, this.reset()
        };
    h.prototype = {
        STATUS_VRAMWRITE: 4,
        STATUS_SLSPRITECOUNT: 5,
        STATUS_SPRITE0HIT: 6,
        STATUS_VBLANK: 7,
        reset: function () {
            var t;
            for (this.vramMem = new Array(32768), this.spriteMem = new Array(256), t = 0; t < this.vramMem.length; t++) this.vramMem[t] = 0;
            for (t = 0; t < this.spriteMem.length; t++) this.spriteMem[t] = 0;
            for (this.vramAddress = null, this.vramTmpAddress = null, this.vramBufferedReadValue = 0, this.firstWrite = !0, this.sramAddress = 0, this.currentMirroring = -1, this.requestEndFrame = !1, this.nmiOk = !1, this.dummyCycleToggle = !1, this.validTileData = !1, this.nmiCounter = 0, this.scanlineAlreadyRendered = null, this.f_nmiOnVblank = 0, this.f_spriteSize = 0, this.f_bgPatternTable = 0, this.f_spPatternTable = 0, this.f_addrInc = 0, this.f_nTblAddress = 0, this.f_color = 0, this.f_spVisibility = 0, this.f_bgVisibility = 0, this.f_spClipping = 0, this.f_bgClipping = 0, this.f_dispType = 0, this.cntFV = 0, this.cntV = 0, this.cntH = 0, this.cntVT = 0, this.cntHT = 0, this.regFV = 0, this.regV = 0, this.regH = 0, this.regVT = 0, this.regHT = 0, this.regFH = 0, this.regS = 0, this.curNt = null, this.attrib = new Array(32), this.buffer = new Array(61440), this.bgbuffer = new Array(61440), this.pixrendered = new Array(61440), this.validTileData = null, this.scantile = new Array(32), this.scanline = 0, this.lastRenderedScanline = -1, this.curX = 0, this.sprX = new Array(64), this.sprY = new Array(64), this.sprTile = new Array(64), this.sprCol = new Array(64), this.vertFlip = new Array(64), this.horiFlip = new Array(64), this.bgPriority = new Array(64), this.spr0HitX = 0, this.spr0HitY = 0, this.hitSpr0 = !1, this.sprPalette = new Array(16), this.imgPalette = new Array(16), this.ptTile = new Array(512), t = 0; t < 512; t++) this.ptTile[t] = new s;
            for (this.ntable1 = new Array(4), this.currentMirroring = -1, this.nameTable = new Array(4), t = 0; t < 4; t++) this.nameTable[t] = new n(32, 32, "Nt" + t);
            for (this.vramMirrorTable = new Array(32768), t = 0; t < 32768; t++) this.vramMirrorTable[t] = t;
            this.palTable = new a, this.palTable.loadNTSCPalette(), this.updateControlReg1(0), this.updateControlReg2(0)
        },
        setMirroring: function (t) {
            if (t !== this.currentMirroring) {
                this.currentMirroring = t, this.triggerRendering(), null === this.vramMirrorTable && (this.vramMirrorTable = new Array(32768));
                for (var e = 0; e < 32768; e++) this.vramMirrorTable[e] = e;
                this.defineMirrorRegion(16160, 16128, 32), this.defineMirrorRegion(16192, 16128, 32), this.defineMirrorRegion(16256, 16128, 32), this.defineMirrorRegion(16320, 16128, 32), this.defineMirrorRegion(12288, 8192, 3840), this.defineMirrorRegion(16384, 0, 16384), t === this.nes.rom.HORIZONTAL_MIRRORING ? (this.ntable1[0] = 0, this.ntable1[1] = 0, this.ntable1[2] = 1, this.ntable1[3] = 1, this.defineMirrorRegion(9216, 8192, 1024), this.defineMirrorRegion(11264, 10240, 1024)) : t === this.nes.rom.VERTICAL_MIRRORING ? (this.ntable1[0] = 0, this.ntable1[1] = 1, this.ntable1[2] = 0, this.ntable1[3] = 1, this.defineMirrorRegion(10240, 8192, 1024), this.defineMirrorRegion(11264, 9216, 1024)) : t === this.nes.rom.SINGLESCREEN_MIRRORING ? (this.ntable1[0] = 0, this.ntable1[1] = 0, this.ntable1[2] = 0, this.ntable1[3] = 0, this.defineMirrorRegion(9216, 8192, 1024), this.defineMirrorRegion(10240, 8192, 1024), this.defineMirrorRegion(11264, 8192, 1024)) : t === this.nes.rom.SINGLESCREEN_MIRRORING2 ? (this.ntable1[0] = 1, this.ntable1[1] = 1, this.ntable1[2] = 1, this.ntable1[3] = 1, this.defineMirrorRegion(9216, 9216, 1024), this.defineMirrorRegion(10240, 9216, 1024), this.defineMirrorRegion(11264, 9216, 1024)) : (this.ntable1[0] = 0, this.ntable1[1] = 1, this.ntable1[2] = 2, this.ntable1[3] = 3)
            }
        },
        defineMirrorRegion: function (t, e, i) {
            for (var s = 0; s < i; s++) this.vramMirrorTable[t + s] = e + s
        },
        startVBlank: function () {
            this.nes.cpu.requestIrq(this.nes.cpu.IRQ_NMI), this.lastRenderedScanline < 239 && this.renderFramePartially(this.lastRenderedScanline + 1, 240 - this.lastRenderedScanline), this.endFrame(), this.lastRenderedScanline = -1
        },
        endScanline: function () {
            switch (this.scanline) {
                case 19:
                    this.dummyCycleToggle && (this.curX = 1, this.dummyCycleToggle = !this.dummyCycleToggle);
                    break;
                case 20:
                    this.setStatusFlag(this.STATUS_VBLANK, !1), this.setStatusFlag(this.STATUS_SPRITE0HIT, !1), this.hitSpr0 = !1, this.spr0HitX = -1, this.spr0HitY = -1, 1 !== this.f_bgVisibility && 1 !== this.f_spVisibility || (this.cntFV = this.regFV, this.cntV = this.regV, this.cntH = this.regH, this.cntVT = this.regVT, this.cntHT = this.regHT, 1 === this.f_bgVisibility && this.renderBgScanline(!1, 0)), 1 === this.f_bgVisibility && 1 === this.f_spVisibility && this.checkSprite0(0), 1 !== this.f_bgVisibility && 1 !== this.f_spVisibility || this.nes.mmap.clockIrqCounter();
                    break;
                case 261:
                    this.setStatusFlag(this.STATUS_VBLANK, !0), this.requestEndFrame = !0, this.nmiCounter = 9, this.scanline = -1;
                    break;
                default:
                    this.scanline >= 21 && this.scanline <= 260 && (1 === this.f_bgVisibility && (this.scanlineAlreadyRendered || (this.cntHT = this.regHT, this.cntH = this.regH, this.renderBgScanline(!0, this.scanline + 1 - 21)), this.scanlineAlreadyRendered = !1, this.hitSpr0 || 1 !== this.f_spVisibility || this.sprX[0] >= -7 && this.sprX[0] < 256 && this.sprY[0] + 1 <= this.scanline - 20 && this.sprY[0] + 1 + (0 === this.f_spriteSize ? 8 : 16) >= this.scanline - 20 && this.checkSprite0(this.scanline - 20) && (this.hitSpr0 = !0)), 1 !== this.f_bgVisibility && 1 !== this.f_spVisibility || this.nes.mmap.clockIrqCounter())
            }
            this.scanline++, this.regsToAddress(), this.cntsToAddress()
        },
        startFrame: function () {
            var t = 0;
            if (0 === this.f_dispType) t = this.imgPalette[0];
            else switch (this.f_color) {
                case 0:
                    t = 0;
                    break;
                case 1:
                    t = 65280;
                    break;
                case 2:
                    t = 16711680;
                    break;
                case 3:
                    t = 0;
                    break;
                case 4:
                    t = 255;
                    break;
                default:
                    t = 0
            }
            var e, i = this.buffer;
            for (e = 0; e < 61440; e++) i[e] = t;
            var s = this.pixrendered;
            for (e = 0; e < s.length; e++) s[e] = 65
        },
        endFrame: function () {
            var t, e, i, s = this.buffer;
            if (this.showSpr0Hit) {
                if (this.sprX[0] >= 0 && this.sprX[0] < 256 && this.sprY[0] >= 0 && this.sprY[0] < 240) {
                    for (t = 0; t < 256; t++) s[(this.sprY[0] << 8) + t] = 16733525;
                    for (t = 0; t < 240; t++) s[(t << 8) + this.sprX[0]] = 16733525
                }
                if (this.spr0HitX >= 0 && this.spr0HitX < 256 && this.spr0HitY >= 0 && this.spr0HitY < 240) {
                    for (t = 0; t < 256; t++) s[(this.spr0HitY << 8) + t] = 5635925;
                    for (t = 0; t < 240; t++) s[(t << 8) + this.spr0HitX] = 5635925
                }
            }
            if (this.clipToTvSize || 0 === this.f_bgClipping || 0 === this.f_spClipping)
                for (i = 0; i < 240; i++)
                    for (e = 0; e < 8; e++) s[(i << 8) + e] = 0;
            if (this.clipToTvSize)
                for (i = 0; i < 240; i++)
                    for (e = 0; e < 8; e++) s[255 + (i << 8) - e] = 0;
            if (this.clipToTvSize)
                for (i = 0; i < 8; i++)
                    for (e = 0; e < 256; e++) s[(i << 8) + e] = 0, s[(239 - i << 8) + e] = 0;
            this.nes.ui.writeFrame(s)
        },
        updateControlReg1: function (t) {
            this.triggerRendering(), this.f_nmiOnVblank = t >> 7 & 1, this.f_spriteSize = t >> 5 & 1, this.f_bgPatternTable = t >> 4 & 1, this.f_spPatternTable = t >> 3 & 1, this.f_addrInc = t >> 2 & 1, this.f_nTblAddress = 3 & t, this.regV = t >> 1 & 1, this.regH = 1 & t, this.regS = t >> 4 & 1
        },
        updateControlReg2: function (t) {
            this.triggerRendering(), this.f_color = t >> 5 & 7, this.f_spVisibility = t >> 4 & 1, this.f_bgVisibility = t >> 3 & 1, this.f_spClipping = t >> 2 & 1, this.f_bgClipping = t >> 1 & 1, this.f_dispType = 1 & t, 0 === this.f_dispType && this.palTable.setEmphasis(this.f_color), this.updatePalettes()
        },
        setStatusFlag: function (t, e) {
            var i = 1 << t;
            this.nes.cpu.mem[8194] = this.nes.cpu.mem[8194] & 255 - i | (e ? i : 0)
        },
        readStatusRegister: function () {
            var t = this.nes.cpu.mem[8194];
            return this.firstWrite = !0, this.setStatusFlag(this.STATUS_VBLANK, !1), t
        },
        writeSRAMAddress: function (t) {
            this.sramAddress = t
        },
        sramLoad: function () {
            return this.spriteMem[this.sramAddress]
        },
        sramWrite: function (t) {
            this.spriteMem[this.sramAddress] = t, this.spriteRamWriteUpdate(this.sramAddress, t), this.sramAddress++, this.sramAddress %= 256
        },
        scrollWrite: function (t) {
            this.triggerRendering(), this.firstWrite ? (this.regHT = t >> 3 & 31, this.regFH = 7 & t) : (this.regFV = 7 & t, this.regVT = t >> 3 & 31), this.firstWrite = !this.firstWrite
        },
        writeVRAMAddress: function (t) {
            this.firstWrite ? (this.regFV = t >> 4 & 3, this.regV = t >> 3 & 1, this.regH = t >> 2 & 1, this.regVT = 7 & this.regVT | (3 & t) << 3) : (this.triggerRendering(), this.regVT = 24 & this.regVT | t >> 5 & 7, this.regHT = 31 & t, this.cntFV = this.regFV, this.cntV = this.regV, this.cntH = this.regH, this.cntVT = this.regVT, this.cntHT = this.regHT, this.checkSprite0(this.scanline - 20)), this.firstWrite = !this.firstWrite, this.cntsToAddress(), this.vramAddress < 8192 && this.nes.mmap.latchAccess(this.vramAddress)
        },
        vramLoad: function () {
            var t;
            return this.cntsToAddress(), this.regsToAddress(), this.vramAddress <= 16127 ? (t = this.vramBufferedReadValue, this.vramAddress < 8192 ? this.vramBufferedReadValue = this.vramMem[this.vramAddress] : this.vramBufferedReadValue = this.mirroredLoad(this.vramAddress), this.vramAddress < 8192 && this.nes.mmap.latchAccess(this.vramAddress), this.vramAddress += 1 === this.f_addrInc ? 32 : 1, this.cntsFromAddress(), this.regsFromAddress(), t) : (t = this.mirroredLoad(this.vramAddress), this.vramAddress += 1 === this.f_addrInc ? 32 : 1, this.cntsFromAddress(), this.regsFromAddress(), t)
        },
        vramWrite: function (t) {
            this.triggerRendering(), this.cntsToAddress(), this.regsToAddress(), this.vramAddress >= 8192 ? this.mirroredWrite(this.vramAddress, t) : (this.writeMem(this.vramAddress, t), this.nes.mmap.latchAccess(this.vramAddress)), this.vramAddress += 1 === this.f_addrInc ? 32 : 1, this.regsFromAddress(), this.cntsFromAddress()
        },
        sramDMA: function (t) {
            for (var e, i = 256 * t, s = this.sramAddress; s < 256; s++) e = this.nes.cpu.mem[i + s], this.spriteMem[s] = e, this.spriteRamWriteUpdate(s, e);
            this.nes.cpu.haltCycles(513)
        },
        regsFromAddress: function () {
            var t = this.vramTmpAddress >> 8 & 255;
            this.regFV = t >> 4 & 7, this.regV = t >> 3 & 1, this.regH = t >> 2 & 1, this.regVT = 7 & this.regVT | (3 & t) << 3, t = 255 & this.vramTmpAddress, this.regVT = 24 & this.regVT | t >> 5 & 7, this.regHT = 31 & t
        },
        cntsFromAddress: function () {
            var t = this.vramAddress >> 8 & 255;
            this.cntFV = t >> 4 & 3, this.cntV = t >> 3 & 1, this.cntH = t >> 2 & 1, this.cntVT = 7 & this.cntVT | (3 & t) << 3, t = 255 & this.vramAddress, this.cntVT = 24 & this.cntVT | t >> 5 & 7, this.cntHT = 31 & t
        },
        regsToAddress: function () {
            var t = (7 & this.regFV) << 4;
            t |= (1 & this.regV) << 3, t |= (1 & this.regH) << 2, t |= this.regVT >> 3 & 3;
            var e = (7 & this.regVT) << 5;
            e |= 31 & this.regHT, this.vramTmpAddress = 32767 & (t << 8 | e)
        },
        cntsToAddress: function () {
            var t = (7 & this.cntFV) << 4;
            t |= (1 & this.cntV) << 3, t |= (1 & this.cntH) << 2, t |= this.cntVT >> 3 & 3;
            var e = (7 & this.cntVT) << 5;
            e |= 31 & this.cntHT, this.vramAddress = 32767 & (t << 8 | e)
        },
        incTileCounter: function (t) {
            for (var e = t; 0 !== e; e--) this.cntHT++, 32 === this.cntHT && (this.cntHT = 0, this.cntVT++, this.cntVT >= 30 && (this.cntH++, 2 === this.cntH && (this.cntH = 0, this.cntV++, 2 === this.cntV && (this.cntV = 0, this.cntFV++, this.cntFV &= 7))))
        },
        mirroredLoad: function (t) {
            return this.vramMem[this.vramMirrorTable[t]]
        },
        mirroredWrite: function (t, e) {
            if (t >= 16128 && t < 16160) 16128 === t || 16144 === t ? (this.writeMem(16128, e), this.writeMem(16144, e)) : 16132 === t || 16148 === t ? (this.writeMem(16132, e), this.writeMem(16148, e)) : 16136 === t || 16152 === t ? (this.writeMem(16136, e), this.writeMem(16152, e)) : 16140 === t || 16156 === t ? (this.writeMem(16140, e), this.writeMem(16156, e)) : this.writeMem(t, e);
            else {
                if (!(t < this.vramMirrorTable.length)) throw new Error("Invalid VRAM address: " + t.toString(16));
                this.writeMem(this.vramMirrorTable[t], e)
            }
        },
        triggerRendering: function () {
            this.scanline >= 21 && this.scanline <= 260 && (this.renderFramePartially(this.lastRenderedScanline + 1, this.scanline - 21 - this.lastRenderedScanline), this.lastRenderedScanline = this.scanline - 21)
        },
        renderFramePartially: function (t, e) {
            if (1 === this.f_spVisibility && this.renderSpritesPartially(t, e, !0), 1 === this.f_bgVisibility) {
                var i = t << 8,
                    s = t + e << 8;
                s > 61440 && (s = 61440);
                for (var r = this.buffer, h = this.bgbuffer, n = this.pixrendered, a = i; a < s; a++) n[a] > 255 && (r[a] = h[a])
            }
            1 === this.f_spVisibility && this.renderSpritesPartially(t, e, !1), this.validTileData = !1
        },
        renderBgScanline: function (t, e) {
            var i = 0 === this.regS ? 0 : 256,
                s = (e << 8) - this.regFH;
            if (this.curNt = this.ntable1[this.cntV + this.cntV + this.cntH], this.cntHT = this.regHT, this.cntH = this.regH, this.curNt = this.ntable1[this.cntV + this.cntV + this.cntH], e < 240 && e - this.cntFV >= 0) {
                for (var r, h, n, a, o = this.cntFV << 3, l = this.scantile, p = this.attrib, u = this.ptTile, c = this.nameTable, d = this.imgPalette, m = this.pixrendered, R = t ? this.bgbuffer : this.buffer, f = 0; f < 32; f++) {
                    if (e >= 0) {
                        if (this.validTileData) {
                            if (void 0 === (r = l[f])) continue;
                            h = r.pix, n = p[f]
                        } else {
                            if (void 0 === (r = u[i + c[this.curNt].getTileIndex(this.cntHT, this.cntVT)])) continue;
                            h = r.pix, n = c[this.curNt].getAttrib(this.cntHT, this.cntVT), l[f] = r, p[f] = n
                        }
                        var _ = 0,
                            g = (f << 3) - this.regFH;
                        if (g > -8)
                            if (g < 0 && (s -= g, _ = -g), r.opaque[this.cntFV])
                                for (; _ < 8; _++) R[s] = d[h[o + _] + n], m[s] |= 256, s++;
                            else
                                for (; _ < 8; _++) 0 !== (a = h[o + _]) && (R[s] = d[a + n], m[s] |= 256), s++
                    }
                    32 == ++this.cntHT && (this.cntHT = 0, this.cntH++, this.cntH %= 2, this.curNt = this.ntable1[(this.cntV << 1) + this.cntH])
                }
                this.validTileData = !0
            }
            this.cntFV++, 8 === this.cntFV && (this.cntFV = 0, this.cntVT++, 30 === this.cntVT ? (this.cntVT = 0, this.cntV++, this.cntV %= 2, this.curNt = this.ntable1[(this.cntV << 1) + this.cntH]) : 32 === this.cntVT && (this.cntVT = 0), this.validTileData = !1)
        },
        renderSpritesPartially: function (t, e, i) {
            if (1 === this.f_spVisibility)
                for (var s = 0; s < 64; s++)
                    if (this.bgPriority[s] === i && this.sprX[s] >= 0 && this.sprX[s] < 256 && this.sprY[s] + 8 >= t && this.sprY[s] < t + e)
                        if (0 === this.f_spriteSize) this.srcy1 = 0, this.srcy2 = 8, this.sprY[s] < t && (this.srcy1 = t - this.sprY[s] - 1), this.sprY[s] + 8 > t + e && (this.srcy2 = t + e - this.sprY[s] + 1), 0 === this.f_spPatternTable ? this.ptTile[this.sprTile[s]].render(this.buffer, 0, this.srcy1, 8, this.srcy2, this.sprX[s], this.sprY[s] + 1, this.sprCol[s], this.sprPalette, this.horiFlip[s], this.vertFlip[s], s, this.pixrendered) : this.ptTile[this.sprTile[s] + 256].render(this.buffer, 0, this.srcy1, 8, this.srcy2, this.sprX[s], this.sprY[s] + 1, this.sprCol[s], this.sprPalette, this.horiFlip[s], this.vertFlip[s], s, this.pixrendered);
                        else {
                            var r = this.sprTile[s];
                            0 != (1 & r) && (r = this.sprTile[s] - 1 + 256);
                            var h = 0,
                                n = 8;
                            this.sprY[s] < t && (h = t - this.sprY[s] - 1), this.sprY[s] + 8 > t + e && (n = t + e - this.sprY[s]), this.ptTile[r + (this.vertFlip[s] ? 1 : 0)].render(this.buffer, 0, h, 8, n, this.sprX[s], this.sprY[s] + 1, this.sprCol[s], this.sprPalette, this.horiFlip[s], this.vertFlip[s], s, this.pixrendered), h = 0, n = 8, this.sprY[s] + 8 < t && (h = t - (this.sprY[s] + 8 + 1)), this.sprY[s] + 16 > t + e && (n = t + e - (this.sprY[s] + 8)), this.ptTile[r + (this.vertFlip[s] ? 0 : 1)].render(this.buffer, 0, h, 8, n, this.sprX[s], this.sprY[s] + 1 + 8, this.sprCol[s], this.sprPalette, this.horiFlip[s], this.vertFlip[s], s, this.pixrendered)
                        }
        },
        checkSprite0: function (t) {
            var e;
            this.spr0HitX = -1, this.spr0HitY = -1;
            var i, s, r, h, n, a = 0 === this.f_spPatternTable ? 0 : 256;
            if (i = this.sprX[0], s = this.sprY[0] + 1, 0 === this.f_spriteSize) {
                if (s <= t && s + 8 > t && i >= -7 && i < 256)
                    if (r = this.ptTile[this.sprTile[0] + a], e = this.vertFlip[0] ? 7 - (t - s) : t - s, e *= 8, n = 256 * t + i, this.horiFlip[0])
                        for (h = 7; h >= 0; h--) {
                            if (i >= 0 && i < 256 && n >= 0 && n < 61440 && 0 !== this.pixrendered[n] && 0 !== r.pix[e + h]) return this.spr0HitX = n % 256, this.spr0HitY = t, !0;
                            i++, n++
                        } else
                        for (h = 0; h < 8; h++) {
                            if (i >= 0 && i < 256 && n >= 0 && n < 61440 && 0 !== this.pixrendered[n] && 0 !== r.pix[e + h]) return this.spr0HitX = n % 256, this.spr0HitY = t, !0;
                            i++, n++
                        }
            } else if (s <= t && s + 16 > t && i >= -7 && i < 256)
                if ((e = this.vertFlip[0] ? 15 - (t - s) : t - s) < 8 ? r = this.ptTile[this.sprTile[0] + (this.vertFlip[0] ? 1 : 0) + (0 != (1 & this.sprTile[0]) ? 255 : 0)] : (r = this.ptTile[this.sprTile[0] + (this.vertFlip[0] ? 0 : 1) + (0 != (1 & this.sprTile[0]) ? 255 : 0)], this.vertFlip[0] ? e = 15 - e : e -= 8), e *= 8, n = 256 * t + i, this.horiFlip[0])
                    for (h = 7; h >= 0; h--) {
                        if (i >= 0 && i < 256 && n >= 0 && n < 61440 && 0 !== this.pixrendered[n] && 0 !== r.pix[e + h]) return this.spr0HitX = n % 256, this.spr0HitY = t, !0;
                        i++, n++
                    } else
                    for (h = 0; h < 8; h++) {
                        if (i >= 0 && i < 256 && n >= 0 && n < 61440 && 0 !== this.pixrendered[n] && 0 !== r.pix[e + h]) return this.spr0HitX = n % 256, this.spr0HitY = t, !0;
                        i++, n++
                    }
            return !1
        },
        writeMem: function (t, e) {
            this.vramMem[t] = e, t < 8192 ? (this.vramMem[t] = e, this.patternWrite(t, e)) : t >= 8192 && t < 9152 ? this.nameTableWrite(this.ntable1[0], t - 8192, e) : t >= 9152 && t < 9216 ? this.attribTableWrite(this.ntable1[0], t - 9152, e) : t >= 9216 && t < 10176 ? this.nameTableWrite(this.ntable1[1], t - 9216, e) : t >= 10176 && t < 10240 ? this.attribTableWrite(this.ntable1[1], t - 10176, e) : t >= 10240 && t < 11200 ? this.nameTableWrite(this.ntable1[2], t - 10240, e) : t >= 11200 && t < 11264 ? this.attribTableWrite(this.ntable1[2], t - 11200, e) : t >= 11264 && t < 12224 ? this.nameTableWrite(this.ntable1[3], t - 11264, e) : t >= 12224 && t < 12288 ? this.attribTableWrite(this.ntable1[3], t - 12224, e) : t >= 16128 && t < 16160 && this.updatePalettes()
        },
        updatePalettes: function () {
            var t;
            for (t = 0; t < 16; t++) 0 === this.f_dispType ? this.imgPalette[t] = this.palTable.getEntry(63 & this.vramMem[16128 + t]) : this.imgPalette[t] = this.palTable.getEntry(32 & this.vramMem[16128 + t]);
            for (t = 0; t < 16; t++) 0 === this.f_dispType ? this.sprPalette[t] = this.palTable.getEntry(63 & this.vramMem[16144 + t]) : this.sprPalette[t] = this.palTable.getEntry(32 & this.vramMem[16144 + t])
        },
        patternWrite: function (t, e) {
            var i = Math.floor(t / 16),
                s = t % 16;
            s < 8 ? this.ptTile[i].setScanline(s, e, this.vramMem[t + 8]) : this.ptTile[i].setScanline(s - 8, this.vramMem[t - 8], e)
        },
        nameTableWrite: function (t, e, i) {
            this.nameTable[t].tile[e] = i, this.checkSprite0(this.scanline - 20)
        },
        attribTableWrite: function (t, e, i) {
            this.nameTable[t].writeAttrib(e, i)
        },
        spriteRamWriteUpdate: function (t, e) {
            var i = Math.floor(t / 4);
            0 === i && this.checkSprite0(this.scanline - 20), t % 4 == 0 ? this.sprY[i] = e : t % 4 == 1 ? this.sprTile[i] = e : t % 4 == 2 ? (this.vertFlip[i] = 0 != (128 & e), this.horiFlip[i] = 0 != (64 & e), this.bgPriority[i] = 0 != (32 & e), this.sprCol[i] = (3 & e) << 2) : t % 4 == 3 && (this.sprX[i] = e)
        },
        doNMI: function () {
            this.setStatusFlag(this.STATUS_VBLANK, !0), this.nes.cpu.requestIrq(this.nes.cpu.IRQ_NMI)
        },
        isPixelWhite: function (t, e) {
            return this.triggerRendering(), 16777215 === this.nes.ppu.buffer[(e << 8) + t]
        },
        JSON_PROPERTIES: ["vramMem", "spriteMem", "cntFV", "cntV", "cntH", "cntVT", "cntHT", "regFV", "regV", "regH", "regVT", "regHT", "regFH", "regS", "vramAddress", "vramTmpAddress", "f_nmiOnVblank", "f_spriteSize", "f_bgPatternTable", "f_spPatternTable", "f_addrInc", "f_nTblAddress", "f_color", "f_spVisibility", "f_bgVisibility", "f_spClipping", "f_bgClipping", "f_dispType", "vramBufferedReadValue", "firstWrite", "currentMirroring", "vramMirrorTable", "ntable1", "sramAddress", "hitSpr0", "sprPalette", "imgPalette", "curX", "scanline", "lastRenderedScanline", "curNt", "scantile", "attrib", "buffer", "bgbuffer", "pixrendered", "requestEndFrame", "nmiOk", "dummyCycleToggle", "nmiCounter", "validTileData", "scanlineAlreadyRendered"],
        toJSON: function () {
            var t, e = r.toJSON(this);
            for (e.nameTable = [], t = 0; t < this.nameTable.length; t++) e.nameTable[t] = this.nameTable[t].toJSON();
            for (e.ptTile = [], t = 0; t < this.ptTile.length; t++) e.ptTile[t] = this.ptTile[t].toJSON();
            return e
        },
        fromJSON: function (t) {
            var e;
            for (r.fromJSON(this, t), e = 0; e < this.nameTable.length; e++) this.nameTable[e].fromJSON(t.nameTable[e]);
            for (e = 0; e < this.ptTile.length; e++) this.ptTile[e].fromJSON(t.ptTile[e]);
            for (e = 0; e < this.spriteMem.length; e++) this.spriteRamWriteUpdate(e, this.spriteMem[e])
        }
    };
    var n = function (t, e, i) {
        this.width = t, this.height = e, this.name = i, this.tile = new Array(t * e), this.attrib = new Array(t * e);
        for (var s = 0; s < t * e; s++) this.tile[s] = 0, this.attrib[s] = 0
    };
    n.prototype = {
        getTileIndex: function (t, e) {
            return this.tile[e * this.width + t]
        },
        getAttrib: function (t, e) {
            return this.attrib[e * this.width + t]
        },
        writeAttrib: function (t, e) {
            for (var i, s, r, h = t % 8 * 4, n = 4 * Math.floor(t / 8), a = 0; a < 2; a++)
                for (var o = 0; o < 2; o++) {
                    i = e >> 2 * (2 * a + o) & 3;
                    for (var l = 0; l < 2; l++)
                        for (var p = 0; p < 2; p++) s = h + 2 * o + p, r = (n + 2 * a + l) * this.width + s, this.attrib[r] = i << 2 & 12
                }
        },
        toJSON: function () {
            return {
                tile: this.tile,
                attrib: this.attrib
            }
        },
        fromJSON: function (t) {
            this.tile = t.tile, this.attrib = t.attrib
        }
    };
    var a = function () {
        this.curTable = new Array(64), this.emphTable = new Array(8), this.currentEmph = -1
    };
    a.prototype = {
        reset: function () {
            this.setEmphasis(0)
        },
        loadNTSCPalette: function () {
            this.curTable = [5395026, 11796480, 10485760, 11599933, 7602281, 91, 95, 6208, 12048, 543240, 26368, 1196544, 7153664, 0, 0, 0, 12899815, 16728064, 14421538, 16729963, 14090399, 6818519, 6588, 21681, 27227, 35843, 43776, 2918400, 10777088, 0, 0, 0, 16316664, 16755516, 16742785, 16735173, 16730354, 14633471, 4681215, 46327, 57599, 58229, 259115, 7911470, 15065624, 7895160, 0, 0, 16777215, 16773822, 16300216, 16300248, 16758527, 16761855, 13095423, 10148607, 8973816, 8650717, 12122296, 16119980, 16777136, 16308472, 0, 0], this.makeTables(), this.setEmphasis(0)
        },
        loadPALPalette: function () {
            this.curTable = [5395026, 11796480, 10485760, 11599933, 7602281, 91, 95, 6208, 12048, 543240, 26368, 1196544, 7153664, 0, 0, 0, 12899815, 16728064, 14421538, 16729963, 14090399, 6818519, 6588, 21681, 27227, 35843, 43776, 2918400, 10777088, 0, 0, 0, 16316664, 16755516, 16742785, 16735173, 16730354, 14633471, 4681215, 46327, 57599, 58229, 259115, 7911470, 15065624, 7895160, 0, 0, 16777215, 16773822, 16300216, 16300248, 16758527, 16761855, 13095423, 10148607, 8973816, 8650717, 12122296, 16119980, 16777136, 16308472, 0, 0], this.makeTables(), this.setEmphasis(0)
        },
        makeTables: function () {
            for (var t, e, i, s, r, h, n, a, o = 0; o < 8; o++)
                for (h = 1, n = 1, a = 1, 0 != (1 & o) && (h = .75, a = .75), 0 != (2 & o) && (h = .75, n = .75), 0 != (4 & o) && (n = .75, a = .75), this.emphTable[o] = new Array(64), r = 0; r < 64; r++) s = this.curTable[r], t = Math.floor(this.getRed(s) * h), e = Math.floor(this.getGreen(s) * n), i = Math.floor(this.getBlue(s) * a), this.emphTable[o][r] = this.getRgb(t, e, i)
        },
        setEmphasis: function (t) {
            if (t !== this.currentEmph) {
                this.currentEmph = t;
                for (var e = 0; e < 64; e++) this.curTable[e] = this.emphTable[t][e]
            }
        },
        getEntry: function (t) {
            return this.curTable[t]
        },
        getRed: function (t) {
            return t >> 16 & 255
        },
        getGreen: function (t) {
            return t >> 8 & 255
        },
        getBlue: function (t) {
            return 255 & t
        },
        getRgb: function (t, e, i) {
            return t << 16 | e << 8 | i
        },
        loadDefaultPalette: function () {
            this.curTable[0] = this.getRgb(117, 117, 117), this.curTable[1] = this.getRgb(39, 27, 143), this.curTable[2] = this.getRgb(0, 0, 171), this.curTable[3] = this.getRgb(71, 0, 159), this.curTable[4] = this.getRgb(143, 0, 119), this.curTable[5] = this.getRgb(171, 0, 19), this.curTable[6] = this.getRgb(167, 0, 0), this.curTable[7] = this.getRgb(127, 11, 0), this.curTable[8] = this.getRgb(67, 47, 0), this.curTable[9] = this.getRgb(0, 71, 0), this.curTable[10] = this.getRgb(0, 81, 0), this.curTable[11] = this.getRgb(0, 63, 23), this.curTable[12] = this.getRgb(27, 63, 95), this.curTable[13] = this.getRgb(0, 0, 0), this.curTable[14] = this.getRgb(0, 0, 0), this.curTable[15] = this.getRgb(0, 0, 0), this.curTable[16] = this.getRgb(188, 188, 188), this.curTable[17] = this.getRgb(0, 115, 239), this.curTable[18] = this.getRgb(35, 59, 239), this.curTable[19] = this.getRgb(131, 0, 243), this.curTable[20] = this.getRgb(191, 0, 191), this.curTable[21] = this.getRgb(231, 0, 91), this.curTable[22] = this.getRgb(219, 43, 0), this.curTable[23] = this.getRgb(203, 79, 15), this.curTable[24] = this.getRgb(139, 115, 0), this.curTable[25] = this.getRgb(0, 151, 0), this.curTable[26] = this.getRgb(0, 171, 0), this.curTable[27] = this.getRgb(0, 147, 59), this.curTable[28] = this.getRgb(0, 131, 139), this.curTable[29] = this.getRgb(0, 0, 0), this.curTable[30] = this.getRgb(0, 0, 0), this.curTable[31] = this.getRgb(0, 0, 0), this.curTable[32] = this.getRgb(255, 255, 255), this.curTable[33] = this.getRgb(63, 191, 255), this.curTable[34] = this.getRgb(95, 151, 255), this.curTable[35] = this.getRgb(167, 139, 253), this.curTable[36] = this.getRgb(247, 123, 255), this.curTable[37] = this.getRgb(255, 119, 183), this.curTable[38] = this.getRgb(255, 119, 99), this.curTable[39] = this.getRgb(255, 155, 59), this.curTable[40] = this.getRgb(243, 191, 63), this.curTable[41] = this.getRgb(131, 211, 19), this.curTable[42] = this.getRgb(79, 223, 75), this.curTable[43] = this.getRgb(88, 248, 152), this.curTable[44] = this.getRgb(0, 235, 219), this.curTable[45] = this.getRgb(0, 0, 0), this.curTable[46] = this.getRgb(0, 0, 0), this.curTable[47] = this.getRgb(0, 0, 0), this.curTable[48] = this.getRgb(255, 255, 255), this.curTable[49] = this.getRgb(171, 231, 255), this.curTable[50] = this.getRgb(199, 215, 255), this.curTable[51] = this.getRgb(215, 203, 255), this.curTable[52] = this.getRgb(255, 199, 255), this.curTable[53] = this.getRgb(255, 199, 219), this.curTable[54] = this.getRgb(255, 191, 179), this.curTable[55] = this.getRgb(255, 219, 171), this.curTable[56] = this.getRgb(255, 231, 163), this.curTable[57] = this.getRgb(227, 255, 163), this.curTable[58] = this.getRgb(171, 243, 191), this.curTable[59] = this.getRgb(179, 255, 207), this.curTable[60] = this.getRgb(159, 255, 243), this.curTable[61] = this.getRgb(0, 0, 0), this.curTable[62] = this.getRgb(0, 0, 0), this.curTable[63] = this.getRgb(0, 0, 0), this.makeTables(), this.setEmphasis(0)
        }
    }, t.exports = h
}, function (t, e) {
    var i = function (t) {
        this.nes = t, this.square1 = new h(this, !0), this.square2 = new h(this, !1), this.triangle = new n(this), this.noise = new r(this), this.dmc = new s(this), this.frameIrqCounter = null, this.frameIrqCounterMax = 4, this.initCounter = 2048, this.channelEnableValue = null, this.sampleRate = 44100, this.lengthLookup = null, this.dmcFreqLookup = null, this.noiseWavelengthLookup = null, this.square_table = null, this.tnd_table = null, this.frameIrqEnabled = !1, this.frameIrqActive = null, this.frameClockNow = null, this.startedPlaying = !1, this.recordOutput = !1, this.initingHardware = !1, this.masterFrameCounter = null, this.derivedFrameCounter = null, this.countSequence = null, this.sampleTimer = null, this.frameTime = null, this.sampleTimerMax = null, this.sampleCount = null, this.triValue = 0, this.smpSquare1 = null, this.smpSquare2 = null, this.smpTriangle = null, this.smpDmc = null, this.accCount = null, this.prevSampleL = 0, this.prevSampleR = 0, this.smpAccumL = 0, this.smpAccumR = 0, this.dacRange = 0, this.dcValue = 0, this.masterVolume = 256, this.stereoPosLSquare1 = null, this.stereoPosLSquare2 = null, this.stereoPosLTriangle = null, this.stereoPosLNoise = null, this.stereoPosLDMC = null, this.stereoPosRSquare1 = null, this.stereoPosRSquare2 = null, this.stereoPosRTriangle = null, this.stereoPosRNoise = null, this.stereoPosRDMC = null, this.extraCycles = null, this.maxSample = null, this.minSample = null, this.panning = [80, 170, 100, 150, 128], this.setPanning(this.panning), this.initLengthLookup(), this.initDmcFrequencyLookup(), this.initNoiseWavelengthLookup(), this.initDACtables();
        for (var e = 0; e < 20; e++) 16 === e ? this.writeReg(16400, 16) : this.writeReg(16384 + e, 0);
        this.reset()
    };
    i.prototype = {
        reset: function () {
            this.sampleRate = this.nes.opts.sampleRate, this.sampleTimerMax = Math.floor(1832727040 * this.nes.opts.preferredFrameRate / (60 * this.sampleRate)), this.frameTime = Math.floor(14915 * this.nes.opts.preferredFrameRate / 60), this.sampleTimer = 0, this.updateChannelEnable(0), this.masterFrameCounter = 0, this.derivedFrameCounter = 0, this.countSequence = 0, this.sampleCount = 0, this.initCounter = 2048, this.frameIrqEnabled = !1, this.initingHardware = !1, this.resetCounter(), this.square1.reset(), this.square2.reset(), this.triangle.reset(), this.noise.reset(), this.dmc.reset(), this.accCount = 0, this.smpSquare1 = 0, this.smpSquare2 = 0, this.smpTriangle = 0, this.smpDmc = 0, this.frameIrqEnabled = !1, this.frameIrqCounterMax = 4, this.channelEnableValue = 255, this.startedPlaying = !1, this.prevSampleL = 0, this.prevSampleR = 0, this.smpAccumL = 0, this.smpAccumR = 0, this.maxSample = -5e5, this.minSample = 5e5
        },
        readReg: function (t) {
            var e = 0;
            return e |= this.square1.getLengthStatus(), e |= this.square2.getLengthStatus() << 1, e |= this.triangle.getLengthStatus() << 2, e |= this.noise.getLengthStatus() << 3, e |= this.dmc.getLengthStatus() << 4, e |= (this.frameIrqActive && this.frameIrqEnabled ? 1 : 0) << 6, e |= this.dmc.getIrqStatus() << 7, this.frameIrqActive = !1, this.dmc.irqGenerated = !1, 65535 & e
        },
        writeReg: function (t, e) {
            t >= 16384 && t < 16388 ? this.square1.writeReg(t, e) : t >= 16388 && t < 16392 ? this.square2.writeReg(t, e) : t >= 16392 && t < 16396 ? this.triangle.writeReg(t, e) : t >= 16396 && t <= 16399 ? this.noise.writeReg(t, e) : 16400 === t ? this.dmc.writeReg(t, e) : 16401 === t ? this.dmc.writeReg(t, e) : 16402 === t ? this.dmc.writeReg(t, e) : 16403 === t ? this.dmc.writeReg(t, e) : 16405 === t ? (this.updateChannelEnable(e), 0 !== e && this.initCounter > 0 && (this.initingHardware = !0), this.dmc.writeReg(t, e)) : 16407 === t && (this.countSequence = e >> 7 & 1, this.masterFrameCounter = 0, this.frameIrqActive = !1, this.frameIrqEnabled = 0 == (e >> 6 & 1), 0 === this.countSequence ? (this.frameIrqCounterMax = 4, this.derivedFrameCounter = 4) : (this.frameIrqCounterMax = 5, this.derivedFrameCounter = 0, this.frameCounterTick()))
        },
        resetCounter: function () {
            0 === this.countSequence ? this.derivedFrameCounter = 4 : this.derivedFrameCounter = 0
        },
        updateChannelEnable: function (t) {
            this.channelEnableValue = 65535 & t, this.square1.setEnabled(0 != (1 & t)), this.square2.setEnabled(0 != (2 & t)), this.triangle.setEnabled(0 != (4 & t)), this.noise.setEnabled(0 != (8 & t)), this.dmc.setEnabled(0 != (16 & t))
        },
        clockFrameCounter: function (t) {
            if (this.initCounter > 0 && this.initingHardware) return this.initCounter -= t, void (this.initCounter <= 0 && (this.initingHardware = !1));
            t += this.extraCycles;
            var e = this.sampleTimerMax - this.sampleTimer;
            t << 10 > e ? (this.extraCycles = (t << 10) - e >> 10, t -= this.extraCycles) : this.extraCycles = 0;
            var i = this.dmc,
                s = this.triangle,
                r = this.square1,
                h = this.square2,
                n = this.noise;
            if (i.isEnabled)
                for (i.shiftCounter -= t << 3; i.shiftCounter <= 0 && i.dmaFrequency > 0;) i.shiftCounter += i.dmaFrequency, i.clockDmc();
            if (s.progTimerMax > 0)
                for (s.progTimerCount -= t; s.progTimerCount <= 0;) s.progTimerCount += s.progTimerMax + 1, s.linearCounter > 0 && s.lengthCounter > 0 && (s.triangleCounter++, s.triangleCounter &= 31, s.isEnabled && (s.triangleCounter >= 16 ? s.sampleValue = 15 & s.triangleCounter : s.sampleValue = 15 - (15 & s.triangleCounter), s.sampleValue <<= 4));
            r.progTimerCount -= t, r.progTimerCount <= 0 && (r.progTimerCount += r.progTimerMax + 1 << 1, r.squareCounter++, r.squareCounter &= 7, r.updateSampleValue()), h.progTimerCount -= t, h.progTimerCount <= 0 && (h.progTimerCount += h.progTimerMax + 1 << 1, h.squareCounter++, h.squareCounter &= 7, h.updateSampleValue());
            var a = t;
            if (n.progTimerCount - a > 0) n.progTimerCount -= a, n.accCount += a, n.accValue += a * n.sampleValue;
            else
                for (; a-- > 0;) --n.progTimerCount <= 0 && n.progTimerMax > 0 && (n.shiftReg <<= 1, n.tmp = 32768 & (n.shiftReg << (0 === n.randomMode ? 1 : 6) ^ n.shiftReg), 0 !== n.tmp ? (n.shiftReg |= 1, n.randomBit = 0, n.sampleValue = 0) : (n.randomBit = 1, n.isEnabled && n.lengthCounter > 0 ? n.sampleValue = n.masterVolume : n.sampleValue = 0), n.progTimerCount += n.progTimerMax), n.accValue += n.sampleValue, n.accCount++;
            this.frameIrqEnabled && this.frameIrqActive && this.nes.cpu.requestIrq(this.nes.cpu.IRQ_NORMAL), this.masterFrameCounter += t << 1, this.masterFrameCounter >= this.frameTime && (this.masterFrameCounter -= this.frameTime, this.frameCounterTick()), this.accSample(t), this.sampleTimer += t << 10, this.sampleTimer >= this.sampleTimerMax && (this.sample(), this.sampleTimer -= this.sampleTimerMax)
        },
        accSample: function (t) {
            this.triangle.sampleCondition && (this.triValue = Math.floor((this.triangle.progTimerCount << 4) / (this.triangle.progTimerMax + 1)), this.triValue > 16 && (this.triValue = 16), this.triangle.triangleCounter >= 16 && (this.triValue = 16 - this.triValue), this.triValue += this.triangle.sampleValue), 2 === t ? (this.smpTriangle += this.triValue << 1, this.smpDmc += this.dmc.sample << 1, this.smpSquare1 += this.square1.sampleValue << 1, this.smpSquare2 += this.square2.sampleValue << 1, this.accCount += 2) : 4 === t ? (this.smpTriangle += this.triValue << 2, this.smpDmc += this.dmc.sample << 2, this.smpSquare1 += this.square1.sampleValue << 2, this.smpSquare2 += this.square2.sampleValue << 2, this.accCount += 4) : (this.smpTriangle += t * this.triValue, this.smpDmc += t * this.dmc.sample, this.smpSquare1 += t * this.square1.sampleValue, this.smpSquare2 += t * this.square2.sampleValue, this.accCount += t)
        },
        frameCounterTick: function () {
            this.derivedFrameCounter++, this.derivedFrameCounter >= this.frameIrqCounterMax && (this.derivedFrameCounter = 0), 1 !== this.derivedFrameCounter && 3 !== this.derivedFrameCounter || (this.triangle.clockLengthCounter(), this.square1.clockLengthCounter(), this.square2.clockLengthCounter(), this.noise.clockLengthCounter(), this.square1.clockSweep(), this.square2.clockSweep()), this.derivedFrameCounter >= 0 && this.derivedFrameCounter < 4 && (this.square1.clockEnvDecay(), this.square2.clockEnvDecay(), this.noise.clockEnvDecay(), this.triangle.clockLinearCounter()), 3 === this.derivedFrameCounter && 0 === this.countSequence && (this.frameIrqActive = !0)
        },
        sample: function () {
            var t, e;
            this.accCount > 0 ? (this.smpSquare1 <<= 4, this.smpSquare1 = Math.floor(this.smpSquare1 / this.accCount), this.smpSquare2 <<= 4, this.smpSquare2 = Math.floor(this.smpSquare2 / this.accCount), this.smpTriangle = Math.floor(this.smpTriangle / this.accCount), this.smpDmc <<= 4, this.smpDmc = Math.floor(this.smpDmc / this.accCount), this.accCount = 0) : (this.smpSquare1 = this.square1.sampleValue << 4, this.smpSquare2 = this.square2.sampleValue << 4, this.smpTriangle = this.triangle.sampleValue, this.smpDmc = this.dmc.sample << 4);
            var i = Math.floor((this.noise.accValue << 4) / this.noise.accCount);
            this.noise.accValue = i >> 4, this.noise.accCount = 1, t = this.smpSquare1 * this.stereoPosLSquare1 + this.smpSquare2 * this.stereoPosLSquare2 >> 8, e = 3 * this.smpTriangle * this.stereoPosLTriangle + (i << 1) * this.stereoPosLNoise + this.smpDmc * this.stereoPosLDMC >> 8, t >= this.square_table.length && (t = this.square_table.length - 1), e >= this.tnd_table.length && (e = this.tnd_table.length - 1);
            var s = this.square_table[t] + this.tnd_table[e] - this.dcValue;
            t = this.smpSquare1 * this.stereoPosRSquare1 + this.smpSquare2 * this.stereoPosRSquare2 >> 8, e = 3 * this.smpTriangle * this.stereoPosRTriangle + (i << 1) * this.stereoPosRNoise + this.smpDmc * this.stereoPosRDMC >> 8, t >= this.square_table.length && (t = this.square_table.length - 1), e >= this.tnd_table.length && (e = this.tnd_table.length - 1);
            var r = this.square_table[t] + this.tnd_table[e] - this.dcValue,
                h = s - this.prevSampleL;
            this.prevSampleL += h, this.smpAccumL += h - (this.smpAccumL >> 10), s = this.smpAccumL;
            var n = r - this.prevSampleR;
            this.prevSampleR += n, this.smpAccumR += n - (this.smpAccumR >> 10), r = this.smpAccumR, s > this.maxSample && (this.maxSample = s), s < this.minSample && (this.minSample = s), this.nes.opts.onAudioSample && this.nes.opts.onAudioSample(s / 32768, r / 32768), this.smpSquare1 = 0, this.smpSquare2 = 0, this.smpTriangle = 0, this.smpDmc = 0
        },
        getLengthMax: function (t) {
            return this.lengthLookup[t >> 3]
        },
        getDmcFrequency: function (t) {
            return t >= 0 && t < 16 ? this.dmcFreqLookup[t] : 0
        },
        getNoiseWaveLength: function (t) {
            return t >= 0 && t < 16 ? this.noiseWavelengthLookup[t] : 0
        },
        setPanning: function (t) {
            for (var e = 0; e < 5; e++) this.panning[e] = t[e];
            this.updateStereoPos()
        },
        setMasterVolume: function (t) {
            t < 0 && (t = 0), t > 256 && (t = 256), this.masterVolume = t, this.updateStereoPos()
        },
        updateStereoPos: function () {
            this.stereoPosLSquare1 = this.panning[0] * this.masterVolume >> 8, this.stereoPosLSquare2 = this.panning[1] * this.masterVolume >> 8, this.stereoPosLTriangle = this.panning[2] * this.masterVolume >> 8, this.stereoPosLNoise = this.panning[3] * this.masterVolume >> 8, this.stereoPosLDMC = this.panning[4] * this.masterVolume >> 8, this.stereoPosRSquare1 = this.masterVolume - this.stereoPosLSquare1, this.stereoPosRSquare2 = this.masterVolume - this.stereoPosLSquare2, this.stereoPosRTriangle = this.masterVolume - this.stereoPosLTriangle, this.stereoPosRNoise = this.masterVolume - this.stereoPosLNoise, this.stereoPosRDMC = this.masterVolume - this.stereoPosLDMC
        },
        initLengthLookup: function () {
            this.lengthLookup = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30]
        },
        initDmcFrequencyLookup: function () {
            this.dmcFreqLookup = new Array(16), this.dmcFreqLookup[0] = 3424, this.dmcFreqLookup[1] = 3040, this.dmcFreqLookup[2] = 2720, this.dmcFreqLookup[3] = 2560, this.dmcFreqLookup[4] = 2288, this.dmcFreqLookup[5] = 2032, this.dmcFreqLookup[6] = 1808, this.dmcFreqLookup[7] = 1712, this.dmcFreqLookup[8] = 1520, this.dmcFreqLookup[9] = 1280, this.dmcFreqLookup[10] = 1136, this.dmcFreqLookup[11] = 1024, this.dmcFreqLookup[12] = 848, this.dmcFreqLookup[13] = 672, this.dmcFreqLookup[14] = 576, this.dmcFreqLookup[15] = 432
        },
        initNoiseWavelengthLookup: function () {
            this.noiseWavelengthLookup = new Array(16), this.noiseWavelengthLookup[0] = 4, this.noiseWavelengthLookup[1] = 8, this.noiseWavelengthLookup[2] = 16, this.noiseWavelengthLookup[3] = 32, this.noiseWavelengthLookup[4] = 64, this.noiseWavelengthLookup[5] = 96, this.noiseWavelengthLookup[6] = 128, this.noiseWavelengthLookup[7] = 160, this.noiseWavelengthLookup[8] = 202, this.noiseWavelengthLookup[9] = 254, this.noiseWavelengthLookup[10] = 380, this.noiseWavelengthLookup[11] = 508, this.noiseWavelengthLookup[12] = 762, this.noiseWavelengthLookup[13] = 1016, this.noiseWavelengthLookup[14] = 2034, this.noiseWavelengthLookup[15] = 4068
        },
        initDACtables: function () {
            var t, e, i, s = 0,
                r = 0;
            for (this.square_table = new Array(512), this.tnd_table = new Array(3264), i = 0; i < 512; i++) t = 95.52 / (8128 / (i / 16) + 100), t *= .98411, t *= 5e4, e = Math.floor(t), this.square_table[i] = e, e > s && (s = e);
            for (i = 0; i < 3264; i++) t = 163.67 / (24329 / (i / 16) + 100), t *= .98411, t *= 5e4, e = Math.floor(t), this.tnd_table[i] = e, e > r && (r = e);
            this.dacRange = s + r, this.dcValue = this.dacRange / 2
        }
    };
    var s = function (t) {
        this.papu = t, this.MODE_NORMAL = 0, this.MODE_LOOP = 1, this.MODE_IRQ = 2, this.isEnabled = null, this.hasSample = null, this.irqGenerated = !1, this.playMode = null, this.dmaFrequency = null, this.dmaCounter = null, this.deltaCounter = null, this.playStartAddress = null, this.playAddress = null, this.playLength = null, this.playLengthCounter = null, this.shiftCounter = null, this.reg4012 = null, this.reg4013 = null, this.sample = null, this.dacLsb = null, this.data = null, this.reset()
    };
    s.prototype = {
        clockDmc: function () {
            this.hasSample && (0 == (1 & this.data) ? this.deltaCounter > 0 && this.deltaCounter-- : this.deltaCounter < 63 && this.deltaCounter++, this.sample = this.isEnabled ? (this.deltaCounter << 1) + this.dacLsb : 0, this.data >>= 1), this.dmaCounter--, this.dmaCounter <= 0 && (this.hasSample = !1, this.endOfSample(), this.dmaCounter = 8), this.irqGenerated && this.papu.nes.cpu.requestIrq(this.papu.nes.cpu.IRQ_NORMAL)
        },
        endOfSample: function () {
            0 === this.playLengthCounter && this.playMode === this.MODE_LOOP && (this.playAddress = this.playStartAddress, this.playLengthCounter = this.playLength), this.playLengthCounter > 0 && (this.nextSample(), 0 === this.playLengthCounter && this.playMode === this.MODE_IRQ && (this.irqGenerated = !0))
        },
        nextSample: function () {
            this.data = this.papu.nes.mmap.load(this.playAddress), this.papu.nes.cpu.haltCycles(4), this.playLengthCounter--, this.playAddress++, this.playAddress > 65535 && (this.playAddress = 32768), this.hasSample = !0
        },
        writeReg: function (t, e) {
            16400 === t ? (e >> 6 == 0 ? this.playMode = this.MODE_NORMAL : 1 == (e >> 6 & 1) ? this.playMode = this.MODE_LOOP : e >> 6 == 2 && (this.playMode = this.MODE_IRQ), 0 == (128 & e) && (this.irqGenerated = !1), this.dmaFrequency = this.papu.getDmcFrequency(15 & e)) : 16401 === t ? (this.deltaCounter = e >> 1 & 63, this.dacLsb = 1 & e, this.sample = (this.deltaCounter << 1) + this.dacLsb) : 16402 === t ? (this.playStartAddress = e << 6 | 49152, this.playAddress = this.playStartAddress, this.reg4012 = e) : 16403 === t ? (this.playLength = 1 + (e << 4), this.playLengthCounter = this.playLength, this.reg4013 = e) : 16405 === t && (0 == (e >> 4 & 1) ? this.playLengthCounter = 0 : (this.playAddress = this.playStartAddress, this.playLengthCounter = this.playLength), this.irqGenerated = !1)
        },
        setEnabled: function (t) {
            !this.isEnabled && t && (this.playLengthCounter = this.playLength), this.isEnabled = t
        },
        getLengthStatus: function () {
            return 0 !== this.playLengthCounter && this.isEnabled ? 1 : 0
        },
        getIrqStatus: function () {
            return this.irqGenerated ? 1 : 0
        },
        reset: function () {
            this.isEnabled = !1, this.irqGenerated = !1, this.playMode = this.MODE_NORMAL, this.dmaFrequency = 0, this.dmaCounter = 0, this.deltaCounter = 0, this.playStartAddress = 0, this.playAddress = 0, this.playLength = 0, this.playLengthCounter = 0, this.sample = 0, this.dacLsb = 0, this.shiftCounter = 0, this.reg4012 = 0, this.reg4013 = 0, this.data = 0
        }
    };
    var r = function (t) {
        this.papu = t, this.isEnabled = null, this.envDecayDisable = null, this.envDecayLoopEnable = null, this.lengthCounterEnable = null, this.envReset = null, this.shiftNow = null, this.lengthCounter = null, this.progTimerCount = null, this.progTimerMax = null, this.envDecayRate = null, this.envDecayCounter = null, this.envVolume = null, this.masterVolume = null, this.shiftReg = 16384, this.randomBit = null, this.randomMode = null, this.sampleValue = null, this.accValue = 0, this.accCount = 1, this.tmp = null, this.reset()
    };
    r.prototype = {
        reset: function () {
            this.progTimerCount = 0, this.progTimerMax = 0, this.isEnabled = !1, this.lengthCounter = 0, this.lengthCounterEnable = !1, this.envDecayDisable = !1, this.envDecayLoopEnable = !1, this.shiftNow = !1, this.envDecayRate = 0, this.envDecayCounter = 0, this.envVolume = 0, this.masterVolume = 0, this.shiftReg = 1, this.randomBit = 0, this.randomMode = 0, this.sampleValue = 0, this.tmp = 0
        },
        clockLengthCounter: function () {
            this.lengthCounterEnable && this.lengthCounter > 0 && (this.lengthCounter--, 0 === this.lengthCounter && this.updateSampleValue())
        },
        clockEnvDecay: function () {
            this.envReset ? (this.envReset = !1, this.envDecayCounter = this.envDecayRate + 1, this.envVolume = 15) : --this.envDecayCounter <= 0 && (this.envDecayCounter = this.envDecayRate + 1, this.envVolume > 0 ? this.envVolume-- : this.envVolume = this.envDecayLoopEnable ? 15 : 0), this.envDecayDisable ? this.masterVolume = this.envDecayRate : this.masterVolume = this.envVolume, this.updateSampleValue()
        },
        updateSampleValue: function () {
            this.isEnabled && this.lengthCounter > 0 && (this.sampleValue = this.randomBit * this.masterVolume)
        },
        writeReg: function (t, e) {
            16396 === t ? (this.envDecayDisable = 0 != (16 & e), this.envDecayRate = 15 & e, this.envDecayLoopEnable = 0 != (32 & e), this.lengthCounterEnable = 0 == (32 & e), this.envDecayDisable ? this.masterVolume = this.envDecayRate : this.masterVolume = this.envVolume) : 16398 === t ? (this.progTimerMax = this.papu.getNoiseWaveLength(15 & e), this.randomMode = e >> 7) : 16399 === t && (this.lengthCounter = this.papu.getLengthMax(248 & e), this.envReset = !0)
        },
        setEnabled: function (t) {
            this.isEnabled = t, t || (this.lengthCounter = 0), this.updateSampleValue()
        },
        getLengthStatus: function () {
            return 0 !== this.lengthCounter && this.isEnabled ? 1 : 0
        }
    };
    var h = function (t, e) {
        this.papu = t, this.dutyLookup = [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1], this.impLookup = [1, -1, 0, 0, 0, 0, 0, 0, 1, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 0], this.sqr1 = e, this.isEnabled = null, this.lengthCounterEnable = null, this.sweepActive = null, this.envDecayDisable = null, this.envDecayLoopEnable = null, this.envReset = null, this.sweepCarry = null, this.updateSweepPeriod = null, this.progTimerCount = null, this.progTimerMax = null, this.lengthCounter = null, this.squareCounter = null, this.sweepCounter = null, this.sweepCounterMax = null, this.sweepMode = null, this.sweepShiftAmount = null, this.envDecayRate = null, this.envDecayCounter = null, this.envVolume = null, this.masterVolume = null, this.dutyMode = null, this.sweepResult = null, this.sampleValue = null, this.vol = null, this.reset()
    };
    h.prototype = {
        reset: function () {
            this.progTimerCount = 0, this.progTimerMax = 0, this.lengthCounter = 0, this.squareCounter = 0, this.sweepCounter = 0, this.sweepCounterMax = 0, this.sweepMode = 0, this.sweepShiftAmount = 0, this.envDecayRate = 0, this.envDecayCounter = 0, this.envVolume = 0, this.masterVolume = 0, this.dutyMode = 0, this.vol = 0, this.isEnabled = !1, this.lengthCounterEnable = !1, this.sweepActive = !1, this.sweepCarry = !1, this.envDecayDisable = !1, this.envDecayLoopEnable = !1
        },
        clockLengthCounter: function () {
            this.lengthCounterEnable && this.lengthCounter > 0 && (this.lengthCounter--, 0 === this.lengthCounter && this.updateSampleValue())
        },
        clockEnvDecay: function () {
            this.envReset ? (this.envReset = !1, this.envDecayCounter = this.envDecayRate + 1, this.envVolume = 15) : --this.envDecayCounter <= 0 && (this.envDecayCounter = this.envDecayRate + 1, this.envVolume > 0 ? this.envVolume-- : this.envVolume = this.envDecayLoopEnable ? 15 : 0), this.envDecayDisable ? this.masterVolume = this.envDecayRate : this.masterVolume = this.envVolume, this.updateSampleValue()
        },
        clockSweep: function () {
            --this.sweepCounter <= 0 && (this.sweepCounter = this.sweepCounterMax + 1, this.sweepActive && this.sweepShiftAmount > 0 && this.progTimerMax > 7 && (this.sweepCarry = !1, 0 === this.sweepMode ? (this.progTimerMax += this.progTimerMax >> this.sweepShiftAmount, this.progTimerMax > 4095 && (this.progTimerMax = 4095, this.sweepCarry = !0)) : this.progTimerMax = this.progTimerMax - ((this.progTimerMax >> this.sweepShiftAmount) - (this.sqr1 ? 1 : 0)))), this.updateSweepPeriod && (this.updateSweepPeriod = !1, this.sweepCounter = this.sweepCounterMax + 1)
        },
        updateSampleValue: function () {
            this.isEnabled && this.lengthCounter > 0 && this.progTimerMax > 7 ? 0 === this.sweepMode && this.progTimerMax + (this.progTimerMax >> this.sweepShiftAmount) > 4095 ? this.sampleValue = 0 : this.sampleValue = this.masterVolume * this.dutyLookup[(this.dutyMode << 3) + this.squareCounter] : this.sampleValue = 0
        },
        writeReg: function (t, e) {
            var i = this.sqr1 ? 0 : 4;
            t === 16384 + i ? (this.envDecayDisable = 0 != (16 & e), this.envDecayRate = 15 & e, this.envDecayLoopEnable = 0 != (32 & e), this.dutyMode = e >> 6 & 3, this.lengthCounterEnable = 0 == (32 & e), this.envDecayDisable ? this.masterVolume = this.envDecayRate : this.masterVolume = this.envVolume, this.updateSampleValue()) : t === 16385 + i ? (this.sweepActive = 0 != (128 & e), this.sweepCounterMax = e >> 4 & 7, this.sweepMode = e >> 3 & 1, this.sweepShiftAmount = 7 & e, this.updateSweepPeriod = !0) : t === 16386 + i ? (this.progTimerMax &= 1792, this.progTimerMax |= e) : t === 16387 + i && (this.progTimerMax &= 255, this.progTimerMax |= (7 & e) << 8, this.isEnabled && (this.lengthCounter = this.papu.getLengthMax(248 & e)), this.envReset = !0)
        },
        setEnabled: function (t) {
            this.isEnabled = t, t || (this.lengthCounter = 0), this.updateSampleValue()
        },
        getLengthStatus: function () {
            return 0 !== this.lengthCounter && this.isEnabled ? 1 : 0
        }
    };
    var n = function (t) {
        this.papu = t, this.isEnabled = null, this.sampleCondition = null, this.lengthCounterEnable = null, this.lcHalt = null, this.lcControl = null, this.progTimerCount = null, this.progTimerMax = null, this.triangleCounter = null, this.lengthCounter = null, this.linearCounter = null, this.lcLoadValue = null, this.sampleValue = null, this.tmp = null, this.reset()
    };
    n.prototype = {
        reset: function () {
            this.progTimerCount = 0, this.progTimerMax = 0, this.triangleCounter = 0, this.isEnabled = !1, this.sampleCondition = !1, this.lengthCounter = 0, this.lengthCounterEnable = !1, this.linearCounter = 0, this.lcLoadValue = 0, this.lcHalt = !0, this.lcControl = !1, this.tmp = 0, this.sampleValue = 15
        },
        clockLengthCounter: function () {
            this.lengthCounterEnable && this.lengthCounter > 0 && (this.lengthCounter--, 0 === this.lengthCounter && this.updateSampleCondition())
        },
        clockLinearCounter: function () {
            this.lcHalt ? (this.linearCounter = this.lcLoadValue, this.updateSampleCondition()) : this.linearCounter > 0 && (this.linearCounter--, this.updateSampleCondition()), this.lcControl || (this.lcHalt = !1)
        },
        getLengthStatus: function () {
            return 0 !== this.lengthCounter && this.isEnabled ? 1 : 0
        },
        readReg: function (t) {
            return 0
        },
        writeReg: function (t, e) {
            16392 === t ? (this.lcControl = 0 != (128 & e), this.lcLoadValue = 127 & e, this.lengthCounterEnable = !this.lcControl) : 16394 === t ? (this.progTimerMax &= 1792, this.progTimerMax |= e) : 16395 === t && (this.progTimerMax &= 255, this.progTimerMax |= (7 & e) << 8, this.lengthCounter = this.papu.getLengthMax(248 & e), this.lcHalt = !0), this.updateSampleCondition()
        },
        clockProgrammableTimer: function (t) {
            if (this.progTimerMax > 0)
                for (this.progTimerCount += t; this.progTimerMax > 0 && this.progTimerCount >= this.progTimerMax;) this.progTimerCount -= this.progTimerMax, this.isEnabled && this.lengthCounter > 0 && this.linearCounter > 0 && this.clockTriangleGenerator()
        },
        clockTriangleGenerator: function () {
            this.triangleCounter++, this.triangleCounter &= 31
        },
        setEnabled: function (t) {
            this.isEnabled = t, t || (this.lengthCounter = 0), this.updateSampleCondition()
        },
        updateSampleCondition: function () {
            this.sampleCondition = this.isEnabled && this.progTimerMax > 7 && this.linearCounter > 0 && this.lengthCounter > 0
        }
    }, t.exports = i
}, function (t, e, i) {
    var s = i(18),
        r = i(3),
        h = function (t) {
            this.nes = t, this.mapperName = new Array(92);
            for (var e = 0; e < 92; e++) this.mapperName[e] = "Unknown Mapper";
            this.mapperName[0] = "Direct Access", this.mapperName[1] = "Nintendo MMC1", this.mapperName[2] = "UNROM", this.mapperName[3] = "CNROM", this.mapperName[4] = "Nintendo MMC3", this.mapperName[5] = "Nintendo MMC5", this.mapperName[6] = "FFE F4xxx", this.mapperName[7] = "AOROM", this.mapperName[8] = "FFE F3xxx", this.mapperName[9] = "Nintendo MMC2", this.mapperName[10] = "Nintendo MMC4", this.mapperName[11] = "Color Dreams Chip", this.mapperName[12] = "FFE F6xxx", this.mapperName[15] = "100-in-1 switch", this.mapperName[16] = "Bandai chip", this.mapperName[17] = "FFE F8xxx", this.mapperName[18] = "Jaleco SS8806 chip", this.mapperName[19] = "Namcot 106 chip", this.mapperName[20] = "Famicom Disk System", this.mapperName[21] = "Konami VRC4a", this.mapperName[22] = "Konami VRC2a", this.mapperName[23] = "Konami VRC2a", this.mapperName[24] = "Konami VRC6", this.mapperName[25] = "Konami VRC4b", this.mapperName[32] = "Irem G-101 chip", this.mapperName[33] = "Taito TC0190/TC0350", this.mapperName[34] = "32kB ROM switch", this.mapperName[64] = "Tengen RAMBO-1 chip", this.mapperName[65] = "Irem H-3001 chip", this.mapperName[66] = "GNROM switch", this.mapperName[67] = "SunSoft3 chip", this.mapperName[68] = "SunSoft4 chip", this.mapperName[69] = "SunSoft5 FME-7 chip", this.mapperName[71] = "Camerica chip", this.mapperName[78] = "Irem 74HC161/32-based", this.mapperName[91] = "Pirate HK-SF3 chip"
        };
    h.prototype = {
        VERTICAL_MIRRORING: 0,
        HORIZONTAL_MIRRORING: 1,
        FOURSCREEN_MIRRORING: 2,
        SINGLESCREEN_MIRRORING: 3,
        SINGLESCREEN_MIRRORING2: 4,
        SINGLESCREEN_MIRRORING3: 5,
        SINGLESCREEN_MIRRORING4: 6,
        CHRROM_MIRRORING: 7,
        header: null,
        rom: null,
        vrom: null,
        vromTile: null,
        romCount: null,
        vromCount: null,
        mirroring: null,
        batteryRam: null,
        trainer: null,
        fourScreen: null,
        mapperType: null,
        valid: !1,
        load: function (t) {
            var e, i, s;
            if (-1 === t.indexOf("NES")) throw new Error("Not a valid NES ROM.");
            for (this.header = new Array(16), e = 0; e < 16; e++) this.header[e] = 255 & t.charCodeAt(e);
            this.romCount = this.header[4], this.vromCount = 2 * this.header[5], this.mirroring = 0 != (1 & this.header[6]) ? 1 : 0, this.batteryRam = 0 != (2 & this.header[6]), this.trainer = 0 != (4 & this.header[6]), this.fourScreen = 0 != (8 & this.header[6]), this.mapperType = this.header[6] >> 4 | 240 & this.header[7];
            var h = !1;
            for (e = 8; e < 16; e++)
                if (0 !== this.header[e]) {
                    h = !0;
                    break
                } h && (this.mapperType &= 15), this.rom = new Array(this.romCount);
            var n, a, o = 16;
            for (e = 0; e < this.romCount; e++) {
                for (this.rom[e] = new Array(16384), i = 0; i < 16384 && !(o + i >= t.length); i++) this.rom[e][i] = 255 & t.charCodeAt(o + i);
                o += 16384
            }
            for (this.vrom = new Array(this.vromCount), e = 0; e < this.vromCount; e++) {
                for (this.vrom[e] = new Array(4096), i = 0; i < 4096 && !(o + i >= t.length); i++) this.vrom[e][i] = 255 & t.charCodeAt(o + i);
                o += 4096
            }
            for (this.vromTile = new Array(this.vromCount), e = 0; e < this.vromCount; e++)
                for (this.vromTile[e] = new Array(256), i = 0; i < 256; i++) this.vromTile[e][i] = new r;
            for (s = 0; s < this.vromCount; s++)
                for (e = 0; e < 4096; e++) n = e >> 4, (a = e % 16) < 8 ? this.vromTile[s][n].setScanline(a, this.vrom[s][e], this.vrom[s][e + 8]) : this.vromTile[s][n].setScanline(a - 8, this.vrom[s][e - 8], this.vrom[s][e]);
            this.valid = !0
        },
        getMirroringType: function () {
            return this.fourScreen ? this.FOURSCREEN_MIRRORING : 0 === this.mirroring ? this.HORIZONTAL_MIRRORING : this.VERTICAL_MIRRORING
        },
        getMapperName: function () {
            return this.mapperType >= 0 && this.mapperType < this.mapperName.length ? this.mapperName[this.mapperType] : "Unknown Mapper, " + this.mapperType
        },
        mapperSupported: function () {
            return void 0 !== s[this.mapperType]
        },
        createMapper: function () {
            if (this.mapperSupported()) return new s[this.mapperType](this.nes);
            throw new Error("This ROM uses a mapper not supported by JSNES: " + this.getMapperName() + "(" + this.mapperType + ")")
        }
    }, t.exports = h
}, function (t, e, i) {
    var s = i(1),
        r = {
            0: function (t) {
                this.nes = t
            }
        };
    r[0].prototype = {
        reset: function () {
            this.joy1StrobeState = 0, this.joy2StrobeState = 0, this.joypadLastWrite = 0, this.zapperFired = !1, this.zapperX = null, this.zapperY = null
        },
        write: function (t, e) {
            t < 8192 ? this.nes.cpu.mem[2047 & t] = e : t > 16407 ? (this.nes.cpu.mem[t] = e, t >= 24576 && t < 32768 && this.nes.opts.onBatteryRamWrite(t, e)) : t > 8199 && t < 16384 ? this.regWrite(8192 + (7 & t), e) : this.regWrite(t, e)
        },
        writelow: function (t, e) {
            t < 8192 ? this.nes.cpu.mem[2047 & t] = e : t > 16407 ? this.nes.cpu.mem[t] = e : t > 8199 && t < 16384 ? this.regWrite(8192 + (7 & t), e) : this.regWrite(t, e)
        },
        load: function (t) {
            return (t &= 65535) > 16407 ? this.nes.cpu.mem[t] : t >= 8192 ? this.regLoad(t) : this.nes.cpu.mem[2047 & t]
        },
        regLoad: function (t) {
            switch (t >> 12) {
                case 0:
                case 1:
                    break;
                case 2:
                case 3:
                    switch (7 & t) {
                        case 0:
                            return this.nes.cpu.mem[8192];
                        case 1:
                            return this.nes.cpu.mem[8193];
                        case 2:
                            return this.nes.ppu.readStatusRegister();
                        case 3:
                            return 0;
                        case 4:
                            return this.nes.ppu.sramLoad();
                        case 5:
                        case 6:
                            return 0;
                        case 7:
                            return this.nes.ppu.vramLoad()
                    }
                    break;
                case 4:
                    switch (t - 16405) {
                        case 0:
                            return this.nes.papu.readReg(t);
                        case 1:
                            return this.joy1Read();
                        case 2:
                            var e;
                            return e = null !== this.zapperX && null !== this.zapperY && this.nes.ppu.isPixelWhite(this.zapperX, this.zapperY) ? 0 : 8, this.zapperFired && (e |= 16), 65535 & (this.joy2Read() | e)
                    }
            }
            return 0
        },
        regWrite: function (t, e) {
            switch (t) {
                case 8192:
                    this.nes.cpu.mem[t] = e, this.nes.ppu.updateControlReg1(e);
                    break;
                case 8193:
                    this.nes.cpu.mem[t] = e, this.nes.ppu.updateControlReg2(e);
                    break;
                case 8195:
                    this.nes.ppu.writeSRAMAddress(e);
                    break;
                case 8196:
                    this.nes.ppu.sramWrite(e);
                    break;
                case 8197:
                    this.nes.ppu.scrollWrite(e);
                    break;
                case 8198:
                    this.nes.ppu.writeVRAMAddress(e);
                    break;
                case 8199:
                    this.nes.ppu.vramWrite(e);
                    break;
                case 16404:
                    this.nes.ppu.sramDMA(e);
                    break;
                case 16405:
                    this.nes.papu.writeReg(t, e);
                    break;
                case 16406:
                    0 == (1 & e) && 1 == (1 & this.joypadLastWrite) && (this.joy1StrobeState = 0, this.joy2StrobeState = 0), this.joypadLastWrite = e;
                    break;
                case 16407:
                    this.nes.papu.writeReg(t, e);
                    break;
                default:
                    t >= 16384 && t <= 16407 && this.nes.papu.writeReg(t, e)
            }
        },
        joy1Read: function () {
            var t;
            switch (this.joy1StrobeState) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    t = this.nes.controllers[1].state[this.joy1StrobeState];
                    break;
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                    t = 0;
                    break;
                case 19:
                    t = 1;
                    break;
                default:
                    t = 0
            }
            return this.joy1StrobeState++, 24 === this.joy1StrobeState && (this.joy1StrobeState = 0), t
        },
        joy2Read: function () {
            var t;
            switch (this.joy2StrobeState) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    t = this.nes.controllers[2].state[this.joy2StrobeState];
                    break;
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                    t = 0;
                    break;
                case 19:
                    t = 1;
                    break;
                default:
                    t = 0
            }
            return this.joy2StrobeState++, 24 === this.joy2StrobeState && (this.joy2StrobeState = 0), t
        },
        loadROM: function () {
            if (!this.nes.rom.valid || this.nes.rom.romCount < 1) throw new Error("NoMapper: Invalid ROM! Unable to load.");
            this.loadPRGROM(), this.loadCHRROM(), this.loadBatteryRam(), this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
        },
        loadPRGROM: function () {
            this.nes.rom.romCount > 1 ? (this.loadRomBank(0, 32768), this.loadRomBank(1, 49152)) : (this.loadRomBank(0, 32768), this.loadRomBank(0, 49152))
        },
        loadCHRROM: function () {
            this.nes.rom.vromCount > 0 && (1 === this.nes.rom.vromCount ? (this.loadVromBank(0, 0), this.loadVromBank(0, 4096)) : (this.loadVromBank(0, 0), this.loadVromBank(1, 4096)))
        },
        loadBatteryRam: function () {
            if (this.nes.rom.batteryRam) {
                var t = this.nes.rom.batteryRam;
                null !== t && 8192 === t.length && s.copyArrayElements(t, 0, this.nes.cpu.mem, 24576, 8192)
            }
        },
        loadRomBank: function (t, e) {
            t %= this.nes.rom.romCount, s.copyArrayElements(this.nes.rom.rom[t], 0, this.nes.cpu.mem, e, 16384)
        },
        loadVromBank: function (t, e) {
            if (0 !== this.nes.rom.vromCount) {
                this.nes.ppu.triggerRendering(), s.copyArrayElements(this.nes.rom.vrom[t % this.nes.rom.vromCount], 0, this.nes.ppu.vramMem, e, 4096);
                var i = this.nes.rom.vromTile[t % this.nes.rom.vromCount];
                s.copyArrayElements(i, 0, this.nes.ppu.ptTile, e >> 4, 256)
            }
        },
        load32kRomBank: function (t, e) {
            this.loadRomBank(2 * t % this.nes.rom.romCount, e), this.loadRomBank((2 * t + 1) % this.nes.rom.romCount, e + 16384)
        },
        load8kVromBank: function (t, e) {
            0 !== this.nes.rom.vromCount && (this.nes.ppu.triggerRendering(), this.loadVromBank(t % this.nes.rom.vromCount, e), this.loadVromBank((t + 1) % this.nes.rom.vromCount, e + 4096))
        },
        load1kVromBank: function (t, e) {
            if (0 !== this.nes.rom.vromCount) {
                this.nes.ppu.triggerRendering();
                var i = Math.floor(t / 4) % this.nes.rom.vromCount,
                    r = t % 4 * 1024;
                s.copyArrayElements(this.nes.rom.vrom[i], r, this.nes.ppu.vramMem, e, 1024);
                for (var h = this.nes.rom.vromTile[i], n = e >> 4, a = 0; a < 64; a++) this.nes.ppu.ptTile[n + a] = h[(t % 4 << 6) + a]
            }
        },
        load2kVromBank: function (t, e) {
            if (0 !== this.nes.rom.vromCount) {
                this.nes.ppu.triggerRendering();
                var i = Math.floor(t / 2) % this.nes.rom.vromCount,
                    r = t % 2 * 2048;
                s.copyArrayElements(this.nes.rom.vrom[i], r, this.nes.ppu.vramMem, e, 2048);
                for (var h = this.nes.rom.vromTile[i], n = e >> 4, a = 0; a < 128; a++) this.nes.ppu.ptTile[n + a] = h[(t % 2 << 7) + a]
            }
        },
        load8kRomBank: function (t, e) {
            var i = Math.floor(t / 2) % this.nes.rom.romCount,
                r = t % 2 * 8192;
            s.copyArrayElements(this.nes.rom.rom[i], r, this.nes.cpu.mem, e, 8192)
        },
        clockIrqCounter: function () { },
        latchAccess: function (t) { },
        toJSON: function () {
            return {
                joy1StrobeState: this.joy1StrobeState,
                joy2StrobeState: this.joy2StrobeState,
                joypadLastWrite: this.joypadLastWrite
            }
        },
        fromJSON: function (t) {
            this.joy1StrobeState = t.joy1StrobeState, this.joy2StrobeState = t.joy2StrobeState, this.joypadLastWrite = t.joypadLastWrite
        }
    }, r[1] = function (t) {
        this.nes = t
    }, r[1].prototype = new r[0], r[1].prototype.reset = function () {
        r[0].prototype.reset.apply(this), this.regBuffer = 0, this.regBufferCounter = 0, this.mirroring = 0, this.oneScreenMirroring = 0, this.prgSwitchingArea = 1, this.prgSwitchingSize = 1, this.vromSwitchingSize = 0, this.romSelectionReg0 = 0, this.romSelectionReg1 = 0, this.romBankSelect = 0
    }, r[1].prototype.write = function (t, e) {
        t < 32768 ? r[0].prototype.write.apply(this, arguments) : 0 != (128 & e) ? (this.regBufferCounter = 0, this.regBuffer = 0, 0 === this.getRegNumber(t) && (this.prgSwitchingArea = 1, this.prgSwitchingSize = 1)) : (this.regBuffer = this.regBuffer & 255 - (1 << this.regBufferCounter) | (1 & e) << this.regBufferCounter, this.regBufferCounter++, 5 === this.regBufferCounter && (this.setReg(this.getRegNumber(t), this.regBuffer), this.regBuffer = 0, this.regBufferCounter = 0))
    }, r[1].prototype.setReg = function (t, e) {
        var i;
        switch (t) {
            case 0:
                (i = 3 & e) !== this.mirroring && (this.mirroring = i, 0 == (2 & this.mirroring) ? this.nes.ppu.setMirroring(this.nes.rom.SINGLESCREEN_MIRRORING) : 0 != (1 & this.mirroring) ? this.nes.ppu.setMirroring(this.nes.rom.HORIZONTAL_MIRRORING) : this.nes.ppu.setMirroring(this.nes.rom.VERTICAL_MIRRORING)), this.prgSwitchingArea = e >> 2 & 1, this.prgSwitchingSize = e >> 3 & 1, this.vromSwitchingSize = e >> 4 & 1;
                break;
            case 1:
                this.romSelectionReg0 = e >> 4 & 1, this.nes.rom.vromCount > 0 && (0 === this.vromSwitchingSize ? 0 === this.romSelectionReg0 ? this.load8kVromBank(15 & e, 0) : this.load8kVromBank(Math.floor(this.nes.rom.vromCount / 2) + (15 & e), 0) : 0 === this.romSelectionReg0 ? this.loadVromBank(15 & e, 0) : this.loadVromBank(Math.floor(this.nes.rom.vromCount / 2) + (15 & e), 0));
                break;
            case 2:
                this.romSelectionReg1 = e >> 4 & 1, this.nes.rom.vromCount > 0 && 1 === this.vromSwitchingSize && (0 === this.romSelectionReg1 ? this.loadVromBank(15 & e, 4096) : this.loadVromBank(Math.floor(this.nes.rom.vromCount / 2) + (15 & e), 4096));
                break;
            default:
                var s;
                i = 15 & e;
                var r = 0;
                this.nes.rom.romCount >= 32 ? 0 === this.vromSwitchingSize ? 1 === this.romSelectionReg0 && (r = 16) : r = (this.romSelectionReg0 | this.romSelectionReg1 << 1) << 3 : this.nes.rom.romCount >= 16 && 1 === this.romSelectionReg0 && (r = 8), 0 === this.prgSwitchingSize ? (s = r + (15 & e), this.load32kRomBank(s, 32768)) : (s = 2 * r + (15 & e), 0 === this.prgSwitchingArea ? this.loadRomBank(s, 49152) : this.loadRomBank(s, 32768))
        }
    }, r[1].prototype.getRegNumber = function (t) {
        return t >= 32768 && t <= 40959 ? 0 : t >= 40960 && t <= 49151 ? 1 : t >= 49152 && t <= 57343 ? 2 : 3
    }, r[1].prototype.loadROM = function () {
        if (!this.nes.rom.valid) throw new Error("MMC1: Invalid ROM! Unable to load.");
        this.loadRomBank(0, 32768), this.loadRomBank(this.nes.rom.romCount - 1, 49152), this.loadCHRROM(), this.loadBatteryRam(), this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
    }, r[1].prototype.switchLowHighPrgRom = function (t) { }, r[1].prototype.switch16to32 = function () { }, r[1].prototype.switch32to16 = function () { }, r[1].prototype.toJSON = function () {
        var t = r[0].prototype.toJSON.apply(this);
        return t.mirroring = this.mirroring, t.oneScreenMirroring = this.oneScreenMirroring, t.prgSwitchingArea = this.prgSwitchingArea, t.prgSwitchingSize = this.prgSwitchingSize, t.vromSwitchingSize = this.vromSwitchingSize, t.romSelectionReg0 = this.romSelectionReg0, t.romSelectionReg1 = this.romSelectionReg1, t.romBankSelect = this.romBankSelect, t.regBuffer = this.regBuffer, t.regBufferCounter = this.regBufferCounter, t
    }, r[1].prototype.fromJSON = function (t) {
        r[0].prototype.fromJSON.apply(this, arguments), this.mirroring = t.mirroring, this.oneScreenMirroring = t.oneScreenMirroring, this.prgSwitchingArea = t.prgSwitchingArea, this.prgSwitchingSize = t.prgSwitchingSize, this.vromSwitchingSize = t.vromSwitchingSize, this.romSelectionReg0 = t.romSelectionReg0, this.romSelectionReg1 = t.romSelectionReg1, this.romBankSelect = t.romBankSelect, this.regBuffer = t.regBuffer, this.regBufferCounter = t.regBufferCounter
    }, r[2] = function (t) {
        this.nes = t
    }, r[2].prototype = new r[0], r[2].prototype.write = function (t, e) {
        t < 32768 ? r[0].prototype.write.apply(this, arguments) : this.loadRomBank(e, 32768)
    }, r[2].prototype.loadROM = function () {
        if (!this.nes.rom.valid) throw new Error("UNROM: Invalid ROM! Unable to load.");
        this.loadRomBank(0, 32768), this.loadRomBank(this.nes.rom.romCount - 1, 49152), this.loadCHRROM(), this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
    }, r[3] = function (t) {
        this.nes = t
    }, r[3].prototype = new r[0], r[3].prototype.write = function (t, e) {
        if (t < 32768) r[0].prototype.write.apply(this, arguments);
        else {
            var i = e % (this.nes.rom.vromCount / 2) * 2;
            this.loadVromBank(i, 0), this.loadVromBank(i + 1, 4096), this.load8kVromBank(2 * e, 0)
        }
    }, r[4] = function (t) {
        this.nes = t, this.CMD_SEL_2_1K_VROM_0000 = 0, this.CMD_SEL_2_1K_VROM_0800 = 1, this.CMD_SEL_1K_VROM_1000 = 2, this.CMD_SEL_1K_VROM_1400 = 3, this.CMD_SEL_1K_VROM_1800 = 4, this.CMD_SEL_1K_VROM_1C00 = 5, this.CMD_SEL_ROM_PAGE1 = 6, this.CMD_SEL_ROM_PAGE2 = 7, this.command = null, this.prgAddressSelect = null, this.chrAddressSelect = null, this.pageNumber = null, this.irqCounter = null, this.irqLatchValue = null, this.irqEnable = null, this.prgAddressChanged = !1
    }, r[4].prototype = new r[0], r[4].prototype.write = function (t, e) {
        if (t < 32768) r[0].prototype.write.apply(this, arguments);
        else switch (t) {
            case 32768:
                this.command = 7 & e;
                var i = e >> 6 & 1;
                i !== this.prgAddressSelect && (this.prgAddressChanged = !0), this.prgAddressSelect = i, this.chrAddressSelect = e >> 7 & 1;
                break;
            case 32769:
                this.executeCommand(this.command, e);
                break;
            case 40960:
                0 != (1 & e) ? this.nes.ppu.setMirroring(this.nes.rom.HORIZONTAL_MIRRORING) : this.nes.ppu.setMirroring(this.nes.rom.VERTICAL_MIRRORING);
                break;
            case 40961:
                break;
            case 49152:
                this.irqCounter = e;
                break;
            case 49153:
                this.irqLatchValue = e;
                break;
            case 57344:
                this.irqEnable = 0;
                break;
            case 57345:
                this.irqEnable = 1
        }
    }, r[4].prototype.executeCommand = function (t, e) {
        switch (t) {
            case this.CMD_SEL_2_1K_VROM_0000:
                0 === this.chrAddressSelect ? (this.load1kVromBank(e, 0), this.load1kVromBank(e + 1, 1024)) : (this.load1kVromBank(e, 4096), this.load1kVromBank(e + 1, 5120));
                break;
            case this.CMD_SEL_2_1K_VROM_0800:
                0 === this.chrAddressSelect ? (this.load1kVromBank(e, 2048), this.load1kVromBank(e + 1, 3072)) : (this.load1kVromBank(e, 6144), this.load1kVromBank(e + 1, 7168));
                break;
            case this.CMD_SEL_1K_VROM_1000:
                0 === this.chrAddressSelect ? this.load1kVromBank(e, 4096) : this.load1kVromBank(e, 0);
                break;
            case this.CMD_SEL_1K_VROM_1400:
                0 === this.chrAddressSelect ? this.load1kVromBank(e, 5120) : this.load1kVromBank(e, 1024);
                break;
            case this.CMD_SEL_1K_VROM_1800:
                0 === this.chrAddressSelect ? this.load1kVromBank(e, 6144) : this.load1kVromBank(e, 2048);
                break;
            case this.CMD_SEL_1K_VROM_1C00:
                0 === this.chrAddressSelect ? this.load1kVromBank(e, 7168) : this.load1kVromBank(e, 3072);
                break;
            case this.CMD_SEL_ROM_PAGE1:
                this.prgAddressChanged && (0 === this.prgAddressSelect ? this.load8kRomBank(2 * (this.nes.rom.romCount - 1), 49152) : this.load8kRomBank(2 * (this.nes.rom.romCount - 1), 32768), this.prgAddressChanged = !1), 0 === this.prgAddressSelect ? this.load8kRomBank(e, 32768) : this.load8kRomBank(e, 49152);
                break;
            case this.CMD_SEL_ROM_PAGE2:
                this.load8kRomBank(e, 40960), this.prgAddressChanged && (0 === this.prgAddressSelect ? this.load8kRomBank(2 * (this.nes.rom.romCount - 1), 49152) : this.load8kRomBank(2 * (this.nes.rom.romCount - 1), 32768), this.prgAddressChanged = !1)
        }
    }, r[4].prototype.loadROM = function () {
        if (!this.nes.rom.valid) throw new Error("MMC3: Invalid ROM! Unable to load.");
        this.load8kRomBank(2 * (this.nes.rom.romCount - 1), 49152), this.load8kRomBank(2 * (this.nes.rom.romCount - 1) + 1, 57344), this.load8kRomBank(0, 32768), this.load8kRomBank(1, 40960), this.loadCHRROM(), this.loadBatteryRam(), this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
    }, r[4].prototype.clockIrqCounter = function () {
        1 === this.irqEnable && (this.irqCounter--, this.irqCounter < 0 && (this.nes.cpu.requestIrq(this.nes.cpu.IRQ_NORMAL), this.irqCounter = this.irqLatchValue))
    }, r[4].prototype.toJSON = function () {
        var t = r[0].prototype.toJSON.apply(this);
        return t.command = this.command, t.prgAddressSelect = this.prgAddressSelect, t.chrAddressSelect = this.chrAddressSelect, t.pageNumber = this.pageNumber, t.irqCounter = this.irqCounter, t.irqLatchValue = this.irqLatchValue, t.irqEnable = this.irqEnable, t.prgAddressChanged = this.prgAddressChanged, t
    }, r[4].prototype.fromJSON = function (t) {
        r[0].prototype.fromJSON.apply(this, arguments), this.command = t.command, this.prgAddressSelect = t.prgAddressSelect, this.chrAddressSelect = t.chrAddressSelect, this.pageNumber = t.pageNumber, this.irqCounter = t.irqCounter, this.irqLatchValue = t.irqLatchValue, this.irqEnable = t.irqEnable, this.prgAddressChanged = t.prgAddressChanged
    }, r[5] = function (t) {
        this.nes = t
    }, r[5].prototype = new r[0], r[5].prototype.write = function (t, e) {
        t < 32768 ? r[0].prototype.write.apply(this, arguments) : this.load8kVromBank(e, 0)
    }, r[5].prototype.write = function (t, e) {
        if (t < 20480) r[0].prototype.write.apply(this, arguments);
        else switch (t) {
            case 20736:
                this.prg_size = 3 & e;
                break;
            case 20737:
                this.chr_size = 3 & e;
                break;
            case 20738:
                this.sram_we_a = 3 & e;
                break;
            case 20739:
                this.sram_we_b = 3 & e;
                break;
            case 20740:
                this.graphic_mode = 3 & e;
                break;
            case 20741:
                this.nametable_mode = e, this.nametable_type[0] = 3 & e, this.load1kVromBank(3 & e, 8192), e >>= 2, this.nametable_type[1] = 3 & e, this.load1kVromBank(3 & e, 9216), e >>= 2, this.nametable_type[2] = 3 & e, this.load1kVromBank(3 & e, 10240), e >>= 2, this.nametable_type[3] = 3 & e, this.load1kVromBank(3 & e, 11264);
                break;
            case 20742:
                this.fill_chr = e;
                break;
            case 20743:
                this.fill_pal = 3 & e;
                break;
            case 20755:
                this.SetBank_SRAM(3, 3 & e);
                break;
            case 20756:
            case 20757:
            case 20758:
            case 20759:
                this.SetBank_CPU(t, e);
                break;
            case 20768:
            case 20769:
            case 20770:
            case 20771:
            case 20772:
            case 20773:
            case 20774:
            case 20775:
                this.chr_mode = 0, this.chr_page[0][7 & t] = e, this.SetBank_PPU();
                break;
            case 20776:
            case 20777:
            case 20778:
            case 20779:
                this.chr_mode = 1, this.chr_page[1][0 + (3 & t)] = e, this.chr_page[1][4 + (3 & t)] = e, this.SetBank_PPU();
                break;
            case 20992:
                this.split_control = e;
                break;
            case 20993:
                this.split_scroll = e;
                break;
            case 20994:
                this.split_page = 63 & e;
                break;
            case 20995:
                this.irq_line = e, this.nes.cpu.ClearIRQ();
                break;
            case 20996:
                this.irq_enable = e, this.nes.cpu.ClearIRQ();
                break;
            case 20997:
                this.mult_a = e;
                break;
            case 20998:
                this.mult_b = e;
                break;
            default:
                t >= 20480 && t <= 20501 ? this.nes.papu.exWrite(t, e) : t >= 23552 && t <= 24575 ? 2 === this.graphic_mode || 3 !== this.graphic_mode && this.irq_status : t >= 24576 && t <= 32767 && 2 === this.sram_we_a && this.sram_we_b
        }
    }, r[5].prototype.loadROM = function () {
        if (!this.nes.rom.valid) throw new Error("UNROM: Invalid ROM! Unable to load.");
        this.load8kRomBank(2 * this.nes.rom.romCount - 1, 32768), this.load8kRomBank(2 * this.nes.rom.romCount - 1, 40960), this.load8kRomBank(2 * this.nes.rom.romCount - 1, 49152), this.load8kRomBank(2 * this.nes.rom.romCount - 1, 57344), this.loadCHRROM(), this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
    }, r[7] = function (t) {
        this.nes = t
    }, r[7].prototype = new r[0], r[7].prototype.write = function (t, e) {
        t < 32768 ? r[0].prototype.write.apply(this, arguments) : (this.load32kRomBank(7 & e, 32768), 16 & e ? this.nes.ppu.setMirroring(this.nes.rom.SINGLESCREEN_MIRRORING2) : this.nes.ppu.setMirroring(this.nes.rom.SINGLESCREEN_MIRRORING))
    }, r[7].prototype.loadROM = function () {
        if (!this.nes.rom.valid) throw new Error("AOROM: Invalid ROM! Unable to load.");
        this.loadPRGROM(), this.loadCHRROM(), this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
    }, r[11] = function (t) {
        this.nes = t
    }, r[11].prototype = new r[0], r[11].prototype.write = function (t, e) {
        if (t < 32768) r[0].prototype.write.apply(this, arguments);
        else {
            var i = 2 * (15 & e) % this.nes.rom.romCount,
                s = (2 * (15 & e) + 1) % this.nes.rom.romCount;
            if (this.loadRomBank(i, 32768), this.loadRomBank(s, 49152), this.nes.rom.vromCount > 0) {
                var h = 2 * (e >> 4) % this.nes.rom.vromCount;
                this.loadVromBank(h, 0), this.loadVromBank(h + 1, 4096)
            }
        }
    }, r[34] = function (t) {
        this.nes = t
    }, r[34].prototype = new r[0], r[34].prototype.write = function (t, e) {
        t < 32768 ? r[0].prototype.write.apply(this, arguments) : this.load32kRomBank(e, 32768)
    }, r[38] = function (t) {
        this.nes = t
    }, r[38].prototype = new r[0], r[38].prototype.write = function (t, e) {
        t < 28672 || t > 32767 ? r[0].prototype.write.apply(this, arguments) : (this.load32kRomBank(3 & e, 32768), this.load8kVromBank(2 * (e >> 2 & 3), 0))
    }, r[66] = function (t) {
        this.nes = t
    }, r[66].prototype = new r[0], r[66].prototype.write = function (t, e) {
        t < 32768 ? r[0].prototype.write.apply(this, arguments) : (this.load32kRomBank(e >> 4 & 3, 32768), this.load8kVromBank(2 * (3 & e), 0))
    }, r[94] = function (t) {
        this.nes = t
    }, r[94].prototype = new r[0], r[94].prototype.write = function (t, e) {
        t < 32768 ? r[0].prototype.write.apply(this, arguments) : this.loadRomBank(e >> 2, 32768)
    }, r[94].prototype.loadROM = function () {
        if (!this.nes.rom.valid) throw new Error("UN1ROM: Invalid ROM! Unable to load.");
        this.loadRomBank(0, 32768), this.loadRomBank(this.nes.rom.romCount - 1, 49152), this.loadCHRROM(), this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
    }, r[140] = function (t) {
        this.nes = t
    }, r[140].prototype = new r[0], r[140].prototype.write = function (t, e) {
        t < 24576 || t > 32767 ? r[0].prototype.write.apply(this, arguments) : (this.load32kRomBank(e >> 4 & 3, 32768), this.load8kVromBank(2 * (15 & e), 0))
    }, r[180] = function (t) {
        this.nes = t
    }, r[180].prototype = new r[0], r[180].prototype.write = function (t, e) {
        t < 32768 ? r[0].prototype.write.apply(this, arguments) : this.loadRomBank(e, 49152)
    }, r[180].prototype.loadROM = function () {
        if (!this.nes.rom.valid) throw new Error("Mapper 180: Invalid ROM! Unable to load.");
        this.loadRomBank(0, 32768), this.loadRomBank(this.nes.rom.romCount - 1, 49152), this.loadCHRROM(), this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
    }, t.exports = r
}, function (t, e, i) {
    "use strict";
    i.r(e);
    i(4);
    var s = i(0),
        r = i.n(s);

    function h(t) {
        t.requestFullscreen ? t.requestFullscreen() : t.mozRequestFullScreen ? t.mozRequestFullScreen() : t.msRequestFullscreen ? t.msRequestFullscreen() : t.webkitRequestFullscreen && t.webkitRequestFullScreen()
    }

    function n() {
        document.exitFullScreen ? document.exitFullScreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen()
    }
    var a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t
    } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    },
        o = window.mozRequestAnimationFrame || window.requestAnimationFrame,
        l = window.mozCancelRequestAnimationFrame || window.cancelRequestAnimationFrame,
        p = null,
        u = null,
        c = !1,
        d = !1,
        m = {
            1: !0,
            2: !0
        };
    var R = {
        1: {},
        2: {}
    },
        f = {
            1: {},
            2: {}
        },
        _ = {
            1: [],
            2: []
        },
        g = {
            1: [],
            2: []
        },
        S = {
            1: [],
            2: []
        },
        A = {
            0: "B",
            1: "A",
            2: "X",
            3: "Y",
            4: "Refresh",
            5: "Fullscreen",
            8: "Select",
            9: "Start",
            12: "Up",
            13: "Down",
            14: "Left",
            15: "Right"
        },
        b = {
            A: {
                value: r.a.Controller.BUTTON_A,
                isHold: !0
            },
            B: {
                value: r.a.Controller.BUTTON_B,
                isHold: !0
            },
            Select: {
                value: r.a.Controller.BUTTON_SELECT,
                isHold: !0
            },
            Start: {
                value: r.a.Controller.BUTTON_START,
                isHold: !0
            },
            Up: {
                value: r.a.Controller.BUTTON_UP,
                isHold: !0
            },
            Down: {
                value: r.a.Controller.BUTTON_DOWN,
                isHold: !0
            },
            Left: {
                value: r.a.Controller.BUTTON_LEFT,
                isHold: !0
            },
            Right: {
                value: r.a.Controller.BUTTON_RIGHT,
                isHold: !0
            },
            Refresh: {
                value: -1,
                isHold: !1
            },
            Fullscreen: {
                value: -2,
                isHold: !1
            }
        };

    function C() {
        if (c) {
            var t = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [];
            t && (Array.from(t).forEach(function (t, e) {
                var i = e + 1;
                if (m[i]) {
                    f[i] = t,
                        function (t) {
                            _[t] = [];
                            for (var e = g[t].length, i = 0; i < e; i++) _[t][i] = g[t][i];
                            g[t] = [];
                            var s = f[t] || {},
                                r = [];
                            if (s.buttons)
                                for (var h = s.buttons.length, n = 0; n < h; n++) y(s.buttons[n]) && r.push(A[n]);
                            var a = [];
                            if (s.axes)
                                for (var o = s.axes.length, l = 0; l < o; l++) a.push(s.axes[l].toFixed(2));
                            S[t] = a, g[t] = r
                        }(i);
                    for (var s = Object.keys(b), r = 0; r < s.length; r++) D(s[r], i)
                }
            }), p = o(C))
        }
    }

    function D(t, e) {
        var i = R[e],
            s = b[t];
        if (null != s)
            if (function (t, e, i) {
                for (var s = g[i], r = _[i], h = !1, n = 0, a = s.length; n < a; n++)
                    if (s[n] == t && (h = !0, !e))
                        for (var o = 0, l = r.length; o < l; o++) r[o] == t && (h = !1);
                return h
            }(t, s.isHold, e)) {
                if (i[t] = !0, u.buttonDown(e, s.value), s.value < 0) switch (s.value) {
                    case -1:
                        u.reloadROM();
                        break;
                    case -2:
                        (d = !d) ? h(u._$canvasDom) : n()
                }
            } else i[t] && (u.buttonUp(e, s.value), i[t] = !1)
    }

    function y(t) {
        return "object" == (void 0 === t ? "undefined" : a(t)) ? t.pressed : 1 == t
    }
    var I, N, E, v, T = 256,
        O = 240,
        k = T * O,
        F = 512,
        M = 4095,
        w = new Float32Array(4096),
        P = new Float32Array(4096),
        B = 0,
        L = 0,
        x = {
            1: !0,
            2: !0
        },
        G = null,
        V = !1,
        q = new r.a.NES({
            onFrame: function (t) {
                for (var e = 0; e < k; e++) v[e] = 4278190080 | t[e]
            },
            onAudioSample: function (t, e) {
                w[B] = t, P[B] = e, B = B + 1 & M
            }
        });
    u = q, window.addEventListener("gamepadconnected", function (t) {
        var e = t.gamepad;
        c = !0,
            /// window.f_common_lib.ElementUI.Message.success("Gamepad(" + e.id + ") connected！"),
            C()
    }), window.addEventListener("gamepaddisconnected", function () {
        // window.f_common_lib.ElementUI.Message.warning("Gamepad disconnected, Waiting for gamepad."), 
        l(p)
    });
    var U = {
        ArrowUp: {
            player: 1,
            key: "ArrowUp",
            keyCode: 38,
            label: "Up",
            value: r.a.Controller.BUTTON_UP,
            isPreventDefault: !0
        },
        ArrowDown: {
            player: 1,
            key: "ArrowDown",
            keyCode: 40,
            label: "Down",
            value: r.a.Controller.BUTTON_DOWN,
            isPreventDefault: !0
        },
        ArrowLeft: {
            player: 1,
            key: "ArrowLeft",
            keyCode: 37,
            label: "Left",
            value: r.a.Controller.BUTTON_LEFT,
            isPreventDefault: !0
        },
        ArrowRight: {
            player: 1,
            key: "ArrowRight",
            keyCode: 39,
            label: "Right",
            value: r.a.Controller.BUTTON_RIGHT,
            isPreventDefault: !0
        },
        a: {
            player: 1,
            key: "a",
            keyCode: 65,
            label: "A",
            value: r.a.Controller.BUTTON_A
        },
        s: {
            player: 1,
            key: "s",
            keyCode: 83,
            label: "B",
            value: r.a.Controller.BUTTON_B
        },
        Tab: {
            player: 1,
            key: "Tab",
            keyCode: 9,
            label: "Select",
            value: r.a.Controller.BUTTON_SELECT,
            isPreventDefault: !0
        },
        Enter: {
            player: 1,
            key: "Enter",
            keyCode: 13,
            label: "Start",
            value: r.a.Controller.BUTTON_START
        },
        F1: {
            player: 1,
            key: "F1",
            keyCode: 112,
            label: "Refresh",
            value: -1,
            isPreventDefault: !0
        },
        F2: {
            player: 1,
            key: "F2",
            keyCode: 113,
            label: "FullScreen",
            value: -2,
            isPreventDefault: !0
        },
        o: {
            player: 2,
            key: "o",
            keyCode: 79,
            label: "Up",
            value: r.a.Controller.BUTTON_UP,
            isPreventDefault: !0
        },
        l: {
            player: 2,
            key: "l",
            keyCode: 76,
            label: "Down",
            value: r.a.Controller.BUTTON_DOWN,
            isPreventDefault: !0
        },
        k: {
            player: 2,
            key: "k",
            keyCode: 75,
            label: "Left",
            value: r.a.Controller.BUTTON_LEFT,
            isPreventDefault: !0
        },
        ";": {
            player: 2,
            key: ";",
            keyCode: 186,
            label: "Right",
            value: r.a.Controller.BUTTON_RIGHT,
            isPreventDefault: !0
        },
        d: {
            player: 2,
            key: "d",
            keyCode: 68,
            label: "A",
            value: r.a.Controller.BUTTON_A
        },
        f: {
            player: 2,
            key: "f",
            keyCode: 70,
            label: "B",
            value: r.a.Controller.BUTTON_B
        }
    };

    function X(t) {
        x[t] = !0
    }

    function H(t) {
        x[t] = !1
    }
    var Y = function (t) {
        K(q.buttonDown, t, U)
    },
        W = function (t) {
            K(q.buttonUp, t, U)
        };

    function K(t, e, i) {
        for (var s = null, r = Object.values(i), a = 0; a < r.length; a++)
            if (+r[a].keyCode === e.which) {
                s = r[a];
                break
            } if (null != s) {
                var o = s.value,
                    l = s.isPreventDefault;
                if (!x[s.player]) return;
                if (o > -1) t(s.player, o), l && e.preventDefault();
                else switch (s.label) {
                    case "Refresh":
                        if ("keyup" === e.type) return;
                        z();
                        break;
                    case "FullScreen":
                        if ("keyup" === e.type) return;
                        (V = !V) ? h(G) : n()
                }
            }
    }

    function Z(t, e) {
        var i = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
        return function (t) {
            G = t, q._$canvasDom = t, I = t.getContext("2d"), N = I.getImageData(0, 0, T, O), I.fillStyle = "black", I.fillRect(0, 0, T, O);
            var e = new ArrayBuffer(N.data.length);
            E = new Uint8ClampedArray(e), v = new Uint32Array(e)
        }(t),
            function (t) {
                return new Promise(function (e, i) {
                    var s = new XMLHttpRequest;
                    s.open("GET", t), s.withCredentials = !0, s.overrideMimeType("text/plain; charset=x-user-defined"), s.onerror = function () {
                        return console.log("Error loading " + t + ": " + s.statusText)
                    }, s.onload = function () {
                        200 === this.status ? (this.responseText, e(this.responseText)) : 0 === this.status || s.onerror()
                    }, s.send()
                })
            }(e).then(function (t) {
                q.loadROM(t)
            }).then(function () {
                j.isInitAnimationFrame || (j.isInitAnimationFrame = !0, Q = !0, window.requestAnimationFrame(j)), i || J()
            })
    }

    function j() {
        Q && (window.requestAnimationFrame(j), N.data.set(E), I.putImageData(N, 0, 0), q.frame())
    }
    document.addEventListener("keydown", Y), document.addEventListener("keyup", W);
    var Q = !1;

    function J() {
        Q = !1
    }

    function z() {
        q.reloadROM()
    }

    function $(t) {
        var e = t.outputBuffer,
            i = e.length;
        (B - L & M) < F && q.frame();
        for (var s = e.getChannelData(0), r = e.getChannelData(1), h = 0; h < i; h++) {
            var n = L + h & M;
            s[h] = w[n], r[h] = P[n]
        }
        L = L + i & M
    }

    function tt(t) {
        document.removeEventListener("keydown", Y), document.removeEventListener("keyup", W), t = Object.assign({}, t), Y = function (e) {
            K(q.buttonDown, e, t)
        }, W = function (e) {
            K(q.buttonUp, e, t)
        }, document.addEventListener("keydown", Y), document.addEventListener("keyup", W)
    }
    var et = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t
    } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    },
        it = function (t, e) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return function (t, e) {
                var i = [],
                    s = !0,
                    r = !1,
                    h = void 0;
                try {
                    for (var n, a = t[Symbol.iterator](); !(s = (n = a.next()).done) && (i.push(n.value), !e || i.length !== e); s = !0);
                } catch (t) {
                    r = !0, h = t
                } finally {
                    try {
                        !s && a.return && a.return()
                    } finally {
                        if (r) throw h
                    }
                }
                return i
            }(t, e);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        },
        st = function () {
            function t(t, e) {
                for (var i = 0; i < e.length; i++) {
                    var s = e[i];
                    s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
                }
            }
            return function (e, i, s) {
                return i && t(e.prototype, i), s && t(e, s), e
            }
        }();

    function rt() {
        return Reflect.construct(HTMLElement, [], this.__proto__.constructor)
    }
    Object.setPrototypeOf(rt.prototype, HTMLElement.prototype), Object.setPrototypeOf(rt, HTMLElement);
    var ht = i(12),
        nt = !0,
        at = null,
        ot = null,
        lt = null,
        pt = function (t) {
            function e() {
                ! function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, e);
                var t = function (t, e) {
                    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !e || "object" != typeof e && "function" != typeof e ? t : e
                }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
                return t.innerHTML = ht, t.$targetSelectedDom = null, t.isChangingKey = !1, t.modalVisible = !1, t.isPlayingNes = !1, t.isRenderNes = !1, t.modalInstance = null, t.listenPlayerKey = [!0, !0, !1, !1], t.lastListenPlayerKey = [!0, !0, !1, !1], t.getDefaultKeysMap(), lt = t, t
            }
            return function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
            }(e, rt), st(e, [{
                key: "connectedCallback",
                value: function () {
                    this.setNesBoxSize(), this.bindEvent(), "complete" === document.readyState ? this.initNes() : window.onload = this.initNes.bind(this)
                }
            }, {
                key: "getDefaultKeysMap",
                value: function () {
                    var t = localStorage.getItem("DEFAULT_BUTTON_KEY_MAP"),
                        e = localStorage.getItem("DEFAULT_BUTTON_KEY_VERSION");
                    try {
                        null != t ? (t = JSON.parse(t), t = "0.1.0" === e ? Object.assign({}, t) : Object.assign({}, U)) : t = U
                    } catch (e) {
                        console.log(e), t = U
                    }
                    t = "string" == typeof t ? JSON.parse(t) : t, t = Object.assign({}, t), this.defaultKeysMap = t, this.keysArray = Object.values(t)
                }
            }, {
                key: "setNesBoxSize",
                value: function () {
                    var t, e = window,
                        i = e.innerWidth,
                        s = e.innerHeight,
                        r = document.getElementById("nes-wrapper");
                    t = .9 * Math.min(i, s), t = parseInt(t), r.style.width = t + "px"
                }
            }, {
                key: "bindEvent",
                value: function () {
                    window.onresize = this.setNesBoxSize.bind(this), this.getDom(), this.querySelector(".modal-body table tbody").addEventListener("click", this.handleChangeKey.bind(this), !1), this.$modalCloseBtn.addEventListener("click", this.closeModal.bind(this), !1), this.$modalSaveBtn.addEventListener("click", this.saveKeyControls.bind(this), !1), this.$controlsBtn.addEventListener("click", this.openModal.bind(this), !1), this.$playerBtn.addEventListener("click", this.playNes.bind(this), !1), this.$loudSpeaker.addEventListener("click", this.toggleLoudSpeaker.bind(this), !1), this.querySelector(".modal-body table thead").addEventListener("click", this.tapSwitchBtn.bind(this), !1), this.$gamepadList.addEventListener("click", this.tapSwitchBtn.bind(this), !1), this.$fullScreenBtn.addEventListener("click", this.tapFullScreenBtn.bind(this), !1), this.$refreshBtn.addEventListener("click", z, !1), document.addEventListener("keydown", this.handleKeydown.bind(this), !1), window.addEventListener("gamepadconnected", this.initGamepad.bind(this)), window.addEventListener("gamepaddisconnected", this.initGamepad.bind(this))
                }
            }, {
                key: "getDom",
                value: function () {
                    this.$nesTitle = this.querySelector(".nes-title"), this.$modalCloseBtn = this.querySelector(".modal-header .modal-close-btn"), this.$modalSaveBtn = this.querySelector(".modal-footer .modal-save-btn"), this.$controlsBtn = this.querySelector(".controls-btn"), this.$fullScreenBtn = this.querySelector(".full-screen-btn"), this.$refreshBtn = this.querySelector(".refresh-btn"), this.$playerBtn = this.querySelector(".start-btn"), this.$nesBtnGroup = this.querySelector(".nes-btn-group"), this.$loudSpeaker = this.querySelector(".nes-loud-speaker"), this.$canvas = this.querySelector("#nes-canvas"), this.$loading = this.querySelector(".f-loading"), this.$gamepadList = this.querySelector(".modal-box .gamepad-list")
                }
            }, {
                key: "initNes",
                value: function () {
                    var t = this;
                    this.rendesControls(), this.renderGamepadList(), this.renderTableHead(), this.renderNesTitle(), this.renderNesPreviewImage(), this.renderNes().then(function () {
                        t.isRenderNes = !0, t.toggleClass(t.$nesBtnGroup, "visible", "add")
                    })
                }
            }, {
                key: "initGamepad",
                value: function () {
                    var t = navigator.getGamepads();
                    this.listenPlayerKey[2] = null != t[0], this.listenPlayerKey[3] = null != t[1], this.renderTableHead(), this.renderGamepadList(), this.rendesControls()
                }
            }, {
                key: "initModal",
                value: function () {
                    // var t = window.f_common_lib.Vue.extend({
                    //     data: function () {
                    //         return {
                    //             dialogVisible: !1,
                    //             player1Value: !0,
                    //             player2Value: !0,
                    //             controlsData: []
                    //         }
                    //     },
                    //     methods: {
                    //         init: function () { },
                    //         closeModal: function () { }
                    //     },
                    //     created: function () {
                    //         this.init()
                    //     },
                    //     mounted: function () { }
                    // });
                    // this.modalInstance = (new t).$mount(".modal-box")
                }
            }, {
                key: "renderGamepadList",
                value: function () {
                    var t = this,
                        e = navigator.getGamepads(),
                        i = Array.from(e).filter(function (t) {
                            return null != t
                        }).map(function (e, i) {
                            i += 2;
                            var s = t.listenPlayerKey[i] ? "active" : "inactive",
                                r = t.listenPlayerKey[i] ? "禁用" : "启用";
                            return '\n        <li class="' + s + '" data-index="' + i + '">\n          <strong>Gamepad-' + e.index + ": </strong>" + e.id + '\n          <button class="gp-switch-btn" type="text">' + r + "</button>\n        </li>\n      "
                        }).join("");
                    this.$gamepadList.innerHTML = i
                }
            }, {
                key: "renderTableHead",
                value: function () {
                    var t = this,
                        e = [0, 1].map(function (e, i) {
                            return '\n        <th class="' + (t.listenPlayerKey[i] ? "active" : "inactive") + '" data-index="' + i + '">\n          Player ' + (i + 1) + '\n          <button type="text">' + (t.listenPlayerKey[i] ? "禁用" : "启用") + "</button>\n        </th>\n      "
                        }).join("");
                    this.querySelector(".modal-body thead tr").innerHTML = "<th>Button</th>" + e
                }
            }, {
                key: "rendesControls",
                value: function () {
                    var t = this,
                        e = this.keysArray.filter(function (t) {
                            return 1 === t.player
                        }),
                        i = this.keysArray.filter(function (t) {
                            return 2 === t.player
                        }),
                        s = {};
                    i.forEach(function (t) {
                        s[t.value] = t
                    }), this.querySelector(".modal-body table tbody").innerHTML = e.sort(function (t, e) {
                        return t.value > e.value ? 1 : e.value > t.value ? -1 : 0
                    }).map(function (e) {
                        var i = e.label,
                            r = e.key,
                            h = e.keyCode,
                            n = e.isPreventDefault,
                            a = void 0 !== n && n,
                            o = e.value,
                            l = e.player,
                            p = void 0 === l ? 1 : l,
                            u = s[o],
                            c = t.listenPlayerKey[0] ? "active" : "inactive",
                            d = t.listenPlayerKey[1] ? "active" : "inactive";
                        return "\n        <tr>\n          <td>" + i + '</td>\n          <td class="' + c + '" data-prevent-default="' + a + '" data-label="' + i + '" data-key="' + r + '" data-key-code="' + h + '" data-value="' + o + '" data-player="' + p + '">' + r + "</td>\n          " + (u ? '<td class="' + d + '" data-prevent-default="' + u.isPreventDefault + '" data-label="' + u.label + '" data-key="' + u.key + '" data-key-code="' + u.keyCode + '" data-value="' + u.value + '" data-player="' + u.player + '">' + u.key + "</td>" : '<td class="' + d + '"></td>') + "\n        </tr>\n      "
                    }).join("")
                }
            }, {
                key: "renderNesTitle",
                value: function () {
                    var t = this.dataset.presentableName;
                    this.$nesTitle.innerHTML = t
                }
            }, {
                key: "renderNesPreviewImage",
                value: function () {
                    var t = this.dataset.previewImage;
                    if (t) {
                        var e = document.createElement("img");
                        e.className = "visible", e.setAttribute("src", t), this.$nesBtnGroup.appendChild(e)
                    }
                }
            }, {
                key: "renderNes",
                value: async function () {
                    var widgetConfig = window.freelogApp.getSelfConfig();
                    console.log(widgetConfig)
                    var gameName = widgetConfig.getGame().gameName
                    var gameId = widgetConfig.getGame().gameId
                    console.log(gameName, gameId)
                    var t = this;
                    this.toggleClass(this.$loading, "visible", "add");
                    var e = this.dataset,
                        i = gameName || "魂斗罗"
                    const url = await window.freelogApp.getExhibitFileStream(gameId || '61e7b893f04747002e473d63', true)
                    // 'http://localhost:7107/Contra'
                    console.log(url)
                    return this.$nesTitle.innerHTML = i, Z(this.$canvas, url, !1).then(function () {
                        tt(t.defaultKeysMap), t.toggleClass(t.$loading, "visible", "delete")
                    }).catch(function (e) {
                        console.error(e), t.toggleClass(t.$loading, "visible", "delete")
                    })
                }
            }, {
                key: "initNesAudio",
                value: function () {
                    var t = function () {
                        var t = new window.AudioContext,
                            e = t.createScriptProcessor(F, 0, 2);
                        return e.onaudioprocess = $, e.connect(t.destination), [t, e]
                    }(),
                        e = it(t, 2),
                        i = e[0],
                        s = e[1];
                    at = i, ot = s, this.toggleLoudSpeaker(nt), this.toggleClass(this.$loudSpeaker, "visible", "add")
                }
            }, {
                key: "playNes",
                value: function () {
                    this.initNesAudio(), this.isPlayingNes = !0, Q ? Q = !0 : (Q = !0, j()), this.toggleClass(this.$nesBtnGroup, "visible", "delete")
                }
            }, {
                key: "tapSwitchBtn",
                value: function (t) {
                    if ("BUTTON" === t.target.nodeName) {
                        var e = +t.target.parentNode.dataset.index;
                        this.listenPlayerKey[e] = !this.listenPlayerKey[e], this.renderTableHead(), this.renderGamepadList(), this.rendesControls()
                    }
                }
            }, {
                key: "tapFullScreenBtn",
                value: function () {
                    h(this.$canvas)
                }
            }, {
                key: "handleKeydown",
                value: function (t) {
                    switch (t.which) {
                        case 13:
                            if (lt === this) {
                                if (this.isPlayingNes || !this.isRenderNes) break;
                                this.modalVisible || (this.playNes(), this.isPlayingNes = !0)
                            }
                    }
                    this.resetKey(t)
                }
            }, {
                key: "handleChangeKey",
                value: function (t) {
                    var e = t.target;
                    if (null != e.dataset.key) {
                        var i = this.querySelector("table .selected");
                        if (i) {
                            var s = i.dataset.key;
                            i.className = "", i.innerHTML = s
                        }
                        e.className = "selected", e.innerHTML = "Press key or button...", this.$targetSelectedDom = e, this.isChangingKey = !0
                    }
                }
            }, {
                key: "resetKey",
                value: function (t) {
                    if (this.isChangingKey) {
                        var e = this.$targetSelectedDom,
                            i = t.key,
                            s = t.which,
                            r = this.querySelector('[data-key-code="' + s + '"]');
                        null != r && (r.innerHTML = "", r.setAttribute("data-key", ""), r.setAttribute("data-key-code", "")), e.setAttribute("data-key", i), e.setAttribute("data-key-code", s), e.innerHTML = i, this.isChangingKey = !1
                    }
                }
            }, {
                key: "openModal",
                value: function () {
                    var t = this;
                    H(1), this.modalVisible = !0;
                    var e = this.querySelector(".modal-box"),
                        i = this.querySelector(".modal-box .modal"),
                        s = this.querySelector(".modal-box .modal-mask");
                    e.style.display = "block", setTimeout(function () {
                        t.toggleClass(i, "show", "add"), t.toggleClass(s, "show", "add")
                    })
                }
            }, {
                key: "closeModal",
                value: function () {
                    var t = this;
                    X(1), this.modalVisible = !1, this.isChangingKey = !1;
                    var e = this.querySelector(".modal-box"),
                        i = this.querySelector(".modal-box .modal"),
                        s = this.querySelector(".modal-box .modal-mask");
                    setTimeout(function () {
                        e.style.display = "none"
                    }, 200), this.toggleClass(i, "show", "delete"), this.toggleClass(s, "show", "delete");
                    var r = this.querySelector("table .selected");
                    if (r) {
                        var h = r.dataset.key;
                        r.className = "", r.innerHTML = h
                    }
                    this.listenPlayerKey = this.lastListenPlayerKey.slice(), this.renderTableHead(), this.renderGamepadList(), this.rendesControls(), this.defaultKeysMap = {}, this.keysArray.forEach(function (e) {
                        t.defaultKeysMap[e.key] = e
                    })
                }
            }, {
                key: "toggleClass",
                value: function (t, e, i) {
                    var s = t.classList;
                    s = new Set(s), "add" === i ? s.add(e) : "delete" === i ? s.delete(e) : s.has(e) ? s.delete(e) : s.add(e), t.className = [].concat(function (t) {
                        if (Array.isArray(t)) {
                            for (var e = 0, i = Array(t.length); e < t.length; e++) i[e] = t[e];
                            return i
                        }
                        return Array.from(t)
                    }(s)).join(" ")
                }
            }, {
                key: "saveKeyControls",
                value: function () {
                    var t = this,
                        e = Array.from(this.querySelectorAll("[data-label]"));
                    this.defaultKeysMap = {}, e.forEach(function (e) {
                        var i = e.dataset,
                            s = i.label,
                            r = i.key,
                            h = i.keyCode,
                            n = i.preventDefault,
                            a = i.value,
                            o = i.player;
                        s && (t.defaultKeysMap[r] = Object.assign({}, {
                            label: s,
                            key: r,
                            player: parseInt(o),
                            keyCode: parseInt(h),
                            isPreventDefault: "true" === n,
                            value: parseInt(a)
                        }))
                    }), this.keysArray = Object.values(this.defaultKeysMap), this.lastListenPlayerKey = this.listenPlayerKey.map(function (t, e) {
                        if (e < 2) {
                            var i = e + 1;
                            t ? X(i) : H(i)
                        } else {
                            var s = e - 1;
                            t ? function (t) {
                                m[t] = !0
                            }(s) : function (t) {
                                m[t] = !1
                            }(s)
                        }
                        return t
                    }), this.closeModal(), tt(this.defaultKeysMap), localStorage.setItem("DEFAULT_BUTTON_KEY_MAP", JSON.stringify(this.defaultKeysMap)), localStorage.setItem("DEFAULT_BUTTON_KEY_VERSION", "0.1.0")
                    // ,
                    //  window.f_common_lib.ElementUI.Message.success({
                    //     message: "按键设置保存成功！"
                    // })
                }
            }, {
                key: "toggleLoudSpeaker",
                value: function (t) {
                    null != at && ("object" == (void 0 === t ? "undefined" : et(t)) && (nt = !nt), nt ? (at.resume(), this.toggleClass(this.$loudSpeaker, "active", "add")) : (at.suspend(), this.toggleClass(this.$loudSpeaker, "active", "delete")))
                }
            }, {
                key: "disconnectedCallback",
                value: function () {
                    null != ot && (ot.disconnect(at.destination), ot = null), null != at && (at.suspend(), at = null), J()
                }
            }]), e
        }();
    customElements.define("freelog-single-jsnes", pt)
}]);