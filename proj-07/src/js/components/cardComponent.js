export function cardComponent(card) {
  return `
        <div class="w-full h-full rounded-lg bg-[#ccf0f2]">
            <div class="card_img h-[250px] w-full rounded-t-lg bg-[#28273c]"></div>
            <div class="card_textbox h-full w-full px-6 py-5">
                <h2 class="text-[#214bce] text-[36px] font-semibold">${card.name}</h2>
                <p class="">${card.description}</p>
            </div>
        </div>
    `;
}
