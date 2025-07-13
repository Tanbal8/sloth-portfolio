var puzzle_div = document.querySelector(".puzzle-div2");
var animation_div =  document.querySelector(".animation2");
var all = [];
var changeable = true;
var timer;
// var timer_s_div = document.querySelector("");
// var timer_s_div = document.querySelector("");
var timer_m, timer_s;
var rowAndColumnNum = 4;
start_game();
function all_function() {
    for (let a = 0 ; a < all.length ; a++) {
        all[a].div.remove();
    }
    all = [];
    for (let a = 0 ; a < rowAndColumnNum ** 2 ; a++) {
        let x = (a + 1) % rowAndColumnNum;
        if (x == 0) x = rowAndColumnNum;
        let y = ((16 - a) + (x - 1)) / rowAndColumnNum;
        let number = a + 1;
        let div = document.createElement("div");
        puzzle_div.appendChild(div);
        all.push({x: x, y: y, number: number, div: div, value: 0, type: ''});
    }
}
function start_game() {
    all_function();
    for (let a = 0 ; a < rowAndColumnNum ** 2 ; a++) {
        all[a].value = 0;
        all[a].div.innerHTML = "";
        all[a].x_position = all[a].div.offsetLeft;
        all[a].y_position = all[a].div.offsetTop;
        all[a].div.onclick = function() {
            if (all[a].type == "number" && changeable) {
                let select_x = all[a].x;
                let select_y = all[a].y;
                let empty_x;
                let empty_y;
                for (let b = 0 ; b < 16 ; b++) {
                    if (all[b].type == "empty") {
                        empty_x = all[b].x;
                        empty_y = all[b].y;
                        if (select_x == empty_x) {
                            if (select_y > empty_y) {
                                for (let c = b ; c > a ; c -= 4) {
                                    move_function(all[c - 4], all[c]);
                                }
                            }
                            else if (select_y < empty_y) {
                                for (let c = b ; c < a ; c += 4) {
                                    move_function(all[c+4], all[c]);
                                }
                            }
                        }
                        if (select_y == empty_y) {
                            if (select_x > empty_x) {
                                for (let c = b ; c < a ; c++) {
                                    move_function(all[c+1], all[c]);
                                }
                            }
                            else if (select_x < empty_x) {
                                for (let c = b ; c > a ; c--) {
                                    move_function(all[c-1], all[c]);
                                }
                            }
    
                        }
                    }
                }
                let end_check = true;
                for (let c = 0 ; c < 15 ; c++) {
                    if (all[c].value != c + 1) {
                        end_check = false;
                    }
                }
                if (end_check) {
                    clearInterval(timer);
                    if(confirm(timer_m + " : " + timer_s + "\n" + "restart ?")) {
                        start_game();
                    }
                }
            }
        }
    }
    for (let a = 0 ; a < 16 ; a++) {
        number();
        function number() {
            let n = Math.floor((Math.random() * 16) + 1);
            let check = true;
            for (let b = 0 ; b < 16 ; b++) {
                if (all[b].value == n) {
                    check = false;
                }
            }
            if (check) {
                all[a].value = n;
                if (n == 16) {
                    all[a].div.classList.add("empty");
                    all[a].div.innerHTML = "";
                    all[a].type = "empty";
                }
                else {
                    all[a].div.classList.remove("empty");
                    all[a].div.innerHTML = n;
                    all[a].type = "number";
                }
            }
            else {
                number();
            }
        }
    }
    timer_s = 0;
    timer_m = 0;
    timer = setInterval(function() {
        timer_s++;
        if (timer_s >= 60) {
            timer_s = 0;
            timer_m++;
        }
    }, 1000);
}
function move_function(object1, object2) {
    changeable = false;
    setTimeout(function() {
        changeable = true;
    }, 100);
    let num1 = object1.number;
    let num2 = object2.number;
    let div1 = object1.div;
    let div2 = object2.div;
    let type1 = object1.type;
    let type2 = object2.type;
    let value1 = object1.value;
    let value2 = object2.value;
    all[num1-1].type = type2;
    all[num2-1].type = type1;
    all[num1-1].value = value2;
    all[num2-1].value = value1;
    div1.classList.add("empty");
    div2.classList.remove("empty");
    div2.innerHTML = value1;
    div1.innerHTML = "";
    let animation = document.createElement("div");
    animation.classList.add("animation-div");
    animation.style.width = div2.offsetWidth + "px";
    animation.style.height = div2.offsetHeight + "px";
    animation.style.top = object1.y_position + "px";
    animation.style.left = object1.x_position + "px";
    animation.innerHTML = value1;
    animation_div.appendChild(animation);
    setTimeout(function() {
        animation.style.top = object2.y_position + "px";
        animation.style.left = object2.x_position + "px";
    }, 10);
    div2.style.visibility = "hidden";
    setTimeout(function() {
        div2.style.visibility = "visible";
        setTimeout(function() {
            animation_div.innerHTML = "";
        }, 10)
    }, 110)
}