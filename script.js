const params =
new URLSearchParams(window.location.search);


const business =
params.get("business") || "demo";


fetch("businesses.json")

.then(response=>response.json())

.then(data=>{


const b=data[business];


document.getElementById("businessName").innerHTML=b.name;


document.getElementById("tagline").innerHTML=b.tagline;


document.getElementById("logo").src=b.logo;


document.getElementById("google").href=b.google;


document.getElementById("instagram").href=b.instagram;


document.getElementById("facebook").href=b.facebook;


document.getElementById("website").href=b.website;


document.getElementById("whatsapp").href=b.whatsapp;



});
const params =
new URLSearchParams(window.location.search);


const business =
params.get("business") || "demo";


fetch("businesses.json")

.then(res => res.json())

.then(data => {


const b = data[business];


document.getElementById("businessName").innerText = b.name;

document.getElementById("tagline").innerText = b.tagline;


document.getElementById("google").href = b.google;

document.getElementById("instagram").href = b.instagram;

document.getElementById("facebook").href = b.facebook;

document.getElementById("website").href = b.website;

document.getElementById("whatsapp").href = b.whatsapp;


})
.catch(error=>{

document.getElementById("businessName").innerText="YeJovReviews";

document.getElementById("tagline").innerText="Setup error";

});
