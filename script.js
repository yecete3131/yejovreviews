const params = new URLSearchParams(window.location.search);

const business = params.get("business") || "demo";


fetch("./businesses.json")
.then(response => response.json())
.then(data => {

    console.log(data);

    const b = data[business];


    document.getElementById("businessName").innerText = b.name;

    document.getElementById("tagline").innerText = b.tagline;

    document.getElementById("google").href = b.google;

    document.getElementById("instagram").href = b.instagram;

    document.getElementById("facebook").href = b.facebook;

    document.getElementById("website").href = b.website;

    document.getElementById("whatsapp").href = b.whatsapp;


})
.catch(error => {

document.getElementById("businessName").innerText =
"ERROR";

document.getElementById("tagline").innerText =
error;

});
