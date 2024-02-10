var start = function () {
    gameStateMachine.changeState(STATES.ATTRACT_MODE);
}

var start_game_classic = function () {
    var canvas = document.getElementById("canvas-classic");
    canvas.style.position = "absolute";
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.aspect = canvas.width / canvas.height;

    // Assign context to gl
    var gl = null;
    try { gl = canvas.getContext("experimental-webgl", { antialias: true }); }
    catch (e) { alert("No webGL compatibility detected!"); return false; }

    gameStateMachine.changeState(STATES.GAMEPLAY_MODE);
    animateClassicGame(gl, canvas);
}

var start_game_modern = function () {
    var canvas = document.getElementById("canvas-modern");
    canvas.style.position = "absolute";
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.aspect = canvas.width / canvas.height;

    // Assign context to gl
    var gl = null;
    try { gl = canvas.getContext("experimental-webgl", { antialias: true }); }
    catch (e) { alert("No webGL compatibility detected!"); return false; }

    gameStateMachine.changeState(STATES.GAMEPLAY_MODE);
    animateModernGame(gl, canvas);
}

var exit = function () {
    gameStateMachine.changeState(STATES.EXIT_STATE);
    window.location.href = "https://www.google.com";
}