/* ----------------------------
/*  Name: Firebase
    Author: Nicolai
    Version: 
/* -------------------------- */

const notecontainer = document.getElementById("notes");
const inp = document.querySelector("#inpNotattekst");

inp.addEventListener("keyup", opretNotat);

const wsurl = "https://notatliste-e8cf5.firebaseio.com/";

kaldWebserviceHentAlle();

function kaldWebserviceHentAlle() {
    fetch(wsurl + "/notater.json", {
        method: 'GET'
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        udskrivNoter(json);
    }).catch(function(error) {
        console.log(error);
    });
}

function udskrivNoter(noterjson) {
    //console.log(noterjson)
    notecontainer.innerHTML = "";

    for (let id of Object.keys(noterjson)) {
        var notediv = document.createElement("div");
        notediv.className = "note";

        var p = document.createElement("p");
        p.setAttribute("data-id", id);
        p.setAttribute("contenteditable", "true");
        p.onkeydown = function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                kaldWebserviceRet(this);
            }
        };
        p.innerHTML = noterjson[id].notat;

        var sletdiv = document.createElement("div");
        sletdiv.setAttribute("data-id", id);
        sletdiv.innerHTML = "&#9746;";
        sletdiv.onclick = function() {
            kaldWebserviceSlet(this.getAttribute("data-id"));
        };

        notediv.appendChild(p);
        notediv.appendChild(sletdiv);

        notecontainer.appendChild(notediv);
    }
}

function opretNotat(e) {
    if (e.keyCode === 13) {
        //console.log(e.target.value);
        kaldWebserviceOpret(e.target.value);
        inp.value = "";
    }
}


function kaldWebserviceOpret(inp) {
    const nytnotat = { "notat": inp };

    fetch(wsurl + "/notater.json", {
        method: 'POST',
        body: JSON.stringify(nytnotat)
    }).then(function() {
        console.log("OK");
        kaldWebserviceHentAlle();
    }).catch(function(error) {
        console.log(error);
    });
}

function kaldWebserviceSlet(notatid) {
    //console.log("Der er klikket på slet - id = " + notatid)
    fetch(wsurl + "/notater/" + notatid + ".json", {
        method: 'DELETE'
    }).then(function() {
        kaldWebserviceHentAlle();
    }).catch(function(error) {
        console.log(error);
    });
}

function kaldWebserviceRet(p) {
    let notatid = p.getAttribute("data-id");
    let notattxt = p.innerHTML.replace("<br>", "");

    //console.log(notatid);
    //console.log(notattxt);

    let rettetnotat = { "notat": notattxt};

    fetch(wsurl + "/notater/" + notatid + ".json", {
        method: 'PUT',
        body: JSON.stringify(rettetnotat)
    }).then(function() {
        kaldWebserviceHentAlle();
    }).catch(function(error) {
        console.log(error);
    });
}