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
// ================= DATA POTENSI SEKOLAH (STEP = 1 TABEL) =================

function showSchoolPage() {
    contentArea.innerHTML = `
        <h2>DATA POTENSI GUGUSDEPAN PRIODE 2025 – 2026</h2>

        <form id="schoolForm">

            <!-- STEP 1 -->
            <div class="step active">
                <h3>A. GUGUSDEPAN : PUTRA</h3>
                <table border="1" width="100%" cellpadding="8">
                    <tr><td>NOMOR GUDEP</td><td><input type="text" id="NOMOR GUDEP"></td></tr>
                    <tr><td>ALAMAT GUDEP</td><td><input type="text" id="ALAMAT GUDEP"></td></tr>
                    <tr><td>NOMOR TELEPON/HP</td><td><input type="text" id="NOMOR TELEPON/HP"></td></tr>
                    <tr><td>MEDIA SOSIAL</td><td><input type="text" id="MEDIA SOSIAL"></td></tr>
                </table>
            </div>

            <div class="step">
                <h3>I. PESERTA DIDIK PUTRA</h3>
            
                <table border="1" width="100%" cellpadding="6" 
                    style="border-collapse:collapse; text-align:center;">
            
                    <tr>
                        <th rowspan="2">NO</th>
                        <th rowspan="2">GOLONGAN</th>
                        <th colspan="4">Syarat Kecakapan Umum</th>
                        <th rowspan="2">JUMLAH</th>
                        <th colspan="3">Syarat Kecakapan Khusus</th>
                        <th rowspan="2">GARUDA</th>
                        <th rowspan="2">Keterangan</th>
                    </tr>
            
                    <tr>
                        <th>CALON</th>
                        <th>MULA</th>
                        <th>BANTU</th>
                        <th>TATA</th>
                        <th>PURWA</th>
                        <th>MADYA</th>
                        <th>UTAMA</th>
                    </tr>
            
                    <tr>
                        <td>1</td>
                        <td>SIAGA</td>
                        <td><input type="number" id="siagaCalonPutra"></td>
                        <td><input type="number" id="siagaMulaPutra"></td>
                        <td><input type="number" id="siagaBantuPutra"></td>
                        <td><input type="number" id="siagaTataPutra"></td>
                        <td><input type="number" id="siagaJumlahPutra"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><input type="number" id="siagaGarudaPutra"></td>
                        <td><input type="text" id="siagaKetPutra"></td>
                    </tr>
            
                    <tr>
                        <td>2</td>
                        <td>PENGGALANG</td>
                        <td><input type="number" id="penggalangCalonPutra"></td>
                        <td><input type="number" id="penggalangRamuPutra"></td>
                        <td><input type="number" id="penggalangRakitPutra"></td>
                        <td><input type="number" id="penggalangTerapPutra"></td>
                        <td><input type="number" id="penggalangJumlahPutra"></td>
                        <td><input type="number" id="penggalangPurwaPutra"></td>
                        <td><input type="number" id="penggalangMadyaPutra"></td>
                        <td><input type="number" id="penggalangUtamaPutra"></td>
                        <td><input type="number" id="penggalangGarudaPutra"></td>
                        <td><input type="text" id="penggalangKetPutra"></td>
                    </tr>
            
                    <tr>
                        <td>3</td>
                        <td>PENEGAK</td>
                        <td><input type="number" id="penegakCalonPutra"></td>
                        <td><input type="number" id="penegakBantaraPutra"></td>
                        <td><input type="number" id="penegakLaksanaPutra"></td>
                        <td></td>
                        <td><input type="number" id="penegakJumlahPutra"></td>
                        <td><input type="number" id="penegakPurwaPutra"></td>
                        <td><input type="number" id="penegakMadyaPutra"></td>
                        <td><input type="number" id="penegakUtamaPutra"></td>
                        <td><input type="number" id="penegakGarudaPutra"></td>
                        <td><input type="text" id="penegakKetPutra"></td>
                    </tr>
            
                    <tr>
                        <td>4</td>
                        <td>PANDEGA</td>
                        <td><input type="number" id="pandegaCalonPutra"></td>
                        <td><input type="number" id="pandegaPutra"></td>
                        <td></td>
                        <td></td>
                        <td><input type="number" id="pandegaJumlahPutra"></td>
                        <td><input type="number" id="pandegaPurwaPutra"></td>
                        <td><input type="number" id="pandegaMadyaPutra"></td>
                        <td><input type="number" id="pandegaUtamaPutra"></td>
                        <td><input type="number" id="pandegaGarudaPutra"></td>
                        <td><input type="text" id="pandegaKetPutra"></td>
                    </tr>
            
                </table>
            
                <p style="margin-top:8px; font-size:12px;">
                    Catatan: Isi sesuai keadaan di Pangkalan/Sekolah
                </p>
            </div>

            <!-- STEP 3 -->
            <div class="step">
                <h3>II. PEMBINA PUTRA</h3>
                <p style="font-size:13px;">
                    (Pembina atau Guru yang berasal dari sekolah bersangkutan)
                </p>
            
                <table border="1" width="100%" cellpadding="6"
                    style="border-collapse:collapse; text-align:center;">
            
                    <tr>
                        <th rowspan="2">NO</th>
                        <th rowspan="2">Nama Lengkap</th>
                        <th rowspan="2">Tempat, tgl Lahir</th>
                        <th rowspan="2">Tugas Kepramukaan</th>
                        <th colspan="4">Pendidikan Terakhir</th>
                    </tr>
            
                    <tr>
                        <th>Pramuka</th>
                        <th>Tahun</th>
                        <th>Umum</th>
                        <th>Tahun</th>
                    </tr>
            
                    ${[1,2,3,4].map(i => `
                    <tr>
                        <td>${i}</td>
                        <td><input type="text" id="pembinaNama${i}"></td>
                        <td><input type="text" id="pembinaTTL${i}"></td>
                        <td><input type="text" id="pembinaTugas${i}"></td>
                        <td><input type="text" id="pembinaPramuka${i}"></td>
                        <td><input type="number" id="pembinaPramukaTahun${i}"></td>
                        <td><input type="text" id="pembinaUmum${i}"></td>
                        <td><input type="number" id="pembinaUmumTahun${i}"></td>
                    </tr>
                    `).join("")}
            
                </table>
            </div>

            <!-- STEP 4 -->
            <div class="step">
                <h3>III. PEMBANTU PEMBINA PUTRA (INSTRUKTUR)</h3>
                <p style="font-size:13px;">
                    (Pembina atau Pembantu Pembina dari luar Sekolah/Gudep)
                </p>
            
                <table border="1" width="100%" cellpadding="6"
                    style="border-collapse:collapse; text-align:center;">
            
                    <tr>
                        <th rowspan="2">NO</th>
                        <th rowspan="2">Nama Lengkap</th>
                        <th rowspan="2">Tempat, tgl Lahir</th>
                        <th rowspan="2">Tugas Kepramukaan</th>
                        <th colspan="4">Pendidikan Terakhir</th>
                    </tr>
            
                    <tr>
                        <th>Pramuka</th>
                        <th>Tahun</th>
                        <th>Umum</th>
                        <th>Tahun</th>
                    </tr>
            
                    ${[1,2].map(i => `
                    <tr>
                        <td>${i}</td>
                        <td><input type="text" id="instrukturNama${i}"></td>
                        <td><input type="text" id="instrukturTTL${i}"></td>
                        <td><input type="text" id="instrukturTugas${i}"></td>
                        <td><input type="text" id="instrukturPramuka${i}"></td>
                        <td><input type="number" id="instrukturPramukaTahun${i}"></td>
                        <td><input type="text" id="instrukturUmum${i}"></td>
                        <td><input type="number" id="instrukturUmumTahun${i}"></td>
                    </tr>
                    `).join("")}
            
                </table>
            </div>

            <!-- STEP 5 -->
            <div class="step">
                <h3>E. Prestasi</h3>
                <table border="1" width="100%" cellpadding="8">
                    <tr>
                        <td>Prestasi</td>
                        <td><textarea id="prestasi" rows="5" style="width:100%;"></textarea></td>
                    </tr>
                </table>
            </div>

            <br>

            <button type="button" id="prevBtn">Back</button>
            <button type="button" id="nextBtn">Next</button>
            <button type="submit" id="submitBtn" style="display:none;">Simpan</button>

        </form>
    `;

    initMultiStep();
}

