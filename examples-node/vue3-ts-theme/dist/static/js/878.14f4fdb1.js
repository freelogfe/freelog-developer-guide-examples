"use strict";(self["webpackJsonp_vue3-ts-theme"]=self["webpackJsonp_vue3-ts-theme"]||[]).push([[878],{1878:function(e,t,a){a.r(t),a.d(t,{default:function(){return v}});var i=a(5436),l=a(2689),s=a(9753),u=a(6132);const n={class:"p-40 w-100x h-100x y-auto"},r={class:""},c={class:"h-80 over-h"},o=["src"],d=(0,i.Lk)("div",{id:"freelog-game"},null,-1);var m=(0,i.pM)({__name:"ExhibitData",setup(e){let t=null;const a=(0,u.KR)([]),m=(0,u.KR)(""),g=(0,u.KR)("");s.Kb.getExhibitListByPaging({skip:0,limit:20,articleResourceTypes:"nesrom,红白机"}).then((async e=>{a.value=e.data.data.dataList,g.value=a.value[0].exhibitName,m.value=await s.Kb.getExhibitFileStream(a.value[0].exhibitId,{returnUrl:!0}),b(m.value,g.value)}));const v=async e=>{g.value=e.exhibitName,m.value=await s.Kb.getExhibitFileStream(e.exhibitId,{returnUrl:!0}),t.getApi().startGame(m.value,g.value)};(0,i.xo)((()=>{}));const b=async(e,a)=>{const i=await s.Kb.getExhibitListByPaging({articleResourceTypes:"插件",isLoadVersionProperty:1}),l=i.data.data?.dataList;l.forEach((async(i,l)=>{"nes-widget"===i.exhibitName&&(t=await s.Kb.mountWidget({widget:i,container:document.getElementById("freelog-game"),topExhibitData:null,config:{defaultGameUrl:e,defaultGameName:a},seq:void 0}))}))};return(e,t)=>{const s=(0,i.g2)("a-card"),u=(0,i.g2)("a-list-item"),m=(0,i.g2)("a-list");return(0,i.uX)(),(0,i.CE)("div",n,[(0,i.Lk)("div",r,[(0,i.bF)(m,{grid:{gutter:16,column:4},"data-source":a.value},{renderItem:(0,i.k6)((({item:e})=>[(0,i.bF)(u,null,{default:(0,i.k6)((()=>[(0,i.bF)(s,{title:e.exhibitName,onClick:t=>v(e),class:(0,l.C4)([e.exhibitName===g.value?"selected":""])},{default:(0,i.k6)((()=>[(0,i.Lk)("div",c,[(0,i.Lk)("img",{class:"h-100x",src:e.coverImages[0],alt:""},null,8,o)])])),_:2},1032,["title","onClick","class"])])),_:2},1024)])),_:1},8,["data-source"])]),d])}}});const g=m;var v=g}}]);
//# sourceMappingURL=878.14f4fdb1.js.map