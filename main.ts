namespace SpriteKind {
    export const PortalIn = SpriteKind.create()
    export const PortalOut = SpriteKind.create()
    export const Fire = SpriteKind.create()
    export const End = SpriteKind.create()
}

enum ActionKind {
    Spinning
}

//---------------------------------------------------------------------------------------------------------------
//Tvorba postav a bloků

//Mapa
tiles.setTilemap(tilemap`level0`)

//Sprites
let coin: Sprite = null
let enemy: Sprite = null
let player: Sprite = null
let portalIn: Sprite = null
let portalOut: Sprite = null
let end: Sprite = null

let level = 0

//Animace
let coinAnimation: animation.Animation = null

//Informace
info.setLife(5)
info.setScore(0)
info.startCountdown(60)

info.onCountdownEnd(function() {
    game.over()
})

//---------------------------------------------------------------------------------------------------------------
// Ovládání


player = sprites.create(assets.tile`PlayerRight`, SpriteKind.Player)
controller.moveSprite(player, 100, 0)
player.ay = 305
scene.cameraFollowSprite(player)


controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    if (player.vy == 0){
        player.vy = -150
    }
})

controller.left.onEvent(ControllerButtonEvent.Pressed, function() {
    player.setImage(assets.tile`PlayerLeft`)
})

controller.right.onEvent(ControllerButtonEvent.Pressed, function() {
    player.setImage(assets.tile`PlayerRight`)
})












player.setPosition(10, 150)

//---------------------------------------------------------------------------------------------------------------
//Konec Hry
//Výhra
sprites.onOverlap(SpriteKind.Player, SpriteKind.End, function(sprite: Sprite, otherSprite: Sprite) {
    game.over(true)
})
// Další level
sprites.onOverlap(SpriteKind.Player, SpriteKind.PortalIn, function(sprite: Sprite, otherSprite: Sprite) {
    ChangeLevel()
})

//Prohra

scene.onOverlapTile(SpriteKind.Player, assets.tile`Fire`, function(sprite: Sprite, location: tiles.Location) {
    player.setPosition(10, 150)
    info.changeLifeBy(-1)
    music.playTone(Note.A, 30)
    music.playTone(Note.G, 30)
    music.playTone(Note.B, 30)
    music.playTone(Note.F, 30)
    music.playTone(Note.C, 30)
    music.playTone(Note.E, 30)
    music.playTone(Note.D, 30)
})


//---------------------------------------------------------------------------------------------------------------
//Sbírání Zlaťáků

let coin_list = tiles.getTilesByType(assets.tile`skyFood`)
for (let value of coin_list) {
    coin = sprites.create(assets.tile`Coin`, SpriteKind.Food)

    //Animace
    coinAnimation = animation.createAnimation(ActionKind.Spinning, 100)
    coinAnimation.addAnimationFrame(assets.tile`Coin`)
    coinAnimation.addAnimationFrame(assets.tile`Coin0`)
    coinAnimation.addAnimationFrame(assets.tile`Coin1`)
    coinAnimation.addAnimationFrame(assets.tile`Coin2`)
    coinAnimation.addAnimationFrame(assets.tile`Coin3`)
    coinAnimation.addAnimationFrame(assets.tile`Coin2`)
    coinAnimation.addAnimationFrame(assets.tile`Coin1`)
    coinAnimation.addAnimationFrame(assets.tile`Coin0`)
    animation.attachAnimation(coin, coinAnimation)
    animation.setAction(coin, animation._actionEnumShim(0))
    //----------------------------------------------------------------

    value.place(coin)
}


sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function(sprite: Sprite, otherSprite: Sprite) {
    otherSprite.destroy()
    info.changeScoreBy(1)
    music.playTone(Note.G, 100)
    music.playTone(Note.A, 100)
    otherSprite.destroy()
})

//---------------------------------------------------------------------------------------------------------------
//Nepřátelé


let enemy_list = tiles.getTilesByType(assets.tile`skyEnemy`)
for (let value of enemy_list) {
    enemy = sprites.create(assets.tile`Enemy`, SpriteKind.Enemy)
    value.place(enemy)
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite) {
    otherSprite.image.replace(0, 9)
    otherSprite.destroy()
    if (sprite.y < otherSprite.y){
        info.changeScoreBy(5)
        music.playTone(Note.A5, 100)
        music.playTone(Note.C5, 50)
        music.playTone(Note.A5, 100)
    }
    else{
        info.changeLifeBy(-1)
        music.playTone(Note.A, 30)
        music.playTone(Note.G, 30)
        music.playTone(Note.B, 30)
        music.playTone(Note.F, 30)
        music.playTone(Note.C, 30)
        music.playTone(Note.E, 30)
        music.playTone(Note.D, 30)
    }
})
//---------------------------------------------------------------------------------------------------------------

let portalIn_list = tiles.getTilesByType(assets.tile`placeIn`)
for (let value of portalIn_list) {
    portalIn = sprites.create(assets.tile`PortalIn`, SpriteKind.PortalIn)
    value.place(portalIn)
}
let portalOut_list = tiles.getTilesByType(assets.tile`placeOut`)
for (let value of portalOut_list) {
    portalOut = sprites.create(assets.tile`PortalOut`, SpriteKind.PortalOut)
    value.place(portalOut)
}
let end_list = tiles.getTilesByType(assets.tile`placeEnd`)
for (let value of end_list) {
    end = sprites.create(assets.tile`End`, SpriteKind.End)
    value.place(end)
}





function ChangeLevel (){

    player.setPosition(10, 150)

    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.Food)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.PortalIn)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.PortalOut)) {
        value.destroy()
    }


    level = level +1
    if (level == 1) {
        scene.setBackgroundColor(9)
        tiles.setTilemap(tilemap`level1`)
        //info.player1.setLife(5)
    } 




    let portalIn_list = tiles.getTilesByType(assets.tile`placeIn`)
    for (let value of portalIn_list) {
        portalIn = sprites.create(assets.tile`PortalIn`, SpriteKind.PortalIn)
        value.place(portalIn)
    }

    let enemy_list = tiles.getTilesByType(assets.tile`skyEnemy`)
    for (let value of enemy_list) {
        enemy = sprites.create(assets.tile`Enemy`, SpriteKind.Enemy)
        value.place(enemy)
    }
    let coin_list = tiles.getTilesByType(assets.tile`skyFood`)
    for (let value of coin_list) {
        coin = sprites.create(assets.tile`Coin`, SpriteKind.Food)

        //Animace
        coinAnimation = animation.createAnimation(ActionKind.Spinning, 100)
        coinAnimation.addAnimationFrame(assets.tile`Coin`)
        coinAnimation.addAnimationFrame(assets.tile`Coin0`)
        coinAnimation.addAnimationFrame(assets.tile`Coin1`)
        coinAnimation.addAnimationFrame(assets.tile`Coin2`)
        coinAnimation.addAnimationFrame(assets.tile`Coin3`)
        coinAnimation.addAnimationFrame(assets.tile`Coin2`)
        coinAnimation.addAnimationFrame(assets.tile`Coin1`)
        coinAnimation.addAnimationFrame(assets.tile`Coin0`)
        animation.attachAnimation(coin, coinAnimation)
        animation.setAction(coin, animation._actionEnumShim(0))
        //----------------------------------------------------------------

        value.place(coin)
    }
}


