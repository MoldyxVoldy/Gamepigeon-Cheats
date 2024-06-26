class BoardInit {
    constructor(unclaimed, userclaimed, userscore, oppclaimed, oppscore, turn, subboards, depth, bestMove, userextra=[], oppextra=[]) {
        this.unclaimed = unclaimed
        this.userclaimed = userclaimed
        this.userscore = userscore
        this.oppclaimed = oppclaimed
        this.oppscore = oppscore
        this.turn = turn
        this.subboards = subboards
        this.depth = depth
        this.bestMove = bestMove
        this.userextra = userextra
        this.oppextra = oppextra
        // console.log(arguments)
        // console.log(this)
    }
    show() {
        let map = Object.entries(this.unclaimed).concat(Object.entries(this.userclaimed).concat(Object.entries(this.oppclaimed)))
        for(let i = 0; i < map.length; i++){
            map[i][0]
            let coords = JSON.parse(map[i][0])
            let cell = document.querySelector(`div[id="${coords[0]}${coords[1]}"]`)
            cell.style.backgroundColor = colorNames[map[i][1]]

        }
        for(let user of this.userextra){
            let coords = JSON.parse(user)
            let cell = document.querySelector(`div[id="${coords[0]}${coords[1]}"]`)
            cell.style.backgroundColor = colorNames[Object.values(this.userclaimed)[0]]
        }
        for(let opp of this.oppextra){
            let coords = JSON.parse(opp)
            let cell = document.querySelector(`div[id="${coords[0]}${coords[1]}"]`)
            cell.style.backgroundColor = colorNames[Object.values(this.oppclaimed)[0]]
        }
    }
    update() {
        for(let i = 0; i < Object.entries(this.userclaimed).length; i++){
            const coords = JSON.parse(Object.entries(this.userclaimed)[i][0])
            const color = Object.entries(this.userclaimed)[i][1]
            let x = coords[0]
            let y = coords[1]
            let testPoints = [[x+1,y], [x-1,y], [x,y+1], [x,y-1]]
            // console.log(testPoints)
            for (const testPoint of testPoints) {
                if(this.unclaimed[JSON.stringify(testPoint)] == color){
                    this.userclaimed[JSON.stringify(testPoint)] = color
                    this.userscore += 1
                    delete this.unclaimed[JSON.stringify(testPoint)]
                }
            }
            if(testPoints.reduce((acc, val) => {
                if(typeof(this.unclaimed[JSON.stringify(val)]) == 'number' && this.unclaimed[JSON.stringify(val)] != color) return acc+1
                return acc
            },0) == 0) {
                this.userextra.push(JSON.stringify([x,y]))
                delete this.userclaimed[Object.entries(this.userclaimed)[i][0]]
            }
            
        }
        for(let i = 0; i < Object.entries(this.oppclaimed).length; i++){
            const coords = JSON.parse(Object.entries(this.oppclaimed)[i][0])
            const color = Object.entries(this.oppclaimed)[i][1]
            let x = coords[0]
            let y = coords[1]
            let testPoints = [[x+1,y], [x-1,y], [x,y+1], [x,y-1]]
            // console.log(testPoints)
            for (const testPoint of testPoints) {
                if(this.unclaimed[JSON.stringify(testPoint)] == color){
                    this.oppclaimed[JSON.stringify(testPoint)] = color
                    this.oppscore += 1
                    delete this.unclaimed[JSON.stringify(testPoint)]
                }
            }
            if(testPoints.reduce((acc, val) => {
                if(typeof(this.unclaimed[JSON.stringify(val)]) == 'number' && this.unclaimed[JSON.stringify(val)] != color) return acc+1
                return acc
            },0) == 0) {
                this.oppextra.push(JSON.stringify([x,y]))
                delete this.oppclaimed[Object.entries(this.oppclaimed)[i][0]]
            }
            
        }
    }
    getSubBoards(startDepth){
        const evaluate = board => {
            // let possibleMoves = [0,1,2,3,4,5].filter(num => (num!=Object.entries(board.userclaimed)[0][1] && num!=Object.entries(board.oppclaimed)[0][1]))
            board.subboards = []
            
            let possibleMoves = [0,1,2,3,4,5].filter(num => (num!=Object.values(board.userclaimed)[0] && num!=Object.values(board.oppclaimed)[0]))
            for (const move of possibleMoves) {
                let subboard = new BoardInit({...board.unclaimed}, {...board.userclaimed}, board.userscore, {...board.oppclaimed}, board.oppscore, board.turn == 0 ? 1 : 0, [], board.depth+1)
                if(subboard.turn == 0){
                    
                    for(const point of Object.keys(subboard.userclaimed)){
                        subboard.userclaimed[point] = move
                    }
                    // subboard.turn = 1
                    subboard.update()
                }
                else if(subboard.turn == 1){
                    
                    for(const point of Object.keys(subboard.oppclaimed)){
                        subboard.oppclaimed[point] = move
                    }
                    // subboard.turn = 0
                    subboard.update()
                }
                board.subboards.push(subboard)
                if(subboard.depth <= startDepth)evaluate(subboard)
                // if(subboard.depth > 8) 
            }
            

        }


        evaluate(this)
    }
    findBest(startDepth){
        let moves = []
        const search = (board, depth) => {
            if(depth == 0) return board.userscore-board.oppscore
            let bestScore = Number.NEGATIVE_INFINITY
            for(let subboard of board.subboards){
                let move = subboard.turn == 1 ? Object.values(subboard.oppclaimed)[0] : Object.values(subboard.userclaimed)[0]
                let evaluation = -search(subboard, depth-1)
                bestScore = Math.max(evaluation, bestScore)
                // console.log('Start')
                // console.log('Move',move)
                // console.log('Eval', evaluation)
                // console.log('Depth', depth)
                // console.lo
                if(startDepth == depth) moves.push([move, evaluation])
            }
            return bestScore
        }

        
        search(this, startDepth)
        console.log(moves)
        return moves.sort((a,b) => b[1]-a[1])[this.turn == 1 ? 0 : 3]
    }
    runCycle(depth){
        this.getSubBoards(depth)
        this.bestMove = board.findBest(depth)
        console.log(`Your Best Move is ${colormap[this.bestMove[0]]} with an expected evaluation of ${this.bestMove[1]}`)
        // this.drawUI(this.turn, this.bestMove)
        this.drawUI()
    }
    playBest(){
        // this.turn = 1
        for(const point of Object.keys(this.userclaimed)){
            this.userclaimed[point] = this.bestMove[0]
        }
        this.update()
        this.show()
        this.turn = 0
    }
    playOpp(move){
        for(const point of Object.keys(this.oppclaimed)){
            this.oppclaimed[point] = move
        }
        this.update()
        this.show()
        this.turn = 1
    }

    drawUI(){
        // document.querySelector('div.evalbar>div.user').innerHTML = this.bestMove[1]
        // let f = x => 90-(40*(Math.pow((Math.E),(-1*Math.pow((x/4),2)))))
        let percentage = 90-(40*(Math.pow((Math.E),(-1*Math.pow((this.bestMove[1]/4),2)))))
        if(this.bestMove[1] < 0) percentage = 50-percentage
        document.querySelector('div.eval > div.myBar').style.height = `${percentage}%`
        document.querySelector('div.eval > div.opponentBar').style.height = `${100 -percentage}%`
        document.querySelector('div.eval > div.myBar > p.myScore').hidden = this.bestMove[1] < 0
        document.querySelector('div.eval > div.opponentBar > p.opponentScore').hidden = this.bestMove[1] >= 0
        document.querySelector('div.eval > div.myBar > p.myScore').innerHTML = this.bestMove[1]
        document.querySelector('div.eval > div.opponentBar > p.opponentScore').innerHTML = this.bestMove[1]

        let possibleMoves = [0,1,2,3,4,5].filter(num => (num!=Object.values(this.userclaimed)[0] && num!=Object.values(this.oppclaimed)[0]));
        [...document.querySelectorAll('div>button')].forEach(btn => {
            btn.style.border = 'none'
            btn.style.scale = '1'
        })
        if(this.turn == 1){
            
            // [...document.querySelector('div.userInput').children].forEach(btn => {
            //     btn.style.border = 'none'
            //     btn.style.scale = '1'
            // })
            document.querySelector('div.userInput').children[this.bestMove[0]].style = 'border: 4px solid #ff0000;';
            [...document.querySelector('div.userInput').children].forEach((ele, idx) => {
                ele.addEventListener('click', () => {
                    if(this.turn == 1 && possibleMoves.includes(idx)){
                        for(const point of Object.keys(this.userclaimed)){
                            this.userclaimed[point] = idx
                        }
                        this.update()
                        this.show()
                        this.turn = 0
                        this.runCycle(6)
                    }
                })
            })

        }else{
            // [...document.querySelector('div.oppInput').children].forEach(btn => {
            //     btn.style.border = 'none'
            //     btn.style.scale = '1'
            // })
            document.querySelector('div.oppInput').children[this.bestMove[0]].style = 'border: 4px solid #ff0000;';
            [...document.querySelector('div.oppInput').children].forEach((ele, idx) => {
                ele.addEventListener('click', () => {
                    if(this.turn == 0 && possibleMoves.includes(idx)){
                        for(const point of Object.keys(this.oppclaimed)){
                            this.oppclaimed[point] = idx
                        }
                        this.update()
                        this.show()
                        this.turn = 1
                        this.runCycle(6)
                    }
                })
            })
        }

        

        [...document.querySelectorAll('div>button')].forEach((btn, idx) => {
            // idx%6

            if(!possibleMoves.includes(idx%6)) btn.style.scale = '0.5'
        })

    }
}

let allSquares = {}
for(let x = 0; x < 8; x++){
    for(let y = 0; y < 7; y++){
        if((x==0&&y==0)||(x==7&&y==6)) continue
        // allSquares.push({coords: [x, y], color: Math.floor(Math.random()*5)})
        allSquares[JSON.stringify([x,y])] = Math.floor(Math.random()*6)
    }
}

// let colormap = {0: 'red', 1: 'green', 2: 'yellow', 3: 'blue', 4: 'purple', 5: 'black'}
let colormap = {0: 'rgb(245,77,102)', 1: 'rgb(172,217,100)', 2: 'rgb(252,223,33)', 3: 'rgb(76,177,245)', 4: 'rgb(111,81,166)', 5: 'rgb(53,53,53)'}

let colorNames = Object.values(colormap)
// let startboard = new BoardInit(allSquares, {'[0,0]': 1},{'[7,6]': 2}, 1)
// console.log(startboard)
// startboard.show()