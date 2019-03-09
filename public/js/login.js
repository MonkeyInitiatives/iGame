$(document).ready(function () {

    // Get references to page elements
    let loginForm = $("form.login");
    let emailInput = $("input#email");
    let passwordInput = $("input#password");

    // Validate for email and password when form is submitted
    loginForm.on("submit", (event) => {
        event.preventDefault();
        var userData = {
            email: emailInput.val().trim(),
            password: passwordInput.val().trim()
        };

        if (!userData.email || !userData.password) {
            //console.log("I'm here");
            return;
        }

        // If we have an email and password we run the loginUser function and clear the form
        loginUser(userData.email, userData.password);
        emailInput.val("");
        passwordInput.val("");
    });

    let loginUser = (email, password) => {
        if (name || password) {
            $.post("/api/login", {
                email: email,
                password: password
            }).then(function (results) {
                // console.log(results);
                window.location.replace("/library");
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