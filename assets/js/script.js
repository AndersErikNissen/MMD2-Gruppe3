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
xhttp.open("GET", URLsite + 'posts?status=private&categories=' + categoryToLookFor + '&per_page=100', true) // GET fordi nu hvor vi har vores token, så vil vi gerne spørge om noget data vi kan arbejde med. 
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
        //== Funktioner til at skabe indhold.
        function makeBestyrelsen() { //Den her function bliver gentage 1 gang til. Den her function har tilformål at starte OmKlubben på Bestyrelsen's side.
            let findPost = data.find(post => post.id == IDomklubbenUndersider[0]),
                title = findPost.acf[10],
                tekst = findPost.acf[1], // Problemer med at lave et array i ACF. Duer ikke hvis man bruger 0 direkte inde i ACF, skal være i en under gruppe. 0 forsvinder og er ikke med i arrayet.
                begivenheder = '<h2>' + title + '</h2><p>' + tekst + '</p>',
                medlemmer = '<section id="bestyrelseListe">';
                console.log(findPost)
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
                //Skal finde ud af hvornår posten sidst er blevet ændret.
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
        
            console.log(referatOutput)
            let referatBestyrelse = '<article>' + referatOutput + '</article>';
                // referatGeneral = '<article>' + referatGeneralOutput + '</article>';
            referat = '<section id="referat"><div><h2><h2><p></p></button></div>' + referatBestyrelse + '<div id="btnDiv"><button type="button" id="referatBtnReverse">&#60;</button><button type="button" id="referatBtn">&#62;</button></div></section>';
            
            
            createHTML("main", begivenheder + medlemmer + referat);        
            let referatBoxListe = document.querySelectorAll(".referatBox");
            for (let i = 0; i < 6; i++) {
                referatBoxListe[i].classList.remove("hideReferat");
            }
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
                makeBestyrelsen();
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
        addToHTML("main", sponsor);
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
        console.log("Afdeling", afdeling)

        allHTML = hero + news + events + afdeling;
        createHTML("main", allHTML)
    }
    function makeOmklubben (current) {
        let omklubben = '<header id="heroLille"><h1>' + IDbannerOmklubben[0] + '</h1><p>' + IDbannerOmklubben[1] + '</p><img src="' + IDbannerOmklubben[2] + '" alt="Billede til ' + IDbannerOmklubben[0] + '">';

        
        makeUnderNavSection();
        createHTML("#underNavContent", omklubben);
        //== Laver Section som skal indeholde hovedindholdet i Main.
        //== Laver Undernavigation med knapper og eventlisteners
        makeUnderNavigation(IDbannerOmklubben[3], IDbannerOmklubben[3].length); // (Array som skal indeholder overskrifter til UnderNavigation, mængden af loops som skal laves)
    }



    function makeAfdelinger (current) {
        console.log("Afdelinger Template")
    }

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
            case IDbegivenheder[1]:
                    makeBegivenheder(currentSite);
                    break;
            case IDnyheder[1]:
                    makeNyheder(currentSite);
                    break;
            case IDblivmedlem[1]:
                    makeBlivmedlem(currentSite);
                    break;

            case 41:
                    makeBegivenhed(currentSite);
                    break;
            case 42:
                    makeNyhed(currentSite);
                    break;
            default: //F.eks hvis den ikke kan finde et tag, så bruger den default
                    makeForside(currentSite);
                    console.log("USING Template: Default")
        }
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

    // Eventlisteneres
    //== Hvis mere indhold 6 af gangen

    //== Om Klubben - Bestyrelsen - Referat
    // Skab side 1 ud af X
  
    
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
        if (document.querySelector("#one").classList.contains("selected")) {
            referatFunc();
        }
    }

    //== UnderNavigation
    function addAndRemove (li) {
        
        function makePolitik() {
            let main = '<h1>Fisk</h1>'
           createHTML("main", main)
            console.log("fisk")
        }

        function makeBestyrelsen() { //Den her function bliver gentage 1 gang til. Den her function har tilformål at starte OmKlubben på Bestyrelsen's side.
            let findPost = data.find(post => post.id == IDomklubbenUndersider[0]),
                title = findPost.acf[10],
                tekst = findPost.acf[1], // Problemer med at lave et array i ACF. Duer ikke hvis man bruger 0 direkte inde i ACF, skal være i en under gruppe. 0 forsvinder og er ikke med i arrayet.
                begivenheder = '<h2>' + title + '</h2><p>' + tekst + '</p>',
                medlemmer = '<section id="bestyrelseListe">';
                console.log(findPost)
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
                //Skal finde ud af hvornår posten sidst er blevet ændret.
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
        
            console.log(referatOutput)
            let referatBestyrelse = '<article>' + referatOutput + '</article>';
                // referatGeneral = '<article>' + referatGeneralOutput + '</article>';
            referat = '<section id="referat"><div><h2><h2><p></p></button></div>' + referatBestyrelse + '<div id="btnDiv"><button type="button" id="referatBtnReverse">&#60;</button><button type="button" id="referatBtn">&#62;</button></div></section>';
            
            
            createHTML("main", begivenheder + medlemmer + referat);        
            let referatBoxListe = document.querySelectorAll(".referatBox");
            for (let i = 0; i < 6; i++) {
                referatBoxListe[i].classList.remove("hideReferat");
            }
            referatFunc();
        }
        //== Eventlistener som kigger efter "selected"
        li.addEventListener("click", () => {
            let ulList = document.querySelectorAll(".underNav"); // Finder liste med elementer.
            ulList.forEach(list => list.classList.remove("selected"));//Fjerner active fra alle <li> elementer
            li.classList.add("selected"); // Tilføjer Active til den som er blevet klikket
        
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
                case "five":
                    makeGalleri();
                    break;
                default:
                    makeBestyrelsen();
            }
        }
        })
    })    
    };
}