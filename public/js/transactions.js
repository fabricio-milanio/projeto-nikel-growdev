const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: []
};
let editingIndex = -1;

document.getElementById("button-logout").addEventListener("click", logout);

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

    getTransactions();
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

    getTransactions();
    
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
        getTransactions();
    }
}

function getTransactions() {
    const transactions = data.transactions;
    let transactionsHtml = ``;

    if(transactions.length) {
        transactions.forEach((item) => {
            let type = "Entrada";
            if(item.type === "2") {
                type = "Saída";
            }

            let originalIndex = data.transactions.indexOf(item);

            transactionsHtml += `
                <tr>
                    <th scope="row">${item.date}</th>
                    <td>R$ ${item.value.toFixed(2)}</td>
                    <td>${type}</td>
                    <td>${item.description}</td>
                    <td>
                        <button class="button-icon" onclick="editItem(${originalIndex})">
                            <i class="bi bi-pencil-fill text-warning"></i>
                        </button>
                        <button class="button-icon" onclick="removeItem(${originalIndex})">
                            <i class="bi bi-trash-fill text-danger"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } else {
        transactionsHtml = `
            <tr>
                <td colspan="5" class="text-center">Nenhuma transação cadastrada.</td>
            </tr>
        `;
    }

    document.getElementById("transactions-list").innerHTML = transactionsHtml;
}