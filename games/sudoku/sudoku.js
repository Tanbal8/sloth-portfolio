let koldiv = document.querySelectorAll(".game > div > div > div > div");
let kol = [];
let list = [
    "281793465945268371736145829174859632693412587852376194327581946419637258568924713",
    "893714265615823947724956318376548192451239786289671534947382651568197423132465879",
    "149387562385126974267495183658274319914653827732819645476538291823941756591762438",
    "234897516196435728587621439452963187819754362763182954371246895925378641648519273",
    "568397412912854367347261958289635174751428693436719825825146739173982546694573281",
    "267495183385126974149387562732819645914653827658274319591762438823941756476538291",
    "314268597829751346765439812132697485486513729957842631591386274678124953243975168",
    "265941783479583621381762594192674835657328149834195267913856472728419356546237918",
    "176982435932154687845673291659427813328516749417398562564231978791865324283749156",
    "765812439829346751314597268957631842486729513132485697243168975678953124591274386",
    "913568427687342915254197683345926871726851349891473256479685132538219764162734598"
];
let numbers = [false,false,false,false,false,false,false,false,false];
let numberDiv = document.querySelector(".numbers");
let numbersDiv = document.querySelectorAll(".numbers > div");
let gameDiv = document.querySelector(".game");
let levelDiv = document.querySelector(".level");
let GNDiv = document.querySelector(".gn");
let num;
let m = 0;
let mDiv = document.querySelector(".m");
let s = 0;
let sDiv = document.querySelector(".s");
let timerDiv = document.querySelector(".timer-div");
start();
function start() {
    KOL();
    function KOL() {
        kol = [];
        for (let a = 0 ; a < 81 ; a++) {
            let x = (a + 1) % 9;
            if (x == 0) {
                x = 9;
            }
            let y = (81 - (a + 1) + x) / 9;
            let khoone;
            switch (y) {
                case 1 : case 2 : case 3 :
                    Khoone3();
                    break;
                case 4 : case 5 : case 6 :
                    Khoone2();
                    break;
                case 7 : case 8 : case 9 :
                    Khoone1();
                    break;
            }
            function Khoone1() {
                switch (x) {
                    case 1 : case 2 : case 3 :
                        khoone = 1;
                        break;
                    case 4 : case 5 : case 6 :
                        khoone = 2;
                        break;
                    case 7 : case 8 : case 9 :
                        khoone = 3;
                        break;
                }
            }
            function Khoone2() {
                switch (x) {
                    case 1 : case 2 : case 3 :
                        khoone = 4;
                        break;
                    case 4 : case 5 : case 6 :
                        khoone = 5;
                        break;
                    case 7 : case 8 : case 9 :
                        khoone = 6;
                        break;
                }
            }
            function Khoone3() {
                switch (x) {
                    case 1 : case 2 : case 3 :
                        khoone = 7;
                        break;
                    case 4 : case 5 : case 6 :
                        khoone = 8;
                        break;
                    case 7 : case 8 : case 9 :
                        khoone = 9;
                        break;
                }
            }
            koldiv[a].innerHTML = "";
            koldiv[a].classList.remove("unchangeable");
            kol.push({x: x, y: y, khoone: khoone, value: 0, changeable: true, status: "hidden", div: koldiv[a]});
        }
    }
    let n = Math.floor(Math.random() * list.length);
    listNums = list[n].split("");
    for (let a = 0 ; a < 30 ; a++) {
        let x = Math.floor(Math.random() * 4);
        listNums2 = listNums;
        switch (x) {
            // nothing
            case 0 :
                break;
            // rotate
            case 1 :
                let rotateNum = Math.floor(Math.random() * 3);
                let xs = [[],[],[],[],[],[],[],[],[]];
                switch (rotateNum) {
                    // 90
                    case 0 :
                        Rotate();
                        listNums = [];
                        for (let r = 8 ; r > -1 ; r--) {
                            for (let s = 0 ; s < 9 ; s++) {
                                listNums.push(xs[r][s]);
                            }
                        }
                        break;
                    // 180
                    case 1 :
                        listNums.reverse();
                        break;
                    // 270
                    case 2 :
                        Rotate();
                        listNums = [];
                        for (let r = 0 ; r < 9 ; r++) {
                            for (let s = 8 ; s > -1 ; s--) {
                                listNums.push(xs[r][s]);
                            }
                        }
                        break;
                }
                function Rotate() {
                    for (let z = 0 ; z < 9 ; z++) {
                        for (let s = z ; s < z + 1 ; s++) {
                            for (let t = s ; t < 81 ; t += 9) {
                                xs[z].push(listNums2[t]);
                            }
                        }
                    }
                }
                break;
            // translate
            case 2 :
                let translateNum = Math.floor(Math.random() * 2);
                switch (translateNum) {
                    // عمودی
                    case 0 :
                        let columns = [[],[],[]];
                        for (let z = 0 ; z < 3 ; z++) {
                            for (let s = 3 * z ; s < (3 * z) + 3 ; s++) {
                                for (let t = s ; t < 81 ; t += 9) {
                                    columns[z].push(listNums2[t]);
                                }

                            }
                        }
                        Column();
                        function Column() {
                            let n1 = Math.floor(Math.random() * 3);
                            let n2 = Math.floor(Math.random() * 3);
                            if (n1 == n2) {
                                Column();
                                return false;
                            }
                            let c1 = columns[n1];
                            let c2 = columns[n2];
                            columns[n1] = c2;
                            columns[n2] = c1;
                        }
                        listNums = [];
                        for (let d = 0 ; d < 9 ; d++) {
                            for (let e = 0 ; e < 3 ; e++) {
                                for (let f = d ; f < 27 ; f += 9) {
                                    listNums.push(columns[e][f]);
                                }
                            }
                        }
                        break;
                    // افقی
                    case 1 :
                        let rows = [[],[],[]];
                        for (let z = 0 ; z < 27 ; z++) {
                            rows[0].push(listNums2[z]);
                        }
                        for (let z = 27 ; z < 54 ; z++) {
                            rows[1].push(listNums2[z]);
                        }
                        for (let z = 54 ; z < 81 ; z++) {
                            rows[2].push(listNums2[z]);
                        }
                        Row();
                        function Row() {
                            let n1 = Math.floor(Math.random() * 3);
                            let n2 = Math.floor(Math.random() * 3);
                            if (n1 == n2) {
                                Row();
                                return false;
                            }
                            let r1 = rows[n1];
                            let r2 = rows[n2];
                            rows[n1] = r2;
                            rows[n2] = r1;
                        }
                        listNums = [];
                        for (let e = 0 ; e < 3 ; e++) {
                            for (let f = 0 ; f < 27 ; f++) {
                                listNums.push(rows[e][f]);
                            }
                        }
                        break;
                }
                break;
            // scale
            case 3 :
                let scaleNum = Math.floor(Math.random() * 2);
                switch (scaleNum) {
                    // عمودی
                    case 0 :
                        let xs = [[],[],[],[],[],[],[],[],[]];
                        for (let z = 0 ; z < 9 ; z++) {
                            for (let s = z ; s < z + 1 ; s++) {
                                for (let t = s ; t < 81 ; t += 9) {
                                    xs[z].push(listNums2[t]);
                                }
                            }
                        }
                        for (let z = 0 ; z < 9 ; z++) {
                            xs[z].reverse();
                        }
                        listNums = [];
                        for (let r = 0 ; r < 9 ; r++) {
                            for (let t = 0 ; t < 9 ; t++) {
                                listNums.push(xs[t][r])
                            }
                        }
                        break;
                    // افقی
                    case 1 :
                        let ys = [[],[],[],[],[],[],[],[],[]];
                        for (let r = 0 ; r < 9 ; r++) {
                            for (let s = r * 9 ; s < r * 9 + 9 ; s++) {
                                ys[r].push(listNums[s]);
                            }
                        }
                        for (let z = 0 ; z < 9 ; z++) {
                            ys[z].reverse();
                        }
                        listNums = [];
                        for (let r = 0 ; r < 9 ; r++) {
                            for (let s = 0 ; s < 9 ; s++) {
                                listNums.push(ys[r][s]);
                            }
                        }
                        break;
                    }
                break;
        }
    }
    for (let z = 0 ; z < num ; z++) {
        add();
    }
    function add() {
        let n = Math.floor(Math.random() * 81);
        if (!kol[n].changeable) {
            add();
            return false;
        }
        kol[n].changeable = false;
        kol[n].value = parseInt(listNums[n]);
        koldiv[n].innerHTML = listNums[n];
        koldiv[n].classList.add("unchangeable");
    }
}
for (let n = 0 ; n < 9 ; n++) {
    numbersDiv[n].onclick = function() {
        if (numbers[n] == false) {
            for (let x = 0 ; x < 9 ; x++) {
                if (numbers[x]) {
                    numbers[x] = false;
                }
            }
            numbers[n] = true;
        }
        else {
            numbers[n] = false;
        }
        let numberCheck = false;
        for (let x = 0 ; x < 9 ; x++) {
            if (numbers[x]) {
                numbersDiv[x].classList.add("numbers-on");
                numberCheck = true;
                val = x + 1;
                active();
            }
            else {
                numbersDiv[x].classList.remove("numbers-on");
            }
        }
        if (!numberCheck) {
            for (let z = 0 ; z < 81 ; z++) {
                koldiv[z].classList.remove("active");
            }
        }
    }
}
function easy() {
    num = Math.floor(Math.random() * 7) + 35;
    startGame();
}
function medium() {
    num = Math.floor(Math.random() * 6) + 30;
    startGame();
}
function hard() {
    num = Math.floor(Math.random() * 5) + 26;
    startGame();
}
function startGame() {
    start();
    levelDiv.style.display = "none";
    numberDiv.style.display = "flex";
    gameDiv.style.display = "flex";
    s = "00";
    sDiv.innerHTML = "00";
    m = "00";
    mDiv.innerHTML = "00";
    timerDiv.style.display = "flex";
    window.timer = setInterval(function() {
        s++;
        if (s < 10) {
            s = "0" + s;
        }
        if (s == 60) {
            s = "00";
            m++;
            if (m < 10) {
                m = "0" + m;
            }
        }
        sDiv.innerHTML = s;
        mDiv.innerHTML = m;
    },1000);
}
for (let n = 0 ; n < 81 ; n++) {
    koldiv[n].onclick = function() {
        let numberCheck = false;
        for (let a = 0 ; a < 9 ; a++) {
            if (numbers[a]) {
                numberCheck = true;
                let x = a + 1;
                if (kol[n].changeable) {
                    if (kol[n].value != x) {
                        kol[n].value = x;
                        koldiv[n].innerHTML = x;
                    }
                    else {
                        kol[n].value = 0;
                        koldiv[n].innerHTML = "";
                    }
                    val = x;
                    active();
                }
                else {
                    val = kol[n].value;
                    active();
                    for (let z = 0 ; z < numbers.length ; z++) {
                        numbers[z] = false;
                        numbersDiv[z].classList.remove("numbers-on");
                    }
                    numbers[kol[n].value - 1] = true;
                    numbersDiv[kol[n].value - 1].classList.add("numbers-on");
                }
            }
        }
        if (!numberCheck) {
            if (kol[n].value != 0) {
                numbers[kol[n].value - 1] = true;
                numbersDiv[kol[n].value - 1].classList.add("numbers-on");
                val = kol[n].value;
                active();
            }
        }
        for (let b = 0 ; b < 81 ; b++) {
            koldiv[b].classList.remove("wrong");
        }
        for (let b = 0 ; b < 81 ; b++) {
            for (let c = 0 ; c < 81 ; c++) {
                if (b != c) {
                    if ((kol[b].x == kol[c].x) || (kol[b].y == kol[c].y) || (kol[b].khoone == kol[c].khoone)) {
                        if ((kol[b].value == kol[c].value) && kol[b].value != 0) {
                            koldiv[b].classList.add("wrong");
                            koldiv[c].classList.add("wrong");
                        }
                    }
                }
            }
        }
        for (let b = 0 ; b < 9 ; b++) {
            numbersDiv[b].style.backgroundColor = "azure";
        }
        for (let b = 1 ; b < 10 ; b++) {
            let array = [];
            let number;
            number = 1;
            nFunction();
            aFunction();
            function nFunction() {
                for (let c = 0 ; c < 81 ; c++) {
                    if (kol[c].khoone == number) {
                        if (kol[c].value == b) {
                            array.push(kol[c]);
                        }
                    }
                }
            }
            function aFunction() {
                if (array.length == 1) {    
                    array = [];
                    number++;
                    if (number < 10) {
                        nFunction();
                        aFunction();
                    }
                    if (number == 10) {
                        numbersDiv[b-1].style.backgroundColor = "rgb(0,150,255)";
                    }
                }
            }
        }
    }
}
function active() {
    for (let z = 0 ; z < 81 ; z++) {
        koldiv[z].classList.remove("active");
        if (kol[z].value == val) {
            koldiv[z].classList.add("active");
        }
    }
}