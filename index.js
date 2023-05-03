const canvas = document.querySelector('canvas')
// Used to draw on screen
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = .7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imgSrc: './assets/background.png'
})
const shop = new Sprite({
    position: {
        x: 620,
        y: 128,
    },
    imgSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6
})
const player = new Fighter({
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

const enemy = new Fighter({
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

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
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