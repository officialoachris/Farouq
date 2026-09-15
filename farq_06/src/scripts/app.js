import { cardData } from "./data/cardData.js";
import { cardComponent } from "./components/cardComponent.js";

const container = document.querySelector("#card_wrap");

cardData.forEach(card => {
  container.innerHTML += cardComponent(card);
});