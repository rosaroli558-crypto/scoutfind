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
    sidebarList.innerHTML = "";

    get(ref(db, "articles")).then(snapshot => {
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

        // Tambah menu Data Sekolah
        const liSchool = document.createElement("li");
        const linkSchool = document.createElement("a");

        linkSchool.href = "#";
        linkSchool.textContent = "Data Potensi Sekolah";
        linkSchool.addEventListener("click", showSchoolPage);

        liSchool.appendChild(linkSchool);
        sidebarList.appendChild(document.createElement("hr"));
        sidebarList.appendChild(liSchool);
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

let editKey = null;
// ================= VIEW SWITCH =================
function showSchoolPage() {
    document.getElementById("articleSection").classList.add("hidden");
    document.getElementById("schoolSection").classList.remove("hidden");

    setTimeout(() => {
        initMultiStep();
    }, 0);
}

function showArticlePage() {
    document.getElementById("schoolSection").classList.add("hidden");
    document.getElementById("articleSection").classList.remove("hidden");
}

function initMultiStep() {
    let currentStep = 0;
    const steps = document.querySelectorAll(".step");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const submitBtn = document.getElementById("submitBtn");
    const form = document.getElementById("schoolForm");

    function showStep(index) {
        steps.forEach(step => step.style.display = "none");
        steps[index].style.display = "block";

        prevBtn.style.display = index === 0 ? "none" : "inline-block";
        nextBtn.style.display = index === steps.length - 1 ? "none" : "inline-block";
        submitBtn.style.display = index === steps.length - 1 ? "inline-block" : "none";
    }

    nextBtn.onclick = () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    };

    prevBtn.onclick = () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    };

    form.onsubmit = function(e) {
        e.preventDefault();

        const data = {
            putra: {
                nomor: nomorGudepPutra.value,
                alamat: alamatGudepPutra.value,
                hp: noHpPutra.value,
                medsos: medsosPutra.value
            },
            putri: {
                nomor: nomorGudepPutri.value,
                alamat: alamatGudepPutri.value,
                hp: noHpPutri.value,
                medsos: medsosPutri.value
            },
            createdAt: Date.now()
        };

        if(editKey){

        set(ref(db,"potensiGudep/"+editKey),data);
        
        alert("Data berhasil diperbarui");
        
        editKey = null;
        
        }else{
        
        const key = "gudep_" + Date.now();
        
        set(ref(db,"potensiGudep/"+key),data);
        
        alert("Data berhasil disimpan");
        
        }

        const schoolList = document.getElementById("schoolList");

        onValue(ref(db,"potensiGudep"),(snapshot)=>{
        
        schoolList.innerHTML="";
        
        snapshot.forEach(child=>{
        
        const data = child.val();
        const key = child.key;
        
        const div = document.createElement("div");
        
        div.className="school-card";
        
        div.innerHTML = `
        
        <b>Gudep Putra:</b> ${data.putra.nomor}<br>
        <b>Gudep Putri:</b> ${data.putri.nomor}<br>
        
        <button onclick="editSchool('${key}')">Edit</button>
        
        `;
        
        schoolList.appendChild(div);
        
        });
        
        });

        alert("Data berhasil disimpan.");
        form.reset();
        currentStep = 0;
        showStep(currentStep);
    };

    showStep(currentStep);
    console.log("Multi step jalan");
}

window.editSchool = function(key){

get(ref(db,"potensiGudep/"+key)).then(snapshot=>{

const data = snapshot.val();

editKey = key;

nomorGudepPutra.value = data.putra.nomor;
alamatGudepPutra.value = data.putra.alamat;
noHpPutra.value = data.putra.hp;
medsosPutra.value = data.putra.medsos;

nomorGudepPutri.value = data.putri.nomor;
alamatGudepPutri.value = data.putri.alamat;
noHpPutri.value = data.putri.hp;
medsosPutri.value = data.putri.medsos;

window.scrollTo(0,0);

});

}
// ================= INIT =================

renderSidebar();
