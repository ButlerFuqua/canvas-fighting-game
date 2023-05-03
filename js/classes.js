class Sprite {
    constructor({ position, imgSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.scale = scale
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imgSrc
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,

            // crop
            (this.framesCurrent * this.image.width) / this.framesMax,
            0,
            this.image.width / this.framesMax,
            this.image.height,

            // position
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,

            // size
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            // - 1 to avoid flicker by animating static images created by sprite class (like background)
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}
class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        offset,
        imgSrc,
        scale = 1,
        framesMax = 1
    }) {

        super({
            position,
            imgSrc,
            scale,
            framesMax,
            offset
        })

        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50,
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
    }

    update() {
        this.draw()
        this.animateFrames()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y


        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        const groundPadding = 96
        if (this.position.y + this.height + this.velocity.y >= canvas.height - groundPadding) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => this.isAttacking = false, 100)
    }
}