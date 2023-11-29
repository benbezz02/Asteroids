function Asteroid(points) {
    this.points = points;
    this.speed = 0
    this.angularVel = 0
};

function SmallAsteroid() {
    Asteroid.call(this, 100);

    SmallAsteroid.speed = 150;
};

function MediumAsteroid() {
    Asteroid.call(this, 50);
};

function LargeAsteroid() {
    Asteroid.call(this, 20);
};