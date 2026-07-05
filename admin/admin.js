import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

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

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userEmail = document.getElementById("userEmail");
const statusText = document.getElementById("status");

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

onAuthStateChanged(auth, (user) => {
  const page = window.location.pathname;

  if (page.includes("dashboard.html")) {
    if (user) {
      userEmail.innerText = "Logged in as: " + user.email;
    } else {
      window.location.href = "login.html";
    }
  }
});
