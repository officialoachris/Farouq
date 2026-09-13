let sections = document.querySelectorAll("section");

// console.log(sections);

for (let i = 0; i < sections.length; i++) {
  sections[i].style.backgroundColor = "#11111";
}

function hoverHero_1() {
  heroTitle.style.color = "#c7ff2f";
}

let heroTitle = document.querySelector(".hero-text h2");
heroTitle.addEventListener("mouseover", hoverHero_1);

function hoverHero_0() {
  heroTitle.style.color = "#ffffff";
}

heroTitle.addEventListener("mouseleave", hoverHero_0);

function hello() {
  console.log("Hello");
}

// hello()

heroTitle.addEventListener("click", hello);
heroTitle.addEventListener("mouseover", hello);

function bye() {
  console.log("Goodbye");
}

heroTitle.addEventListener("mouseleave", function () {
  console.log("Goodbye");
});
// Cannot be removed by removeEventListner


heroTitle.removeEventListener("click", hello);