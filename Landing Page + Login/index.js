import { Email } from "./smtp.js";

document.getElementById('form').addEventListener('submit', handleSubmit);

//function to send email with contact us details for action
function handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const mail = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "contactgradeygradetracker@gmail.com",
        Password: "B74A6FF7E93559D0828DF7FE8C49EC3B4E55",
        To: "contactgradeygradetracker@gmail.com",
        From: "contactgradeygradetracker@gmail.com",
        Subject: "Message received from contact form on Gradey-Grade App",
        Body: `Name: ${name}<br>
                Email: ${mail}<br>
                Subject: ${subject}<br>
                Message: ${message}
        `,
    })
        .then(
            alert("Message sent successfully"),
            location.reload()
        )
        .catch((error) => {
            console.log(error);
        });
}



