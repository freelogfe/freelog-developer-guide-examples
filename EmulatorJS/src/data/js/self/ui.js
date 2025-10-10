
export function createContextMenu(emulator) {
    emulator.elements.contextmenu = emulator.createElement("div");
    emulator.elements.contextmenu.classList.add("ejs_context_menu");
    emulator.addEventListener(emulator.game, "contextmenu", (e) => {
        e.preventDefault();
        if ((emulator.config.buttonOpts && emulator.config.buttonOpts.rightClick === false) || !emulator.started) return;
        const parentRect = emulator.elements.parent.getBoundingClientRect();
        emulator.elements.contextmenu.style.display = "block";
        const rect = emulator.elements.contextmenu.getBoundingClientRect();
        const up = e.offsetY + rect.height > parentRect.height - 25;
        const left = e.offsetX + rect.width > parentRect.width - 5;
        emulator.elements.contextmenu.style.left = (e.offsetX - (left ? rect.width : 0)) + "px";
        emulator.elements.contextmenu.style.top = (e.offsetY - (up ? rect.height : 0)) + "px";
    })
    const hideMenu = () => {
        emulator.elements.contextmenu.style.display = "none";
    }
    emulator.addEventListener(emulator.elements.contextmenu, "contextmenu", (e) => e.preventDefault());
    emulator.addEventListener(emulator.elements.parent, "contextmenu", (e) => e.preventDefault());
    emulator.addEventListener(emulator.game, "mousedown touchend", hideMenu);
    const parent = emulator.createElement("ul");
    const addButton = (title, hidden, functi0n) => {
        //<li><a href="#" onclick="return false">'+title+'</a></li>
        const li = emulator.createElement("li");
        if (hidden) li.hidden = true;
        const a = emulator.createElement("a");
        if (functi0n instanceof Function) {
            emulator.addEventListener(li, "click", (e) => {
                e.preventDefault();
                functi0n();
            });
        }
        a.href = "#";
        a.onclick = "return false";
        a.innerText = emulator.localization(title);
        li.appendChild(a);
        parent.appendChild(li);
        hideMenu();
        return li;
    }
    let screenshotUrl;
    const screenshot = addButton("Take Screenshot", false, () => {
        if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
        const date = new Date();
        const fileName = emulator.getBaseFileName() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();
        emulator.screenshot((blob, format) => {
            screenshotUrl = URL.createObjectURL(blob);
            const a = emulator.createElement("a");
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
        screenMediaRecorder = emulator.screenRecord();
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
        const slot = emulator.getSettingValue("save-state-slot") ? emulator.getSettingValue("save-state-slot") : "1";
        if (emulator.gameManager.quickSave(slot)) {
            emulator.displayMessage(emulator.localization("SAVED STATE TO SLOT") + " " + slot);
        } else {
            emulator.displayMessage(emulator.localization("FAILED TO SAVE STATE"));
        }
        hideMenu();
    });
    const qLoad = addButton("Quick Load", false, () => {
        const slot = emulator.getSettingValue("save-state-slot") ? emulator.getSettingValue("save-state-slot") : "1";
        emulator.gameManager.quickLoad(slot);
        emulator.displayMessage(emulator.localization("LOADED STATE FROM SLOT") + " " + slot);
        hideMenu();
    });
    emulator.elements.contextMenu = {
        screenshot: screenshot,
        startScreenRecording: startScreenRecording,
        stopScreenRecording: stopScreenRecording,
        save: qSave,
        load: qLoad
    }
    addButton("EmulatorJS v" + emulator.ejs_version, false, () => {
        hideMenu();
        const body = emulator.createPopup("EmulatorJS", {
            "Close": () => {
                emulator.closePopup();
            }
        });

        body.style.display = "flex";

        const menu = emulator.createElement("div");
        body.appendChild(menu);
        menu.classList.add("ejs_list_selector");
        const parent = emulator.createElement("ul");
        const addButton = (title, hidden, functi0n) => {
            const li = emulator.createElement("li");
            if (hidden) li.hidden = true;
            const a = emulator.createElement("a");
            if (functi0n instanceof Function) {
                emulator.addEventListener(li, "click", (e) => {
                    e.preventDefault();
                    functi0n(li);
                });
            }
            a.href = "#";
            a.onclick = "return false";
            a.innerText = emulator.localization(title);
            li.appendChild(a);
            parent.appendChild(li);
            hideMenu();
            return li;
        }
        //body.style["padding-left"] = "20%";
        const home = emulator.createElement("div");
        const license = emulator.createElement("div");
        license.style.display = "none";
        const retroarch = emulator.createElement("div");
        retroarch.style.display = "none";
        const coreLicense = emulator.createElement("div");
        coreLicense.style.display = "none";
        body.appendChild(home);
        body.appendChild(license);
        body.appendChild(retroarch);
        body.appendChild(coreLicense);

        home.innerText = "EmulatorJS v" + emulator.ejs_version;
        home.appendChild(emulator.createElement("br"));
        home.appendChild(emulator.createElement("br"));

        home.classList.add("ejs_context_menu_tab");
        license.classList.add("ejs_context_menu_tab");
        retroarch.classList.add("ejs_context_menu_tab");
        coreLicense.classList.add("ejs_context_menu_tab");

        emulator.createLink(home, "https://github.com/EmulatorJS/EmulatorJS", "View on GitHub", true);

        emulator.createLink(home, "https://discord.gg/6akryGkETU", "Join the discord", true);

        const info = emulator.createElement("div");

        emulator.createLink(info, "https://emulatorjs.org", "EmulatorJS");
        // I do not like using innerHTML, though this should be "safe"
        info.innerHTML += " is powered by ";
        emulator.createLink(info, "https://github.com/libretro/RetroArch/", "RetroArch");
        if (emulator.repository && emulator.coreName) {
            info.innerHTML += ". This core is powered by ";
            emulator.createLink(info, emulator.repository, emulator.coreName);
            info.innerHTML += ".";
        } else {
            info.innerHTML += ".";
        }
        home.appendChild(info);


        home.appendChild(emulator.createElement("br"));
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
        if (emulator.coreName && emulator.license) {
            addButton(emulator.coreName + " License", false, (li) => {
                setElem(coreLicense, li);
            })
            coreLicense.innerText = emulator.license;
        }
        //Todo - Contributors.

        retroarch.innerText = emulator.localization("This project is powered by") + " ";
        const a = emulator.createElement("a");
        a.href = "https://github.com/libretro/RetroArch";
        a.target = "_blank";
        a.innerText = "RetroArch";
        retroarch.appendChild(a);
        const licenseLink = emulator.createElement("a");
        licenseLink.target = "_blank";
        licenseLink.href = "https://github.com/libretro/RetroArch/blob/master/COPYING";
        licenseLink.innerText = emulator.localization("View the RetroArch license here");
        a.appendChild(emulator.createElement("br"));
        a.appendChild(licenseLink);

        license.innerText = '                    GNU GENERAL PUBLIC LICENSE\n                       Version 3, 29 June 2007\n\n Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>\n Everyone is permitted to copy and distribute verbatim copies\n of this license document, but changing it is not allowed.\n\n                            Preamble\n\n  The GNU General Public License is a free, copyleft license for\nsoftware and other kinds of works.\n\n  The licenses for most software and other practical works are designed\nto take away your freedom to share and change the works.  By contrast,\nthe GNU General Public License is intended to guarantee your freedom to\nshare and change all versions of a program--to make sure it remains free\nsoftware for all its users.  We, the Free Software Foundation, use the\nGNU General Public License for most of our software; it applies also to\nany other work released this way by its authors.  You can apply it to\nyour programs, too.\n\n  When we speak of free software, we are referring to freedom, not\nprice.  Our General Public Licenses are designed to make sure that you\nhave the freedom to distribute copies of free software (and charge for\nthem if you wish), that you receive source code or can get it if you\nwant it, that you can change the software or use pieces of it in new\nfree programs, and that you know you can do these things.\n\n  To protect your rights, we need to prevent others from denying you\nthese rights or asking you to surrender the rights.  Therefore, you have\ncertain responsibilities if you distribute copies of the software, or if\nyou modify it: responsibilities to respect the freedom of others.\n\n  For example, if you distribute copies of such a program, whether\ngratis or for a fee, you must pass on to the recipients the same\nfreedoms that you received.  You must make sure that they, too, receive\nor can get the source code.  And you must show them these terms so they\nknow their rights.\n\n  Developers that use the GNU GPL protect your rights with two steps:\n(1) assert copyright on the software, and (2) offer you this License\ngiving you legal permission to copy, distribute and/or modify it.\n\n  For the developers\' and authors\' protection, the GPL clearly explains\nthat there is no warranty for this free software.  For both users\' and\nauthors\' sake, the GPL requires that modified versions be marked as\nchanged, so that their problems will not be attributed erroneously to\nauthors of previous versions.\n\n  Some devices are designed to deny users access to install or run\nmodified versions of the software inside them, although the manufacturer\ncan do so.  This is fundamentally incompatible with the aim of\nprotecting users\' freedom to change the software.  The systematic\npattern of such abuse occurs in the area of products for individuals to\nuse, which is precisely where it is most unacceptable.  Therefore, we\nhave designed this version of the GPL to prohibit the practice for those\nproducts.  If such problems arise substantially in other domains, we\nstand ready to extend this provision to those domains in future versions\nof the GPL, as needed to protect the freedom of users.\n\n  Finally, every program is threatened constantly by software patents.\nStates should not allow patents to restrict development and use of\nsoftware on general-purpose computers, but in those that do, we wish to\navoid the special danger that patents applied to a free program could\nmake it effectively proprietary.  To prevent this, the GPL assures that\npatents cannot be used to render the program non-free.\n\n  The precise terms and conditions for copying, distribution and\nmodification follow.\n\n                       TERMS AND CONDITIONS\n\n  0. Definitions.\n\n  "This License" refers to version 3 of the GNU General Public License.\n\n  "Copyright" also means copyright-like laws that apply to other kinds of\nworks, such as semiconductor masks.\n\n  "The Program" refers to any copyrightable work licensed under this\nLicense.  Each licensee is addressed as "you".  "Licensees" and\n"recipients" may be individuals or organizations.\n\n  To "modify" a work means to copy from or adapt all or part of the work\nin a fashion requiring copyright permission, other than the making of an\nexact copy.  The resulting work is called a "modified version" of the\nearlier work or a work "based on" the earlier work.\n\n  A "covered work" means either the unmodified Program or a work based\non the Program.\n\n  To "propagate" a work means to do anything with it that, without\npermission, would make you directly or secondarily liable for\ninfringement under applicable copyright law, except executing it on a\ncomputer or modifying a private copy.  Propagation includes copying,\ndistribution (with or without modification), making available to the\npublic, and in some countries other activities as well.\n\n  To "convey" a work means any kind of propagation that enables other\nparties to make or receive copies.  Mere interaction with a user through\na computer network, with no transfer of a copy, is not conveying.\n\n  An interactive user interface displays "Appropriate Legal Notices"\nto the extent that it includes a convenient and prominently visible\nfeature that (1) displays an appropriate copyright notice, and (2)\ntells the user that there is no warranty for the work (except to the\nextent that warranties are provided), that licensees may convey the\nwork under this License, and how to view a copy of this License.  If\nthe interface presents a list of user commands or options, such as a\nmenu, a prominent item in the list meets this criterion.\n\n  1. Source Code.\n\n  The "source code" for a work means the preferred form of the work\nfor making modifications to it.  "Object code" means any non-source\nform of a work.\n\n  A "Standard Interface" means an interface that either is an official\nstandard defined by a recognized standards body, or, in the case of\ninterfaces specified for a particular programming language, one that\nis widely used among developers working in that language.\n\n  The "System Libraries" of an executable work include anything, other\nthan the work as a whole, that (a) is included in the normal form of\npackaging a Major Component, but which is not part of that Major\nComponent, and (b) serves only to enable use of the work with that\nMajor Component, or to implement a Standard Interface for which an\nimplementation is available to the public in source code form.  A\n"Major Component", in this context, means a major essential component\n(kernel, window system, and so on) of the specific operating system\n(if any) on which the executable work runs, or a compiler used to\nproduce the work, or an object code interpreter used to run it.\n\n  The "Corresponding Source" for a work in object code form means all\nthe source code needed to generate, install, and (for an executable\nwork) run the object code and to modify the work, including scripts to\ncontrol those activities.  However, it does not include the work\'s\nSystem Libraries, or general-purpose tools or generally available free\nprograms which are used unmodified in performing those activities but\nwhich are not part of the work.  For example, Corresponding Source\nincludes interface definition files associated with source files for\nthe work, and the source code for shared libraries and dynamically\nlinked subprograms that the work is specifically designed to require,\nsuch as by intimate data communication or control flow between those\nsubprograms and other parts of the work.\n\n  The Corresponding Source need not include anything that users\ncan regenerate automatically from other parts of the Corresponding\nSource.\n\n  The Corresponding Source for a work in source code form is that\nsame work.\n\n  2. Basic Permissions.\n\n  All rights granted under this License are granted for the term of\ncopyright on the Program, and are irrevocable provided the stated\nconditions are met.  This License explicitly affirms your unlimited\npermission to run the unmodified Program.  The output from running a\ncovered work is covered by this License only if the output, given its\ncontent, constitutes a covered work.  This License acknowledges your\nrights of fair use or other equivalent, as provided by copyright law.\n\n  You may make, run and propagate covered works that you do not\nconvey, without conditions so long as your license otherwise remains\nin force.  You may convey covered works to others for the sole purpose\nof having them make modifications exclusively for you, or provide you\nwith facilities for running those works, provided that you comply with\nthe terms of this License in conveying all material for which you do\nnot control copyright.  Those thus making or running the covered works\nfor you must do so exclusively on your behalf, under your direction\nand control, on terms that prohibit them from making any copies of\nyour copyrighted material outside their relationship with you.\n\n  Conveying under any other circumstances is permitted solely under\nthe conditions stated below.  Sublicensing is not allowed; section 10\nmakes it unnecessary.\n\n  3. Protecting Users\' Legal Rights From Anti-Circumvention Law.\n\n  No covered work shall be deemed part of an effective technological\nmeasure under any applicable law fulfilling obligations under article\n11 of the WIPO copyright treaty adopted on 20 December 1996, or\nsimilar laws prohibiting or restricting circumvention of such\nmeasures.\n\n  When you convey a covered work, you waive any legal power to forbid\ncircumvention of technological measures to the extent such circumvention\nis effected by exercising rights under this License with respect to\nthe covered work, and you disclaim any intention to limit operation or\nmodification of the work as a means of enforcing, against the work\'s\nusers, your or third parties\' legal rights to forbid circumvention of\ntechnological measures.\n\n  4. Conveying Verbatim Copies.\n\n  You may convey verbatim copies of the Program\'s source code as you\nreceive it, in any medium, provided that you conspicuously and\nappropriately publish on each copy an appropriate copyright notice;\nkeep intact all notices stating that this License and any\nnon-permissive terms added in accord with section 7 apply to the code;\nkeep intact all notices of the absence of any warranty; and give all\nrecipients a copy of this License along with the Program.\n\n  You may charge any price or no price for each copy that you convey,\nand you may offer support or warranty protection for a fee.\n\n  5. Conveying Modified Source Versions.\n\n  You may convey a work based on the Program, or the modifications to\nproduce it from the Program, in the form of source code under the\nterms of section 4, provided that you also meet all of these conditions:\n\n    a) The work must carry prominent notices stating that you modified\n    it, and giving a relevant date.\n\n    b) The work must carry prominent notices stating that it is\n    released under this License and any conditions added under section\n    7.  This requirement modifies the requirement in section 4 to\n    "keep intact all notices".\n\n    c) You must license the entire work, as a whole, under this\n    License to anyone who comes into possession of a copy.  This\n    License will therefore apply, along with any applicable section 7\n    additional terms, to the whole of the work, and all its parts,\n    regardless of how they are packaged.  This License gives no\n    permission to license the work in any other way, but it does not\n    invalidate such permission if you have separately received it.\n\n    d) If the work has interactive user interfaces, each must display\n    Appropriate Legal Notices; however, if the Program has interactive\n    interfaces that do not display Appropriate Legal Notices, your\n    work need not make them do so.\n\n  A compilation of a covered work with other separate and independent\nworks, which are not by their nature extensions of the covered work,\nand which are not combined with it such as to form a larger program,\nin or on a volume of a storage or distribution medium, is called an\n"aggregate" if the compilation and its resulting copyright are not\nused to limit the access or legal rights of the compilation\'s users\nbeyond what the individual works permit.  Inclusion of a covered work\nin an aggregate does not cause this License to apply to the other\nparts of the aggregate.\n\n  6. Conveying Non-Source Forms.\n\n  You may convey a covered work in object code form under the terms\nof sections 4 and 5, provided that you also convey the\nmachine-readable Corresponding Source under the terms of this License,\nin one of these ways:\n\n    a) Convey the object code in, or embodied in, a physical product\n    (including a physical distribution medium), accompanied by the\n    Corresponding Source fixed on a durable physical medium\n    customarily used for software interchange.\n\n    b) Convey the object code in, or embodied in, a physical product\n    (including a physical distribution medium), accompanied by a\n    written offer, valid for at least three years and valid for as\n    long as you offer spare parts or customer support for that product\n    model, to give anyone who possesses the object code either (1) a\n    copy of the Corresponding Source for all the software in the\n    product that is covered by this License, on a durable physical\n    medium customarily used for software interchange, for a price no\n    more than your reasonable cost of physically performing this\n    conveying of source, or (2) access to copy the\n    Corresponding Source from a network server at no charge.\n\n    c) Convey individual copies of the object code with a copy of the\n    written offer to provide the Corresponding Source.  This\n    alternative is allowed only occasionally and noncommercially, and\n    only if you received the object code with such an offer, in accord\n    with subsection 6b.\n\n    d) Convey the object code by offering access from a designated\n    place (gratis or for a charge), and offer equivalent access to the\n    Corresponding Source in the same way through the same place at no\n    further charge.  You need not require recipients to copy the\n    Corresponding Source along with the object code.  If the place to\n    copy the object code is a network server, the Corresponding Source\n    may be on a different server (operated by you or a third party)\n    that supports equivalent copying facilities, provided you maintain\n    clear directions next to the object code saying where to find the\n    Corresponding Source.  Regardless of what server hosts the\n    Corresponding Source, you remain obligated to ensure that it is\n    available for as long as needed to satisfy these requirements.\n\n    e) Convey the object code using peer-to-peer transmission, provided\n    you inform other peers where the object code and Corresponding\n    Source of the work are being offered to the general public at no\n    charge under subsection 6d.\n\n  A separable portion of the object code, whose source code is excluded\nfrom the Corresponding Source as a System Library, need not be\nincluded in conveying the object code work.\n\n  A "User Product" is either (1) a "consumer product", which means any\ntangible personal property which is normally used for personal, family,\nor household purposes, or (2) anything designed or sold for incorporation\ninto a dwelling.  In determining whether a product is a consumer product,\ndoubtful cases shall be resolved in favor of coverage.  For a particular\nproduct received by a particular user, "normally used" refers to a\ntypical or common use of that class of product, regardless of the status\nof the particular user or of the way in which the particular user\nactually uses, or expects or is expected to use, the product.  A product\nis a consumer product regardless of whether the product has substantial\ncommercial, industrial or non-consumer uses, unless such uses represent\nthe only significant mode of use of the product.\n\n  "Installation Information" for a User Product means any methods,\nprocedures, authorization keys, or other information required to install\nand execute modified versions of a covered work in that User Product from\na modified version of its Corresponding Source.  The information must\nsuffice to ensure that the continued functioning of the modified object\ncode is in no case prevented or interfered with solely because\nmodification has been made.\n\n  If you convey an object code work under this section in, or with, or\nspecifically for use in, a User Product, and the conveying occurs as\npart of a transaction in which the right of possession and use of the\nUser Product is transferred to the recipient in perpetuity or for a\nfixed term (regardless of how the transaction is characterized), the\nCorresponding Source conveyed under this section must be accompanied\nby the Installation Information.  But this requirement does not apply\nif neither you nor any third party retains the ability to install\nmodified object code on the User Product (for example, the work has\nbeen installed in ROM).\n\n  The requirement to provide Installation Information does not include a\nrequirement to continue to provide support service, warranty, or updates\nfor a work that has been modified or installed by the recipient, or for\nthe User Product in which it has been modified or installed.  Access to a\nnetwork may be denied when the modification itself materially and\nadversely affects the operation of the network or violates the rules and\nprotocols for communication across the network.\n\n  Corresponding Source conveyed, and Installation Information provided,\nin accord with this section must be in a format that is publicly\ndocumented (and with an implementation available to the public in\nsource code form), and must require no special password or key for\nunpacking, reading or copying.\n\n  7. Additional Terms.\n\n  "Additional permissions" are terms that supplement the terms of this\nLicense by making exceptions from one or more of its conditions.\nAdditional permissions that are applicable to the entire Program shall\nbe treated as though they were included in this License, to the extent\nthat they are valid under applicable law.  If additional permissions\napply only to part of the Program, that part may be used separately\nunder those permissions, but the entire Program remains governed by\nthis License without regard to the additional permissions.\n\n  When you convey a copy of a covered work, you may at your option\nremove any additional permissions from that copy, or from any part of\nit.  (Additional permissions may be written to require their own\nremoval in certain cases when you modify the work.)  You may place\nadditional permissions on material, added by you to a covered work,\nfor which you have or can give appropriate copyright permission.\n\n  Notwithstanding any other provision of this License, for material you\nadd to a covered work, you may (if authorized by the copyright holders of\nthat material) supplement the terms of this License with terms:\n\n    a) Disclaiming warranty or limiting liability differently from the\n    terms of sections 15 and 16 of this License; or\n\n    b) Requiring preservation of specified reasonable legal notices or\n    author attributions in that material or in the Appropriate Legal\n    Notices displayed by works containing it; or\n\n    c) Prohibiting misrepresentation of the origin of that material, or\n    requiring that modified versions of such material be marked in\n    reasonable ways as different from the original version; or\n\n    d) Limiting the use for publicity purposes of names of licensors or\n    authors of the material; or\n\n    e) Declining to grant rights under trademark law for use of some\n    trade names, trademarks, or service marks; or\n\n    f) Requiring indemnification of licensors and authors of that\n    material by anyone who conveys the material (or modified versions of\n    it) with contractual assumptions of liability to the recipient, for\n    any liability that these contractual assumptions directly impose on\n    those licensors and authors.\n\n  All other non-permissive additional terms are considered "further\nrestrictions" within the meaning of section 10.  If the Program as you\nreceived it, or any part of it, contains a notice stating that it is\ngoverned by this License along with a term that is a further\nrestriction, you may remove that term.  If a license document contains\na further restriction but permits relicensing or conveying under this\nLicense, you may add to a covered work material governed by the terms\nof that license document, provided that the further restriction does\nnot survive such relicensing or conveying.\n\n  If you add terms to a covered work in accord with this section, you\nmust place, in the relevant source files, a statement of the\nadditional terms that apply to those files, or a notice indicating\nwhere to find the applicable terms.\n\n  Additional terms, permissive or non-permissive, may be stated in the\nform of a separately written license, or stated as exceptions;\nthe above requirements apply either way.\n\n  8. Termination.\n\n  You may not propagate or modify a covered work except as expressly\nprovided under this License.  Any attempt otherwise to propagate or\nmodify it is void, and will automatically terminate your rights under\nthis License (including any patent licenses granted under the third\nparagraph of section 11).\n\n  However, if you cease all violation of this License, then your\nlicense from a particular copyright holder is reinstated (a)\nprovisionally, unless and until the copyright holder explicitly and\nfinally terminates your license, and (b) permanently, if the copyright\nholder fails to notify you of the violation by some reasonable means\nprior to 60 days after the cessation.\n\n  Moreover, your license from a particular copyright holder is\nreinstated permanently if the copyright holder notifies you of the\nviolation by some reasonable means, this is the first time you have\nreceived notice of violation of this License (for any work) from that\ncopyright holder, and you cure the violation prior to 30 days after\nyour receipt of the notice.\n\n  Termination of your rights under this section does not terminate the\nlicenses of parties who have received copies or rights from you under\nthis License.  If your rights have been terminated and not permanently\nreinstated, you do not qualify to receive new licenses for the same\nmaterial under section 10.\n\n  9. Acceptance Not Required for Having Copies.\n\n  You are not required to accept this License in order to receive or\nrun a copy of the Program.  Ancillary propagation of a covered work\noccurring solely as a consequence of using peer-to-peer transmission\nto receive a copy likewise does not require acceptance.  However,\nnothing other than this License grants you permission to propagate or\nmodify any covered work.  These actions infringe copyright if you do\nnot accept this License.  Therefore, by modifying or propagating a\ncovered work, you indicate your acceptance of this License to do so.\n\n  10. Automatic Licensing of Downstream Recipients.\n\n  Each time you convey a covered work, the recipient automatically\nreceives a license from the original licensors, to run, modify and\npropagate that work, subject to this License.  You are not responsible\nfor enforcing compliance by third parties with this License.\n\n  An "entity transaction" is a transaction transferring control of an\norganization, or substantially all assets of one, or subdividing an\norganization, or merging organizations.  If propagation of a covered\nwork results from an entity transaction, each party to that\ntransaction who receives a copy of the work also receives whatever\nlicenses to the work the party\'s predecessor in interest had or could\ngive under the previous paragraph, plus a right to possession of the\nCorresponding Source of the work from the predecessor in interest, if\nthe predecessor has it or can get it with reasonable efforts.\n\n  You may not impose any further restrictions on the exercise of the\nrights granted or affirmed under this License.  For example, you may\nnot impose a license fee, royalty, or other charge for exercise of\nrights granted under this License, and you may not initiate litigation\n(including a cross-claim or counterclaim in a lawsuit) alleging that\nany patent claim is infringed by making, using, selling, offering for\nsale, or importing the Program or any portion of it.\n\n  11. Patents.\n\n  A "contributor" is a copyright holder who authorizes use under this\nLicense of the Program or a work on which the Program is based.  The\nwork thus licensed is called the contributor\'s "contributor version".\n\n  A contributor\'s "essential patent claims" are all patent claims\nowned or controlled by the contributor, whether already acquired or\nhereafter acquired, that would be infringed by some manner, permitted\nby this License, of making, using, or selling its contributor version,\nbut do not include claims that would be infringed only as a\nconsequence of further modification of the contributor version.  For\npurposes of this definition, "control" includes the right to grant\npatent sublicenses in a manner consistent with the requirements of\nthis License.\n\n  Each contributor grants you a non-exclusive, worldwide, royalty-free\npatent license under the contributor\'s essential patent claims, to\nmake, use, sell, offer for sale, import and otherwise run, modify and\npropagate the contents of its contributor version.\n\n  In the following three paragraphs, a "patent license" is any express\nagreement or commitment, however denominated, not to enforce a patent\n(such as an express permission to practice a patent or covenant not to\nsue for patent infringement).  To "grant" such a patent license to a\nparty means to make such an agreement or commitment not to enforce a\npatent against the party.\n\n  If you convey a covered work, knowingly relying on a patent license,\nand the Corresponding Source of the work is not available for anyone\nto copy, free of charge and under the terms of this License, through a\npublicly available network server or other readily accessible means,\nthen you must either (1) cause the Corresponding Source to be so\navailable, or (2) arrange to deprive yourself of the benefit of the\npatent license for this particular work, or (3) arrange, in a manner\nconsistent with the requirements of this License, to extend the patent\nlicense to downstream recipients.  "Knowingly relying" means you have\nactual knowledge that, but for the patent license, your conveying the\ncovered work in a country, or your recipient\'s use of the covered work\nin a country, would infringe one or more identifiable patents in that\ncountry that you have reason to believe are valid.\n\n  If, pursuant to or in connection with a single transaction or\narrangement, you convey, or propagate by procuring conveyance of, a\ncovered work, and grant a patent license to some of the parties\nreceiving the covered work authorizing them to use, propagate, modify\nor convey a specific copy of the covered work, then the patent license\nyou grant is automatically extended to all recipients of the covered\nwork and works based on it.\n\n  A patent license is "discriminatory" if it does not include within\nthe scope of its coverage, prohibits the exercise of, or is\nconditioned on the non-exercise of one or more of the rights that are\nspecifically granted under this License.  You may not convey a covered\nwork if you are a party to an arrangement with a third party that is\nin the business of distributing software, under which you make payment\nto the third party based on the extent of your activity of conveying\nthe work, and under which the third party grants, to any of the\nparties who would receive the covered work from you, a discriminatory\npatent license (a) in connection with copies of the covered work\nconveyed by you (or copies made from those copies), or (b) primarily\nfor and in connection with specific products or compilations that\ncontain the covered work, unless you entered into that arrangement,\nor that patent license was granted, prior to 28 March 2007.\n\n  Nothing in this License shall be construed as excluding or limiting\nany implied license or other defenses to infringement that may\notherwise be available to you under applicable patent law.\n\n  12. No Surrender of Others\' Freedom.\n\n  If conditions are imposed on you (whether by court order, agreement or\notherwise) that contradict the conditions of this License, they do not\nexcuse you from the conditions of this License.  If you cannot convey a\ncovered work so as to satisfy simultaneously your obligations under this\nLicense and any other pertinent obligations, then as a consequence you may\nnot convey it at all.  For example, if you agree to terms that obligate you\nto collect a royalty for further conveying from those to whom you convey\nthe Program, the only way you could satisfy both those terms and this\nLicense would be to refrain entirely from conveying the Program.\n\n  13. Use with the GNU Affero General Public License.\n\n  Notwithstanding any other provision of this License, you have\npermission to link or combine any covered work with a work licensed\nunder version 3 of the GNU Affero General Public License into a single\ncombined work, and to convey the resulting work.  The terms of this\nLicense will continue to apply to the part which is the covered work,\nbut the special requirements of the GNU Affero General Public License,\nsection 13, concerning interaction through a network will apply to the\ncombination as such.\n\n  14. Revised Versions of this License.\n\n  The Free Software Foundation may publish revised and/or new versions of\nthe GNU General Public License from time to time.  Such new versions will\nbe similar in spirit to the present version, but may differ in detail to\naddress new problems or concerns.\n\n  Each version is given a distinguishing version number.  If the\nProgram specifies that a certain numbered version of the GNU General\nPublic License "or any later version" applies to it, you have the\noption of following the terms and conditions either of that numbered\nversion or of any later version published by the Free Software\nFoundation.  If the Program does not specify a version number of the\nGNU General Public License, you may choose any version ever published\nby the Free Software Foundation.\n\n  If the Program specifies that a proxy can decide which future\nversions of the GNU General Public License can be used, that proxy\'s\npublic statement of acceptance of a version permanently authorizes you\nto choose that version for the Program.\n\n  Later license versions may give you additional or different\npermissions.  However, no additional obligations are imposed on any\nauthor or copyright holder as a result of your choosing to follow a\nlater version.\n\n  15. Disclaimer of Warranty.\n\n  THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY\nAPPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT\nHOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY\nOF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,\nTHE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR\nPURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM\nIS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF\nALL NECESSARY SERVICING, REPAIR OR CORRECTION.\n\n  16. Limitation of Liability.\n\n  IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING\nWILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES AND/OR CONVEYS\nTHE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY\nGENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE\nUSE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO LOSS OF\nDATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD\nPARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS),\nEVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF\nSUCH DAMAGES.\n\n  17. Interpretation of Sections 15 and 16.\n\n  If the disclaimer of warranty and limitation of liability provided\nabove cannot be given local legal effect according to their terms,\nreviewing courts shall apply local law that most closely approximates\nan absolute waiver of all civil liability in connection with the\nProgram, unless a warranty or assumption of liability accompanies a\ncopy of the Program in return for a fee.\n\n                     END OF TERMS AND CONDITIONS\n\n            How to Apply These Terms to Your New Programs\n\n  If you develop a new program, and you want it to be of the greatest\npossible use to the public, the best way to achieve this is to make it\nfree software which everyone can redistribute and change under these terms.\n\n  To do so, attach the following notices to the program.  It is safest\nto attach them to the start of each source file to most effectively\nstate the exclusion of warranty; and each file should have at least\nthe "copyright" line and a pointer to where the full notice is found.\n\n    EmulatorJS: RetroArch on the web\n    Copyright (C) 2022-2024  Ethan O\'Brien\n\n    This program is free software: you can redistribute it and/or modify\n    it under the terms of the GNU General Public License as published by\n    the Free Software Foundation, either version 3 of the License, or\n    (at your option) any later version.\n\n    This program is distributed in the hope that it will be useful,\n    but WITHOUT ANY WARRANTY; without even the implied warranty of\n    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n    GNU General Public License for more details.\n\n    You should have received a copy of the GNU General Public License\n    along with this program.  If not, see <https://www.gnu.org/licenses/>.\n\nAlso add information on how to contact you by electronic and paper mail.\n\n  If the program does terminal interaction, make it output a short\nnotice like this when it starts in an interactive mode:\n\n    EmulatorJS  Copyright (C) 2023-2025  Ethan O\'Brien\n    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w\'.\n    This is free software, and you are welcome to redistribute it\n    under certain conditions; type `show c\' for details.\n\nThe hypothetical commands `show w\' and `show c\' should show the appropriate\nparts of the General Public License.  Of course, your program\'s commands\nmight be different; for a GUI interface, you would use an "about box".\n\n  You should also get your employer (if you work as a programmer) or school,\nif any, to sign a "copyright disclaimer" for the program, if necessary.\nFor more information on this, and how to apply and follow the GNU GPL, see\n<https://www.gnu.org/licenses/>.\n\n  The GNU General Public License does not permit incorporating your program\ninto proprietary programs.  If your program is a subroutine library, you\nmay consider it more useful to permit linking proprietary applications with\nthe library.  If this is what you want to do, use the GNU Lesser General\nPublic License instead of this License.  But first, please read\n<https://www.gnu.org/licenses/why-not-lgpl.html>.\n';
    });

    if (emulator.config.buttonOpts) {
        if (emulator.config.buttonOpts.screenshot.visible === false) screenshot.setAttribute("hidden", "");
        if (emulator.config.buttonOpts.screenRecord.visible === false) startScreenRecording.setAttribute("hidden", "");
        if (emulator.config.buttonOpts.quickSave.visible === false) qSave.setAttribute("hidden", "");
        if (emulator.config.buttonOpts.quickLoad.visible === false) qLoad.setAttribute("hidden", "");
    }

    emulator.elements.contextmenu.appendChild(parent);

    emulator.elements.parent.appendChild(emulator.elements.contextmenu);
}


export function createBottomMenuBar() {
    emulator.elements.menu = emulator.createElement("div");

    //prevent weird glitch on some devices
    emulator.elements.menu.style.opacity = 0;
    emulator.on("start", (e) => {
        emulator.elements.menu.style.opacity = "";
    })
    emulator.elements.menu.classList.add("ejs_menu_bar");
    emulator.elements.menu.classList.add("ejs_menu_bar_hidden");

    let timeout = null;
    let ignoreEvents = false;
    const hide = () => {
        if (emulator.paused || emulator.settingsMenuOpen || emulator.disksMenuOpen) return;
        emulator.elements.menu.classList.add("ejs_menu_bar_hidden");
    }

    const show = () => {
        clearTimeout(timeout);
        timeout = setTimeout(hide, 3000);
        emulator.elements.menu.classList.remove("ejs_menu_bar_hidden");
    }

    emulator.menu = {
        close: () => {
            clearTimeout(timeout);
            emulator.elements.menu.classList.add("ejs_menu_bar_hidden");
        },
        open: (force) => {
            if (!emulator.started && force !== true) return;
            clearTimeout(timeout);
            if (force !== true) timeout = setTimeout(hide, 3000);
            emulator.elements.menu.classList.remove("ejs_menu_bar_hidden");
        },
        toggle: () => {
            if (!emulator.started) return;
            clearTimeout(timeout);
            if (emulator.elements.menu.classList.contains("ejs_menu_bar_hidden")) {
                timeout = setTimeout(hide, 3000);
            }
            emulator.elements.menu.classList.toggle("ejs_menu_bar_hidden");
        }
    }

    emulator.createBottomMenuBarListeners = () => {
        const clickListener = (e) => {
            if (e.pointerType === "touch") return;
            if (!emulator.started || ignoreEvents || document.pointerLockElement === emulator.canvas) return;
            if (emulator.isPopupOpen()) return;
            show();
        }
        const mouseListener = (e) => {
            if (!emulator.started || ignoreEvents || document.pointerLockElement === emulator.canvas) return;
            if (emulator.isPopupOpen()) return;
            const deltaX = e.movementX;
            const deltaY = e.movementY;
            const threshold = emulator.elements.menu.offsetHeight + 30;
            const mouseY = e.clientY;

            if (mouseY >= window.innerHeight - threshold) {
                show();
                return;
            }
            let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            if (angle < 0) angle += 360;
            if (angle < 85 || angle > 95) return;
            show();
        }
        if (emulator.menu.mousemoveListener) emulator.removeEventListener(emulator.menu.mousemoveListener);

        if ((emulator.preGetSetting("menubarBehavior") || "downward") === "downward") {
            emulator.menu.mousemoveListener = emulator.addEventListener(emulator.elements.parent, "mousemove", mouseListener);
        } else {
            emulator.menu.mousemoveListener = emulator.addEventListener(emulator.elements.parent, "mousemove", clickListener);
        }

        emulator.addEventListener(emulator.elements.parent, "click", clickListener);
    }
    emulator.createBottomMenuBarListeners();

    emulator.elements.parent.appendChild(emulator.elements.menu);

    let tmout;
    emulator.addEventListener(emulator.elements.parent, "mousedown touchstart", (e) => {
        if (emulator.isChild(emulator.elements.menu, e.target) || emulator.isChild(emulator.elements.menuToggle, e.target)) return;
        if (!emulator.started || emulator.elements.menu.classList.contains("ejs_menu_bar_hidden") || emulator.isPopupOpen()) return;
        const width = emulator.elements.parent.getBoundingClientRect().width;
        if (width > 575) return;
        clearTimeout(tmout);
        tmout = setTimeout(() => {
            ignoreEvents = false;
        }, 2000)
        ignoreEvents = true;
        emulator.menu.close();
    })

    let paddingSet = false;
    //Now add buttons
    const addButton = (buttonConfig, callback, element, both) => {
        const button = emulator.createElement("button");
        button.type = "button";
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("role", "presentation");
        svg.setAttribute("focusable", "false");
        svg.innerHTML = buttonConfig.icon;
        const text = emulator.createElement("span");
        text.innerText = emulator.localization(buttonConfig.displayName);
        if (paddingSet) text.classList.add("ejs_menu_text_right");
        text.classList.add("ejs_menu_text");

        button.classList.add("ejs_menu_button");
        button.appendChild(svg);
        button.appendChild(text);
        if (element) {
            element.appendChild(button);
        } else {
            emulator.elements.menu.appendChild(button);
        }
        if (callback instanceof Function) {
            emulator.addEventListener(button, "click", callback);
        }

        if (buttonConfig.callback instanceof Function) {
            emulator.addEventListener(button, "click", buttonConfig.callback);
        }
        return both ? [button, svg, text] : button;
    }

    const restartButton = addButton(emulator.config.buttonOpts.restart, () => {
        if (emulator.isNetplay && emulator.netplay.owner) {
            emulator.gameManager.restart();
            emulator.netplay.reset();
            emulator.netplay.sendMessage({ restart: true });
            emulator.play();
        } else if (!emulator.isNetplay) {
            emulator.gameManager.restart();
        }
    });
    const pauseButton = addButton(emulator.config.buttonOpts.pause, () => {
        if (emulator.isNetplay && emulator.netplay.owner) {
            emulator.pause();
            emulator.gameManager.saveSaveFiles();
            emulator.netplay.sendMessage({ pause: true });
        } else if (!emulator.isNetplay) {
            emulator.pause();
        }
    });
    const playButton = addButton(emulator.config.buttonOpts.play, () => {
        if (emulator.isNetplay && emulator.netplay.owner) {
            emulator.play();
            emulator.netplay.sendMessage({ play: true });
        } else if (!emulator.isNetplay) {
            emulator.play();
        }
    });
    playButton.style.display = "none";
    emulator.togglePlaying = (dontUpdate) => {
        emulator.paused = !emulator.paused;
        if (!dontUpdate) {
            if (emulator.paused) {
                pauseButton.style.display = "none";
                playButton.style.display = "";
            } else {
                pauseButton.style.display = "";
                playButton.style.display = "none";
            }
        }
        emulator.gameManager.toggleMainLoop(emulator.paused ? 0 : 1);

        //I now realize its not easy to pause it while the cursor is locked, just in case I guess
        if (emulator.enableMouseLock) {
            if (emulator.canvas.exitPointerLock) {
                emulator.canvas.exitPointerLock();
            } else if (emulator.canvas.mozExitPointerLock) {
                emulator.canvas.mozExitPointerLock();
            }
        }
    }
    emulator.play = (dontUpdate) => {
        if (emulator.paused) emulator.togglePlaying(dontUpdate);
    }
    emulator.pause = (dontUpdate) => {
        if (!emulator.paused) emulator.togglePlaying(dontUpdate);
    }

    let stateUrl;
    const saveState = addButton(emulator.config.buttonOpts.saveState, async () => {
        let state;
        try {
            state = emulator.gameManager.getState();
        } catch (e) {
            emulator.displayMessage(emulator.localization("FAILED TO SAVE STATE"));
            return;
        }
        const { screenshot, format } = await emulator.takeScreenshot(emulator.capture.photo.source, emulator.capture.photo.format, emulator.capture.photo.upscale);
        const called = emulator.callEvent("saveState", {
            screenshot: screenshot,
            format: format,
            state: state
        });
        if (called > 0) return;
        if (stateUrl) URL.revokeObjectURL(stateUrl);
        if (emulator.getSettingValue("save-state-location") === "browser" && emulator.saveInBrowserSupported()) {
            emulator.storage.states.put(emulator.getBaseFileName() + ".state", state);
            emulator.displayMessage(emulator.localization("SAVE SAVED TO BROWSER"));
        } else {
            const blob = new Blob([state]);
            stateUrl = URL.createObjectURL(blob);
            const a = emulator.createElement("a");
            a.href = stateUrl;
            a.download = emulator.getBaseFileName() + ".state";
            a.click();
        }
    });
    const loadState = addButton(emulator.config.buttonOpts.loadState, async () => {
        const called = emulator.callEvent("loadState");
        if (called > 0) return;
        if (emulator.getSettingValue("save-state-location") === "browser" && emulator.saveInBrowserSupported()) {
            emulator.storage.states.get(emulator.getBaseFileName() + ".state").then(e => {
                emulator.gameManager.loadState(e);
                emulator.displayMessage(emulator.localization("SAVE LOADED FROM BROWSER"));
            })
        } else {
            const file = await emulator.selectFile();
            const state = new Uint8Array(await file.arrayBuffer());
            emulator.gameManager.loadState(state);
        }
    });
    const controlMenu = addButton(emulator.config.buttonOpts.gamepad, () => {
        emulator.controlMenu.style.display = "";
    });
    const cheatMenu = addButton(emulator.config.buttonOpts.cheat, () => {
        emulator.cheatMenu.style.display = "";
    });

    const cache = addButton(emulator.config.buttonOpts.cacheManager, () => {
        emulator.openCacheMenu();
    });

    if (emulator.config.disableDatabases) cache.style.display = "none";

    let savUrl;

    const saveSavFiles = addButton(emulator.config.buttonOpts.saveSavFiles, async () => {
        const file = await emulator.gameManager.getSaveFile();
        const { screenshot, format } = await emulator.takeScreenshot(emulator.capture.photo.source, emulator.capture.photo.format, emulator.capture.photo.upscale);
        const called = emulator.callEvent("saveSave", {
            screenshot: screenshot,
            format: format,
            save: file
        });
        if (called > 0) return;
        const blob = new Blob([file]);
        savUrl = URL.createObjectURL(blob);
        const a = emulator.createElement("a");
        a.href = savUrl;
        a.download = emulator.gameManager.getSaveFilePath().split("/").pop();
        a.click();
    });
    const loadSavFiles = addButton(emulator.config.buttonOpts.loadSavFiles, async () => {
        const called = emulator.callEvent("loadSave");
        if (called > 0) return;
        const file = await emulator.selectFile();
        const sav = new Uint8Array(await file.arrayBuffer());
        const path = emulator.gameManager.getSaveFilePath();
        const paths = path.split("/");
        let cp = "";
        for (let i = 0; i < paths.length - 1; i++) {
            if (paths[i] === "") continue;
            cp += "/" + paths[i];
            if (!emulator.gameManager.FS.analyzePath(cp).exists) emulator.gameManager.FS.mkdir(cp);
        }
        if (emulator.gameManager.FS.analyzePath(path).exists) emulator.gameManager.FS.unlink(path);
        emulator.gameManager.FS.writeFile(path, sav);
        emulator.gameManager.loadSaveFiles();
    });
    const netplay = addButton(emulator.config.buttonOpts.netplay, async () => {
        emulator.openNetplayMenu();
    });

    // add custom buttons
    // get all elements from emulator.config.buttonOpts with custom: true
    if (emulator.config.buttonOpts) {
        for (const [key, value] of Object.entries(emulator.config.buttonOpts)) {
            if (value.custom === true) {
                const customBtn = addButton(value);
            }
        }
    }

    const spacer = emulator.createElement("span");
    spacer.classList.add("ejs_menu_bar_spacer");
    emulator.elements.menu.appendChild(spacer);
    paddingSet = true;

    const volumeSettings = emulator.createElement("div");
    volumeSettings.classList.add("ejs_volume_parent");
    const muteButton = addButton(emulator.config.buttonOpts.mute, () => {
        muteButton.style.display = "none";
        unmuteButton.style.display = "";
        emulator.muted = true;
        emulator.setVolume(0);
    }, volumeSettings);
    const unmuteButton = addButton(emulator.config.buttonOpts.unmute, () => {
        if (emulator.volume === 0) emulator.volume = 0.5;
        muteButton.style.display = "";
        unmuteButton.style.display = "none";
        emulator.muted = false;
        emulator.setVolume(emulator.volume);
    }, volumeSettings);
    unmuteButton.style.display = "none";

    const volumeSlider = emulator.createElement("input");
    volumeSlider.setAttribute("data-range", "volume");
    volumeSlider.setAttribute("type", "range");
    volumeSlider.setAttribute("min", 0);
    volumeSlider.setAttribute("max", 1);
    volumeSlider.setAttribute("step", 0.01);
    volumeSlider.setAttribute("autocomplete", "off");
    volumeSlider.setAttribute("role", "slider");
    volumeSlider.setAttribute("aria-label", "Volume");
    volumeSlider.setAttribute("aria-valuemin", 0);
    volumeSlider.setAttribute("aria-valuemax", 100);

    emulator.setVolume = (volume) => {
        emulator.saveSettings();
        emulator.muted = (volume === 0);
        volumeSlider.value = volume;
        volumeSlider.setAttribute("aria-valuenow", volume * 100);
        volumeSlider.setAttribute("aria-valuetext", (volume * 100).toFixed(1) + "%");
        volumeSlider.setAttribute("style", "--value: " + volume * 100 + "%;margin-left: 5px;position: relative;z-index: 2;");
        if (emulator.Module.AL && emulator.Module.AL.currentCtx && emulator.Module.AL.currentCtx.sources) {
            emulator.Module.AL.currentCtx.sources.forEach(e => {
                e.gain.gain.value = volume;
            })
        }
        if (!emulator.config.buttonOpts || emulator.config.buttonOpts.mute !== false) {
            unmuteButton.style.display = (volume === 0) ? "" : "none";
            muteButton.style.display = (volume === 0) ? "none" : "";
        }
    }

    emulator.addEventListener(volumeSlider, "change mousemove touchmove mousedown touchstart mouseup", (e) => {
        setTimeout(() => {
            const newVal = parseFloat(volumeSlider.value);
            if (newVal === 0 && emulator.muted) return;
            emulator.volume = newVal;
            emulator.setVolume(emulator.volume);
        }, 5);
    })

    if (!emulator.config.buttonOpts || emulator.config.buttonOpts.volume !== false) {
        volumeSettings.appendChild(volumeSlider);
    }

    emulator.elements.menu.appendChild(volumeSettings);

    const contextMenuButton = addButton(emulator.config.buttonOpts.contextMenu, () => {
        if (emulator.elements.contextmenu.style.display === "none") {
            emulator.elements.contextmenu.style.display = "block";
            emulator.elements.contextmenu.style.left = (getComputedStyle(emulator.elements.parent).width.split("px")[0] / 2 - getComputedStyle(emulator.elements.contextmenu).width.split("px")[0] / 2) + "px";
            emulator.elements.contextmenu.style.top = (getComputedStyle(emulator.elements.parent).height.split("px")[0] / 2 - getComputedStyle(emulator.elements.contextmenu).height.split("px")[0] / 2) + "px";
            setTimeout(emulator.menu.close.bind(emulator), 20);
        } else {
            emulator.elements.contextmenu.style.display = "none";
        }
    });

    emulator.diskParent = emulator.createElement("div");
    emulator.diskParent.id = "ejs_disksMenu";
    emulator.disksMenuOpen = false;
    const diskButton = addButton(emulator.config.buttonOpts.diskButton, () => {
        emulator.disksMenuOpen = !emulator.disksMenuOpen;
        diskButton[1].classList.toggle("ejs_svg_rotate", emulator.disksMenuOpen);
        emulator.disksMenu.style.display = emulator.disksMenuOpen ? "" : "none";
        diskButton[2].classList.toggle("ejs_disks_text", emulator.disksMenuOpen);
    }, emulator.diskParent, true);
    emulator.elements.menu.appendChild(emulator.diskParent);
    emulator.closeDisksMenu = () => {
        if (!emulator.disksMenu) return;
        emulator.disksMenuOpen = false;
        diskButton[1].classList.toggle("ejs_svg_rotate", emulator.disksMenuOpen);
        diskButton[2].classList.toggle("ejs_disks_text", emulator.disksMenuOpen);
        emulator.disksMenu.style.display = "none";
    }
    emulator.addEventListener(emulator.elements.parent, "mousedown touchstart", (e) => {
        if (emulator.isChild(emulator.disksMenu, e.target)) return;
        if (e.pointerType === "touch") return;
        if (e.target === diskButton[0] || e.target === diskButton[2]) return;
        emulator.closeDisksMenu();
    })

    emulator.settingParent = emulator.createElement("div");
    emulator.settingsMenuOpen = false;
    const settingButton = addButton(emulator.config.buttonOpts.settings, () => {
        emulator.settingsMenuOpen = !emulator.settingsMenuOpen;
        settingButton[1].classList.toggle("ejs_svg_rotate", emulator.settingsMenuOpen);
        emulator.settingsMenu.style.display = emulator.settingsMenuOpen ? "" : "none";
        settingButton[2].classList.toggle("ejs_settings_text", emulator.settingsMenuOpen);
    }, emulator.settingParent, true);
    emulator.elements.menu.appendChild(emulator.settingParent);
    emulator.closeSettingsMenu = () => {
        if (!emulator.settingsMenu) return;
        emulator.settingsMenuOpen = false;
        settingButton[1].classList.toggle("ejs_svg_rotate", emulator.settingsMenuOpen);
        settingButton[2].classList.toggle("ejs_settings_text", emulator.settingsMenuOpen);
        emulator.settingsMenu.style.display = "none";
    }
    emulator.addEventListener(emulator.elements.parent, "mousedown touchstart", (e) => {
        if (emulator.isChild(emulator.settingsMenu, e.target)) return;
        if (e.pointerType === "touch") return;
        if (e.target === settingButton[0] || e.target === settingButton[2]) return;
        emulator.closeSettingsMenu();
    })

    emulator.addEventListener(emulator.canvas, "click", (e) => {
        if (e.pointerType === "touch") return;
        if (emulator.enableMouseLock && !emulator.paused) {
            if (emulator.canvas.requestPointerLock) {
                emulator.canvas.requestPointerLock();
            } else if (emulator.canvas.mozRequestPointerLock) {
                emulator.canvas.mozRequestPointerLock();
            }
            emulator.menu.close();
        }
    })

    const enter = addButton(emulator.config.buttonOpts.enterFullscreen, () => {
        emulator.toggleFullscreen(true);
    });
    const exit = addButton(emulator.config.buttonOpts.exitFullscreen, () => {
        emulator.toggleFullscreen(false);
    });
    exit.style.display = "none";

    emulator.toggleFullscreen = (fullscreen) => {
        if (fullscreen) {
            if (emulator.elements.parent.requestFullscreen) {
                emulator.elements.parent.requestFullscreen();
            } else if (emulator.elements.parent.mozRequestFullScreen) {
                emulator.elements.parent.mozRequestFullScreen();
            } else if (emulator.elements.parent.webkitRequestFullscreen) {
                emulator.elements.parent.webkitRequestFullscreen();
            } else if (emulator.elements.parent.msRequestFullscreen) {
                emulator.elements.parent.msRequestFullscreen();
            }
            exit.style.display = "";
            enter.style.display = "none";
            if (isMobile) {
                try {
                    screen.orientation.lock(emulator.getCore(true) === "nds" ? "portrait" : "landscape").catch(e => { });
                } catch (e) { }
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            exit.style.display = "none";
            enter.style.display = "";
            if (isMobile) {
                try {
                    screen.orientation.unlock();
                } catch (e) { }
            }
        }
    }

    let exitMenuIsOpen = false;
    const exitEmulation = addButton(emulator.config.buttonOpts.exitEmulation, async () => {
        if (exitMenuIsOpen) return;
        exitMenuIsOpen = true;
        const popups = emulator.createSubPopup();
        emulator.game.appendChild(popups[0]);
        popups[1].classList.add("ejs_cheat_parent");
        popups[1].style.width = "100%";
        const popup = popups[1];
        const header = emulator.createElement("div");
        header.classList.add("ejs_cheat_header");
        const title = emulator.createElement("h2");
        title.innerText = emulator.localization("Are you sure you want to exit?");
        title.classList.add("ejs_cheat_heading");
        const close = emulator.createElement("button");
        close.classList.add("ejs_cheat_close");
        header.appendChild(title);
        header.appendChild(close);
        popup.appendChild(header);
        emulator.addEventListener(close, "click", (e) => {
            exitMenuIsOpen = false
            popups[0].remove();
        })
        popup.appendChild(emulator.createElement("br"));

        const footer = emulator.createElement("footer");
        const submit = emulator.createElement("button");
        const closeButton = emulator.createElement("button");
        submit.innerText = emulator.localization("Exit");
        closeButton.innerText = emulator.localization("Cancel");
        submit.classList.add("ejs_button_button");
        closeButton.classList.add("ejs_button_button");
        submit.classList.add("ejs_popup_submit");
        closeButton.classList.add("ejs_popup_submit");
        submit.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
        footer.appendChild(submit);
        const span = emulator.createElement("span");
        span.innerText = " ";
        footer.appendChild(span);
        footer.appendChild(closeButton);
        popup.appendChild(footer);

        emulator.addEventListener(closeButton, "click", (e) => {
            popups[0].remove();
            exitMenuIsOpen = false
        })

        emulator.addEventListener(submit, "click", (e) => {
            popups[0].remove();
            const body = emulator.createPopup("EmulatorJS has exited", {});
            emulator.callEvent("exit");
        })
        setTimeout(emulator.menu.close.bind(emulator), 20);
    });

    emulator.addEventListener(document, "webkitfullscreenchange mozfullscreenchange fullscreenchange", (e) => {
        if (e.target !== emulator.elements.parent) return;
        if (document.fullscreenElement === null) {
            exit.style.display = "none";
            enter.style.display = "";
        } else {
            //not sure if this is possible, lets put it here anyways
            exit.style.display = "";
            enter.style.display = "none";
        }
    })

    const hasFullscreen = !!(emulator.elements.parent.requestFullscreen || emulator.elements.parent.mozRequestFullScreen || emulator.elements.parent.webkitRequestFullscreen || emulator.elements.parent.msRequestFullscreen);

    if (!hasFullscreen) {
        exit.style.display = "none";
        enter.style.display = "none";
    }

    emulator.elements.bottomBar = {
        playPause: [pauseButton, playButton],
        restart: [restartButton],
        settings: [settingButton],
        contextMenu: [contextMenuButton],
        fullscreen: [enter, exit],
        saveState: [saveState],
        loadState: [loadState],
        gamepad: [controlMenu],
        cheat: [cheatMenu],
        cacheManager: [cache],
        saveSavFiles: [saveSavFiles],
        loadSavFiles: [loadSavFiles],
        netplay: [netplay],
        exit: [exitEmulation]
    }

    if (emulator.config.buttonOpts) {
        if (emulator.debug) console.log(emulator.config.buttonOpts);
        if (emulator.config.buttonOpts.playPause.visible === false) {
            pauseButton.style.display = "none";
            playButton.style.display = "none";
        }
        if (emulator.config.buttonOpts.contextMenuButton === false && emulator.config.buttonOpts.rightClick !== false && isMobile === false) contextMenuButton.style.display = "none"
        if (emulator.config.buttonOpts.restart.visible === false) restartButton.style.display = "none"
        if (emulator.config.buttonOpts.settings.visible === false) settingButton[0].style.display = "none"
        if (emulator.config.buttonOpts.fullscreen.visible === false) {
            enter.style.display = "none";
            exit.style.display = "none";
        }
        if (emulator.config.buttonOpts.mute.visible === false) {
            muteButton.style.display = "none";
            unmuteButton.style.display = "none";
        }
        if (emulator.config.buttonOpts.saveState.visible === false) saveState.style.display = "none";
        if (emulator.config.buttonOpts.loadState.visible === false) loadState.style.display = "none";
        if (emulator.config.buttonOpts.saveSavFiles.visible === false) saveSavFiles.style.display = "none";
        if (emulator.config.buttonOpts.loadSavFiles.visible === false) loadSavFiles.style.display = "none";
        if (emulator.config.buttonOpts.gamepad.visible === false) controlMenu.style.display = "none";
        if (emulator.config.buttonOpts.cheat.visible === false) cheatMenu.style.display = "none";
        if (emulator.config.buttonOpts.cacheManager.visible === false) cache.style.display = "none";
        if (emulator.config.buttonOpts.netplay.visible === false) netplay.style.display = "none";
        if (emulator.config.buttonOpts.diskButton.visible === false) diskButton[0].style.display = "none";
        if (emulator.config.buttonOpts.volumeSlider.visible === false) volumeSlider.style.display = "none";
        if (emulator.config.buttonOpts.exitEmulation.visible === false) exitEmulation.style.display = "none";
    }

    emulator.menu.failedToStart = () => {
        if (!emulator.config.buttonOpts) emulator.config.buttonOpts = {};
        emulator.config.buttonOpts.mute = false;

        settingButton[0].style.display = "";

        // Hide all except settings button.
        pauseButton.style.display = "none";
        playButton.style.display = "none";
        contextMenuButton.style.display = "none";
        restartButton.style.display = "none";
        enter.style.display = "none";
        exit.style.display = "none";
        muteButton.style.display = "none";
        unmuteButton.style.display = "none";
        saveState.style.display = "none";
        loadState.style.display = "none";
        saveSavFiles.style.display = "none";
        loadSavFiles.style.display = "none";
        controlMenu.style.display = "none";
        cheatMenu.style.display = "none";
        cache.style.display = "none";
        netplay.style.display = "none";
        diskButton[0].style.display = "none";
        volumeSlider.style.display = "none";
        exitEmulation.style.display = "none";

        emulator.elements.menu.style.opacity = "";
        emulator.elements.menu.style.background = "transparent";
        emulator.virtualGamepad.style.display = "none";
        settingButton[0].classList.add("shadow");
        emulator.menu.open(true);
    }
}






export function createCheatsMenu(emulator) {
    const body = emulator.createPopup("Cheats", {
        "Add Cheat": () => {
            const popups = emulator.createSubPopup();
            emulator.cheatMenu.appendChild(popups[0]);
            popups[1].classList.add("ejs_cheat_parent");
            popups[1].style.width = "100%";
            const popup = popups[1];
            const header = emulator.createElement("div");
            header.classList.add("ejs_cheat_header");
            const title = emulator.createElement("h2");
            title.innerText = emulator.localization("Add Cheat Code");
            title.classList.add("ejs_cheat_heading");
            const close = emulator.createElement("button");
            close.classList.add("ejs_cheat_close");
            header.appendChild(title);
            header.appendChild(close);
            popup.appendChild(header);
            emulator.addEventListener(close, "click", (e) => {
                popups[0].remove();
            })

            const main = emulator.createElement("div");
            main.classList.add("ejs_cheat_main");
            const header3 = emulator.createElement("strong");
            header3.innerText = emulator.localization("Code");
            main.appendChild(header3);
            main.appendChild(emulator.createElement("br"));
            const mainText = emulator.createElement("textarea");
            mainText.classList.add("ejs_cheat_code");
            mainText.style.width = "100%";
            mainText.style.height = "80px";
            main.appendChild(mainText);
            main.appendChild(emulator.createElement("br"));
            const header2 = emulator.createElement("strong");
            header2.innerText = emulator.localization("Description");
            main.appendChild(header2);
            main.appendChild(emulator.createElement("br"));
            const mainText2 = emulator.createElement("input");
            mainText2.type = "text";
            mainText2.classList.add("ejs_cheat_code");
            main.appendChild(mainText2);
            main.appendChild(emulator.createElement("br"));
            popup.appendChild(main);

            const footer = emulator.createElement("footer");
            const submit = emulator.createElement("button");
            const closeButton = emulator.createElement("button");
            submit.innerText = emulator.localization("Submit");
            closeButton.innerText = emulator.localization("Close");
            submit.classList.add("ejs_button_button");
            closeButton.classList.add("ejs_button_button");
            submit.classList.add("ejs_popup_submit");
            closeButton.classList.add("ejs_popup_submit");
            submit.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
            footer.appendChild(submit);
            const span = emulator.createElement("span");
            span.innerText = " ";
            footer.appendChild(span);
            footer.appendChild(closeButton);
            popup.appendChild(footer);

            emulator.addEventListener(submit, "click", (e) => {
                if (!mainText.value.trim() || !mainText2.value.trim()) return;
                popups[0].remove();
                emulator.cheats.push({
                    code: mainText.value,
                    desc: mainText2.value,
                    checked: false
                });
                emulator.updateCheatUI();
                emulator.saveSettings();
            })
            emulator.addEventListener(closeButton, "click", (e) => {
                popups[0].remove();
            })
        },
        "Close": () => {
            emulator.cheatMenu.style.display = "none";
        }
    }, true);
    emulator.cheatMenu = body.parentElement;
    emulator.cheatMenu.getElementsByTagName("h4")[0].style["padding-bottom"] = "0px";
    const msg = emulator.createElement("div");
    msg.style["padding-top"] = "0px";
    msg.style["padding-bottom"] = "15px";
    msg.innerText = emulator.localization("Note that some cheats require a restart to disable");
    body.appendChild(msg);
    const rows = emulator.createElement("div");
    body.appendChild(rows);
    rows.classList.add("ejs_cheat_rows");
    emulator.elements.cheatRows = rows;
}





export function createStartButton(emulator) {
    const button = emulator.createElement("div");
    button.classList.add("ejs_start_button");
    let border = 0;
    if (typeof emulator.config.backgroundImg === "string") {
        button.classList.add("ejs_start_button_border");
        border = 1;
    }
    button.innerText = (typeof emulator.config.startBtnName === "string") ? emulator.config.startBtnName : emulator.localization("Start Game");
    if (emulator.config.alignStartButton == "top") {
        button.style.bottom = "calc(100% - 20px)";
    } else if (emulator.config.alignStartButton == "center") {
        button.style.bottom = "calc(50% + 22.5px + " + border + "px)";
    }
    emulator.elements.parent.appendChild(button);
    emulator.addEventListener(button, "touchstart", () => {
        emulator.touch = true;
    })
    emulator.addEventListener(button, "click", emulator.startButtonClicked.bind(emulator));

}
