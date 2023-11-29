const STATES = {
    ATTRACT_MODE: "Attract Mode",
    GAMEPLAY_MODE: "Gameplay Mode",
    GAME_OVER_MODE: "Game Over Mode",
};

var main = function () {
    // Get reference to canvas
    var canvas = document.getElementById("canvas-cg-lab");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.aspect = canvas.width / canvas.height;

    // Assign context to gl
    var gl = null;
    try { gl = canvas.getContext("experimental-webgl", { antialias: true }); }
    catch (e) { alert("No webGL compatibility detected!"); return false; }

    game(gl, canvas);
}