'use strict'

const COLORS = [' ', 'white', 'royalBlue', 'yellow', 'green', 'orange', 'pink', 'black', 'purple']
const MINES = '💣';
const EMPTY = ' '
const FLAG = '🏀'
const LOGO = document.querySelector('.logo')
const LBJ = document.querySelector('.lbj')
const TROPHY = document.querySelector('.trophy')
// size: 4,
// mines: 2,
// lives:0

var gDiff = {
    easy: { size: 4, mines: 2, lives: 1 },
    hard: { size: 8, mines: 12, lives: 2 },
    expert: { size: 12, mines: 30, lives: 3 }

}
var gLevel = gDiff.easy
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesCount: gLevel.lives,
    hints: 3,
    isHintClicked: false
}
var gMat;
var gIdTime = null
var gTimer = 0
function initGame() {
    gMat = buildBoard()
    setMinesNegsCount(gMat)
    // clearInterval(gIdTime)
    gGame.livesCount = gLevel.lives
    renderLives()
    gGame.isOn = true
    LBJ.style.display = 'none'
    TROPHY.style.display = 'none'
    renderTable(gMat)
}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {

            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,

            }
        }
    }

    deployMines(board)
    return board
}

function renderTable(mat) {
    var elBoard = document.querySelector('table')
    var strHtml = ''
    var tdValue
    for (var i = 0; i < mat.length; i++) {

        strHtml += '<tr>'
        for (var j = 0; j < mat.length; j++) {
            // console.count('xx');
            var cell = mat[i][j]
            var color = COLORS[cell.minesAroundCount]
            // if(COLORS[cell.minesAroundCount])
            tdValue = EMPTY
            // if (cell.isMine) {
            //     tdValue = MINES
            // }
            // if (cell.minesAroundCount > 0) {
            //     tdValue = cell.minesAroundCount
            // }
            strHtml += `<td style="color:${color}"class="cell-${i}-${j}" oncontextmenu ="toggleFlag(event, this,${i},${j})" onclick="onCellClick(this, ${i},${j})">${tdValue}</td>`


        }
        strHtml += '</tr>'
    }

    elBoard.innerHTML = strHtml
}

function renderLives() {
    var elLives = document.querySelector('.mvp')
    var strHtml = ''
    for (var i = 0; i < gGame.livesCount; i++) {
        strHtml += `<img  onclick="resetGame(this)" src="img/mvp.jpg" alt="mvp"></img>`
    }
    elLives.innerHTML = strHtml
}
function hints() {
    gGame.isHintClicked = !gGame.isHintClicked
    console.log('@!@!@!@!', gGame.isHintClicked)
}

function showHints(idxI, idxJ) {
    var elHints = []
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i > gMat.length - 1) continue
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j > gMat.length - 1) continue
            if (gMat.isShown) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.style.backgroundColor = `rgba(131, 6, 6, 0.719)`
            elHints.push(elCell)

        }
    }

}
function renderHints() {
    var elHints = document.queryCommandIndeterm('.pipen')
    var strHtml = ''
    for (var i = 0; i < gGame.hints; i++) {
        strHtml += `<img onclick="hints(this)" src="img/pipen.jpg" alt="pipen"></img>`
    }
    elHints.innerHTML = strHtml
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j]
            //ran on all matrix and looking for the boombs
            if (cell.isMine) getNeighbors(i, j)
        }
    }
}
function getNeighbors(idxI, idxJ) {

    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i > gMat.length - 1) continue
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (i === idxI && j === idxJ) continue
            if (j < 0 || j > gMat.length - 1) continue
            if (gMat[i][j].isMine) { //
                gMat[i][j].minesAroundCount = null
            } else gMat[i][j].minesAroundCount++

        }
    }



}


function deployMines(board) {
    for (var i = 0; i < gLevel.mines; i++)
        drawMine(board)
}


function drawMine(board) {
    var i = getRandomInt(0, gLevel.size - 1)
    var j = getRandomInt(0, gLevel.size - 1)
    var currMine = board[i][j]
    while (currMine.isMine) {
        i = getRandomInt(0, gLevel.size - 1)
        j = getRandomInt(0, gLevel.size - 1)
        currMine = board[i][j]

    }
    currMine.isMine = true

}

function expandShown(board, idxI, idxJ) {
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i > gMat.length - 1) continue
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (i === idxI && j === idxJ) continue
            if (j < 0 || j > gMat.length - 1) continue
            if (!board[i][j].isMine) {
                board[i][j].isShown = true
                var elCell = document.querySelector(`.cell-${i}-${j}`) //getting the neighbor element by class
                elCell.style.backgroundColor = `rgba(131, 6, 6, 0.719)`
                var tdValue = board[i][j].minesAroundCount || ''
                elCell.innerHTML = `<td class="cell-${i}-${j}">${tdValue}</td>`

            }
        }
    }
}

function checkGameOver() {
    console.log('gameover');
    clearInterval(gIdTime)
    gTimer = 0
    gGame.isOn = false
    LOGO.style.display = 'none'
    LBJ.style.display = 'block'
}

function checkVictory() {
    for (var i = 0; i < gMat.length; i++) {
        for (var j = 0; j < gMat.length; j++) {
            var cell = gMat[i][j]
            if (cell.isMine) continue
            if (cell.isShown) gGame.shownCount++


        }
    }
    if (gGame.shownCount === gLevel.size ** 2 - gLevel.mines) {
        console.log('winner');
        clearInterval(gIdTime)
        gTimer = 0
        LOGO.style.display = 'none'
        TROPHY.style.display = 'block'
        gGame.isOn = false
    } else gGame.shownCount = 0
}
function timer() {

    gTimer++
    var elWatch = document.querySelector('.timer')
    elWatch.innerText = gTimer / 100
}

function resetGame() {
    console.log('reset');
    var elWatch = document.querySelector('.timer')
    clearInterval(gIdTime)
    gTimer = 0
    elWatch.innerText = '00:00'
    gGame.shownCount = 0
    gIdTime = null
    LOGO.style.display = 'block'
    initGame()

}

