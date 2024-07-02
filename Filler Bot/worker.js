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
    updateUser() {
        for(let coords in this.useredge){
            const color = this.useredge[coords]
            if(color == this.usercolor){
                // console.log(coords)
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
    }
    updateOpp() {
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

    eval(depth, goingAhead=false){
        let moves = []
        let subboards = this.getSubboards()
        // subboards.sort(function(x,y){ return x == first ? -1 : y == first ? 1 : 0; });
        if(window.board.turn == 0){
            if(this.turn == 1)subboards.sort((a,b) => (a.userscore-a.oppscore)-(b.userscore-b.oppscore))
            else subboards.sort((a,b) => (b.userscore-b.oppscore)-(a.userscore-a.oppscore))
        }else{
            if(this.turn == 0)subboards.sort((a,b) => (a.userscore-a.oppscore)-(b.userscore-b.oppscore))
            else subboards.sort((a,b) => (b.userscore-b.oppscore)-(a.userscore-a.oppscore))
        }
        for(let subboard of subboards){
            let move = subboard.turn == 1 ? subboard.oppcolor : subboard.usercolor
            let evaluation = -subboard.search(depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, goingAhead)
            moves.push([move, evaluation])
        }
        console.log(moves)
        return moves.sort((a,b) => b[1]-a[1])[this.turn == 1 ? 0 : 3]
    }

    search(depth, alpha, beta, goingAhead) {
        if (depth == 0) return this.userscore - this.oppscore
        let subboards = this.getSubboards()
        let test = null
        if(window.board.turn == 0){
            if(this.turn == 1)subboards.sort((a,b) => (a.userscore-a.oppscore)-(b.userscore-b.oppscore))
            else subboards.sort((a,b) => (b.userscore-b.oppscore)-(a.userscore-a.oppscore))
        }else{
            if(this.turn == 0)subboards.sort((a,b) => (a.userscore-a.oppscore)-(b.userscore-b.oppscore))
            else subboards.sort((a,b) => (b.userscore-b.oppscore)-(a.userscore-a.oppscore))
        }
        for(let subboard of subboards){
            let zhash = `U${Object.values(subboard.unclaimed).join('')}T${subboard.turn}`
            
            // let zhash = `U${Object.values(subboard.unclaimed).join('')}P${Object.values(subboard.useredge).join('')}O${Object.values(subboard.oppedge).join('')}T${subboard.turn}`
            // window.zhashes.push(zhash)
            // if(window.zhash[zhash])evaluation = window.zhash[zhash]
            let evaluation
            if(window.zhashes[zhash]?.[1] >= depth) {
                evaluation = window.zhashes[zhash][0]
                window.usedzhashes[zhash] = window.zhashes[zhash]
                window.uses++
                // debugger
            }else evaluation = -subboard.search(depth - 1, -beta, -alpha, goingAhead)
            window.zhashes[zhash] = [evaluation, Math.max(depth, window.zhashes[zhash]?.[1] || Number.NEGATIVE_INFINITY)]
            
            // if(Math.random()<0.5) delete window.zhashes[zhash]
            // if(window.zhashes[zhash][2] > 3) delete window.zhashes[zhash]
            if(evaluation >= beta) test = beta
            if(evaluation >= beta) break
            alpha = Math.max(alpha, evaluation)
        }  
        if(test!=null) return beta
        return alpha
    }
    getSubboards() {
        let subboards = []
        let possibleMoves = [0,1,2,3,4,5].filter(num => (num!=this.usercolor && num!=this.oppcolor))
        for (const move of possibleMoves) {
            let subboard = new BoardInit({...this.unclaimed}, [...this.userclaimed], this.userscore, this.usercolor, {...this.useredge}, [...this.oppclaimed], this.oppscore, this.oppcolor, {...this.oppedge}, this.turn == 0 ? 1 : 0)
            if(subboard.turn == 0){
                subboard.usercolor = move 
                subboard.updateUser()
            }
            else if(subboard.turn == 1){
                subboard.oppcolor = move
                subboard.updateOpp()
            }
            subboards.push(subboard)
        }
        return subboards
    }

}

// let colormap = {0: 'red', 1: 'green', 2: 'yellow', 3: 'blue', 4: 'purple', 5: 'black'}
// let colormap = {0: 'rgb(245,77,102)', 1: 'rgb(172,217,100)', 2: 'rgb(252,223,33)', 3: 'rgb(76,177,245)', 4: 'rgb(111,81,166)', 5: 'rgb(53,53,53)'}

// let colorNames = Object.values(colormap)


let window = {zhashes: {}, uses:0, usedzhashes: {}}
onmessage = msg => {
    let b = msg.data[0]
    Object.setPrototypeOf(b, BoardInit.prototype)
    window.board = b
    for(let i = 2; i < 54; i+=2){
        try{
            let evaluation = b.eval(i)
            postMessage([i,evaluation])
            // // console.log(Object.values(window.zhashes))
            // console.log(Object.values(window.zhashes).length)
            // console.log(window.uses)
            window.uses = 0
            // let entries = Object.entires[window.zhashes]
            // while(Object.values(window.zhashes).length > 100000){
            //     delete window.zhashes[Reflect.ownKeys(window.zhashes)[0]]
            // }
            // // window.zhashes = Object.fromEntries(entries)
            // console.log('pruned')
            // if(Object.values(window.zhashes).length > 100000){
            //     for(let i = 0; i < 50; i++){
            //         delete window.zhashes[Reflect.ownKeys(window.zhashes)[0]]
            //     }
            // }
            window.zhashes = window.usedzhashes
            window.usedzhashes = {}
            // console.log(Object.values(window.zhashes).length)
            // console.log('pruned')
        }catch{
            break
        }
        
        
    }
    // let evaluation = b.eval(4)
    // postMessage([4,evaluation])
    console.log(window.zhashes)
  };