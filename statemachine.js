const STATES = {
    ATTRACT_MODE: "Attract Mode",
    GAMEPLAY_MODE: "Gameplay Mode",
    GAME_OVER_MODE: "Game Over Mode",
    EXIT_STATE: "Exit"
};

function StateMachine() {
    this.currentState = null;
}

StateMachine.prototype.changeState = function (state) {

    if (this.currentState == STATES.ATTRACT_MODE) {
        if (state == STATES.GAME_OVER_MODE) {
            console.error("Invalid state entered: " + state);
        }
        this.currentState = state
    } else if (this.currentState == STATES.GAMEPLAY_MODE) {
        if (state == STATES.ATTRACT_MODE || state == STATES.EXIT_STATE) {
            console.error("Invalid state entered: " + state);
        }
        this.currentState = state
    } else if (this.currentState == STATES.GAME_OVER_MODE) {
        if (state == STATES.EXIT_STATE) {
            console.error("Invalid state entered: " + state);
        }
        this.currentState = state
    } else {
        console.error("Invalid state entered: " + state);
    }

    console.log(this.currentState)
}