function initMultiStep() {
    let currentStep = 0;
    const steps = document.querySelectorAll(".step");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const submitBtn = document.getElementById("submitBtn");

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

    document.getElementById("schoolForm").onsubmit = function(e) {
        e.preventDefault();
        saveSchoolFull();
    };

    showStep(currentStep);
}

function saveSchoolFull() {

    const data = {
        nama: namaSekolah.value,
        alamat: alamatSekolah.value,
        npsn: npsn.value,
        gudepPutra: gudepPutra.value,
        gudepPutri: gudepPutri.value,
        siagaPutra: siagaPutra.value,
        siagaPutri: siagaPutri.value,
        penggalangPutra: penggalangPutra.value,
        penggalangPutri: penggalangPutri.value,
        penegakPutra: penegakPutra.value,
        penegakPutri: penegakPutri.value,
        kamabigus: kamabigus.value,
        pembinaPutra: pembinaPutra.value,
        pembinaPutri: pembinaPutri.value,
        jumlahPembina: jumlahPembina.value,
        ruangSekretariat: ruangSekretariat.value,
        perlengkapan: perlengkapan.value,
        lapangan: lapangan.value,
        prestasi: prestasi.value
    };

    const key = data.nama.toLowerCase().replace(/\s/g, "");

    set(ref(db, "schools/" + key), data);

    alert("Data berhasil disimpan.");
}
// ================= INIT =================
renderSidebar();
