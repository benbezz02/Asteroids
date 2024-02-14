var start = function () {
    gameStateMachine.changeState(STATES.ATTRACT_MODE);
}

var start_game_classic = function () {
    var canvas = document.getElementById("canvas");
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
    animateGame(gl, canvas);
}

var start_game_modern = function () {
    /*
    gameMode = GameModes.CLASSIC;

    if (gameMode === GameModes.CLASSIC) {
        var edge = vec4(0.0, 0.0, 0.0, 0.0);

        if (dot(vNormal, vec3(0, 0, 1)) < 0.7) {
            edge = vec4(1.0, 0.0, 0.0, 1.0);
        };

        gl_FragColor = edge;
    }*/

    var canvas = document.getElementById("canvas");
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
    animateGame(gl, canvas);
}

var start_no_player = function () {
    var canvas = document.getElementById("canvas");
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

    animateNoPlayerGame(gl, canvas);
}

var exit = function () {
    gameStateMachine.changeState(STATES.EXIT_STATE);
    window.location.href = "https://www.google.com";
}

var over = function () {
    gameStateMachine.changeState(STATES.GAME_OVER_MODE);
}