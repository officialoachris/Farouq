import { cardData } from "./data/cardData.js";
import { cardComponent } from "./components/cardComponent.js";

const container = document.getElementById("card_wrapper");

cardData.forEach(card => {
  container.innerHTML += cardComponent(card);
});