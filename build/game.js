export default class Game {
    constructor() {
        this.grid = [];
        for (let i = 0; i < 10; i++) {
            this.grid[i] = [];
            for (let o = 0; o < 10; o++) {
                this.grid[i][o] = 0;
            }
        }
    }
}