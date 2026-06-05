const textarea = document.getElementById("word-input");
// Randomize Color
const randomHSL = () => {
    const randomHue = Math.floor(Math.random() * 360);
    return `hsl(${randomHue}, 70%, 50%)`;
};
// Word object
// const wordBubbleObject = {
//     word: "",
//     size: ,
//     color: randomHSL(),
//     xPos: Math.random() * 0.9 * window.innerWidth,
//     yPos: (Math.random() * 0.5 + 0.4) * window.innerHeight,
//     opacity: 0.5,
// };
let allWords = [];
let lastLaunchedWord = "";

// Updating words in textarea
textarea.addEventListener("input", (event) => {
    // Release word when space is pressed
    if (event.target.value.endsWith(" ")) {
        const words = event.target.value.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        // Prevent launching the same word multiple times if the user keeps pressing space
        if (lastWord === lastLaunchedWord) {
            return;
        }
        const wordSize = Math.random() * 20 + 50;
        const wordColor = randomHSL();
        const xPos = Math.random() * 0.95 * window.innerWidth;
        const yPos = (Math.random() * 0.5 + 0.4) * window.innerHeight;
        const state = Math.random() < 0.5 ? "Fade" : "Burst";
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
        allWords[i].yPos -= 0.5; // going up - evaporate
        allWords[i].xPos =
            allWords[i].xPosOrigin + Math.sin((elapsed / 8000) * i) * 20; // Add horizontal oscillation
        allWords[i].opacity -= 0.001;

        if (allWords[i].state == "Fade") {
            allWords[i].size -= 0.05;
        }
        if (allWords[i].state == "Burst") {
            allWords[i].size += 0.05;
        }
        if (
            allWords[i].yPos < -50 ||
            allWords[i].size < 0 ||
            allWords[i].opacity <= 0
        ) {
            allWords[i].yPos = (Math.random() * 0.5 + 0.4) * window.innerHeight; // Reset position to bottom half
            allWords[i].size = Math.random() * 20 + 50; // Reset size
            allWords[i].opacity = 1;
        }
        allWords[i].bubble.style.fontSize = `${allWords[i].size}px`;
        allWords[i].bubble.style.top = `${allWords[i].yPos}px`;
        allWords[i].bubble.style.left = `${allWords[i].xPos}px`;
        allWords[i].bubble.style.opacity = allWords[i].opacity;
    }
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
