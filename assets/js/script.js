//JS by Gruppe 3 (Anders, Anna, Caroline & Nadia)
//UCN MMDA0920

// Projektet er inspireret af Dan's lektion: https://ucn.instructure.com/courses/25101/modules/items/651989
// Samt inspiration fra tidligere projekt https://mmd.ucn.dk/class/mmda0920/1086088/Sem2/Tem3/Rubrics/Englerod-Gruppe3/

const   login = {
            "username":"api.user",
            "password":"API-key-1234#!"
        },
        URLsite = "https://aenders.dk/wp-json/wp/v2/",
        URLtoken = "https://aenders.dk/wp-json/jwt-auth/v1/token",
        categoryToLookFor = 43; //43 er tallet på kategorien som bruges på alle SNV.dk Posts, for at den kun leder efter relevante Posts og ikke alle som ligger på WordPress.

const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () { // Onreadystatechange, bliver aktiveret når f.eks hjemmesiden bliver åbnet og skal til at loade. 
    if (this.readyState == 4 && this.status == 200) { // readyState == 4, betyder at den er færdig og har gennemført det som blev spurgt efter, og status == 200 betyder at den metode som er blevet spurgt efter har lykkedes.
        try {
        let REtoken = JSON.parse(this.response); //JSON laver den data vi har fået fra vores API om til et JSON-format så vi kan arbejde med det i JaveScript.
        window.localStorage.setItem("token", REtoken.token); //Gemmer den token vi får tilbage på i LocalStorage i browseren.
        afterToken(); // Functionen som skal anvende denne token til at spørge API om data.
        } catch(error) {
            console.log("Parsing Error: " + error)
        }
    }
    if (this.readyState == 4 && this.status >= 400) { // Altså at hvis der har være kontakt med API'en men den kunne ikke få et ordenligt svar tilbage, så skal en besked vises.
        console.log("Der opstod en fejl, være venlig at vende tilbage senere!")
    }
}
xhttp.open("POST", URLtoken, true) // POST fordi vi skal give noget til API'en + få noget tilbage.
xhttp.setRequestHeader("Content-Type", "application/JSON"); 
xhttp.send(JSON.stringify(login)); //JSON.stringify er det modsatte af JSON.parse, i dette tilfælde laver den JSON data om til en string som API'en kan forstå. 

function afterToken() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () { // Onreadystatechange, bliver aktiveret når f.eks hjemmesiden bliver åbnet og skal til at loade. 
        if (this.status !== 200) {
            //Bruges til Loading

            let container = document.createElement("section"),
            dotBox = document.createElement("article"),
            h2 = document.createElement("h2"),
            load1 = document.createElement("div"),
            load2 = document.createElement("div"),
            load3 = document.createElement("div");

            container.id = "loadingContainer";
            h2.textContent = "Indlæser SNV.dk";
            h2.id = "loadingH2";
            dotBox.id = "loadingDotBox";
            load1.classList.add("load1");
            load2.classList.add("load2");
            load3.classList.add("load3");

            dotBox.append(load1, load2, load3)
            container.append(h2, dotBox)
            document.querySelector("main").appendChild(container)

        } 

    if (this.readyState == 4 && this.status == 200) { // readyState == 4, betyder at den er færdig og har gennemført det som blev spurgt efter, og status == 200 betyder at den metode som er blevet spurgt efter har lykkedes.
        try {
        const data = JSON.parse(this.response);
        document.querySelector("main").innerHTML = "";//Reset Main, fordi den bruges til loading indhold
        makeSite(data);
        } catch(error) {
            console.log("Parsing Error: " + error)
        }
    }
    if (this.readyState == 4 && this.status >= 400) { 
        console.log("Der opstod en fejl, være venlig at vende tilbage senere!")
    }
}
xhttp.open("GET", URLsite + 'posts?status=private&categories=' + categoryToLookFor + '&per_page=100', true) // GET fordi nu hvor vi har vores token, så vil vi gerne spørge om noget data vi kan arbejde med. per_page=100 bruges fordi normalt vil WordPress kun give 10 tilbage, og ved at sætte den til 100(Kunne også være 50), vil vi få alle posts som er relevante.
xhttp.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("token")); //For at kunne få data, skal bruge vores login, som her er en token som sendes sammed med vores GET-request.
xhttp.send();
}

