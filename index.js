const canvas = document.querySelector('canvas')
// Used to draw on screen
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = .7;

class Sprite {
    constructor({ position, velocity, color = 'red' }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50,
        }
        this.color = color
    }

    draw() {
        const { x: spriteX, y: spriteY } = this.position
        c.fillStyle = this.color
        c.fillRect(spriteX, spriteY, this.width, this.height)

        // attackBox
        const { x: attackX, y: attackY } = this.attackBox.position;
        const { width: attackW, height: attackH } = this.attackBox
        c.fillStyle = 'green'
        c.fillRect(attackX, attackY, attackW, attackH)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    }
})

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'blue',
})

const keys = {
    // Player
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    // Enemy
    ArrowLeft: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    const speed = 5;

    // Player movement
    player.velocity.x = 0
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -(speed)
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = speed
    }

    // Enemy movement
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -(speed)
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = speed
    }

    // Detect for collision
    if (
        player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
        player.attackBox.position.x <= enemy.position.x + enemy.width &&

        player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
        player.attackBox.position.y + player.attackBox.height <= enemy.position.y + enemy.height
    ) {
        console.log('ATTACK!')
    }
}
animate()

window.addEventListener('keydown', (event) => {
    console.log(event.key)
    const jumpSpeed = 20;
    // Player
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd'
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a'
            break;
        case 'w':
            player.velocity.y = -(jumpSpeed);
            break;

        // Enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowUp':
            enemy.velocity.y = -(jumpSpeed);
            break;
        default:
            break;
    }
})

window.addEventListener('keyup', (event) => {
    console.log(event.key)
    // Player
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;

        // Enemy
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        default:
            break;
    }
})