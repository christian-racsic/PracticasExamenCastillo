document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector("#container");

    /* async function fetchAPI() {
        let response = await fetch(
            "https://dragonball-api.com/api/characters"
        );
        let data = await response.json();
        return data;
    } */



        const limit = 20;
        let currentPage = 0;
        let result = await fetchAPI();


    async function fetchAPI() {
        let allCharacters = [];
        let response;
        let nextUrl = "https://dragonball-api.com/api/characters";

        do {
            response = await fetch(nextUrl);
            let data = await response.json();
            allCharacters = allCharacters.concat(data.items);
            nextUrl = data.links.next;
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
                <div class="card h-400" style="width: 18rem;">
                    <img src="${element.image}" class="card-img-top country-img" style="height: 500px; object-fit: cover;" alt="${element.name}">
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










    
    
    renderCountries(currentPage);
});