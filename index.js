const FACE_COUNT = 17;
const HIGH_SCORE_STORAGE_NAME = 'high-score'
let lastFace = 0;
let highScore = 0;
let score = 0;

for (let i = 0; i < FACE_COUNT; i++) {
    const face = new Image();
    face.src = `/assets/face-${i}.png`;
}

const GRUNT_COUNT = 26;
const grunts = new Howl({
    src: ['/assets/grunts.mp3'],
    sprite: {
      'grunt-0': [272, 590],
      'grunt-1': [1076, 560],
      'grunt-2': [2011, 422],
      'grunt-3': [2797, 428],
      'grunt-4': [3628, 528],
      'grunt-5': [4526, 469],
      'grunt-6': [5542, 558],
      'grunt-7': [6499, 330],
      'grunt-8': [7390, 516],
      'grunt-9': [8317, 455],
      'grunt-10': [9259, 418],
      'grunt-11': [10135, 319],
      'grunt-12': [10995, 468],
      'grunt-13': [11915, 331],
      'grunt-14': [12895, 553],
      'grunt-15': [13867, 512],
      'grunt-16': [15046, 485],
      'grunt-17': [16174, 426],
      'grunt-18': [17198, 473],
      'grunt-19': [18199, 430],
      'grunt-20': [19201, 414],
      'grunt-21': [20250, 463],
      'grunt-22': [21486, 426],
      'grunt-23': [22591, 476],
      'grunt-24': [23727, 513],
      'grunt-25': [24869, 364],
      'goat': [25693, 645],
      '80s-scream': [26947, 1751],
      'wilhelm-scream': [29484, 1039]
    }
});


const baseSpecialProbability = 0.05;
let playsSinceSpecial = 25; // Start ready for special
const cooldownPlays = 50; // Number of plays for probability to recover

function playNormalGrunt() {
    const gruntNumber = Math.floor(Math.random() * GRUNT_COUNT);
    grunts.play(`grunt-${gruntNumber}`);
}

function playSpecialGrunt() {
    const specials = ['goat', '80s-scream', 'wilhelm-scream'];
    grunts.play(specials[Math.floor(Math.random() * specials.length)]);
}

function playGrunt() {
    // Increment counter
    playsSinceSpecial++;

    // If we haven't waited minimum plays, always return false
    if (playsSinceSpecial < 10) {
        return playNormalGrunt();
    }

    // Calculate current probability
    // Starts at 0 and gradually returns to base probability over cooldownPlays
    const currentProbability = baseSpecialProbability * 
        Math.max(0, (playsSinceSpecial - 10) / cooldownPlays);

    // Check if we should play special
    if (Math.random() < currentProbability) {
        playsSinceSpecial = 0; // Reset counter
        return playSpecialGrunt();
    }

    return playNormalGrunt();
}


if (localStorage.getItem(HIGH_SCORE_STORAGE_NAME)) {
    const storedScore = parseInt(localStorage.getItem(HIGH_SCORE_STORAGE_NAME));
    if (Number.isInteger(storedScore) && Number.isFinite(storedScore)) {
        highScore = storedScore;
    }
}

const scoreElement = document.getElementById('score-value');
const highScoreElement = document.getElementById('high-score-value');
function incrementScore() {
    score++;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(HIGH_SCORE_STORAGE_NAME, highScore);
    }
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;
    if (score === 5) {
        document.body.classList.add('score-5');
    }
    if (score === 10) {
        document.body.classList.add('score-10');
    }
}

function createNewFace() {
    const newButton = document.createElement('button');
    const newImage = document.createElement('img');
    let imageNumber = Math.floor(Math.random() * FACE_COUNT);
    if (imageNumber === lastFace) {
        imageNumber = (imageNumber + 1) % FACE_COUNT;
    }
    newImage.src = `./assets/faces/face-${imageNumber}.png`;
    const newImageWidth = parseInt((Math.random() * 20) + 10);
    newImage.style.width = newImageWidth + 'vw';
    newButton.appendChild(newImage);
    newButton.className = 'face';
    Object.assign(newButton.style, {
        top: `calc(${parseInt(Math.random() * (document.documentElement.clientHeight))}px - ${newImageWidth/2}vw)`,
        left: `calc(${parseInt(Math.random() * (document.documentElement.clientWidth))}px - ${newImageWidth/2}vw)`,
        transform: `rotate(${parseInt(Math.random() * 90) - 45}deg)`,
    });
    newButton.addEventListener('click', clickHandler);
    document.body.appendChild(newButton);
}

function clickHandler(event) {
    if (event.target instanceof HTMLButtonElement) {
        event.target.remove();
    } else if (event.target instanceof HTMLImageElement) {
        event.target.parentElement.remove();
    }
    incrementScore();
    playGrunt();
    createNewFace();
}

const initialFace = document.querySelector('.initial.face');
if (initialFace) {
    initialFace.addEventListener('click', clickHandler);
}