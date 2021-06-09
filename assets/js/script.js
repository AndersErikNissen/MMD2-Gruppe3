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
    if (this.readyState == 4 && this.status == 200) { // readyState == 4, betyder at den er færdig og har gennemført det som blev spurgt efter, og status == 200 betyder at den metode som er blevet spurgt efter har lykkedes.
        try {
        const data = JSON.parse(this.response);
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


        IDnyhedtemplate = Number(postData.acf.id.categories.nyhedtemplate),
        logo = postData.acf.billeder[0],

        // - Mobil og Tablet, bruges til at kigge hvilke elementer som skal skabes/ikke skabes. F.eks. til en HamburgerMenu. 
        mobil = window.matchMedia("(min-width: 320px) and (max-width: 480px)"),
        tablet = window.matchMedia("(min-width: 481px) and (max-width: 1024px)");

        
        console.log("data", postData)
    //== FUNKTIONER
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
    function sortNew (list) {
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
            const IDreferat = Number(postData.acf.id.categories.referater);
            let
            referatListe = data.filter(post => post.categories.includes(IDreferat)),
            referatBox = "",
            referatOutput = "";
            //Skaber kasse til hver referat
            referatListe.forEach(referat => {
                //Skal finde ud af hvornår post'en sidst er blevet ændret.
                function modDato() {
                    let mod = referat.modified, //Data på sidste gange der er sket ændringer.
                        splitMod1 = mod.split("T");
                        splitMod2 = splitMod1[0].split("-"),
                        day = Number(splitMod2[2]),
                        month = Number(splitMod2[1]),
                        year = Number(splitMod2[0]),
                        nonNumberMonth = numberToMonth(month),
                        output = day + '. ' + nonNumberMonth + ' ' + year;
                        return output;
                }
                let overskrift = referat.acf.overskrift,
                    dato = modDato(),
                    link = referat.acf.link;

                referatBox = '<div class="referatBox hideReferat"><h3>' + overskrift + '</h3><h5>Sidst ændret den ' + dato + '</h5><a href="' + link + '">ÅBEN</a></div>';
                referatOutput += referatBox;
                
            })
            //Skaber alt indholde til referater
            let
            rData = findPost.acf[12],
            referatBestyrelse = '<article id="referatContainer">' + referatOutput;
            referat = '<section id="referat"><article><h2>' + rData[0] + '<h2><p>' + rData[1] + '</p><button type="button" id="referatShowHideBtn">MERE INFORMATION</button></article>' + referatBestyrelse + '<div id="btnDiv"><button type="button" id="referatBtnReverse">&#60;</button><button type="button" id="referatBtn">&#62;</button></div></article></section>';
            
            
            createHTML("main", begivenheder + medlemmer + referat);
            
            //Sørger for at 6 referater bliver vist "onload"
            let referatBoxListe = document.querySelectorAll(".referatBox");
            for (let i = 0; i < 6; i++) {
                referatBoxListe[i].classList.remove("hideReferat");
            }
        }

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
            //Samler alt indhold til Ungdom Undervisning
            let main = krummer + '<section><article><h2>' + IDbannerUngdom[3][0] + '</h2><ul>' + liER + '</ul></article><img src="' + billede + '" alt="Billede til Undervisning - Ungdom"></section>' + section1 + section2;

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
            }
            underUl.appendChild(li);
            addAndRemove(li);
            nr++;
            nrID++;
        }
        //== Skaber de sidste elementer til at skabe Undernavigationen.
        let underNavigation = document.createElement("section");
        underNavigation.id = "underNavigation";
        document.querySelector("header").after(underNavigation);
        document.querySelector("#underNavContent").appendChild(underUl);
    }

     //========================== FIND ID AND PAGE INFORMATION
    let currentID = getURL();
    function getURL () {
        let id = 0;
        const pageURL = window.location.href; //Pathname kigger op indtil ?pageId=, til gengæld virker .href (På studie serveren ville det være https://mmd.ucn.dk/) og .search fint.
        console.log(pageURL)
        
        if(pageURL.indexOf("pageId") != -1) { // Hvis pageURL indeholder pageId, og -1 ikke er true, så skal if sætningen bruges. 
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
            navigation += '<li id="nav-' + siteTitleNoSpace +'" ' + currentPage +'><a href="?pageId=' + site.id +'">' + siteTitle +'</a></li>';
        })
        navigation += '</ul>';

        //== Mobil/Tablet and Desktop Mediaqueries
        if (mobil.matches || tablet.matches) { //Matches går ind og kigger på vores MediaQueryString og ser om den "matcher", altså om den er rigtig i forhold til window.innerWidth.
            allNav += '<div id="burgerBtnContainer"><div class="burger"></div><div class="burger"></div><div class="burger"></div></div>' // Skaber HamburgerMenu
            allNav += '<section id="curtainContainer"><article id="curtain">' + navigation + '</article></section>'; // Skaber Curtain som indeholder hele den Globale Navigation
            allNav += '<div><a href=?pageId="' + IDforside[2] + '"><img src="' + logo +'" alt=""></a></div></nav>';
            
            if (mobil.matches) {
                console.log("Layout: Mobile Version")
            }
            if (tablet.matches) {
                console.log("Layout: Tablet Version")
            }
        } 
        if (!mobil.matches && !tablet.matches) {
            console.log("Layout: Desktop Version")
            allNav += '<div><a href="?pageId=' + IDforside[2] + '"><img src="' + logo +'" alt=""></a></div>';
            allNav += navigation + '</nav>';
        }
        createHTML("header", allNav);
    }
    function makeSponsor () {
        let sponsor = '<section id="infi"><ul id="infiContent">',
            infiChildren = postData.acf.billeder[1],
            sponsorNr = 1;
        
        infiChildren.forEach(child => {
            if (!child == "") {// Har 12 pladser i ACF'en, så der er plads til flere sponsorer. Når en af dem er tomme, så er der ingen grund til at lave et <li>.
                sponsor += '<li class="infiChild"><img src="' + child + '" alt="Spononsor Nummer: ' + sponsorNr + '"></li>';
                sponsorNr++;
            }
        })
        sponsor += '</ul></section>';
        addToHTML("#sponsorSection", sponsor);
    }
    function makeFooter () {
        let address = '<address><h2>KONTAKT</h2></address>',
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

        let footer = address + footerNav;
        createHTML("footer", footer);
    }
    //========================== ALLE TEMPLATES
    function makeForside (current) {

        let forside = data.find(post => post.id == IDforside[2]), 
            allHTML, hero = "", news = "", events = "", afdeling = '<section id="afdeling"><h2>' + forside.acf.overskrifter[3] + '</h2>', sponsor = "";
        const nyhedsList = data.filter(post => post.categories.includes(IDnyhedtemplate));
        
        //== Skaber Hero Banner
        let forsideh1 = forside.acf.overskrifter[0],
            forsideTekst = forside.acf.brodtekst,
            forsideImgs = forside.acf.hero,
            heroUl = '<ul>',
            nr = 1;

            forsideImgs.forEach(img => {
                heroUl += '<li class="heroSlide"><img id="hero' + nr + '" src="' + img + '" alt="Hero' + nr + '"></li>'
                nr++; // Bruges til at give et nummer til hver billede(Id og alt tekst)
            })
            hero += '<section id="heroSlideShow"><h1>' + forsideh1 + '</h1><p>' + forsideTekst + '</p>' + heroUl + '<div id="heroSlideShowCover"></div></section>'
        
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
            news += '<article class="newsBox"><h3>' + overskrift + '</h3><p>' + tekstSub + ' ...</p><a href="?pageId=' + nyhedsList[i].id + '">SE MERE</a></article>';
        }
        news += '</div><a href="?pageId=' + IDnyheder[0] + '">SE NYHEDSOVERSIGT</a></section>';
        
        //== Skaber Events
        events += '<section id="events"><h2>' + forside.acf.overskrifter[2] + '</h2><div id="eventPosts">';
        //== Sortering og HTML til hvert "card/kort"
        let eventList = data.filter(post => post.categories.includes(66)),
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
            
            events += '<article class="eventBox"><h3>' + day + '. <span class="spanTable">' + numberToMonth(month) + '</span></h3><h4>' + title + '</h4><ul><li>Dato: ' + dato[0] + ' - ' + dato[1] + '</li><li>Tid: ' + tid[0] + ' - ' + tid[1] + '</li></ul><a href="?pageId=' + sortedList[i].id + '">SE MERE</a></article>'
        }
        events += '</div><a href="?pageId=' + IDbegivenheder[0] + '">SE FLERE</a></section>'
       
        //== Skaber Afdelinger
        let objAfdeling = { //Indeholder data til de forskellige under-Afdelinger.
                underafdeling_UngSejl: [IDbannerUngdom, IDbannerSejlerskolen],
                underafdeling_KapJ70: [IDbannerAfdelinger[3], IDbannerAfdelinger[4]],
                ids: [postData.acf.id.categories.underafdelinger[0], postData.acf.id.categories.underafdelinger[1]]
            },
            nrInArray = 0;
            afdeling += '<div id="afdelingFlex">';

        objAfdeling.underafdeling_UngSejl.forEach(item => {
            afdeling += '<article class="afdelingBox"><div class="afdelingOverlay"><h3>' + item[0] + '</h3><p>' + item[1] + '</p><a href="?pageId=' + objAfdeling.ids[nrInArray] + '">SE MERE</a><img src="' + item[2] + '" alt=""></article>';
            nrInArray++;
        })
        objAfdeling.underafdeling_KapJ70.forEach(item => {
            afdeling += '<article class="afdelingBox"><div class="afdelingOverlay"><h3>' + item[0] + '</h3><p>' + item[1] + '</p><a hrefSE MERE=""></a><img src="' + item[2] + '" alt=""></article>';
        })
        afdeling += '</div></section>';

        allHTML = hero + news + events + afdeling;
        createHTML("main", allHTML)
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
        let sejl = '<article id="heroLille"><h1>' + IDbannerSejlerskolen[0] + '</h1><p>' + IDbannerSejlerskolen[1] + '</p><img src="' + IDbannerSejlerskolen[2] + '" alt="Billede til Header - Sejlskolen Voksne"><a href="?pageId=' + IDblivmedlem[0] + '">Tilmelding</a></article>';
        
        //Laver Section til UnderNav
        makeUnderNavSection();
        createHTML("#underNavContent", sejl);
        //== Laver Undernavigation med knapper og eventlisteners
        makeUnderNavigation(IDbannerSejlerskolen[3], IDbannerSejlerskolen[3].length); // (Array som skal indeholder overskrifter til UnderNavigation, mængden af loops som skal laves)
    }
    console.log(IDsejlklub[0])
    function makeLayout (current) {
        //===== WHICH CASE TO USE TO DRAW CONTENT
        let currentSite = findCurrent(current);
        const currentTag = currentSite.tags[0]; //Vi tilføjer [0] fordi vi kigger i et array, som har et tal.
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
            document.querySelector("#referatBtnReverse").after(pageSpan);
           
            //== Hvis mere indhold 6 af gangen
            document.querySelector("#referatBtn").addEventListener("click", function () {
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
                console.log(loopNr)
                pageSpan.textContent = ' ' + pageNr + ' af ' + pageTotal + ' ';//Ændre textContent når det bliver klikket.
        
                if (document.querySelector("#referatBtnReverse").style.display = "none") { //Tilføjer ReverseBtn når ikke er på side 1
                    document.querySelector("#referatBtnReverse").style.display = "inline-block";
                } 
                if (pageNr == pageTotal) {
                    document.querySelector("#referatBtn").style.display = "none";
                }
            })
        
            //== Hvis mindre indhold 6 af gangen
            document.querySelector("#referatBtnReverse").addEventListener("click", function () {
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
                    document.querySelector("#referatBtnReverse").style.display = "none";
                } 
                if (document.querySelector("#referatBtn").style.display = "none") { //Tilføjer Btn når den har været sat til display = none, altså når den har været på den maksimale side.
                    document.querySelector("#referatBtn").style.display = "inline-block";
                } 
            })
            if (pageNr === 1) {//Fjerne tilbage knappen når på side 1
                document.querySelector("#referatBtnReverse").style.display = "none";
            }
        }
    }
    if (window.location.href.indexOf(IDomklubben[0]) != -1) {
        if (document.querySelector("#one").classList.contains("selected") != -1) {
            referatFunc();
            showBlock(document.querySelector("#referatShowHideBtn"), document.querySelector("#referatContainer"));
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
        //ID til nemmere navigation #4

        //== Funktioner til Afdelinger Undersider

        // - Sejlerskolen
        function makeSejlUndervisning() {
            let
            postID = IDsejlklub[0],
            findPost = data.find(post => post.id == postID),
            dataPost = findPost.acf,
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
                    //Array indeholder: Link Tekst, Link Beskrivelse, Billede til Appen
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
                    //Ul
                    "ulTitle": dataArray[0].tekst_liste_1[0],
                    //Ul1
                    "ul1": dataArray[0].tekst_liste_1[1],
                    "li1Array": [dataArray[0].tekst_liste_1[2], dataArray[0].tekst_liste_1[3],dataArray[0].tekst_liste_1[4],dataArray[0].tekst_liste_1[5]],
                    //Ul2
                    "ul2": [dataArray[0].tekst_liste_1[6]]
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

            //Skaber ul til Intro Section
            liste1 = '<ul>';
            uData.intro.li1Array.forEach(item => {
                liste1 += '<li>' + item + '</li>'
            })
            liste1 += '</ul>';

            //Skaber liste med billeder
            let imgList = '';
            uData.galleri.skibe.forEach(skib => {
                imgList += '<article><img src="' + skib[0] + '" alt="Billede af bådmodellen: ' + skib[1] + '"><div><h4>' + skib[1] + '</h4><ul><li>' + skib[2] + '</li><li>' + skib[3] + '</li></ul></div></article>'
            })

            //Skaber og samler hovedindholdet
            let intro = '<section id="introSejlUndervisning"><article><h2>' + uData.intro.title1 + '</h2><p>' + uData.intro.beskriv1 + '</p><h3>' + uData.intro.title2 + '</h3><p>' + uData.intro.beskriv2 + '</p></article><article><h2>' + uData.intro.ulTitle + '</h2><h3>' + uData.intro.ul1 + '</h3>' + liste1 + '<h3>' + uData.intro.ul2 + '</h3></article></section>',
                galleri = '<section id="galleriSejlUndervisning"><article><h2>' + uData.galleri.title + '</h2><p>' + uData.galleri.beskriv + '</p></article><section>' + imgList + '</section></section>',
                nye = '<section id="nyeSejlUndervisning"><article><h2>' +  + '</h2><p>' +  + '</p></article></section>',
                erfarende = '<section  id="erfarendeSejlUndervisning"><article><h2>' +  + '</h2><p>' +  + '</p></article></section>',
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
            krummer = '<div class="krumme"><a href="?pageId=' + IDafdelinger[0] + '">' + IDbannerAfdelinger[0] + '</a><span> &#62; </span><a href="?pageId=' + IDsejlklub[0] + '">' + IDbannerSejlerskolen[0] + '</a></div>';





            createHTML("main", krummer + intro)
            console.log(dataArray)
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

            //Skaber Forældreråd Boks
            let raadBoks = '<section><article><h3>' + fData.title + '</h3><p>' + fData.beskriv1 + '</p><p>' + fData.beskriv2 + '</p></article><img src="' + fData.billede + '" alt="Billede til Forældreråd"</section>';
            let intro = krummer + '<section><article><h2>' + iData.title + '</h2><h3>' + iData.under + '</h3><p>' + iData.beskriv + '</p></article><article><h2>' + iData.sikkerhed[0] + '</h2>' + iUl + '</article></section>' + raadBoks;

            createHTML("main", intro)
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
                    "info2": sFindData.info_2
                };
                //Skaber 2 lister med Links fra Info 1 / 2
                let liste1 = '<article>',
                    liste2 = '<article>';
                sData.info1.forEach(list => {
                    liste1 += '<div><h4>' + list[0] + '</h4><a href="' + list[1] + '">ÅBEN</a></div>'
                })
                sData.info2.forEach(list => {
                    liste2 += '<div><h4>' + list[0] + '</h4><a href="' + list[1] + '">ÅBEN</a></div>'
                })
                liste1 += '</article>';
                liste2 += '</article>';
                
                //Skaber hovedindhold
                let staevneContent = '<section id="staevneContent_' + number +'"><article><h3>' + sData.pTitle + '</h3><p>' + sData.pInfo + '</p><a href="' + sData.tilmeld + '">Tilmelding</a></article>' + liste1 + liste2 +'</section>';
                staevne += '<section id="staevne_' + number + '" class="staevneContent"><article><div><h3>' + sData.title + '</h3><h4>' +  sData.year + '</h4><div><p>' + sData.beskriv + OBS + '</p><button type=button id="staevneBtn_' + number + '"></button></article>' + staevneContent + '</section>';
                
                // Skal "udløse" hvis årstallet er mindre end 2021, de nuværende år. Kunne også være relevant at kigge på dag/måned.
                let date = new Date(),
                    year = date.getFullYear();
                if (sData.year < year) {
                    OBS = '<span>OBS: Dette Event er udgået!</span>';
                }
                
                number++; //number +1 til næste loop
            })

            //Skaber hoved indholdet
            //Første Stævne (Ikke Dynamisk)
            let main = krummer + '<section>' + intro + '<img src="' + findPost.acf.billede + '" alt="Billede til Stævner - Ungdom"></section>' + staevne;
            
            createHTML("main", main)
            //Bruger ShowBlock på alle sektioner som skabes via sDataPost.
            sDataPost.forEach(section => {
                number--; //Fordi vi bruger number++ får at give navn til i det første forEach loop, så skal vi her have -1 for at id'et matcher.
                showBlock(document.querySelector('#staevneBtn_' + number), document.querySelector('#staevneContent_' + number));
            })
            // showBlock(document.querySelector('#staevneBtn_1'), document.querySelector('#staevneContent_1'));
            console.log(document.querySelector("#staevneBtn_1"))
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
            //Samler alt indhold til Ungdom Undervisning
            let main = krummer + '<section><article><h2>' + IDbannerUngdom[3][0] + '</h2><ul>' + liER + '</ul></article><img src="' + billede + '" alt="Billede til Undervisning - Ungdom"></section>' + section1 + section2;

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
            const IDreferat = Number(postData.acf.id.categories.referater);
            let
            referatListe = data.filter(post => post.categories.includes(IDreferat)),
            referatBox = "",
            referatOutput = "";
            //Skaber kasse til hver referat
            referatListe.forEach(referat => {
                //Skal finde ud af hvornår post'en sidst er blevet ændret.
                function modDato() {
                    let mod = referat.modified, //Data på sidste gange der er sket ændringer.
                        splitMod1 = mod.split("T");
                        splitMod2 = splitMod1[0].split("-"),
                        day = Number(splitMod2[2]),
                        month = Number(splitMod2[1]),
                        year = Number(splitMod2[0]),
                        nonNumberMonth = numberToMonth(month),
                        output = day + '. ' + nonNumberMonth + ' ' + year;
                        return output;
                }
                let overskrift = referat.acf.overskrift,
                    dato = modDato(),
                    link = referat.acf.link;

                referatBox = '<div class="referatBox hideReferat"><h3>' + overskrift + '</h3><h5>Sidst ændret den ' + dato + '</h5><a href="' + link + '">ÅBEN</a></div>';
                referatOutput += referatBox;
                
            })
            //Skaber alt indholde til referater
            let
            rData = findPost.acf[12],
            referatBestyrelse = '<article id="referatContainer">' + referatOutput;
            referat = '<section id="referat"><article><h2>' + rData[0] + '<h2><p>' + rData[1] + '</p><button type="button" id="referatShowHideBtn">MERE INFORMATION</button></article>' + referatBestyrelse + '<div id="btnDiv"><button type="button" id="referatBtnReverse">&#60;</button><button type="button" id="referatBtn">&#62;</button></div></article></section>';
            
            
            createHTML("main", begivenheder + medlemmer + referat);
            
            //Sørger for at 6 referater bliver vist "onload"
            let referatBoxListe = document.querySelectorAll(".referatBox");
            for (let i = 0; i < 6; i++) {
                referatBoxListe[i].classList.remove("hideReferat");
            }
            referatFunc();
            showBlock(document.querySelector("#referatShowHideBtn"), document.querySelector("#referatContainer"));
        }

        
        //== Eventlistener som kigger efter "selected"
        li.addEventListener("click", () => {
            let ulList = document.querySelectorAll(".underNav"); // Finder liste med elementer.
            ulList.forEach(list => list.classList.remove("selected"));//Fjerner active fra alle <li> elementer
            li.classList.add("selected"); // Tilføjer Active til den som er blevet klikket
            
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