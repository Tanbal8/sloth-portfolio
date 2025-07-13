class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    scale() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    add(other) {
        if (typeof other == "number")
            return new Vector(this.x + other, this.y + other);
        else if (other instanceof Vector)
            return new Vector(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
        if (typeof other == "number")
            return new Vector(this.x - other, this.y - other);
        else if (other instanceof Vector)
            return new Vector(this.x - other.x, this.y - other.y);
    }
    multiply(other) {
        if (typeof other == "number")
            return new Vector(this.x * other, this.y * other);
    }
    unit() {
        return new Vector(this.x / this.scale(), this.y / this.scale());
    }
    to_string() {
        return `(${this.x},  ${this.y})`; 
    }
}
class Circle {
    constructor(radius, x, y, mass, background) {
        this.radius = radius;
        this.position = new Vector(x, y);
        this.mass = mass;
        this.div = document.createElement("div");
        this.div.style.borderRadius = "50%";
        this.div.style.width = (2 * radius) + "px";
        this.div.style.height = (2 * radius) + "px";
        this.div.style.top = y + "px";
        this.div.style.left = x + "px";
        this.velocity = new Vector(0, 0);
        this.div.style.background = background;
        Game.div.appendChild(this.div);
    }
}
class Timer {
    constructor() {
        this.centi_second = 0;
        this.second = 0;
        this.minute = 0;
    }
    set(minute, second, centi_second) {
        this.minute = minute;
        this.second = second;
        this.centi_second = centi_second;
    }
    start() {
        this.interval = setInterval(() => {
            this.centi_second--;
            if (this.centi_second < 0) {
                this.centi_second = 99;
                this.second--;
                if (this.second < 0) {
                    this.second = 99;
                    this.minute--;
                }
            }
            if ((this.minute == 0 && this.second == 0 && this.centi_second == 0) || (this.minute < 0 || this.second < 0 || this.centi_second < 0)) {
                this.end();
                this.stop();
            }
        }, 10);
    }
    stop() {
        clearInterval(this.interval)
    }
    to_string() {
        return ((this.minute < 10) ? "0" + this.minute : this.minute)  + " : " + ((this.second < 10) ? "0" + this.second : this.second) + " : " + ((this.centi_second < 10) ? "0" + this.centi_second : this.centi_second);
    }
}
var Game = {
    check: false,
    stop_check: false,
    div: document.getElementById("game-div"),
    piece_radius: 30,
    ball_radius: 15,
    goal_width: 45,
    goal_height: 200,
    piece_start_space: 20,
    first: true,
    min_speed: 0.03,
    friction: 1.0012,
    goal_delay: {timer: new Timer(), check: false},
    start_delay: {timer: new Timer(), check: false},
    start: function() {
        this.check = true;
        this.width = this.div.offsetWidth;
        this.height = this.div.offsetHeight;
        this.blue = new Circle(this.piece_radius, 0, 0, 3, "blue");
        this.red = new Circle(this.piece_radius, 0, 0, 3, "red");
        this.ball = new Circle(this.ball_radius, 0, 0, 1, "black");
        this.piece_speed = 3.5;
        this.ball.speed = 3;
        this.ball.start_max_degree = 40;
        this.ball.speed_factor = 1;
        this.blue.direction_key = {up: 'w', down: 's', right: 'd', left: 'a'};
        this.red.direction_key = {up: 'ArrowUp', down: 'ArrowDown', right: 'ArrowRight', left: 'ArrowLeft'};
        this.blue.score = 0;
        this.red.score = 0;
        this.blue.goal = {div: document.getElementById("blue-goal"), width: this.goal_width, height: this.goal_height};
        this.red.goal = {div: document.getElementById("red-goal"), width: this.goal_width, height: this.goal_height};
        this.blue.goal.div.style.width = this.blue.goal.width + "px";
        this.red.goal.div.style.width = this.red.goal.width + "px";
        this.blue.goal.div.style.height = this.blue.goal.height + "px";
        this.red.goal.div.style.height = this.red.goal.height + "px";
        let goal_size = parseFloat(window.getComputedStyle(this.blue.goal.div).borderWidth.slice(0, -2));
        this.blue.goal.width = this.blue.goal.div.offsetWidth - goal_size;
        this.red.goal.width = this.red.goal.div.offsetWidth - goal_size;
        this.blue.update = piece_update.bind(this.blue);
        this.red.update = piece_update.bind(this.red);
        this.ball.update = ball_update.bind(this.ball);
        this.blue.move = {up: false, down: false, right: false, left: false};
        this.red.move = {up: false, down: false, right: false, left: false};
        this.blue.div.classList.add("piece");
        this.red.div.classList.add("piece");
        this.blue.speed = this.piece_speed;
        this.red.speed = this.piece_speed;
        this.blue.collision_check = blue_collision_check.bind(this.blue);
        this.red.collision_check = red_collision_check.bind(this.red);
        this.reset();
    },
    stop: function() {
        this.check = 0;
        this.stop_check = 1;
        for (let key in this.blue.move) {
            this.blue.move[key] = false;
            this.red.move[key] = false;
        }
        if (this.goal_delay.check) this.goal_delay.timer.stop();
        else if (this.start_delay.check) this.start_delay.timer.stop();
    },
    continue: function() {
        this.stop_check = 0;
        if (this.goal_delay.check) this.goal_delay.timer.start();
        else if (this.start_delay.check) this.start_delay.timer.start();
        if (!this.goal_delay.check) {
            this.check = 1;
            if (!this.start_delay.check) this.interval();
        }
    },
    restart: function() {},
    interval: function() {
        this.blue.update();
        this.red.update();
        this.ball.update();
        if (this.check)
            requestAnimationFrame(this.interval.bind(this));
    },
    reset: function() {
        Game.check = 1;
        this.blue.position.x = this.piece_start_space; 
        this.blue.position.y = (this.height / 2) - this.piece_radius; 
        this.red.position.x = this.width - this.piece_start_space - (2 * this.piece_radius); 
        this.red.position.y = (this.height / 2) - this.piece_radius;
        this.ball.position.x = (this.width / 2) - this.ball.radius;
        this.ball.position.y = (this.height / 2) - this.ball.radius;
        this.ball.div.style.top = this.ball.position.y + "px";
        this.ball.div.style.left = this.ball.position.x + "px";
        this.blue.div.style.top = this.blue.position.y + "px";
        this.blue.div.style.left = this.blue.position.x + "px";
        this.red.div.style.top = this.red.position.y + "px";
        this.red.div.style.left = this.red.position.x + "px";
        let direction_x;
        if (this.first) {
            direction_x = ((Math.floor(Math.random() * 2)) ? 1 : -1);
        }
        else {
            //
            direction_x = ((Math.floor(Math.random() * 2)) ? 1 : -1);
        }
        let degree = Math.floor(Math.random() * (2 * this.ball.start_max_degree)) - this.ball.start_max_degree;
        let radiant = degree / 180 * Math.PI;
        Game.ball.velocity.x = Game.ball.speed * Math.cos(radiant);
        Game.ball.velocity.y = Game.ball.speed * Math.sin(radiant);
        Game.ball.velocity.x *= direction_x;
        Game.start_delay.check = true;
        Game.start_delay.timer.set(0, 1, 0);
        Game.start_delay.timer.start();
    }
}
Game.goal_delay.timer.end = function() {
    Game.goal_delay.check = false;
    Game.reset();
}
Game.start_delay.timer.end = function() {
    Game.start_delay.check = false;
    Game.interval();
}
window.onload = function() {
    Game.start();
}
window.onkeydown = function(e) {
    switch (e.key) {
        case Game.blue.direction_key.up :
            if (Game.check) Game.blue.move.up = true;
            break;
        case Game.blue.direction_key.down :
            if (Game.check) Game.blue.move.down = true;
            break;
        case Game.blue.direction_key.right :
            if (Game.check) Game.blue.move.right = true;
            break;
        case Game.blue.direction_key.left :
            if (Game.check) Game.blue.move.left = true;
            break;
        case Game.red.direction_key.up :
            if (Game.check) Game.red.move.up = true;
            break;
        case Game.red.direction_key.down :
            if (Game.check) Game.red.move.down = true;
            break;
        case Game.red.direction_key.right :
            if (Game.check) Game.red.move.right = true;
            break;
        case Game.red.direction_key.left :
            if (Game.check) Game.red.move.left = true;
            break;
        case "Escape" :
            if ((Game.check || Game.start_delay.check || Game.goal_delay.check) && !Game.stop_check) Game.stop();
            break;
        case "Enter" :
            if (Game.stop_check) Game.continue();
            break;
    }
}
window.onkeyup = function(e) {
    switch (e.key) {
        case Game.blue.direction_key.up :
            Game.blue.move.up = false;
            break;
        case Game.blue.direction_key.down :
            Game.blue.move.down = false;
            break;
        case Game.blue.direction_key.right :
            Game.blue.move.right = false;
            break;
        case Game.blue.direction_key.left :
            Game.blue.move.left = false;
            break;
        case Game.red.direction_key.up :
            Game.red.move.up = false;
            break;
        case Game.red.direction_key.down :
            Game.red.move.down = false;
            break;
        case Game.red.direction_key.right :
            Game.red.move.right = false;
            break;
        case Game.red.direction_key.left :
            Game.red.move.left = false;
            break;
    }
}
function piece_update() {
    let unit_velocity = new Vector(0, 0);
    if (this.move.up) unit_velocity.y--;
    if (this.move.down) unit_velocity.y++;
    if (this.move.right) unit_velocity.x++;
    if (this.move.left) unit_velocity.x--;
    this.velocity = unit_velocity.multiply((unit_velocity.x != 0 && unit_velocity.y != 0) ? Math.sqrt((this.speed ** 2) / 2) : this.speed);
    this.position = this.position.add(this.velocity);
    this.collision_check();
    this.div.style.top = this.position.y + "px";
    this.div.style.left = this.position.x + "px";
}
function ball_update() {
    if (Math.abs(this.velocity.x) < Game.min_speed) this.velocity.x = 0;
    if (Math.abs(this.velocity.y) < Game.min_speed) this.velocity.y = 0;
    if (Math.abs(this.velocity.x) > 0) this.velocity.x = this.velocity.x  / Game.friction;
    if (Math.abs(this.velocity.y ) > 0) this.velocity.y = this.velocity.y  / Game.friction;
    wall_collision(this);
    this.position = this.position.add(this.velocity);
    this.div.style.top = this.position.y + "px";
    this.div.style.left = this.position.x + "px";
}
function blue_collision_check() {
    wall_collision(this);
    // ball
    let dx = (this.position.x + this.radius) - (Game.ball.position.x + Game.ball_radius);
    let dy = (this.position.y + this.radius) - (Game.ball.position.y + Game.ball_radius);
    if (Math.sqrt((dx ** 2) + (dy ** 2)) <= this.radius + Game.ball.radius) ball_collision(this);
}
function red_collision_check() {
    wall_collision(this);
    // ball
    let dx = (this.position.x + this.radius) - (Game.ball.position.x + Game.ball_radius);
    let dy = (this.position.y + this.radius) - (Game.ball.position.y + Game.ball_radius);
    if (Math.sqrt((dx ** 2) + (dy ** 2)) <= this.radius + Game.ball.radius) ball_collision(this);
}
function ball_collision(piece) {
    let ball = Game.ball;
    let center1 = piece.position.add(piece.radius);
    let center2 = ball.position.add(ball.radius);
    let dx = center1.x - center2.x;
    let dy = center1.y - center2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < piece.radius + ball.radius) {
        let unit_normal = new Vector(dx / distance, dy / distance);
        let unit_tangent = new Vector(-unit_normal.y, unit_normal.x);
        let v1 = piece.velocity;
        let v2 = ball.velocity;
        let m1 = piece.mass;
        let m2 = ball.mass;
        let v1_n = unit_normal.x * v1.x + unit_normal.y * v1.y;
        let v1_t = unit_tangent.x * v1.x + unit_tangent.y * v1.y;
        let v2_n = unit_normal.x * v2.x + unit_normal.y * v2.y;
        let v2_t = unit_tangent.x * v2.x + unit_tangent.y * v2.y;
        let v1_n_f = (v1_n * (m1 - m2) + 2 * m2 * v2_n) / (m1 + m2);
        let v2_n_f = (v2_n * (m2 - m1) + 2 * m1 * v1_n) / (m1 + m2);
        let v1_n_vector = unit_normal.multiply(v1_n_f);
        let v1_t_vector = unit_tangent.multiply(v1_t);
        let v2_n_vector = unit_normal.multiply(v2_n_f);
        let v2_t_vector = unit_tangent.multiply(v2_t);
        piece.velocity = v1_n_vector.add(v1_t_vector);
        ball.velocity = v2_n_vector.add(v2_t_vector).multiply(Game.ball.speed_factor);
        let overlap = (piece.radius + ball.radius) - distance;
        let correction = unit_normal.multiply(overlap / 2 + 0.75);
        piece.position = piece.position.add(correction);
        ball.position = ball.position.subtract(correction);
    }
}
function wall_collision(other) {
    if (other.position.y <= 0) { // Horizontal Wall
        other.position.y = 0;
        other.velocity.y = (other == Game.ball) ? -other.velocity.y : 0;
    }
    else if (other.position.y + (other.radius * 2) >= Game.height) {
        other.position.y = Game.height - (other.radius * 2);
        other.velocity.y = (other == Game.ball) ? -other.velocity.y : 0;
    }
    switch (other) { // Vertival Wall
        case Game.ball :
            if (other.position.x <= 0) { // Left Wall
                let center_x = other.position.x + other.radius;
                let center_y = other.position.y + other.radius;
                let goal_top = (Game.height - Game.blue.goal.height) / 2;
                let goal_bottom = Game.height - goal_top;
                let closest_x1 = Math.max(-50, Math.min(0, center_x));
                let closest_y1 = Math.max(0, Math.min(goal_top, center_y));
                let dx1 = center_x - closest_x1;
                let dy1 = center_y - closest_y1;
                let distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
                if (distance1 <= other.radius) {
                    let normal = new Vector(dx1, dy1).unit();
                    let dot = other.velocity.x * normal.x + other.velocity.y * normal.y;
                    other.velocity.x -= 2 * dot * normal.x;
                    other.velocity.y -= 2 * dot * normal.y;
                }
                else {
                    let closest_x2 = Math.max(-50, Math.min(0, center_x));
                    let closest_y2 = Math.max(goal_bottom, Math.min(Game.height, center_y));
                    let dx2 = center_x - closest_x2;
                    let dy2 = center_y - closest_y2;
                    let distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                    if (distance2 <= other.radius) {
                        let normal = new Vector(dx2, dy2).unit();
                        let dot = other.velocity.x * normal.x + other.velocity.y * normal.y;
                        other.velocity.x -= 2 * dot * normal.x;
                        other.velocity.y -= 2 * dot * normal.y;
                    }
                }
                if (other.position.x <= -50) {
                    other.position.x = -50;
                    other.velocity.x = 0;
                    goal("red");
                }
            }
            else if (other.position.x + (other.radius * 2) >= Game.width) { // Right Wall
                let center_x = other.position.x + other.radius;
                let center_y = other.position.y + other.radius;
                let goal_top = (Game.height - Game.blue.goal.height) / 2;
                let goal_bottom = Game.height - goal_top;
                let closest_x1 = Math.max(Game.width, Math.min(Game.width + 50, center_x));
                let closest_y1 = Math.max(0, Math.min(goal_top, center_y));
                let dx1 = center_x - closest_x1;
                let dy1 = center_y - closest_y1;
                let distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
                if (distance1 <= other.radius) {
                    let normal = new Vector(dx1, dy1).unit();
                    let dot = other.velocity.x * normal.x + other.velocity.y * normal.y;
                    other.velocity.x -= 2 * dot * normal.x;
                    other.velocity.y -= 2 * dot * normal.y;
                }
                else {
                    let closest_x2 = Math.max(Game.width, Math.min(Game.width + 50, center_x));
                    let closest_y2 = Math.max(goal_bottom, Math.min(Game.height, center_y));
                    let dx2 = center_x - closest_x2;
                    let dy2 = center_y - closest_y2;
                    let distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                    if (distance2 <= other.radius) {
                        let normal = new Vector(dx2, dy2).unit();
                        let dot = other.velocity.x * normal.x + other.velocity.y * normal.y;
                        other.velocity.x -= 2 * dot * normal.x;
                        other.velocity.y -= 2 * dot * normal.y;
                    }
                }
                if (other.position.x + (other.radius * 2) >= Game.width + 50) {
                    other.position.x = Game.width + 50 - (other.radius * 2);
                    other.velocity.x = 0;
                    goal("blue");
                }
            }    
            break;
        case Game.blue :
            if (other.position.x <= 0) {
                other.position.x = 0;
                other.velocity.x = 0;
            }
            if (other.position.x + (other.radius * 2) >= (Game.width / 2) - 2.5) {
                other.position.x = ((Game.width / 2) - (other.radius * 2)) - 2.5;
                other.velocity.x = 0;
            }
            break;
        case Game.red :
            if (other.position.x <= (Game.width / 2) + 2.5) {
                other.position.x = (Game.width / 2) + 2.5;
                other.velocity.x = 0;
            }
            if (other.position.x + (other.radius * 2) >= Game.width) {
                other.position.x = Game.width - (other.radius * 2);
                other.velocity.x = 0;
            }
            break;
    }
}
window.onblur = function() { // User Left The Page
    Game.stop();
    for (let key in Game.blue.move) {
        Game.blue.move[key] = false;
        Game.red.move[key] = false;
    }
}
function goal(color) {
    switch (color) {
        case "blue" :
            Game.blue.score++;
            break;
        case "red" :
            Game.red.score++;
            break;
    }
    if (Game.first) Game.first = false;
    // console.clear();
    console.log("blue " + Game.blue.score + " - " + Game.red.score + " red");
    Game.goal_delay.check = true;
    Game.goal_delay.timer.set(0, 1, 0);
    Game.goal_delay.timer.start();
    Game.check = 0;
}