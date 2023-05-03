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