namespace SpriteKind {
    export const Hoop = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    make_one_hoop()
})
function count_hoops_in_motion () {
    hoops_in_motion = 0
    for (let update_ndx = 0; update_ndx <= myHoopList.length - 1; update_ndx++) {
        myHoop = myHoopList[update_ndx]
        d = distance_moved(update_ndx)
        sprites.setDataNumber(myHoop, "prior x", myHoop.x)
        sprites.setDataNumber(myHoop, "prior y", myHoop.y)
        if (d == 0) {
            circle.setColor(myHoop, red)
            sprites.changeDataNumberBy(myHoop, "number times stopped", 1)
        } else {
            hoops_in_motion += 1
            sprites.setDataNumber(myHoop, "number of times stopped", 1)
            circle.setColor(myHoop, sprites.readDataNumber(myHoop, "original color"))
        }
    }
    return hoops_in_motion
}
function show_instructions_question () {
    if (game.ask("Hula Hoop Instructions?")) {
        msg = "If hoops stop moving, game ends, score = 0. "
        msg = "" + msg + "Player wins when level 4 countdown ends. "
        msg = "" + msg + "Score is the number of hoops in motion. "
        msg = "" + msg + "Up button adds a hoop.  "
        msg = "" + msg + "Down button removes slowest hoop. "
        msg = "" + msg + "Hearts indicate level from 1 to 4. "
        msg = "" + msg + "Level increases when a countdown ends. "
        msg = "" + msg + "Countdown starts at 10 seconds for level 1 "
        msg = "" + msg + "and adds 10 seconds per level. "
        msg = "" + msg + "Current countdown starts over when hoop is added.  "
        msg = "" + msg + "Countdown continues while hoops move. "
        msg = "" + msg + "As levels increase, hoops are more likely to follow and "
        msg = "" + msg + "launch more slowly; thus, have a greater tendency to stop moving. "
        msg = "" + msg + "More at wecodemakecode.com"
        game.showLongText(msg, DialogLayout.Full)
    }
}
function make_one_hoop () {
    color = randint(3, 14)
    myHoop = circle.createCircle(Math.randomRange(16, 60), color)
    myHoop.setKind(SpriteKind.Hoop)
    myHoop.x = Math.randomRange(0, scene.screenWidth())
    myHoop.y = Math.randomRange(0, scene.screenHeight())
    myHoop.vx = random_velocity()
    myHoop.vy = random_velocity()
    myHoop.setFlag(SpriteFlag.BounceOnWall, true)
    sprites.setDataNumber(myHoop, "prior x", myHoop.x)
    sprites.setDataNumber(myHoop, "prior y", myHoop.y)
    sprites.setDataNumber(myHoop, "number of times stopped", 0)
    sprites.setDataNumber(myHoop, "original color", color)
    myHoopList.push(myHoop)
    sprite_list.push(myHoop)
    New_countdown = true
}
function distance_moved (hoop_ndx: number) {
    tmpHoop = myHoopList[hoop_ndx]
    dx = Math.abs(tmpHoop.x - sprites.readDataNumber(tmpHoop, "prior x"))
    dy = Math.abs(tmpHoop.y - sprites.readDataNumber(tmpHoop, "prior y"))
    return Math.floor(Math.sqrt(dx * dx + dy * dy))
}
sprites.onOverlap(SpriteKind.Hoop, SpriteKind.Hoop, function (sprite, otherSprite) {
    if (Math.randomRange(0, stickiness) == 0) {
        sprite.follow(otherSprite)
        if (circle.getColor(otherSprite) != red) {
            circle.setColor(sprite, circle.getColor(otherSprite))
        }
    }
})
function dump_dictionary (hoop_ndx: number) {
    tmpHoop = myHoopList[hoop_ndx]
    console.logValue("len", myHoopList.length)
    console.logValue("prior x", sprites.readDataNumber(tmpHoop, "prior x"))
    console.logValue("prior x", sprites.readDataNumber(tmpHoop, "prior y"))
    console.logValue("number of times stopped", sprites.readDataNumber(tmpHoop, "number stopped"))
    console.logValue("original color", sprites.readDataNumber(tmpHoop, "original color"))
}
function remove_slowest_hoop () {
    Min_dd = 100
    ndx = 0
    if (myHoopList.length > 1) {
        while (ndx < myHoopList.length) {
            This_dd = 0
            if (This_dd < Min_dd) {
                Min_dd = This_dd
                min_ndx = ndx
            }
            ndx += 1
        }
        myHoopList.removeAt(min_ndx).destroy()
    }
}
info.onCountdownEnd(function () {
    if (Level == levels) {
        game.over(true)
    } else {
        Level += 1
        info.setLife(Level)
        max_velocity = 100 / Level
        stickiness = stickiness - 10
        New_countdown = true
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    remove_slowest_hoop()
})
function random_velocity () {
    v = Math.randomRange(10, max_velocity)
    if (Math.randomRange(0, 1) == 0) {
        v = 0 - v
    }
    return v
}
let time = 0
let v = 0
let min_ndx = 0
let This_dd = 0
let ndx = 0
let Min_dd = 0
let tmpHoop: Sprite = null
let color = 0
let msg = ""
let d = 0
let myHoop: Sprite = null
let hoops_in_motion = 0
let stickiness = 0
let max_velocity = 0
let Level = 0
let New_countdown = false
let sprite_list: Sprite[] = []
let red = 0
let levels = 0
let dy = 0
let dx = 0
let myHoopList: Sprite[] = []
let B_changing_hoops = false
let original_color = 0
myHoopList = []
dx = 0
dy = 0
levels = 4
let change_per_level = 10
red = 2
sprite_list = sprites.allOfKind(SpriteKind.Hoop)
New_countdown = false
Level = 1
max_velocity = 100 / Level
// lower values are most sticky
stickiness = 51
info.setLife(Level)
show_instructions_question()
let prior_time = game.runtime()
make_one_hoop()
game.onUpdate(function () {
    if (New_countdown) {
        New_countdown = false
        info.startCountdown(change_per_level * Level)
    }
    time = game.runtime() - prior_time
    if (time > 100) {
        prior_time = game.runtime()
        info.setScore(count_hoops_in_motion())
        if (info.score() == 0) {
            game.over(false)
        }
    }
})
