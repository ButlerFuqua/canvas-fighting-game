class Sprite {
    constructor({ position, imgSrc }) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imgSrc
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
    }
}
class Fighter {
    constructor({ position, velocity, color = 'red', offset }) {
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
    }

    draw() {
        const { x: spriteX, y: spriteY } = this.position
        c.fillStyle = this.color
        c.fillRect(spriteX, spriteY, this.width, this.height)

        // attackBox
        if (this.isAttacking) {
            const { x: attackX, y: attackY } = this.attackBox.position;
            const { width: attackW, height: attackH } = this.attackBox
            c.fillStyle = 'green'
            c.fillRect(attackX, attackY, attackW, attackH)
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y


        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
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