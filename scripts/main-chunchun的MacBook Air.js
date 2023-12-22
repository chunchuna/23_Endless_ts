// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";
import * as GameDebug from "./Game/DebugTemp/DebugTemp.js";
runOnStartup(async (runtime) => {
    // Code to run on the loading screen.
    // Note layouts, objects etc. are not yet available.
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});
async function OnBeforeProjectStart(runtime) {
    // Code to run just before 'On start of layout' on
    // the first layout. Loading has finished and initial
    // instances are created and available to use here.
    runtime.addEventListener("tick", () => Tick(runtime));
    runtime.addEventListener("tick", () => GameDebug.Tick(runtime));
    runtime.getLayout("Game").addEventListener("beforelayoutstart", () => GameDebug.OnLayoutStrat(runtime));
}
function Tick(runtime) {
    // Code to run every tick
}
