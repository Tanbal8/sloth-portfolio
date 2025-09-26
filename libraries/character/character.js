const Default_Image_Path = '../../images/character/player1/player_default.png';
const Default_Animation = {
    frames: [Default_Image_Path],
    loop: false,
    speed: 0
}
class Character {
    constructor(parent, animations, actions = {}, default_animation = 'default', direction = 1) {
        this.animations = animations;
        this.direction = direction;
        this.animations.default = animations[default_animation] ?? Default_Animation;
        this.body = document.createElement("img");
        this.sound = document.createElement("audio");
        // this.keys = keys;
        document.body.appendChild(this.sound);
        this.active = {
            name: null,
            direction: null
        };
        this.Set_Keys(actions);
        this.Play(default_animation);
        parent.appendChild(this.body);
    }
    Play(which, direction = this.direction) {
        let animation = this.animations[which];
        // Exists Or Already playing
        if (!animation || (which === this.active.name && direction === this.active.direction)) return;
        console.log(which);
        this.direction = direction;
        if (this.interval) clearInterval(this.interval);
        if (animation.frames) {
            let frame = 0;
            this.body.src = animation.frames[frame++];
            this.interval = setInterval(() => {
                if (frame >= animation.frames.length) {
                    if (animation.loop) frame = 0;
                    else {
                        clearInterval(this.interval);
                        frame = 0;
                    }
                }
                this.body.src = animation.frames[frame++];
            }, animation.speed * 50);
        }
        if (this.active.name && this.active.name.sound_check) this.animations[this.active.name].sound.pause();
        if (animation.sound) {
            this.sound.setAttribute('src', animation.sound);
            this.sound.currentTime = 0.1;
            this.sound.play();
            this.active.sound_check = true;
        }
        this.active = {
            name: which,
            direction,
            sound_check: false
        }
        this.Set_Direction();
        if (animation.end) animation.end();
    }
    Set_Direction() {
        let deg = -Math.floor(this.direction / 2) * 180;
        this.body.style.transform = `rotateY(${deg}deg)`;
    }
    Set_Keys(actions) {
        console.log(actions);
        this.actions = {};
        for (let action in actions) {
            this.actions[action] = false;
            window.addEventListener('keydown', e => {
                if (actions[action].includes(e.key)) {
                    this.actions[action] = true;
                    console.log(this.actions);
                }
            });
            window.addEventListener('keyup', e => {
                if (actions[action].includes(e.key)) {
                    this.actions[action] = false;
                    console.log(this.actions);
                }
            });
        }
        
    }
}
let animation = {
    default: {
        frames: [Default_Image_Path],
        loop: false,
        speed: 0
    },
    walk: {
        frames: [
            '../../images/character/player1/player_walk1.png',
            '../../images/character/player1/player_walk2.png'
        ],
        loop: true,
        speed: 5
    },
    jump: {
        frames: ['../../images/character/player1/player_jump.png'],
        sound: '../../audios/jump.wav',
        loop: false,
        speed: 0,
        end: () => {
            setTimeout(() => {
                player1.Play('default');
            }, 1000);
        }
    },
}
let actions = {
    jump: ['ArrowUp', 'space'],
    right: ['ArrowRight'],
    left: ['ArrowLeft']
}
let player1 = new Character(document.body, animation, actions);
export default Character;
window.onkeydown = e => {
    switch (e.key) {
        case 'ArrowRight' :
            player1.Play('walk', 1);
            break;
        case 'ArrowLeft' :
            player1.Play('walk', -1);
            break;
        case 'space' : case 'ArrowUp' :
            player1.Play('jump');
    }
}
window.onkeyup = e => {
    switch (e.key) {
        case 'ArrowRight' :
            player1.Play('default');
            break;
    }
}