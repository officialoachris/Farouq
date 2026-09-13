const textInput = document.getElementById("textInput");
textInput.addEventListener("input", updateStats);

// UPDATE STATISTICS FUNCTION
function updateStats() {
  const text = textInput.value;
  const characters = text.length;

  document.getElementById("characterCount").textContent = String(
    characters,
  ).padStart(2, "0");

  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "");

  document.getElementById("wordCount").textContent =
    text.trim() === "" ? 0 : words.length;

  const sentences = text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim() !== "");

  document.getElementById("sentenceCount").textContent = sentences.length;

  const readingMinutes = text.trim() === "" ? 0 : Math.ceil(words.length / 200);

  document.getElementById("readingTime").textContent =
    `Approx. reading time: ${readingMinutes} minute`;

  const densityData = calculateDensity(text);

  console.log(densityData);
}

function calculateDensity(text) {
  const density = {};

  for (let char of text.toLowerCase()) {
    if (/[a-z]/.test(char)) {
      density[char] = (density[char] || 0) + 1;
    }
  }
  console.log(density);
}

function trial_01() {
  // console.log("anything");
}

trial_01();
trial_01();
trial_01();

document.addEventListener("input", trial_01);


