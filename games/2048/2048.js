const Chance_4 = 1 / 12;
var Game = {
    check: false,
    delay_check: false,
    delay: 80,
    score: 0,
    div: document.getElementById('game-div'),
    size: {
        row: 4,
        column: 4
    },
    Start(size = this.size) {
        this.check = true;
        this.size = {...size};
        this.div.innerHTML = '';
        this.score = 0;
        this.data = Array.from({length: size.column}, () => new Array(size.row));
        for (let y = 0 ; y < size.row ; y++) {
            for (let x = 0 ; x < size.column ; x++) {
                this.data[y][x] = {type: 'empty', number: 0};
                let cell = document.createElement('div');
                this.div.appendChild(cell);
            }
        }
        for (let a = 0 ; a < 2 ; a++) this.Add_New_Cell();
        this.div.style.aspectRatio = `${size.column}/${size.row}`;
        this.div.style.gridTemplateRows = `${100 / size.row}% `.repeat(size.row);
        this.div.style.gridTemplateColumns = `${100 / size.column}% `.repeat(size.column);
        window.removeEventListener('keydown', Key_Press);
        window.addEventListener('keydown', Key_Press);
    },
    End() {
        this.check = false;
        window.removeEventListener('keydown', Key_Press);
        alert(`Game Over!\nScore: ${Game.score}`);
        this.Start();
    },
    End_Check() {
        if (!this.Has_Empty_Cell()) {
            for (let y = 0 ; y < Game.data.length ; y++) {
                for (let x = 0 ; x < Game.data[y].length ; x++) {
                    if ((y > 0 && this.data[y][x].number == this.data[y - 1][x].number) ||
                        (y < Game.size.row - 1 && this.data[y][x].number == this.data[y + 1][x].number) ||
                        (x > 0 && this.data[y][x].number == this.data[y][x - 1].number) ||
                        (x < Game.size.column - 1 && this.data[y][x].number == this.data[y][x + 1].number)) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    },
    Add_New_Cell() {
        let position = this.Empty_Cell();
        let number = Math.random() < Chance_4 ? 4 : 2;
        Update_Cell(position, number);
        if (this.End_Check()) this.End();
    },
    Has_Empty_Cell() {
        for (let y = 0 ; y < this.data.length ; y++)
            for (let x = 0 ; x < this.data[y].length ; x++)
                if (this.data[y][x].type == 'empty') return true;
        return false;
    },
    Empty_Cell() {
        let x = Math.floor(Math.random() * this.size.column);
        let y = Math.floor(Math.random() * this.size.row);
        return (this.data[y][x].type == 'empty') ? {x, y} : this.Empty_Cell();
    }
}
function DIV(position) {
    return Game.div.children[(position.y * Game.size.column) + position.x];
}
function Clear_Cell(position) {
    let data = Game.data[position.y][position.x];
    let cell = DIV(position);
    data.type = 'empty';
    data.number = 0;
    cell.innerHTML = '';
    cell.style.backgroundColor = '';
}
function Update_Cell(position, number, delay_check = false) {
    let data = Game.data[position.y][position.x];
    let cell = DIV(position);
    let delay = delay_check ? Game.delay : 0;
    data.type = 'number';
    data.number = number;
    setTimeout(() => {
        cell.innerHTML = data.number;
        cell.style.backgroundColor = Colors[data.number];
    }, delay);
}
async function Move(direction) {
    let data = Game.data;
    let animations = [];
    switch (direction) {
        case 'up' :
            for (let x = 0 ; x < Game.size.column ; x++) {
                let merge_check = false;
                for (let y = 1 ; y < Game.size.row ; y++) {
                    if (data[y][x].type == 'number') {
                        let check = false;
                        for (let z = y - 1 ; z >= 0 ; z--) {
                            if (data[z][x].type == 'number') {
                                check = true;
                                if (data[y][x].number == data[z][x].number && !merge_check) {
                                    merge_check = true;
                                    animations.push(Merge({x, y}, {x, y: z}));
                                }            
                                else if (z != y - 1) {
                                    merge_check = false;
                                    animations.push(Translate({x, y}, {x, y: z + 1}));
                                }
                                break;
                            }
                        }
                        if (!check) animations.push(Translate({x, y}, {x, y: 0}));
                    }
                }
            }
            break;
        case 'down' :
            for (let x = 0 ; x < Game.size.column ; x++) {
                let merge_check = false;
                for (let y = Game.size.row - 2 ; y >= 0 ; y--) {
                    if (data[y][x].type == 'number') {
                        let check = false;
                        for (let z = y + 1 ; z < Game.size.row ; z++) {
                            if (data[z][x].type == 'number') {
                                check = true;
                                if (data[y][x].number == data[z][x].number && !merge_check) {
                                    merge_check = true;
                                    animations.push(Merge({x, y}, {x, y: z}));
                                }            
                                else if (z != y + 1) {
                                    merge_check = false;
                                    animations.push(Translate({x, y}, {x, y: z - 1}));
                                }
                                break;
                            }
                        }
                        if (!check) animations.push(Translate({x, y}, {x, y: Game.size.row - 1}));
                    }
                }
            }
            break;
        case 'right' :
            for (let y = 0 ; y < Game.size.row ; y++) {
                let merge_check = false;
                for (let x = Game.size.column - 2 ; x >= 0 ; x--) {
                    if (data[y][x].type == 'number') {
                        let check = false;
                        for (let z = x + 1 ; z < Game.size.column ; z++) {
                            if (data[y][z].type == 'number') {
                                check = true;
                                if (data[y][x].number == data[y][z].number && !merge_check) {
                                    merge_check = true;
                                    animations.push(Merge({x, y}, {x: z, y}));
                                }            
                                else if (z != x + 1) {
                                    merge_check = false;
                                    animations.push(Translate({x, y}, {x: z - 1, y}));
                                }
                                break;
                            }
                        }
                        if (!check) animations.push(Translate({x, y}, {x: Game.size.column - 1, y}));
                    }
                }
            }
            break;
        case 'left' :
            for (let y = 0 ; y < Game.size.row ; y++) {
                let merge_check = false;
                for (let x = 1 ; x < Game.size.column ; x++) {
                    if (data[y][x].type == 'number') {
                        let check = false;
                        for (let z = x - 1 ; z >= 0 ; z--) {
                            if (data[y][z].type == 'number') {
                                check = true;
                                if (data[y][x].number == data[y][z].number && !merge_check) {
                                    merge_check = true;
                                    animations.push(Merge({x, y}, {x: z, y}));
                                }            
                                else if (z != x - 1) {
                                    merge_check = false;
                                    animations.push(Translate({x, y}, {x: z + 1, y}));
                                }
                                break;
                            }
                        }
                        if (!check) animations.push(Translate({x, y}, {x: 0, y}));
                    }
                }
            }
            break;
    }
    if (animations.length) {
        await Promise.all(animations)
        .then(() => {
            Game.Add_New_Cell();
            setTimeout(() => {
                Game.delay_check = false;
            }, 10)
        })
        .catch(error => { console.error('Error', error) });
    }
}
const Colors = {
        2: '#ffdaff',
        4: '#fdddad',
        8: '#feb856',
        16: '#ff9456',
        32: '#ff6d54',
        64: '#fe714d',
        128: '#fddb51',
        256: '#ffd960',
        512: '#ffda5a',
        1024: '#ffb657',
        2048: '#feb608',
        4096: '#a36ae0',
        8192: '#7b3ce6',
        16384: '#4b1dae'
}
function Translate(current_position, target_position) {
    return new Promise(resolve => {
        Game.delay_check = true;
        let current_div = DIV(current_position);
        let target_div = DIV(target_position);
        let number = Game.data[current_position.y][current_position.x].number;
        let animation_div = document.createElement('span');
        animation_div.classList.add('animation-div');
        animation_div.style.width = `${current_div.offsetWidth}px`;
        animation_div.style.height = `${current_div.offsetHeight}px`;
        animation_div.style.top = `${current_div.offsetTop}px`;
        animation_div.style.left = `${current_div.offsetLeft}px`;
        Game.div.appendChild(animation_div);
        animation_div.style.top = `${target_div.offsetTop}px`;
        animation_div.style.left = `${target_div.offsetLeft}px`;
        animation_div.innerHTML = number;
        animation_div.style.backgroundColor = Colors[number];
        Update_Cell(target_position, number, true);
        Clear_Cell(current_position);
        setTimeout(() => {
            animation_div.remove();
            resolve();
        }, Game.delay);
    });
}
function Merge(current_position, target_position) {
    return new Promise(async resolve => {
        let number = Game.data[current_position.y][current_position.x].number * 2;
        await Translate(current_position, target_position);
        Update_Cell(target_position, number);
        Game.score += number;
        resolve();
    });
}
function Key_Press(event) {
    if (Game.delay_check) return;
    switch (event.key) {
        case 'ArrowUp' : case 'w' :
            Move('up');
            break;
        case 'ArrowDown' : case 's' :
            Move('down');
            break;
        case 'ArrowRight' : case 'd' :
            Move('right');
            break;
        case 'ArrowLeft' : case 'a' :
            Move('left');
            break;
    }
}
let start_x, start_y;
const swipe_to_move = 30;
document.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    start_x = touch.clientX;
    start_y = touch.clientY;
});
document.addEventListener('touchend', e => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start_x;
    const dy = touch.clientY - start_y;
    const abs_dx = Math.abs(dx);
    const abs_dy = Math.abs(dy);
    if (abs_dx < swipe_to_move && abs_dy < swipe_to_move) return;
    if (abs_dx >= abs_dy) {
        if (dx > 0) Move('right');
        else Move('left');
    }
    else {
        if (dy > 0) Move('down');
        else Move('up');
    }
});
window.onload = function() {
    Game.Start();
}