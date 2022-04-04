function onCellClick(elCell, idxI, idxJ) {
    if (!gGame.isOn) return
    var cell = gMat[idxI][idxJ]
    if (gIdTime === null) {
        gIdTime = setInterval(timer, 10)
    }
    if (cell.isMarked) return
    if (cell.isShown) return
    if (gGame.isHintClicked){
        showHints(idxI,idxJ)
        return
    }
    cell.isShown = true
    var tdValue = EMPTY
    if (cell.isMine) {
        gGame.livesCount--
        renderLives()
        tdValue = MINES
        if (cell.isMine && gGame.livesCount > 0) {
            console.log('livesCount');

        } else if (cell.isMine && gGame.livesCount === 0) {
            checkGameOver()
            console.log('looser', tdValue);

        }
    }
    if (cell.minesAroundCount > 0) {
        tdValue = cell.minesAroundCount
    }
    if (!cell.minesAroundCount) {
        expandShown(gMat, idxI, idxJ)
    }
    checkVictory()
    elCell.innerHTML = `<td class="cell-${idxI}-${idxJ}">${tdValue}</td>`
    elCell.style.backgroundColor = `rgba(131, 6, 6, 0.719)`
}

function toggleFlag(e, elCell, i, j) {
    e.preventDefault()
    console.log(e, elCell);
    if (gMat[i][j].isMarked) {
        elCell.innerHTML = `<td class="cell-${i}-${j}" oncontextmenu="toggleFlag(event, this,${i},${j})" onclick="onCellClick(this, ${i},${j})">${EMPTY}</td>`
        elCell.style.backgroundColor = `rgb(248, 153, 153)`
        // unmarked flag

    } else {
        // marked with flag

        elCell.innerHTML = `<td class="cell-${i}-${j}" oncontextmenu="toggleFlag(event, this,${i},${j})">${FLAG}</td>`


    }
    gMat[i][j].isMarked = !gMat[i][j].isMarked
}

function changeDiff(elBtn) {
    if (elBtn.innerText === 'Easy') {
        gLevel.size = 4
        gLevel.mines = 2
        gLevel.lives = 1
    }
    if (elBtn.innerText === 'Hard') {
        gLevel.size = 8
        gLevel.mines = 12
        gLevel.lives = 2
    }
    if (elBtn.innerText === 'Expert') {
        gLevel.size = 12
        gLevel.mines = 30
        gLevel.lives = 3
    }
    resetGame()
    initGame()
}