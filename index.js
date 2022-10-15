let turnCount = 1
let redsTurn = true
let board = [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
]
let gameIsOver = false

const insults = [
    'No room at the inn!',
    'Quit it!',
    'Get on with your life!',
    'How dumb are you?!',
    "It's full you numpty!",
    "I will wrastle you if you don't stop",
    "C'mon now...",
    'Nope',
    'Double Nope',
    'Stahp plz',
    'But why though?',
    'Where is it supposed to go then genius?',
    'Triple Nope',
    'Who raised you?',
]

// Setup the DOM elements to interact with
const currentPlayerHighlight = document.getElementById(
    'current-player-highlight'
)
const currentPlayerMessage = document.getElementById('current-player')
const allSpaces = document.querySelectorAll('.space-inner')
const winMessage = document.getElementById('win-message')

// Setup audio
setTimeout(() => {
    const annoyingMusic = document.getElementById('annoying-music')
    annoyingMusic.volume = 0.2
}, 500)

function playCoinSound() {
    const coin = new Audio('/music/coin.mp3')
    coin.play()
}

function playHornSound() {
    const horn = new Audio('/music/horn.mp3')
    horn.play()
}

// Setup Rowan copter
const rowancopter = document.getElementById('top-copter')
let rowanTime = -1000
setInterval(() => {
    rowancopter.style.transform = `translateX(${rowanTime}px)`
    rowanTime += 3
}, 10)
setInterval(() => {
    rowanTime = -1000
}, 20000)

// Add onclick event to all columns
const allColumns = document.querySelectorAll('.column')
allColumns.forEach(column => {
    column.addEventListener('click', event => {
        event.stopPropagation()
        event.preventDefault()
        const clickedColumnId = event.target.classList[1]
        takeTurn(clickedColumnId)
    })
})

// Process a turn
function takeTurn(playedColumnId) {
    playCoinSound()
    const playedColumnIndex = parseInt(playedColumnId)

    // Handle clicks after game is over
    if (gameIsOver) {
        console.log(
            '%cSome idiot is trying to play even though the game is over...',
            'color:red'
        )
        return false
    }

    console.log(
        `%c--------------- TURN ${turnCount} ---------------`,
        'color:orange; font-weight:900'
    )
    console.log(`Clicked column %c${playedColumnIndex}`, 'color:blue')

    // Find the space to fill
    const playedRowIndex = board[playedColumnIndex].lastIndexOf(null)
    // Handle error if column is full
    if (playedRowIndex === -1) {
        console.log('Column is full and so not playable')
        console.log('Generating a sick burn')
        const randomInsultsIndex = Math.floor(Math.random() * insults.length)

        console.log('Deploying sick burn to idiot user')
        const fullColumnMessage = document.getElementById('full-column-message')
        const clickedColumn = document.getElementById(
            `column-${playedColumnIndex}`
        )
        fullColumnMessage.textContent = insults[randomInsultsIndex]
        fullColumnMessage.style.display = 'block'

        console.log(
            `Disable pointer events on column %c${playedColumnIndex}`,
            'color:blue',
            'for 2 seconds...'
        )
        clickedColumn.style.pointerEvents = 'none'
        setTimeout(() => {
            console.log(
                `...Enable pointer events on column %c${playedColumnIndex}`,
                'color:blue'
            )
            console.log('Hide message')
            fullColumnMessage.style.display = 'none'
            clickedColumn.style.pointerEvents = 'auto'
        }, 2000)
        return true
    }

    // Update the board
    const currentPlayer = redsTurn ? 'red' : 'yellow'
    const nextPlayer = redsTurn ? 'yellow' : 'red'
    board[playedColumnIndex][playedRowIndex] = currentPlayer

    // Fill the correct HTML element
    const playedSpaceId = `column-${playedColumnIndex}-space-${playedRowIndex}`
    const playedSpace = document.getElementById(playedSpaceId)
    const playerSymbol = redsTurn ? '🔴' : '🟡'
    console.log(
        `Set ${playedSpaceId} content to ${playerSymbol} and animate in`
    )

    playedSpace.textContent = playerSymbol
    playedSpace.style.display = 'block'

    // Check for a winner
    const [winner, method] = checkWinner(
        playedColumnIndex,
        playedRowIndex,
        currentPlayer,
        board
    )

    // If there is a winner stop the game
    if (winner) {
        playHornSound()
        console.log(
            `%c${currentPlayer.toUpperCase()} IS THE WINNER BY ${method}!`,
            'color:green'
        )
        console.log('Set gameIsOver to %ctrue', 'color:blue')
        gameIsOver = true
        console.log('Hide currentPlayer message')
        currentPlayerMessage.style.display = 'none'
        winMessage.innerHTML = `<span class="text-${currentPlayer}">${currentPlayer}<span/> has won in  ${turnCount} turns with a ${method}!`
        winMessage.style.display = 'block'
        allColumns.forEach(column => {
            column.style.pointerEvents = 'none'
        })
    }

    // If the board is full and nobody wins
    if (!gameIsOver && turnCount === 42) {
        console.log('%cNobody wins, what a let down', 'font-weight:900')
        console.log('Express disbelief in winMessage')
        winMessage.innerHTML = `Your either the greatest or the worst players I've ever seen`
        winMessage.style.display = 'block'
        currentPlayerMessage.style.display = 'none'
        console.log('Make all columns unclickable')
        allColumns.forEach(column => {
            column.style.pointerEvents = 'none'
        })
        console.log('Set gameIsOver to %ctrue', 'color:blue')
        gameIsOver = true
    }

    // If the game isn't over prep for the next turn
    if (!gameIsOver) {
        console.log(
            '%cNo winner found, processing next turn',
            'font-weight:900'
        )
        console.log(`Switch player to %c${nextPlayer}`, 'color:blue')
        redsTurn = !redsTurn
        currentPlayerHighlight.classList.toggle('text-red')
        currentPlayerHighlight.classList.toggle('text-yellow')
        currentPlayerHighlight.textContent = redsTurn ? `Red's` : `Yellow's`

        console.log('Increase turn count')
        turnCount++
    }
}

