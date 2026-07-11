import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp
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
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const businessId = params.get("business") || "tuluacoffee";

async function track(metric) {
  try {
    const analyticsRef = doc(db, "analytics", businessId);

    await setDoc(
      analyticsRef,
      {
        [metric]: increment(1),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (error) {
    console.log("Analytics error:", error);
  }
}

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

    if (b.logo) {
      document.getElementById("logo").src = b.logo;
    }

    setButton("google", b.google, "googleClicks");
    setButton("instagram", b.instagram, "instagramClicks");
    setButton("facebook", b.facebook, "facebookClicks");
    setButton("website", b.website, "websiteClicks");
    setButton("whatsapp", b.whatsapp, "whatsappClicks");
    setButton("location", b.location, "locationClicks");

    const phoneButton = document.getElementById("phone");

    if (b.phone) {
      phoneButton.href = "tel:" + b.phone;
      phoneButton.addEventListener("click", () => {
        track("phoneClicks");
      });
    } else {
      phoneButton.style.display = "none";
    }

    track("pageViews");

  } catch (error) {
    console.error(error);
    document.getElementById("businessName").innerText = "Firebase error";
    document.getElementById("tagline").innerText = error.message;
  }
}

function setButton(id, url, metric) {
  const button = document.getElementById(id);

  if (url && url.length > 5) {
    button.href = url;

    button.addEventListener("click", () => {
      track(metric);
    });

  } else {
    button.style.display = "none";
  }
}

loadBusiness();
