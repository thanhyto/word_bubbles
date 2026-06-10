let allWords = [];
let lastLaunchedWord = "";
let dots = [];

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
const createDots = (x, y, color) => {
    const div = document.createElement("div");
    const randomAngle = Math.random() * Math.PI * 2;
    const randomSpeed = 3 * Math.random();
    const vx = randomSpeed * Math.cos(randomAngle);
    const vy = randomSpeed * Math.sin(randomAngle);
    const dot = {
        x: x,
        y: y,
        vx: vx,
        color: color,
        vy: vy,
        size: 20,
        opacity: 1,
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
const burst = (xPos, yPos, color) => {
    for (let i = 0; i < 4; i++) {
        createDots(xPos, yPos, color);
    }
};

// Updating words in textarea
textarea.addEventListener("input", (event) => {
    // Release word when space is pressed
    if (event.target.value.endsWith(" ")) {
        const words = event.target.value.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        // Prevent launching the same word multiple times if the user keeps pressing space
        if (lastWord === lastLaunchedWord && lastLaunchedWord == "") {
            return;
        }
        const wordSize = Math.random() * 20 + 70;
        const wordColor = randomHSL();
        const xPos = Math.random() * 0.95 * window.innerWidth;
        const yPos = (Math.random() * 0.5 + 0.4) * window.innerHeight;
        const state = randomState();
        const speed = Math.random() * 40;
        // Word Bubble Object
        const wordBubble = {
            word: lastWord,
            size: wordSize,
            color: wordColor,
            xPosOrigin: xPos,
            xPos: xPos,
            yPos: yPos,
            opacity: 1,
            state: state,
            speed: speed,
        };
        // Store all words in an array for animation
        allWords.push(wordBubble);
        // console.log("all words:", words);
        console.log("global all words:", allWords);
        console.log("word released:", lastWord);
        launchWord(wordBubble);
        // Update last launched word
        lastLaunchedWord = lastWord;
    }
});
// Animation loop
let start; // Start time for animation
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
    wordBubble.bubble = bubble; // Store the bubble element in the wordBubble object
    console.log(bubble);
    // Update allWords with the new bubble
    document.getElementById("stage").appendChild(bubble);
}
// Animation function
function animate(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }
    const elapsed = timestamp - start;
    for (let i = 0; i < allWords.length; i++) {
        // Update each word
        allWords[i].yPos -= 0.5; // going up - evaporate
        allWords[i].xPos =
            allWords[i].xPosOrigin +
            Math.sin((elapsed / 8000) * i) * allWords[i].speed; // Add horizontal oscillation
        // If fade, then decrease size and opacity
        if (allWords[i].state == "Fade") {
            allWords[i].size -= 0.25;
            allWords[i].opacity -= 0.001;
        }
        // If burst, increase size and burst
        if (allWords[i].state == "Burst") {
            allWords[i].size += 0.25;
            if (allWords[i].size >= 150) {
                burst(allWords[i].xPos, allWords[i].yPos, allWords[i].color);
            }
        }
        if (
            allWords[i].yPos < -50 ||
            allWords[i].size < 0 ||
            allWords[i].size > 170 ||
            allWords[i].opacity <= 0
        ) {
            allWords[i].yPos = (Math.random() * 0.5 + 0.4) * window.innerHeight; // Reset Y position to bottom half
            allWords[i].xPosOrigin = Math.random() * 0.95 * window.innerWidth; // Reset X position
            allWords[i].size = Math.random() * 20 + 50; // Reset size
            allWords[i].opacity = 1;
            allWords[i].state = randomState();
            allWords[i].bubble.style.color = randomHSL();
        }
        allWords[i].bubble.style.fontSize = `${allWords[i].size}px`;
        allWords[i].bubble.style.top = `${allWords[i].yPos}px`;
        allWords[i].bubble.style.left = `${allWords[i].xPos}px`;
        allWords[i].bubble.style.opacity = allWords[i].opacity;
    }
    for (let j = 0; j < dots.length; j++) {
        if(dots[j].x < 0 || dots[j].x > window.innerWidth ||
          dots[j].y < 0 || dots[j].y > window.innerHeight ||
          dots[j].opacity <= 0.3
        ) {
          dots[j].div.remove();
        }
        dots[j].x += dots[j].vx;
        dots[j].y += dots[j].vy;
        dots[j].size *= 0.7;
        dots[j].opacity -= 0.001;
        dots[j].div.style.left = `${dots[j].x}px`;
        dots[j].div.style.top = `${dots[j].y}px`;
        dots[j].div.style.size = `${dots[j].size}px`;
        dots[j].div.style.opacity = `${dots[j].opacity}`;
    }
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
