import Timer from "../../libraries/timer/timer.js";
class Cell {
    constructor(x, y, value, div, status = 0    ) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.div = div;
        this.status = status;
    }
}
var Game = {
    check: false,
    default_size: 5,
    data: null,
    size: null,
    div: document.getElementById('game-div'),
    target_panel: document.getElementById('target-panel'),
    target: 1,
    last_target: null,
    timer: new Timer(document.getElementById('timer-minute'), document.getElementById('timer-second')),
    Start(size = this.size ?? this.default_size) {
        this.check = true;
        this.size = size;
        if (this.data) {
            this.data.forEach(row => row.forEach(cell => {
                cell.div.remove();
            }));
        }
        this.data = Array.from({length: size}, () => Array(size));
        this.timer.Reset();
        this.target = 1;
        this.last_target = (size ** 2) * 2;
        this.target_panel.textContent = 1;
        let size_percent = (100 / size).toString();
        this.div.style.gridTemplateColumns = size_percent.concat('% ').repeat(size);
        this.div.style.gridTemplateRows = size_percent.concat('% ').repeat(size);
        let table = this.Create_Table();
        let index = 0;
        for (let y = 0 ; y < size ; y++) {
            for (let x = 0 ; x < size ; x++) {
                let cell = document.createElement('div');
                cell.classList.add('number');
                cell.innerHTML = table[0][index];
                this.div.appendChild(cell);
                cell.setAttribute('x', x);
                cell.setAttribute('y', y);
                this.data[y][x] = new Cell(x, y, [table[0][index], table[1][index++]], cell);
            }
        }
        Remove_onclick();
        Set_Onclick();
    },
    End() {
        this.check = false;
        this.timer.Stop();
        Remove_onclick();
        alert('Good Job!\n' + this.timer.To_string());
        this.Start();
    },
    End_Check() {
        return this.target == this.last_target;
    },
    Create_Table() {
        let values = [
            Array.from({length: this.size ** 2}, (_, index) => index + 1),
            Array.from({length: this.size ** 2}, (_, index) => index + (this.size ** 2) + 1)
        ];
        for (let a = 0 ; a < values.length ; a++) {
            for (let b = values[a].length - 1 ; b >= 0 ; b--) {
                let c = Math.floor(Math.random() * (b + 1));
                [values[a][b], values[a][c]] = [values[a][c], values[a][b]];
            }
        }
        return values;
    }
}
function Click(e) {
    let div = e.target;
    let [x, y] = [div.getAttribute('x'), div.getAttribute('y')];
    let cell = Game.data[y][x];
    if (cell.status < 2 && cell.value[cell.status] == Game.target) {
        if (!Game.timer.check) Game.timer.Start();
        cell.status++;
        if (cell.status < 2) { // Next Number
            cell.div.textContent = cell.value[cell.status];
        }
        else { // Empty
            cell.div.textContent = '';
            cell.div.classList.remove('number');
            cell.div.classList.add('empty');
        }
        if (Game.End_Check()) Game.End();
        else {
            Game.target++;
            Game.target_panel.textContent = Game.target;
        }
    }
}
function Set_Onclick() {
    Game.data.forEach((row, y) => row.forEach((cell, x) => {
        cell.div.addEventListener('click', Click);
    }));
}
function Remove_onclick() {
    Game.data.forEach((row, y) => row.forEach((cell, x) => {
        cell.div.removeEventListener('click', Click);
    }));
}
window.onload = () => {
    Game.Start();
}