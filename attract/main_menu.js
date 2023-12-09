var gameStateMachine = new StateMachine();

var start = function () {
    gameStateMachine.changeState(STATES.ATTRACT_MODE);
}

var start_game = function () {
    var menu = document.getElementById("gameMenu");

    menu.style.display = "none";
    document.body.style.background = "none";

    var canvas = document.createElement("canvas");
    canvas.id = "canvas-cg-lab";
    canvas.style.backgroundColor = "black";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.aspect = canvas.width / canvas.height;
    canvas.style.position = "absolute";

    document.body.appendChild(canvas);


    // Assign context to gl
    var gl = null;
    try { gl = canvas.getContext("experimental-webgl", { antialias: true }); }
    catch (e) { alert("No webGL compatibility detected!"); return false; }

    gameStateMachine.changeState(STATES.GAMEPLAY_MODE);
    game(gl, canvas);
}

var exit = function () {
    gameStateMachine.changeState(STATES.EXIT_STATE);
    window.location.href = "https://www.google.com";
}