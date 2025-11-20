const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: []
};

checkLogged();

function checkLogged() {
    if(session) {
        saveSession(sessionStorage.getItem("logged"), session);
        logged = session;
    }

    if(!logged) {
        window.location.href = 'index.html';
    }

    const dataUser = localStorage.getItem(logged);
    
    if(dataUser) {
        data = JSON.parse(dataUser);
    }
};

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = 'index.html';
}

document.getElementById("button-logout").addEventListener("click", logout);

document.getElementById("transaction-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const value = parseFloat(document.getElementById("value-input").value);
    const type = document.querySelector('input[name="type-input"]:checked').value;
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;

    data.transactions.unshift({
        value,
        type,
        description,
        date
    });

    saveData(data);
    e.target.reset();
    myModal.hide();
    alert("Lançamento adicionado com sucesso!");
});

function saveData(data) {
    localStorage.setItem(logged, JSON.stringify(data));
}