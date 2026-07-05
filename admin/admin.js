import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwJiAAbzxFikzhwRDiVLt6vx0RSCiudcE",
  authDomain: "yejovreviews.firebaseapp.com",
  projectId: "yejovreviews",
  storageBucket: "yejovreviews.firebasestorage.app",
  messagingSenderId: "967210094973",
  appId: "1:967210094973:web:d4695c1634399d8efffc14",
  measurementId: "G-8L8HJ9HJ3L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userEmail = document.getElementById("userEmail");
const statusText = document.getElementById("status");
const saveBusinessBtn = document.getElementById("saveBusinessBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    statusText.innerText = "Logging in...";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (error) {
      statusText.innerText = error.message;
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

if (saveBusinessBtn) {
  saveBusinessBtn.addEventListener("click", async () => {
    const businessId = document.getElementById("businessId").value
      .trim()
      .toLowerCase()
      .replaceAll(" ", "-");

    if (!businessId) {
      statusText.innerText = "Business ID is required.";
      return;
    }

    const businessData = {
      name: document.getElementById("name").value.trim(),
      tagline: document.getElementById("tagline").value.trim(),
      google: document.getElementById("google").value.trim(),
      instagram: document.getElementById("instagram").value.trim(),
      facebook: document.getElementById("facebook").value.trim(),
      website: document.getElementById("website").value.trim(),
      whatsapp: document.getElementById("whatsapp").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      location: document.getElementById("location").value.trim(),
      logo: document.getElementById("logo").value.trim() || "assets/logo.png",
      createdAt: new Date().toISOString()
    };

    statusText.innerText = "Saving...";

    try {
      await setDoc(doc(db, "businesses", businessId), businessData);

      const landingUrl =
        "https://yecete3131.github.io/yejovreviews/?business=" + businessId;

      statusText.innerHTML =
        "Saved successfully.<br><br>" +
        "<a target='_blank' href='" + landingUrl + "'>" +
        landingUrl +
        "</a>";

    } catch (error) {
      statusText.innerText = error.message;
    }
  });
}

onAuthStateChanged(auth, (user) => {
  const page = window.location.pathname;

  if (page.includes("dashboard.html") || page.includes("add-business.html")) {
    if (user) {
      if (userEmail) {
        userEmail.innerText = "Logged in as: " + user.email;
      }
    } else {
      window.location.href = "login.html";
    }
  }
});
