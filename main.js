const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

let gameState = 'MENU';
let score = 0;
// Note timings for the intro of A Hard Day's Night
let notes = [
    { time: 1000, lane: 0, hit: false }, // The big opening chord
    { time: 1500, lane: 1, hit: false },
    { time: 2000, lane: 2, hit: false },
    { time: 2500, lane: 3, hit: false },
    { time: 2800, lane: 1, hit: false },
    { time: 3100, lane: 2, hit: false }
];

const audio = new Audio('assets/audio/hard_days_night.mp3');

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'MENU') {
        ctx.fillStyle = "cyan";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Press SPACE to start A Hard Day's Night", canvas.width/2, canvas.height/2);
    } else {
        drawHighway();
        renderNotes();
    }
    requestAnimationFrame(draw);
}

function drawHighway() {
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    for(let i=0; i<=4; i++) {
        ctx.beginPath();
        ctx.moveTo(350 + (i-2)*20, 0); 
        ctx.lineTo(400 + (i-2)*150, 600);
        ctx.stroke();
    }
}

function renderNotes() {
    const songTime = audio.currentTime * 1000;
    notes.forEach(note => {
        if (!note.hit) {
            // Perspective math: notes get bigger and faster as they drop
            let progress = (songTime - (note.time - 2000)) / 2000; 
            if (progress >= 0 && progress <= 1.2) {
                let y = progress * 600;
                let x = 400 + (note.lane - 1.5) * (100 + progress * 300);
                let size = 10 + progress * 30;

                ctx.fillStyle = ["#ff4e50", "#fcff00", "#00ff00", "#00baff"][note.lane];
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI*2);
                ctx.fill();
                ctx.strokeStyle = "white";
                ctx.stroke();
            }
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameState === 'MENU') {
        gameState = 'PLAYING';
        audio.play();
    }
    // Simple hit detection for keys A, S, D, F
    const keys = ['KeyA', 'KeyS', 'KeyD', 'KeyF'];
    const lane = keys.indexOf(e.code);
    if (lane !== -1 && gameState === 'PLAYING') {
        const now = audio.currentTime * 1000;
        notes.forEach(note => {
            if (note.lane === lane && Math.abs(note.time - now) < 150 && !note.hit) {
                note.hit = true;
                score += 100;
                scoreEl.innerText = score;
            }
        });
    }
});

draw();