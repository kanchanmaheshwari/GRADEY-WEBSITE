import { auth, ref, sendPasswordResetEmail } from "./firebase.js"
import { Reset } from "./Landing Page + Login/resetPassword.js"


const userEmail = document.getElementById('email')
const userPassword = document.getElementById('password')
const errorMessage = document.createElement('p')
errorMessage.classList.add("text-danger", "mt-2");


userEmail.addEventListener('input', () => {
  errorMessage.remove()
})
// focus


document.getElementById('form').addEventListener('submit', handleLogin);

export function handleLogin(e) {
  e.preventDefault();

  const email = userEmail.value;
  const password = userPassword.value;
  console.log(email)
  console.log(password)

  if (email === "") {
    console.log("no email")
    errorMessage.innerHTML = "Email id is required"
    const doc = document.getElementById("email-validate").appendChild(errorMessage)
    console.log(doc)
    return

  }
  if (password === "") {
    console.log("no pass")
    errorMessage.innerHTML = "Password is required"
    const doc = document.getElementById("pswd").appendChild(errorMessage)
    return

  }


  let userID = auth.signInWithEmailAndPassword(email, password)
    .then((credential) => {
      let userId = credential.user.uid;
      console.log(userId)
      console.log("User has successfully logged");
      // (A) VARIABLE TO PASS is userId
      // (B) URL PARAMETERS
      var params = new URLSearchParams();
      params.append("userId", userId);
      // (C) GO!
      var url = "../course.html?" + params.toString();
      console.log(url)
      location.href = url;

    })
    .catch((err) => {
      // Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).
      console.log(err.message)
      console.log(err.code)

      //validation if user doesnt exist
      if (err.code === "auth/user-not-found") {
        errorMessage.innerHTML = "User with this email id doesn't exist"
        const doc = document.getElementById("email-validate").appendChild(errorMessage)
      }
      if (err.code === "auth/wrong-password") {
        errorMessage.innerHTML = "Incorrect password"
        const doc = document.getElementById("pswd").appendChild(errorMessage)
      }

    });
  return userID// pormise{}
}


// FORGOTTEN PASSWORD SECTION
document.querySelector(`.forgot-password-link`).addEventListener('click', handleReset)

function handleReset () {

  Reset.open({
    onok: () => resetPassword(),
    oncancel: () => console.log('cancel')
  })

  // reset password function 
  function resetPassword() {
    const email = document.querySelector("#emailInput").value
    console.log(email)

    if (email != "") {
      auth.sendPasswordResetEmail(email)
        .then(() => {
          window.alert("Password reset email sent!")
        })
        .catch((error) => {
          const errorMessage = error.message;
          window.alert(errorMessage)
          handleReset()
        });
    } else {
      window.alert("Please write your email first")
      handleReset()
    }

  }

}







