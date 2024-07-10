class Game2048 {
    score = 0;

    constructor(size = 4,) {
        this.size = size;
        this.isGameOver = false;
        this.isGameOverChecking = false;

        this.#createField()
    }

    #createField() {
        this.playField = new Array(this.size).fill(0).map(() => new Array(this.size).fill(0));
        this.emptyCell = []
        this.playField.forEach((row, y) => row.forEach((cell, x) => {
            if (cell === 0) this.emptyCell.push({y, x})
        }))
        this.#createNewBlock()
        this.#createNewBlock()
    }

    #createNewBlock() {
        const rand = Math.floor(this.emptyCell.length * Math.random())
        const cell = this.emptyCell[rand]
        this.emptyCell.splice(rand, 1)
        this.playField[cell.y][cell.x] = Math.round(Math.random() * 10) / 10 >= 0.9 ? 4 : 2
    }

    #saveData() {
        const lastField = JSON.stringify(this.playField)
        const lastScore = this.score
        this.lastData = {
            lastField,
            lastScore
        }
    }

    #isChanged() {
        return !(JSON.stringify(this.playField) === this.lastData.lastField && this.lastData.lastScore === this.score);
    }


    #checkGameEnd() {
        if (this.emptyCell.length !== 0) return;

        this.#saveData()
        this.isGameOverChecking = true

        this.up()
        this.down()
        this.right()
        this.left()

        if (!this.#isChanged()) {
            this.isGameOver = true
        } else {
            this.playField = JSON.parse(this.lastData.lastField)
            this.isGameOverChecking = false
        }
    }


    #move(firstX, firstY, dirX, dirY) {
        if (this.isGameOver) return

        this.#saveData()
        let x = firstX;
        let y = firstY;

        const moveTarget = (targetCell) => {
            targetCell.y += dirY;
            targetCell.x += dirX;
        }

        const clearCell = (x, y) => {
            this.playField[y][x] = 0
            this.emptyCell.push({y, x})
        }

        for (let i = 0; i < this.size; i++) {
            let targetCell = {x: x, y: y}

            for (let j = 1; j < this.size; j++) {
                x += dirX;
                y += dirY;

                if (this.playField[y][x] === 0) continue

                if (this.playField[y][x] === this.playField[targetCell.y][targetCell.x]) {
                    this.playField[targetCell.y][targetCell.x] += this.playField[y][x]
                    this.score += this.playField[targetCell.y][targetCell.x]
                    clearCell(x, y)
                    moveTarget(targetCell)
                } else if (this.playField[targetCell.y][targetCell.x] === 0) {
                    this.playField[targetCell.y][targetCell.x] = this.playField[y][x]
                    this.emptyCell.splice(this.emptyCell.findIndex((cell) => (cell.y === targetCell.y && cell.x === targetCell.x)), 1)
                    clearCell(x, y)
                } else if ((targetCell.x + dirX) !== x || (targetCell.y + dirY) !== y) {
                    moveTarget(targetCell)
                    this.emptyCell.splice(this.emptyCell.findIndex((cell) => (cell.y === targetCell.y && cell.x === targetCell.x)), 1)
                    this.playField[targetCell.y][targetCell.x] = this.playField[y][x]
                    clearCell(x, y)
                } else {
                    moveTarget(targetCell)
                }
            }


            if (dirX === 0) {
                x++;
                y = firstY;
            } else {
                y++;
                x = firstX;
            }
        }

        if (!this.isGameOverChecking) this.#checkGameEnd()
        if (this.#isChanged()) this.#createNewBlock()

    }

    up() {
        this.#move(0, 0, 0, 1)
    }

    left() {
        this.#move(0, 0, 1, 0)
    }

    right() {
        this.#move(this.size - 1, 0, -1, 0)
    }

    down() {
        this.#move(0, this.size - 1, 0, -1)
    }

}

(function init() {
    let game = new Game2048();


    const cellColor = {
        2: "#ede3d9",
        4: "#ede0c8",
        8: "#f2b17a",
        16: "#f59564",
        32: "#eb6d4d",
        64: "#e94133",
        128: "#F1D268FF",
        256: "#f0cf56",
        512: "#efca41",
        1024: "#F2C927FF",
        2048: "#F3C500FF",
        4096: "#FF504BFF",
        8192: "#FF224BFF",
        16384: "#F8131EFF",
        32768: "#F8131EFF",
        65536: "#539AE5FF",
        131072: "#0076C1FF",
    }


    const render = () => {
        const score = document.getElementById("score")
        const root = document.getElementById("root")
        const btn = document.getElementById("new-game-btn")

        btn.addEventListener("click", () => {
            game = new Game2048()
            render();
        })

        score.innerText = String(game.score)

        let html = ''

        game.playField.forEach((row, i) => {
            html += '<div class="row">'
            row.forEach((cell, j) => {
                html += `<div class="cell" style="background-color: ${cellColor[cell]}; color: ${cell === 2 || cell === 4 ? "#776e65" : ""}; font-size: ${String(cell).length > 3 ? "32px" : ""}" id=${i * game.size + j + 1}>${cell !== 0 ? cell : ""}</div>`
            })
            html += '</div>'
        })

        root.innerHTML = html
    }

    render()

    document.addEventListener("keydown", (e) => {

        switch (e.key) {
            case "ArrowUp":
                game.up()
                break;
            case "ArrowLeft":
                game.left()
                break;
            case "ArrowDown":
                game.down()
                break;
            case "ArrowRight":
                game.right()
                break;
            default:
                return
        }
        if (game.isGameOver) {
            alert("Game over! Your score: " + game.score)
            game = new Game2048()
        }
        render()
    })

})()