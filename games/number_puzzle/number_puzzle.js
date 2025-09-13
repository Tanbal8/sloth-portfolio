import Chronometer from '../../library/chronometer/chronometer.js';
class Cell {
    constructor(x, y, div, type = 'number', value = 0) {
        this.x = x;
        this.y = y;
        this.div = div;
        this.type = type;
        this.value = value;
        if (type == 'number') div.textContent = value;
        else div.setAttribute('id', 'empty');
    }
}
var Game = {
    check: false,
    delay_check: true,
    size: {
        row: 4,
        column: 4
    },
    chronometer: new Chronometer(document.getElementById('chronometer-minute'), document.getElementById('chronometer-second')),
    div: document.getElementById("game-div"),
    data: [],
    Start(size = this.size) {
        this.check = true;
        this.delay_check = false;
        Game.chronometer.Reset();
        for (let row of this.data)
            for (let cell of row)
                cell.div.remove();
        this.data = Array.from({length: size.row}, () => Array(size.column));
        let values_1d = Array.from({length: size.row * size.column}, (_, index) => index), values_2d = [];
        for (let a = values_1d.length - 1 ; a >= 0 ; a--) {
            let b = Math.floor(Math.random() * (a + 1));
            [values_1d[a], values_1d[b]] = [values_1d[b], values_1d[a]];
        }
        for (let a = 0 ; a < size.column ; a++) values_2d.push(values_1d.splice(0, size.column));
        for (let y = 0 ; y < size.row ; y++)
            for (let x = 0 ; x < size.column ; x++) {
                let cell = document.createElement("div");
                this.div.appendChild(cell);
                cell.addEventListener("click", () => {
                    Move(x, y);
                }); 
                let value = values_2d[y][x];
                let type = value ? 'number' : 'empty';
                this.data[y][x] = new Cell(x, y, cell, type, value);
            }
    },
    End() {
        this.check = false;
    }
}
function Translate(start, target) {
    return new Promise(resolve => {
        Game.delay_check = true;
        const animation_div = document.createElement('span');
        animation_div.classList.add('animation-div');
        animation_div.textContent = start.value;
        animation_div.style.width = `${start.div.offsetWidth}px`;
        animation_div.style.height = `${start.div.offsetHeight}px`;
        animation_div.style.top = `${start.div.offsetTop}px`;
        animation_div.style.left = `${start.div.offsetLeft}px`;
        [start.type, target.type] = [target.type, start.type];
        [start.value, target.value] = [target.value, start.value];
        Game.div.appendChild(animation_div);
        start.div.textContent = '';
        start.div.setAttribute('id', 'empty');
        animation_div.style.top = `${target.div.offsetTop}px`;
        animation_div.style.left = `${target.div.offsetLeft}px`;
        setTimeout(() => {
            target.div.removeAttribute('id', 'empty');
            target.div.textContent = target.value;
            animation_div.remove();
            Game.delay_check = false;
            resolve();
        }, 100);
    })
}
async function Move(x, y) {
    const select = Game.data[y][x];
    if (select.type == "number" && Game.check && !Game.delay_check) {
        if (!Game.chronometer.check) Game.chronometer.Start();
        let empty, check = false;
        for (let x = select.x - 1 ; x >= 0 ; x--) {
            if (Game.data[select.y][x].type == 'empty') {
                check = true;
                empty = Game.data[select.y][x];
                for (let a = empty.x + 1 ; a <= select.x ; a++) {
                    Translate(Game.data[select.y][a], Game.data[select.y][a - 1]);
                }
                break;
            }
        }
        if (!check) {
            for (let x = select.x + 1 ; x < Game.size.column ; x++) {
                if (Game.data[select.y][x].type == 'empty') {
                    empty = Game.data[select.y][x];
                    check = true;
                    for (let a = empty.x - 1 ; a >= select.x ; a--) {
                        Translate(Game.data[select.y][a], Game.data[select.y][a + 1]);
                    }
                    break;
                }
            }
        }
        if (!check) {
            for (let y = select.y - 1 ; y >= 0 ; y--) {
                if (Game.data[y][select.x].type == 'empty') {
                    check = true;
                    empty = Game.data[y][select.x];
                    for (let a = empty.y + 1 ; a <= select.y ; a++) {
                        Translate(Game.data[a][select.x], Game.data[a - 1][select.x]);
                    }
                    break;
                }
            }
        }
        if (!check) {
            for (let y = select.y + 1 ; y < Game.size.row ; y++) {
                if (Game.data[y][select.x].type == 'empty') {
                    check = true;
                    empty = Game.data[y][select.x];
                    for (let a = empty.y - 1 ; a >= select.y ; a--) {
                        Translate(Game.data[a][select.x], Game.data[a + 1][select.x]);
                    }
                    break;
                }
            }
        }
        // let end_check = true;
        // for (let c = 0 ; c < 15 ; c++) {    
            //     if (all[c].value != c + 1) {
                //         end_check = false;
                //     }
                // }
                // if (end_check) {
                    //     clearInterval(timer);
                    //     if(confirm(timer_m + " : " + timer_s + "\n" + "restart ?")) {
                        //         start_game();
                        //     }
                        // }
    }
}
window.onload = () => {
    Game.Start();
}
                