const checkWinner = require('./checkWinner')

describe('the function checkWinner', () => {
    it('should return null values if there is no winner', () => {
        // Arrange
        const playedColumnIndex = 0
        const playedColumnRow = 0
        const currentPlayer = 'red'
        const board = [
            ['red', null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
        ]
        // Act
        const [winner, method] = checkWinner(
            playedColumnIndex,
            playedColumnRow,
            currentPlayer,
            board
        )
        // Assert
        expect(winner).toBe(null)
        expect(method).toBe(null)
    })

    it('should return the correct winner and method for a column win', () => {
        // Arrange
        const playedColumnIndex = 0
        const playedColumnRow = 0
        const currentPlayer = 'red'
        const board = [
            ['red', 'red', 'red', 'red', null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
        ]
        // Act
        const [winner, method] = checkWinner(
            playedColumnIndex,
            playedColumnRow,
            currentPlayer,
            board
        )
        // Assert
        expect(winner).toBe('red')
        expect(method).toBe('COLUMN')
    })
})
