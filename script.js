import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    remove,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ================= CONFIG =================
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

// ================= ELEMENT =================
const sidebarList = document.getElementById("sidebarList");
const contentArea = document.getElementById("contentArea");
const searchInput = document.getElementById("searchInput");

// ================= SIDEBAR =================
function renderSidebar() {
    onValue(ref(db, "articles"), snapshot => {
        sidebarList.innerHTML = "";

        snapshot.forEach(child => {
            const data = child.val();
            const li = document.createElement("li");
            const link = document.createElement("a");

            link.href = "#";
            link.textContent = data.title;
            link.addEventListener("click", () => loadArticle(child.key));

            li.appendChild(link);
            sidebarList.appendChild(li);
        });

        addAddButton();
    });
}

function addAddButton() {
    const hr = document.createElement("hr");
    const li = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.textContent = "+ Tambah Artikel";
    link.addEventListener("click", showAddForm);

    li.appendChild(link);
    sidebarList.appendChild(hr);
    sidebarList.appendChild(li);
}

// ================= LOAD ARTIKEL =================
function loadArticle(key) {
    get(ref(db, `articles/${key}`)).then(snapshot => {
        if (!snapshot.exists()) {
            contentArea.innerHTML = "<h2>Artikel tidak ditemukan</h2>";
            return;
        }

        const data = snapshot.val();

        contentArea.innerHTML = `
            <h2>${data.title}</h2>
            ${data.content}
            <br><br>
            <button id="editBtn">Edit</button>
            <button id="deleteBtn">Hapus</button>
        `;

        document.getElementById("editBtn")
            .addEventListener("click", () => showEditForm(key, data));

        document.getElementById("deleteBtn")
            .addEventListener("click", () => deleteArticle(key));
    });
}

// ================= TAMBAH =================
function showAddForm() {
    contentArea.innerHTML = `
        <h2>Tambah Artikel</h2>
        <input type="text" id="newTitle" placeholder="Judul"><br><br>
        <textarea id="newContent" rows="8" placeholder="Isi artikel"></textarea><br><br>
        <button id="saveBtn">Simpan</button>
    `;

    document.getElementById("saveBtn")
        .addEventListener("click", addArticle);
}

function addArticle() {
    const title = document.getElementById("newTitle").value;
    const content = document.getElementById("newContent").value;
    const key = title.toLowerCase().replace(/\s/g, "");

    set(ref(db, `articles/${key}`), { title, content });
}

// ================= EDIT =================
function showEditForm(key, data) {
    contentArea.innerHTML = `
        <h2>Edit Artikel</h2>
        <input type="text" id="editTitle" value="${data.title}"><br><br>
        <textarea id="editContent" rows="8">${data.content}</textarea><br><br>
        <button id="updateBtn">Update</button>
    `;

    document.getElementById("updateBtn")
        .addEventListener("click", () => updateArticle(key));
}

function updateArticle(key) {
    const title = document.getElementById("editTitle").value;
    const content = document.getElementById("editContent").value;

    set(ref(db, `articles/${key}`), { title, content });
}

// ================= DELETE =================
function deleteArticle(key) {
    if (confirm("Yakin hapus artikel?")) {
        remove(ref(db, `articles/${key}`));
        contentArea.innerHTML = "<h2>Artikel dihapus</h2>";
    }
}

// ================= SEARCH =================
searchInput.addEventListener("keyup", () => {
    const keyword = searchInput.value.toLowerCase();

    get(ref(db, "articles")).then(snapshot => {
        snapshot.forEach(child => {
            if (child.val().title.toLowerCase().includes(keyword)) {
                loadArticle(child.key);
            }
        });
    });
});
// ================= DATA POTENSI SEKOLAH =================

function showSchoolPage() {
    contentArea.innerHTML = `
        <h2>Data Potensi Sekolah</h2>

        <input type="text" id="searchSchool" placeholder="Cari sekolah..." />
        <div id="schoolList"></div>

        <hr><br>

        <h3>Tambah Sekolah</h3>
        <input type="text" id="namaSekolah" placeholder="Nama Sekolah"><br><br>
        <input type="text" id="gudepSekolah" placeholder="Gudep"><br><br>
        <input type="text" id="pembinaSekolah" placeholder="Pembina"><br><br>
        <input type="number" id="anggotaSekolah" placeholder="Jumlah Anggota"><br><br>
        <button id="tambahSekolah">Simpan</button>
    `;

    document
        .getElementById("searchSchool")
        .addEventListener("keyup", loadSchools);

    document
        .getElementById("tambahSekolah")
        .addEventListener("click", addSchool);

    loadSchools();
}

// ===== LOAD SEKOLAH =====
function loadSchools() {
    const keyword = document
        .getElementById("searchSchool")
        .value.toLowerCase();

    const list = document.getElementById("schoolList");
    list.innerHTML = "";

    onValue(ref(db, "schools"), snapshot => {
        list.innerHTML = "";

        snapshot.forEach(child => {
            const data = child.val();

            if (data.nama.toLowerCase().includes(keyword)) {
                list.innerHTML += `
                    <div class="school-card">
                        <h3>${data.nama}</h3>
                        <p>Gudep: ${data.gudep}</p>
                        <p>Pembina: ${data.pembina}</p>
                        <p>Anggota: ${data.anggota}</p>
                    </div>
                `;
            }
        });
    }, { onlyOnce: true });
}

// ===== TAMBAH SEKOLAH =====
function addSchool() {
    const nama = document.getElementById("namaSekolah").value;
    const gudep = document.getElementById("gudepSekolah").value;
    const pembina = document.getElementById("pembinaSekolah").value;
    const anggota = document.getElementById("anggotaSekolah").value;

    if (!nama) return;

    const key = nama.toLowerCase().replace(/\s/g, "");

    set(ref(db, "schools/" + key), {
        nama,
        gudep,
        pembina,
        anggota
    });

    document.getElementById("namaSekolah").value = "";
    document.getElementById("gudepSekolah").value = "";
    document.getElementById("pembinaSekolah").value = "";
    document.getElementById("anggotaSekolah").value = "";

    loadSchools();
}
// ================= INIT =================
const li = document.createElement("li");
const link = document.createElement("a");
link.href = "#";
link.textContent = "Data Potensi Sekolah";
link.addEventListener("click", showSchoolPage);
li.appendChild(link);
sidebarList.appendChild(li);
renderSidebar();
