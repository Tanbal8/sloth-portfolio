var game_div = document.getElementById("game-div");
var animation_div = document.getElementById("animation-div1");
var all = [];
var game_check = true;
var changeable = true;
var move_check = false;
var move_size = 30;
let touch_start_x;
let touch_start_y;
var move_timeout;
var double_timeout;
all_function();
start_game();
function all_function() {
    for (let a = 0 ; a < 16 ; a++) {
        let div = document.createElement("div");
        game_div.appendChild(div);
        let x = (a + 1) % 4;
        if (x == 0) x = 4;
        let y = (16 - a + x - 1) / 4;
        let x_position = div.offsetLeft;
        let y_position = div.offsetTop;
        all.push({x: x, y: y, div: div, type: "empty", value: 0, x_position: x_position, y_position: y_position, number: a + 1, changeable: true});
    }
}
function start_game() {
    for (let a = 0 ; a < 16 ; a++) {
        all[a].value = 0;
        all[a].type = "empty";
        all[a].div.innerHTML = '';
        all[a].div.style.backgroundColor = '';
    }
    add();
    add();
}
window.ontouchstart = function(e) {
    touch_start_x = e.changedTouches[0].screenX;
    touch_start_y = e.changedTouches[0].screenY;
}
window.ontouchend =  function(e) {
    let touch_end_x = e.changedTouches[0].screenX;
    let touch_end_y = e.changedTouches[0].screenY;
    let dx = touch_end_x - touch_start_x;
    let dy = touch_end_y - touch_start_y;
    for (let a = 0 ; a < 16 ; a++)
        all[a].changeable = true;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) right();
        else if (dx < -30) left();
    } 
    else {
        if (dy > 30) down();
        else if (dy < -30) up();
    }
}
function up() {
    if (changeable) {
        move_check = false;
        for (let x = 1 ; x <= 4 ; x++)
            for (let a = 0 ; a < 16 ; a++)
                if (all[a].x == x && all[a].type == "number") {
                        let empty_array = [];
                        for (let b = a ; b > -1 ; b--)
                            if (all[b].x == all[a].x && all[b].y > all[a].y)
                                if (all[b].type == "empty") {
                                    empty_array.push(all[b]);
                                    if (all[b].y == 4)
                                        target_function(all[a], empty_array);
                                }
                                else {
                                    if (all[a].value == all[b].value && all[b].changeable)
                                        double_function(a, b);
                                    else if (empty_array.length != 0)
                                        target_function(all[a], empty_array);
                                    break;
                                }
                }
        move_check_function();
    }
}
function down() {
    if (changeable) {
        move_check = false;
        for (let x = 1 ; x <= 4 ; x++)
            for (let a = 15 ; a > -1 ; a--)
                if (all[a].x == x && all[a].type == "number") {
                        let empty_array = [];
                        for (let b = a ; b < 16 ; b++)
                            if (all[b].x == all[a].x && all[b].y < all[a].y)
                                if (all[b].type == "empty") {
                                    empty_array.push(all[b]);
                                    if (all[b].y == 1)
                                        target_function(all[a], empty_array);
                                }
                                else {
                                    if (all[a].value == all[b].value && all[b].changeable)
                                        double_function(a, b);
                                    else if (empty_array.length != 0)
                                            target_function(all[a], empty_array);
                                    break;
                                }
        }
        move_check_function();
    }
}
function right() {
    if (changeable) {
        move_check = false;
        for (let y = 1 ; y <= 4 ; y++)
            for (let a = 15 ; a > -1 ; a--)
                if (all[a].y == y && all[a].type == "number") {
                        let empty_array = [];
                        for (let b = a ; b < 16 ; b++)
                            if (all[b].y == all[a].y && all[b].x > all[a].x)
                                if (all[b].type == "empty") {
                                    empty_array.push(all[b]);
                                    if (all[b].x == 4)
                                        target_function(all[a], empty_array);
                                }
                                else {
                                    if (all[a].value == all[b].value && all[b].changeable)
                                        double_function(a, b);
                                    else if (empty_array.length != 0)
                                            target_function(all[a], empty_array);
                                    break;
                                }
                }
        move_check_function();
    }
}
function left() {
    if (changeable) {
        move_check = false;
        for (let y = 1 ; y <= 4 ; y++)
            for (let a = 0 ; a < 16 ; a++)
                if (all[a].y == y && all[a].type == "number") {
                        let empty_array = [];
                        for (let b = a ; b > -1 ; b--)
                            if (all[b].y == all[a].y && all[b].x < all[a].x)
                                if (all[b].type == "empty") {
                                    empty_array.push(all[b]);
                                    if (all[b].x == 1)
                                        target_function(all[a], empty_array);
                                }
                                else {
                                    if (all[a].value == all[b].value && all[b].changeable)
                                        double_function(a, b);
                                    else if (empty_array.length != 0)
                                        target_function(all[a], empty_array);
                                    break;
                                }
                }
        move_check_function();
    }
}
function move_check_function() {
    if (move_check) {
        setTimeout(function() {
            add();
        }, 100);
    }
}
function target_function(object, array) {
    let target = array.pop();
    move_function(object, target)
}
function move_function(object1, object2) {
    if (!game_check) return;
    move_check = true;
    let num1 = object1.number - 1;
    let num2 = object2.number - 1;
    let value1 = object1.value;
    all[num2].value = value1;
    move_timeout = setTimeout(function() {
        all[num2].div.innerHTML = value1;
        background_function(object2.div, all[num2].value);
    }, 110);
    all[num2].type = "number";
    all[num1].type = "empty";
    all[num1].value = 0;
    all[num1].div.innerHTML = "";
    all[num1].div.style.backgroundColor = "";
    animation_function(object1, object2, num2);
}
function animation_function(object1, object2, number) {
    let animation = document.createElement("div");
    animation.style.top = object1.y_position + "px";
    animation.style.left = object1.x_position + "px";
    animation.style.width = object1.div.offsetWidth + "px";
    animation.style.height = object1.div.offsetHeight + "px";
    animation.innerHTML = all[number].value;
    animation.classList.add("animation");
    background_function(animation, all[number].value)
    animation_div.appendChild(animation);
    changeable = false;
    setTimeout(function() {
        animation.style.top = object2.y_position + "px";
        animation.style.left = object2.x_position + "px";
    }, 10);
    setTimeout(function() {
        animation_div.innerHTML = "";
        changeable = true;
    }, 120);
}
function double_function(a, b) {
    if (!game_check) return;
    move_check = true;
    all[a].value = 0;
    all[b].value *= 2;
    double_timeout = setTimeout(function() {
        all[b].div.innerHTML = all[b].value;
        background_function(all[b].div, all[b].value);
    }, 110);
    all[a].type = "empty";
    all[a].div.innerHTML = "";
    all[a].div.style.backgroundColor = "";
    animation_function(all[a], all[b], b);
    all[b].changeable = false;
}
function background_function(div, value) {
    switch (value) {
        case 2: div.style.backgroundColor = "#ffdaff"; break;
        case 4: div.style.backgroundColor = "#fdddad"; break;
        case 8: div.style.backgroundColor = "#feb856"; break;
        case 16: div.style.backgroundColor = "#ff9456"; break;
        case 32: div.style.backgroundColor = "#ff6d54"; break;
        case 64: div.style.backgroundColor = "#fe714d"; break;
        case 128: div.style.backgroundColor = "#fddb51"; break;
        case 256: div.style.backgroundColor = "#ffd960"; break;
        case 512: div.style.backgroundColor = "#ffda5a"; break;
        case 1024: div.style.backgroundColor = "#ffb657"; break;
        case 2048: div.style.backgroundColor = "#feb608"; break;
        case 4096: div.style.backgroundColor = "#ff9444"; break;
        case 8192: div.style.backgroundColor = "#ff5555"; break;
        case 16384: div.style.backgroundColor = "#ff00ff"; break; // رنگ دلخواه
        default: div.style.backgroundColor = "#cccccc"; break;
    }
}
function add() {
    let n = Math.floor(Math.random() * 16);
    if (all[n].type == "empty") {
        let chance = 12;
        let random = Math.floor((Math.random() * chance) + 1);
        let number = (random < chance) ? 2 : 4;
        all[n].type = "number";
        all[n].value = number;
        all[n].div.innerHTML = number;
        background_function(all[n].div, number);
        let empty_length = 0;
        for (let a = 0 ; a < 16 ; a++)
            if (all[a].type == "empty")
                empty_length++;
        if (empty_length == 0) {
            let check = true;
            for (let a = 0 ; a < 16 ; a++)
                for (let b = 0 ; b < 16 ; b++)
                    if ((all[a].x == all[b].x && all[a].y + 1 == all[b].y) || (all[a].x - 1 == all[b].x && all[a].y == all[b].y) || (all[a].x + 1 == all[b].x && all[a].y == all[b].y) || (all[a].x == all[b].x && all[a].y - 1 == all[b].y))
                        if (all[a].value == all[b].value) {
                            check = false;
                            break;
                        }
            if (check) {
                clearTimeout(move_timeout);
                clearTimeout(double_timeout);
                if (confirm("Game Over!\nrestart ?"))
                    start_game();
            }
        }
    }
    else add();
}
let startY = 0;
window.addEventListener('touchstart', function (e) {
  if (e.touches.length !== 1) return;
  startY = e.touches[0].clientY;
}, { passive: true });
window.addEventListener('touchmove', function (e) {
  const currentY = e.touches[0].clientY;
  const isPullingDown = currentY > startY;
  if (window.scrollY === 0 && isPullingDown&& e.cancelable)
    e.preventDefault();
}, { passive: false });