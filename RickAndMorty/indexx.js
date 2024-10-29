document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector("#container");
    container.classList.add("row", "g-4");

    const limit = 10;
    let currentPage = 0;
    let result = await getCountries();

    async function getCountries() {
        let response = await fetch("https://rickandmortyapi.com/api/character");
        let data = await response.json();
        return data.results.sort((a, b) => (a.name> b.name ? 1 : -1));
    }

    async function renderCountries(page = currentPage) {
        currentPage = page;
        container.innerHTML = "";

        const offset = page * limit;
        const paginatedData = result.slice(offset, offset + limit);

        paginatedData.forEach(element => {
            let divCharacter = document.createElement("div");
            divCharacter.classList.add("col-md-3");
            divCharacter.innerHTML =   `
                <div class="card h-100" style="width: 18rem;">
                    <img src="${element.image}" class="card-img-top country-img" style="height: 200px; object-fit: cover;" alt="Bandera de ${element.name.common}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${element.name}</h5>
                        <button class="btn btn-primary mt-auto">Details</button>
                    </div>
                </div>
            ` ;
            /* divCharacter.querySelector("button").addEventListener("click", () => renderCountryDetails(element)); */
            //
            container.appendChild(divCharacter);
        });

        generatePaginationButtons({ offset, limit, total: result.length, count: paginatedData.length });
    }

    function generatePaginationButtons(data) {
        const { offset, limit, total } = data;
        const currentPage = offset / limit;
        const nPages = Math.ceil(total / limit);
        const paginationContainer = document.querySelector("#pagination");
        paginationContainer.innerHTML = "";

        const visiblePages = Array(nPages)
            .fill(0)
            .map((_, i) => i)
            .filter(
                v => v < 3 || (v > currentPage - 3 && v < currentPage + 3) || v > nPages - 4
            )
            .map((v, i, pages) => (Math.abs(pages[i + 1] - v) > 1 ? [v, -1] : v))
            .flat();

        visiblePages.forEach(i => {
            const button = document.createElement("button");
            button.type = "button";
            button.classList.add("btn", "btn-primary");
            button.dataset.page = i;
            button.innerText = i === -1 ? "..." : i + 1;

            if (i === currentPage) button.classList.add("active");
            if (i === -1) button.disabled = true;

            button.addEventListener("click", () => renderCountries(i));
            paginationContainer.appendChild(button);
        });
    }

    function renderCountryDetails(element) {
        container.innerHTML = "";
        const leng = Object.values(element.languages);
        const capitalDiv = document.createElement("div");
        capitalDiv.innerHTML = "";/* "`
            <div class="card h-100" style="width: 18rem;">
                <img src="${element.flags.png}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="Bandera de ${element.name.common}">
                <div class="card-body d-flex flex-column">
                    <h4 class="card-title">Continente</h4>
                    <h6 class="card-title">${element.continents[0]}</h6>
                    <h4 class="card-title">Capital</h4>
                    <h6 class="card-title">${element.capital ? element.capital[0] : "No disponible"}</h6>
                    <h4 class="card-title">Población</h4>
                    <h6 class="card-title">${element.population}</h6>
                    <h4 class="card-title">Lenguaje oficial</h4>
                    <h6 class="card-title">${leng.join(", ")}</h6>
                    <h4 class="card-title">Zona horaria</h4>
                    <h6 class="card-title">${element.timezones[0]}</h6>
                    <button id="return" class="btn btn-primary mt-3">Return</button>
                    <button id="showMorePopulation" class="btn btn-secondary mt-2">Obtener países con más población</button>
                </div>
            </div>
        `;" */

        capitalDiv.querySelector("#return").addEventListener("click", () => renderCountries(currentPage));
        capitalDiv.querySelector("#showMorePopulation").addEventListener("click", () => ea(element.population));

        container.appendChild(capitalDiv);
    }

    async function ea(poblacion) {
        container.innerHTML = "";
        const filteredCountries = result
            .filter(country => country.population > poblacion)
            .sort((a, b) => (a.name.common > b.name.common ? 1 : -1));

        filteredCountries.forEach(element => {
            let div = document.createElement("div");
            div.classList.add("col-md-3");
            div.innerHTML = `
                <div class="card h-100" style="width: 18rem;">
                    <img src="${element.flags.png}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="Bandera de ${element.name.common}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${element.name.common}</h5>
                    </div>
                </div>
            `;

            container.appendChild(div);
        });
    }

    renderCountries(currentPage);
});
