import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
getDatabase,
ref,
onValue,
remove
}

from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = { /* config sama */ };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tableBody = document.getElementById("tableBody");

const gudepRef = ref(db,"potensiGudep");

onValue(gudepRef,(snapshot)=>{

tableBody.innerHTML="";

let no = 1;

snapshot.forEach(child=>{

const data = child.val();
const key = child.key;

const tr = document.createElement("tr");

tr.innerHTML = `

<td>${no++}</td>

<td>${data.putra.nomor}</td>

<td>${data.putri.nomor}</td>

<td>${data.putra.hp}</td>

<td>

<button onclick="hapus('${key}')">Hapus</button>

</td>

`;

tableBody.appendChild(tr);

});

});

window.hapus = function(key){

if(confirm("Hapus data?")){

remove(ref(db,"potensiGudep/"+key));

}

}