function makeSite(data) {
    console.log(data);
    //========================== LISTE MED DATA OG UNIVERSALE FUNCTIONER
    //== ID's
    const postData = data.find(post => post.id == 1248), // Er den bestemte post(id) som indeholder general data til produktet. 
    // Rækkefølge på data: Category, Tag, (Post - Hvis nødvendig)
    // Number() og map(Number) bruges til at lave et object og et array af "string-tal" om til tal som kan bruges i blandt andet vores switch-cases.
        IDforside = [postData.acf.id.categories.forside, postData.acf.id.tags.forside, postData.acf.posts.forside].map(Number), //ID'er fra categorier og tags som er relevant i henhold til Forsiden.
        IDnavigation = Number(postData.acf.id.categories.navigation), // Dette ID er til alle hjemmesider som skal kunne findes i den globale navigation.
        // Rækkefølge: post.id, tags.
        IDomklubben = [postData.acf.id.categories.navigationlist[0], postData.acf.id.tags.omklubben].map(Number),
        IDafdelinger = [postData.acf.id.categories.navigationlist[1], postData.acf.id.tags.afdelinger].map(Number),
        IDbegivenheder = [postData.acf.id.categories.navigationlist[2], postData.acf.id.tags.begivenheder].map(Number),
        IDnyheder = [postData.acf.id.categories.navigationlist[3], postData.acf.id.tags.nyheder].map(Number),
        IDblivmedlem = [postData.acf.id.categories.navigationlist[4], postData.acf.id.tags.blivmedlem].map(Number),
        
        IDungdom = [postData.acf.id.categories.underafdelinger[0], postData.acf.id.tags.aktiviteter_undersider[0]].map(Number),
        IDsejlklub = [postData.acf.id.categories.underafdelinger[1], postData.acf.id.tags.aktiviteter_undersider[1]].map(Number),

        //Banner Data
        IDbannerOmklubben = postData.acf.bannerdata[0],
        IDbannerAfdelinger = postData.acf.bannerdata[1],
        IDbannerUngdom = postData.acf.bannerdata[2],
        IDbannerSejlerskolen = postData.acf.bannerdata[3],
        IDbannerBlivmedlem = postData.acf.bannerdata[4],
        IDbannerBegivenhed = postData.acf.bannerdata[5],
        IDbannerNyheder = postData.acf.bannerdata[6],

        //Underside Data
        IDomklubbenUndersider = postData.acf.id.categories.omklubbenundersider,
        // Post Id , category til Template Stævne
        IDungdomStaevne = [postData.acf.id.categories.ungdom_undernav[1], postData.acf.id.categories.template_staevne].map(Number),
        IDungdomInfo = [postData.acf.id.categories.ungdom_undernav[2]].map(Number),

        //Template ID
        IDeventtemplate = Number(postData.acf.id.categories.begivenhed),
        IDnyhedtemplate = [postData.acf.id.categories.nyhedtemplate, postData.acf.id.tags.template_nyheder].map(Number),

        logo = postData.acf.billeder[0],

        // - Mobil og Tablet, bruges til at kigge hvilke elementer som skal skabes/ikke skabes. F.eks. til en HamburgerMenu. 
        mobil = window.matchMedia("(min-width: 320px) and (max-width: 480px)"),
        tablet = window.matchMedia("(min-width: 481px) and (max-width: 1024px)");

        
    //== FUNKTIONER

    //Skaber Hero SlideShow på forsiden
    let item = 0;
    function createHeroSlide () {
        let
        forsideID = data.find(post => post.id == IDforside[2]), heroes = forsideID.acf.hero, nr = 0, tekstArea = document.createElement("section"), pTekstArea = document.createElement("p"),
        h1 = document.createElement("h1"), imgArea = document.createElement("section"), btnArea = document.createElement("section");
        
        //Tekst Area
        h1.textContent = forsideID.acf.overskrifter[0];
        pTekstArea.textContent = forsideID.acf.brodtekst;
        tekstArea.id = "heroTekstArea";
        tekstArea.append(h1, pTekstArea);

        heroes.forEach(hero => {
            let div = document.createElement("div"), heroImg = document.createElement("img");
            div.classList.add("divHero");
            heroImg.classList.add("imgHero");
            heroImg.id = "hero_" + nr;
            div.id = "divHero" + nr;
            heroImg.src = hero;
            
            //Bruges til at ændre i på click, alt efter hvor i loopet knappen er blevet lavet.
            let divNr = 0;
                divNr += nr;
                
                btnArea.appendChild(div);
                imgArea.appendChild(heroImg);
                
            div.addEventListener("click", ()=> {
                imgArea.childNodes.forEach(post => post.classList.remove("activeHero"));
                btnArea.childNodes.forEach(post => post.classList.remove("activeDiv"));

                div.classList.add("activeDiv");
                heroImg.classList.add("activeHero");

                item = divNr + 1;//+1 for at den ikke viser det samme 2 gange
                if (divNr + 1 > 3) {
                    item = 0;
                }
            })
            nr++;
        })
        let sectionSlide = document.createElement("section"), clipHero = document.createElement("div");
        sectionSlide.id = "slideShow";
        clipHero.id = "clipHero";
        document.querySelector("#header").after(sectionSlide);
        document.querySelector("#slideShow").append(clipHero, imgArea, btnArea, tekstArea);

        if (!imgArea.childNodes.forEach(item => item.classList.contains("activeHero")) != -1) {
            document.querySelector("#divHero0").click() //Skal starte på med at vise 0 "onload"
        }
        
        loop(imgArea, btnArea);
    }
    
    function loop (area, btnArea) {
        setTimeout(() => {                                                                                  //Inspiration fra: https://stackoverflow.com/questions/22154129/how-to-make-setinterval-behave-more-in-sync-or-how-to-use-settimeout-instea.
            //Skulle bruge et Loop som havde en timeout til at vise hver Billede.
            area.childNodes.forEach(post => post.classList.remove("activeHero"));
            btnArea.childNodes.forEach(post => post.classList.remove("activeDiv"));

            area.childNodes[item].classList.add("activeHero");
            btnArea.childNodes[item].classList.add("activeDiv");

            loop(area, btnArea);
            item++;
            if(item > 3) {
                item = 0;//RESTS LOOP
            }
        }, 5000)
    }



    function createHTML (placement, element) { // Skal tilføje indhold til et sted i DOM'en, men skulle det "område/element" have indhold vil det blive erstattet.
        document.querySelector(placement).innerHTML = element;
    }
    function addToHTML (placement, element) {// Derfor er der også en function som tilføjer til eksiterende data i et område. 
        document.querySelector(placement).innerHTML += element;
    }

    // Switchen: Skal skrive forkortelsen for måneden i stedet for tallet.
    function numberToMonth (month) {
        switch (month) {
            case 01:
                month = "JAN"
                break;
            case 02:
                month = "FEB"
                break;
            case 03:
                month = "MAR"
                break;
            case 04:
                month = "APR"
                break;
            case 05:
                month = "MAJ"
                break;
            case 06:
                month = "JUN"
                break;
            case 07:
                month = "JUL"
                break;
            case 08:
                month = "AUG"
                break;
            case 09:
                month = "SEP"
                break;
            case 10:
                month = "OKT"
                break;
            case 11:
                month = "NOV"
                break;
            case 12:
                month = "DEC"
                break;
        }
        return month;
    }
    function sortNew (list) { //Sort returner de nye array alt efter hvilke vilkår man har sat.
        list.sort((first, second) => {// .sort sammenligner values, og den skal arbejde med de datoer vi har fra vores ACF-data.
            let date_1 = first.acf.dato[0],
                date_2 = second.acf.dato[0];
            
            //== Inspiret af https://stackoverflow.com/questions/7513040/how-to-sort-objects-by-date-ascending-order/21244139
            //== Kigger på hvilken af datoerne som er størst/mindst, og giver dem der efter en value.
            if (date_1 < date_2) { //== Hvis first er mindre end second, så er den "false"
                return -1;
            }
             if (date_1 == date_2) { //== Hvis first er lige med second, så er den "equal/neutral"
                return 0;
            } 
            if (date_1 > date_2) { //== Hvis first er større end second, så er den "true/postive"
                return 1;
            }
        });
        return list;
    }
    function makeUnderNavSection() {
        let section = document.createElement("section");
        section.id = "underNavContent";
        document.querySelector("header").after(section);//Skaber indeholdet efter Header, det bruger samme princip som .appendChild
    }
    //== Skal skabe undernavigation på bestemte sider
    function makeUnderNavigation (makeList, numberForLoop) {

        //== Funktioner til at skabe indhold når brugeren først ankommer til siden.
        
        //****************************
        //Til Om Klubben - Bestyrelsen
        function makeBestyrelsen() { //Den her function bliver gentage 1 gang til. Den her function har tilformål at starte OmKlubben på Bestyrelsen's side.
            let findPost = data.find(post => post.id == IDomklubbenUndersider[0]),
                title = findPost.acf[10],
                tekst = findPost.acf[1], // Problemer med at lave et array i ACF. Duer ikke hvis man bruger 0 direkte inde i ACF, skal være i en under gruppe. 0 forsvinder og er ikke med i arrayet.
                begivenheder = '<h2>' + title + '</h2><p>' + tekst + '</p>',
                medlemmer = '<section id="bestyrelseListe">';

            for(let i = 2; i < 10; i++) { // Skal skabe 8, medlems kasser. Starter på  let i = 2 fordi der efter komme de ønskede data.
                let medlemsInfo = findPost.acf[i], //Finder data til hver medlem.
                    billede = medlemsInfo.medlems_billede;
                if (billede == false) { //Hvis medlemmet ikke har et billede, bruges et dummy billede i stedet for.
                    billede = findPost.acf[11];
                }
                medlemmer += '<article><img src="' + billede + '" alt="Billede af medlem ' + medlemsInfo.navn + '">';
                medlemmer += '<div><h3>' + medlemsInfo.navn + '</h3><h4>' + medlemsInfo.position + '</h4><ul><li>Tlf nr: ' + medlemsInfo.telefon + '</li><li>Email: ' + medlemsInfo.email + '</li></ul></div></article>';
            }
            medlemmer += '</section>';
            //== Skaber Referater
            // - Find Referater
            const IDreferat = Number(postData.acf.id.categories.referater),
            IDreferatGF =  Number(postData.acf.id.categories.referater_GF);
            let
            referatListe = data.filter(post => post.categories.includes(IDreferat)),
            GFliste = data.filter(post => post.categories.includes(IDreferatGF)),
            GFbox = '',
            GFoutput = '',            
            referatBox = "",
            referatOutput = '';

            //Opsætter dato udfra sidste ændret dato
            function modDato(item) {
                let mod = item.modified, //Data på sidste gange der er sket ændringer.
                    splitMod1 = mod.split("T");
                    splitMod2 = splitMod1[0].split("-"),
                    day = Number(splitMod2[2]),
                    month = Number(splitMod2[1]),
                    year = Number(splitMod2[0]),
                    nonNumberMonth = numberToMonth(month),
                    output = day + '. ' + nonNumberMonth + ' ' + year;
                    return output;
            }

            //Skaber kasse til hver referat
            referatListe.forEach(referat => {
                let overskrift = referat.acf.overskrift,
                    dato = modDato(referat),
                    link = referat.acf.link;
                referatBox = '<div class="referatBox hideReferat"><h3>' + overskrift + '</h3><h5>Sidst ændret den ' + dato + '</h5><a href="' + link + '">ÅBEN</a></div>';
                referatOutput += referatBox;
                
            })

            GFliste.forEach(referat => {
                let overskrift = referat.acf.overskrift,
                    dato = modDato(referat),
                    link = referat.acf.link;

                GFbox = '<div class="GFbox hideReferat"><h3>' + overskrift + '</h3><h5>Sidst ændret den ' + dato + '</h5><a href="' + link + '">ÅBEN</a></div>';
                GFoutput += GFbox;
            })

            //Skaber alt indholde til referater
            let
            rData = findPost.acf[12],
            gData = findPost.acf[13],
            referatBestyrelse = '<article id="referatContent">' + referatOutput + '<div id="btnDiv1"><button type="button" id="referatBtnReverse1">&#60;</button><button type="button" id="referatBtn1">&#62;</button></div></article></section>',
            GFbestyrelse = '<article id="GFcontent">' + GFoutput + '<div id="btnDiv2"><button type="button" id="referatBtnReverse2">&#60;</button><button type="button" id="referatBtn2">&#62;</button></div></article></section>',
            
            //#1
            referat =  '<section id="referat"><article><h2>' + rData[0] + '<h2><p>' + rData[1] + '</p><button type="button" id="referatShowHideBtn">MERE INFORMATION</button></article>';
            referat += '<section id="referatContainer"><section><article id="clickReferat1"><h3>' + rData[0] +'</h3><span>&#10095;</span></article>' + referatBestyrelse,
            referat += '<section><article id="clickReferat2"><h3>' + gData[2] +'</h3><span>&#10095;</span></article>' + GFbestyrelse + '</section>';
            
            //Laver HTML
            createHTML("main", begivenheder + medlemmer + referat);
            
            //Sørger for at 6 referater bliver vist "onload"
            let referatBoxListe = document.querySelectorAll(".referatBox"),
                GFboxListe = document.querySelectorAll(".GFbox");

            for (let i = 0; i < 6; i++) {
                referatBoxListe[i].classList.remove("hideReferat");
            }
            for (let i = 0; i < 1; i++) {
                GFboxListe[i].classList.remove("hideReferat");
            }
        
        }
        //******************************
        //Til SNV UNGDOM - Undervisning
        function makeUngUndervisning () {

            let 
            postID = Number(postData.acf.id.categories.ungdom_undernav[0]),
            findPost = data.find(post => post.id == postID),
            krummer = '<div class="krumme"><a href="?pageId=' + IDafdelinger[0] + '">' + IDbannerAfdelinger[0] + '</a><span> &#62; </span><a href="' + IDungdom[0] + '">' + IDbannerUngdom[0] + '</a></div>',
            liste = findPost.acf.liste_ul,
            billede = findPost.acf.billede,
            //Data: Aldersgruppe 1
            sec1 = findPost.acf.aldersgruppe_1,
            sec1Title = sec1[0],
            sec1Alder1 = sec1[1],
            sec1Alder2 = sec1[2],
            sec1Tekst = sec1[3],
            sec1Img = sec1[4],
            //Data: Aldersgruppe 2
            sec2 = findPost.acf.aldersgruppe_2,
            sec2Title = sec2[0],
            sec2Alder1 = sec2[1],
            sec2Alder2 = sec2[2],
            sec2Tekst = sec2[3],
            sec2Img = sec2[4],
            liER = '',
            section1 = '<section id="ungAldersgruppe1"><div><h3>' + sec1Title + '</h3><h4>' + sec1Alder1 + ' - ' + sec1Alder2 + ' år</h4></div><p>' + sec1Tekst + '</p><img src="' + sec1Img + '" alt="Billede til aldersgruppen ' + sec1Alder1 + ' - ' + sec1Alder2 + ' år"></<section>',
            section2 = '<section id="ungAldersgruppe2"><div><h3>' + sec2Title + '</h3><h4> Fra ' + sec2Alder1 + ' år</h4></div><p>' + sec2Tekst + '</p><img src="' + sec2Img + '" alt="Billede til aldersgruppen ' + sec2Alder1 + ' - ' + sec2Alder2 + ' år"></<section>';
                
            // Laver indhold til Ul
            for(let i = 0; i < liste.length; i++) {
                liER += '<li>' + liste[i] + '</li>';
            }

            let sprgData = data.find(post => post.id == Number(postData.acf.id.categories.ungdom_undernav[0])),
            sprgFooter = '<section><h3>' + sprgData.acf.sporgsmal[0] + '</h3><p>' + sprgData.acf.sporgsmal[1] + '</p><p>Email: <a href=""></a>' + sprgData.acf.sporgsmal[2] + '</p></section>';
      

            //Samler alt indhold til Ungdom Undervisning
            let main = krummer + '<section><article><h2>' + IDbannerUngdom[3][0] + '</h2><ul>' + liER + '</ul></article><img src="' + billede + '" alt="Billede til Undervisning - Ungdom"></section>' + section1 + section2;

            createHTML("main", main + sprgFooter)
        }

        //**************************************
        //Til Sejlerskolen Voksne - Undervisning
        function makeSejlUndervisning() {
            let
            postID = IDsejlklub[0],
            findPost = data.find(post => post.id == postID),
            dataArray = [findPost.acf.undervisning, findPost.acf.nye_elever, findPost.acf.erfarende_elever],

            // Arrays til de forskellige slags data
                //Skaber array med indhold til alle både i mini-galleriet.
                skibeArray = new Array ();
                for (let i = 2; i < 6; i++) { // i = der hvor data i arrayet start(Der er data omkring 4 både)
                    // Arrayet indeholder info omkring: Billede, Type af Båd, Model Type, Sejl Nr
                    let nySkib = [dataArray[0].tekst_mini_galleri[i][0], dataArray[0].tekst_mini_galleri[i][1][0], dataArray[0].tekst_mini_galleri[i][1][1], dataArray[0].tekst_mini_galleri[i][1][2]];
                    skibeArray.push(nySkib)
                }
                //Skaber array med alle brugbare Links
                let linkArray = new Array(), // new skaber et ny blankt object. Array er pre-determined, men man kunnse også kalde den "link".
                    links = dataArray[0].applink.link;
                links.forEach(link => {
                    //Array indeholder: Link Tekst, Link Beskrivelse, Link til den relevante Hjemmesiden
                    let linkData = [link[0], link[1], link[2]]
                    linkArray.push(linkData)
                })
                //Skaber array med alle brugbare Apps
                let appArray = new Array(), // new skaber et ny blankt object. Array er pre-determined, men man kunnse også kalde den "link".
                    apps = dataArray[0].applink.app;
                apps.forEach(app => {
                    //Array indeholder: Billede, Navn, Link
                    let appData = [app[0], app[1], app[2]]
                    appArray.push(appData)
                })

            //Laver objekter med alt information til alle undersider
            let 
            //Data til UnderNavigation - Undervisning
            uData = {
                "intro": {
                    "title1": dataArray[0].tekst_gruppe_1[1],
                    "title2": dataArray[0].tekst_gruppe_1[3],
                    "beskriv1": dataArray[0].tekst_gruppe_1[2],
                    "beskriv2": dataArray[0].tekst_gruppe_1[4],
                    //Dulighedstitle
                    "ulTitle": dataArray[0].tekst_liste_1[0],
                    //Ul1
                    // "ul1": dataArray[0].tekst_liste_1[1],
                    // "li1Array": [dataArray[0].tekst_liste_1[2], dataArray[0].tekst_liste_1[3],dataArray[0].tekst_liste_1[4],dataArray[0].tekst_liste_1[5]],
                    // //Ul2
                    // "ul2": [dataArray[0].tekst_liste_1[6]]
                },

                "galleri": {
                    "title": dataArray[0].tekst_mini_galleri[0],
                    "beskriv": dataArray[0].tekst_mini_galleri[1],
                    "skibe": skibeArray
                },

                "elever": {
                    //Indeholder: Overskrift, Beskrivelse og Billede
                    "nye": [dataArray[0].nye_elever[0], dataArray[0].nye_elever[1], dataArray[0].nye_elever[2]],
                    "erfarende": [dataArray[0].erfarende_elever[0], dataArray[0].erfarende_elever[1], dataArray[0].erfarende_elever[2]],
                },

                "link": {
                    "title": dataArray[0].applink.intros[0][0],
                    "beskriv": dataArray[0].applink.intros[0][1],
                    "links": linkArray
                },

                "app": {
                    "title": dataArray[0].applink.intros[1][0],
                    "beskriv": dataArray[0].applink.intros[1][1],
                    "app": appArray
                }
            },

            //Skaber liste med billeder
                imgList = '';
            uData.galleri.skibe.forEach(skib => {
                imgList += '<article><img src="' + skib[0] + '" alt="Billede af bådmodellen: ' + skib[1] + '"><div><h4>' + skib[1] + '</h4><ul><li>' + skib[2] + '</li><li>' + skib[3] + '</li></ul></div></article>'
            });

            //Skaber og samler hovedindholdet
            let intro = '<section id="introSejlUndervisning"><article><h2>' + uData.intro.title1 + '</h2><p>' + uData.intro.beskriv1 + '</p></article><article><h2>' + uData.intro.ulTitle + '</h2><p>' + uData.intro.beskriv2 + '</p></article></section>',
                galleri = '<section id="galleriSejlUndervisning"><article><h2>' + uData.galleri.title + '</h2><p>' + uData.galleri.beskriv + '</p></article><section>' + imgList + '</section></section>',
                nye = '<section id="nyeSejlUndervisning"><h2>' + uData.elever.nye[0] + '</h2><article><p>' + uData.elever.nye[1] + '</p><button type=button id="nyeClick">LÆS MERE</button></article><img src="' + uData.elever.nye[2] + '" alt="Billede til ' + uData.elever.nye[0] + '"></section>',
                erfarende = '<section id="erfarendeSejlUndervisning"><h2>' + uData.elever.erfarende[0] + '</h2><article><p>' + uData.elever.erfarende[1] + '</p><button type=button id="erfarendeClick">LÆS MERE</button></article><img src="' + uData.elever.erfarende[2] + '" alt="Billede til ' + uData.elever.erfarende[0] + '"></section>',
                
                //Skaber liste med Articles som indeholder links og beskrivelse
                linkList = '<section>';
                uData.link.links.forEach(list => {
                    linkList += '<article><a href="' + list[2] + '">' + list[0] + '</a><p>' + list[1] + '</p></article>'
                })
                linkList += '</section>';
                let linkArea = '<article id="linkArea"><h2>' + uData.link.title + '</h2><p>' + uData.link.beskriv + '</p>' + linkList + '</article>',

                //Skaber liste med Articles som indeholder links(Apple Store) og beskrivelse + billede til appen
                appList = '<section>',
                appBox1 = '<article><h3>Sikkerhed</h3><div>',
                appBox2 = '<article><h3>Fællesskab på vandet</h3><div>',
                appBox3 = '<article><h3>Knob</h3><div>',
                appBox4 = '<article><h3>Vejr og Vind</h3><div>';
                //Opsætter alle Apps i den rette rækkefølge og i de rette bokse
                for (let i = 0; i < 2; i++) {
                    appBox1 += '<a href="' + uData.app.app[i][2] + '" class="appBox"><img src="' + uData.app.app[i][0] + '" alt="Billede til appen: ' + uData.app.app[i][1] + '"><h4>' + uData.app.app[i][1] + '</h4></a>';
                }
                for (let i = 2; i < 3; i++) {
                    appBox2 += '<a href="' + uData.app.app[i][2] + '" class="appBox"><img src="' + uData.app.app[i][0] + '" alt="Billede til appen: ' + uData.app.app[i][1] + '"><h4>' + uData.app.app[i][1] + '</h4></a>';
                }
                for (let i = 3; i < 5; i++) {
                    appBox3 += '<a href="' + uData.app.app[i][2] + '" class="appBox"><img src="' + uData.app.app[i][0] + '" alt="Billede til appen: ' + uData.app.app[i][1] + '"><h4>' + uData.app.app[i][1] + '</h4></a>';
                }
                for (let i = 5; i < 7; i++) {
                    appBox4 += '<a href="' + uData.app.app[i][2] + '" class="appBox"><img src="' + uData.app.app[i][0] + '" alt="Billede til appen: ' + uData.app.app[i][1] + '"><h4>' + uData.app.app[i][1] + '</h4></a>';
                }
                appList += appBox1 + appBox2 + appBox4 + appBox3;
                
                //Samler indhold
                let appArea = '<article id="appArea"><article><h2>' + uData.app.title + '</h2><p>' + uData.app.beskriv + '</p></article>' + appList + '</article>',
                krummer = '<div class="krumme"><a href="?pageId=' + IDafdelinger[0] + '">' + IDbannerAfdelinger[0] + '</a><span> &#62; </span><a href="?pageId=' + IDsejlklub[0] + '">' + IDbannerSejlerskolen[0] + '</a></div>',
                main = krummer + intro + galleri + nye + erfarende + '<section class="blueBox">' + linkArea + appArea + '</section>';

    
            
            createHTML("main", main)
        }
        //*******************
            //Til Bliv Medlem - Conventus
            function makeConventus() {
                let 
                postID = IDblivmedlem[0],
                findPost = data.find(post => post.id == postID),
                dataArray = [findPost.acf.conventus, findPost.acf.tilmelding, findPost.acf.mentor],
    
                //Array med Medlems Typer
                profilArray = new Array();
                dataArray[0][5].forEach(each => {
                    let pushIt = [each[0], each[1]]
                    profilArray.push(pushIt)
                })
                
    
                let ds = {
                    "intro": {
                        "title": dataArray[0][0],
                        "under": dataArray[0][1],
                        "konti": dataArray[0][2],
                        "kBeskriv1": dataArray[0][3],
                        "kBeskriv2": dataArray[0][4],
                    },
    
                    "profil": {
                        "title": dataArray[0][5][3],
                        "obs": dataArray[0][5][4],
                        "aMedlem": [dataArray[0][5][0][0], dataArray[0][5][0][1]],
                        "bMedlem": [dataArray[0][5][1][0], dataArray[0][5][1][1]],
                        "cMedlem": [dataArray[0][5][2][0], dataArray[0][5][2][1]],
                        "array": profilArray
                    },
                    
                    "data": {
                        "title": dataArray[0][6][0],
                        "beskriv1": dataArray[0][6][1],
                        "beskriv2": dataArray[0][6][2],
                    },
    
                    "sprg": {
                        "title": dataArray[0][7][0],
                        "beskriv": dataArray[0][7][1],
                        "email": dataArray[0][7][2],
                    }
                },
                intro = '<section><h2>' + ds.intro.title + '</h2><p>' + ds.intro.under + '</p></section>',
                profil = '<section><section><h2>' + ds.profil.title + '</h2><p>' + ds.profil.obs + '</p></section><article><div class="blueShape"><h3>' + ds.profil.aMedlem[0] + '</h3></div><p>' + ds.profil.aMedlem[1] + '</p><a href="">Tilmeld</a></article>';
                profil += '<article><div class="blueShape"><h3>' + ds.profil.bMedlem[0] + '</h3></div><p>' + ds.profil.bMedlem[1] + '</p><a href="">Tilmeld</a></article>';
                profil += '<article><div class="blueShape"><h3>' + ds.profil.cMedlem[0] + '</h3></div><p>' + ds.profil.cMedlem[1] + '</p><a href="">Tilmeld</a></article></section>';
    
                let outro = '<section><article><h3>' + ds.intro.konti + '</h3><p>' + ds.intro.kBeskriv1 + '</p><p>' + ds.intro.kBeskriv2 + '</p></article>';
                outro += '<article><h3>' + ds.data.title + '</h3><p>' + ds.data.beskriv1 + '</p><p>' + ds.data.beskriv2 + '</p></article><article><h3>' + ds.sprg.title + '</h3><p>' + ds.sprg.beskriv + '</p><p>E-Mail: <a href="mailto:' + ds.sprg.email + '">' + ds.sprg.email + '</a></p></article></section>';
                
    
                let main = intro + profil + outro;
    
                createHTML("main", main)
            }

        //== Skaber Navigation med alt indhold:
        let nr = 0,
            underUl = document.createElement("ul");
            underUl.id = "ulUnderNav"
            navListe = makeList,
            nrID = 1;
        for (let i = 0; i < numberForLoop; i++) {
            let idName;
            // Giver et mere unikt id i stedet for bare et tal.
            switch (nrID) {
                case 1:
                    idName = "one"
                    break;
                case 2:
                    idName = "two"
                    break;
                case 3:
                    idName = "three"
                    break;
                case 4:
                    idName = "four"
                    break;
                case 5:
                    idName = "five"
                    break;
            }
            let li = document.createElement("li");
                li.classList.add('underNav');
                li.id = idName;
                li.textContent = navListe[nr];
            if (i === 0) {
                li.classList.add("selected");
                
                if (window.location.href.indexOf(IDomklubben[0]) != -1) {
                    makeBestyrelsen();
                }
                if (window.location.href.indexOf(IDungdom[0]) != -1) {
                    makeUngUndervisning();
                }
                if (window.location.href.indexOf(IDsejlklub[0]) != -1) {
                    makeSejlUndervisning();
                }
                if (window.location.href.indexOf(IDblivmedlem[0]) != -1) {
                    makeConventus();
                }


            }
            underUl.appendChild(li);
            addAndRemove(li);
            nr++;
            nrID++;
        }
        //== Skaber de sidste elementer til at skabe Undernavigationen.

        // let underNavigation = document.createElement("section");
        // underNavigation.id = "underNavigation";
        // document.querySelector("header").after(underNavigation);

        document.querySelector("#underNavContent").appendChild(underUl);
    }

     //========================== FIND ID AND PAGE INFORMATION
    let currentID = getURL();
    function getURL () {
        let id = 0;
        const pageURL = window.location.href;    //Pathname kigger op indtil ?pageId=, til gengæld virker .href (På studie serveren ville det være https://mmd.ucn.dk/) og .search fint.
        console.log(pageURL)
        
        if(pageURL.indexOf("pageId") != -1) {      // Hvis pageURL indeholder pageId, og -1 ikke er true, så skal if sætningen bruges. 
            let split = pageURL.split("pageId=");
            id = split[1];
        }
        console.log("Det her er pageID = ", id)
    
        return id;
    }

    function findCurrent (current) {
        let currentSite = data.find(site => site.id == current); // Kigger på current(Kunne være f.eks 0), og skal finde en post i vores data-set som matcher.
        return currentSite; // Den skal give den post som matcher tilbage til den som spurgte, her ville det være hvem end som brugte function findCurrent. Den vil så give hele JSON objektet som mathcer id'et.
    }

    //========================== MAKE ADDONS
    function makeTitle (current) {
        let split = current.title.rendered.split("Private: "),
            title = split[1];
            document.title = title + " - SNV.dk"; // Titlen skal være den rette posts title minus Private: , så puttes foran af WordPress, men som vi ikke skal bruge.
    }


    let obj1 = {
        "overskrift": data.overskrift,
        "brodtekst": data.brodtekst,
        "billede": data.billede
    }


    function makeNavigation (current) {
        let navigationlist = postData.acf.id.categories.navigationlist,
            allNav = '<nav>',
            navigation = '<ul>';
        //== LIST OF NAV POSTS
        navigationlist.forEach(navID => {// Skal lave en <li> for hver element i natPosts, og give en class med et nummer som vi kan ramme senere.
            let site = data.find(post => post.id == navID), //Leder alle vores posts(som matcher SNV.dk ID'et) som kan findes i vores liste af ID'er. Vi kunne også have kigget efter posts som matcher vores SNV.dk - Navigation ID, men vi har mest kontrol på denne måde.
                siteTitleSplit = site.title.rendered.split("Private: "),
                siteTitle = siteTitleSplit[1],
                siteTitleNoSpace = siteTitle.replace(" ", ""),// Fjerner "whitespace"/mellemrum fra stringen.
                currentPage = "";
            //== Tilføjer currentPage class, til Nav-element som matcher current(Altså den aktive side på dette tidspunkt).
            if (site.id == current) {
                currentPage = 'class="currentPage"';
            }
            //== Skaber HTML elementer med information fra hver Post som matcher ID'et.
            navigation += '<li id="nav_' + siteTitleNoSpace +'" ' + currentPage +'><a href="?pageId=' + site.id +'">' + siteTitle +'</a></li>';
        })
        navigation += '</ul>';

        //== Mobil/Tablet and Desktop Mediaqueries
        if (mobil.matches || tablet.matches) { //Matches går ind og kigger på vores MediaQueryString og ser om den "matcher", altså om den er rigtig i forhold til window.innerWidth.
            let
            btn = document.createElement("section"), topLayer = document.createElement("div"), midLayer = document.createElement("div"), botLayer = document.createElement("div"),
            curtain = document.createElement("section"), nav = document.createElement("nav"), logoDiv = document.createElement("div"), logoA = document.createElement("a"), logoImg = document.createElement("img");

            //Button
            btn.id = "burgerBtn";
            topLayer.classList.add("burger"); midLayer.classList.add("burger"); botLayer.classList.add("burger");
            topLayer.id = "topLayer"; midLayer.id = "midLayer"; botLayer.id = "botLayer";
            btn.append(topLayer, midLayer, botLayer)

            // Logo
            logoImg.src = logo;
            logoImg.alt = "Logo tilhørende SNV.dk - Tekst og det ikoniske rødeflag med 3 stjerner";
            logoA.href = '?pageId=' + IDforside[2];
            logoA.appendChild(logoImg);
            logoDiv.appendChild(logoA);
            
            //Curtain
            nav.innerHTML = navigation;
            nav.id = "burgerNav"
            curtain.id = "curtain";
            curtain.appendChild(nav)
            document.querySelector("#header").append(logoDiv, btn, curtain);

            btn.addEventListener("click", ()=> {
                //Inspiration : https://stackoverflow.com/questions/46983030/how-to-check-classname-in-a-switch-statement-when-an-element-has-multiple-classe
                let cc = curtain.classList,
                    allLayers = document.querySelectorAll(".burger");

                switch(true) {
                    case cc.contains("hideCurtain"):
                        curtain.classList.remove("hideCurtain")
                        curtain.classList.add("showCurtain")

                        allLayers.forEach(layer => {layer.classList.remove("burgerBtnEnd")})
                        allLayers.forEach(layer => {layer.classList.add("burgerBtnStart")})

                        nav.classList.remove("hideNav");
                        nav.classList.add("showNav");
                        //Bruger display = block i JS, fordi man kan ikke ændre på det med Keyframes.
                        nav.style.display = "block";
                        break;
                    case cc.contains("showCurtain"):
                        curtain.classList.remove("showCurtain")
                        curtain.classList.add("hideCurtain")

                        allLayers.forEach(layer => {layer.classList.remove("burgerBtnStart")})
                        allLayers.forEach(layer => {layer.classList.add("burgerBtnEnd")})

                        nav.classList.remove("showNav");
                        nav.classList.add("hideNav");
                        nav.style.display = "none";
                        break;
                    default:
                        curtain.classList.add("showCurtain")

                        allLayers.forEach(layer => {layer.classList.add("burgerBtnStart")})

                        nav.classList.remove("hideNav");
                        nav.classList.add("showNav");
                        nav.style.display = "block";
                }
               
            })
            


            if (mobil.matches) {
                console.log("Layout: Mobile Version")
            }
            if (tablet.matches) {
                console.log("Layout: Tablet Version")
            }
        } 
        if (!mobil.matches && !tablet.matches) {
            console.log("Layout: Desktop Version")
            let loginContainer = document.createElement("section"), loginH4 = document.createElement("h4");
            // Login
            loginH4.textContent = "Medlemslogin";
            loginContainer.id = "login";
            loginContainer.appendChild(loginH4)

            allNav += '<div><a href="?pageId=' + IDforside[2] + '"><img src="' + logo +'" alt=""></a></div>';
            allNav += navigation + '</nav>';
            document.querySelector("#header").appendChild(loginContainer)
            addToHTML("#header", allNav);
        }
    }
    function makeSponsor () {
        let 
        infiChildren = postData.acf.billeder[1];
        
        //Create Elements
        let
        sponsorContainer = document.createElement("section"), ul = document.createElement("ul");
        ul.id = "sponsorUl";
        sponsorContainer.id = "sponsorContainer";
      
        //Stærkt inspiret af:https://codepen.io/Coding_Journey/pen/yWjWKd
        infiChildren.forEach(child => {

                let li = document.createElement("li"), img = document.createElement("img"), a = document.createElement("a");
                a.href = child[0];
                img.src = child[1];
                img.alt = "Billede til sponsor Galleri";
                a.appendChild(img)
                li.appendChild(a)
                ul.append(li)
            
        })
        //document.documentElement går ind og rammer root elementet. I dette filfælde er det HTML, og CSS :root kan findes der.
        let liDisplayed = getComputedStyle(document.documentElement).getPropertyValue("--sponsor-display");

        sponsorContainer.appendChild(ul)
        document.querySelector("#sponsorSection").appendChild(sponsorContainer);
        for (let i = 0; i < liDisplayed; i++) {
            ul.appendChild(ul.children[i].cloneNode(true))
        }
    }
    function makeFooter () {
        let 
        splitEmail = postData.acf.footer[0][1].split(": "),
        email = [splitEmail[0], splitEmail[1]],

        //Data til footeren
        fD = {
            "title": postData.acf.footer[0][0],
            "email": email,
            "adresse": postData.acf.footer[0][2],
            //Indeholder Link og Billede til facebook. Logoet kommer fra: https://fontawesome.com/v5.15/icons/facebook?style=brands, lavet fra SVG om til PNG, for at kunne ligge på WordPress.
            "fb": [postData.acf.footer[1][0], postData.acf.footer[1][1]]
        },

        //Indhold til Address
        address = '<address><h2>' + fD.title + '</h2><ul><li>' + fD.email[0] + '<a href="mailto:' + fD.email[1] + '">' + fD.email[1] + '</a>' + '</li><li>' + fD.adresse + '</li></ul></address>',
        footerNav = '<nav><ul>',
        navigationlist = postData.acf.id.categories.navigationlist,

        //== Finder data omkring Forsiden.
        forside = data.find(post => post.id == IDforside[2]), //Leder alle vores posts(som matcher SNV.dk ID'et) som kan findes i vores liste af ID'er. Vi kunne også have kigget efter posts som matcher vores SNV.dk - Navigation ID, men vi har mest kontrol på denne måde.
        forsideTitleSplit = forside.title.rendered.split("Private: "),
        forsideTitle = forsideTitleSplit[1];
        
        //== Skaber Forside + Nav-List 
        footerNav += '<li><a href="?pageId=' + IDforside[2] + '">' + forsideTitle + '</a></li>';
        navigationlist.forEach(navID => {
            let site = data.find(post => post.id == navID),
            siteTitleSplit = site.title.rendered.split("Private: "),
            siteTitle = siteTitleSplit[1],
            currentPage = "";
            //== Skaber HTML elementer med information fra hver Post som matcher ID'et.
            footerNav += '<li id="nav-' + siteTitle +'" ' + currentPage + '><a href="?pageId=' + site.id +'">' + siteTitle +'</a></li>';
        })
        footerNav += '</ul></nav>'

        let footer = address + footerNav + '<a href="' + fD.fb[0] + '" target="_blank"><img src="' + fD.fb[1] + '" alt="Logo til Facebook"></a>';
        createHTML("footer", footer);
    }


    //========================== ALLE TEMPLATES
    function makeForside (current) {

        let forside = data.find(post => post.id == IDforside[2]), 
            allHTML, hero = "", news = "", events = "", afdeling = '<section id="afdeling"><h2>' + forside.acf.overskrifter[3] + '</h2>', sponsor = "";
        const nyhedsList = data.filter(post => post.categories.includes(IDnyhedtemplate[0]));
        
        //== Skaber Hero Banner
        createHeroSlide();
        console.log(nyhedsList)
        //== Skaber Nyhedsindlæg
        news += '<section id="news"><h2>' + forside.acf.overskrifter[1] + '</h2><div id="newsPost">';
        for (let i = 0; i < 3; i++) { //Kan bruge nyhedsList.length, men vi vil gerne kun have vidst 3 på forsiden så vi bruger i < 3, som giver os et loop på 3(Selvom en starter på 0). 
            let overskrift = nyhedsList[i].acf.overskrift,
                tekst = nyhedsList[i].acf.brodtekst_box[0],
                tekstSub;
            //== Bestemmer mængden af tekst som bliver fremvist  
            for (let i = 0; i < 150; i++) { // Inspiration fra https://stackoverflow.com/questions/36770446/javascript-loop-adding-a-letter-every-time
                tekstSub = tekst.substring(0, i + 1); //Substring vælger dele fra en string, her siger vi at den skal starte på 0, og for hver loop bliver tallet som den skal stoppe ved højere(+1). Det betyder at i for-loopet kan vi bestemme hvor mange tegn skal vises.
            }
            news += '<article class="newsBox"><img src="' + nyhedsList[i].acf.billede_galleri[0] + '" alt="Billede til nyheden: ' + overskrift + '"><section class="newsBoxInsideSection"><section><h3>' + overskrift + '</h3><p>' + tekstSub + ' ...</p></section><div><a href="?pageId=' + nyhedsList[i].id + '">SE MERE</a></div></section></article>';
        }
        news += '</div><article id="forsideNewsBtn"><a href="?pageId=' + IDnyheder[0] + '">SE NYHEDSOVERSIGT</a></article></section>';
        
        //== Skaber Events
        events += '<section id="events"><h2>' + forside.acf.overskrifter[2] + '</h2><div id="eventPosts">';
        //== Sortering og HTML til hvert "card/kort"
        let eventList = data.filter(post => post.categories.includes(IDeventtemplate)),
            sortedList = sortNew(eventList);
        for (let i = 0; i < 2; i++) {
            //== Lav måned om til bogstaver fra tal.
            let splitDate = sortedList[i].acf.dato[0].split("/"), // Spliter ved begge /
                splitTid1 = sortedList[i].acf.tid[0].split(":"),
                splitTid2 = sortedList[i].acf.tid[1].split(":"),
                month = Number(splitDate[1]), // Skal bruge talende i midten 00/00(Dem her)/00. Plus vi skal bruge Number så det ikke bare er en string med et "Tal".
                day = splitDate[0],
                title = sortedList[i].acf.overskrift,
                dato = [sortedList[i].acf.dato[0], sortedList[i].acf.dato[1]],
                tid = [splitTid1[0] + ':' + splitTid1[1], splitTid2[0] + ':' + splitTid2[1]], //Vi har ikke brug for de sidste 2 decimaler.
                sted = sortedList[i].acf.sted;
            
            events += '<article class="eventBox"><h3>' + day + '. <span class="spanTable">' + numberToMonth(month) + '</span></h3><section><h4>' + title + '</h4><ul><li><i>Dato:</i> ' + dato[0] + ' - ' + dato[1] + '</li><li><i>Tid:</i> ' + tid[0] + ' - ' + tid[1] + '</li></ul><a href="?pageId=' + sortedList[i].id + '">SE MERE</a></section></article>'
        }
        events += '</div><article id="eventsSeMere"><a href="?pageId=' + IDbegivenheder[0] + '">SE FLERE</a></article></section>'
       
        //== Skaber Afdelinger
        let objAfdeling = { //Indeholder data til de forskellige under-Afdelinger.
            underafdeling_UngSejl: [IDbannerUngdom, IDbannerSejlerskolen],
            underafdeling_KapJ70: [IDbannerAfdelinger[3], IDbannerAfdelinger[4]],
            ids: [postData.acf.id.categories.underafdelinger[0], postData.acf.id.categories.underafdelinger[1]]
        },
        ekstraText = [postData.acf.bannerdata[1][6], postData.acf.bannerdata[1][7]],
        nrInArray = 0;
        afdeling += '<div id="afdelingFlex">';

        objAfdeling.underafdeling_UngSejl.forEach(item => {
            afdeling += '<article class="afdelingBox"><div class="afdelingOverlay"></div><section class="afdelingTextContainer"><div><h3>' + item[0] + '</h3><p>' + ekstraText[nrInArray] + '</p></div><a href="?pageId=' + objAfdeling.ids[nrInArray] + '">SE MERE</a></section><img src="' + item[2] + '" alt=""></article>';
            nrInArray++;
        })
        objAfdeling.underafdeling_KapJ70.forEach(item => {
            afdeling += '<article class="afdelingBox"><div class="afdelingOverlay"></div><section class="afdelingTextContainer"><div><h3>' + item[0] + '</h3><p>' + item[1] + '</p></div><a href="">SE MERE</a></section><img src="' + item[2] + '" alt=""></article>';
        })
        afdeling += '</div></section>';

        allHTML = hero + news + events + afdeling;
        addToHTML("main", allHTML)
    }
    function makeOmklubben (current) {
        let omklubben = '<article id="heroLille"><h1>' + IDbannerOmklubben[0] + '</h1><p>' + IDbannerOmklubben[1] + '</p><img src="' + IDbannerOmklubben[2] + '" alt="Billede til Header - Om Klubben"></article>';

        //Laver Section til UnderNav
        makeUnderNavSection();
        createHTML("#underNavContent", omklubben);
        //== Laver Undernavigation med knapper og eventlisteners
        makeUnderNavigation(IDbannerOmklubben[3], IDbannerOmklubben[3].length); // (Array som skal indeholder overskrifter til UnderNavigation, mængden af loops som skal laves)
    }

    function makeAfdelinger(current) {
        let ds = IDbannerAfdelinger,
            overskrift = ds[0],
            beskrivelse = ds[1],
            billede = ds[2],
            velkomstTekst = ds[5],
            main = '<section><h2>' + overskrift + '</h2><p>' + velkomstTekst + '</p></section>',
            krumme = '<div class="krumme"><a href="?pageId=' + IDafdelinger[0] + '">' + overskrift + '</a></div>',
            afdelingHeader = '<header id="heroLille"><h1>' + overskrift + '</h1><p>' + beskrivelse + '</p><img src="' + billede + '" alt="Billede til Header - Afdelinger">';
            main += krumme;
        
        
        //== (Dette kode er også blevet brugt på forsiden)
        let
        afdeling = '<section id="afdelingFlex">',
        objAfdeling = { //Indeholder data til de forskellige under-Afdelinger.
                underafdeling_UngSejl: [IDbannerUngdom, IDbannerSejlerskolen],
                underafdeling_KapJ70: [IDbannerAfdelinger[3], IDbannerAfdelinger[4]],
                ids: [postData.acf.id.categories.underafdelinger[0], postData.acf.id.categories.underafdelinger[1]]
        },
        nrInArray = 0;

        // Skaber de to kasser som linker videre
        objAfdeling.underafdeling_UngSejl.forEach(item => {
            afdeling += '<article class="afdelingBox"><div class="afdelingOverlay"><h3>' + item[0] + '</h3><p>' + item[1] + '</p><a href="?pageId=' + objAfdeling.ids[nrInArray] + '">SE MERE</a><img src="' + item[2] + '" alt=""></article>';
            nrInArray++;
        })
        // Skaber de to kasser til afdelinger som ikke er på domænet i denne version.
        objAfdeling.underafdeling_KapJ70.forEach(item => {
            afdeling += '<article class="afdelingBox"><div class="afdelingOverlay"><h3>' + item[0] + '</h3><p>' + item[1] + '</p><a hrefSE MERE=""></a><img src="' + item[2] + '" alt=""></article>';
        }) 
        afdeling += '</section>';
        main += afdeling;

        createHTML("main", afdelingHeader + main)
    }

    function makeUngdom() {
        let ungdom = '<article id="heroLille"><h1>' + IDbannerUngdom[0] + '</h1><p>' + IDbannerUngdom[1] + '</p><img src="' + IDbannerUngdom[2] + '" alt="Billede til Header - SNV Ungdom"><a href="?pageId=' + IDblivmedlem[0] + '">Tilmelding</a></article>';
        
        //Laver Section til UnderNav
        makeUnderNavSection();
        createHTML("#underNavContent", ungdom);
        //== Laver Undernavigation med knapper og eventlisteners
        makeUnderNavigation(IDbannerUngdom[3], IDbannerUngdom[3].length); // (Array som skal indeholder overskrifter til UnderNavigation, mængden af loops som skal laves)
    }
    function makeSejlerskolen() {
        let sejl = '<article id="heroLille"><h1>' + IDbannerSejlerskolen[0] + '</h1><p>' + IDbannerSejlerskolen[1] + '</p><img src="' + IDbannerSejlerskolen[2] + '" alt="Billede til Header - Sejlskolen Voksne"></article>';
        
        //Laver Section til UnderNav
        makeUnderNavSection();
        createHTML("#underNavContent", sejl);
        //== Laver Undernavigation med knapper og eventlisteners
        makeUnderNavigation(IDbannerSejlerskolen[3], IDbannerSejlerskolen[3].length); // (Array som skal indeholder overskrifter til UnderNavigation, mængden af loops som skal laves)
    }

    function makeBlivmedlem(current) {
        let medlem = '<article id="heroLille"><h1>' + IDbannerBlivmedlem[0] + '</h1><p>' + IDbannerBlivmedlem[1] + '</p><img src="' + IDbannerBlivmedlem[2] + '" alt="Billede til Header - Bliv Medlem"><a href="?pageId=' + IDblivmedlem[0] + '">Tilmelding</a></article>';
        
        //Laver Section til UnderNav
        makeUnderNavSection();
        createHTML("#underNavContent", medlem);
        //== Laver Undernavigation med knapper og eventlisteners
        makeUnderNavigation(IDbannerBlivmedlem[3], IDbannerBlivmedlem[3].length); // (Array som skal indeholder overskrifter til UnderNavigation, mængden af loops som skal laves)
    }

    function makeBegivenheder () {
        let 
        header = '<article id="heroLille"><h1>' + IDbannerBegivenhed[0] + '</h1><p>' + IDbannerBegivenhed[1] + '</p><img src="' + IDbannerBegivenhed[2] + '" alt="Billede til Header - Begivenheder"></article>',
        begivenhedsListe = data.filter(post => post.categories.includes(IDeventtemplate)),
        nrInArray = 1;
        sortNew(begivenhedsListe)
        makeUnderNavSection();
        createHTML("#underNavContent", header);

        //Create Elements
        let 
        top = document.createElement("section"),
        topH2 = document.createElement("h2"),
        eventWindows = document.createElement("section");
        eventWindows.id = "eventWindows";
        
        topH2.textContent = "Begivenheder";
        top.appendChild(topH2);
        document.querySelector("main").appendChild(top)

        let 
        display = document.createElement("section");
        display.id = "display";

        begivenhedsListe.forEach(list => {
            //Create Elements
            let
            eventBox = document.createElement("section"),
            eventArticle = document.createElement("article"),
            displayContent = document.createElement("article"),
            datoStor = document.createElement("h3"),
            datoStorBox = document.createElement("div"),
            title = document.createElement("h4"),
            ul = document.createElement("ul"),
            datoLille = document.createElement("li"),
            tid = document.createElement("li"),
            seMere = document.createElement("button"),
            tekstContent = document.createElement("article");

            list.acf.beskrivelser.forEach(beskriv => {
                if (beskriv != "") {
                    let p = document.createElement("p");
                    p.innerText = beskriv;
                    tekstContent.appendChild(p);
                }
            })

            //Lav dato
            let datoData1 = list.acf.dato[0].split("/"),
                day1 = datoData1[0],
                month1 = Number(datoData1[1]),
                datoData2 = list.acf.dato[1].split("/"),
                day2 = datoData2[0],
                month2 = Number(datoData2[1]),
                datoList = day1 + '. ' + numberToMonth(month1) + ' - ' + day2 + '. ' + numberToMonth(month2);
            //Lav tid
            let tidSplit1 = list.acf.tid[0].split(":"),
                tid1 = tidSplit1[0] + '.' + tidSplit1[1];

            //EventBox 
            datoStor.innerText = day1 + '. ' + numberToMonth(month1);
            datoLille.innerText = datoList;
            title.innerText = list.acf.overskrift;
            tid.innerText = tid1;
            seMere.innerText = "SE MERE";
            seMere.id = "seMereBtn_" + nrInArray;
            eventBox.classList.add("eventBox");

            //EventBox - Append
            ul.append(datoLille, tid, seMere);
            eventArticle.append(title, ul);
            
            //Display Content
            let 
            header = document.createElement("section"),
            headerDato = document.createElement("h3"),
            headerTitle = document.createElement("h3"),
            infoList = document.createElement("ul"),
            infoDato = document.createElement("li"),
            infoTid = document.createElement("li"),
            infoSted = document.createElement("li");
            
            headerDato.innerText = day1 + '. ' + numberToMonth(month1);
            headerTitle.innerText = list.acf.overskrift;
            infoDato.innerHTML = '<strong>Dato: </strong>' + datoList;
            infoTid.innerHTML = '<strong>Tid: </strong>' + tid1;
            infoSted.innerHTML = '<strong>Sted: </strong>' + list.acf.sted;

            //Append 
            header.append(headerDato, headerTitle)
            infoList.append(infoDato, infoTid, infoSted)
            displayContent.append(header, infoList, tekstContent)

            datoStorBox.appendChild(datoStor);
            eventBox.append(datoStorBox, eventArticle)

            //Tilføjer til Listen af Events
            eventWindows.appendChild(eventBox)

            //Bestemmer hvordan indhold skal vises og laves alt efter skærmbredden.
            //Desktop
            if (!mobil.matches && !tablet.matches) {
                seMere.addEventListener("click", () => {
                    display.innerHTML = "";//Reset HTML
                    display.classList.add("showing");//Bruges til at kigge på om der bliver vist indhold i display.
                    display.appendChild(displayContent)
                })
            }
            //Mobil / Tablet
            if (mobil.matches|| tablet.matches) {
                let mobilDisplay = document.createElement("section");

                mobilDisplay.appendChild(displayContent);
                eventBox.appendChild(mobilDisplay);

                showBlock(seMere, mobilDisplay);
                

                console.log("Event Template - Mobil / Tablet")
            }
            nrInArray++;
        })
        //Desktop
        if (!mobil.matches && !tablet.matches) {
            let ramme = document.createElement("section");
            ramme.id = "eventRamme";
            ramme.append(eventWindows, display)
            document.querySelector("main").append(ramme);
            //Hvis ingen er selected, så skal der klikkes på det første seMereBtn-element i eventWindows listen
            if (!document.querySelector("#display").classList.contains("showing") != -1) {
                document.querySelector("#seMereBtn_1").click();
            }
        }
        //Mobil / Tablet
        if (mobil.matches|| tablet.matches) { 
            let ramme = document.createElement("section");
            ramme.id = "eventRamme";
            ramme.appendChild(eventWindows)

            document.querySelector("main").append(ramme)
        }
    }
    
    function makeNyheder (current) {//#3
        let
        header = '<article id="heroLille"><h1>' + IDbannerNyheder[0] + '</h1><p>' + IDbannerNyheder[1] + '</p><img src="' + IDbannerNyheder[2] + '" alt="Billede til Header - Begivenheder"></article>',
        krummer = '<div class="krumme"><a href="?pageId=' + IDnyheder[0] + '">' + IDbannerNyheder[0] + '</a></div>',
        //<span> &#62; </span><a href="?pageId=' + IDsejlklub[0] + '">' + IDbannerSejlerskolen[0] + '</a>
        top = '<section><h2>' + IDbannerNyheder[0] + '</h2></section>',
        nyhedsListe = data.filter(post => post.categories.includes(IDnyhedtemplate[0]));

        createHTML("main", top)
        nyhedsListe.forEach(post => {
            //Create Elements
            let card = document.createElement("section"), img = document.createElement("img"), pContent = document.createElement("article"),  h2 = document.createElement("h2"), seMere = document.createElement("a");
            
            //Opsæt Data
            img.src = post.acf.billede_galleri[0]
            img.alt = "Billede til nyheden" + post.acf.overskrift;
            
            h2.textContent = post.acf.overskrift;
            
            post.acf.brodtekst_box.forEach(item => {
                if(item != "") {
                    let p = document.createElement("p");
                    p.textContent = item;
                    pContent.append(p);
                }
            })
            
            seMere.href = "?pageId=" + post.id;
            seMere.textContent = "SE MERE"

            //Append
            card.append(img, h2, pContent, seMere)
            document.querySelector("main").appendChild(card)
        })

    }

    function makeTemplateNyhed(current) {
        let
        postID = data.find(post => post.id == current.id),
        header = '<article id="heroLille"><h2>' + IDbannerNyheder[0] + '</h2><p>' + IDbannerNyheder[1] + '</p><img src="' + IDbannerNyheder[2] + '" alt="Billede til Header - Begivenheder"></article>',
        krummerContent = '<a href="?pageId=' + IDnyheder[0] + '">' + IDbannerNyheder[0] + '</a><span> &#62; </span><a href="?pageId=' + current.id + '">' + current.acf.overskrift + '</a>';
        
        //Create Elements
        let 
        top = document.createElement("section"), ramme = document.createElement("section"), intro = document.createElement("section"), img = document.createElement("img"), 
        h1 = document.createElement("h1"), h2 = document.createElement("h2"), krummer = document.createElement("nav"), pContent = document.createElement("article"),
        snack = document.createElement("p"), author = document.createElement("article");

        //Assign Data
        krummer.classList.add("krumme");
        krummer.innerHTML = krummerContent;
        h2.textContent = IDbannerNyheder[0];
        top.append(krummer, h2)

        img.src = current.acf.billede_galleri[0]
        img.alt = "Billede til nyheden" + current.acf.overskrift;
        h1.textContent = current.acf.overskrift;
        snack.textContent = current.acf.underoverskrifter[0];
        //Date Split
        let datoData = current.acf.author[0].split("/"), day = datoData[1], month = numberToMonth(Number(datoData[1])), year = datoData[2];

        author.textContent = day + '. ' + month + ' af ' + current.acf.author[1];
        intro.append(img, h1, snack, author)

        current.acf.brodtekst_box.forEach(item => {
            if(item != "") {
                let p = document.createElement("p");
                p.textContent = item;
                pContent.append(p);
            }
        })
        ramme.append(intro, pContent)
        document.querySelector("main").append(top ,ramme)
    }


    function makeLayout (current) {
        //===== WHICH CASE TO USE TO DRAW CONTENT
        let currentSite = findCurrent(current);

        const currentTag = currentSite.tags[0];             //Vi tilføjer [0] fordi vi kigger i et array, som har et tal.
        makeTitle(currentSite);

        switch (currentTag) {
            case IDforside[1]:
                    makeForside(currentSite);
                    break;
            case IDomklubben[1]:
                    makeOmklubben(currentSite);
                    break;
            case IDafdelinger[1]:
                    makeAfdelinger(currentSite);
                    break;
            case IDungdom[1]:
                    makeUngdom(currentSite);
                    break;
            case IDsejlklub[1]:
                    makeSejlerskolen(currentSite);
                    break;
            case IDbegivenheder[1]:
                    makeBegivenheder(currentSite);
                    break;
            case IDnyheder[1]:
                    makeNyheder(currentSite);
                    break;
            case IDnyhedtemplate[1]:
                makeTemplateNyhed(currentSite);
                break;
            case IDblivmedlem[1]:
                    makeBlivmedlem(currentSite);
                    break; 
            default: //F.eks hvis den ikke kan finde et tag, så bruger den default
                    makeForside(currentSite);
                    console.log("USING Template: Default")
        }
        //Skaber ID som kan bruges i CSS
        document.querySelector("body").id = "bodyTemplate_" + currentSite.id;
    }
     //========================== CREATE THE PRODUCT
    function createSite(current) {
        if (current == 0 || current == undefined) {// Skal bruges til at hvis pageId = 0 eller ikke defineret, så skal den lave Forsiden som vi definere.
            const forside = data.find(forside => forside.id == IDforside[2]);
            current = forside.id;
        }

        makeNavigation(current);
        makeLayout(current);
        makeSponsor();
        makeFooter();

    }
    createSite(currentID);

    
    
    
    
    
    
    
    
    //============================================================================
    //=========================== Eventlisteneres ================================
    //============================================================================

    //== Om Klubben - Bestyrelsen - Referat
    // - Hvis mere indhold 6 af gangen
    // - Skab side 1 ud af X
    if (window.location.href.indexOf(IDomklubben[0]) != -1) {
        function referatFunc () {
            let loopNr = 6,
                pageNr = 1,
                total = document.querySelectorAll(".referatBox").length,
                pageDivide = total / 6,
                pageTotal = Math.ceil(pageDivide),
                pageSpan = document.createElement("span");
        
            pageSpan.textContent = ' ' + pageNr + ' af ' + pageTotal + ' ';
            document.querySelector("#referatBtnReverse1").after(pageSpan);
           
            //== Hvis mere indhold 6 af gangen
            document.querySelector("#referatBtn1").addEventListener("click", function () {
                let boxList = document.querySelectorAll(".referatBox"); // Drillede, men det virkede at lave let inde i function. Den må have ikke have kunne finde den ellers. 
                console.log(boxList)
                boxList.forEach(post => {
                    post.style.display = "none";
                })
                if (loopNr == 0) { //Reseter hvis brugeren er gået frem og tilbage i listen.
                    loopNr += 6;
                }
                //== Skal vise forskellige indhold ved hver click
                for (let i = loopNr; i < loopNr + 6; i++) { // Inspiration fra: https://www.markuptag.com/javascript-load-more-content-on-click-button/
                    if (boxList[i]) {
                        boxList[i].style.display = "block";
                    }
                }
                loopNr += 6;
                pageNr += 1;
                pageSpan.textContent = ' ' + pageNr + ' af ' + pageTotal + ' ';//Ændre textContent når det bliver klikket.
                if (document.querySelector("#referatBtnReverse1").style.display = "none") { //Tilføjer ReverseBtn når ikke er på side 1
                    document.querySelector("#referatBtnReverse1").style.display = "inline-block";
                } 
                if (pageNr == pageTotal) {
                    document.querySelector("#referatBtn1").style.display = "none";
                }
            })
        
            //== Hvis mindre indhold 6 af gangen
            document.querySelector("#referatBtnReverse1").addEventListener("click", function () {
                let boxList = document.querySelectorAll(".referatBox"); // Drillede, men det virkede at lave let inde i function. Den må have ikke have kunne finde den ellers. 
                console.log(boxList)
                boxList.forEach(post => {
                    post.style.display = "none";
                })
                loopNr -= 6;
                if(loopNr == 6) { //Fordi loopNr starter på 6, skal den være minus 12 i stedet for 6, for at kunne tegne indholdet som det var fra begyndelsen.
                    loopNr -= 6;
                }
                //== Skal vise forskellige indhold ved hver click
                for (let i = loopNr; i < loopNr + 6; i++) { // Inspiration fra: https://www.markuptag.com/javascript-load-more-content-on-click-button/
                    if (boxList[i]) {
                        boxList[i].style.display = "block";
                    }
                }
                console.log(loopNr)
                pageNr -= 1;
                pageSpan.textContent = ' ' + pageNr + ' af ' + pageTotal + ' ';//Ændre textContent når det bliver klikket.
                if (pageNr == 1) {//Fjerne tilbage knappen når på side 1
                    document.querySelector("#referatBtnReverse1").style.display = "none";
                } 
                if (document.querySelector("#referatBtn1").style.display = "none") { //Tilføjer Btn når den har været sat til display = none, altså når den har været på den maksimale side.
                    document.querySelector("#referatBtn1").style.display = "inline-block";
                } 
            })
            if (pageNr == 1) {//Fjerne tilbage knappen når på side 1
                document.querySelector("#referatBtnReverse1").style.display = "none";
            }
            if (pageNr > pageTotal) {
                //Er til hvis kun 1 side findes altså der er 6 eller under referater
                pageTotal = pageNr;
                document.querySelector("#referatBtn2").style.display = "none";
                document.querySelector("#referatBtnReverse2").style.display = "none";

                pageSpan.textContent = ' ' + pageNr + ' af ' + pageTotal + ' ';
            }

            //Gør det samme som første rammer bare andre elementer(En global function fungerede ikke?)
            let loopNr2 = 6,
                pageNr2 = 1,
                total2 = document.querySelectorAll(".GBbox").length,
                pageDivide2 = total2 / 6,
                pageTotal2 = Math.ceil(pageDivide2),
                pageSpan2 = document.createElement("span");
        
            pageSpan2.textContent = ' ' + pageNr2 + ' af ' + pageTotal2 + ' ';
            document.querySelector("#referatBtnReverse2").after(pageSpan2);
           
            //== Hvis mere indhold 6 af gangen
            document.querySelector("#referatBtn2").addEventListener("click", function () {
                let boxList2 = document.querySelectorAll("GBbox"); // Drillede, men det virkede at lave let inde i function. Den må have ikke have kunne finde den ellers. 
                boxList2.forEach(post => {
                    post.style.display = "none";
                })
                if (loopNr2 == 0) { //Reseter hvis brugeren er gået frem og tilbage i listen.
                    loopNr2 += 6;
                }
                //== Skal vise forskellige indhold ved hver click
                for (let i = loopNr2; i < loopNr2 + 6; i++) { // Inspiration fra: https://www.markuptag.com/javascript-load-more-content-on-click-button/
                    if (boxList2[i]) {
                        boxList2[i].style.display = "block";
                    }
                }
                loopNr2 += 6;
                pageNr2 += 1;
                pageSpan2.textContent = ' ' + pageNr2 + ' af ' + pageTotal2 + ' ';//Ændre textContent når det bliver klikket.
                if (document.querySelector("#referatBtnReverse2").style.display = "none") { //Tilføjer ReverseBtn når ikke er på side 1
                    document.querySelector("#referatBtnReverse2").style.display = "inline-block";
                } 
                if (pageNr2 == pageTotal2) {
                    document.querySelector("#referatBtn2").style.display = "none";
                }
            })
        
            //== Hvis mindre indhold 6 af gangen
            document.querySelector("#referatBtnReverse2").addEventListener("click", function () {
                let boxList2 = document.querySelectorAll(".GBbox"); // Drillede, men det virkede at lave let inde i function. Den må have ikke have kunne finde den ellers. 
                boxList2.forEach(post => {
                    post.style.display = "none";
                })
                loopNr2 -= 6;
                if(loopNr2 == 6) { //Fordi loopNr starter på 6, skal den være minus 12 i stedet for 6, for at kunne tegne indholdet som det var fra begyndelsen.
                    loopNr2 -= 6;
                }
                //== Skal vise forskellige indhold ved hver click
                for (let i = loopNr2; i < loopNr2 + 6; i++) { // Inspiration fra: https://www.markuptag.com/javascript-load-more-content-on-click-button/
                    if (boxList2[i]) {
                        boxList2[i].style.display = "block";
                    }
                }
                pageNr2 -= 1;
                pageSpan2.textContent = ' ' + pageNr2 + ' af ' + pageTotal2 + ' ';//Ændre textContent når det bliver klikket.
                if (pageNr2 == 1) {//Fjerne tilbage knappen når på side 1
                    document.querySelector("#referatBtnReverse2").style.display = "none";
                } 
                if (document.querySelector("#referatBtn2").style.display = "none") { //Tilføjer Btn når den har været sat til display = none, altså når den har været på den maksimale side.
                    document.querySelector("#referatBtn2").style.display = "inline-block";
                } 
            })
            if (pageNr2 == 1) {//Fjerne tilbage knappen når på side 1
                document.querySelector("#referatBtnReverse2").style.display = "none";
            }
            if (pageNr2 > pageTotal2) {
                //Er til hvis kun 1 side findes altså der er 6 eller under referater
                pageTotal2 = pageNr2;
                document.querySelector("#referatBtn2").style.display = "none";
                document.querySelector("#referatBtnReverse2").style.display = "none";

                pageSpan2.textContent = ' ' + pageNr2 + ' af ' + pageTotal2 + ' ';
            }
        }
    }




    //Tilføjer functioner til start indhold på UnderNavigationer
    if (window.location.href.indexOf(IDomklubben[0]) != -1) {
        if (document.querySelector("#one").classList.contains("selected") != -1) {
            referatFunc();
            showBlock(document.querySelector("#referatShowHideBtn"), document.querySelector("#referatContainer"));
            showBlock(document.querySelector("#clickReferat1"), document.querySelector("#referatContent"));
            showBlock(document.querySelector("#clickReferat2"), document.querySelector("#GFcontent"));
        }
    }

    if (window.location.href.indexOf(IDsejlklub[0]) != -1) {
        if (document.querySelector("#one").classList.contains("selected") != -1) {
             //2 functioner som skal navigere videre, ved at clicke på et element i UnderNav
             document.querySelector("#nyeClick").addEventListener("click", function () {
                document.querySelector("#two").click();
                //Skal tage brugeren til toppen af skærmen. Inspiration fra: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_scroll_to_top
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0; // document.documentElement rammer root, det kunne være <html>
            })
            document.querySelector("#erfarendeClick").addEventListener("click", function () {
                document.querySelector("#three").click();
                //Skal tage brugeren til toppen af skærmen. Inspiration fra: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_scroll_to_top
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0; // document.documentElement rammer root, det kunne være <html>
            })
        }
    }
    



    //Fjerner / Viser indhold
    function showBlock(click, content) {
        if (!content.classList.contains("showContent") != -1 && !content.classList.contains("hideContent") != -1) { //Hvis der er ingen class, add en class til content som "hide'er" indholdet
            content.classList.add("hideContent");
        }
        click.addEventListener("click", function() {
            
            if (content.classList.contains("showContent")) {
                content.classList.remove("showContent")
                content.classList.add("hideContent")
            } else {
                content.classList.remove("hideContent")
                content.classList.add("showContent")

            }
        })
    }




    //============================================================================
    //=========================== UnderNavigation ================================
    //============================================================================

    function addAndRemove (li) {
        //== Funktioner til Afdelinger Undersider

        // - Bliv Medlem

        function makeTilmelding () {
            let 
            postID = IDblivmedlem[0],
            findPost = data.find(post => post.id == postID),
            dataArray = [findPost.acf.conventus, findPost.acf.tilmelding, findPost.acf.mentor],
            ds = {
                "intro": {
                    "title": dataArray[1].velkomst_blog[0],
                    "under1": dataArray[1].velkomst_blog[1],
                    "beskriv1": dataArray[1].velkomst_blog[2],
                    "under2": dataArray[1].velkomst_blog[3],
                    "beskriv2": dataArray[1].velkomst_blog[4],
                    "data": [dataArray[1].velkomst_blog[5][0], dataArray[1].velkomst_blog[5][1]]
                },

                "step": {
                    "title": dataArray[1].info_step[0],
                    //Indeholde: Første del af text, sidste del af tekst og Link
                    "one": dataArray[1].info_step[1],
                    "two": dataArray[1].info_step[1][1]
                },

                "info": {
                    "container": [dataArray[1].container_info[0], dataArray[1].container_info[1], dataArray[1].container_info[2], dataArray[1].container_info[3]],
                    "array1": [dataArray[1].info_1, dataArray[1].info_2, dataArray[1].info_3, dataArray[1].info_4],
                    "array2": [dataArray[1].info_5, dataArray[1].info_6, dataArray[1].info_7, dataArray[1].info_8]
                }
            },
            container = document.createElement("section"),
            intro = '<section><h2>' + ds.intro.title + '</h2><article><h3>' + ds.intro.under1 + '</h3><p>' + ds.intro.beskriv1 + '</p></article><article><h3>' + ds.intro.under2 + '</h3><p>' + ds.intro.beskriv2 + '<a href="' + ds.intro.data[0] + '">' + ds.intro.data[0] + '</a></p></article></section>',
            step = '<section id="tilStep"><article><div class="blueShapeStep"><h3>1.</h3></div><p>' + ds.step.one[0][0] + ' (<a href="' + ds.step.one[0][2] + '">LÆS MERE</a>). ' + ds.step.one[0][0] + '</p><a href="' + ds.step.one[0][2] + '">Tilmeld</a></article>';
            step += '<article><div class="blueShapeStep"><h3>2.</h3></div><p>' + ds.step.two + '</p></article></section>';
            
            //Bruges til at kunne styre forskellige ting i et forEach loop
            let nr = 1;
           
            console.log(ds.step.one)
            //Starter det nye indhold i main, som appendChild skal ligge sig efter
            createHTML("main", intro + step)
            //Skaber appendChild(Container)
            document.querySelector("main").appendChild(container);
            
            
            //Skaber først de yderste kasser
            ds.info.container.forEach(item => {
                let 
                section = document.createElement("section"),
                showHide = document.createElement("section"),
                article = document.createElement("article"),
                h2 = document.createElement("h2"),
                h3 = document.createElement("h3"),
                p = document.createElement("p"),
                btn = document.createElement("button"),
                arrow = '<span>&#10094;</span>';

                //Tilføjer værdier
                section.id = "tilmeldBox" + nr;
                h2.textContent = item[0];
                h3.textContent = item[1];
                p.textContent = item[2];
                //ShowHide knap
                btn.type = "button";
                btn.id = "showBtn" + nr;
                btn.innerHTML = "MERE INFORMATION" + arrow;
                    
                //Ligger alle elementer sammen
                article.append(h2, h3, p, btn);
                section.appendChild(article);
                section.appendChild(showHide);
                container.appendChild(section);
                
                if (nr === 1) {
                    ds.info.array1.forEach(item => {
                        let 
                        ramme = document.createElement("section"),
                        clickBox = document.createElement("article"),
                        content = document.createElement("article"),
                        ul1 = document.createElement("ul"),
                        ul2 = document.createElement("ul"),
                        ulArticle = document.createElement("article"),
                        h4_1 = document.createElement("h4"),
                        h4_2 = document.createElement("h4"),
                        tilmeldBtn = document.createElement("a"),
                        pil = document.createElement("span")
                        dato = new Date(),
                        year = dato.getFullYear();

                        //Click Box
                        h4_1.innerHTML = '<strong>' + year + '</strong>' + item[0];
                        pil.innerHTML = "&#10094;";
                        clickBox.append(h4_1, pil)

                        //Content 
                        h4_2.textContent = item[0];
                        tilmeldBtn.textContent = "Tilmeld";
                        tilmeldBtn.href = ""
                        item[7].forEach(each => {
                            if(each != "") {//Checker efter tomt data, som ikke behøver et Li element
                                let li = document.createElement("li");
                                li.textContent = each;
                                ul2.appendChild(li);
                            }
                        })
                        for (let i = 1; i < 7; i++) {
                            let indhold = document.createElement("li");
                            switch (i) {
                                case 1:
                                    indhold.innerHTML = "<i>Dage: </i>" + item[i]
                                    break;
                                case 2:
                                    indhold.innerHTML = "<i>Tid: </i>" + item[i][0] + ' - ' + item[i][1];
                                    break;
                                case 3: 
                                    indhold.innerHTML = "<i>Sæson: </i>" + item[i][0] + ' - ' + item[i][1];
                                    break;
                                case 4: 
                                    indhold.innerHTML = "<i>Pris: </i>" + item[i] + 'kr.';
                                    break;
                                case 5: 
                                    indhold.innerHTML = "<i>Træner: </i>" + item[i];
                                    break;
                                case 6: 
                                    indhold.innerHTML = "<i>Sted: </i>" + item[i];
                                    break;
                            }
                            ul1.appendChild(indhold)
                        }
                        ulArticle.append(ul1, ul2, tilmeldBtn)
                        content.append(h4_2, ulArticle)

                        ramme.append(clickBox, content);
                        showHide.appendChild(ramme);


                        showBlock(clickBox, content)
                    })
                }

                if (nr === 2) {
                    ds.info.array2.forEach(item => {
                        let 
                        ramme = document.createElement("section"),
                        clickBox = document.createElement("article"),
                        content = document.createElement("article"),
                        ul1 = document.createElement("ul"),
                        ul2 = document.createElement("ul"),
                        ulArticle = document.createElement("article"),
                        h4_1 = document.createElement("h4"),
                        h4_2 = document.createElement("h4"),
                        tilmeldBtn = document.createElement("a"),
                        pil = document.createElement("span")
                        dato = new Date(),
                        year = dato.getFullYear();

                        //Click Box
                        h4_1.innerHTML = '<strong>' + year + '</strong>' + item[0];
                        pil.innerHTML = "&#10094;";
                        clickBox.append(h4_1, pil)

                        //Content 
                        h4_2.textContent = item[0];
                        tilmeldBtn.textContent = "Tilmeld";
                        tilmeldBtn.href = item[8];
                        tilmeldBtn.target = "_blank"
                        item[7].forEach(each => {
                            if(each != "") {//Checker efter tomt data, som ikke behøver et Li element
                                let li = document.createElement("li");
                                li.textContent = each;
                                ul2.appendChild(li);
                            }
                        })
                        for (let i = 1; i < 7; i++) {
                            //Skal hoppe videre i loopet hvis item[i] er tom.
                            if(item[i] == "") {
                                continue;
                            }
                            let indhold = document.createElement("li");
                            switch (i) {
                                case 1:
                                    indhold.innerHTML = "<i>Dage: </i>" + item[i]
                                    break;
                                case 2:
                                    indhold.innerHTML = "<i>Tid: </i>" + item[i][0] + ' - ' + item[i][1];
                                    break;
                                case 3: 
                                    indhold.innerHTML = "<i>Sæson: </i>" + item[i][0] + ' - ' + item[i][1];
                                    break;
                                case 4: 
                                    indhold.innerHTML = "<i>Pris: </i>" + item[i] + 'kr.';
                                    break;
                                case 5: 
                                    indhold.innerHTML = "<i>Træner: </i>" + item[i];
                                    break;
                                case 6: 
                                    indhold.innerHTML = "<i>Sted: </i>" + item[i];
                                    break;
                            }
                            ul1.appendChild(indhold)
                           
                        }
                        ulArticle.append(ul1, ul2, tilmeldBtn)
                        content.append(h4_2, ulArticle)

                        ramme.append(clickBox, content);
                        showHide.appendChild(ramme);


                        showBlock(clickBox, content)
                    })
                }

                if (nr === 1 || nr === 2) {
                    showBlock(btn, showHide)
                }
                nr++;
            })
        }

        function makeConventus() {
            let 
            postID = IDblivmedlem[0],
            findPost = data.find(post => post.id == postID),
            dataArray = [findPost.acf.conventus, findPost.acf.tilmelding, findPost.acf.mentor],

            //Array med Medlems Typer
            profilArray = new Array();
            dataArray[0][5].forEach(each => {
                let pushIt = [each[0], each[1]]
                profilArray.push(pushIt)
            })
            

            let ds = {
                "intro": {
                    "title": dataArray[0][0],
                    "under": dataArray[0][1],
                    "konti": dataArray[0][2],
                    "kBeskriv1": dataArray[0][3],
                    "kBeskriv2": dataArray[0][4],
                },

                "profil": {
                    "title": dataArray[0][5][3],
                    "obs": dataArray[0][5][4],
                    "aMedlem": [dataArray[0][5][0][0], dataArray[0][5][0][1]],
                    "bMedlem": [dataArray[0][5][1][0], dataArray[0][5][1][1]],
                    "cMedlem": [dataArray[0][5][2][0], dataArray[0][5][2][1]],
                    "array": profilArray
                },
                
                "data": {
                    "title": dataArray[0][6][0],
                    "beskriv1": dataArray[0][6][1],
                    "beskriv2": dataArray[0][6][2],
                },

                "sprg": {
                    "title": dataArray[0][7][0],
                    "beskriv": dataArray[0][7][1],
                    "email": dataArray[0][7][2],
                }
            },
            intro = '<section><h2>' + ds.intro.title + '</h2><p>' + ds.intro.under + '</p></section>',
            profil = '<section><section><h2>' + ds.profil.title + '</h2><p>' + ds.profil.obs + '</p></section><article><div class="blueShape"><h3>' + ds.profil.aMedlem[0] + '</h3></div><p>' + ds.profil.aMedlem[1] + '</p><a href="">Tilmeld</a></article>';
            profil += '<article><div class="blueShape"><h3>' + ds.profil.bMedlem[0] + '</h3></div><p>' + ds.profil.bMedlem[1] + '</p><a href="">Tilmeld</a></article>';
            profil += '<article><div class="blueShape"><h3>' + ds.profil.cMedlem[0] + '</h3></div><p>' + ds.profil.cMedlem[1] + '</p><a href="">Tilmeld</a></article></section>';

            let outro = '<section><article><h3>' + ds.intro.konti + '</h3><p>' + ds.intro.kBeskriv1 + '</p><p>' + ds.intro.kBeskriv2 + '</p></article>';
            outro += '<article><h3>' + ds.data.title + '</h3><p>' + ds.data.beskriv1 + '</p><p>' + ds.data.beskriv2 + '</p></article><article><h3>' + ds.sprg.title + '</h3><p>' + ds.sprg.beskriv + '</p><p>E-Mail: <a href="mailto:' + ds.sprg.email + '">' + ds.sprg.email + '</a></p></article></section>';
            

            let main = intro + profil + outro;

            createHTML("main", main)
        }

        function makeMentor() {
            let 
            postID = IDblivmedlem[0],
            findPost = data.find(post => post.id == postID),
            dataArray = [findPost.acf.conventus, findPost.acf.tilmelding, findPost.acf.mentor],

            //Mentor List
            mentorArray = new Array();
            for (let i = 1; i < 4; i++) {
                let pushIt = dataArray[2][3][i];
                mentorArray.push(pushIt)
            }
            //Gode Grunde List
            let ggArray = new Array();
            for (let i = 1; i < 6; i++) {
                let pushIt = dataArray[2][4][i];
                ggArray.push(pushIt)
            }

            let ds = {
                "intro": {
                    "title": dataArray[2][0],
                    "under": dataArray[2][1],
                    "beskriv": dataArray[2][2],
                },

                "mentor": {
                    "title": dataArray[2][3][0],
                    "array": mentorArray
                },
                
                "gode": {
                    "title": dataArray[2][4][0],
                    "array": ggArray,
                    "kontakt": [dataArray[2][4][6][0], dataArray[2][4][6][1]]
                }
            };

            //MentorArray til Li elementer
            let mentorList = '<ul>';
            ds.mentor.array.forEach(li => {
                mentorList += '<li>' + li + '</li>';
            })
            mentorList += '</ul>';
            //GodeGrundeArray til Li elementer
            let ggList = '<ul>';
            ds.gode.array.forEach(li => {
                ggList += '<li>' + li + '</li>';
            })
            ggList+= '</ul>';

            let intro = '<section><article><h2>' + ds.intro.title + '</h2><h3>' + ds.intro.under + '</h3><p>' + ds.intro.beskriv + '</p></article><article><h3>' + ds.mentor.title + '</h3>' + mentorList + '</article></section>',
                gg = '<section><h3>' + ds.gode.title + '</h3>' + ggList + '<p>' + ds.gode.kontakt + '</p></section>',
                main = intro + gg;


            createHTML("main", main)
        }

        // - Sejlerskolen
         function makeSejlNye() {
            let 
            postID = IDsejlklub[0],
            findPost = data.find(post => post.id == postID),
            //Laver en liste over stierne til de forskellige data
            dataArray = [findPost.acf.undervisning, findPost.acf.nye_elever, findPost.acf.erfarende_elever],
            //Data til UnderNavigation - Nye Elever
            nData = {
                "intro": {
                    "title1": dataArray[1].intro[0],
                    "title2": dataArray[1].intro[2],
                    "beskriv1": dataArray[1].intro[1],
                    "beskriv2": dataArray[1].intro[3],
                },

                "info": {
                    "ul": dataArray[1].info_liste[0],
                    "liArray": [dataArray[1].info_liste[1], dataArray[1].info_liste[2], dataArray[1].info_liste[3], dataArray[1].info_liste[4], dataArray[1].info_liste[5]],
                    //Indeholder Overskrift, Beskrivelse, Tlf og Email
                    "sprg": [dataArray[1].sporgsmal[0], dataArray[1].sporgsmal[1], dataArray[1].sporgsmal[2], dataArray[1].sporgsmal[3]]
                }
            },
            liListe = '';
            nData.info.liArray.forEach(each => {
                liListe += '<li>' + each + '</li>'
            })
            let
            krummer = '<div class="krumme"><a href="?pageId=' + IDafdelinger[0] + '">' + IDbannerAfdelinger[0] + '</a><span> &#62; </span><a href="?pageId=' + IDsejlklub[0] + '">' + IDbannerSejlerskolen[0] + '</a></div>',
            main = krummer + '<section><article><h2>' + nData.intro.title1 + '</h2><p>' + nData.intro.beskriv1 + '</p><h3>' + nData.intro.title2 + '</h3><p>' + nData.intro.beskriv2 + '</p></article><article><h2>' + nData.info.ul  + '</h2><ul>' + liListe + '</ul></article></section><section><h3>' + nData.info.sprg[0] + '</h3><p>' + nData.info.sprg[1] + '</p><ul><li><a href="tel:+45' + nData.info.sprg[2] + '">' + nData.info.sprg[2] + '</a></li><li>E-mail: <a href="mailto:' + nData.info.sprg[3] + '">' + nData.info.sprg[3] + '</a></li></ul></section>';
        

            createHTML("main", main)
        }
 
        function makeSejlErfarende(){
            let
            postID = IDsejlklub[0],
            findPost = data.find(post => post.id == postID),
            dataArray = [findPost.acf.undervisning, findPost.acf.nye_elever, findPost.acf.erfarende_elever],
            //Data til UnderNavigation - Erfarende Elever
            eData = {
                "intro": {
                    "title": dataArray[2].intro[0],
                    "beskriv1": dataArray[2].intro[1],
                    "beskriv2": dataArray[2].intro[2],
                    "indhug": dataArray[2].intro[3],
                    "fastlagt": dataArray[2].intro[4]
                },

                "info": {
                    "ul": dataArray[1].info_liste[0],
                    "liArray": [dataArray[2].info_liste[1], dataArray[2].info_liste[2], dataArray[2].info_liste[3], dataArray[2].info_liste[4]],
                    //Indeholder Overskrift, Beskrivelse, Tlf og Email
                    "sprg": [dataArray[1].sporgsmal[0], dataArray[1].sporgsmal[1], dataArray[1].sporgsmal[2], dataArray[1].sporgsmal[3]]
                }
            },
            liListe = '';
            eData.info.liArray.forEach(each => {
                liListe += '<li>' + each + '</li>'
            })
            let
            krummer = '<div class="krumme"><a href="?pageId=' + IDafdelinger[0] + '">' + IDbannerAfdelinger[0] + '</a><span> &#62; </span><a href="?pageId=' + IDsejlklub[0] + '">' + IDbannerSejlerskolen[0] + '</a></div>',
            main = krummer + '<section><article><h2>' + eData.intro.title + '</h2><p>' + eData.intro.beskriv1 + '</p><p>' + eData.intro.beskriv2 + '<ul><li>' + eData.intro.indhug + '</li></ul>' + eData.intro.fastlagt + '</p></article><article><h2>' + eData.info.ul  + '</h2><ul>' + liListe + '</ul></article></section><section><h3>' + eData.info.sprg[0] + '</h3><p>' + eData.info.sprg[1] + '</p><ul><li><a href="tel:+45' + eData.info.sprg[2] + '">' + eData.info.sprg[2] + '</a></li><li>E-mail: <a href="mailto:' + eData.info.sprg[3] + '">' + eData.info.sprg[3] + '</a></li></ul></section>';

            createHTML("main", main)
        };

        function makeSejlUndervisning() {
            let
            postID = IDsejlklub[0],
            findPost = data.find(post => post.id == postID),
            dataArray = [findPost.acf.undervisning, findPost.acf.nye_elever, findPost.acf.erfarende_elever],

            // Arrays til de forskellige slags data
                //Skaber array med indhold til alle både i mini-galleriet.
                skibeArray = new Array ();
                for (let i = 2; i < 6; i++) { // i = der hvor data i arrayet start(Der er data omkring 4 både)
                    // Arrayet indeholder info omkring: Billede, Type af Båd, Model Type, Sejl Nr
                    let nySkib = [dataArray[0].tekst_mini_galleri[i][0], dataArray[0].tekst_mini_galleri[i][1][0], dataArray[0].tekst_mini_galleri[i][1][1], dataArray[0].tekst_mini_galleri[i][1][2]];
                    skibeArray.push(nySkib)
                }
                //Skaber array med alle brugbare Links
                let linkArray = new Array(), // new skaber et ny blankt object. Array er pre-determined, men man kunnse også kalde den "link".
                    links = dataArray[0].applink.link;
                links.forEach(link => {
                    //Array indeholder: Link Tekst, Link Beskrivelse, Link til den relevante Hjemmesiden
                    let linkData = [link[0], link[1], link[2]]
                    linkArray.push(linkData)
                })
                //Skaber array med alle brugbare Apps
                let appArray = new Array(), // new skaber et ny blankt object. Array er pre-determined, men man kunnse også kalde den "link".
                    apps = dataArray[0].applink.app;
                apps.forEach(app => {
                    //Array indeholder: Billede, Navn, Link
                    let appData = [app[0], app[1], app[2]]
                    appArray.push(appData)
                })

            //Laver objekter med alt information til alle undersider
            let 
            //Data til UnderNavigation - Undervisning
            uData = {
                "intro": {
                    "title1": dataArray[0].tekst_gruppe_1[1],
                    "title2": dataArray[0].tekst_gruppe_1[3],
                    "beskriv1": dataArray[0].tekst_gruppe_1[2],
                    "beskriv2": dataArray[0].tekst_gruppe_1[4],
                    //Dulighedstitle
                    "ulTitle": dataArray[0].tekst_liste_1[0],
                    //Ul1
                    // "ul1": dataArray[0].tekst_liste_1[1],
                    // "li1Array": [dataArray[0].tekst_liste_1[2], dataArray[0].tekst_liste_1[3],dataArray[0].tekst_liste_1[4],dataArray[0].tekst_liste_1[5]],
                    // //Ul2
                    // "ul2": [dataArray[0].tekst_liste_1[6]]
                },

                "galleri": {
                    "title": dataArray[0].tekst_mini_galleri[0],
                    "beskriv": dataArray[0].tekst_mini_galleri[1],
                    "skibe": skibeArray
                },

                "elever": {
                    //Indeholder: Overskrift, Beskrivelse og Billede
                    "nye": [dataArray[0].nye_elever[0], dataArray[0].nye_elever[1], dataArray[0].nye_elever[2]],
                    "erfarende": [dataArray[0].erfarende_elever[0], dataArray[0].erfarende_elever[1], dataArray[0].erfarende_elever[2]],
                },

                "link": {
                    "title": dataArray[0].applink.intros[0][0],
                    "beskriv": dataArray[0].applink.intros[0][1],
                    "links": linkArray
                },

                "app": {
                    "title": dataArray[0].applink.intros[1][0],
                    "beskriv": dataArray[0].applink.intros[1][1],
                    "app": appArray
                }
            },

            //Skaber liste med billeder
                imgList = '';
            uData.galleri.skibe.forEach(skib => {
                imgList += '<article><img src="' + skib[0] + '" alt="Billede af bådmodellen: ' + skib[1] + '"><div><h4>' + skib[1] + '</h4><ul><li>' + skib[2] + '</li><li>' + skib[3] + '</li></ul></div></article>'
            });

            //Skaber og samler hovedindholdet
            let intro = '<section id="introSejlUndervisning"><article><h2>' + uData.intro.title1 + '</h2><p>' + uData.intro.beskriv1 + '</p></article><article><h2>' + uData.intro.ulTitle + '</h2><p>' + uData.intro.beskriv2 + '</p></article></section>',
                galleri = '<section id="galleriSejlUndervisning"><article><h2>' + uData.galleri.title + '</h2><p>' + uData.galleri.beskriv + '</p></article><section>' + imgList + '</section></section>',
                nye = '<section id="nyeSejlUndervisning"><h2>' + uData.elever.nye[0] + '</h2><article><p>' + uData.elever.nye[1] + '</p><button type=button id="nyeClick">LÆS MERE</button></article><img src="' + uData.elever.nye[2] + '" alt="Billede til ' + uData.elever.nye[0] + '"></section>',
                erfarende = '<section id="erfarendeSejlUndervisning"><h2>' + uData.elever.erfarende[0] + '</h2><article><p>' + uData.elever.erfarende[1] + '</p><button type=button id="erfarendeClick">LÆS MERE</button></article><img src="' + uData.elever.erfarende[2] + '" alt="Billede til ' + uData.elever.erfarende[0] + '"></section>',
                
                //Skaber liste med Articles som indeholder links og beskrivelse
                linkList = '<section>';
                uData.link.links.forEach(list => {
                    linkList += '<article><a href="' + list[2] + '">' + list[0] + '</a><p>' + list[1] + '</p></article>'
                })
                linkList += '</section>';
                let linkArea = '<article id="linkArea"><h2>' + uData.link.title + '</h2><p>' + uData.link.beskriv + '</p>' + linkList + '</article>',

                //Skaber liste med Articles som indeholder links(Apple Store) og beskrivelse + billede til appen
                appList = '<section>',
                appBox1 = '<article><h3>Sikkerhed</h3><div>',
                appBox2 = '<article><h3>Fællesskab på vandet</h3><div>',
                appBox3 = '<article><h3>Knob</h3><div>',
                appBox4 = '<article><h3>Vejr og Vind</h3><div>';
                //Opsætter alle Apps i den rette rækkefølge og i de rette bokse
                for (let i = 0; i < 2; i++) {
                    appBox1 += '<a href="' + uData.app.app[i][2] + '" class="appBox"><img src="' + uData.app.app[i][0] + '" alt="Billede til appen: ' + uData.app.app[i][1] + '"><h4>' + uData.app.app[i][1] + '</h4></a>';
                }
                for (let i = 2; i < 3; i++) {
                    appBox2 += '<a href="' + uData.app.app[i][2] + '" class="appBox"><img src="' + uData.app.app[i][0] + '" alt="Billede til appen: ' + uData.app.app[i][1] + '"><h4>' + uData.app.app[i][1] + '</h4></a>';
                }
                for (let i = 3; i < 5; i++) {
                    appBox3 += '<a href="' + uData.app.app[i][2] + '" class="appBox"><img src="' + uData.app.app[i][0] + '" alt="Billede til appen: ' + uData.app.app[i][1] + '"><h4>' + uData.app.app[i][1] + '</h4></a>';
                }
                for (let i = 5; i < 7; i++) {
                    appBox4 += '<a href="' + uData.app.app[i][2] + '" class="appBox"><img src="' + uData.app.app[i][0] + '" alt="Billede til appen: ' + uData.app.app[i][1] + '"><h4>' + uData.app.app[i][1] + '</h4></a>';
                }
                appList += appBox1 + appBox2 + appBox4 + appBox3;
                
                //Samler indhold
                let appArea = '<article id="appArea"><article><h2>' + uData.app.title + '</h2><p>' + uData.app.beskriv + '</p></article>' + appList + '</article>',
                krummer = '<div class="krumme"><a href="?pageId=' + IDafdelinger[0] + '">' + IDbannerAfdelinger[0] + '</a><span> &#62; </span><a href="?pageId=' + IDsejlklub[0] + '">' + IDbannerSejlerskolen[0] + '</a></div>',
                main = krummer + intro + galleri + nye + erfarende + '<section class="blueBox">' + linkArea + appArea + '</section>';

    
            
            createHTML("main", main)
            //2 functioner som skal navigere videre, ved at clicke på et element i UnderNav
            document.querySelector("#nyeClick").addEventListener("click", function () {
                document.querySelector("#two").click();
                //Skal tage brugeren til toppen af skærmen. Inspiration fra: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_scroll_to_top
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0; // document.documentElement rammer root, det kunne være <html>
            })
            document.querySelector("#erfarendeClick").addEventListener("click", function () {
                document.querySelector("#three").click();
                //Skal tage brugeren til toppen af skærmen. Inspiration fra: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_scroll_to_top
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0; // document.documentElement rammer root, det kunne være <html>
            })

        }

        // - Ungdom
        function makeUngInfoTilForaeldre() {
            let
            postID = IDungdomInfo[0],
            findPost = data.find(post => post.id == postID),
            introData = findPost.acf.intro,
            iData = {
                "title": introData[0],
                "under": introData[1],
                "beskriv": introData[2],
                "sikkerhed": [introData[3][0], introData[3][1], introData[3][2], introData[3][3], introData[3][4]]
            },
            forData = findPost.acf.foraeldrerad,
            fData = {
                "title": forData[0],
                "beskriv1": forData[1],
                "beskriv2": forData[2],
                "billede": forData[3]
            },
            //Skaber brødkrummer
            krummer = '<div class="krumme"><a href="?pageId=' + IDafdelinger[0] + '">' + IDbannerAfdelinger[0] + '</a><span> &#62; </span><a href="?pageId=' + IDungdom[0] + '">' + IDbannerUngdom[0] + '</a></div>';;

            //Skaber Ul med LI til Sikkerhed i Vandet
            iUl = '<ul>';
            for (let i = 0; i < 4; i++) {
                iUl += '<li>' + iData.sikkerhed[i] + '</li>';
            }
            iUl += '</ul>';

            let sprgData = data.find(post => post.id == Number(postData.acf.id.categories.ungdom_undernav[0])),
            sprgFooter = '<section><h3>' + sprgData.acf.sporgsmal[0] + '</h3><p>' + sprgData.acf.sporgsmal[1] + '</p><p>Email: <a href=""></a>' + sprgData.acf.sporgsmal[2] + '</p></section>';
      

            //Skaber Forældreråd Boks
            let raadBoks = '<section><article><h3>' + fData.title + '</h3><p>' + fData.beskriv1 + '</p><p>' + fData.beskriv2 + '</p></article><img src="' + fData.billede + '" alt="Billede til Forældreråd"</section>';
            let intro = krummer + '<section><article><h2>' + iData.title + '</h2><h3>' + iData.under + '</h3><p>' + iData.beskriv + '</p></article><article><h2>' + iData.sikkerhed[0] + '</h2>' + iUl + '</article></section>' + raadBoks;

            createHTML("main", intro + sprgFooter)
        }

        function makeUngStaevner() {
            let
            postID = IDungdomStaevne[0],
            findPost = data.find(post => post.id == postID),
            // Data til Intro på Stævner
            introData = findPost.acf.intro,
            introTitle = introData[0],
            introUnder = introData[1],
            introBeskriv = introData[2],
            intro = '<article><h2>' + introTitle + '<h2><h3>' + introUnder + '</h3><p>' + introBeskriv + '</p></article>',
            //Data til Stævne 1
            sDataPost = data.filter(post=> post.categories.includes(IDungdomStaevne[1])),
            staevne = '',
            //OBS bruges til at vise hvis et event er udløbet.
            OBS = '',
            //Bruges til forEach loop til at se give id som matcher nummeret i loopet.
            number = 1,
            //Brødkrummer
            krummer = '<div class="krumme"><a href="?pageId=' + IDafdelinger[0] + '">' + IDbannerAfdelinger[0] + '</a><span> &#62; </span><a href="?pageId=' + IDungdom[0] + '">' + IDbannerUngdom[0] + '</a></div>';
            
            //Skaber alle stævner som kan findes.
            sDataPost.forEach(post => {
                let
                sFindData = post.acf, // [0] fordi vi bruger filter og ikke find, så det er et array.
                sDatoStart = sFindData.intro[1],
                sSplit = sDatoStart.split("/"),
                sData = {
                    "day": Number(sSplit[0]),
                    "month": Number(sSplit[1]),
                    "year": Number(sSplit[2]),
                    "title": sFindData.intro[0],
                    "pTitle": sFindData.intro[2],
                    "beskriv": sFindData.intro[3],
                    "pInfo": sFindData.intro[4],
                    "tilmeld": sFindData.tilmeld_link,
                    "info1": sFindData.info_1,
                    "info2": sFindData.info_2,
                    "info1_title": sFindData.info_1[5],
                    "info1_beskriv": sFindData.info_1[6],
                    "info2_title": sFindData.info_2[5],
                    "info2_beskriv": sFindData.info_2[6]
                };
                //Skaber 2 lister med Links fra Info 1 / 2
                let liste1 = '<article><section><h3>' + sData.info1_title + '</h3><p>' + sData.info1_beskriv + '</p></section>',
                    liste2 = '<article><section><h3>' + sData.info2_title  + '</h3><p>' + sData.info2_beskriv + '</p></section>';
                for (let i = 0; i < 5; i++) {
                    liste1 += '<div><h4>' + sData.info1[i][0] + '</h4><a href="' + sData.info1[i][1] + '">ÅBEN</a></div>'
                }
                for (let i = 0; i < 5; i++) {
                    liste2 += '<div><h4>' + sData.info2[i][0] + '</h4><a href="' + sData.info2[i][1] + '">ÅBEN</a></div>'
                }
                liste1 += '</article>';
                liste2 += '</article>';
                
                //Skaber hovedindhold
                let staevneContent = '<section id="staevneContent_' + number +'"><article><h3>' + sData.pTitle + '</h3><p>' + sData.pInfo + '</p><a href="' + sData.tilmeld + '">Tilmelding</a></article>' + liste1 + liste2 +'</section>';
                staevne += '<section id="staevne_' + number + '" class="staevneContent"><article><div><h3>' + sData.title + '</h3><h4>' +  sData.year + '</h4><div><p>' + sData.beskriv + OBS + '</p><button type=button id="staevneBtn_' + number + '">MERE INFORMATION</button></article>' + staevneContent + '</section>';
                
                // Skal "udløse" hvis årstallet er mindre end 2021, de nuværende år. Kunne også være relevant at kigge på dag/måned.
                let date = new Date(),
                    year = date.getFullYear();
                if (sData.year < year) {
                    OBS = '<span>OBS: Dette Event er udgået!</span>';
                }
                
                number++; //number +1 til næste loop
            })

            //Skaber hoved indholdet
            let sprgData = data.find(post => post.id == Number(postData.acf.id.categories.ungdom_undernav[0])),
            sprgFooter = '<section><h3>' + sprgData.acf.sporgsmal[0] + '</h3><p>' + sprgData.acf.sporgsmal[1] + '</p><p>Email: <a href=""></a>' + sprgData.acf.sporgsmal[2] + '</p></section>';
      
            //Første Stævne (Ikke Dynamisk)
            let main = krummer + '<section>' + intro + '<img src="' + findPost.acf.billede + '" alt="Billede til Stævner - Ungdom"></section>' + staevne + sprgFooter;
            
            createHTML("main", main)
            //Bruger ShowBlock på alle sektioner som skabes via sDataPost.
            sDataPost.forEach(section => {
                number--; //Fordi vi bruger number++ får at give navn til i det første forEach loop, så skal vi her have -1 for at id'et matcher.
                showBlock(document.querySelector('#staevneBtn_' + number), document.querySelector('#staevneContent_' + number));
            })
        }
        function makeUngUndervisning () {

            let 
            postID = Number(postData.acf.id.categories.ungdom_undernav[0]),
            findPost = data.find(post => post.id == postID),
            krummer = '<div class="krumme"><a href="?pageId=' + IDafdelinger[0] + '">' + IDbannerAfdelinger[0] + '</a><span> &#62; </span><a href="' + IDungdom[0] + '">' + IDbannerUngdom[0] + '</a></div>',
            liste = findPost.acf.liste_ul,
            billede = findPost.acf.billede,
            //Data: Aldersgruppe 1
            sec1 = findPost.acf.aldersgruppe_1,
            sec1Title = sec1[0],
            sec1Alder1 = sec1[1],
            sec1Alder2 = sec1[2],
            sec1Tekst = sec1[3],
            sec1Img = sec1[4],
            //Data: Aldersgruppe 2
            sec2 = findPost.acf.aldersgruppe_2,
            sec2Title = sec2[0],
            sec2Alder1 = sec2[1],
            sec2Alder2 = sec2[2],
            sec2Tekst = sec2[3],
            sec2Img = sec2[4],
            liER = '',
            section1 = '<section id="ungAldersgruppe1"><div><h3>' + sec1Title + '</h3><h4>' + sec1Alder1 + ' - ' + sec1Alder2 + ' år</h4></div><p>' + sec1Tekst + '</p><img src="' + sec1Img + '" alt="Billede til aldersgruppen ' + sec1Alder1 + ' - ' + sec1Alder2 + ' år"></<section>',
            section2 = '<section id="ungAldersgruppe2"><div><h3>' + sec2Title + '</h3><h4> Fra ' + sec2Alder1 + ' år</h4></div><p>' + sec2Tekst + '</p><img src="' + sec2Img + '" alt="Billede til aldersgruppen ' + sec2Alder1 + ' - ' + sec2Alder2 + ' år"></<section>';
                
            // Laver indhold til Ul
            for(let i = 0; i < liste.length; i++) {
                liER += '<li>' + liste[i] + '</li>';
            }

        let sprgData = data.find(post => post.id == Number(postData.acf.id.categories.ungdom_undernav[0])),
            sprgFooter = '<section><h3>' + sprgData.acf.sporgsmal[0] + '</h3><p>' + sprgData.acf.sporgsmal[1] + '</p><p>Email: <a href=""></a>' + sprgData.acf.sporgsmal[2] + '</p></section>';
      

            //Samler alt indhold til Ungdom Undervisning
            let main = krummer + '<section><article><h2>' + IDbannerUngdom[3][0] + '</h2><ul>' + liER + '</ul></article><img src="' + billede + '" alt="Billede til Undervisning - Ungdom"></section>' + section1 + section2 + sprgFooter;

            createHTML("main", main)
        }

        //== Funktioner til Omklubben Undersider
        function makeHistorie() {
            let findPost = data.find(post => post.id == IDomklubbenUndersider[3]),
                overskrift1 = findPost.acf.overskrifter[0],
                overskrift2 = findPost.acf.overskrifter[1],
                tekst1 = findPost.acf.brodtekster[0],
                tekst2 = findPost.acf.brodtekster[1],
                billeder = findPost.acf.billeder,
                findMedlemmer =  data.filter(post => post.categories.includes(Number(postData.acf.id.categories.template_aeresmedlem))),
                main = '<article><h2>' + overskrift1 + '</h2><p>' + tekst1 + '</p><div id="historieBtn"><h4>SNV Igennem Historien <h4><a href="">ÅBEN</a></div></article><article><h2>' + overskrift2 + '</h2><p>' + tekst2 + '</p></article><div id="historieGalleri"><img src="' + billeder[0] + '" alt="Billede fra Historie Galleri"><img src="' + billeder[1] + '" alt="Billede fra Historie Galleri"></div>',
                medlemmer = '<section id="aeresMedlemmer">';
            
                //Skabe liste af elementer til hver medlem(post)
            findMedlemmer.forEach(medlem => {
                medlemmer += '<div><h3>' + medlem.acf.navn_pa_medlem + '</h3><p>' + medlem.acf.argang + ' - Udnævnt til Æresmedlem</p></div>'
            })
            medlemmer += '</section>';

            createHTML("main", main + medlemmer)
        }

        function makeKlubblad() {
            let findPost = data.find(post => post.id == IDomklubbenUndersider[2]),
                findFiles = data.filter(post => post.categories.includes(Number(postData.acf.id.categories.template_klubblad))),
                beskrivelse = findPost.acf.beskrivelse_af_klubblad,
                overskrift = findPost.acf.overskrifter[0],
                main = '<section><h2>' + overskrift + '</h2><p>' + beskrivelse + '</p></section><section id="yearsBlad">',
                //Skaber stedet hvor de forskellige filer kan placeres alt efter hvilket år de hører til. (Ikke særlig dymanisk bygget)
                year2021 = '<article id="year2021"><h3>2021</h3>',
                year2020 = '<article id="year2020"><h3>2020</h3>',
                year2019 = '<article id="year2019"><h3>2019</h3>',
                year2018 = '<article id="year2018"><h3>2018</h3>';
            
            // == Skaber elementer for hver Klubblad opslag der findes, og placere i den rette kasse i forhold til årstal. 
            findFiles.forEach(file => {
                let year,
                    lookAtDate = file.acf.dato_til_filen,
                    link = file.acf.link,
                    split = lookAtDate.split("/");
                year = Number(split[2]),
                month = Number(split[1]),
                day = Number(split[0]),
                monthString = numberToMonth(month);
                
                switch (year) {
                    case 2021:
                        year2021 += '<div><h4>' + day + '. ' + monthString + '</h4><a href="' + link + '">ÅBEN</a>'
                        break;
                    case 2020:
                        year2020 += '<div><h4>' + day + '. ' + monthString + '</h4><a href="' + link + '">ÅBEN</a>'
                        break;
                    case 2019:
                        year2019 += '<div><h4>' + day + '. ' + monthString + '</h4><a href="' + link + '">ÅBEN</a>'
                        break;
                    case 2018:
                        year2018 += '<div><h4>' + day + '. ' + monthString + '</h4><a href="' + link + '">ÅBEN</a>'
                        break;
                    default:
                        console.log("Error: Kunne ikke matche årstal med vores system")
                }    
            })
            //Lukker HTML elementerne.
            year2021 += '</article>';
            year2020 += '</article>';
            year2019 += '</article>';
            year2018 += '</article>';
            main += year2021 + year2020 + year2019 + year2018 + '</section>';

            createHTML("main", main)
        }
        
        function makePolitik() {
            let findPost = data.find(post => post.id == IDomklubbenUndersider[1]),
                overskrift = findPost.acf.overskrifter[0],
                undertitle = findPost.acf.overskrifter[1],
                vedtækter = findPost.acf.liste_med_paragraffer,
                main = '<section><h2>' + overskrift + '</h2><h3>' + undertitle + '</h3></section><section>',
                downloadFil = '<a href="' + findPost.acf.fil + '" download="Vedtægt2012_SNV.dk"><button type="button>DOWNLOAD DOKUMENT</button></a>"';
            for (let i = 0; i < vedtækter.length; i++) {
                let ul = '<ul>§' + (i+1);
                vedtækter[i].forEach(line => {
                        ul += '<li>' + line + '</li>'
                    })
                ul += '</ul>';
                main += '<article>' + ul + '</article>'
            }
            main += '<ul><li>' + findPost.acf.dato_og_underskrift[0] + '</li><li>' + findPost.acf.dato_og_underskrift[1] + '</li></ul></section><div id="download">' + downloadFil + '</div>';
            createHTML("main", main)
        }

        function makeBestyrelsen() { //Den her function bliver gentage 1 gang til. Den her function har tilformål at starte OmKlubben på Bestyrelsen's side.
            let findPost = data.find(post => post.id == IDomklubbenUndersider[0]),
                title = findPost.acf[10],
                tekst = findPost.acf[1], // Problemer med at lave et array i ACF. Duer ikke hvis man bruger 0 direkte inde i ACF, skal være i en under gruppe. 0 forsvinder og er ikke med i arrayet.
                begivenheder = '<h2>' + title + '</h2><p>' + tekst + '</p>',
                medlemmer = '<section id="bestyrelseListe">';

            for(let i = 2; i < 10; i++) { // Skal skabe 8, medlems kasser. Starter på  let i = 2 fordi der efter komme de ønskede data.
                let medlemsInfo = findPost.acf[i], //Finder data til hver medlem.
                    billede = medlemsInfo.medlems_billede;
                if (billede == false) { //Hvis medlemmet ikke har et billede, bruges et dummy billede i stedet for.
                    billede = findPost.acf[11];
                }
                medlemmer += '<article><img src="' + billede + '" alt="Billede af medlem ' + medlemsInfo.navn + '">';
                medlemmer += '<div><h3>' + medlemsInfo.navn + '</h3><h4>' + medlemsInfo.position + '</h4><ul><li>Tlf nr: ' + medlemsInfo.telefon + '</li><li>Email: ' + medlemsInfo.email + '</li></ul></div></article>';
            }
            medlemmer += '</section>';
            //== Skaber Referater
            // - Find Referater
            const IDreferat = Number(postData.acf.id.categories.referater),
            IDreferatGF =  Number(postData.acf.id.categories.referater_GF);
            let
            referatListe = data.filter(post => post.categories.includes(IDreferat)),
            GFliste = data.filter(post => post.categories.includes(IDreferatGF)),
            GFbox = '',
            GFoutput = '',            
            referatBox = "",
            referatOutput = '';

            //Opsætter dato udfra sidste ændret dato
            function modDato(item) {
                let mod = item.modified, //Data på sidste gange der er sket ændringer.
                    splitMod1 = mod.split("T");
                    splitMod2 = splitMod1[0].split("-"),
                    day = Number(splitMod2[2]),
                    month = Number(splitMod2[1]),
                    year = Number(splitMod2[0]),
                    nonNumberMonth = numberToMonth(month),
                    output = day + '. ' + nonNumberMonth + ' ' + year;
                    return output;
            }

            //Skaber kasse til hver referat
            referatListe.forEach(referat => {
                let overskrift = referat.acf.overskrift,
                    dato = modDato(referat),
                    link = referat.acf.link;
                referatBox = '<div class="referatBox hideReferat"><h3>' + overskrift + '</h3><h5>Sidst ændret den ' + dato + '</h5><a href="' + link + '">ÅBEN</a></div>';
                referatOutput += referatBox;
                
            })

            GFliste.forEach(referat => {
                let overskrift = referat.acf.overskrift,
                    dato = modDato(referat),
                    link = referat.acf.link;

                GFbox = '<div class="GFbox hideReferat"><h3>' + overskrift + '</h3><h5>Sidst ændret den ' + dato + '</h5><a href="' + link + '">ÅBEN</a></div>';
                GFoutput += GFbox;
            })

            //Skaber alt indholde til referater
            let
            rData = findPost.acf[12],
            gData = findPost.acf[13],
            referatBestyrelse = '<article id="referatContent">' + referatOutput + '<div id="btnDiv1"><button type="button" id="referatBtnReverse1">&#60;</button><button type="button" id="referatBtn1">&#62;</button></div></article></section>',
            GFbestyrelse = '<article id="GFcontent">' + GFoutput + '<div id="btnDiv2"><button type="button" id="referatBtnReverse2">&#60;</button><button type="button" id="referatBtn2">&#62;</button></div></article></section>',
            
            //#1
            referat =  '<section id="referat"><article><h2>' + rData[0] + '<h2><p>' + rData[1] + '</p><button type="button" id="referatShowHideBtn">MERE INFORMATION</button></article>';
            referat += '<section id="referatContainer"><section><article id="clickReferat1"><h3>' + rData[0] +'</h3><span>&#10095;</span></article>' + referatBestyrelse,
            referat += '<section><article id="clickReferat2"><h3>' + gData[2] +'</h3><span>&#10095;</span></article>' + GFbestyrelse + '</section>';
            
            //Laver HTML
            createHTML("main", begivenheder + medlemmer + referat);
            
            //Sørger for at 6 referater bliver vist "onload"
            let referatBoxListe = document.querySelectorAll(".referatBox"),
                GFboxListe = document.querySelectorAll(".GFbox");

            for (let i = 0; i < 6; i++) {
                referatBoxListe[i].classList.remove("hideReferat");
            }
            for (let i = 0; i < 1; i++) {
                GFboxListe[i].classList.remove("hideReferat");
            }
            

            //Bruger Event functioner
            referatFunc();
            showBlock(document.querySelector("#referatShowHideBtn"), document.querySelector("#referatContainer"));
            showBlock(document.querySelector("#clickReferat1"), document.querySelector("#referatContent"));
            showBlock(document.querySelector("#clickReferat2"), document.querySelector("#GFcontent"));
        }

        
        //== Eventlistener som kigger efter "selected"
        li.addEventListener("click", () => {
            let ulList = document.querySelectorAll(".underNav"); // Finder liste med elementer.
            ulList.forEach(list => list.classList.remove("selected"));//Fjerner active fra alle <li> elementer
            li.classList.add("selected"); // Tilføjer Active til den som er blevet klikket
            
            //Er til underNav - Bliv Medlem
            if (window.location.href.indexOf(IDblivmedlem[0]) != -1) {
                ulList.forEach(li => {
                    if (li.classList.contains("selected")) {
                        let selected = li.id;
                        switch(selected) {
                        case "one":
                            makeConventus();
                            break;
                        case "two":
                            makeTilmelding();
                            break;
                        case "three":
                            makeMentor();
    
                            break;
                        default:
                            makeSejlUndervisning();
                        }
                    }
                })
            }

            //Er til underNav - Sejlerskolen
            if (window.location.href.indexOf(IDsejlklub[0]) != -1) {
                ulList.forEach(li => {
                    if (li.classList.contains("selected")) {
                        let selected = li.id;
                        switch(selected) {
                        case "one":
                            makeSejlUndervisning();
                            break;
                        case "two":
                            makeSejlNye();
                            break;
                            case "three":
                            makeSejlErfarende();
                            break;
                        default:
                            makeSejlUndervisning();
                        }
                    }
                })
            }

            //Er til underNav - Ungdom
            if (window.location.href.indexOf(IDungdom[0]) != -1) {
                ulList.forEach(li => {
                    if (li.classList.contains("selected")) {
                        let selected = li.id;
                        switch(selected) {
                        case "one":
                            makeUngUndervisning();
                            break;
                        case "two":
                            makeUngStaevner();
                            break;
                        case "three":
                            makeUngInfoTilForaeldre();
                            break;
                        default:
                            makeUngUndervisning();
                        }
                    }
                })
            }
        
            //Er til underNav - Om Klubben
            if(window.location.href.indexOf(IDomklubben[0]) != -1) {
                ulList.forEach(li => {
                    if (li.classList.contains("selected")) {
                        let selected = li.id;
                        switch(selected) {
                        case "one":
                            makeBestyrelsen();
                            break;
                        case "two":
                            makePolitik();
                            break;
                        case "three":
                            makeKlubblad();
                            break;
                        case "four":
                            makeHistorie();
                            break;
                        // case "five":  // Er ikke lavet i denne version.
                        //     makeGalleri();
                        //     break;
                        default:
                            makeBestyrelsen();
                        }
                    }
                })
            }
        })    
    };
}



