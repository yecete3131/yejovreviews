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
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs
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

const BASE_URL = "https://yejovreview.com/?business=";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userEmail = document.getElementById("userEmail");
const statusText = document.getElementById("status");
const saveBusinessBtn = document.getElementById("saveBusinessBtn");
const updateBusinessBtn = document.getElementById("updateBusinessBtn");
const businessList = document.getElementById("businessList");

const params = new URLSearchParams(window.location.search);
const editId = params.get("id");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      statusText.innerText = "Email and password are required.";
      return;
    }

    statusText.innerText = "Logging in...";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html?v=11";
    } catch (error) {
      statusText.innerText = error.message;
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html?v=11";
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

    const businessData = collectBusinessFormData();
    businessData.createdAt = new Date().toISOString();

    statusText.innerText = "Saving...";

    try {
      await setDoc(doc(db, "businesses", businessId), businessData);

      const landingUrl = BASE_URL + businessId;

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

if (updateBusinessBtn) {
  updateBusinessBtn.addEventListener("click", async () => {
    if (!editId) {
      statusText.innerText = "Missing business ID.";
      return;
    }

    const businessData = collectBusinessFormData();
    businessData.updatedAt = new Date().toISOString();

    statusText.innerText = "Updating...";

    try {
      await setDoc(doc(db, "businesses", editId), businessData, { merge: true });

      const landingUrl = BASE_URL + editId;

      statusText.innerHTML =
        "Updated successfully.<br><br>" +
        "<a target='_blank' href='" + landingUrl + "'>" +
        landingUrl +
        "</a>";

    } catch (error) {
      statusText.innerText = error.message;
    }
  });
}

function collectBusinessFormData() {
  return {
    name: document.getElementById("name").value.trim(),
    tagline: document.getElementById("tagline").value.trim(),
    google: document.getElementById("google").value.trim(),
    instagram: document.getElementById("instagram").value.trim(),
    facebook: document.getElementById("facebook").value.trim(),
    website: document.getElementById("website").value.trim(),
    whatsapp: document.getElementById("whatsapp").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    location: document.getElementById("location").value.trim(),
    logo: document.getElementById("logo").value.trim() || "assets/logo.png"
  };
}

async function loadBusinesses() {
  if (!businessList) return;

  businessList.innerHTML = "Loading businesses...";

  try {
    const querySnapshot = await getDocs(collection(db, "businesses"));

    businessList.innerHTML = "";

    for (const docSnap of querySnapshot.docs) {
      const id = docSnap.id;
      const data = docSnap.data();

      const landingUrl = BASE_URL + id;

      let analytics = {};

      try {
        const analyticsSnap = await getDoc(doc(db, "analytics", id));
        if (analyticsSnap.exists()) {
          analytics = analyticsSnap.data();
        }
      } catch (error) {
        console.log("Analytics load error:", error);
      }

      const item = document.createElement("div");
      item.className = "business-item";

      item.innerHTML = `
        <strong>${data.name || id}</strong>
        <p class="business-id">Business ID: ${id}</p>

        <div class="analytics-box">
          <div>
            <span>${analytics.pageViews || 0}</span>
            <small>Views</small>
          </div>

          <div>
            <span>${analytics.googleClicks || 0}</span>
            <small>Google</small>
          </div>

          <div>
            <span>${analytics.instagramClicks || 0}</span>
            <small>Instagram</small>
          </div>

          <div>
            <span>${analytics.whatsappClicks || 0}</span>
            <small>WhatsApp</small>
          </div>

          <div>
            <span>${analytics.phoneClicks || 0}</span>
            <small>Calls</small>
          </div>

          <div>
            <span>${analytics.locationClicks || 0}</span>
            <small>Directions</small>
          </div>
        </div>

        <input value="${landingUrl}" readonly>

        <button class="copy-btn" data-url="${landingUrl}">
          Copy Link
        </button>

        <a target="_blank" href="${landingUrl}">
          Open Landing Page
        </a>

        <a href="edit-business.html?id=${id}">
          Edit Business
        </a>

        <button class="delete-btn" data-id="${id}">
          Delete Business
        </button>
      `;

      businessList.appendChild(item);
    }

    const copyButtons = document.querySelectorAll(".copy-btn");

    copyButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const url = button.getAttribute("data-url");

        try {
          await navigator.clipboard.writeText(url);
          button.innerText = "Copied!";
          setTimeout(() => {
            button.innerText = "Copy Link";
          }, 1500);
        } catch (error) {
          alert("Copy failed. You can manually copy the link.");
        }
      });
    });

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-id");

        const confirmDelete = confirm(
          "Are you sure you want to delete " + id + "?"
        );

        if (!confirmDelete) return;

        try {
          await deleteDoc(doc(db, "businesses", id));
          alert("Business deleted.");
          loadBusinesses();
        } catch (error) {
          alert(error.message);
        }
      });
    });

  } catch (error) {
    businessList.innerHTML = error.message;
  }
}

async function loadBusinessForEdit() {
  if (!updateBusinessBtn || !editId) return;

  document.getElementById("editBusinessId").innerText = editId;

  try {
    const businessRef = doc(db, "businesses", editId);
    const businessSnap = await getDoc(businessRef);

    if (!businessSnap.exists()) {
      statusText.innerText = "Business not found.";
      return;
    }

    const b = businessSnap.data();

    document.getElementById("name").value = b.name || "";
    document.getElementById("tagline").value = b.tagline || "";
    document.getElementById("google").value = b.google || "";
    document.getElementById("instagram").value = b.instagram || "";
    document.getElementById("facebook").value = b.facebook || "";
    document.getElementById("website").value = b.website || "";
    document.getElementById("whatsapp").value = b.whatsapp || "";
    document.getElementById("phone").value = b.phone || "";
    document.getElementById("location").value = b.location || "";
    document.getElementById("logo").value = b.logo || "";

  } catch (error) {
    statusText.innerText = error.message;
  }
}

onAuthStateChanged(auth, (user) => {
  const page = window.location.pathname;

  if (
    page.includes("dashboard.html") ||
    page.includes("add-business.html") ||
    page.includes("edit-business.html")
  ) {
    if (user) {
      if (userEmail) {
        userEmail.innerText = "Logged in as: " + user.email;
      }

      if (page.includes("dashboard.html")) {
        loadBusinesses();
      }

      if (page.includes("edit-business.html")) {
        loadBusinessForEdit();
      }

    } else {
      window.location.href = "login.html?v=11";
    }
  }
});
