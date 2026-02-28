// ===== DATABASE PALSU DULU (NANTI BISA GANTI DATABASE BENERAN) =====
const articles = {
    "beranda": {
        title: "Selamat Datang di Scout Find",
        content: `
            <p>Scout Find adalah ensiklopedia digital bertema Pramuka Kwarran Batulicin.</p>
            <p>Website ini dibuat untuk pembelajaran dan eksplorasi Data Kepramukaan Kwarran Batulicin</p>
        `
    },
    "pramuka": {
        title: "Gerakan Pramuka",
        content: `
            <p>Gerakan Pramuka adalah organisasi pendidikan nonformal di Indonesia.</p>
            <h3>Sejarah</h3>
            <p>Didirikan pada 14 Agustus 1961.</p>
            <h3>Tujuan</h3>
            <p>Membentuk karakter generasi muda yang berjiwa Pancasila.</p>
        `
    },
    "dasadarma": {
        title: "Dasa Darma Pramuka",
        content: `
            <ol>
                <li>Takwa kepada Tuhan Yang Maha Esa</li>
                <li>Cinta alam dan kasih sayang sesama manusia</li>
                <li>Patriot yang sopan dan ksatria</li>
                <li>Patuh dan suka bermusyawarah</li>
                <li>Rela menolong dan tabah</li>
                <li>Rajin, terampil dan gembira</li>
                <li>Hemat, cermat dan bersahaja</li>
                <li>Disiplin, berani dan setia</li>
                <li>Bertanggung jawab dan dapat dipercaya</li>
                <li>Suci dalam pikiran, perkataan dan perbuatan</li>
            </ol>
        `
    }
};

// ===== LOAD ARTIKEL =====
function loadArticle(key) {
    const contentArea = document.querySelector(".content");

    if (articles[key]) {
        contentArea.innerHTML = `
            <h2>${articles[key].title}</h2>
            ${articles[key].content}
        `;
    } else {
        contentArea.innerHTML = `
            <h2>Artikel tidak ditemukan</h2>
            <p>Kayaknya kamu salah ketik atau artikelnya belum dibuat.</p>
        `;
    }
}

// ===== SIDEBAR CLICK =====
document.querySelectorAll(".sidebar a").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        const page = this.textContent.toLowerCase().replace(/\s/g, "");
        loadArticle(page);
    });
});

// ===== SEARCH FUNCTION =====
document.querySelector(".header input").addEventListener("keyup", function() {
    const keyword = this.value.toLowerCase();

    for (let key in articles) {
        if (articles[key].title.toLowerCase().includes(keyword)) {
            loadArticle(key);
            return;
        }
    }
});

// ===== LOAD DEFAULT =====
window.onload = function() {
    loadArticle("beranda");
};
