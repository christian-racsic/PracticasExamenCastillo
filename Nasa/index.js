document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector("#container");

    async function fetchAPI() {
        let response = await fetch(
            "https://api.nasa.gov/planetary/apod?api_key=h0SWYsg0XxuoPi7QSH4P27XzZTy9hpATOUkt4WZc"
        );
        let data = await response.json();
        return data;
    }

    async function fetchAPISelec(formattedDate) {
        let response = await fetch(
            `https://api.nasa.gov/planetary/apod?date=${formattedDate}&api_key=h0SWYsg0XxuoPi7QSH4P27XzZTy9hpATOUkt4WZc`
        );
        let data = await response.json();
        return data;
    }

    async function getAndRenderImgOfTheDay() {
        const result = await fetchAPI();

        let divCharacter = document.createElement("div");
        divCharacter.classList.add("col");
        divCharacter.innerHTML = `
            <div class="card" style="width: 18rem;">
                <img src="${result.url}" class="card-img-top" alt="NASA Image">
                <div class="card-body">
                    <h5 class="card-title">${result.title}</h5>
                    <p class="card-text">${result.explanation}</p>
                    <button href="#" class="btn btn-primary">Details</button>
                </div>
            </div>
            <h2>Selecciona una fecha</h2>
            <input type="date" id="datePicker">
            <p id="selectedDate"></p>
        `;

        container.appendChild(divCharacter);

        const datePicker = divCharacter.querySelector("#datePicker");
        datePicker.addEventListener("change", () => {
            const date = new Date(datePicker.value);
            const formattedDate = date.toISOString().split("T")[0];
            getAndRenderSelectedImg(formattedDate);
        });
    }
    
    async function getAndRenderSelectedImg(formattedDate) {
        const result = await fetchAPISelec(formattedDate);

        container.innerHTML = `
            <div class="card" style="width: 18rem;">
                <img src="${result.url}" class="card-img-top" alt="NASA Image">
                <div class="card-body">
                    <h5 class="card-title">${result.title}</h5>
                    <p class="card-text">${result.explanation}</p>
                    <button href="#" class="btn btn-primary">Details</button>
                </div>
            </div>
        `;
    }

    getAndRenderImgOfTheDay();
});