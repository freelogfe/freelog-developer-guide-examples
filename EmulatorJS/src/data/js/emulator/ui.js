/**
 * EmulatorJS - UI Module
 * This module provides functions for creating and managing UI elements
 */

import { createElement, addEventListener, removeEventListener } from './utils.js';

// 设置颜色
export function setColor(emulatorState, color) {
  if (typeof color !== "string") color = "";
  
  let getColor = function (color) {
    color = color.toLowerCase();
    if (color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)) {
      if (color.length === 4) {
        let rv = "#";
        for (let i = 1; i < 4; i++) {
          rv += color.slice(i, i + 1) + color.slice(i, i + 1);
        }
        color = rv;
      }
      let rv = [];
      for (let i = 1; i < 7; i += 2) {
        rv.push(parseInt("0x" + color.slice(i, i + 2), 16));
      }
      return rv.join(", ");
    }
    return null;
  }
  
  if (!color || getColor(color) === null) {
    emulatorState.elements.parent.setAttribute("style", "--ejs-primary-color: 26,175,255;");
    return;
  }
  
  emulatorState.elements.parent.setAttribute("style", "--ejs-primary-color:" + getColor(color) + ";");
}

// 设置广告
export function setupAds(emulatorState, ads, width, height) {
  const div = createElement("div");
  const time = (typeof emulatorState.config.adMode === "number" && emulatorState.config.adMode > -1 && emulatorState.config.adMode < 3) ? emulatorState.config.adMode : 2;
  div.classList.add("ejs_ad_iframe");
  
  const frame = createElement("iframe");
  frame.src = ads;
  frame.setAttribute("scrolling", "no");
  frame.setAttribute("frameborder", "no");
  frame.style.width = width;
  frame.style.height = height;
  
  const closeParent = createElement("div");
  closeParent.classList.add("ejs_ad_close");
  
  const closeButton = createElement("a");
  closeParent.appendChild(closeButton);
  closeParent.setAttribute("hidden", "");
  
  div.appendChild(closeParent);
  div.appendChild(frame);
  
  if (emulatorState.config.adMode !== 1) {
    emulatorState.elements.parent.appendChild(div);
  }
  
  addEventListener(closeButton, "click", () => {
    div.remove();
  });
  
  // 添加事件监听器
  if (!emulatorState.eventListeners) emulatorState.eventListeners = {};
  if (!Array.isArray(emulatorState.eventListeners["start-clicked"])) {
    emulatorState.eventListeners["start-clicked"] = [];
  }
  
  emulatorState.eventListeners["start-clicked"].push(() => {
    if (emulatorState.config.adMode === 0) div.remove();
    if (emulatorState.config.adMode === 1) {
      emulatorState.elements.parent.appendChild(div);
    }
  });
  
  // 添加启动事件监听器
  if (!Array.isArray(emulatorState.eventListeners.start)) {
    emulatorState.eventListeners.start = [];
  }
  
  emulatorState.eventListeners.start.push(() => {
    closeParent.removeAttribute("hidden");
    const time = (typeof emulatorState.config.adTimer === "number" && emulatorState.config.adTimer > 0) ? emulatorState.config.adTimer : 10000;
    if (emulatorState.config.adTimer === -1) div.remove();
    if (emulatorState.config.adTimer === 0) return;
    setTimeout(() => {
      div.remove();
    }, time);
  });
}

// 广告被阻止处理
export function adBlocked(emulatorState, url, del) {
  if (del) {
    try {
      document.querySelector('div[class="ejs_ad_iframe"]').remove();
    } catch (e) { }
  } else {
    try {
      document.querySelector('div[class="ejs_ad_iframe"]').remove();
    } catch (e) { }
  }
  emulatorState.config.adUrl = url;
  setupAds(emulatorState, emulatorState.config.adUrl, emulatorState.config.adSize[0], emulatorState.config.adSize[1]);
}

// 设置元素
export function setElements(emulatorState, element) {
  const game = createElement("div");
  const elem = document.querySelector(element);
  elem.innerHTML = "";
  elem.appendChild(game);
  emulatorState.game = game;
  
  emulatorState.elements = {
    main: emulatorState.game,
    parent: elem
  };
  
  emulatorState.elements.parent.classList.add("ejs_parent");
  emulatorState.elements.parent.setAttribute("tabindex", -1);
}

// 创建开始按钮
export function createStartButton(emulatorState, localization, startButtonClicked) {
  const button = createElement("div");
  button.classList.add("ejs_start_button");
  
  let border = 0;
  if (typeof emulatorState.config.backgroundImg === "string") {
    button.classList.add("ejs_start_button_border");
    border = 1;
  }
  
  button.innerText = (typeof emulatorState.config.startBtnName === "string") ? emulatorState.config.startBtnName : localization("Start Game");
  
  if (emulatorState.config.alignStartButton == "top") {
    button.style.bottom = "calc(100% - 20px)";
  } else if (emulatorState.config.alignStartButton == "center") {
    button.style.bottom = "calc(50% + 22.5px + " + border + "px)";
  }
  
  emulatorState.elements.parent.appendChild(button);
  
  addEventListener(button, "touchstart", () => {
    emulatorState.touch = true;
  });
  
  addEventListener(button, "click", function(e) {
    startButtonClicked(emulatorState, e, localization);
  });
  
  if (emulatorState.config.startOnLoad === true) {
    startButtonClicked(emulatorState, { preventDefault: function() {}, target: button }, localization);
  }
  
  // 触发就绪事件
  setTimeout(() => {
    if (emulatorState.eventListeners && Array.isArray(emulatorState.eventListeners.ready)) {
      emulatorState.eventListeners.ready.forEach(callback => callback());
    }
  }, 20);
}

// 创建文本元素
export function createText(emulatorState, localization) {
  emulatorState.textElem = createElement("div");
  emulatorState.textElem.classList.add("ejs_loading_text");
  if (typeof emulatorState.config.backgroundImg === "string") {
    emulatorState.textElem.classList.add("ejs_loading_text_glow");
  }
  emulatorState.textElem.innerText = localization("Loading...");
  emulatorState.elements.parent.appendChild(emulatorState.textElem);
}

// 本地化文本
export function localization(text, emulatorState, log = true) {
  if (typeof text === "undefined" || text.length === 0) return;
  text = text.toString();
  if (text.includes("EmulatorJS v")) return text;
  
  if (emulatorState.config.langJson) {
    if (!emulatorState.config.langJson[text] && log) {
      if (!emulatorState.missingLang) emulatorState.missingLang = [];
      if (!emulatorState.missingLang.includes(text)) {
        emulatorState.missingLang.push(text);
      }
      console.log(`Translation not found for '${text}'. Language set to '${emulatorState.config.language}'`);
    }
    return emulatorState.config.langJson[text] || text;
  }
  
  return text;
}

// 显示消息
export function displayMessage(emulatorState, message, time) {
  if (!emulatorState.msgElem) {
    emulatorState.msgElem = createElement("div");
    emulatorState.msgElem.classList.add("ejs_message");
    emulatorState.elements.parent.appendChild(emulatorState.msgElem);
  }
  
  clearTimeout(emulatorState.msgTimeout);
  emulatorState.msgTimeout = setTimeout(() => {
    emulatorState.msgElem.innerText = "";
  }, (typeof time === "number" && time > 0) ? time : 3000);
  
  emulatorState.msgElem.innerText = message;
}