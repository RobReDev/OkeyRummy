const tiles = []
const opponentTiles = []
const yourTiles = []

const tilesCreator = () => {
    const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']
    const colors = ['red', 'black', 'yellow', 'blue']

    for (let c = 0; c < colors.length; c++) {
        for (let v = 0; v < values.length; v++) {
            const value = values[v]
            const color = colors[c]
            tiles.push({value, color})
        }
    }
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 14; j++) {
            let random = Math.floor(Math.random() * (tiles.length - 1))
            if (i === 0)
                opponentTiles.push(tiles[random]);
            if (i === 1)
                yourTiles.push(tiles[random]);
            tiles.splice(random, 1);
        }
    }
    return (tiles)
}
tilesCreator();

const sortTiles = (tilesArray) => tilesArray.sort((a, b) => a.value - b.value);
sortTiles(yourTiles)
sortTiles(opponentTiles)

const run = (tileBoxes, playerTiles) => {
    let tileBoxes1 = document.querySelectorAll(tileBoxes)
    for (let tile = 0; tile < 14; tile++) {
        let boxItem1 = tileBoxes1[tile].querySelector(".boxes_items")
        boxItem1.style.color = playerTiles[tile].color
        boxItem1.innerHTML = playerTiles[tile].value
    }
}
run(".tilesBoxes", yourTiles);
run(".tilesBoxes1", opponentTiles);


const opponentDiscardedTiles = []
const yourDiscardedTiles = []
const draggableElementOfYourBoard = document.querySelector(".board")
const notDraggableElementOfTourDiscardedTiles = document.querySelector(".yourDiscardedTilesBox")
const draggableElementOfOpponentDiscardedTiles = document.querySelector(".opponentDiscardedTilesBox")
const draggableElementOfGeneratedTilesBox = document.querySelector(".generatedTilesBox")
const bank = document.querySelector('.bank')
bank.innerHTML = `<p class="bank_count">${tiles.length}</p>`
const bankCount = document.querySelector(".bank_count")

const generateTilesFromBank = () => {
    if (document.getElementsByClassName("board")[0].querySelectorAll('.boxes_items').length === 15) {
        alert('Remove one tile from your Tiles')
        return
    }
    if (document.querySelector(".generatedTilesBox").innerHTML) {
        alert('Tile already created')
        return
    }
    let random = Math.floor(Math.random() * tiles.length - 1)
    const tileColor = tiles[random].color
    const tileValue = tiles[random].value
    const randomId = Math.random()
    tiles.splice(random, 1);
    draggableElementOfGeneratedTilesBox.innerHTML = `<div class="boxes_items" style="color: ${tileColor}"  id="${randomId}" draggable="true">${tileValue}</div>`
    bankCount.innerHTML--
}
bank.addEventListener("click", generateTilesFromBank)

let emptyTileBoxIndex
const generateRandomTileAndAppend = () => {
    generateTilesFromBank()
    const generatedTile = document.getElementsByClassName("generatedTilesBox")[0].getElementsByClassName("boxes_items")[0]
    for (let t = 0; t < 2; t++) {
        for (let i = 0; i < 12; i++) {
            if (t === 0) {
                const emptyTileBox = document.getElementsByClassName('first1')[0].getElementsByClassName('tilesBoxes1')[i].innerHTML
                if (!emptyTileBox) {
                    emptyTileBoxIndex = i
                    document.getElementsByClassName("first1")[0].getElementsByClassName("tilesBoxes1")[emptyTileBoxIndex].append(generatedTile)
                }
            }
            if (t === 1) {
                const emptyTileBox = document.getElementsByClassName('second1')[0].getElementsByClassName('tilesBoxes1')[i].innerHTML
                if (!emptyTileBox) {
                    emptyTileBoxIndex = i
                    document.getElementsByClassName("second1")[0].getElementsByClassName("tilesBoxes1")[emptyTileBoxIndex].append(generatedTile)
                }
            }
        }
    }
}

const allowDrop = (e) => e.preventDefault()
const setData = (e) => e.dataTransfer.setData('id', e.target.id)

const onDragStart = (element) => {
    element.addEventListener("dragstart", e => {
        if (element.className[0] === "y") {
            alert("You can't touch it!Please move tiles from you card here.")
            return
        }
        if (element === draggableElementOfOpponentDiscardedTiles && document.querySelector(".generatedTilesBox").innerHTML) {
            alert("Tile already created! Take your created")
            return
        }
        if (element === draggableElementOfOpponentDiscardedTiles &&
            document.getElementsByClassName("board")[0].querySelectorAll('.boxes_items').length === 15) {
            alert('Remove one tile from your Tiles')
            return
        }
        if (element === draggableElementOfYourBoard && draggableElementOfYourBoard.querySelectorAll('.boxes_items').length === 14) {
            alert("Generate or Take Tile from Opponent Tiles Tile First")
            return
        }
        if (element === draggableElementOfYourBoard) {
            setTimeout(() => {
                e.target.style.display = "none"
            }, 0)
        }
        setData(e)
        e.dataTransfer.setData('parentClassName', e.target.parentElement.className)
    })
}
onDragStart(draggableElementOfGeneratedTilesBox)
onDragStart(draggableElementOfYourBoard)
onDragStart(notDraggableElementOfTourDiscardedTiles)
onDragStart(draggableElementOfOpponentDiscardedTiles)

