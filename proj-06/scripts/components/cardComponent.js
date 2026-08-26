export function cardComponent(card) {
  return `
        <div class="w-[500px] h-[500px] bg-amber-300">
            <div class="card_img h-2/3 w-full bg-amber-600"></div>
            <div class="card_textbox h-1/3 w-full px-6 py-12">
                <h2>${card.name}</h2>
                <p class="">${card.description}</p>
            </div>
        </div>
    `;
}
