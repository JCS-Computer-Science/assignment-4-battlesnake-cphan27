export default function move(gameState){
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
    
    //next class: stop colliding w classmates, stop chasing food, dont collide w body
    
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


    
    //  let nextMovement = null;
    //  if (moveSafety.up) {
    //     nextMovement = "up";
    //  } else if (moveSafety.down) {
    //     nextMovement = "down";
    //  } else if (moveSafety.left) {
    //      // If vertical moves are unsafe, move left for safety
    //      nextMovement = "left";
    //  } else if (moveSafety.right) {
    //      // If vertical moves are unsafe, move right for safety
    //      nextMovement = "right";
    //  }
 
    //  // If no safe moves are left, default to moving down
    //  if (!nextMovement) {
    //      console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    //      return { move: "down" };
    //  }

    //  console.log(`MOVE ${gameState.turn}: ${nextMovement}`);
    // return { move: nextMovement };
    let nextMovement = null;

    if (gameState.you.health < 50 && gameState.board.food.length > 0) {
        const food = gameState.board.food;
        let closestFood = food[0];
        let minDistance = Math.abs(myHead.x - food[0].x) + Math.abs(myHead.y - food[0].y);

        for (const item of food) {
            const distance = Math.abs(myHead.x - item.x) + Math.abs(myHead.y - item.y);
            if (distance < minDistance) {
                closestFood = item;
                minDistance = distance;
            }
        }

        // food if safe moves
        // if (closestFood.x < myHead.x && moveSafety.left) {
        //     nextMovement = "left";
        // } else if (closestFood.x > myHead.x && moveSafety.right) {
        //     nextMovement = "right";
        // } else if (closestFood.y < myHead.y && moveSafety.down) {
        //     nextMovement = "down";
        // } else if (closestFood.y > myHead.y && moveSafety.up) {
        //     nextMovement = "up";
        // }
    }

    // // 
    // if (!nextMovement) {
    //     if (moveSafety.up) {
    //         nextMovement = "up";
    //     } else if (moveSafety.down) {
    //         nextMovement = "down";
    //     } else if (moveSafety.left) {
    //         nextMovement = "left";
    //     } else if (moveSafety.right) {
    //         nextMovement = "right";
    //     }

    //     // If no safe moves are left, default to moving down
    //     if (!nextMovement) {
    //         console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    //         return { move: "down" };
    //     }
    // }




 
   

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

    // Detect danger: Check if any enemy snake's head is parallel to our head
let enemyHeads = [];
for (let i = 0; i < gameState.board.snakes.length; i++) {
    enemyHeads.push(gameState.board.snakes[i].body[0]); // Collect all enemy snake heads
}

function isEnemyHeadParallel(direction) {
    for (let i = 0; i < enemyHeads.length; i++) {
        let head = enemyHeads[i];
        if (direction === "up" && head.x === myHead.x && head.y === myHead.y + 1) {
            return true;
        }
        if (direction === "down" && head.x === myHead.x && head.y === myHead.y - 1) {
            return true;
        }
        if (direction === "left" && head.x === myHead.x - 1 && head.y === myHead.y) {
            return true;
        }
        if (direction === "right" && head.x === myHead.x + 1 && head.y === myHead.y) {
            return true;
        }
    }
    return false;
}

// avoid enemy snake heads by going perp
if (isEnemyHeadParallel("up")) {
    moveSafety.up = false;
    if (moveSafety.left) {
        return { move: "left" };
    }
    if (moveSafety.right) {
        return { move: "right" };
    }
}
if (isEnemyHeadParallel("down")) {
    moveSafety.down = false;
    if (moveSafety.left) {
        return { move: "left" };
    }
    if (moveSafety.right) {
        return { move: "right" };
    }
}
if (isEnemyHeadParallel("left")) {
    moveSafety.left = false;
    if (moveSafety.up) {
        return { move: "up" };
    }
    if (moveSafety.down) {
        return { move: "down" };
    }
}
if (isEnemyHeadParallel("right")) {
    moveSafety.right = false;
    if (moveSafety.up) {
        return { move: "up" };
    }
    if (moveSafety.down) {
        return { move: "down" };
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

// health is low move to food
if (gameState.you.health < 50 && gameState.board.food.length > 0) {
    const food = gameState.board.food;
    let closestFood = food[0];
    let minDistance = Math.abs(myHead.x - food[0].x) + Math.abs(myHead.y - food[0].y);

    for (const item of food) {
        const distance = Math.abs(myHead.x - item.x) + Math.abs(myHead.y - item.y);
        if (distance < minDistance) {
            closestFood = item;
            minDistance = distance;
        }
    }

    if (closestFood.x < myHead.x && moveSafety.left && !isDangerAhead("left")) {
        return { move: "left" };
    }
    if (closestFood.x > myHead.x && moveSafety.right && !isDangerAhead("right")) {
        return { move: "right" };
    }
    if (closestFood.y < myHead.y && moveSafety.down && !isDangerAhead("down")) {
        return { move: "down" };
    }
    if (closestFood.y > myHead.y && moveSafety.up && !isDangerAhead("up")) {
        return { move: "up" };
    }

    // if head on head choose a perp safe move
    if (isDangerAhead("up") && (moveSafety.left || moveSafety.right)) {
        return { move: moveSafety.left ? "left" : "right" };
    }
    if (isDangerAhead("down") && (moveSafety.left || moveSafety.right)) {
        return { move: moveSafety.left ? "left" : "right" };
    }
    if (isDangerAhead("left") && (moveSafety.up || moveSafety.down)) {
        return { move: moveSafety.up ? "up" : "down" };
    }
    if (isDangerAhead("right") && (moveSafety.up || moveSafety.down)) {
        return { move: moveSafety.up ? "up" : "down" };
    }
}



    // Find the longest snake and its tail
let longestSnake = null;
let longestLength = 0;

for (const snake of gameState.board.snakes) {
    if (snake.body.length > longestLength) {
        longestSnake = snake;
        longestLength = snake.body.length;
    }
}


if (longestSnake && longestLength <= 15) { //dont follow if longer than 15
    const tail = longestSnake.body[longestSnake.body.length - 1]; //find the tail of the longest snake

    // chase the tail
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

function findSafeDirections(gameBoard, snakeBody, dangerZones, currentHealth) {
    const snakeHead = snakeBody[0]; // The head of the snake
    const snakeSegments = new Set(snakeBody.map(([x, y]) => `${x},${y}`)); // Snake's body as a set of coordinates
    const [boardHeight, boardWidth] = [gameBoard.length, gameBoard[0].length];
    const hazardAreas = new Set(dangerZones.map(([x, y]) => `${x},${y}`)); // Hazards as a set of coordinates
  
    // Helper function to check if a space has at least 2 open adjacent spaces
    function hasEnoughSpace([x, y]) {
      const adjacentSpaces = [
        [x - 1, y], // Up
        [x + 1, y], // Down
        [x, y - 1], // Left
        [x, y + 1], // Right
      ];
  
      // Count open spaces (within bounds, not in snake body, and not in hazards)
      let openCount = 0;
  
      adjacentSpaces.forEach(([adjX, adjY]) => {
        const withinBounds = adjX >= 0 && adjX < boardHeight && adjY >= 0 && adjY < boardWidth;
        const notInBody = !snakeSegments.has(`${adjX},${adjY}`);
        const notInHazard = !hazardAreas.has(`${adjX},${adjY}`);
  
        if (withinBounds && notInBody && notInHazard) {
          openCount++;
        }
      });
  
      return openCount >= 2; // At least 2 open spaces
    }
  
    // All possible moves around the snake's head
    const potentialMoves = {
      up: [snakeHead[0] - 1, snakeHead[1]],
      down: [snakeHead[0] + 1, snakeHead[1]],
      left: [snakeHead[0], snakeHead[1] - 1],
      right: [snakeHead[0], snakeHead[1] + 1],
    };
  
    // Separate moves into categories: safe and unsafe
    const safeMoves = [];
  
    Object.keys(potentialMoves).forEach((move) => {
      const [nextX, nextY] = potentialMoves[move];
  
      // Check if the move is inside the board boundaries
      const isWithinBounds = nextX >= 0 && nextX < boardHeight && nextY >= 0 && nextY < boardWidth;
  
      // Check if the move doesn't collide with the snake's body
      const avoidsSelfCollision = !snakeSegments.has(`${nextX},${nextY}`);
  
      // Check if the move doesn't land in a hazard area
      const avoidsHazards = !hazardAreas.has(`${nextX},${nextY}`);
  
      // Check if the move leads to a space with enough adjacent open spaces
      const hasSpace = hasEnoughSpace([nextX, nextY]);
  
      if (isWithinBounds && avoidsSelfCollision && avoidsHazards && hasSpace) {
        safeMoves.push(move); // Move is safe
      }
    });
  
    // Return safe moves
    return safeMoves;
  }
  
  // Example usage
  const gameBoard = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  
  const snakeBody = [
    [2, 2], // Head
    [2, 3], // Body segment
    [3, 3], // Body segment
  ];
  
  const dangerZones = [
    [1, 1],
    [1, 2],
    [1, 3],
  ];
  
  const currentHealth = 15;
  
  const safeDirections = findSafeDirections(gameBoard, snakeBody, dangerZones, currentHealth);
  console.log("Safe Directions:", safeDirections); // Example Output: ["down", "left"]