const Direction_Bit = {
    up: 8, right: 4, down: 2, left: 1
}
const Levels = [
    {
        level: 1,
        row: 8, column: 8,
        start: {x: 0, y: 3},
        target: {x: 7, y: 6},
        map: '63655343ac961c3ac75963aa6d53aacbc369ac5949c3a6532459c969c55555d1'
    },
    {
        level: 2,
        row: 10, column: 10,
        start: {x: 0, y: 5},
        target: {x: 9, y: 3},
        map: '2636367363aaaaa8ac9aaac9a69269e963aa6ba2e59c9aaac9a6363aac51aac9c9a632ac3653aae9a69a2c9aa2cd5dd559c9'
    },
    {
        level: 3,
        row: 12, column: 12,
        start: {x: 0, y: 10},
        target: {x: 11, y: 1},
        map: '653636345571e3c9aac165b2aa61cb63a69aac961aac9c5ba43c59e55149c3c363c536516d598c71ae53a63632a6b869aac9c9aac3c3ae5753ac1c3aac1a69a473aac559c5d59cd9'
    },
    {
        level: 4,
        row: 14, column: 14,
        start: {x: 0, y: 1},
        target: {x: 13, y: 12},
        map: '63655343636343aaa63c5f9c986bac9a865963459ac55b49659a655b653a659269c73ac3c9a43aa659aa6d55969cd9659aa6575965538659ac3c34943c3a63e5d79473c3ac9aa659659c5bc55bae53c5345d555bc96d53e363651a4594598c9cd559'
    }
]
const Game = {
    check: false,
    move_check: false,
    div: document.getElementById('game-div'),
    Start(level_number) {
        this.check = true;
        this.move_check = true;
        this.div.innerHTML = '';
        let level = Levels[level_number - 1];
        this.data = {level: level, x: level.start.x, y: level.start.y, index: (level.start.y * level.column) + level.start.x};
        this.div.style.gridTemplateRows = 'auto '.repeat(level.row);
        this.div.style.gridTemplateColumns = 'auto '.repeat(level.column);
        this.div.style.aspectRatio = `${level.column}/${level.row}`;
        let i = 0;
        for (let a = 0 ; a < level.row ; a++)
            for (let b = 0 ; b < level.column ; b++) {
                let cell = document.createElement('div');
                this.div.appendChild(cell);
                for (let direction in Direction_Bit)
                    if (!Can_Move(i, direction))
                        cell.classList.add(direction);
                i++;
            }
        this.div.children[this.data.index].classList.add('character');
        this.div.children[(level.target.y * level.column) + level.target.x].classList.add('target');
        window.removeEventListener('keydown', Key_Press);
        window.addEventListener('keydown', Key_Press);
    },
    End() {
        this.check = false;
        alert('Finish!');
    },
    Next_Level() {
        this.check = false;
        let level = this.data.level.level;
        window.removeEventListener('keydown', Key_Press);
        if (level < Levels.length) {
            setTimeout(() => {
                this.Start(++level);
            }, 1000);
        }
        else this.End();
    }
}
window.onload = function() {
    Game.Start(1);
}
function Key_Press(event) {
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
function Can_Move(index, direction) {
    return Boolean(parseInt(Game.data.level.map[index], 16) & Direction_Bit[direction]);
}
async function Move(direction) {
    if (!Game.move_check) return;
    let data = Game.data;
    if (Can_Move(data.index, direction)) {
        let current_div = Game.div.children[data.index];
        switch (direction) {
            case 'up' :
                data.index -= data.level.column;
                data.y--;
                break;
            case 'down' :
                data.index += data.level.column;
                data.y++;
                break;
            case 'right' :
                data.index++;
                data.x++;
                break;
            case 'left' :
                data.index--;
                data.x--;
                break;
        }
        let target_div = Game.div.children[data.index];
        await Translate(current_div, target_div);
        if (data.x == data.level.target.x && data.y == data.level.target.y) Game.Next_Level();
    }
}
async function Translate(current_div, target_div) {
    return new Promise(resolve => {
        Game.move_check = false;
        current_div.classList.remove('character');
        let animation_div = document.createElement('span');
        animation_div.classList.add('character');
        animation_div.setAttribute('id', 'animation-div');
        animation_div.style.width = `${current_div.offsetWidth}px`;
        animation_div.style.height = `${current_div.offsetHeight}px`;
        animation_div.style.top = `${current_div.offsetTop}px`;
        animation_div.style.left = `${current_div.offsetLeft}px`;
        Game.div.appendChild(animation_div);
        animation_div.style.top = `${target_div.offsetTop}px`;
        animation_div.style.left = `${target_div.offsetLeft}px`;
        setTimeout(() => {
            target_div.classList.add('character');
            Game.move_check = true;
            animation_div.remove();
            resolve();
        }, 50);
    });
}