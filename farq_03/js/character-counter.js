const textInput = document.getElementById("text-input");
const charCountEl = document.getElementById("char-count");
const wordCountEl = document.getElementById("word-count");
const sentenceCountEl = document.getElementById("sentence-count");
const readingTimeEl = document.getElementById("reading-time");
const excludeSpaces = document.getElementById("exclude-spaces");
const setLimit = document.getElementById("set-limit");
const limitWrap = document.getElementById("limit-wrap");
const charLimitInput = document.getElementById("char-limit");
const limitWarning = document.getElementById("limit-warning");

function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function countSentences(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const matches = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return matches ? matches.length : 0;
}

function updateStats() {
  const text = textInput.value;
  const exclude = excludeSpaces.checked;
  const chars = exclude ? text.replace(/\s/g, "").length : text.length;
  const words = countWords(text);
  const sentences = countSentences(text);
  const readingMinutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));

  charCountEl.textContent = String(chars);
  wordCountEl.textContent = String(words);
  sentenceCountEl.textContent = String(sentences);
  readingTimeEl.textContent = words === 0 ? "0 min" : `${readingMinutes} min`;

  if (setLimit.checked) {
    const limit = Number(charLimitInput.value) || 0;
    const over = chars > limit;
    textInput.classList.toggle("is-over-limit", over);
    limitWarning.hidden = false;
    limitWarning.classList.toggle("is-error", over);
    limitWarning.textContent = over
      ? `${chars - limit} characters over the limit`
      : `${limit - chars} characters remaining`;
  } else {
    textInput.classList.remove("is-over-limit");
    limitWarning.hidden = true;
  }
}

setLimit.addEventListener("change", () => {
  limitWrap.hidden = !setLimit.checked;
  updateStats();
});

[textInput, excludeSpaces, charLimitInput].forEach((el) => {
  el.addEventListener("input", updateStats);
});

excludeSpaces.addEventListener("change", updateStats);
updateStats();
