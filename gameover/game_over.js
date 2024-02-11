var over = function () {
    gameStateMachine.changeState(STATES.GAME_OVER_MODE);
}

var gameover = function () {
    window.location.href = '/Asteroids/gameover/over.html';
    return
}
