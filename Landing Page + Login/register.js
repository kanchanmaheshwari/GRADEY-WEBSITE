import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

import { auth, ref } from "../firebase.js"

document.getElementById('form').addEventListener('submit', handleSignUp);

export function handleSignUp(e) {
    e.preventDefault();

    RemoveAllErrorMessage();

    var RegiEmailAddres = document.getElementById('email').value;
    var RegiPassword = document.getElementById('password').value;
    var RegiConfirmPassword = document.getElementById('confirmPassword').value;

    var PasswordValidationMessage;
    var ConfirmPasswordMessage;
    var emailValidationMessage;

    emailValidationMessage = isValidEmail(RegiEmailAddres);
    if (emailValidationMessage != "valid") {
        ShowErrorMessage('email', emailValidationMessage);
        return false;
    }

    PasswordValidationMessage = isValidPassword(RegiPassword);
    if (PasswordValidationMessage != "valid") {
        ShowErrorMessage('password', PasswordValidationMessage);
        return false;
    }

    ConfirmPasswordMessage = isValidPassword(RegiConfirmPassword);
    if (ConfirmPasswordMessage != "valid") {
        ShowErrorMessage('confirmPassword', ConfirmPasswordMessage);
        return false;
    }

    if (RegiPassword != RegiConfirmPassword) {
        ShowErrorMessage('confirmPassword', "**Password doesn't match");
        return false;
    }

    function RemoveAllErrorMessage() {

        var allErrorMessage = document.getElementsByClassName('error-message');
        var allErrorFiled = document.getElementsByClassName('error-input');
        var i;

        for (i = (allErrorMessage.length - 1); i >= 0; i--) {
            allErrorMessage[i].remove();
        }

        for (i = (allErrorFiled.length - 1); i >= 0; i--) {
            allErrorFiled[i].classList.remove('error-input');
        }
    }

    function ShowErrorMessage(InputBoxID, Message) {
        const InputBox = document.getElementById(InputBoxID);
        InputBox.classList.add('error-input');
        InputBox.focus();

        const ErrorMessageElement = document.createElement("p");
        ErrorMessageElement.innerHTML = Message;
        ErrorMessageElement.classList.add('error-message');
        ErrorMessageElement.style.color = 'red';
        ErrorMessageElement.setAttribute("id", InputBoxID + '-error');

        InputBox.parentNode.insertBefore(ErrorMessageElement, InputBox.nextSibling);

    }

    function isValidEmail(email) {

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email == "") {
            return "**Fill the email Please!";
        }

        if (emailRegex.test(email) == false) {
            return "**Please enter a valid email address!";
        }

        return "valid";
    }

    function isValidPassword(password) {

        if (password == "") {
            return "Fill the Password Please!"
        }

        if (password.length < 6) {
            return "**Password Length must be at least 6 Character";
        }

        return "valid";
    }

    firebase.auth().fetchSignInMethodsForEmail(RegiEmailAddres)
        .then(signInMethods => {
            if (signInMethods.length === 0) {
                // user doesn't exist  
                // create an account
                let userID = createUserWithEmailAndPassword(auth, email, password)
                    .then((credential) => {

                        // authenticated and logged in
                        const userId = credential.user.uid;
                        // save into db
                        ref.push(userId)
                            .then(() => {
                                var params = new URLSearchParams();
                                params.append("userId", userId);
                                //read user data
                                // set(ref(db, 'users/' + userId))
                                var url = "../course.html?" + params.toString();
                                //console.log(url)
                                location.href = url;
                            })

                    })
            }
            else {
                // throw an error that email already exist
                alert("User already exists")
            }
        })
        .catch((error) => {
            console.log(error);
        });
}