//BACKUP (OLD CONTENT)

// function makeBestyrelsen() { //Den her function bliver gentage 1 gang til. Den her function har tilformål at starte OmKlubben på Bestyrelsen's side.
//     let findPost = data.find(post => post.id == IDomklubbenUndersider[0]),
//         title = findPost.acf[10],
//         tekst = findPost.acf[1], // Problemer med at lave et array i ACF. Duer ikke hvis man bruger 0 direkte inde i ACF, skal være i en under gruppe. 0 forsvinder og er ikke med i arrayet.
//         begivenheder = '<h2>' + title + '</h2><p>' + tekst + '</p>',
//         medlemmer = '<section id="bestyrelseListe">';
//         console.log(findPost)
//     for(let i = 2; i < 10; i++) { // Skal skabe 8, medlems kasser. Starter på  let i = 2 fordi der efter komme de ønskede data.
//         let medlemsInfo = findPost.acf[i], //Finder data til hver medlem.
//             billede = medlemsInfo.medlems_billede;
//         if (billede == false) { //Hvis medlemmet ikke har et billede, bruges et dummy billede i stedet for.
//             billede = findPost.acf[11];
//         }
//         medlemmer += '<article><img src="' + billede + '" alt="Billede af medlem ' + medlemsInfo.navn + '">';
//         medlemmer += '<div><h3>' + medlemsInfo.navn + '</h3><h4>' + medlemsInfo.position + '</h4><ul><li>Tlf nr: ' + medlemsInfo.telefon + '</li><li>Email: ' + medlemsInfo.email + '</li></ul></div></article>';
//     }
//     medlemmer += '</section>';
//     //== Skaber Referater
//     // - Find Referater
//     const IDreferat = Number(postData.acf.id.categories.referater);

