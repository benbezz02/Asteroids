const STATES = {
    ATTRACT_MODE: "Attract Mode",
    GAMEPLAY_MODE: "Gameplay Mode",
    GAME_OVER_MODE: "Game Over Mode",
    EXIT_STATE: "Exit"
};

function StateMachine() {
    this.currentState = STATES.ATTRACT_MODE;
}

StateMachine.prototype.changeState = function (state) {

    if (this.currentState == STATES.ATTRACT_MODE) {
        if (state == STATES.GAME_OVER_MODE) {
            console.error("Invalid state entered: ${state}");
        }
        this.currentState = state
    } else if (this.currentState == STATES.GAMEPLAY_MODE) {
        if (state == STATES.ATTRACT_MODE || state == STATES.EXIT_STATE) {
            console.error("Invalid state entered: ${state}");
        }
        this.currentState = state
    } else if (this.currentState == STATES.GAME_OVER_MODE) {
        if (state == STATES.EXIT_STATE) {
            console.error("Invalid state entered: ${state}");
        }
        this.currentState = state
    } else {
        console.error("Invalid state entered: ${state}");
    }

    console.log(this.currentState)
}

var main = function () {
    var gameStateMachine = new StateMachine();
    console.log(gameStateMachine.currentState)
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