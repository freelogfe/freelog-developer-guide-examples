(function(e,n){"object"===typeof exports&&"object"===typeof module?module.exports=n():"function"===typeof define&&define.amd?define([],n):"object"===typeof exports?exports["vue3-ts-theme-app"]=n():e["vue3-ts-theme-app"]=n()})(self,(function(){return function(){var e={3259:function(e,n,t){"use strict";t.r(n),t.d(n,{bootstrap:function(){return $},mount:function(){return V},unmount:function(){return X}});t(7714);var o=t(7823),l=t(7552);function a(e,n){const t=(0,l.up)("router-view");return(0,l.wg)(),(0,l.j4)(t)}var r=t(8081);const i={},u=(0,r.Z)(i,[["render",a]]);var s=u,c=t(7720);(0,c.z)("/service-worker.js",{ready(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered(){console.log("Service worker has been registered.")},cached(){console.log("Content has been cached for offline use.")},updatefound(){console.log("New content is downloading.")},updated(){console.log("New content is available; please refresh.")},offline(){console.log("No internet connection found. App is running in offline mode.")},error(e){console.error("Error during service worker registration:",e)}});var p=t(1653),f=t(1944),v=t(5498),d=t(893);const y={class:"flex-column pr-15"},g={class:"flex-row mb-10 space-between"},m=(0,l._)("div",{class:"fc-less"},"双击按键值进行设置",-1),w={class:"w-80 text-align-right mr-100 shrink-0"},b=["onClick"],_={class:"flex-column pr-15"},h={class:"flex-row mb-10 space-between"},K=(0,l._)("div",{class:"fc-less"},"双击按键值进行设置",-1),k={class:"w-80 text-align-right mr-100 shrink-0"},E=["onClick"];var O=(0,l.aZ)({__name:"SetKey",props:{visible:{type:Boolean},p1Keys:{},p2Keys:{}},emits:["cancel","save"],setup(e,{emit:n}){const t=e,o=(0,f.iH)("1"),a=(0,f.iH)(""),r=(0,f.iH)(""),i={UP:"KeyW",DOWN:"KeyS",LEFT:"KeyA",RIGHT:"KeyD",A:"KeyK",B:"KeyJ",C:"KeyI",D:"KeyU",SELECT:"Digit2",START:"Digit1"},u={UP:"ArrowUp",DOWN:"ArrowDown",LEFT:"ArrowLeft",RIGHT:"ArrowRight",A:"Numpad2",B:"Numpad1",C:"Numpad5",D:"Numpad4"},s=(0,f.iH)(Object.keys(i)),c=(0,f.iH)(Object.keys(u)),O=(0,f.qj)({...t.p1Keys}),D=(0,f.qj)({...t.p2Keys}),A=e=>{a.value=e},x=e=>{1===e&&Object.keys(O).forEach((e=>{O[e]=i[e]})),2===e&&Object.keys(D).forEach((e=>{D[e]=u[e]})),r.value="",a.value=""},C=(e,n)=>{if("1"===o.value){const t=Object.keys(O).some((n=>{if(O[n]===e.code)return!0}));if(t)return v.ZP.error({content:"玩家1按键重复",duration:2}),void(r.value="");O[n]=e.code}else{const t=Object.keys(D).some((n=>{if(D[n]===e.code)return!0}));if(t)return v.ZP.error({content:"按键重复",duration:2}),void(r.value="");D[n]=e.code}r.value="",a.value=""},S=(0,f.iH)({});let j={};d.freelogApp.getUserData("nesKeys").then((e=>{j=e||{},S.value=e||{}}));const H=async(e,n)=>{await d.freelogApp.setUserData("nesKeys",{...j,...n})},T=async e=>{console.log(O,D),H("nesKeys",{p1Keys:{...O},p2Keys:{...D}}),n("save")},U=e=>{console.log(e),n("cancel")};return(e,n)=>{const i=(0,l.up)("a-button"),u=(0,l.up)("a-input"),f=(0,l.up)("a-tab-pane"),v=(0,l.up)("a-tabs"),d=(0,l.up)("a-modal");return(0,l.wg)(),(0,l.j4)(d,{visible:t.visible,width:800,title:"按键设置",onOk:T,onCancel:U,okText:"保存",cancelText:"取消"},{default:(0,l.w5)((()=>[(0,l.Wm)(v,{activeKey:o.value,"onUpdate:activeKey":n[2]||(n[2]=e=>o.value=e),onChange:n[3]||(n[3]=e=>a.value="")},{default:(0,l.w5)((()=>[(0,l.Wm)(f,{key:"1",tab:"玩家1"},{default:(0,l.w5)((()=>[(0,l._)("div",y,[(0,l._)("div",g,[m,(0,l.Wm)(i,{type:"primary",class:"mr-20 w-100",onClick:n[0]||(n[0]=e=>x(1))},{default:(0,l.w5)((()=>[(0,l.Uk)("恢复默认")])),_:1})]),((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(s.value,(e=>((0,l.wg)(),(0,l.iD)("div",{key:e,class:"flex-row bb-1 py-8"},[(0,l._)("div",w,(0,p.zw)(e)+"： ",1),a.value===e&&"1"==o.value?((0,l.wg)(),(0,l.j4)(u,{key:0,placeholder:"请按下想要设置的键",value:r.value,onKeyup:n=>C(n,e)},null,8,["value","onKeyup"])):((0,l.wg)(),(0,l.iD)("div",{key:1,class:"brs-4 b-1 px-10 py-4 cur-pointer",onClick:n=>A(e)},(0,p.zw)(O[e]),9,b))])))),128))])])),_:1}),(0,l.Wm)(f,{key:"2",tab:"玩家2","force-render":""},{default:(0,l.w5)((()=>[(0,l._)("div",_,[(0,l._)("div",h,[K,(0,l.Wm)(i,{type:"primary",class:"mr-20 w-100",onClick:n[1]||(n[1]=e=>x(2))},{default:(0,l.w5)((()=>[(0,l.Uk)("恢复默认")])),_:1})]),((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(c.value,(e=>((0,l.wg)(),(0,l.iD)("div",{key:e,class:"flex-row bb-1 py-8"},[(0,l._)("div",k,(0,p.zw)(e)+"： ",1),a.value===e&&"2"==o.value?((0,l.wg)(),(0,l.j4)(u,{key:0,placeholder:"请按下想要设置的键",value:r.value,onKeyup:n=>C(n,e)},null,8,["value","onKeyup"])):((0,l.wg)(),(0,l.iD)("div",{key:1,class:"brs-4 b-1 px-10 py-4 cur-pointer",onClick:n=>A(e)},(0,p.zw)(D[e]),9,E))])))),128))])])),_:1})])),_:1},8,["activeKey"])])),_:1},8,["visible"])}}});const D=O;var A=D,x=t(5598),C=t(5348);const S=d.freelogApp?.getSelfConfig().defaultGameUrl||{},j=d.freelogApp?.getSelfConfig().defaultGameName||{},H=(0,C.Q_)("game",{state:()=>({url:S,gameName:j}),actions:{setUrl(e,n){this.url=e,this.gameName=n}}}),T={class:"home w-100x h-100x flex-column"},U={class:"flex-column-center w-100x"},N={class:"flex-row pt-40 space-between w-800 mb-10"},G={class:"flex-row"},P={class:"f-title-3 mr-60"},W={class:"flex-row"};var R=(0,l.aZ)({__name:"HomeView",setup(e){const n=(0,f.iH)(100),t=(0,f.iH)(800),o=(0,f.iH)(700),a=(0,f.iH)(!1),r=(0,f.iH)(!1),i=(0,f.iH)(null),u=(0,f.iH)(null),s=H(),c=(0,f.iH)(s.url),v=(0,f.iH)(s.gameName);(0,l.YP)((()=>s.url),(e=>{console.log(23423424,e),c.value=e,v.value=s.gameName}));const y={UP:"KeyW",DOWN:"KeyS",LEFT:"KeyA",RIGHT:"KeyD",A:"KeyK",B:"KeyJ",C:"KeyI",D:"KeyU",SELECT:"Digit2",START:"Digit1"},g={UP:"ArrowUp",DOWN:"ArrowDown",LEFT:"ArrowLeft",RIGHT:"ArrowRight",A:"Numpad2",B:"Numpad1",C:"Numpad5",D:"Numpad4"},m=(0,f.iH)({...y}),w=(0,f.iH)({...g}),b=()=>{i?.value?.blur()};function _(){d.freelogApp.getUserData("nesKeys").then((e=>{e&&e.p1Keys&&(m.value={...e.p1Keys}),e&&e.p2Keys&&(w.value={...e.p2Keys}),a.value=!1}))}function h(){r.value=!r.value}function K(){console.log(u.value.$el),u.value.$el.getElementsByTagName("canvas")[0].requestFullscreen()}return d.freelogApp.getUserData("nesKeys").then((e=>{e&&e.p1Keys&&(m.value={...e.p1Keys}),e&&e.p2Keys&&(w.value={...e.p2Keys})})),(e,s)=>{const d=(0,l.up)("a-slider"),y=(0,l.up)("a-button");return(0,l.wg)(),(0,l.iD)("div",T,[(0,l._)("div",U,[(0,l._)("div",N,[(0,l._)("div",G,[(0,l.Wm)(d,{autofocus:!1,class:"w-160 mr-10",value:n.value,"onUpdate:value":s[0]||(s[0]=e=>n.value=e),ref_key:"slider",ref:i,onAfterChange:b,disabled:r.value},null,8,["value","disabled"]),(0,l.Wm)(y,{type:"primary",class:"mr-20",onClick:h},{default:(0,l.w5)((()=>[(0,l.Uk)((0,p.zw)(r.value?"打开声音":"关闭声音"),1)])),_:1})]),(0,l._)("div",P,(0,p.zw)(v.value),1),(0,l._)("div",W,[(0,l.Wm)(y,{type:"primary",class:"mr-20",onClick:s[1]||(s[1]=e=>a.value=!0)},{default:(0,l.w5)((()=>[(0,l.Uk)("设置按键")])),_:1}),(0,l.Wm)(y,{type:"primary",onClick:K},{default:(0,l.w5)((()=>[(0,l.Uk)("全屏")])),_:1})])])]),c.value?((0,l.wg)(),(0,l.j4)((0,f.SU)(x.Ql),{key:0,width:t.value,height:o.value,gain:r.value?0:n.value,ref_key:"nes",ref:u,label:"点击开始游戏",p1:m.value,p2:w.value,url:c.value},null,8,["width","height","gain","p1","p2","url"])):(0,l.kq)("",!0),a.value?((0,l.wg)(),(0,l.j4)(A,{key:1,visible:a.value,onCancel:s[2]||(s[2]=e=>a.value=!1),onSave:_,p1Keys:m.value,p2Keys:w.value},null,8,["visible","p1Keys","p2Keys"])):(0,l.kq)("",!0)])}}});const L=R;var B=L;const F=[{path:"/",name:"home",component:B}];var I=F,q=t(5742),z=t(7174);t(6068);window.FREELOG_RESOURCENAME="snnaenu/插件开发演示代码主题";let Y=null,Z=null,J=null;function M(e={}){const{container:n}=e;Z=(0,q.p7)({history:(0,q.PO)(window.__POWERED_BY_FREELOG__?"/widget":"/"),routes:I}),J=(0,o.ri)(s),Y=(0,C.WB)(),J.use(Z),J.use(Y).use(z.ZP),J.mount(n?n.querySelector("#app"):"#app"),e?.registerApi&&e.registerApi({startGame:(e,n)=>{const t=H();t.setUrl(e,n)}})}async function $(){console.log("%c ","color: green;","vue3.0 app bootstraped")}function Q(e){e.onGlobalStateChange&&e.onGlobalStateChange(((n,t)=>console.log(`[插件 - ${e.name}]:`,n,t)),!0),setTimeout((()=>{e.setGlobalState({ignore:e.name+"111",user:{name:e.name+"111"}})}),2500),e.setGlobalState&&e.setGlobalState({ignore:e.name,user:{name:e.name}})}async function V(e){Q(e),M(e),J.config.globalProperties.$onGlobalStateChange=e.onGlobalStateChange,J.config.globalProperties.$setGlobalState=e.setGlobalState}async function X(){J.unmount(),J._container.innerHTML="",J=null,Z=null,Y=null}window.__POWERED_BY_FREELOG__||M()},7714:function(e,n,t){window.__POWERED_BY_FREELOG__&&(t.p=window.__INJECTED_PUBLIC_PATH_BY_FREELOG__)}},n={};function t(o){var l=n[o];if(void 0!==l)return l.exports;var a=n[o]={exports:{}};return e[o].call(a.exports,a,a.exports,t),a.exports}t.m=e,function(){var e=[];t.O=function(n,o,l,a){if(!o){var r=1/0;for(c=0;c<e.length;c++){o=e[c][0],l=e[c][1],a=e[c][2];for(var i=!0,u=0;u<o.length;u++)(!1&a||r>=a)&&Object.keys(t.O).every((function(e){return t.O[e](o[u])}))?o.splice(u--,1):(i=!1,a<r&&(r=a));if(i){e.splice(c--,1);var s=l();void 0!==s&&(n=s)}}return n}a=a||0;for(var c=e.length;c>0&&e[c-1][2]>a;c--)e[c]=e[c-1];e[c]=[o,l,a]}}(),function(){t.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(n,{a:n}),n}}(),function(){t.d=function(e,n){for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})}}(),function(){t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)}}(),function(){t.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){t.p="/"}(),function(){var e={143:0};t.O.j=function(n){return 0===e[n]};var n=function(n,o){var l,a,r=o[0],i=o[1],u=o[2],s=0;if(r.some((function(n){return 0!==e[n]}))){for(l in i)t.o(i,l)&&(t.m[l]=i[l]);if(u)var c=u(t)}for(n&&n(o);s<r.length;s++)a=r[s],t.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return t.O(c)},o=self["webpackJsonp_vue3-ts-theme"]=self["webpackJsonp_vue3-ts-theme"]||[];o.forEach(n.bind(null,0)),o.push=n.bind(null,o.push.bind(o))}();var o=t.O(void 0,[998],(function(){return t(3259)}));return o=t.O(o),o}()}));
//# sourceMappingURL=app.f1a6815b.js.map