import Vector from '../../library/vector/vector.js';
class Character {
    constructor(width, height, position, background = 'blue') {
        this.width = width;
        this.height = height;
        this.position = position;
    }
}
class Obstacle {
    constructor() {}
}
const Obstacles = [];
const Game = {
    page: document.getElementById('game-page'),
    div: document.getElementById('game-div'),
    stop: {
        check: false
    },
    check: false,
    Start() {},
    End() {
    }
}
window.onload = () => {
    Game.width = Game.div.offsetWidth;
    Game.height = Game.div.offsetHeight;
    Game.character = new Character(100, 100, new Vector(100, 100));
    Game.Start();
    console.log(Game.character);
}
