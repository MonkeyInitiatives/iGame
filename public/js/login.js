$(document).ready(function () {
    let loginForm = $("form.login");
    let emailInput = $("input#email");
    let passwordInput = $("input#password");

    // Validate for email and password when form is submitted
    loginForm.on("submit", (event) => {
        event.preventDefault();
        console.log("CLICKED SUBMIT")
        let userData = {
            email: emailInput.val().trim(),
            password: passwordInput.val().trim()
        };
        if (!userData.emaill || !userData.password) {
            console.log("Incorrect email and password");
            return;
        }
        loginUser(userData.email, userData.password);
        emailInput.val("");
        passwordInput.val("");
    });

    let loginUser = (email, password) => {
        if (name || password) {
            $.ajax({
                method: "POST",
                url: "/login"
            }).then(function (results) {
                window.location.href = "/api/games";
            })
            // "/signup", {
            // name: name,
            // email: email,
            // password: password,
            // confirmPass: confirmPass
        }

        // $.ajax({
        //     method: "POST",
        //     url: "/login"
        // }).then(function(results) {
        //     window.location.href = "/api/games";
        // });

        // $.post("/login", {
        //     email: email,
        //     password: password
        // }).then((data => {
        //     window.location.replace(data);
        // }))
    }
});