function checkWinner(playedColumnIndex, playedRowIndex, currentPlayer, board) {
    console.log('%cChecking for a winner', 'font-weight:900')

    console.log('Building descending diagonal')
    function buildDescDiagonal() {
        let columnIndex = playedColumnIndex
        let rowIndex = playedRowIndex
        while (columnIndex > 0 && rowIndex > 0) {
            columnIndex--
            rowIndex--
        }

        const descDiagonal = []
        while (columnIndex < 7 && rowIndex < 6) {
            descDiagonal.push(board[columnIndex][rowIndex])
            columnIndex++
            rowIndex++
        }

        return descDiagonal
    }

    console.log('Building ascending diagonal')
    function buildAscDiagonal() {
        let columnIndex = playedColumnIndex
        let rowIndex = playedRowIndex
        while (columnIndex > 0 && rowIndex < 5) {
            columnIndex--
            rowIndex++
        }

        const ascDiagonal = []
        while (columnIndex < 7 && rowIndex > 0) {
            ascDiagonal.push(board[columnIndex][rowIndex])
            columnIndex++
            rowIndex--
        }

        return ascDiagonal
    }

    // Define a win
    let winner
    let method
    const winningPattern = `${currentPlayer},${currentPlayer},${currentPlayer},${currentPlayer}`

    // Gather lines to check
    console.log('Building column')
    const playedColumnToString = board[playedColumnIndex].toString()
    console.log('Building row')
    const playedRowToString = board
        .map(column => column[playedRowIndex])
        .toString()
    const descDiagonalToString = buildDescDiagonal().toString()
    const ascDiagonalToString = buildAscDiagonal().toString()

    // Check lines and return a result
    console.log('Check four possible lines for a win')
    if (playedColumnToString.includes(winningPattern)) {
        winner = currentPlayer
        method = 'COLUMN'
    } else if (playedRowToString.includes(winningPattern)) {
        winner = currentPlayer
        method = 'ROW'
    } else if (descDiagonalToString.includes(winningPattern)) {
        winner = currentPlayer
        method = 'DESC DIAGONAL'
    } else if (ascDiagonalToString.includes(winningPattern)) {
        winner = currentPlayer
        method = 'ASC DIAGONAL'
    } else {
        winner = null
        method = null
    }

    return [winner, method]
}

// Add onclick event to reset button
const resetButton = document.getElementById('reset')
resetButton.addEventListener('click', resetGame)

function resetGame() {
    console.log(
        '%c------------- RESET GAME -------------',
        'color:darkcyan; font-weight:900'
    )
    console.log('%cResetting initial game values', 'font-weight:900')

    // Reset initial game values
    console.log('Set all board values to %cnull', 'color:blue')
    board = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]
    console.log(`Set HTML space elements' content to %c""`, 'color:blue')
    allSpaces.forEach(space => {
        space.textContent = ''
        space.style.display = 'none'
    })
    console.log('Set turnCount to %c1', 'color:blue')
    turnCount = 1
    console.log('Set current player to %cred', 'color:blue')
    currentPlayerHighlight.classList.add('text-red')
    currentPlayerHighlight.classList.remove('text-yellow')
    currentPlayerHighlight.textContent = "Red's"
    currentPlayerMessage.style.display = 'block'
    console.log('Hide win message')
    winMessage.style.display = 'none'
    redsTurn = true
    console.log('Make all columns clickable')
    allColumns.forEach(column => {
        column.style.pointerEvents = 'auto'
    })
    console.log('Set gameIsOver to %cfalse', 'color:blue')
    gameIsOver = false
}

module.exports = checkWinner