//     let
//     referatListe = data.filter(post => post.categories.includes(IDreferat)),
//     referatBox = "",
//     referatOutput = "";
//     //Skaber kasse til hver referat
//     referatListe.forEach(referat => {
//         //Skal finde ud af hvornår posten sidst er blevet ændret.
//         function modDato() {
//             let mod = referat.modified, //Data på sidste gange der er sket ændringer.
//                 splitMod1 = mod.split("T");
//                 splitMod2 = splitMod1[0].split("-"),
//                 day = Number(splitMod2[2]),
//                 month = Number(splitMod2[1]),
//                 year = Number(splitMod2[0]),
//                 nonNumberMonth = numberToMonth(month),
//                 output = day + '. ' + nonNumberMonth + ' ' + year;
//                 return output;
//         }
//         let overskrift = referat.acf.overskrift,
//             dato = modDato(),
//             link = referat.acf.link;

//         referatBox = '<div class="referatBox hideReferat"><h3>' + overskrift + '</h3><h5>Sidst ændret den ' + dato + '</h5><a href="' + link + '">ÅBEN</a></div>';
//         referatOutput += referatBox;
        
//     })

//     console.log(referatOutput)
//     let referatBestyrelse = '<article>' + referatOutput + '</article>';
//         // referatGeneral = '<article>' + referatGeneralOutput + '</article>';
//     referat = '<section id="referat"><div><h2><h2><p></p></button></div>' + referatBestyrelse + '<div id="btnDiv"><button type="button" id="referatBtnReverse">&#60;</button><button type="button" id="referatBtn">&#62;</button></div></section>';
    
    
//     createHTML("main", begivenheder + medlemmer + referat);        
//     let referatBoxListe = document.querySelectorAll(".referatBox");
//     for (let i = 0; i < 6; i++) {
//         referatBoxListe[i].classList.remove("hideReferat");
//     }
//     referatFunc();
//     showBlock(document.querySelector("#referatShowHideBtn"), document.querySelector("#referatContainer"));
// }

