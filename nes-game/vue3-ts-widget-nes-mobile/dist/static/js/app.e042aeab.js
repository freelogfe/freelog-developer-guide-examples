(function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["vue3-ts-theme-app"]=t():e["vue3-ts-theme-app"]=t()})(self,(function(){return function(){var e={661:function(e,t,n){"use strict";n.r(t),n.d(t,{bootstrap:function(){return J},mount:function(){return q},unmount:function(){return z}});n(159);var o=n(555),a=n(370);function i(e,t){const n=(0,a.up)("router-view");return(0,a.wg)(),(0,a.j4)(n)}var r=n(565);const c={},u=(0,r.Z)(c,[["render",i]]);var s=u,l=n(913);(0,l.z)("/service-worker.js",{ready(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered(){console.log("Service worker has been registered.")},cached(){console.log("Content has been cached for offline use.")},updatefound(){console.log("New content is downloading.")},updated(){console.log("New content is available; please refresh.")},offline(){console.log("No internet connection found. App is running in offline mode.")},error(e){console.error("Error during service worker registration:",e)}});var d=n(369),p=n(50),v=n(378),_=n(868),y=n(321);const f=_.freelogApp.getSelfConfig().defaultGameUrl||"https://192.168.2.122:8002/rom/飞龙之拳3(J).nes",m=_.freelogApp.getSelfConfig().defaultGameName||"无游戏",h=(0,y.Q_)("game",{state:()=>({url:f,gameName:m}),actions:{setUrl(e,t){this.url=e,this.gameName=t}}});var b=n(722),w=n(756);const g={class:"home w-100x h-100x flex-row nes-container justify-center",id:"nes-container"},k={id:"psp",class:"flex-column h-100x align-center p-absolute lt-0 w-192"},E=["onTouchstart","onTouchend","onTouchmove"],T=["data-key","data-key2"],j=["data-key","data-key2"],A=["data-key","data-key2"],x=["data-key","data-key2"],O=["data-key"],S=["data-key"],C=["data-key"],K=["data-key"],G={class:"p-absolute rt-0 w-192 mt-10 flex-column align-center h-100x space-between"},M={class:"joystickpad flex-column align-center w-100x pb-10 lh-62 mb-10"},P={class:"flex-row mt-14"},H={class:"flex-row mt-14"},N=["onTouchmove"];var R=(0,a.aZ)({__name:"HomeView",setup(e){const t=(0,d.iH)(100),n=(0,d.iH)("107vmin"),i=(0,d.iH)("100vmin"),r=(0,d.iH)(!1),c=((0,d.iH)(null),(0,d.iH)(null)),u=(0,d.iH)([]),s=(0,d.iH)(!1),l=h(),y=(0,d.iH)(l.url),f=(0,d.iH)(l.gameName);(0,a.YP)((()=>l.url),(e=>{y.value=e,f.value=l.gameName}));const m=()=>{c.value.reset()},R={UP:"KeyW",DOWN:"KeyS",LEFT:"KeyA",RIGHT:"KeyD",A:"KeyK",B:"KeyJ",C:"KeyI",D:"KeyU",SELECT:"Digit2",START:"Digit1"},B={UP:"ArrowUp",DOWN:"ArrowDown",LEFT:"ArrowLeft",RIGHT:"ArrowRight",A:"Numpad2",B:"Numpad1",C:"Numpad5",D:"Numpad4"},D=(0,d.iH)({...R}),F=(0,d.iH)({...B});function L(){r.value=!r.value}function U(){c.value.pause(),_.freelogApp.getSelfConfig()?.showList()}function W(){b.Z.isEnabled?(b.Z.toggle(),s.value=!s.value):(0,w.CF)("当前浏览器不支持全屏")}function I(e){let t=e.targetTouches[0],n=document.elementFromPoint(t.pageX,t.pageY);const o=n?.getAttribute("data-key"),a=n?.getAttribute("data-key2");o&&(u.value=[o],document.dispatchEvent(new KeyboardEvent("keydown",{code:o}))),a&&(u.value=[o,a],document.dispatchEvent(new KeyboardEvent("keydown",{code:a})))}function Y(e){u.value.forEach((e=>{document.dispatchEvent(new KeyboardEvent("keyup",{code:e}))}))}function X(e){let t=e.targetTouches[0],n=document.elementFromPoint(t.pageX,t.pageY);const o=n?.getAttribute("data-key"),a=n?.getAttribute("data-key2");u.value.forEach((e=>{[o,a].includes(e)||document.dispatchEvent(new KeyboardEvent("keyup",{code:e}))})),o&&(u.value=[o],document.dispatchEvent(new KeyboardEvent("keydown",{code:o}))),a&&(u.value=[o,a],document.dispatchEvent(new KeyboardEvent("keydown",{code:a})))}function J(e){let t=e.targetTouches[0],n=document.elementFromPoint(t.pageX+t.radiusX,t.pageY);const o=document.getElementById("joystick_btn_A");n==o?(u.value.push(R.A),document.dispatchEvent(new KeyboardEvent("keydown",{code:R.A}))):u.value.includes(R.A)&&document.dispatchEvent(new KeyboardEvent("keyup",{code:R.A}))}function Z(e){u.value=[e],document.dispatchEvent(new KeyboardEvent("keydown",{code:e}))}function q(e){u.value.forEach((e=>{document.dispatchEvent(new KeyboardEvent("keyup",{code:e}))})),u.value=[]}function z(){document.dispatchEvent(new KeyboardEvent("keydown",{code:R.A})),document.dispatchEvent(new KeyboardEvent("keydown",{code:R.B}))}function $(){document.dispatchEvent(new KeyboardEvent("keyup",{code:R.A})),document.dispatchEvent(new KeyboardEvent("keyup",{code:R.B}))}return(e,u)=>((0,a.wg)(),(0,a.iD)("div",g,[(0,a._)("div",k,[(0,a._)("div",{id:"joystick_btn_menu",onClick:U,class:"left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mt-5"}," 返回列表 "),(0,a._)("div",{id:"joystick_btn_menu",onClick:m,class:"left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mt-10"}," 重新开始 "),(0,a._)("div",{id:"joystick_btn_choice",class:"left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mt-10",onTouchstart:u[0]||(u[0]=(0,o.iM)((e=>Z(R.SELECT)),["prevent"])),onTouchend:u[1]||(u[1]=(0,o.iM)((e=>q(R.SELECT)),["prevent"]))}," 选择 ",32),(0,a._)("div",{id:"joystick_btn_start",class:"left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mt-10",onTouchstart:u[2]||(u[2]=(0,o.iM)((e=>Z(R.START)),["prevent"])),onTouchend:u[3]||(u[3]=(0,o.iM)((e=>q(R.START)),["prevent"]))}," 开始 ",32),(0,a._)("div",{class:"interaction-area w-172 h-172 lb-0 ml-10 mb-10",id:"steeringWheel",onTouchstart:(0,o.iM)(I,["prevent"]),onTouchend:(0,o.iM)(Y,["prevent"]),onTouchmove:(0,o.iM)(X,["prevent"]),style:{opacity:"0.8"}},[(0,a._)("div",{class:"darrow w-52 h-62 ml-112",id:"joystick_rightup","data-key":R.RIGHT,"data-key2":R.UP},null,8,T),(0,a._)("div",{class:"darrow w-52 h-62 ml-10",id:"joystick_leftup","data-key":R.LEFT,"data-key2":R.UP},null,8,j),(0,a._)("div",{class:"darrow w-52 h-62 mt-10 ml-10 mt-106",id:"joystick_leftdown","data-key":R.LEFT,"data-key2":R.DOWN},null,8,A),(0,a._)("div",{class:"darrow w-52 h-62 mt-10 ml-108 mt-110",id:"joystick_rightdown","data-key":R.RIGHT,"data-key2":R.DOWN},null,8,x),(0,a._)("button",{id:"joystick_up",class:"arrow w-52 h-60 ml-8 mt-2","data-key":R.UP}," ▵ ",8,O),(0,a._)("button",{id:"joystick_left",class:"arrow w-52 h-60 mt-10","data-key":R.LEFT}," ▵ ",8,S),(0,a._)("button",{id:"joystick_right","data-key":R.RIGHT,class:"arrow w-52 h-60 mt-10"}," ▵ ",8,C),(0,a._)("button",{id:"joystick_down","data-key":R.DOWN,class:"arrow w-52 h-60 ml-8"}," ▵ ",8,K)],40,E)]),y.value?((0,a.wg)(),(0,a.j4)((0,d.SU)(v.Ql),{key:0,width:n.value,height:i.value,gain:r.value?0:t.value,ref_key:"nes",ref:c,label:"点击开始游戏",p1:D.value,p2:F.value,url:y.value},null,8,["width","height","gain","p1","p2","url"])):(0,a.kq)("",!0),(0,a._)("div",G,[(0,a._)("div",null,[(0,a._)("div",{id:"joystick_btn_start",onClick:W,class:"left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mb-20"},(0,p.zw)(s.value?"退出全屏":"全屏"),1),(0,a._)("div",{id:"joystick_btn_start",onClick:L,class:"left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mb-10"},(0,p.zw)(r.value?"打开声音":"关闭声音"),1)]),(0,a._)("div",M,[(0,a._)("div",P,[(0,a._)("div",{id:"joystick_btn_Y",class:"xbutton joystick_btn_op_2 w-62 h-62 mr-10",onTouchstart:u[4]||(u[4]=(0,o.iM)((e=>Z(R.D)),["prevent"])),onTouchend:u[5]||(u[5]=(0,o.iM)((e=>q(R.D)),["prevent","prevent"]))}," Y ",32),(0,a._)("div",{id:"joystick_btn_X",class:"xbutton joystick_btn_op_2 w-62 h-62",onTouchstart:u[6]||(u[6]=(0,o.iM)((e=>Z(R.C)),["prevent"])),onTouchend:u[7]||(u[7]=(0,o.iM)((e=>q(R.C)),["prevent"]))}," X ",32)]),(0,a._)("div",H,[(0,a._)("div",{id:"joystick_btn_B",class:"xbutton joystick_btn_op_2 w-62 h-62 mr-10",onTouchstart:u[8]||(u[8]=(0,o.iM)((e=>Z(R.B)),["prevent"])),onTouchend:u[9]||(u[9]=(0,o.iM)((e=>q(R.B)),["prevent"])),onTouchmove:(0,o.iM)(J,["prevent"])}," B ",40,N),(0,a._)("div",{id:"joystick_btn_A",class:"xbutton joystick_btn_op_2 w-62 h-62",onTouchstart:u[10]||(u[10]=(0,o.iM)((e=>Z(R.A)),["prevent"])),onTouchend:u[11]||(u[11]=(0,o.iM)((e=>q(R.A)),["prevent"]))}," A ",32)]),(0,a._)("div",{id:"joystick_btn_AB",class:"xbutton joystick_btn_op_2 w-62 h-62 mt-10",onTouchstart:u[12]||(u[12]=(0,o.iM)((e=>z()),["prevent"])),onTouchend:u[13]||(u[13]=(0,o.iM)((e=>$()),["prevent"]))}," AB ",32)])])]))}});const B=(0,r.Z)(R,[["__scopeId","data-v-77636e50"]]);var D=B;const F=[{path:"/",name:"home",component:D}];var L=F,U=n(297);window.FREELOG_RESOURCENAME="snnaenu/插件开发演示代码主题";let W=null,I=null,Y=null;function X(e={}){const{container:t}=e;I=(0,U.p7)({history:(0,U.PO)(window.__MICRO_APP_ENVIRONMENT__?"/widget":"/"),routes:L}),Y=(0,o.ri)(s),W=(0,y.WB)(),Y.use(I),Y.use(W),Y.mount(t?t.querySelector("#app"):"#app"),e?.registerApi&&e.registerApi({startGame:(e,t)=>{const n=h();n.setUrl(e,t)}})}async function J(){console.log("%c ","color: green;","vue3.0 app bootstraped")}function Z(e){e.onGlobalStateChange&&e.onGlobalStateChange(((t,n)=>console.log(`[插件 - ${e.name}]:`,t,n)),!0),setTimeout((()=>{e.setGlobalState({ignore:e.name+"111",user:{name:e.name+"111"}})}),2500),e.setGlobalState&&e.setGlobalState({ignore:e.name,user:{name:e.name}})}async function q(e){Z(e),X(e),Y.config.globalProperties.$onGlobalStateChange=e.onGlobalStateChange,Y.config.globalProperties.$setGlobalState=e.setGlobalState}async function z(){Y.unmount(),Y._container.innerHTML="",Y=null,I=null,W=null}window.__MICRO_APP_ENVIRONMENT__||X()},159:function(e,t,n){window.__MICRO_APP_ENVIRONMENT__&&(n.p=window.__MICRO_APP_PUBLIC_PATH__)}},t={};function n(o){var a=t[o];if(void 0!==a)return a.exports;var i=t[o]={exports:{}};return e[o](i,i.exports,n),i.exports}n.m=e,function(){var e=[];n.O=function(t,o,a,i){if(!o){var r=1/0;for(l=0;l<e.length;l++){o=e[l][0],a=e[l][1],i=e[l][2];for(var c=!0,u=0;u<o.length;u++)(!1&i||r>=i)&&Object.keys(n.O).every((function(e){return n.O[e](o[u])}))?o.splice(u--,1):(c=!1,i<r&&(r=i));if(c){e.splice(l--,1);var s=a();void 0!==s&&(t=s)}}return t}i=i||0;for(var l=e.length;l>0&&e[l-1][2]>i;l--)e[l]=e[l-1];e[l]=[o,a,i]}}(),function(){n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.p="/"}(),function(){var e={143:0};n.O.j=function(t){return 0===e[t]};var t=function(t,o){var a,i,r=o[0],c=o[1],u=o[2],s=0;if(r.some((function(t){return 0!==e[t]}))){for(a in c)n.o(c,a)&&(n.m[a]=c[a]);if(u)var l=u(n)}for(t&&t(o);s<r.length;s++)i=r[s],n.o(e,i)&&e[i]&&e[i][0](),e[r[s]]=0;return n.O(l)},o=self["webpackJsonp_vue3-ts-theme"]=self["webpackJsonp_vue3-ts-theme"]||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var o=n.O(void 0,[998],(function(){return n(661)}));return o=n.O(o),o}()}));
//# sourceMappingURL=app.e042aeab.js.map