document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector("#container");
    container.classList.add("row", "g-4");

    const limit = 20;
    let currentPage = 0;
    let result = await getCountries();

    async function getCountries() {
        let allCharacters = [];
        let response;
        let nextUrl = "https://rickandmortyapi.com/api/character";

        do {
            response = await fetch(nextUrl);
            let data = await response.json();
            allCharacters = allCharacters.concat(data.results);
            nextUrl = data.info.next;
        } while (nextUrl);

        return allCharacters.sort((a, b) => (a.name > b.name ? 1 : -1));
    }

    async function renderCountries(page = currentPage) {
        currentPage = page;
        container.innerHTML = "";

        const offset = page * limit;
        const paginatedData = result.slice(offset, offset + limit);

        paginatedData.forEach(element => {
            let divCharacter = document.createElement("div");
            divCharacter.classList.add("col-md-3");
            divCharacter.innerHTML = `
                <div class="card h-100" style="width: 18rem;">
                    <img src="${element.image}" class="card-img-top country-img" style="height: 200px; object-fit: cover;" alt="${element.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${element.name}</h5>
                        <button class="btn btn-primary mt-auto" ">Details</button>
                    </div>
                </div>
            `;
            divCharacter.querySelector("button").addEventListener("click", () => renderCountryDetails(element));
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
        const detailsDiv = document.createElement("div");
        detailsDiv.innerHTML = `
            <div class="card h-100" style="width: 18rem;">
                <img src="${element.image}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${element.name}">
                <div class="card-body d-flex flex-column">
                    <h4 class="card-title">${element.name}</h4>
                    <h6 class="card-text">Status: ${element.status}</h6>
                    <h6 class="card-text">Species: ${element.species}</h6>
                    <h6 class="card-text">Gender: ${element.gender}</h6>
                    <h6 class="card-text">Origin: ${element.origin.name}</h6>
                    <button id="return" class="btn btn-primary mt-3">Return</button>
                </div>
            </div>
        `;

        detailsDiv.querySelector("#return").addEventListener("click", () => renderCountries(currentPage));
        container.appendChild(detailsDiv);
    }

    renderCountries(currentPage);
});