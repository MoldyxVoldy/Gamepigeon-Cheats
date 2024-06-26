// const img = new Image();
// img.onload = () => {
// }

// img.url = url
const parser_canvas = document.querySelector('canvas.parser')
const parser = parser_canvas.getContext('2d')

document.querySelector('input#parser').addEventListener('change' , () => {
    const file = document.querySelector('input#parser').files[0]; 
    const fr = new FileReader();
    fr.addEventListener('load', () => {
        const url = fr.result
        const img = new Image();
        img.onload = () => {
            parser_canvas.height = img.height
            parser_canvas.width = img.width
            parser.drawImage(img, 0,0);
            // parser.fillStyle = `#FF0000`
            // let x = 1
            // let y = 1
            // console.log(img.height)
            // parser.fillRect(x, img.height-5, 5, 5)
            // let xsearch = [0,1,2,3,4,5,6,7].map(point => (point*((7*img.width)/8))+(img.width/16))
            let coords = {}
            for(let yi = 0; yi < 7; yi++){
                for(let xi = 0; xi < 8; xi++){
                    //let x = (xi*((7*img.width)/8))//+(img.width/16)
                    let x = xi*(img.width/8)+(img.width/16)
                    let y = yi*(img.height/7)+(img.height/14)
                    /*x stays the same, but y = img.height-y */
                    // parser.fillRect(x, img.height-y, 5, 5)
                    console.log(parser.getImageData(x, img.height-y, 1, 1).data)
                    const data = parser.getImageData(x, img.height-y, 1, 1).data
                    // console.log(data[0])
                    // console.log(data[1])
                    // console.log(data[2])
                    console.log(xi,yi)
                    const r = data[0]
                    const g = data[1]
                    const b = data[2]
                    // if((207 <= data[0] && 255 >= data[0]) && (37 <= data[1] && 87 >= data[1]) && (64 <= data[2] && 113 >= data[2])) coords[JSON.stringify([xi,yi])] = 0
                    // if((132 <= data[0] && 182 >= data[0]) && (179 <= data[1] && 235 >= data[1]) && (62 <= data[2] && 113 >= data[2])) coords[JSON.stringify([xi,yi])] = 1
                    // if((216 <= data[0] && 255 >= data[0]) && (189 <= data[1] && 235 >= data[1]) && (14 <= data[2] && 45 >= data[2])) coords[JSON.stringify([xi,yi])] = 2
                    // if((36 <= data[0] && 86 >= data[0]) && (139 <= data[1] && 188 >= data[1]) && (206 <= data[2] && 255 >= data[2])) coords[JSON.stringify([xi,yi])] = 3
                    // if((93 <= data[0] && 121 >= data[0]) && (64 <= data[1] && 91 >= data[1]) && (148 <= data[2] && 176 >= data[2])) coords[JSON.stringify([xi,yi])] = 4
                    // if((48 <= data[0] && 98 >= data[0]) && (48 <= data[1] && 98 >= data[1]) && (48 <= data[2] && 98 >= data[2])) coords[JSON.stringify([xi,yi])] = 5
                    
                    if(r > b && b > g) coords[JSON.stringify([xi,yi])] = 0
                    if(g > r && r > b) coords[JSON.stringify([xi,yi])] = 1
                    if(r > g && g > b) coords[JSON.stringify([xi,yi])] = 2
                    if(b > g && g > r) coords[JSON.stringify([xi,yi])] = 3
                    if(b > r && r > g) coords[JSON.stringify([xi,yi])] = 4
                    if((r+5 >= g && g >= b-5) && (b+5 >= g && g >= r-5)) coords[JSON.stringify([xi,yi])] = 5
                }
            }
            // console.log(coords['[0,0]'])
            const userclaimed = {'[0,0]': coords['[0,0]']}
            delete coords['[0,0]']
            const oppclaimed = {'[7,6]': coords['[7,6]']}
            delete coords['[7,6]']
            let board = new BoardInit(coords, userclaimed, 1, oppclaimed, 1, 1, [], 0)
            board.update()
            board.show()
            
            console.log(board)
            // console.log(possibleMoves)
            window.board = board
            const startDepth = 6
            // const eval = board => {
            //     // let possibleMoves = [0,1,2,3,4,5].filter(num => (num!=Object.entries(board.userclaimed)[0][1] && num!=Object.entries(board.oppclaimed)[0][1]))
            //     let possibleMoves = [0,1,2,3,4,5].filter(num => (num!=Object.values(board.userclaimed)[0] && num!=Object.values(board.oppclaimed)[0]))
            //     for (const move of possibleMoves) {
            //         let subboard = new BoardInit({...board.unclaimed}, {...board.userclaimed}, board.userscore, {...board.oppclaimed}, board.oppscore, board.turn, [], board.depth+1)
            //         if(subboard.turn == 0){
                        
            //             for(const point of Object.keys(subboard.userclaimed)){
            //                 subboard.userclaimed[point] = move
            //             }
            //             subboard.turn = 1
            //             subboard.update()
            //         }
            //         else if(subboard.turn == 1){
                        
            //             for(const point of Object.keys(subboard.oppclaimed)){
            //                 subboard.oppclaimed[point] = move
            //             }
            //             subboard.turn = 0
            //             subboard.update()
            //         }
            //         board.subboards.push(subboard)
            //         if(subboard.depth <= startDepth)eval(subboard)
            //         // if(subboard.depth > 8) 
            //     }
                

            // }


            // eval(board)
            //board.getSubBoards(startDepth)
            // let moves = []
            // const search = (board, depth) => {
            //     if(depth == 0) return board.userscore-board.oppscore
            //     let bestScore = Number.NEGATIVE_INFINITY
            //     for(let subboard of board.subboards){
            //         let move = Object.values(subboard.userclaimed)[0]
            //         let evaluation = -search(subboard, depth-1)
            //         bestScore = Math.max(evaluation, bestScore)
            //         if(startDepth == depth) moves.push([move, evaluation])
            //     }
            //     return bestScore
            // }
       
 
            // console.log(search(board, startDepth))
            //let bestMove = board.findBest(startDepth)
            // console.log('done')
            // console.log(moves)
            // console.log(moves.sort((a,b) => b[1]-a[1]))
            // console.log(moves.sort((a,b) => b[1]-a[1])[0])
            // console.log(`Your Best Move is ${colormap[moves.sort((a,b) => b[1]-a[1])[0][0]]} with an expected evaluation of ${moves.sort((a,b) => b[1]-a[1])[0][1]}`)
            //console.log(`Your Best Move is ${colormap[bestMove[0]]} with an expected evaluation of ${bestMove[1]}`)
            board.runCycle(startDepth)
            
            // console.log(BoardInit)
        }
        // console.log(img)
        img.src = url

    })
    fr.readAsDataURL(file)
});