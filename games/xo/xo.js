class Cell {
    constructor(x, y, div, team = 'empty', selected = false) {
        this.x = x;
        this.y = y;
        this.div = div;
        this.team = team;
        this.selected = selected;
    }
}
const Image_Directory_Path = "../../images/xo/";
var Game = {
    check: false,
    div: document.getElementById('game-div'),
    data: Array.from({length: 3}, () => Array(3)),
    turn: 'x',
    count: 0,
    backdrop: document.getElementById('backdrop'),
    players: {
        x: {
            info: {
                win: 0,
                win_percent: 0,
                lose: 0,
                lose_percent: 0,
                draw: 0,
                draw_percent: 0,
            },
            info_panel: {
                open: false,
                button: document.getElementById('x-information-button'),
                div: document.getElementById('x-information'),
                game_count_div: document.getElementById('x-game-count'),
                win_div: document.getElementById('x-win-count'),
                lose_div: document.getElementById('x-lose-count'),
                draw_div: document.getElementById('x-draw-count'),
                chart: {
                    div: document.getElementById('x-chart'),
                    win: document.getElementById('x-chart-win'),
                    lose: document.getElementById('x-chart-lose'),
                    draw: document.getElementById('x-chart-draw')
                }
            },
            score_board: {
                image: document.getElementById('x-score-img'),
                score: document.getElementById('x-score')
            }
        },
        o: {
            info: {
                win: 0,
                win_percent: 0,
                lose: 0,
                lose_percent: 0,
                draw: 0,
                draw_percent: 0,
            },
            info_panel: {
                open: false,
                button: document.getElementById('o-information-button'),
                div: document.getElementById('o-information'),
                game_count_div: document.getElementById('o-game-count'),
                win_div: document.getElementById('o-win-count'),
                lose_div: document.getElementById('o-lose-count'),
                draw_div: document.getElementById('o-draw-count'),
                chart: {
                    div: document.getElementById('o-chart'),
                    win: document.getElementById('o-chart-win'),
                    lose: document.getElementById('o-chart-lose'),
                    draw: document.getElementById('o-chart-draw')
                }
            },
            score_board: {
                image: document.getElementById('o-score-img'),
                score: document.getElementById('o-score') 
            }
        }
    },
    end_panel: {
        div: document.getElementById('end-panel'),
        image_div: document.getElementById('end-panel-images-div'),
        text_div: document.getElementById('end-panel-text'),
        restart_button: document.getElementById('restart-button'),
        Open() {
            Game.backdrop.style.display = 'block';
            this.div.style.display = 'flex';
        },
        Close() {
            Game.backdrop.style.display = 'none';
            this.div.style.display = 'none';
            for (let a = this.image_div.children.length - 1 ; a >= 0 ; a--) this.image_div.children[a].remove();
        }
    },
    Start() {
        this.check = true;
        this.turn = 'x';
        let cells = document.querySelectorAll('#game-div > div');
        for (let y = 0 ; y < 3 ; y++) {
            for (let x = 0 ; x < 3 ; x++) {
                this.data[y][x] = new Cell(x, y, cells[(y * 3) + x]);
                this.data[y][x].div.classList.remove('x', 'o', 'winner');
                this.data[y][x].div.removeEventListener('click', Click);
                this.data[y][x].div.addEventListener('click', Click);
                this.data[y][x].div.setAttribute('x', x);
                this.data[y][x].div.setAttribute('y', y);
            }
        }
        this.players[this.turn].score_board.image.classList.add('active-turn');
    },
    End(winner, cells = []) {
        this.check = false;
        this.count++;
        this.players[this.turn].score_board.image.classList.remove('active-turn');
        Game.data.forEach(row => row.forEach(cell => {
            cell.div.removeEventListener('click', Click);
        }));
        let loser = this.Get_Opponent(winner);
        if (winner) {
            this.players[winner].info.win++;
            this.players[loser].info.lose++;
            this.players[winner].score_board.score.textContent = this.players[winner].info.win;
            this.players[winner].score_board.image.classList.remove('active-turn');
            cells.forEach(cell => {
                cell.classList.add('winner');
            });
            let image = document.createElement('img');
            image.src = Image_Directory_Path + winner + '.png';
            this.end_panel.image_div.appendChild(image);
            image.setAttribute('id', `end-panel-${winner}-image`);
            this.end_panel.text_div.textContent = 'بـــرنــده شــد';
        }
        else {
            this.players.x.info.draw++;
            this.players.o.info.draw++;
            let x_image = document.createElement('img');
            let o_image = document.createElement('img');
            x_image.setAttribute('id', `end-panel-x-image`);
            o_image.setAttribute('id', `end-panel-o-image`);
            x_image.src = Image_Directory_Path + 'x.png';
            o_image.src = Image_Directory_Path + 'o.png';
            this.end_panel.image_div.appendChild(x_image);
            this.end_panel.image_div.appendChild(o_image);
            this.end_panel.text_div.textContent = 'مــســـاوی';
        }
        this.Update_Info();
        this.end_panel.Open();
    },
    End_Check() {
        let win_check = false, cells = [];
        let patterns = [
            [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}],
            [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}],
            [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}],
            [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
            [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}],
            [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}],
            [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}],
            [{x: 2, y: 0}, {x: 1, y: 1}, {x: 0, y: 2}]
        ]
        patterns.forEach(pattern => {
            if (pattern.every(position => this.data[position.y][position.x].team == this.turn)) {
                win_check = true;
                pattern.forEach(position => {
                    cells.push(this.data[position.y][position.x].div);
                });
            }
            
        });
        if (win_check) return {status: 2, cells: [...new Set(cells)]}; // Win
        let full_check = !this.data.some(row => row.some(cell => !cell.selected));
        if (full_check) return {status: 1}; // Draw
        return {status: 0}; // Continue
    },
    Update_Info() {
        let [x, o] = [this.players.x, this.players.o];
        x.info.win_percent = Percent(x.info.win / this.count);
        x.info.lose_percent = Percent(x.info.lose / this.count);
        x.info.draw_percent = Percent(x.info.draw / this.count);
        o.info.win_percent = Percent(o.info.win / this.count);
        o.info.lose_percent = Percent(o.info.lose / this.count);
        o.info.draw_percent = Percent(o.info.draw / this.count);
        x.info_panel.game_count_div.textContent = this.count;
        x.info_panel.win_div.textContent = `${x.info.win} ( ${x.info.win_percent}٪ )`;
        x.info_panel.lose_div.textContent = `${x.info.lose} ( ${x.info.lose_percent}٪ )`;
        x.info_panel.draw_div.textContent = `${x.info.draw} ( ${x.info.draw_percent}٪ )`;
        o.info_panel.game_count_div.textContent = this.count;
        o.info_panel.win_div.textContent = `${o.info.win} ( ${o.info.win_percent}٪ )`;
        o.info_panel.lose_div.textContent = `${o.info.lose} ( ${o.info.lose_percent}٪ )`;
        o.info_panel.draw_div.textContent = `${o.info.draw} ( ${o.info.draw_percent}٪ )`;
        x.info_panel.chart.win.style.width = x.info.win_percent + '%';
        x.info_panel.chart.lose.style.width = x.info.lose_percent + '%';
        x.info_panel.chart.draw.style.width = x.info.draw_percent + '%';
        o.info_panel.chart.win.style.width = o.info.win_percent + '%';
        o.info_panel.chart.lose.style.width = o.info.lose_percent + '%';
        o.info_panel.chart.draw.style.width = o.info.draw_percent + '%';
        setTimeout(() => {
            x.info_panel.chart.div.style.backgroundColor = '#444';
            o.info_panel.chart.div.style.backgroundColor = '#444';
        }, 1000);
    },
    Get_Opponent(team) {
        return team == 'x' ? 'o' : 'x';
    },
    Next_Turn() {
        this.players[this.turn].score_board.image.classList.remove('active-turn');
        this.turn = this.Get_Opponent(this.turn);
        this.players[this.turn].score_board.image.classList.add('active-turn');
    }
}
function Click(e) {
    if (!Game.check) return;
    let div = e.target;
    let [x, y] = [Number(e.target.getAttribute('x')), Number(e.target.getAttribute('y'))];
    let cell = Game.data[y][x];
    if (cell.selected) return;
    cell.selected = true;
    cell.team = Game.turn;
    div.classList.add(Game.turn);
    // End Check
    let end = Game.End_Check();
    if (end.status == 2) Game.End(Game.turn, end.cells); // Win
    else if (end.status == 1) Game.End(); // Draw
    else Game.Next_Turn(); // Continue
}
function Percent(percent) {
    return (Math.round(percent * 100 * 100) / 100);
}
Game.end_panel.restart_button.addEventListener('click', () => {
    Game.end_panel.Close();
    Game.Start();
});
Game.players.x.info_panel.button.addEventListener('click', () => {
    let data = Game.players.x.info_panel;
    if (data.open) data.div.classList.remove('active-information');
    else data.div.classList.add('active-information');
    data.open = !data.open;
});
Game.players.o.info_panel.button.addEventListener('click', () => {
    let data = Game.players.o.info_panel;
    if (data.open) data.div.classList.remove('active-information');
    else data.div.classList.add('active-information');
    data.open = !data.open;
});
window.onload = () => {
    Game.Start();
}