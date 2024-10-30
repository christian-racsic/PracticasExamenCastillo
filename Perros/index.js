document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector("#container");
    const limit = 10;
    let currentPage = 0;

    async function fetchAPI() {
        let response = await fetch("https://dog.ceo/api/breeds/list/all");
        let data = await response.json();
        return data;
    }

    async function fetchAPImg(breed) {
        let response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
        let data = await response.json();
        return data;
    }
    
    const result = await fetchAPI();
    /* const breeds = Object.keys(result.message); */
    const breeds = Object.entries(result.message); // Obtener array de [raza, subrazas] para la paginación

    async function renderPerros(page = currentPage) {
        currentPage = page;
        container.innerHTML = "";

        const offset = page * limit;
        const paginatedData = breeds.slice(offset, offset + limit);

        paginatedData.forEach(async ([breed, subBreeds]) => {
            const resultImg = await fetchAPImg(breed);
            let divCharacter = document.createElement("div");
            divCharacter.classList.add("col");
            divCharacter.innerHTML = `
                <div class="card h-100" style="width: 18rem;">
                    <div class="card-body">
                        <img src="${resultImg.message}" class="card-img-top country-img" style="height: 400px; object-fit: cover;" alt="${breed}">
                        <h5 class="card-title">${breed}</h5>
                        ${subBreeds.length > 0 ? `<p class="card-text">Sub-razas: ${subBreeds.join(", ")}</p>` : ""}
                        <button href="#" id="details" class="btn btn-primary">Details</button>
                    </div>
                </div>
            `;

            container.appendChild(divCharacter);
        });

        generatePaginationButtons({ offset, limit, total: breeds.length });
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
            button.classList.add("btn", "btn-primary", "me-1");
            button.dataset.page = i;
            button.innerText = i === -1 ? "..." : i + 1;

            if (i === currentPage) button.classList.add("active");
            if (i === -1) button.disabled = true;

            button.addEventListener("click", () => renderPerros(i));
            paginationContainer.appendChild(button);
        });
    }

    renderPerros(currentPage);
});