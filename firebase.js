const firebaseConfig = {
  apiKey: "AIzaSyA6n0rMhW-jsatn22cfSKxgtBeXAAsmJ2Q",
  authDomain: "atozdilkishayari-b2d0b.firebaseapp.com",
  projectId: "atozdilkishayari-b2d0b",
  storageBucket: "atozdilkishayari-b2d0b.appspot.com",
  messagingSenderId: "39707457556",
  appId: "1:39707457556:web:c1987f0522733671a0cf01"
};

firebase.initializeApp(firebaseConfig);

// ✅ GLOBAL FIX
window.auth = firebase.auth();
window.db = firebase.firestore();