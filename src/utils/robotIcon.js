function initRobotIcon() {
    const ROBOT_DISPLAY = document.createElement("div");
    ROBOT_DISPLAY.innerText = "🤖";
    ROBOT_DISPLAY.style.all = "unset";
    Object.assign(ROBOT_DISPLAY.style, {
        "font-size": "45px",
        "position": "fixed",
        "transform": "rotate(45deg)",
        "transition": "all .2s cubic-bezier(.17,.67,.64,1.36)",
        "z-index": "1000000",
    });
    ROBOT_DISPLAY.id = "AI_HELPER_ROBOT_ICON";
    document.body.appendChild(ROBOT_DISPLAY);

    setRobotShowing(false);
}
function setRobotShowing(bool) {
    const ROBOT_DISPLAY = document.getElementById("AI_HELPER_ROBOT_ICON");
    if (bool) {
        ROBOT_DISPLAY.style.left = "-10px";
        ROBOT_DISPLAY.style.bottom = "-10px";
    } else {
        ROBOT_DISPLAY.style.left = "-70px";
        ROBOT_DISPLAY.style.bottom = "-70px";
    }
}
module.exports = { initRobotIcon, setRobotShowing }