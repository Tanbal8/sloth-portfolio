const Image_directory_path = './images/';
const Project = {
    Games: {
        directory_path: './games/',
        container: document.getElementById('game-list'),
        list: {
            '2048': {
                path: '2048/2048.html',
                poster: Image_directory_path + '2048/2048-icon.png',
            },
            'maze': {
                path: 'maze/maze.html',
                poster: '',
            },
            'chess': {
                path: 'chess/chess.html',
                poster: Image_directory_path + 'chess/chess-icon.png',
            },
            'sudoku': {
                path: 'sudoku/sudoku.html',
                poster: '',
            },
            'number puzzle': {
                path: 'number-puzzle/number-puzzle.html',
                poster: '',
            },
            'xo': {
                path: 'xo/xo.html',
                poster: '',
            },
            'numbers': {
                path: 'numbers/numbers.html',
                poster: '',
            },
        }
    },
    Apps: {
        directory_path: './apps/',
        container: document.getElementById('game-list'),
        list: {}
    },
    Create_Buttons() {
        const row = document.createElement('div');
        row.classList.add('row', 'row-cols-1', 'row-cols-sm-2', 'row-cols-md-3', 'row-cols-lg-4', 'row-cols-xl-5', 'row-cols-xxl-6', 'g-3');
        for (let name in Games) Create_Button(name, Games[name], row, Project.Games.directory_path);
        this.Games.container.appendChild(row);
    }
}
const Create_Button = (name, object, parent, directory_path) => {
    let div = document.createElement('div');
    let container = document.createElement('div');
    let name_container = document.createElement('div');
    let play_button = document.createElement('button');
    let how_to_play_button = document.createElement('button');
    container.style.backgroundImage = `url(${object.poster})`;
    name_container.classList.add('name-container');
    name_container.textContent = name;
    play_button.classList.add('play-button');
    how_to_play_button.classList.add('how-to-play-button');
    object.container = container;
    play_button.textContent = 'Play';
    how_to_play_button.textContent = 'How To Play';
    container.appendChild(how_to_play_button);
    container.appendChild(play_button);
    container.appendChild(name_container);
    div.appendChild(container);
    parent.appendChild(div);
    how_to_play_button.setAttribute('disabled', true);
    container.addEventListener('click', e => {
        if (e.target === how_to_play_button) {
            return;
        }
        window.location.href = `${directory_path}${object.path}`;
    });
}
const Games = Project.Games.list, Apps = Project.Apps.list;
console.log(Project);
Project.Create_Buttons();