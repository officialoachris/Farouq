 export function cardComponent(card) {
  return `
  <article class="p-6">
        <div class="relative">
                <img
                  src="${card.image}"
                  alt="${card.description}"
                  class="aspect-square w-full rounded-lg object-cover"
                />

                <button
                  data-product="${card.name}"
                  class="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-[#ad8a85] bg-white px-6 py-3 text-sm font-semibold text-[#260f08]"
                >
                  🛒 Add to Cart
                </button>
              </div>

              <div class="mt-9">
                <p class="text-sm text-[#87635a]">${card.name}</p>

                <h2 class="text-[20px] mt-1 font-semibold text-[#260f08]">
                  ${card.description}
                </h2>

                <p class="mt-1 text-[18px] font-semibold text-[#c73b0f]">${card.price}</p>
              </div>
            </article> 
    `;
}
