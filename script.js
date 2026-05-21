const textarea = document.getElementById("word-input");
// Updating words in textarea
textarea.addEventListener("input", (event) => {
    if (event.target.value.endsWith(" ")) {
        const allWords = event.target.value.trim().split(/\s+/);
        const lastWord = allWords[allWords.length - 1];
        console.log("all words:", allWords);
        console.log("word released:", lastWord);
        launchWord(lastWord);
    }
});
// Bubble animation
function launchWord(word) {
  const xPos = Math.random() * window.innerWidth;
  // Appear at the bottom half of the screen
  const yPos = Math.random() * 0.5 * window.innerHeight;
  const bubble = document.createElement('span');
  bubble.textContent = word;
  bubble.style.position = 'absolute';
  bubble.style.left = `${xPos}px`;
  bubble.style.top = `${yPos}px`;
  document.getElementById('stage').appendChild(bubble);
}
