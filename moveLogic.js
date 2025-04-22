export default function move(gameState){
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
    
    
    // We've included code to prevent your Battlesnake from moving backwards
    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];
    const myBody = gameState.you.body;
    
    
    if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
        moveSafety.left = false;
        
    } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
        moveSafety.right = false;
        
    } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
        moveSafety.down = false;
        
    } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
        moveSafety.up = false;
    }
    
    // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
    // gameState.board contains an object representing the game board including its width and height
    // https://docs.battlesnake.com/api/objects/board
    // const boardWidth = gameState.board.width;
    // const boardHeight = gameState.board.height;
    const boardWidth = gameState.board.width;
    const boardHeight = gameState.board.height;


    if (myHead.x === 0) {             // Head is at the left edge, don't move left
        moveSafety.left = false;
    }
    if (myHead.x === boardWidth - 1) { // Head is at the right edge, don't move right
        moveSafety.right = false;
    }
    if (myHead.y === 0) {             // Head is at the bottom edge, don't move down
        moveSafety.down = false;
    }
    if (myHead.y === boardHeight - 1) { // Head is at the top edge, don't move up
        moveSafety.up = false;
    }
    









    // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
    // gameState.you contains an object representing your snake, including its coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
    for (let i = 1; i < myBody.length; i++) {
        const segment = myBody[i];
        if (segment.x === myHead.x && segment.y === myHead.y + 1) moveSafety.up = false;
        if (segment.x === myHead.x && segment.y === myHead.y - 1) moveSafety.down = false;
        if (segment.x === myHead.x - 1 && segment.y === myHead.y) moveSafety.left = false;
        if (segment.x === myHead.x + 1 && segment.y === myHead.y) moveSafety.right = false;
    }
    

    
    
    // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
    // gameState.board.snakes contains an array of enemy snake objects, which includes their coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
    for (let i = 0; i < gameState.board.snakes.length; i++) {
        const snake = gameState.board.snakes[i];
    
        for (let j = 0; j < snake.body.length; j++) {
            const segment = snake.body[j];
    
            if (segment.x === myHead.x && segment.y === myHead.y + 1) {
                moveSafety.up = false;
            }
            if (segment.x === myHead.x && segment.y === myHead.y - 1) {
                moveSafety.down = false;
            }
            if (segment.x === myHead.x - 1 && segment.y === myHead.y) {
                moveSafety.left = false;
            }
            if (segment.x === myHead.x + 1 && segment.y === myHead.y) {
                moveSafety.right = false;
            }
        }
    }
    

    // Are there any safe moves left?
    
    
    //Object.keys(moveSafety) returns ["up", "down", "left", "right"]
    //.filter() filters the array based on the function provided as an argument (using arrow function syntax here)
    //In this case we want to filter out any of these directions for which moveSafety[direction] == false
    const safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    if (safeMoves.length == 0) {
        console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
        return { move: "down" };
    }
    // If no safe moves are left, default to moving down
    if (safeMoves.length === 0) {
        console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
        return { move: "down" };
    }
    
    // Choose a random move from the safe moves
    const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    
    // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
    // gameState.board.food contains an array of food coordinates https://docs.battlesnake.com/api/objects/board
    if (gameState.you.health < 50 && gameState.board.food.length > 0) {
        const food = gameState.board.food;
        let closestFood = food[0];
        let minDistance = Math.abs(myHead.x - food[0].x) + Math.abs(myHead.y - food[0].y);

        // Find the closest food
        for (const item of food) {
            const distance = Math.abs(myHead.x - item.x) + Math.abs(myHead.y - item.y);
            if (distance < minDistance) {
                closestFood = item;
                minDistance = distance;
            }
        }

        // Adjust safe moves toward closest food
        if (closestFood.x < myHead.x && moveSafety.left) return { move: "left" };
        if (closestFood.x > myHead.x && moveSafety.right) return { move: "right" };
        if (closestFood.y < myHead.y && moveSafety.down) return { move: "down" };
        if (closestFood.y > myHead.y && moveSafety.up) return { move: "up" };
    }
    if (gameState.board.food.length > 0) {
        const food = gameState.board.food;
        let closestFood = food[0];
        let minDistance = Math.abs(myHead.x - food[0].x) + Math.abs(myHead.y - food[0].y);

        // Find the closest food
        for (const item of food) {
            const distance = Math.abs(myHead.x - item.x) + Math.abs(myHead.y - item.y);
            if (distance < minDistance) {
                closestFood = item;
                minDistance = distance;
            }
        }
        //find food based of safe moves
        if (closestFood.x < myHead.x && moveSafety.left) {
            console.log(`MOVE ${gameState.turn}: Moving towards food - left`);
            return { move: "left" };
        }
        if (closestFood.x > myHead.x && moveSafety.right) {
            console.log(`MOVE ${gameState.turn}: Moving towards food - right`);
            return { move: "right" };
        }
        if (closestFood.y < myHead.y && moveSafety.down) {
            console.log(`MOVE ${gameState.turn}: Moving towards food - down`);
            return { move: "down" };
        }
        if (closestFood.y > myHead.y && moveSafety.up) {
            console.log(`MOVE ${gameState.turn}: Moving towards food - up`);
            return { move: "up" };
        }


    }
    let longestSnake = null;
let longestLength = 0;

for (const snake of gameState.board.snakes) {
    if (snake.body.length > longestLength) {
        longestSnake = snake;
        longestLength = snake.body.length;
    }
}

if (longestSnake) {
    const tail = longestSnake.body[longestSnake.body.length - 1]; // findtail of the longest snake

    // moves snake to chase the tail
    if (tail.x < myHead.x && moveSafety.left) {
        console.log(`MOVE ${gameState.turn}: Chasing longest snake's tail - left`);
        return { move: "left" };
    }
    if (tail.x > myHead.x && moveSafety.right) {
        console.log(`MOVE ${gameState.turn}: Chasing longest snake's tail - right`);
        return { move: "right" };
    }
    if (tail.y < myHead.y && moveSafety.down) {
        console.log(`MOVE ${gameState.turn}: Chasing longest snake's tail - down`);
        return { move: "down" };
    }
    if (tail.y > myHead.y && moveSafety.up) {
        console.log(`MOVE ${gameState.turn}: Chasing longest snake's tail - up`);
        return { move: "up" };
    }
}
    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove };
}
