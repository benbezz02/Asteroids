function Player() {
    this.lives = 3
    this.name = null
    this.points = 0
    /*
    var quad = makeQuad(
        [[-5, -5, 0], [5, -5, 0], [5, 5, 0], [-5, 5, 0]],
        [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        [[0, 0], [1, 0], [1, 1], [0, 1]]);

    var player_model = new Model();
    player_model.name = "player";
    player_model.index = quad.index;
    player_model.vertex = quad.vertex;
    player_model.compile(scene);*/
}

Player.prototype.checkForMovement = function (event) {
    switch (event.keyCode) {
        // Space Bar
        case (32): {

        }
        // Up Arrow or W
        case (38 || 87): {

        }
        // Left Arrow or A
        case (37 || 65): {

        }
        // Right Arrow or D
        case (39 || 68): {

        }
        default: {

        }
    }
}