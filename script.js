// ===== IMPORT FIREBASE =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    remove,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ===== CONFIG FIREBASE (GANTI DENGAN PUNYAMU) =====
const firebaseConfig = {
  apiKey: "AIzaSyA8MVIG6U7LBKTTKaGsAvgI1aMy_Oxstto",
  authDomain: "scout-find-kwarran-batulicin.firebaseapp.com",
  projectId: "scout-find-kwarran-batulicin",
  storageBucket: "scout-find-kwarran-batulicin.firebasestorage.app",
  messagingSenderId: "648815584284",
  appId: "1:648815584284:web:bcfbfa2a344ba132a96bd9",
  measurementId: "G-3G1W4NX8E4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ===== LOAD SIDEBAR =====
function renderSidebar() {
    const sidebar = document.querySelector(".sidebar ul");
    onValue(ref(db, "articles"), snapshot => {
        sidebar.innerHTML = "";

        snapshot.forEach(child => {
            const data = child.val();
            sidebar.innerHTML += `
                <li>
                    <a href="#" onclick="loadArticle('${child.key}')">
                        ${data.title}
                    </a>
                </li>
            `;
        });

        sidebar.innerHTML += `
            <li><hr></li>
            <li><a href="#" onclick="showAddForm()">+ Tambah Artikel</a></li>
        `;
    });
}

// ===== LOAD ARTIKEL =====
window.loadArticle = function(key) {
    const contentArea = document.querySelector(".content");

    get(ref(db, "articles/" + key)).then(snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            contentArea.innerHTML = `
                <h2>${data.title}</h2>
                ${data.content}
                <br><br>
                <button onclick="editArticle('${key}')">Edit</button>
                <button onclick="deleteArticle('${key}')">Hapus</button>
            `;
        } else {
            contentArea.innerHTML = "<h2>Artikel tidak ditemukan</h2>";
        }
    });
};

// ===== TAMBAH FORM =====
window.showAddForm = function() {
    document.querySelector(".content").innerHTML = `
        <h2>Tambah Artikel</h2>
        <input type="text" id="newTitle" placeholder="Judul"><br><br>
        <textarea id="newContent" rows="8" placeholder="Isi artikel"></textarea><br><br>
        <button onclick="addArticle()">Simpan</button>
    `;
};

// ===== TAMBAH ARTIKEL =====
window.addArticle = function() {
    const title = document.getElementById("newTitle").value;
    const content = document.getElementById("newContent").value;
    const key = title.toLowerCase().replace(/\s/g, "");

    set(ref(db, "articles/" + key), {
        title: title,
        content: content
    });
};

// ===== EDIT =====
window.editArticle = function(key) {
    get(ref(db, "articles/" + key)).then(snapshot => {
        const data = snapshot.val();
        document.querySelector(".content").innerHTML = `
            <h2>Edit Artikel</h2>
            <input type="text" id="editTitle" value="${data.title}"><br><br>
            <textarea id="editContent" rows="8">${data.content}</textarea><br><br>
            <button onclick="updateArticle('${key}')">Update</button>
        `;
    });
};

window.updateArticle = function(key) {
    const title = document.getElementById("editTitle").value;
    const content = document.getElementById("editContent").value;

    set(ref(db, "articles/" + key), {
        title: title,
        content: content
    });
};

// ===== HAPUS =====
window.deleteArticle = function(key) {
    if (confirm("Yakin hapus artikel?")) {
        remove(ref(db, "articles/" + key));
        document.querySelector(".content").innerHTML = "<h2>Artikel dihapus</h2>";
    }
};

// ===== INIT =====
window.onload = function() {
    renderSidebar();
};
