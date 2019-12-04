const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

document.addEventListener("DOMContentLoaded", () => {
  getTrainers();
});

function getTrainers() {
  fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(res => loopThroughTrainers(res))
    .catch(err => console.log(err));
}

function loopThroughTrainers(trainers) {
  trainers.forEach(trainer => appendOneTrainer(trainer));
}

function appendOneTrainer(trainer) {
  const div = document.createElement("div");
  div.setAttribute("class", "card");
  div.setAttribute("data-id", trainer.id);

  const pName = document.createElement("p");
  pName.innerText = trainer.name;

  const addPokemonButton = document.createElement("button");
  addPokemonButton.setAttribute("data-trainer-id", trainer.id);
  addPokemonButton.innerText = "Add Pokemon";
  addPokemonButton.addEventListener("click", () =>
    addPokemonToTrainer(trainer)
  );

  const ul = document.createElement("ul");

  div.appendChild(pName);
  div.appendChild(addPokemonButton);
  div.appendChild(ul);

  const mainEl = document.getElementsByTagName("main")[0];

  mainEl.appendChild(div);

  trainer.pokemons.forEach(pokemon => {
    appendOnePokemon(trainer, pokemon);
  });
}

function appendOnePokemon(trainer, pokemon) {
  const card = document.querySelectorAll(`[data-id='${trainer.id}']`)[0];
  const ul = card.children[2];

  const li = document.createElement("li");
  li.innerText = `${pokemon.nickname} (${pokemon.species})`;

  const releaseBtn = document.createElement("button");
  releaseBtn.setAttribute("class", "release");
  releaseBtn.setAttribute("data-pokemon-id", pokemon.id);
  releaseBtn.innerText = "Release";
  releaseBtn.addEventListener("click", () => releasePokemon(pokemon, li));

  li.appendChild(releaseBtn);
  ul.appendChild(li);
}

function addPokemonToTrainer(trainer) {
  const card = document.querySelectorAll(`[data-id='${trainer.id}']`)[0];
  if (card.children[2].children.length < 6) {
    fetch(POKEMONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ trainer_id: trainer.id })
    })
      .then(res => res.json())
      .then(pokemon => appendOnePokemon(trainer, pokemon))
      .catch(err => console.log(err));
  } else {
    alert("A trainer can only have 6 pokemon");
  }
}

function releasePokemon(pokemon, li) {
  fetch(`${POKEMONS_URL}/${pokemon.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(li.remove())
    .catch(err => console.log(err));
}
