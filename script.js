const textarea = document.getElementById("word-input");
// Randomize Color
const randomHSL = () => {
  const randomHue = Math.floor(Math.random() * 360);
  return `hsl(${randomHue}, 70%, 50%)`;
}
// Word object
const wordBubbleObject = {
  word: "", 
  size: Math.random() * 20 + 10,
  color: randomHSL(),
  xPos:  Math.random() * 0.9 * window.innerWidth,
  yPos: (Math.random() * 0.5 + 0.4) * window.innerHeight,
  opacity: Math.random() * 0.5 + 0.5
}
let allWords = [];
// Updating words in textarea
textarea.addEventListener("input", (event) => {
    if (event.target.value.endsWith(" ")) {
        const words = event.target.value.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        const wordSize = Math.random() * 20 + 10;
        const wordColor = randomHSL();
        const xPos = Math.random() * 0.9 * window.innerWidth;
        const yPos = (Math.random() * 0.5 + 0.4) * window.innerHeight;
        const wordBubble = {
          word: lastWord,
          size: wordSize,
          color: wordColor,
          xPos: xPos,
          yPos: yPos,
          // opacity: Math.random() * 0.5 + 0.5
        }
        allWords.push(wordBubble);
        // console.log("all words:", words);
        console.log("global all words:", allWords);
        console.log("word released:", lastWord);
        launchWord(wordBubble);
    }
});
// Animation loop
let start; // Start time for animation 
// Bubble animation
function launchWord(wordBubble) {
  
  // Appear at the bottom half of the screen
  const bubble = document.createElement('span');
  bubble.textContent = wordBubble.word;
  bubble.style.position = 'absolute';
  bubble.style.fontSize = `${wordBubble.size}px`;
  bubble.style.color = wordBubble.color;
  bubble.style.left = `${wordBubble.xPos}px`;
  bubble.style.top = `${wordBubble.yPos}px`;
  wordBubble.bubble = bubble; // Store the bubble element in the wordBubble object
  console.log(bubble);
  // Update allWords with the new bubble
  document.getElementById('stage').appendChild(bubble);
}
// Animation function 
function animate(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = timestamp - start;
  for(let i = 0; i < allWords.length; i++){
    allWords[i].yPos -= 0.5;
    allWords[i].bubble.style.top = `${allWords[i].yPos}px`;
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate)
