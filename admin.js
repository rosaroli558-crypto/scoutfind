import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
getDatabase,
ref,
onValue,
remove,
update
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
apiKey: "AIzaSyA8MVIG6U7LBKTTKaGsAvgI1aMy_Oxstto",
authDomain: "scout-find-kwarran-batulicin.firebaseapp.com",
projectId: "scout-find-kwarran-batulicin",
storageBucket: "scout-find-kwarran-batulicin.firebasestorage.app",
messagingSenderId: "648815584284",
appId: "1:648815584284:web:bcfbfa2a344ba132a96bd9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tableBody = document.getElementById("tableBody");

const gudepRef = ref(db,"potensiGudep");

onValue(gudepRef,(snapshot)=>{

tableBody.innerHTML="";

let no=1;

snapshot.forEach(child=>{

const data = child.val();
const key = child.key;

const tr = document.createElement("tr");

tr.innerHTML=`

<td>${no++}</td>
<td>${data.putra.nomor}</td>
<td>${data.putri.nomor}</td>

<td>

<button onclick="editData('${key}')">Edit</button>

<button onclick="hapusData('${key}')">Hapus</button>

</td>

`;

tableBody.appendChild(tr);

});

});

window.hapusData = function(key){

if(confirm("Hapus data ini?")){

remove(ref(db,"potensiGudep/"+key));

}

}

window.editData = function(key){

const nomorBaru = prompt("Nomor Gudep Putra baru");

update(ref(db,"potensiGudep/"+key+"/putra"),{

nomor: nomorBaru

});

}
