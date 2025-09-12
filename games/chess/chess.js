class Cell {
    constructor(type, team, piece, div, x, y) {
        [this.type, this.team, this.piece, this.div, this.x, this.y] = [type, team, piece, div, x, y];
    }
    Available_Cells(position, prediction_check = false, data = Game.data) {
        let [x, y] = [position.x, position.y];
        let [piece] = [this.piece];
        let cells = [];
        if (piece == 'empty') return;
        let Can_Go, Plus, Multiplication, Check_Cells;
        if (['rook', 'bishop', 'queen'].includes(piece)) {
            Can_Go = (cell1, cell2) => {
                if (cell1.team == cell2.team) return 0;
                if (cell2.type == 'empty') return 2;
                return 1;
            }
            Plus = (cell, position) => {
                let [x, y] = [position.x, position.y];
                let cells = [];
                for (let a = y - 1 ; a >= 0 ; a--) {
                    let can_go = Can_Go(cell, data[a][x]);
                    if (can_go == 1 || can_go == 2) cells.push(data[a][x]);
                    if (can_go == 0 || can_go == 1) break;
                }
                for (let a = y + 1 ; a < 8 ; a++) {
                    let can_go = Can_Go(cell, data[a][x]);
                    if (can_go == 1 || can_go == 2) cells.push(data[a][x]);
                    if (can_go == 0 || can_go == 1) break;
                }
                for (let a = x - 1 ; a >= 0 ; a--) {
                    let can_go = Can_Go(cell, data[y][a]);
                    if (can_go == 1 || can_go == 2) cells.push(data[y][a]);
                    if (can_go == 0 || can_go == 1) break;
                }
                for (let a = x + 1 ; a < 8 ; a++) {
                    let can_go = Can_Go(cell, data[y][a]);
                    if (can_go == 1 || can_go == 2) cells.push(data[y][a]);
                    if (can_go == 0 || can_go == 1) break;
                }
                return cells;
            }
            Multiplication = (cell, position) => {
                let [x, y] = [position.x, position.y];
                let cells = [];
                for (let a = 1 ; x - a >= 0 && y - a >= 0 ; a++) {
                    let can_go = Can_Go(cell, data[y - a][x - a]);
                    if (can_go == 1 || can_go == 2) cells.push(data[y - a][x - a]);
                    if (can_go == 0 || can_go == 1) break;
                }
                for (let a = 1 ; x + a < 8 && y - a >= 0 ; a++) {
                    let can_go = Can_Go(cell, data[y - a][x + a]);
                    if (can_go == 1 || can_go == 2) cells.push(data[y - a][x + a]);
                    if (can_go == 0 || can_go == 1) break;
                }
                for (let a = 1 ; x - a >= 0 && y + a < 8 ; a++) {
                    let can_go = Can_Go(cell, data[y + a][x - a]);
                    if (can_go == 1 || can_go == 2) cells.push(data[y + a][x - a]);
                    if (can_go == 0 || can_go == 1) break;
                }
                for (let a = 1 ; x + a < 8 && y + a < 8 ; a++) {
                    let can_go = Can_Go(cell, data[y + a][x + a]);
                    if (can_go == 1 || can_go == 2) cells.push(data[y + a][x + a]);
                    if (can_go == 0 || can_go == 1) break;
                }
                return cells;
            }
        }
        else if (['knight', 'king'].includes(piece)) {
            Can_Go = (cell, position) => {
                let [x, y] = [position.x, position.y];
                if (x < 0 || x > 7 || y < 0 || y > 7) return false;
                if (cell.team != data[y][x].team) return true;
                return false;
            }
            Check_Cells = (positions) => {
                let cells = [];
                for (let position of positions)
                    if (Can_Go(this, position)) cells.push(data[position.y][position.x]);
                return cells;
            }
        }
        switch (piece) {
            case 'rook' :
                cells = Plus(this, position);
                break;
            case 'knight' : {
                const positions = [
                    {x: x - 2, y: y - 1},
                    {x: x - 1, y: y - 2},
                    {x: x + 1, y: y - 2},
                    {x: x + 2, y: y - 1},
                    {x: x - 2, y: y + 1},
                    {x: x - 1, y: y + 2},
                    {x: x + 1, y: y + 2},
                    {x: x + 2, y: y + 1}
                ];
                cells = Check_Cells(positions);
                break;
            }
            case 'bishop' :
                cells = Multiplication(this, position);
                break;
            case 'queen' :
                cells = [...Plus(this, position), ...Multiplication(this, position)];
                break;
            case 'king' : {
                const positions = [
                    {x: x - 1, y: y - 1},
                    {x, y: y - 1},
                    {x: x + 1, y: y - 1},
                    {x: x - 1, y},
                    {x: x + 1, y},
                    {x: x - 1, y: y + 1},
                    {x, y: y + 1},
                    {x: x + 1, y: y + 1}
                ];
                cells = Check_Cells(positions);
                break;
            }
            case 'pawn' : {
                let direction = this.team == 'white' ? -1 : 1;
                let start_y = this.team == 'white' ? 6 : 1;
                const positions = [
                    {x: x - 1, y: y + direction},
                    {x: x + 1, y: y + direction}
                ];
                if (y > 0 && y < 7) {
                    if (data[y + direction][x].type == 'empty') {
                        cells.push(data[y + direction][x]);
                        if (y == start_y && data[y + (2 * direction)][x].type == 'empty')
                            cells.push(data[y + (2 * direction)][x]);
                    }
                    for (let position of positions)
                        if (position.x >= 0 && position.x < 8 && ![this.team, 'empty'].includes(data[position.y][position.x].team))
                            cells.push(data[position.y][position.x]);
                }
                break;
            }
        }
        if (prediction_check) {
            let copy_data = Game.Copy_Data();
            for (let y = 0 ; y < copy_data.length ; y++)
                for (let x = 0 ; x < copy_data[y].length ; x++)
                    copy_data[y][x].Available_Cells = data[y][x].Available_Cells;
            for (let a = 0 ; a < cells.length ; a++) {
                let [This, Cell] = [copy_data[this.y][this.x], copy_data[cells[a].y][cells[a].x]];
                let [copy_this, copy_cell] = [{...This}, {...Cell}];
                [Cell.type, Cell.team, Cell.piece] = [This.type, This.team, This.piece];
                [This.type, This.team, This.piece] = ['empty', 'empty', 'empty'];
                if (Game.Is_Check(this.team, copy_data)) cells.splice(a--, 1);
                [This.type, This.team, This.piece] = [copy_this.type, copy_this.team, copy_this.piece];
                [Cell.type, Cell.team, Cell.piece] = [copy_cell.type, copy_cell.team, copy_cell.piece];
            }
        }
        return cells;
    }
}
var Game = {
    check: false,
    delay_check: false,
    free_to_play: true,
    div: document.getElementById('game-div'),
    upgrade_pawn_div: document.getElementById('change-pawn-background'),
    upgrade_pawn_buttons: document.querySelectorAll('#change-pawn-div > div'),
    upgrade_pawn_pieces: ['queen', 'rook', 'bishop', 'knight'],
    move_data: {
        start: null,
        target: null,
        available_cells: [],
        Clear() {
            this.start = null;
            this.target = null;
            this.available_cells = [];
        }
    },
    data: Array.from({length: 8}, () => new Array(8)),
    turn: 'white',
    pawn: null,
    is_check: false,
    Start() {
        this.check = true;
        this.delay_check = false;
        this.div.innerHTML = '';
        this.is_check = false;
        this.turn = 'white';
        this.move_data.Clear();
        for (let y = 0 ; y < this.data.length ; y++) {
            let row = document.createElement('div');
            for (let x = 0 ; x < this.data[y].length ; x++) {
                let team, piece;
                if ([0, 1].includes(y)) team = 'black';
                else if ([6, 7].includes(y)) team = 'white';
                let type = team ? 'piece' : 'empty';
                team ??= 'empty';
                let position = `${x} ${y}`;
                switch (position) {
                    case '0 0' : case '7 0' : case '0 7' : case '7 7' :
                        piece = 'rook';
                        break;
                    case '1 0' : case '6 0' : case '1 7' : case '6 7' :
                        piece = 'knight';
                        break;
                    case '2 0' : case '5 0' : case '2 7' : case '5 7' :
                        piece = 'bishop';
                        break;
                    case '3 0' : case '3 7' :
                        piece = 'queen';
                        break;
                    case '4 0' : case '4 7' :
                        piece = 'king';
                        break;
                }
                if (y == 1 || y == 6) piece = 'pawn';
                piece ??= 'empty';
                let div = document.createElement('div');
                if (type == 'piece') div.classList.add(`${team}-${piece}`);
                div.addEventListener('mouseover', change_cursor);
                function change_cursor() {
                    let cell = Game.data[y][x];
                    if (cell.type == 'piece' && Game.turn == cell.team) div.style.cursor = 'pointer';
                }
                div.onmouseleave = () => { div.style.cursor = ''; }
                div.addEventListener('mousedown', (event) => {
                    if (event.which === 1 || event.button === 0) Click({x, y});
                    // else if (event.which === 3 || event.button === 1) Right_Click({x, y});
                });
                row.appendChild(div);
                div.oncontextmenu = (event) => { event.preventDefault(); }
                this.data[y][x] = new Cell(type, team, piece, div, x, y);
            }
            this.div.appendChild(row);
        }
    },
    End() {
        this.check = false;
    },
    Checkmate(winner) {
        alert(winner + ' Win!');
        this.End();
    },
    Stalemate() {
        alert('Stalemate!')
        this.End();
    },
    async Move() {
        this.delay_check = true;
        let [start, target] = [this.move_data.start, this.move_data.target];
        let [copy_start, copy_target] = [{...start}, {...target}];
        let king_div = Get_King(this.turn).div;
        king_div.classList.remove('check');
        if (start.piece == 'king' && this.is_check) start.div.classList.remove('check');
        [target.type, target.team, target.piece] = [start.type, start.team, start.piece];
        [start.type, start.team, start.piece] = ['empty', 'empty', 'empty'];
        Clear_Available_Cells();
        await Move_Animaiton(copy_start, copy_target);
        let opponent = Get_Opponent(this.turn);
        this.is_check = false;
        let upgrade_pawn_check = false;
        if (target.piece == 'pawn') {
            let end_y = target.team == 'white' ? 0 : 7;
            if (target.y == end_y) {
                upgrade_pawn_check = true;
                this.pawn = target;
                for (let a = 0 ; a < this.upgrade_pawn_buttons.length ; a++) {
                    let [button, piece] = [this.upgrade_pawn_buttons[a], this.upgrade_pawn_pieces[a]];
                    button.classList.remove(Get_Opponent(this.pawn.team) + '-' + piece);
                    button.classList.add(this.pawn.team + '-' + piece);
                    button.onclick = () => { this.Upgrade_Pawn(piece); }
                }
                this.upgrade_pawn_div.style.display = 'flex';
            }
        }
        if (!upgrade_pawn_check) this.End_Check(opponent);
        this.move_data.Clear();
        this.Change_Turn();
        this.delay_check = false;
    },
    End_Check(opponent) {
        let opponent_king;
        if (opponent_king = this.Is_Check(opponent)) {
            this.is_check = true;
            opponent_king.div.classList.add('check');
        }
        opponent_king ||= Get_King(opponent);
        if (this.Cant_Move(opponent)) {
            opponent_king.div.classList.remove('check');
            if (this.is_check) this.Checkmate(this.turn);
            else this.Stalemate();
        }
    },
    Upgrade_Pawn(piece) {
        if (this.pawn) {
            this.pawn.piece = piece;
            this.pawn.div.classList.remove(this.pawn.team + '-pawn');
            this.pawn.div.classList.add(this.pawn.team + '-' + piece);
            this.upgrade_pawn_div.style.display = 'none';
            this.End_Check(Get_Opponent(this.pawn.team));
            this.pawn = null;
        }
    },
    Copy_Data() {
        return this.data.map(row => row.map(cell => ({...cell})));
    },
    Is_Check(team, data = this.data) {
        let opponent = Get_Opponent(team);
        for (let y = 0 ; y < data.length ; y++)
            for (let x = 0 ; x < data[y].length ; x++) {
                let cell = data[y][x];
                if (cell.team == opponent) {
                    let cells = cell.Available_Cells({x, y}, false, data), king;
                    if (king = cells.filter(cell => cell.piece == 'king')[0]) return king;
                }
            }
        return false;
    },
    Cant_Move(team) {
        for (let y = 0 ; y < this.data.length ; y++) {
            for (let x = 0 ; x < this.data[y].length ; x++) {
                let cell = this.data[y][x];
                if (cell.team == team) {
                    let cells = cell.Available_Cells({x, y}, true);
                    if (cells.length > 0) return false;
                }
            }
        }
        return true;
    },
    Change_Turn() {
        this.turn = Get_Opponent(this.turn);
    }
}
window.onload = () => {
    Game.Start();
    
}
function Click(position) {
    if (Game.delay_check) return;
    let [x, y] = [position.x, position.y];
    let data = Game.data[y][x];
    if (Game.move_data.start == null) {
        if (data.type == 'piece' && Game.free_to_play ? true : data.team == Game.turn) {
            Select(data, {x, y});
        }
    }
    else if (Game.move_data.target == null) {
        if (data.div == Game.move_data.start.div) {
            Clear_Select();
            return;
        }
        else if (data.team == Game.move_data.start.team) {
            Clear_Select();
            Select(data, {x , y});
            return;
        }
        if (!Game.free_to_play && Game.move_data.available_cells.some(cell => cell.div == data.div) || Game.free_to_play) {
            Game.move_data.target = data;
            Game.Move();
        }
    }
}
function Select(data, position) {
    Game.move_data.start = data;
    data.div.style.backgroundColor = 'aqua';
    Game.move_data.available_cells = data.Available_Cells(position, true);
    Set_Available_Cells();
}
function Clear_Select() {
    Clear_Available_Cells();
    Game.move_data.available_cells = [];
    Game.move_data.start.div.style.backgroundColor = '';
    Game.move_data.start = null;
}
function Set_Available_Cells() {
    for (let cell of Game.move_data.available_cells) cell.div.classList.add('available-cell');
}
function Clear_Available_Cells() {
    for (let cell of Game.move_data.available_cells) cell.div.classList.remove('available-cell');
}
function Move_Animaiton(start, target) {
    return new Promise(resolve => {
        let animaiton_div = document.createElement('span');
        animaiton_div.setAttribute('id', 'animation-div');
        animaiton_div.classList.add(start.team + '-' + start.piece);
        animaiton_div.style.width = `${start.div.offsetWidth}px`;
        animaiton_div.style.height = `${start.div.offsetHeight}px`;
        animaiton_div.style.top = `${start.div.offsetTop}px`;
        animaiton_div.style.left = `${start.div.offsetLeft}px`;
        Game.div.appendChild(animaiton_div);
        animaiton_div.style.top = `${target.div.offsetTop}px`;
        animaiton_div.style.left = `${target.div.offsetLeft}px`;
        start.div.classList.remove(start.team + '-' + start.piece);
        start.div.style.backgroundColor = '';
        setTimeout(() => {
            if (target.type == 'piece') target.div.classList.remove(target.team + '-' + target.piece);
            target.div.classList.add(start.team + '-' + start.piece);
            animaiton_div.remove();
           resolve();
        }, 100);
    });
}
let Get_Opponent = (team) => team == 'white' ? 'black' : 'white';
let Get_King = (team) => Game.data.map(row => row.filter(cell => cell.team == team && cell.piece == 'king')).flat()[0];