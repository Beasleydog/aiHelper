//Display robot imports
const { initRobotIcon, setRobotShowing } = require("./utils/robotIcon");

//Schoology imports
const assignment = require("./Schoology/assignment.js");
const discussion = require("./Schoology/discussion.js");

//Google Docs imports
const fromSelection = require("./GoogleDocs/fromSelection.js");
const fullAuto = require("./GoogleDocs/fullAuto.js");

window.addEventListener("load", () => {
    if (window.top != window) return;

    let injected = false;
    console.log("before");
    switch (location.origin) {
        case "https://docs.google.com":
            if (fromSelection()) {
                injected = true;
            }
            break;
        case "https://ud.schoology.com":
            if (location.pathname.includes("/discussion/")) {
                if (discussion()) {
                    injected = true;
                }
            } else if (location.pathname.includes("/assignment/")) {
                if (assignment()) {
                    injected = true;
                }
            }
            break;
        default:
            break;
    }
    console.log("inected?", injected);
    if (injected) {
        initRobotIcon();
        setRobotShowing(true);
        setTimeout(() => {
            setRobotShowing(false);
        }, 1000);
    };
});

//Add little robot emoji popup in corner of screen when we inject something