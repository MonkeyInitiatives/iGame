$(document).ready(function () {
    let signupForm = $("form.signup");
    let nameInput = $("input#name");
    let emailInput = $("input#email");
    let passwordInput = $("input#password");
    let confirmPassword = $("input#password2");
    console.log("register user clicked");
    signupForm.on("submit", (event) => {
        console.log("BUTTON CLICKED")
        event.preventDefault();
        let userData = {
            name: nameInput.val().trim(),
            email: emailInput.val().trim(),
            password: passwordInput.val().trim(),
            confirmPass: confirmPassword.val().trim()
        };
        if (!userData.name || !userData.email || !userData.password || !userData.confirmPass) {
            return;
        }
        console.log(userData);
        signupUser(userData.name, userData.email, userData.password, userData.confirmPass);
        nameInput.val("");
        emailInput.val("");
        passwordInput.val("");
        confirmPassword.val("");
    });

    let signupUser = (name, email, password, confirmPass) => {
        if (name || email || password || confirmPass) {
            $.post("/signup", {
                name: name,
                email: email,
                password: password
            }).then(function (results) {
                console.log(results);
                // window.location.href = "/";
            })
            // "/signup", {
            // name: name,
            // email: email,
            // password: password,
            // confirmPass: confirmPass
        }
    }
});