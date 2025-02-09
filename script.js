
document.addEventListener("DOMContentLoaded", function() {
    var contactForm = document.getElementById('contact-form');
    document.getElementById("btnSubmit").addEventListener("click", function() {
        console.log("Button clicked !");
    });
});


//   /!\ NOT WORKING /!\
//NEEDS A FRAMEWORK TO DO SO
// Direct Email sending

document.getElementById('contactform').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevents the default form submission

    const title = document.getElementById('title').value;
    const email = document.getElementById('email').value;
    const content = document.getElementById('content').value;

    // Check the content in the console
    console.log("Title: ", title);
    console.log("Email: ", email);
    console.log("Content: ", content);

    // validation
    if (title && email && content) {
        alert("Message Sent!");
        // Xlear the form
        document.getElementById('contact-form').reset();
    } else {
        alert("Please fill in all fields!");
    }
});
