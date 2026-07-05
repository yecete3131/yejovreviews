import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const businessId = params.get("business") || "dubaicafe";

async function loadBusiness() {
  try {
    const businessRef = doc(db, "businesses", businessId);
    const businessSnap = await getDoc(businessRef);

    if (!businessSnap.exists()) {
      document.getElementById("businessName").innerText = "Business not found";
      document.getElementById("tagline").innerText = businessId;
      return;
    }

    const b = businessSnap.data();

    document.getElementById("businessName").innerText = b.name || "";
    document.getElementById("tagline").innerText = b.tagline || "";

    setButton("google", b.google);
    setButton("instagram", b.instagram);
    setButton("facebook", b.facebook);
    setButton("website", b.website);
    setButton("whatsapp", b.whatsapp);
    setButton("location", b.location);

    if (b.phone) {
      document.getElementById("phone").href = "tel:" + b.phone;
    } else {
      document.getElementById("phone").style.display = "none";
    }

    if (b.logo) {
      document.getElementById("logo").src = b.logo;
    }

  } catch (error) {
    console.error(error);
    document.getElementById("businessName").innerText = "Firebase error";
    document.getElementById("tagline").innerText = error.message;
  }
}

function setButton(id, url) {
  const button = document.getElementById(id);

  if (url && url.length > 5) {
    button.href = url;
  } else {
    button.style.display = "none";
  }
}

loadBusiness();
