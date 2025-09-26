import Timer from '../../libraries/timer/timer.js';
class Cell {
    constructor(x, y, block, div, type, value) {
        this.x = x;
        this.y = y;
        this.block = block;
        this.div = div;
        this.type = type;
        this.value = value;
    }
}
const Game = {
    check: false,
    page: document.getElementById('game-page'),
    div: document.getElementById('board'),
    level_page: {
        div: document.getElementById('level-page'),
        buttons: document.querySelectorAll('#level-list > button'),
        Set_Onclick() {
            for (let button of this.buttons) button.addEventListener('click', () => { Game.Start(button.getAttribute('value')) });
        }
    },
    number_panel: {
        div: document.getElementById('number-panel'),
        Set_Onclick() {
            this.Click = this.Click.bind(this);
            let children = this.div.children;
            for (let a = 0 ; a < children.length ; a++) {
                children[a].addEventListener('click', this.Click);
            }
        },
        Remove_Onclick() {
            let children = this.div.children;
            for (let a = 0 ; a < children.length ; a++) {
                children[a].removeEventListener('click', this.Click);
            }
        },
        Click(e) {
            let div = e.target;
            let number = parseInt(div.getAttribute('value'));
            if (number === Game.active_number) {
                this.div.children[number - 1].classList.remove('active-number');
                this.Remove_Background();
                Game.active_number = 0;
            }
            else {
                if (Game.active_number ) this.Remove_Background();
                this.Active(number);
            }
        },
        Active(number) {
            if (Game.active_number) this.div.children[Game.active_number - 1].classList.remove('active-number');
            this.div.children[number - 1].classList.add('active-number');
            Game.active_number = number;
            this.Set_Background();
        },
        Set_Background() {
            Game.data.forEach(row => row.forEach(cell => {
                if (cell.value === Game.active_number) cell.div.classList.add('active-cell');
            }));
        },
        Remove_Background() {
            Game.data.forEach(row => row.forEach(cell => {
                if (cell.value === Game.active_number) cell.div.classList.remove('active-cell');
            }));
        },
        Clear() {
            let buttons = this.div.children;
            for (let button of buttons) {
                button.classList.remove('active-number', 'completed-number');
            }
        }
    },
    data: Array.from({ length: 9 }, () => Array(9).fill(0)),
    boards: [
        '281793465945268371736145829174859632693412587852376194327581946419637258568924713',
        '893714265615823947724956318376548192451239786289671534947382651568197423132465879',
        '149387562385126974267495183658274319914653827732819645476538291823941756591762438',
        '234897516196435728587621439452963187819754362763182954371246895925378641648519273',
        '568397412912854367347261958289635174751428693436719825825146739173982546694573281',
        '267495183385126974149387562732819645914653827658274319591762438823941756476538291',
        '314268597829751346765439812132697485486513729957842631591386274678124953243975168',
        '265941783479583621381762594192674835657328149834195267913856472728419356546237918',
        '176982435932154687845673291659427813328516749417398562564231978791865324283749156',
        '765812439829346751314597268957631842486729513132485697243168975678953124591274386',
        '913568427687342915254197683345926871726851349891473256479685132538219764162734598'
    ],
    levels: {
        easy: {from: 35, to: 39},
        medium: {from: 30, to: 34},
        hard: {from: 26, to: 29}
    },
    timer: new Timer(document.getElementById('timer-minute'), document.getElementById('timer-second')),
    active_number: 0,
    board_change_count: 50,
    board: null,
    board_changes: null,
    Start(level = 'easy') {
        this.check = true;
        this.active_number = 0;
        this.level_page.div.style.display = 'none';
        this.page.style.display = 'flex';
        this.data.forEach((row, y) => row.forEach((cell, x) => {
            let block = (Math.floor(y / 3) * 3) + Math.floor(x / 3) + 1;
            let div = this.div.children[y].children[x];
            this.data[y][x] = new Cell(x, y, block, div, 'empty', 0);
        }));
        this.timer.Reset();
        this.timer.Start();
        this.Clear_Divs();
        this.number_panel.Clear();
        this.Set_Onclicks();
        this.Create_Board();
        // this.Show_Board();
        let range = this.levels[level].to - this.levels[level].from + 1;
        let fixed_numbers_count = this.levels[level].from + Random(range);
        this.Set_Fixed_Numbers(fixed_numbers_count);
    },
    End() {
        this.check = false;
        this.timer.Stop();
        this.Remove_Onclicks();
        if (confirm(`Good Job!\n${this.timer.To_string()}\nrestart?`)) Game.Start();
    },
    End_Check() {
        for (let a = 1 ; a <= 9 ; a++)
            if (!this.Check_Number_Complete(a, false)) return false;
        this.End();
    },
    Create_Divs() {
        let fragment = document.createDocumentFragment();
        for (let y = 0 ; y < 9 ; y++) {
            let row = document.createElement('div');
            for (let x = 0 ; x < 9 ; x++) {
                let cell = document.createElement('div');
                cell.setAttribute('x', x);
                cell.setAttribute('y', y);
                row.appendChild(cell);
            }
            fragment.appendChild(row);
        }
        this.div.appendChild(fragment);
    },
    Create_Board() {
        let board = this.boards[Random(this.boards.length)];
        let board_1d = board.split('');
        let board_2d = Array.from({length: 9}, () => Array(9));
        for (let a = 8 ; a >= 0 ; a--) board_2d[8 - a] = board_1d.splice(0, 9);
        for (let a = 0 ; a < this.board_change_count ; a++) {
            let change = this.board_changes[Random(this.board_changes.length)];
            if (!change) continue;
            board_2d = change[Random(change.length)](board_2d);
        }
        this.board = board_2d;
    },
    Clear_Divs() {
        this.data.forEach(row => row.forEach(cell => {
            cell.div.textContent = '';
            cell.div.classList.remove('fixed', 'wrong', 'active-cell');
        }))
    },
    Show_Board() {
        this.data.forEach((row, y) => row.forEach((cell, x) => {
            cell.div.textContent = this.board[y][x];
        }));
    },
    Set_Fixed_Numbers(count) {
        for (let a = 0 ; a < count ; a++) {
            let cell = this.Get_Not_Fixed_Cell();
            let [x, y] = [cell.x, cell.y];
            let value = parseInt(this.board[y][x]);
            cell.type = 'fixed';
            cell.value = value;
            cell.div.classList.add('fixed');
            cell.div.textContent = value;
        }
    },
    Get_Not_Fixed_Cell() {
        let cell = this.data[Random(9)][Random(9)];
        return cell.type !== 'fixed' ? cell : this.Get_Not_Fixed_Cell();
    },
    Set_Onclicks() {
        this.data.forEach(row => row.forEach(cell => {
            cell.div.removeEventListener('click', Click);
            cell.div.addEventListener('click', Click);
        }));
        Game.number_panel.Remove_Onclick();
        Game.number_panel.Set_Onclick();
    },
    Remove_Onclicks() {
        this.data.forEach(row => row.forEach(cell => {
            cell.div.removeEventListener('click', Click);
        }));
        Game.number_panel.Remove_Onclick();
    },
    Set_Cell(cell, value) {
        if (cell.value) this.Check_Number_Complete(cell.value);
        cell.value = value;
        cell.div.textContent = value;
        this.number_panel.Set_Background();
        this.Wrong_Check(cell);
        this.Check_Number_Complete(this.active_number);
    },
    Clear_Cell(cell) {
        cell.value = 0;
        cell.div.textContent = '';
        cell.div.classList.remove('active-cell');
        this.Wrong_Check(cell);
        this.Check_Number_Complete(this.active_number);
    },
    Wrong_Check(cell) {
        let row = this.data[cell.y].filter(cell2 => cell.div != cell2.div);
        let column = this.data.map(row => row[cell.x]).filter(cell2 => cell.div != cell2.div);
        let block = this.data.map(row => row.filter(cell2 => cell.block === cell2.block && cell.div != cell2.div)).flat();
        let cells = [...row, ...column, ...block];
        [cell, ...cells].forEach(cell => cell.div.classList.remove('wrong'));
        cells.forEach(cell2 => {
            if (cell.value === cell2.value) this.Wrong(cell, cell2);
        });
    },
    Wrong(...cells) {
        for (let cell of cells) cell.div.classList.add('wrong');
    },
    Check_Number_Complete(number, end_check = true) {
        let cells = this.data.flat().filter(cell => cell.value === number);
        let condition = cells.length === 9 && cells.every(cell => !cell.div.classList.contains('wrong'));
        this.number_panel.div.children[number - 1].classList.toggle('completed-number', condition);
        if (condition && end_check) this.End_Check();
        return condition; 
    }
}
const Board_Changes = [
    // No Change
    null,
    // Rotate
    [
        // Rotate 90
        board => {
            let new_board = Array.from({length: 9}, () => Array(9));
            for (let y = 0 ; y < 9 ; y++) {
                for (let x = 0 ; x < 9 ; x++) {
                    new_board[y][x] = board[x][8 - y];
                }                
            }
            return new_board;
        },
        // Rotate 180
        board => board.reverse().map(row => row.reverse()),
        // Rotate -90
        board => {
            let new_board = Array.from({length: 9}, () => Array(9));
            for (let y = 0 ; y < 9 ; y++) {
                for (let x = 0 ; x < 9 ; x++) {
                    new_board[y][x] = board[8 - x][y];
                }                
            }
            return new_board;
        }
    ],
    // Translate
    [
        // Row
        board => {
            let new_board = [];
            let rows = [1, 2, 3];
            for (let a = 2 ; a >= 0 ; a--) {
                let b = Random(a + 1);
                [rows[a], rows[b]] = [rows[b], rows[a]];
            }
            for (let a = 0 ; a < 3 ; a++) {
                for (let b = (rows[a] - 1) * 3 ; b < rows[a] * 3 ; b++) {
                    new_board.push(board[b]);
                }
            }
            return new_board;
        },
        // Column
        board => {
            let new_board = Array.from({length: 9}, () => Array(9));
            let columns = [1, 2, 3];
            for (let a = 2 ; a >= 0 ; a--) {
                let b = Random(a + 1);
                [columns[a], columns[b]] = [columns[b], columns[a]];
            }
            let i = 0;
            for (let a = 0 ; a < 3 ; a++) {
                for (let b = (columns[a] - 1) * 3 ; b < columns[a] * 3 ; b++) {
                    for (let c = 0 ; c < 9 ; c++) {
                        new_board[c][b] = board[c][i];
                    }
                    i++;
                }
            }
            return new_board;

        }
    ],
    // Reflect
    [
        // Vertical
        board => board.map(row => row.reverse()),
        // Horizontal
        board => board.reverse(),
        // y = x
        board => {
            let new_board = Array.from({length: 9}, () => Array(9));
            for (let y = 0 ; y < 9 ; y++) {
                for (let x = 0 ; x < 9 ; x++) {
                    new_board[y][x] = board[8 - x][8 - y];
                }                
            }
            return new_board;
        },
        // y = -x
        board => {
            let new_board = Array.from({length: 9}, () => Array(9));
            for (let y = 0 ; y < 9 ; y++) {
                for (let x = 0 ; x < 9 ; x++) {
                    new_board[y][x] = board[x][y];
                }                
            }
            return new_board;
        }
    ]
];
let Random = (range, start = 0) => Math.floor(Math.random() * range) + start;
function Click(e) {
    let div = e.target;
    let [x, y] = [parseInt(div.getAttribute('x')), parseInt(div.getAttribute('y'))];
    let cell = Game.data[y][x];
    if (!Game.active_number || cell.type === 'fixed') return;
    if (cell.value === Game.active_number) Game.Clear_Cell(cell);
    else Game.Set_Cell(cell, Game.active_number);
}
window.onload = () => {
    Game.level_page.Set_Onclick();
    Game.Create_Divs();
    Game.board_changes = Board_Changes;
}