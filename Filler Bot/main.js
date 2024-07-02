class BoardInit {
    constructor(unclaimed, userclaimed, userscore, usercolor, useredge, oppclaimed, oppscore, oppcolor, oppedge, turn, bestMove) {
        this.unclaimed = unclaimed
        this.userclaimed = userclaimed
        this.userscore = userscore
        this.usercolor = usercolor
        this.useredge = useredge
        this.oppclaimed = oppclaimed
        this.oppscore = oppscore
        this.oppcolor = oppcolor
        this.oppedge = oppedge
        this.turn = turn
        this.bestMove = bestMove
        // console.log(arguments)
        // console.log(this)
    }
    show() {
        // let map = Object.entries(this.unclaimed)
        // for(let i = 0; i < map.length; i++){
        //     map[i][0]
        //     let coords = JSON.parse(map[i][0])
        //     let cell = document.querySelector(`div[id="${coords[0]}${coords[1]}"]`)
        //     cell.style.backgroundColor = colorNames[map[i][1]]

        // }
        for(let unclaimedcoord in this.unclaimed){
            let coords = JSON.parse(unclaimedcoord)
            let cell = document.querySelector(`div[id="${coords[0]}${coords[1]}"]`)
            cell.style.backgroundColor = colormap[this.unclaimed[unclaimedcoord]]
        }
        for(let usercoord of this.userclaimed){
            let coords = JSON.parse(usercoord)
            let cell = document.querySelector(`div[id="${coords[0]}${coords[1]}"]`)
            cell.style.backgroundColor = colormap[this.usercolor]
        }
        for(let oppcoord of this.oppclaimed){
            let coords = JSON.parse(oppcoord)
            let cell = document.querySelector(`div[id="${coords[0]}${coords[1]}"]`)
            cell.style.backgroundColor = colormap[this.oppcolor]
        }
    }
    update() {
        for(let coords in this.useredge){
            const color = this.useredge[coords]
            if(color == this.usercolor){
                this.userclaimed.push(coords)
                this.userscore += 1
                delete this.unclaimed[coords]
                delete this.useredge[coords]
                delete this.oppedge[coords]
                let [x,y] = [JSON.parse(coords)[0], JSON.parse(coords)[1]]
                for (let testPoint of [[x+1,y], [x-1,y], [x,y+1], [x,y-1]]) {
                    testPoint = JSON.stringify(testPoint)
                    if(typeof(this.unclaimed[testPoint]) == 'number') this.useredge[testPoint] = this.unclaimed[testPoint]
                }
            }
        }
        for(let coords in this.oppedge){
            const color = this.oppedge[coords]
            if(color == this.oppcolor){
                this.oppclaimed.push(coords)
                this.oppscore += 1
                delete this.unclaimed[coords]
                delete this.oppedge[coords]
                delete this.useredge[coords]
                let [x,y] = [JSON.parse(coords)[0], JSON.parse(coords)[1]]
                for (let testPoint of [[x+1,y], [x-1,y], [x,y+1], [x,y-1]]) {
                    testPoint = JSON.stringify(testPoint)
                    if(typeof(this.unclaimed[testPoint]) == 'number') this.oppedge[testPoint] = this.unclaimed[testPoint]
                }
            }
        }
        
    }


    goUntil(){
        window.webworker = new Worker('worker.js')
        window.webworker.postMessage([this])
        window.webworker.onmessage = msg => {
            // console.log('Depth', msg.data[0])
            document.querySelector('div.depth').innerHTML = `Depth: ${msg.data[0]}`
            this.bestMove = msg.data[1]
            this.drawUI()
        }
        
    }


    drawUI(){
        // document.querySelector('div.evalbar>div.user').innerHTML = this.bestMove[1]
        // let f = x => 90-(40*(Math.pow((Math.E),(-1*Math.pow((x/4),2)))))
        let percentage = 90-(40*(Math.pow((Math.E),(-1*Math.pow((this.bestMove[1]/4),2)))))
        if(this.bestMove[1] < 0) percentage = 100-percentage
        document.querySelector('div.eval > div.myBar').style.height = `${percentage}%`
        document.querySelector('div.eval > div.opponentBar').style.height = `${100 -percentage}%`
        document.querySelector('div.eval > div.myBar > p.myScore').hidden = this.bestMove[1] < 0
        document.querySelector('div.eval > div.opponentBar > p.opponentScore').hidden = this.bestMove[1] >= 0
        document.querySelector('div.eval > div.myBar > p.myScore').innerHTML = this.bestMove[1]
        document.querySelector('div.eval > div.opponentBar > p.opponentScore').innerHTML = this.bestMove[1]

        let possibleMoves = [0,1,2,3,4,5].filter(num => (num!=this.usercolor && num!=this.oppcolor));
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
                        // for(const point of Object.keys(this.userclaimed)){
                        //     this.userclaimed[point] = idx
                        // }
                        this.usercolor = idx
                        this.update()
                        this.show()
                        this.turn = 0
                        window.webworker.terminate()
                        // this.runCycle(window.depth)
                        this.goUntil()
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
                        // for(const point of Object.keys(this.oppclaimed)){
                        //     this.oppclaimed[point] = idx
                        // }
                        this.oppcolor = idx
                        this.update()
                        this.show()
                        this.turn = 1
                        window.webworker.terminate()
                        // this.runCycle(window.depth)
                        this.goUntil()
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
// let allSquares = {}
// for(let x = 0; x < 8; x++){
//     for(let y = 0; y < 7; y++){
//         if((x==0&&y==0)||(x==7&&y==6)) continue
//         // allSquares.push({coords: [x, y], color: Math.floor(Math.random()*5)})
//         allSquares[JSON.stringify([x,y])] = Math.floor(Math.random()*6)
//     }
// }

// let colormap = {0: 'red', 1: 'green', 2: 'yellow', 3: 'blue', 4: 'purple', 5: 'black'}
let colormap = {0: 'rgb(245,77,102)', 1: 'rgb(172,217,100)', 2: 'rgb(252,223,33)', 3: 'rgb(76,177,245)', 4: 'rgb(111,81,166)', 5: 'rgb(53,53,53)'}

let colorNames = Object.values(colormap)
// let startboard = new BoardInit(allSquares, {'[0,0]': 1},{'[7,6]': 2}, 1)
// console.log(startboard)
// startboard.show()