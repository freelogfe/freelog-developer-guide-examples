/**
 * EmulatorJS UI Manager Module
 * 处理用户界面创建和管理功能
 */

export class UIManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.currentPopup = null;
    }

    /**
     * 设置元素
     */
    setElements(element) {
        const game = this.emulator.createElement("div");
        const elem = document.querySelector(element);
        elem.innerHTML = "";
        elem.appendChild(game);
        this.emulator.game = game;

        this.emulator.elements = {
            main: this.emulator.game,
            parent: elem
        }
        this.emulator.elements.parent.classList.add("ejs_parent");
        this.emulator.elements.parent.setAttribute("tabindex", -1);
    }

    /**
     * 创建开始按钮
     */
    createStartButton() {
        const button = this.emulator.createElement("div");
        button.classList.add("ejs_start_button");
        let border = 0;
        if (typeof this.emulator.config.backgroundImg === "string") {
            button.classList.add("ejs_start_button_border");
            border = 1;
        }
        button.innerText = (typeof this.emulator.config.startBtnName === "string") ? this.emulator.config.startBtnName : this.emulator.localization("Start Game");
        if (this.emulator.config.alignStartButton == "top") {
            button.style.bottom = "calc(100% - 20px)";
        } else if (this.emulator.config.alignStartButton == "center") {
            button.style.bottom = "calc(50% + 22.5px + " + border + "px)";
        }
        this.emulator.elements.parent.appendChild(button);
        this.emulator.addEventListener(button, "touchstart", () => {
            this.emulator.touch = true;
        })
        this.emulator.addEventListener(button, "click", this.emulator.startButtonClicked.bind(this.emulator));
        if (this.emulator.config.startOnLoad === true) {
            this.emulator.startButtonClicked(button);
        }
        setTimeout(() => {
            this.emulator.callEvent("ready");
        }, 20);
    }

    /**
     * 创建文本元素
     */
    createText() {
        this.emulator.textElem = this.emulator.createElement("div");
        this.emulator.textElem.classList.add("ejs_loading_text");
        if (typeof this.emulator.config.backgroundImg === "string") this.emulator.textElem.classList.add("ejs_loading_text_glow");
        this.emulator.textElem.innerText = this.emulator.localization("Loading...");
        this.emulator.elements.parent.appendChild(this.emulator.textElem);
    }

    /**
     * 本地化文本
     */
    localization(text, log) {
        if (typeof text === "undefined" || text.length === 0) return;
        text = text.toString();
        if (text.includes("EmulatorJS v")) return text;
        if (this.emulator.config.langJson) {
            if (typeof log === "undefined") log = true;
            if (!this.emulator.config.langJson[text] && log) {
                if (!this.emulator.missingLang.includes(text)) this.emulator.missingLang.push(text);
                console.log(`Translation not found for '${text}'. Language set to '${this.emulator.config.language}'`);
            }
            return this.emulator.config.langJson[text] || text;
        }
        return text;
    }

    /**
     * 显示消息
     */
    displayMessage(message, time) {
        if (!this.emulator.msgElem) {
            this.emulator.msgElem = this.emulator.createElement("div");
            this.emulator.msgElem.classList.add("ejs_message");
            this.emulator.elements.parent.appendChild(this.emulator.msgElem);
        }
        clearTimeout(this.emulator.msgTimeout);
        this.emulator.msgTimeout = setTimeout(() => {
            this.emulator.msgElem.innerText = "";
        }, (typeof time === "number" && time > 0) ? time : 3000)
        this.emulator.msgElem.innerText = message;
    }

    /**
     * 创建链接
     */
    createLink(elem, link, text, useP) {
        const elm = this.emulator.createElement("a");
        elm.href = link;
        elm.target = "_blank";
        elm.innerText = this.emulator.localization(text);
        if (useP) {
            const p = this.emulator.createElement("p");
            p.appendChild(elm);
            elem.appendChild(p);
        } else {
            elem.appendChild(elm);
        }
    }

    /**
     * 创建上下文菜单
     */
    createContextMenu() {
        this.emulator.elements.contextmenu = this.emulator.createElement("div");
        this.emulator.elements.contextmenu.classList.add("ejs_context_menu");
        this.emulator.addEventListener(this.emulator.game, "contextmenu", (e) => {
            e.preventDefault();
            if ((this.emulator.config.buttonOpts && this.emulator.config.buttonOpts.rightClick === false) || !this.emulator.started) return;
            const parentRect = this.emulator.elements.parent.getBoundingClientRect();
            this.emulator.elements.contextmenu.style.display = "block";
            const rect = this.emulator.elements.contextmenu.getBoundingClientRect();
            const up = e.offsetY + rect.height > parentRect.height - 25;
            const left = e.offsetX + rect.width > parentRect.width - 5;
            this.emulator.elements.contextmenu.style.left = (e.offsetX - (left ? rect.width : 0)) + "px";
            this.emulator.elements.contextmenu.style.top = (e.offsetY - (up ? rect.height : 0)) + "px";
        })
        const hideMenu = () => {
            this.emulator.elements.contextmenu.style.display = "none";
        }
        this.emulator.addEventListener(this.emulator.elements.contextmenu, "contextmenu", (e) => e.preventDefault());
        this.emulator.addEventListener(this.emulator.elements.parent, "contextmenu", (e) => e.preventDefault());
        this.emulator.addEventListener(this.emulator.game, "mousedown touchend", hideMenu);
        const parent = this.emulator.createElement("ul");
        const addButton = (title, hidden, functi0n) => {
            const li = this.emulator.createElement("li");
            if (hidden) li.hidden = true;
            const a = this.emulator.createElement("a");
            if (functi0n instanceof Function) {
                this.emulator.addEventListener(li, "click", (e) => {
                    e.preventDefault();
                    functi0n();
                });
            }
            a.href = "#";
            a.onclick = "return false";
            a.innerText = this.emulator.localization(title);
            li.appendChild(a);
            parent.appendChild(li);
            hideMenu();
            return li;
        }
        let screenshotUrl;
        const screenshot = addButton("Take Screenshot", false, () => {
            if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
            const date = new Date();
            const fileName = this.emulator.getBaseFileName() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();
            this.emulator.screenshot((blob, format) => {
                screenshotUrl = URL.createObjectURL(blob);
                const a = this.emulator.createElement("a");
                a.href = screenshotUrl;
                a.download = fileName + "." + format;
                a.click();
                hideMenu();
            });
        });

        let screenMediaRecorder = null;
        const startScreenRecording = addButton("Start Screen Recording", false, () => {
            if (screenMediaRecorder !== null) {
                screenMediaRecorder.stop();
            }
            screenMediaRecorder = this.emulator.screenRecord();
            startScreenRecording.setAttribute("hidden", "hidden");
            stopScreenRecording.removeAttribute("hidden");
            hideMenu();
        });
        const stopScreenRecording = addButton("Stop Screen Recording", true, () => {
            if (screenMediaRecorder !== null) {
                screenMediaRecorder.stop();
                screenMediaRecorder = null;
            }
            startScreenRecording.removeAttribute("hidden");
            stopScreenRecording.setAttribute("hidden", "hidden");
            hideMenu();
        });

        const qSave = addButton("Quick Save", false, () => {
            const slot = this.emulator.getSettingValue("save-state-slot") ? this.emulator.getSettingValue("save-state-slot") : "1";
            if (this.emulator.gameManager.quickSave(slot)) {
                this.displayMessage(this.emulator.localization("SAVED STATE TO SLOT") + " " + slot);
            } else {
                this.displayMessage(this.emulator.localization("FAILED TO SAVE STATE"));
            }
            hideMenu();
        });
        const qLoad = addButton("Quick Load", false, () => {
            const slot = this.emulator.getSettingValue("save-state-slot") ? this.emulator.getSettingValue("save-state-slot") : "1";
            this.emulator.gameManager.quickLoad(slot);
            this.displayMessage(this.emulator.localization("LOADED STATE FROM SLOT") + " " + slot);
            hideMenu();
        });
        this.emulator.elements.contextMenu = {
            screenshot: screenshot,
            startScreenRecording: startScreenRecording,
            stopScreenRecording: stopScreenRecording,
            save: qSave,
            load: qLoad
        }
        addButton("EmulatorJS v" + this.emulator.ejs_version, false, () => {
            hideMenu();
            const body = this.createPopup("EmulatorJS", {
                "Close": () => {
                    this.closePopup();
                }
            });

            body.style.display = "flex";

            const menu = this.emulator.createElement("div");
            body.appendChild(menu);
            menu.classList.add("ejs_list_selector");
            const parent = this.emulator.createElement("ul");
            const addButton = (title, hidden, functi0n) => {
                const li = this.emulator.createElement("li");
                if (hidden) li.hidden = true;
                const a = this.emulator.createElement("a");
                if (functi0n instanceof Function) {
                    this.emulator.addEventListener(li, "click", (e) => {
                        e.preventDefault();
                        functi0n(li);
                    });
                }
                a.href = "#";
                a.onclick = "return false";
                a.innerText = this.emulator.localization(title);
                li.appendChild(a);
                parent.appendChild(li);
                hideMenu();
                return li;
            }
            const home = this.emulator.createElement("div");
            const license = this.emulator.createElement("div");
            license.style.display = "none";
            const retroarch = this.emulator.createElement("div");
            retroarch.style.display = "none";
            const coreLicense = this.emulator.createElement("div");
            coreLicense.style.display = "none";
            body.appendChild(home);
            body.appendChild(license);
            body.appendChild(retroarch);
            body.appendChild(coreLicense);

            home.innerText = "EmulatorJS v" + this.emulator.ejs_version;
            home.appendChild(this.emulator.createElement("br"));
            home.appendChild(this.emulator.createElement("br"));

            home.classList.add("ejs_context_menu_tab");
            license.classList.add("ejs_context_menu_tab");
            retroarch.classList.add("ejs_context_menu_tab");
            coreLicense.classList.add("ejs_context_menu_tab");

            this.createLink(home, "https://github.com/EmulatorJS/EmulatorJS", "View on GitHub", true);

            this.createLink(home, "https://discord.gg/6akryGkETU", "Join the discord", true);

            const info = this.emulator.createElement("div");

            this.createLink(info, "https://emulatorjs.org", "EmulatorJS");
            info.innerHTML += " is powered by ";
            this.createLink(info, "https://github.com/libretro/RetroArch/", "RetroArch");
            if (this.emulator.repository && this.emulator.coreName) {
                info.innerHTML += ". This core is powered by ";
                this.createLink(info, this.emulator.repository, this.emulator.coreName);
                info.innerHTML += ".";
            } else {
                info.innerHTML += ".";
            }
            home.appendChild(info);

            home.appendChild(this.emulator.createElement("br"));
            menu.appendChild(parent);
            let current = home;
            const setElem = (element, li) => {
                if (current === element) return;
                if (current) {
                    current.style.display = "none";
                }
                let activeLi = li.parentElement.querySelector(".ejs_active_list_element");
                if (activeLi) {
                    activeLi.classList.remove("ejs_active_list_element");
                }
                li.classList.add("ejs_active_list_element");
                current = element;
                element.style.display = "";
            }
            addButton("Home", false, (li) => {
                setElem(home, li);
            }).classList.add("ejs_active_list_element");
            addButton("EmulatorJS License", false, (li) => {
                setElem(license, li);
            });
            addButton("RetroArch License", false, (li) => {
                setElem(retroarch, li);
            });
            if (this.emulator.coreName && this.emulator.license) {
                addButton(this.emulator.coreName + " License", false, (li) => {
                    setElem(coreLicense, li);
                })
                coreLicense.innerText = this.emulator.license;
            }

            retroarch.innerText = this.emulator.localization("This project is powered by") + " ";
            const a = this.emulator.createElement("a");
            a.href = "https://github.com/libretro/RetroArch";
            a.target = "_blank";
            a.innerText = "RetroArch";
            retroarch.appendChild(a);
            const licenseLink = this.emulator.createElement("a");
            licenseLink.target = "_blank";
            licenseLink.href = "https://github.com/libretro/RetroArch/blob/master/COPYING";
            licenseLink.innerText = this.emulator.localization("View the RetroArch license here");
            a.appendChild(this.emulator.createElement("br"));
            a.appendChild(licenseLink);

            license.innerText = 'GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007\n\nCopyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>\nEveryone is permitted to copy and distribute verbatim copies\nof this license document, but changing it is not allowed.\n\nPreamble\n\nThe GNU General Public License is a free, copyleft license for\nsoftware and other kinds of works.\n\nThe licenses for most software and other practical works are designed\nto take away your freedom to share and change the works. By contrast,\nthe GNU General Public License is intended to guarantee your freedom to\nshare and change all versions of a program--to make sure it remains free\nsoftware for all its users. We, the Free Software Foundation, use the\nGNU General Public License for most of our software; it applies also to\nany other work released this way by its authors. You can apply it to\nyour programs, too.\n\nWhen we speak of free software, we are referring to freedom, not\nprice. Our General Public Licenses are designed to make sure that you\nhave the freedom to distribute copies of free software (and charge for\nthem if you wish), that you receive source code or can get it if you\nwant it, that you can change the software or use pieces of it in new\nfree programs, and that you know you can do these things.\n\nTo protect your rights, we need to prevent others from denying you\nthese rights or asking you to surrender the rights. Therefore, you have\ncertain responsibilities if you distribute copies of the software, or if\nyou modify it: responsibilities to respect the freedom of others.\n\nFor example, if you distribute copies of such a program, whether\ngratis or for a fee, you must pass on to the recipients the same\nfreedoms that you received. You must make sure that they, too, receive\nor can get the source code. And you must show them these terms so they\nknow their rights.\n\nDevelopers that use the GNU GPL protect your rights with two steps:\n(1) assert copyright on the software, and (2) offer you this License\ngiving you legal permission to copy, distribute and/or modify it.\n\nFor the developers\' and authors\' protection, the GPL clearly explains\nthat there is no warranty for this free software. For both users\' and\nauthors\' sake, the GPL requires that modified versions be marked as\nchanged, so that their problems will not be attributed erroneously to\nauthors of previous versions.\n\nSome devices are designed to deny users access to install or run\nmodified versions of the software inside them, although the manufacturer\ncan do so. This is fundamentally incompatible with the aim of\nprotecting users\' freedom to change the software. The systematic\npattern of such abuse occurs in the area of products for individuals to\nuse, which is precisely where it is most unacceptable. Therefore, we\nhave designed this version of the GPL to prohibit the practice for those\nproducts. If such problems arise substantially in other domains, we\nstand ready to extend this provision to those domains in future versions\nof the GPL, as needed to protect the freedom of users.\n\nFinally, every program is threatened constantly by software patents.\nStates should not allow patents to restrict development and use of\nsoftware on general-purpose computers, but in those that do, we wish to\navoid the special danger that patents applied to a patent license for\nthis particular work, or (3) arrange, in a manner consistent with the\nrequirements of this License, to extend the patent license to\ndownstream recipients. "Knowingly relying" means you have actual\nknowledge that, but for the patent license, your conveying the covered\nwork in a country, or your recipient\'s use of the covered work in a\ncountry, would infringe one or more identifiable patents in that\ncountry that you have reason to believe are valid.\n\nIf, pursuant to or in connection with a single transaction or\narrangement, you convey, or propagate by procuring conveyance of, a\ncovered work, and grant a patent license to some of the parties\nreceiving the covered work authorizing them to use, propagate, modify\nor convey a specific copy of the covered work, then the patent license\nyou grant is automatically extended to all recipients of the covered\nwork and works based on it.\n\nA patent license is "discriminatory" if it does not include within\nthe scope of its coverage, prohibits the exercise of, or is\nconditioned on the non-exercise of one or more of the rights that are\nspecifically granted under this License. You may not convey a covered\nwork if you are a party to an arrangement with a third party that is\nin the business of distributing software, under which you make payment\nto the third party based on the extent of your activity of conveying\nthe work, and under which the third party grants, to any of the\nparties who would receive the covered work from you, a discriminatory\npatent license (a) in connection with copies of the covered work\nconveyed by you (or copies made from those copies), or (b) primarily\nfor and in connection with specific products or compilations that\ncontain the covered work, unless you entered into that arrangement,\nor that patent license was granted, prior to 28 March 2007.\n\nNothing in this License shall be construed as excluding or limiting\nany implied license or other defenses to infringement that may\notherwise be available to you under applicable patent law.\n\n12. No Surrender of Others\' Freedom.\n\nIf conditions are imposed on you (whether by court order, agreement or\notherwise) that contradict the conditions of this License, they do not\nexcuse you from the conditions of this License. If you cannot convey a\ncovered work so as to satisfy simultaneously your obligations under this\nLicense and any other pertinent obligations, then as a consequence you may\nnot convey it at all. For example, if you agree to terms that obligate you\nto collect a royalty for further conveying from those to whom you convey\nthe Program, the only way you could satisfy both those terms and this\nLicense would be to refrain entirely from conveying the Program.\n\n13. Use with the GNU Affero General Public License.\n\nNotwithstanding any other provision of this License, you have\npermission to link or combine any covered work with a work licensed\nunder version 3 of the GNU Affero General Public License into a single\ncombined work, and to convey the resulting work. The terms of this\nLicense will continue to apply to the part which is the covered work,\nbut the special requirements of the GNU Affero General Public License,\nsection 13, concerning interaction through a network will apply to the\ncombination as such.\n\n14. Revised Versions of this License.\n\nThe Free Software Foundation may publish revised and/or new versions of\nthe GNU General Public License from time to time. Such new versions will\nbe similar in spirit to the present version, but may differ in detail to\naddress new problems or concerns.\n\nEach version is given a distinguishing version number. If the\nProgram specifies that a certain numbered version of the GNU General\nPublic License "or any later version" applies to it, you have the\noption of following the terms and conditions either of that numbered\nversion or of any later version published by the Free Software\nFoundation. If the Program specifies that a proxy can decide which\nfuture versions of the GNU General Public License can be used, that\nproxy\'s public statement of acceptance of a version permanently\nauthorizes you to choose that version for the Program.\n\nLater license versions may give you additional or different\npermissions. However, no additional obligations are imposed on any\nauthor or copyright holder as a result of your choosing to follow a\nlater version.\n\n15. Disclaimer of Warranty.\n\nTHERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY\nAPPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT\nHOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY\nOF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,\nTHE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR\nPURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM\nIS WITH YOU. SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF\nALL NECESSARY SERVICING, REPAIR OR CORRECTION.\n\n16. Limitation of Liability.\n\nIN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING\nWILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES AND/OR CONVEYS\nTHE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY\nGENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE\nUSE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO LOSS OF\nDATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD\nPARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS),\nEVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF\nSUCH DAMAGES.\n\n17. Interpretation of Sections 15 and 16.\n\nIf the disclaimer of warranty and limitation of liability provided\nabove cannot be given local legal effect according to their terms,\nreviewing courts shall apply local law that most closely approximates\nan absolute waiver of all civil liability in connection with the\nProgram, unless a warranty or assumption of liability accompanies a\ncopy of the Program in return for a fee.\n\nEND OF TERMS AND CONDITIONS\n\nHow to Apply These Terms to Your New Programs\n\nIf you develop a new program, and you want it to be of the greatest\npossible use to the public, the best way to achieve this is to make it\nfree software which everyone can redistribute and change under these terms.\n\nTo do so, attach the following notices to the program. It is safest\nto attach them to the start of each source file to most effectively\nstate the exclusion of warranty; and each file should have at least\nthe "copyright" line and a pointer to where the full notice is found.\n\nEmulatorJS: RetroArch on the web\nCopyright (C) 2022-2024 Ethan O\'Brien\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\n(at your option) any later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\nGNU General Public License for more details.\n\nYou should have received a copy of the GNU General Public License\nalong with this program. If not, see <https://www.gnu.org/licenses/>.\n\nAlso add information on how to contact you by electronic and paper mail.\n\nIf the program does terminal interaction, make it output a short\nnotice like this when it starts in an interactive mode:\n\nEmulatorJS Copyright (C) 2023-2025 Ethan O\'Brien\nThis program comes with ABSOLUTELY NO WARRANTY; for details type `show w\'.\nThis is free software, and you are welcome to redistribute it\nunder certain conditions; type `show c\' for details.\n\nThe hypothetical commands `show w\' and `show c\' should show the appropriate\nparts of the General Public License. Of course, your program\'s commands\nmight be different; for a GUI interface, you would use an "about box".\n\nYou should also get your employer (if you work as a programmer) or school,\nif any, to sign a "copyright disclaimer" for the program, if necessary.\nFor more information on this, and how to apply and follow the GNU GPL, see\n<https://www.gnu.org/licenses/>.\n\nThe GNU General Public License does not permit incorporating your program\ninto proprietary programs. If your program is a subroutine library, you\nmay consider it more useful to permit linking proprietary applications with\nthe library. If this is what you want to do, use the GNU Lesser General\nPublic License instead of this License. But first, please read\n<https://www.gnu.org/licenses/why-not-lgpl.html>.';
        });

        if (this.emulator.config.buttonOpts) {
            if (this.emulator.config.buttonOpts.screenshot.visible === false) screenshot.setAttribute("hidden", "");
            if (this.emulator.config.buttonOpts.screenRecord.visible === false) startScreenRecording.setAttribute("hidden", "");
            if (this.emulator.config.buttonOpts.quickSave.visible === false) qSave.setAttribute("hidden", "");
            if (this.emulator.config.buttonOpts.quickLoad.visible === false) qLoad.setAttribute("hidden", "");
        }

        this.emulator.elements.contextmenu.appendChild(parent);

        this.emulator.elements.parent.appendChild(this.emulator.elements.contextmenu);
    }

    /**
     * 关闭弹出窗口
     */
    closePopup() {
        if (this.currentPopup !== null) {
            try {
                this.currentPopup.remove();
            } catch (e) { }
            this.currentPopup = null;
        }
    }

    /**
     * 创建弹出窗口
     */
    createPopup(popupTitle, buttons, hidden) {
        if (!hidden) this.closePopup();
        const popup = this.emulator.createElement("div");
        popup.classList.add("ejs_popup_container");
        this.emulator.elements.parent.appendChild(popup);
        const title = this.emulator.createElement("h4");
        title.innerText = this.emulator.localization(popupTitle);
        const main = this.emulator.createElement("div");
        main.classList.add("ejs_popup_body");

        popup.appendChild(title);
        popup.appendChild(main);

        const padding = this.emulator.createElement("div");
        padding.style["padding-top"] = "10px";
        popup.appendChild(padding);

        for (let k in buttons) {
            const button = this.emulator.createElement("a");
            if (buttons[k] instanceof Function) {
                button.addEventListener("click", (e) => {
                    buttons[k]();
                    e.preventDefault();
                });
            }
            button.classList.add("ejs_button");
            button.innerText = this.emulator.localization(k);
            popup.appendChild(button);
        }
        if (!hidden) {
            this.currentPopup = popup;
        } else {
            popup.style.display = "none";
        }

        return main;
    }

    /**
     * 选择文件
     */
    selectFile() {
        return new Promise((resolve, reject) => {
            const file = this.emulator.createElement("input");
            file.type = "file";
            this.emulator.addEventListener(file, "change", (e) => {
                resolve(e.target.files[0]);
            })
            file.click();
        })
    }

    /**
     * 检查是否有弹出窗口打开
     */
    isPopupOpen() {
        return this.emulator.cheatMenu.style.display !== "none" || this.emulator.netplayMenu.style.display !== "none" || this.emulator.controlMenu.style.display !== "none" || this.currentPopup !== null;
    }

    /**
     * 检查元素是否为子元素
     */
    isChild(first, second) {
        if (!first || !second) return false;
        const adown = first.nodeType === 9 ? first.documentElement : first;

        if (first === second) return true;

        if (adown.contains) {
            return adown.contains(second);
        }
    }

    /**
     * 设置广告
     */
    setupAds(ads, width, height) {
        const div = this.emulator.createElement("div");
        const time = (typeof this.emulator.config.adMode === "number" && this.emulator.config.adMode > -1 && this.emulator.config.adMode < 3) ? this.emulator.config.adMode : 2;
        div.classList.add("ejs_ad_iframe");
        const frame = this.emulator.createElement("iframe");
        frame.src = ads;
        frame.setAttribute("scrolling", "no");
        frame.setAttribute("frameborder", "no");
        frame.style.width = width;
        frame.style.height = height;
        const closeParent = this.emulator.createElement("div");
        closeParent.classList.add("ejs_ad_close");
        const closeButton = this.emulator.createElement("a");
        closeParent.appendChild(closeButton);
        closeParent.setAttribute("hidden", "");
        div.appendChild(closeParent);
        div.appendChild(frame);
        if (this.emulator.config.adMode !== 1) {
            this.emulator.elements.parent.appendChild(div);
        }
        this.emulator.addEventListener(closeButton, "click", () => {
            div.remove();
        })

        this.emulator.on("start-clicked", () => {
            if (this.emulator.config.adMode === 0) div.remove();
            if (this.emulator.config.adMode === 1) {
                this.emulator.elements.parent.appendChild(div);
            }
        })

        this.emulator.on("start", () => {
            closeParent.removeAttribute("hidden");
            const time = (typeof this.emulator.config.adTimer === "number" && this.emulator.config.adTimer > 0) ? this.emulator.config.adTimer : 10000;
            if (this.emulator.config.adTimer === -1) div.remove();
            if (this.emulator.config.adTimer === 0) return;
            setTimeout(() => {
                div.remove();
            }, time);
        })
    }

    /**
     * 广告被屏蔽处理
     */
    adBlocked(url, del) {
        if (del) {
            document.querySelector('div[class="ejs_ad_iframe"]').remove();
        } else {
            try {
                document.querySelector('div[class="ejs_ad_iframe"]').remove();
            } catch (e) { }
        }
    }
}
