import Timer from '../../library/timer/timer.js';
class Cell {
    constructor(x, y, div, type = 'number', value = 0) {
        this.x = x;
        this.y = y;
        this.div = div;
        this.type = type;
        this.value = value;
        if (type == 'number') div.textContent = value;
        else div.classList.add('empty');
    }
}
var Game = {
    check: false,
    delay_check: true,
    default_size: {
        row: 4,
        column: 4
    },
    timer: new Timer(document.getElementById('timer-minute'), document.getElementById('timer-second')),
    div: document.getElementById('game-div'),
    data: [],
    Start(size = this.default_size) {
        this.check = true;
        this.delay_check = false;
        this.size = size;
        Game.timer.Reset();
        for (let row of this.data)
            for (let cell of row)
                cell.div.remove();
        this.data = Array.from({length: size.row}, () => Array(size.column));
        let values = this.Create_Board();
        for (let y = 0 ; y < size.row ; y++)
            for (let x = 0 ; x < size.column ; x++) {
                let cell = document.createElement('div');
                this.div.appendChild(cell);
                cell.addEventListener('click', () => {
                    Move(x, y);
                }); 
                let value = values[y][x];
                let type = value ? 'number' : 'empty';
                this.data[y][x] = new Cell(x, y, cell, type, value);
            }
    },
    End() {
        this.check = false;
        alert(Game.timer.To_string());
        Game.Start();
    },
    End_Check() {
        let end_check = true;
        for (let y = 0 ; y < this.size.row ; y++)
            for (let x = 0 ; x < this.size.column ; x++)
                if (y != this.size.row - 1 || x != this.size.column - 1)
                    if (this.data[y][x].value != y * this.size.column + x + 1) return false;
        return true;
    },
    Create_Board() {
        let values_1d = Array.from({length: this.size.row * this.size.column}, (_, index) => index), values_2d = [];
        for (let a = values_1d.length - 1 ; a >= 0 ; a--) {
            let b = Math.floor(Math.random() * (a + 1));
            [values_1d[a], values_1d[b]] = [values_1d[b], values_1d[a]];
        }
        values_1d = Fix_Table(values_1d);
        for (let a = 0 ; a < this.size.column ; a++) values_2d.push(values_1d.splice(0, this.size.column));
        return values_2d;

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
        start.div.classList.add('empty');
        animation_div.style.top = `${target.div.offsetTop}px`;
        animation_div.style.left = `${target.div.offsetLeft}px`;
        setTimeout(() => {
            target.div.classList.remove('empty');
            target.div.textContent = target.value;
            animation_div.remove();
            resolve();
        }, 100);
    })
}
async function Move(x, y) {
    const select = Game.data[y][x];
    if (select.type == 'number' && Game.check && !Game.delay_check) {
        if (!Game.timer.check) Game.timer.Start();
        let empty, check = false;
        let animations = [];
        for (let x = select.x - 1 ; x >= 0 ; x--) {
            if (Game.data[select.y][x].type == 'empty') {
                check = true;
                empty = Game.data[select.y][x];
                for (let a = empty.x + 1 ; a <= select.x ; a++) {
                    animations.push(Translate(Game.data[select.y][a], Game.data[select.y][a - 1]));
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
                        animations.push(Translate(Game.data[select.y][a], Game.data[select.y][a + 1]));
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
                        animations.push(Translate(Game.data[a][select.x], Game.data[a - 1][select.x]));
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
                        animations.push(Translate(Game.data[a][select.x], Game.data[a + 1][select.x]));
                    }
                    break;
                }
            }
        }
        if (animations.length) {
            await Promise.all(animations);
            Game.delay_check = false;
        }
        if (Game.End_Check()) Game.End();
    }
}
function Fix_Table(list) {
    let inversion = 0;
    for (let a = 0 ; a < list.length - 1 ; a++) {
        if (list[a] == 0) continue;
        for (let b = a + 1 ; b < list.length ; b++) {
            if (list[b] == 0) continue;
            if (list[a] > list[b]) inversion++;
        }
    }
    let is_solvable = true;
    if (Game.size.column & 1) {
        if (inversion & 1) is_solvable = false;
    }
    else {
        let empty_index = list.indexOf(0);
        let y_down = Game.size.row - Math.floor(empty_index / Game.size.column);
        let number = inversion + y_down;
        if (!(number & 1)) is_solvable = false;
    }
    if (!is_solvable) {
        let swap = [];
        for (let a = 0 ; a < list.length && swap.length < 2 ; a++) {
            if (list[a] != 0) swap.push(a);
        }
        [list[swap[0]], list[swap[1]]] = [list[swap[1]], list[swap[0]]];
    }
    return list;
}
window.onload = () => {
    Game.Start();
}