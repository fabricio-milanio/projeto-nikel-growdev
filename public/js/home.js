const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: []
};
let editingIndex = -1;

document.getElementById("button-logout").addEventListener("click", logout);
document.getElementById("transaction-button").addEventListener("click", function() {
    window.location.href = 'transactions.html';
});

document.getElementById("new-transaction-button").addEventListener("click", function() {
    editingIndex = -1;
    document.getElementById("transaction-form").reset();
    document.getElementById("exampleModalLabel").innerText = "Adicionar Transação";
});

checkLogged();

function checkLogged() {
    if(session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if(!logged) {
        window.location.href = 'index.html';
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if(dataUser) {
        data = JSON.parse(dataUser);
    }

    getCashIn();
    getCashOut();
    getTotal();
    checkShowAllButton();
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = 'index.html';
}

document.getElementById("transaction-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;

    const newTransaction = {
        value: value,
        type: type,
        description: description,
        date: date
    };

    if(editingIndex >= 0) {
        data.transactions[editingIndex] = newTransaction;
        editingIndex = -1;
    } else {
        data.transactions.unshift(newTransaction);
    }

    saveData(data);
    e.target.reset();
    myModal.hide();

    getCashIn();
    getCashOut();
    getTotal();
    checkShowAllButton();
    
    alert("Salvo com sucesso.");
});

function saveData(data) {
    localStorage.setItem(logged, JSON.stringify(data));
}

function editItem(index) {
    editingIndex = index;
    const item = data.transactions[index];

    document.getElementById("value-input").value = item.value;
    document.getElementById("description-input").value = item.description;
    document.getElementById("date-input").value = item.date;
    
    if (item.type === '1') {
        document.getElementById("inlineRadio1").checked = true;
    } else {
        document.getElementById("inlineRadio2").checked = true;
    }

    document.getElementById("exampleModalLabel").innerText = "Editar Transação";
    myModal.show();
}

function removeItem(index) {
    const confirmDelete = confirm("Tem certeza que deseja excluir?");
    if (confirmDelete) {
        data.transactions.splice(index, 1);
        saveData(data);
        getCashIn();
        getCashOut();
        getTotal();
        checkShowAllButton();
    }
}

function checkShowAllButton() {
    const showAllBtn = document.getElementById("transaction-button");
    
    if (data.transactions.length === 0) {
        showAllBtn.style.display = "none";
    } else {
        showAllBtn.style.display = "inline-block";
    }
}

function getCashIn() {
    const transactions = data.transactions;
    const cashIn = transactions.filter((item) => item.type === "1");

    if(cashIn.length) {
        let cashInHtml = ``;
        let limit = 0;

        if(cashIn.length > 5) {
            limit = 5;
        } else {
            limit = cashIn.length;
        }

        for (let index = 0; index < limit; index++) {
            let originalIndex = data.transactions.indexOf(cashIn[index]);
            
            cashInHtml += `
            <div class="row mb-4">
                <div class="col-12">
                    <h3 class="fs-2">R$ ${cashIn[index].value.toFixed(2)}</h3>
                    <div class="container p-0">
                        <div class="row">
                            <div class="col-12 col-md-7">
                                <p>${cashIn[index].description}</p>
                            </div>
                            <div class="col-12 col-md-3 d-flex justify-content-end align-items-center">
                                ${cashIn[index].date}
                            </div>
                            <div class="col-12 col-md-2 d-flex justify-content-end align-items-center gap-2">
                                <button class="button-icon" onclick="editItem(${originalIndex})">
                                    <i class="bi bi-pencil-fill text-warning"></i>
                                </button>
                                <button class="button-icon" onclick="removeItem(${originalIndex})">
                                    <i class="bi bi-trash-fill text-danger"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            `
        }
        document.getElementById("cash-in-list").innerHTML = cashInHtml;
    } else {
        document.getElementById("cash-in-list").innerHTML = `<p class="mb-3 text-muted">Nenhuma entrada cadastrada até o momento.</p>`;
    }
}

function getCashOut() {
    const transactions = data.transactions;
    const cashOut = transactions.filter((item) => item.type === "2");

    if(cashOut.length) {
        let cashOutHtml = ``;
        let limit = 0;

        if(cashOut.length > 5) {
            limit = 5;
        } else {
            limit = cashOut.length;
        }

        for (let index = 0; index < limit; index++) {
            let originalIndex = data.transactions.indexOf(cashOut[index]);

            cashOutHtml += `
            <div class="row mb-4">
                <div class="col-12">
                    <h3 class="fs-2">R$ ${cashOut[index].value.toFixed(2)}</h3>
                    <div class="container p-0">
                        <div class="row">
                            <div class="col-12 col-md-7">
                                <p>${cashOut[index].description}</p>
                            </div>
                            <div class="col-12 col-md-3 d-flex justify-content-end align-items-center">
                                ${cashOut[index].date}
                            </div>
                            <div class="col-12 col-md-2 d-flex justify-content-end align-items-center gap-2">
                                <button class="button-icon" onclick="editItem(${originalIndex})">
                                    <i class="bi bi-pencil-fill text-warning"></i>
                                </button>
                                <button class="button-icon" onclick="removeItem(${originalIndex})">
                                    <i class="bi bi-trash-fill text-danger"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            `
        }
        document.getElementById("cash-out-list").innerHTML = cashOutHtml;
    } else {
        document.getElementById("cash-out-list").innerHTML = `<p class="mb-3 text-muted">Nenhuma saída cadastrada até o momento.</p>`;
    }
}

function getTotal() {
    const transactions = data.transactions;
    let total = 0;

    transactions.forEach((item) => {
        if(item.type === "1") {
            total += item.value;
        } else {
            total -= item.value;
        }
    });

    document.getElementById("total").innerHTML = `R$ ${total.toFixed(2)}`;
}