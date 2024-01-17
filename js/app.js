// Carga contenido del DOM
document.addEventListener("DOMContentLoaded", function() {
    const flagsElement = document.getElementById("flags");

const textsToChange = document.querySelectorAll("[data-section]")


const changeLanguage = async (language) => {
        const requestJson = await fetch(`../json/${language}.json`)
        const texts = await requestJson.json()
        console.log(texts);

        for (const textToChange of textsToChange) {
          const section = textToChange.dataset.section
          const value = textToChange.dataset.value
           
          textToChange.innerHTML=texts[section][value]
        }
      }


// Selecionar lenguage
flagsElement.addEventListener("click", (e) => {
    changeLanguage(e.target.parentElement.dataset.lenguage);
  });
});
  


  