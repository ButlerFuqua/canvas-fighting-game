const canvas = document.querySelector('canvas')
// Used to draw on screen
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = .7;

class Sprite {
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

const player = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0
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
    offset: {
        x: -50,
        y: 0
    }
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

function rectangularCollision({ rect1, rect2 }) {
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
        rect1.attackBox.position.x <= rect2.position.x + rect2.width &&

        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
        rect1.attackBox.position.y + rect1.attackBox.height <= rect2.position.y + rect2.height
    )
}

function showWinner({ player1, player2, timerId }) {
    clearTimeout(timerId)
    const displayTextDiv = document.getElementById('displayText');
    if (player1.health === player2.health) {
        displayTextDiv.innerHTML = 'Tie';
    }
    if (player1.health > player2.health) {
        displayTextDiv.innerHTML = 'Player One Wins!';
    }
    if (player2.health > player1.health) {
        displayTextDiv.innerHTML = 'Player Two Wins!';
    }
    displayTextDiv.style.display = 'flex';
}

let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.getElementById('timer').innerHTML = timer;
    }

    if (timer === 0) {
        showWinner({ player1: player, player2: enemy, timerId })
    }
}
decreaseTimer();

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
        rectangularCollision({ rect1: player, rect2: enemy }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.getElementById('enemyHealth').style.width = `${enemy.health}%`
    }
    if (
        rectangularCollision({ rect1: enemy, rect2: player }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 20
        document.getElementById('playerHealth').style.width = `${player.health}%`
    }

    // End game based on health
    if (player.health === 0 || enemy.health === 0) {
        showWinner({ player1: player, player2: enemy, timerId })
    }

}
animate()

window.addEventListener('keydown', (event) => {
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
        case ' ':
            player.attack()
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
        case 'ArrowDown':
            enemy.attack()
            break;
        default:
            break;
    }
})

window.addEventListener('keyup', (event) => {
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