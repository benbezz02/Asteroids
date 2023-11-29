const STATES = {
    ATTRACT_MODE: "Attract Mode",
    GAMEPLAY_MODE: "Gameplay Mode",
    GAME_OVER_MODE: "Game Over Mode",
};

function StateMachine() {
    this.currentState = STATES.ATTRACT_MODE;
}

StateMachine.prototype.changeState = function (state) {
    if (STATES[state]) {
        this.currentState = state;
    } else {
        console.error(`Invalid state entered: ${state}`);
    }
}

var main = function () {
    var gameStateMachine = new StateMachine();

    // Get reference to canvas
    var canvas = document.getElementById("canvas-cg-lab");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.aspect = canvas.width / canvas.height;

    // Assign context to gl
    var gl = null;
    try { gl = canvas.getContext("experimental-webgl", { antialias: true }); }
    catch (e) { alert("No webGL compatibility detected!"); return false; }

    gameStateMachine.changeState(STATES.GAMEPLAY_MODE);
    game(gl, canvas);

}