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

module.exports = checkWinner
