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
        container.innerHTML = "";
        const result = await fetchAPI();

        let divCharacter = document.createElement("div");
        divCharacter.classList.add("col");
        divCharacter.innerHTML = `
            <div class="card" style="width: 70rem;">
                <img src="${result.hdurl}" class="card-img-top" alt="NASA Image">
                <div class="card-body">
                    <h5 class="card-title">${result.title}</h5>
                    <button href="#" id="details" class="btn btn-primary">Details</button>
                </div>
            </div>
            <div class="container mt-4">
    <h2 class="mb-3">Selecciona una fecha para ver la foto </h2>
    <div class="form-group">
        <input type="date" id="datePicker" class="form-control mb-3" style="max-width: 300px;">
        <p id="selectedDate" class="text-muted"></p>
    </div>
</div>
        `;

        container.appendChild(divCharacter);

        divCharacter.querySelector("#details").addEventListener("click", () => {
            
            detailsDay(result);
        });


        const datePicker = divCharacter.querySelector("#datePicker");
        datePicker.addEventListener("change", () => {
            const date = new Date(datePicker.value);
            const formattedDate = date.toISOString().split("T")[0];
            getAndRenderSelectedImg(formattedDate);
        });
    }

    function detailsDay(result){
        container.innerHTML = "";
        let detailsDiv = document.createElement("div");
        detailsDiv.classList.add("col");

        detailsDiv.innerHTML = `
            <div class="card" style="width: 70rem;">
                <img src="${result.hdurl}" class="card-img-top" alt="NASA Image">
                <div class="card-body">
                    <h5 class="card-title">${result.title}</h5>
                    <p class="card-text">${result.date}</p>
                    <p class="card-text">${result.explanation}</p>
                    <button href="#" id="principal" class="btn btn-primary">Details</button>
                </div>
            </div>
            <div class="container mt-4">
    <h2 class="mb-3">Selecciona una fecha para ver la foto </h2>
    <div class="form-group">
        <input type="date" id="datePicker" class="form-control mb-3" style="max-width: 300px;">
        <p id="selectedDate" class="text-muted"></p>
    </div>
</div>
        `;

        container.appendChild(detailsDiv);

        detailsDiv.querySelector("#principal").addEventListener("click", () => {
            
            getAndRenderImgOfTheDay();
        });
        
    }

    async function getAndRenderSelectedImg(formattedDate) {
        const result = await fetchAPISelec(formattedDate);

        container.innerHTML = `
            <div class="card" style="width: 70rem;">
                <img src="${result.hdurl}" class="card-img-top" alt="NASA Image">
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