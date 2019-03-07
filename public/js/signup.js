$(document).ready(function () {
    let signupForm = $("form.signup");
    let nameInput = $("input#name");
    let emailInput = $("input#email");
    let passwordInput = $("input#password");
    let confirmPassword = $("input#password2");

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
        signupUser(userData.name, userData.email, userData.password, userData.confirmPass);
        nameInput.val("");
        emailInput.val("");
        passwordInput.val("");
        confirmPassword.val("");
    });

    let signupUser = (name, email, password, confirmPass) => {
        if (name || email || password || confirmPass) {
            $.ajax({
                method: "POST",
                url: "/signup"
            }).then(function (results) {
                window.location.href = "/";
            })
            // "/signup", {
            // name: name,
            // email: email,
            // password: password,
            // confirmPass: confirmPass
        }
    }
});