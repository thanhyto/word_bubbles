let allWords = [];
let lastLaunchedWord = "";
let dots = [];
const timeStamp = document.getElementById('timestamp');
const updateTimeStamp = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium'
  });
  timeStamp.textContent = formatter.format(now);
}
updateTimeStamp();
setInterval(updateTimeStamp, 1000); // Update every second
const textarea = document.getElementById("word-input");
// Randomize Color
const randomHSL = () => {
    const randomHue = Math.floor(Math.random() * 360);
    return `hsl(${randomHue}, 70%, 50%)`;
};
// Randomize State
const randomState = () => {
    return Math.random() < 0.5 ? "Fade" : "Burst";
};
// Create Dots
const createDots = (x, y, color, opacity) => {
    const div = document.createElement("div");
    const randomAngle = Math.random() * Math.PI * 2; // Random angle in radians
    const randomSpeed = Math.random() / 8 + 0.4; // Random speed between 0.4 and 0.65
    const vx = randomSpeed * Math.cos(randomAngle);
    const vy = randomSpeed * Math.sin(randomAngle);
    const dot = {
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        color: color,
        size: Math.random() * 5 + 70,
        opacity: opacity,
    };
    div.style.height = `${dot.size}px`;
    div.style.width = `${dot.size}px`;
    div.style.backgroundColor = `${dot.color}`;
    div.style.position = "absolute";
    div.style.borderRadius = `50%`;
    div.style.left = `${dot.x}px`;
    div.style.top = `${dot.y}px`;
    div.style.opacity = `${dot.opacity}`;
    dot.div = div;
    dots.push(dot);
    document.getElementById("stage").appendChild(div);
};

// Burst
const burst = (xPos, yPos, color, opacity) => {
    for (let i = 0; i < 5; i++) {
        createDots(xPos, yPos, color, opacity);
    }
};

// Updating words in textarea
textarea.addEventListener("input", (event) => {
    // Release word when space is pressed
    if (event.target.value.endsWith(" ")) {
        const words = event.target.value.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        const wordSize = Math.random() * 20 + 70;
        const wordColor = randomHSL();
        const xPos = Math.random() * 0.95 * window.innerWidth;
        const yPos = (Math.random() * 0.5 + 0.4) * window.innerHeight;
        const state = randomState();
        const swaySpeed = Math.random() * 3 + 1;
        const swayAmount = Math.random() * 40 + 20;
        const swayOffset = Math.random() * 1000;
        const opacity = Math.random() * 0.4 + 0.3;
        // Word Bubble Object
        const wordBubble = {
            word: lastWord,
            size: wordSize,
            color: wordColor,
            xPosOrigin: xPos,
            xPos: xPos,
            yPos: yPos,
            opacity: opacity,
            state: state,
            hasBurst: false,
            swaySpeed: swaySpeed,
            swayAmount: swayAmount,
            swayOffset: swayOffset,
        };
        // Store all words in an array for animation
        allWords.push(wordBubble);
        launchWord(wordBubble);
        // Update last launched word
        lastLaunchedWord = lastWord;
    }
});
// Bubble animation
function launchWord(wordBubble) {
    // Appear at the bottom half of the screen
    const bubble = document.createElement("span");
    bubble.textContent = wordBubble.word;
    bubble.style.position = "absolute";
    bubble.style.fontSize = `${wordBubble.size}px`;
    bubble.style.color = wordBubble.color;
    bubble.style.left = `${wordBubble.xPos}px`;
    bubble.style.top = `${wordBubble.yPos}px`;
    bubble.style.opacity = wordBubble.opacity;
    bubble.style.fontFamily = "'Quicksand', sans-serif";
    wordBubble.bubble = bubble; // Store the bubble element in the wordBubble object
    // Update allWords with the new bubble
    document.getElementById("stage").appendChild(bubble);
}
let previousTimestamp;
let start;

function animate(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }
    const elapsed = timestamp - start;

    //  for delta time
    if (previousTimestamp === undefined) {
        previousTimestamp = timestamp;
    }
    const deltaTime = (timestamp - previousTimestamp) / 1000; // seconds since last frame
    previousTimestamp = timestamp;

    for (let i = 0; i < allWords.length; i++) {
        // Update each word
        allWords[i].yPos -= 30 * deltaTime; // going up - evaporate
        allWords[i].xPos =
            allWords[i].xPosOrigin +
            Math.sin(elapsed / 1000 * allWords[i].swaySpeed + allWords[i].swayOffset) * allWords[i].swayAmount; // Add horizontal oscillation
        // If fade, then decrease size and opacity
        if (allWords[i].state == "Fade") {
            allWords[i].size -= 6 * deltaTime;
            allWords[i].opacity -= 0.06 * deltaTime;
        }
        // If burst, increase size and burst
        if (allWords[i].state == "Burst") {
            allWords[i].size += 6 * deltaTime;
            if (allWords[i].size >= 150 && !allWords[i].hasBurst) {
                allWords[i].hasBurst = true;
                burst(allWords[i].xPos, allWords[i].yPos, allWords[i].color, allWords[i].opacity);
                allWords[i].opacity = 0;
            }
        }
        if (
            allWords[i].yPos < -50 ||
            allWords[i].size < 0 ||
            allWords[i].size > 170 ||
            allWords[i].opacity <= 0
        ) {
            // Reset the word bubble to the bottom half with new properties
            allWords[i].yPos = (Math.random() * 0.5 + 0.4) * window.innerHeight; // Reset Y position to bottom half
            allWords[i].xPosOrigin = Math.random() * 0.95 * window.innerWidth; // Reset X origin position
            allWords[i].xPos = allWords[i].xPosOrigin; // Reset X Position to xPosOrigin
            allWords[i].swaySpeed = Math.random() * 3 + 1;
            allWords[i].swayAmount = Math.random() * 40 + 20;
            allWords[i].swayOffset = Math.random() * 1000;
            allWords[i].size = Math.random() * 20 + 50; // Reset size
            allWords[i].opacity = Math.random() * 0.4 + 0.3; // Reset opacity
            allWords[i].state = randomState();
            const newColor = randomHSL();
            allWords[i].color = newColor; // Reset color
            allWords[i].bubble.style.color = newColor; // Update bubble color
            allWords[i].hasBurst = false;
            
        }
        allWords[i].bubble.style.fontSize = `${allWords[i].size}px`;
        allWords[i].bubble.style.top = `${allWords[i].yPos}px`;
        allWords[i].bubble.style.left = `${allWords[i].xPos}px`;
        allWords[i].bubble.style.opacity = allWords[i].opacity;
    }
    for (let j = 0; j < dots.length; j++) {
        if(dots[j].x < 0 || dots[j].x > window.innerWidth ||
          dots[j].y < 0 || dots[j].y > window.innerHeight ||
          dots[j].opacity <= 0
        ) {
          dots[j].div.remove();
        }
        dots[j].x += dots[j].vx * 60 * deltaTime;
        dots[j].y += dots[j].vy * 60 * deltaTime;
        dots[j].size -= 3 * deltaTime;
        dots[j].opacity -= 0.18 * deltaTime;
        dots[j].div.style.left = `${dots[j].x}px`;
        dots[j].div.style.top = `${dots[j].y}px`;
        dots[j].div.style.width = `${dots[j].size}px`;
        dots[j].div.style.height = `${dots[j].size}px`;
        dots[j].div.style.opacity = `${dots[j].opacity}`;
    }
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
