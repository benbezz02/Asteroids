function Saucer(points) {
    this.points = points
};

Saucer.prototype.Spawn = function () {
    var randomNum = Math.random();

    if (randomNum > 0.75) {
        return true
    }
    else {
        return false
    }
}

Saucer.prototype.Shoot = function () {
    numSuccess = 0
    numFailure = 0

    for (let i = 0; i < 25; i++) {
        var randomNum = Math.random();

        if (randomNum > 0.5) {
            numSuccess++;
        }
        else {
            numFailure++;
        }
    }

    if (numSuccess > numFailure) {
        return true
    }
    else {
        return false
    }
}

function SmallSaucer() {
    Saucer.call(this, 1000);
};

function LargeSaucer() {
    Saucer.call(this, 200);
};