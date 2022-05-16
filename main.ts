let curFrame: Image = null
let moveFrame: Image = null
let idleFrame: Image = null
let leftFrame: Image = null;
idleFrame = images.createImage(`
    . . # . #
    . . # . #
    . # # # #
    # # # # #
    # # . . .
    `)
leftFrame = images.createImage(`
    # . # . .
    # . # . .
    # # # # .
    # # # # #
    . . . # #
    `)
moveFrame = images.createImage(`
    . . . # #
    . . . # #
    . . # # #
    # # # # #
    # # # . .
    `)
let eggIdle = images.createImage(`
    . . # . .
    . # . # .
    # . . . #
    # . . . #
    . # # # .
    `)
let eggMove = images.createImage(`
    . . . . .
    . . # . .
    . # . # .
    . # . # .
    . # # # .
    `)
//General Animation stuff
curFrame = eggIdle
let lifeStage = "Egg"
let activeState = 0;
//Falling Food Game
let food : game.LedSprite = null;
let player : game.LedSprite = null;
//Left Right Game
let petDirection = 0;
let guessDirection = -1;

basic.forever(function () {
    if(activeState == 0)
    {
        if(lifeStage == "Egg")
        {
            animateEgg();
        }
        else
        {
            animatePet();
        }
    }
    else if (activeState == 1)
    {
        foodGame();
    }
    else if (activeState == 2)
    {
        guessGame();
    }
})

input.onButtonPressed(Button.A, function () {
    if(activeState == 0 && lifeStage == "Baby")
    {
        activeState = 1;
        player = game.createSprite(2, 4);
        game.resume();
        game.setScore(0);
    }
    else if (activeState == 1)
    {
        if(player.get(LedSpriteProperty.X) > 0)
        {
            player.change(LedSpriteProperty.X, -1)
        }
    }
    else if (activeState == 2)
    {
        guessDirection = 0;
    }
})

input.onButtonPressed(Button.B, function () {
    if(activeState == 0 && lifeStage == "Baby")
    {
        activeState = 2;
        petDirection = Math.randomRange(0, 1);
    }
    else if(activeState == 1)
    {
        if(player.get(LedSpriteProperty.X) < 4)
        {
            player.change(LedSpriteProperty.X, 1);
        }
    }
    else if (activeState == 2)
    {
        guessDirection = 1;
    }
})

function animatePet() {
    if (curFrame == idleFrame) {
        curFrame = moveFrame
    } else {
        curFrame = idleFrame
    }
    curFrame.showImage(0)
    basic.pause(500)
}

function animateEgg()
{
    if(curFrame == eggIdle)
    {
        curFrame = eggMove;
    }
    else
    {
        curFrame = eggIdle;
    }
    curFrame.showImage(0);
    basic.pause(500);
}

function foodGame()
{
    basic.clearScreen();
    food = game.createSprite(Math.randomRange(0, 5), 0);
    basic.pause(1000);
    while(food.get(LedSpriteProperty.Y) < 4)
    {
        food.change(LedSpriteProperty.Y, 1);
        basic.pause(1000);
    }

    if(player.isTouching(food))
    {
        game.addScore(1);
    }
    else
    {
        game.pause();
        activeState = 0;
    }
    food.delete();
}

function guessGame()
{
    if(guessDirection == -1)
    {
        basic.showIcon(IconNames.Target);
    }
    else
    {
        //Face pet in direction
        if(petDirection == 0)
        {  
            leftFrame.showImage(0);
        }
        else
        {
            idleFrame.showImage(0);
        }
        basic.pause(1000);
        //Checking the results
        if (guessDirection == petDirection) {
            basic.showIcon(IconNames.Yes);
        }
        else {
            basic.showIcon(IconNames.No);
        }
        basic.pause(1000);
        guessDirection = -1;
        activeState = 0;
    }
}

input.onGesture(Gesture.Shake, function () {
    if(lifeStage == "Egg")
    {
        basic.showLeds(`
        # . . . #
        . # . # .
        # . # . #
        # . . . #
        . # # # .
        `);
        basic.showLeds(`
        . . . . .
        . . . . .
        # # # # #
        # . . . #
        . # # # .
        `)
        basic.pause(500);
        lifeStage = "Baby";
    }
})