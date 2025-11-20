const myModal = new bootstrap.Modal(document.getElementById("register-modal"));
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

checkLogged();

document.getElementById("create-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email-create-input").value;
    const password = document.getElementById("password-create-input").value;

    console.log(email, password);

    if(email.length < 5) {
        alert("Por favor, insira um email válido com pelo menos 5 caracteres.");
        return;
    };

    if(password.length < 4) {
        alert('A senha deve ter pelo menos 4 caracteres.');
        return;
    };

    saveAccount({ 
        login: email,
        password: password,
        transactions: []
    });
    
    myModal.hide();

    alert('Conta criada com sucesso!');
});

function checkLogged() {
    if(session) {
        saveSession(sessionStorage.getItem("logged"), session);
        logged = session;
    }

    if(logged) {
        saveSession(logged, session);
        window.location.href = 'home.html';
    }
};

function saveAccount(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
};

document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    const sessionCheck = document.getElementById("session-check").checked;
    const account = getAccount(email);


    if(!account) {
        alert('Ops! Verifique o usuário ou a senha.');
        return;
    }

    if(account) {

        if(account.password !== password) {
            alert('Ops! Verifique o usuário ou a senha.');
            return;
        }

        saveSession(email, sessionCheck);

        window.location.href = 'home.html';
    }

});

function saveSession(data, saveSession) {
    if(saveSession) {
        localStorage.setItem("session", data);
    }

    sessionStorage.setItem("logged", data);
};

function getAccount(data) {
    const accountData = localStorage.getItem(data);

    if(accountData) {
        return JSON.parse(accountData);
    }
    return "";
};