const playerTurn = () => {
    generateRandomTileAndAppend()
    for (let i = 0; i < 12; i++) {
        const randomTileFirst = document.getElementsByClassName("first1")[0].getElementsByClassName('boxes_items')[i]
        const opponentDisTilesBox = document.getElementsByClassName('opponentDiscardedTilesBox')
        if (randomTileFirst) {
            if(randomTileFirst) {
                opponentDiscardedTiles.unshift(randomTileFirst)
            }
            opponentDisTilesBox[0].prepend(opponentDiscardedTiles[0])
            for (let i = 0; i < opponentDiscardedTiles.length - 1; i++) {
                opponentDiscardedTiles[i + 1].style.display = "none"
                if (i === 1){
                    opponentDiscardedTiles[i].style.display = "none"
                }
                if (!opponentDisTilesBox.innerHTML) {
                    opponentDiscardedTiles[0].style.display = "block"
                    opponentDisTilesBox[0].prepend(opponentDiscardedTiles[0])
                }
            }
            return
        }
    }
}
// let winTimes = 0
const dropZoneCreator = (className) => {
    for (const dropZone of document.querySelectorAll(className)) {
        dropZone.addEventListener("dragover", e => {
            allowDrop(e)
        })
        dropZone.addEventListener("dragend", e => {
            setTimeout(() => {
                e.target.style.display = "block"
            }, 0)
        })
        dropZone.addEventListener("drop", e => {
            allowDrop(e)
            let tileId = e.dataTransfer.getData('id')
            let tileParentClassName = e.dataTransfer.getData('parentClassName')
            const targetElement = document.getElementById(tileId)
            if (targetElement.className !== e.target.className) {
                e.target.append(targetElement)
            }
            if (className === '.drop_zone_board') {
                const boxItem = document.getElementsByClassName("opponentDiscardedTilesBox")[0]
                if (boxItem.innerHTML) {
                    boxItem.getElementsByClassName("boxes_items")[0].style.display = "block"
                }
                if (tileParentClassName !== "generatedTilesBox") {
                    opponentDiscardedTiles.splice(0, 1)
                }
            }
            if (className === '.drop_zone_Of_Your_Discarded_Tiles') {
                yourDiscardedTiles.unshift(targetElement)
                if (e.target.className === document.getElementsByClassName("yourDiscardedTilesBox")[0]
                    .getElementsByClassName("boxes_items")[0].className) {
                    document.querySelector(".yourDiscardedTilesBox").prepend(yourDiscardedTiles[0])
                }
                for (let i = 0; i < yourDiscardedTiles.length - 1; i++) {
                    yourDiscardedTiles[i + 1].style.display = "none"
                    if (!e.target.innerHTML) {
                        yourDiscardedTiles[0].style.display = "block"
                        e.target.append(yourDiscardedTiles[0])
                    }
                }
                playerTurn()
                winProgress('.boxes_items')
                // winTimes += 2
            }
        })
    }
}
dropZoneCreator('.drop_zone_board')
dropZoneCreator('.drop_zone_board_2')
dropZoneCreator('.drop_zone_Of_Opponent_Discarded_Tiles')
dropZoneCreator('.drop_zone_Of_Your_Discarded_Tiles')


// let winCount1 = 0
// let winCount2 = 0
const winProgress = (className) => {
    const boxesItems = document.querySelectorAll(className)
    for (let i = 0; i < boxesItems.length - 2; i++) {
        let elementValue = boxesItems[i].innerHTML
        let elementColor = boxesItems[i].style.color
        if ((elementValue && Number(boxesItems[i + 1].innerHTML) === Number(elementValue) + 1 && Number(boxesItems[i + 2].innerHTML) === Number(elementValue) + 2)
            && (elementColor === boxesItems[i + 1].style.color && elementColor === boxesItems[i + 2].style.color)) {
            // winCount1++
            console.log('win2')
        }
        if (elementValue === boxesItems[i + 1].innerHTML && elementValue === boxesItems[i + 2].innerHTML
            && elementColor !== boxesItems[i + 1].style.color && elementColor !== boxesItems[i + 2].style.color
            && boxesItems[i + 1].style.color !== boxesItems[i + 2].style.color) {
            console.log('win')
            // winCount2++
        }
    }
    // const winNumber = winCount1 + winCount2 - winTimes
    // if (winNumber >= 6) {
    //     alert('Congratulations!!! You Won!')
    // }
}





















