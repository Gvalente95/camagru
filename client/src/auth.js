async function update_auth_api() {
    const res = await fetch(`${API}/me`);
    const is_authenticated = res.ok;

    let user = null;

    if (is_authenticated) {
        user = await res.json();
        CURRENT_USER = new User(user.name, user.email);
    }

    document.getElementById("login-button").hidden = is_authenticated;
    document.getElementById("signup-button").hidden = is_authenticated;
    document.getElementById("logout-button").hidden = !is_authenticated;
}

async function signup(name, email, password){
    const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name, email, password
        })
    });
}

async function login(name, password) {
    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name, password
        })
    });
}

async function logout() {
    CURRENT_USER = null;
}


async function patch_user(name, email, password) {
    
}