var koldiv = document.querySelectorAll(".xo > div > div");
var images = document.querySelectorAll(".xo > div > div > img");
var kol = [];
KOL();
function KOL() {
    kol = [];
    for (let a  = 0 ; a < 9 ; a++) {
        images[a].style.opacity = 0;
        images[a].classList.remove("image","scale");
        images[a].src = "";
        kol.push({status: "empty", team: "empty", div: koldiv[a]});
    }
};
var nobat = "o";
var endArray = [];
var endCheck = false;
var drawCheck = true;
var xWinNumResult = document.querySelector(".x-score");
var oWinNumResult = document.querySelector(".o-score");
var restartDiv = document.querySelector(".restart");
var restartText = document.querySelector(".restart-div3");
var restartBtn = document.querySelector(".restart-btn > button");
var xDiv = document.querySelector(".x-img > img");
var oDiv = document.querySelector(".o-img > img");
var oInfoDiv = document.querySelector(".o-information");
var oInfo = document.querySelector(".o-info");
var oStatus = "<";
var xInfoDiv = document.querySelector(".x-information");
var xInfo = document.querySelector(".x-info");
var xStatus = "<";
var xWinNum = 0;
var oWinNum = 0;
var drawNum = 0;
var xWinPercent = 0;
var oWinPercent = 0;
var drawPercent = 0;
let gameNum = 0;
var xGameNumDiv = document.querySelector(".x-game-num");
var xWinNumDiv = document.querySelector(".x-win-num");
var xDrawNumDiv = document.querySelector(".x-draw-num");
var xLoseNumDiv = document.querySelector(".x-lose-num");
var xWinPercentDiv = document.querySelector(".x-win-percent");
var xDrawPercentDiv = document.querySelector(".x-draw-percent");
var xLosePercentDiv = document.querySelector(".x-lose-percent");
var xWinChartDiv = document.querySelector(".x-win-chart");
var xDrawChartDiv = document.querySelector(".x-draw-chart");
var xLoseChartDiv = document.querySelector(".x-lose-chart");
var oGameNumDiv = document.querySelector(".o-game-num");
var oWinNumDiv = document.querySelector(".o-win-num");
var oDrawNumDiv = document.querySelector(".o-draw-num");
var oLoseNumDiv = document.querySelector(".o-lose-num");
var oWinPercentDiv = document.querySelector(".o-win-percent");
var oDrawPercentDiv = document.querySelector(".o-draw-percent");
var oLosePercentDiv = document.querySelector(".o-lose-percent");
var oWinChartDiv = document.querySelector(".o-win-chart");
var oDrawChartDiv = document.querySelector(".o-draw-chart");
var oLoseChartDiv = document.querySelector(".o-lose-chart");
var image_directory_path = "../../images/xo/";
for (let a = 0 ; a < 9 ; a++) {
    koldiv[a].onclick = function() {
        if (!endCheck) {
            if (kol[a].status == "empty") {
                if (nobat == "o") {
                    nobat = "x";
                    xDiv.style.filter = "";
                    oDiv.style.filter = "drop-shadow(-1px -1px 0.6px rgb(20,240,200)) drop-shadow(0px -1px 0.6px rgb(20,240,200)) drop-shadow(1px -1px 0.6px rgb(20,240,200)) drop-shadow(-1px 0px 0.6px rgb(20,240,200)) drop-shadow(1px 0px 0.6px rgb(20,240,200)) drop-shadow(-1px 1px 0.6px rgb(20,240,200)) drop-shadow(0px 1px 0.6px rgb(20,240,200)) drop-shadow(1px 1px 0.6px rgb(20,240,200)) ";
                }
                else {
                    nobat = "o";
                    oDiv.style.filter = "";
                    xDiv.style.filter = "drop-shadow(-1px -1px 0.6px rgb(20,240,200)) drop-shadow(0px -1px 0.6px rgb(20,240,200)) drop-shadow(1px -1px 0.6px rgb(20,240,200)) drop-shadow(-1px 0px 0.6px rgb(20,240,200)) drop-shadow(1px 0px 0.6px rgb(20,240,200)) drop-shadow(-1px 1px 0.6px rgb(20,240,200)) drop-shadow(0px 1px 0.6px rgb(20,240,200)) drop-shadow(1px 1px 0.6px rgb(20,240,200)) ";
                }
                images[a].src = image_directory_path + nobat + ".png";
                    var opacityAnimation = setInterval(function(){
                    let opacity = images[a].style.opacity * 10;
                    opacity += 1;
                    images[a].style.opacity = opacity / 10;
                    if (opacity == 10) {
                        clearInterval(opacityAnimation);
                    }
                },15)
                kol[a].status = "selected";
                kol[a].team = nobat;
                let endCheck1 = true;
                let scoreCheck = false;
                for (let b = 0 ; b < 9 ; b+=3) {
                    if ((kol[b].team == kol[b+1].team) && (kol[b].team == kol[b+2].team) && (kol[b].team != "empty")) {
                        endArray.push(b,b+1,b+2);
                        winFunction();
                    }
                }
                for (let b = 0 ; b < 3 ; b++) {
                    if ((kol[b].team == kol[b+3].team) && (kol[b].team == kol[b+6].team) && (kol[b].team != "empty")) {
                        endArray.push(b,b+3,b+6);
                        winFunction();
                    }
                }
                if ((kol[0].team == kol[4].team) && (kol[0].team == kol[8].team) && (kol[0].team != "empty")) {
                    endArray.push(0,4,8);
                    winFunction();
                }
                if ((kol[2].team == kol[4].team) && (kol[2].team == kol[6].team) && (kol[2].team != "empty")) {
                    endArray.push(2,4,6);
                    winFunction();
                }
                if (!endCheck) {
                    for (let b = 0 ; b < 9 ; b++) {
                        if (kol[b].status != "selected") {
                            endCheck1 = false;
                        }
                    }
                }
                if (endCheck1) {
                    endFunction();
                }
                function winFunction() {
                    endCheck = true;
                    drawCheck = false;
                    for (let b = 0 ; b < endArray.length ; b++)
                        images[endArray[b]].classList.add("scale");
                    endFunction();
                }   
                function endFunction() {
                    if (gameNum == 0) {
                        document.querySelector(".x-chart").style.justifyContent = "flex-start";
                        document.querySelector(".o-chart").style.justifyContent = "flex-start";
                        setTimeout(function() {
                            document.querySelector(".x-chart").style.backgroundColor = "#444";
                            document.querySelector(".o-chart").style.backgroundColor = "#444";
                        },300);
                    }
                    xDiv.style.filter = "";
                    oDiv.style.filter = "";
                    for (let b = 0 ; b < 9 ; b++) {
                        koldiv[b].style.cursor = "default";
                    }
                    if (drawCheck) {
                        gameNum++;
                        xGameNumDiv.innerHTML = gameNum;
                        oGameNumDiv.innerHTML = gameNum;
                        drawNum++;
                        xDrawNumDiv.innerHTML = drawNum;
                        oDrawNumDiv.innerHTML = drawNum;
                        percent();
                        restartText.innerHTML = "<span class=\"o-span span-anim\"></span><span class=\"x-span span-anim\"></span>مــســـاوی";
                        restartDiv.style.display = "flex";
                        restartDiv.classList.add("restart-div");
                        setTimeout(function() {
                            restartBtn.style.display = "block";
                        },1250);
                    }
                    else {
                        if (!scoreCheck) {
                            gameNum++;
                            xGameNumDiv.innerHTML = gameNum;
                            oGameNumDiv.innerHTML = gameNum;
                            restartText.innerHTML = "<span class=\"" + nobat + "-span span-anim\"></span>بـــرنــده شــد";
                            if (nobat == "o") {
                                oWinNum++;
                                oWinNumResult.innerHTML = oWinNum;
                                oWinNumDiv.innerHTML = oWinNum;
                                xLoseNumDiv.innerHTML = oWinNum;
                            }
                            else {
                                xWinNum++;
                                xWinNumResult.innerHTML = xWinNum;
                                xWinNumDiv.innerHTML = xWinNum;
                                oLoseNumDiv.innerHTML = xWinNum;
                            }
                            percent();
                            scoreCheck = true;
                        }
                        setTimeout(function(){
                            restartDiv.style.display = "flex";
                            restartDiv.classList.add("restart-div");
                        },300);
                        setTimeout(function() {
                            restartBtn.style.display = "block";
                        },1550);
                    }
                    function percent() {
                        xWinPercent = (xWinNum / gameNum * 100).toFixed(2);
                        oWinPercent = (oWinNum / gameNum * 100).toFixed(2);
                        drawPercent = (drawNum / gameNum * 100).toFixed(2);
                        let hhh = 1;
                        let div = xWinPercent;
                        percent2();
                        hhh++;
                        div = oWinPercent;
                        percent2();
                        hhh++;
                        div = drawPercent;
                        percent2();
                        function percent2() {
                            let split = div.split("");
                            let length = split.length;
                            for (let z = 1 ; z < 3 ; z++) {
                                if (split[length-z] == 0) {
                                    split.pop();
                                }
                                else {
                                    break;
                                }
                            }
                            if (split[split.length-1] == ".") {
                                split.pop();
                            }
                            switch(hhh) {
                                case 1 :
                                    xWinPercent = split.join("");
                                    break;
                                case 2 :
                                    oWinPercent = split.join("");
                                    break;
                                case 3 :
                                    drawPercent = split.join("");
                                    break;
                            }
                        }
                        if (gameNum == 1) {
                            document.querySelector(".x-chart").style.justifyContent = "flex-start";
                            document.querySelector(".o-chart").style.justifyContent = "flex-start";
                        }
                        xWinPercentDiv.innerHTML = xWinPercent;
                        xDrawPercentDiv.innerHTML = drawPercent;
                        xLosePercentDiv.innerHTML = oWinPercent;
                        xWinChartDiv.style.width = xWinPercent + "%";
                        xDrawChartDiv.style.width = drawPercent + "%";
                        xLoseChartDiv.style.width = oWinPercent + "%";
                        oWinPercentDiv.innerHTML = oWinPercent;
                        oDrawPercentDiv.innerHTML = drawPercent;
                        oLosePercentDiv.innerHTML = xWinPercent;
                        oWinChartDiv.style.width = oWinPercent + "%";
                        oDrawChartDiv.style.width = drawPercent + "%";
                        oLoseChartDiv.style.width = xWinPercent + "%";

                    }
                }
            }
        }
    }
}
function restart() {
    restartDiv.style.display = "none";
    restartBtn.style.display = "none";
    restartDiv.classList.remove("restart-div")
    nobat = "o";
    endCheck = false;
    drawCheck = true;
    endArray = [];
    KOL();
    for (let b = 0 ; b < 9 ; b++) {
        koldiv[b].style.cursor = "pointer";
    }
}
oInfoDiv.onclick = function() {
    let width1 = oInfoDiv.offsetWidth;
    let width2 = oInfo.offsetWidth;
    if (oStatus == "<") {
        oStatus = ">";
        oInfoDiv.style.right = width2 + "px";
        oInfo.style.right = width2 + "px";
        return false;
    }
    if (oStatus == ">") {
        oStatus = "<";
        oInfoDiv.style.right = "0px";
        oInfo.style.right = "0px";
    }
}
xInfoDiv.onclick = function() {
    let width1 = xInfoDiv.offsetWidth;
    let width2 = xInfo.offsetWidth;
    if (xStatus == "<") {
        xStatus = ">";
        xInfoDiv.style.left = width2 + "px";
        xInfo.style.left = width2 + "px";
        return false;
    }
    if (xStatus == ">") {
        xStatus = "<";
        xInfoDiv.style.left = "0px";
        xInfo.style.left = "0px";
    }
}