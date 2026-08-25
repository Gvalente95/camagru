function init(){
    update_auth_api();
}

function handleSignup(){
    console.log("Signing up!");

    signup("George", "george@gmail.com", "pass123");
}

function handleLogin(){
    console.log("Login inn!");
    login("George", "pass123");
}

function handleLogout(){
    console.log("Loging out!");
    logout();
}