//GLOBAL "BLADRE" function som ikke helt ville fungere. Kunne ikke finde list inde i click event
 // function referatFunc (click, clickReverse, list) {
        //     let loopNr = 6,
        //         pageNr = 1,
        //         total = list.length,
        //         pageDivide = total / 6,
        //         pageTotal = Math.ceil(pageDivide),
        //         pageSpan = document.createElement("span");
        //         pageSpan.textContent = ' ' + pageNr + ' af ' + pageTotal + ' ';
        //         clickReverse.after(pageSpan);
        //         //== Hvis mere indhold 6 af gangen
 
        //         click.addEventListener("click", function (click, clickReverse) {
        //             let boxList = list; // Drillede, men det virkede at lave let inde i function. Den må have ikke have kunne finde den ellers. 

        //             boxList.forEach(post => {
        //                 post.style.display = "none";
        //             })
        //             if (loopNr == 0) { //Reseter hvis brugeren er gået frem og tilbage i listen.
        //                 loopNr += 6;
        //             }
        //             //== Skal vise forskellige indhold ved hver click
        //             for (let i = loopNr; i < loopNr + 6; i++) { // Inspiration fra: https://www.markuptag.com/javascript-load-more-content-on-click-button/
        //                 if (boxList[i]) {
        //                     boxList[i].style.display = "block";
        //                 }
        //             }
        //             loopNr += 6;
        //             pageNr += 1;
        //             pageSpan.textContent = ' ' + pageNr + ' af ' + pageTotal + ' ';//Ændre textContent når det bliver klikket.
        //             if (clickReverse.style.display = "none") { //Tilføjer ReverseBtn når ikke er på side 1
        //                 clickReverse.style.display = "inline-block";
        //             } 
        //             if (pageNr == pageTotal) {
        //                 click.style.display = "none";
        //             }
        //         })
        
        //     //== Hvis mindre indhold 6 af gangen
        //     clickReverse.addEventListener("click", function (click, clickReverse, list) {
        //         // let boxList = list; // Drillede, men det virkede at lave let inde i function. Den må have ikke have kunne finde den ellers. 
        //         boxList.forEach(post => {
        //             post.style.display = "none";
        //         })
        //         loopNr -= 6;
        //         if(loopNr == 6) { //Fordi loopNr starter på 6, skal den være minus 12 i stedet for 6, for at kunne tegne indholdet som det var fra begyndelsen.
        //             loopNr -= 6;
        //         }
        //         //== Skal vise forskellige indhold ved hver click
        //         for (let i = loopNr; i < loopNr + 6; i++) { // Inspiration fra: https://www.markuptag.com/javascript-load-more-content-on-click-button/
        //             if (boxList[i]) {
        //                 boxList[i].style.display = "block";
        //             }
        //         }
        //         pageNr -= 1;
        //         pageSpan.textContent = ' ' + pageNr + ' af ' + pageTotal + ' ';//Ændre textContent når det bliver klikket.
        //         if (pageNr == 1) {//Fjerne tilbage knappen når på side 1
        //             clickReverse.style.display = "none";
        //         } 
        //         if (click.style.display = "none") { //Tilføjer Btn når den har været sat til display = none, altså når den har været på den maksimale side.
        //             click.style.display = "inline-block";
        //         } 
        //     })
        //     if (pageNr === 1) {//Fjerne tilbage knappen når på side 1
        //         clickReverse.style.display = "none";
        //     }
        // }