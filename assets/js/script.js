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
    let postData = data.find(post => post.id == 1248), // Er den bestemte post(id) som indeholder general data til produktet. 
    // Rækkefølge på data: Category, Tag, (Post - Hvis nødvendig)
        IDforside = [postData.acf.id.categories.forside, postData.acf.id.tags.forside, postData.acf.posts.forside], //ID'er fra categorier og tags som er relevant i henhold til Forsiden.
        IDnavigation = postData.acf.id.categories.navigation; // Dette ID er til alle hjemmesider som skal kunne findes i den globale navigation.
        //== FUNKTIONER
    function createHTML (placement, element) { // Skal tilføje indhold til et sted i DOM'en, men skulle det "område/element" have indhold vil det blive erstattet.
        document.querySelector(placement).innerHTML = element;
    }
    function addToHTML (placement, element) {// Derfor er der også en function som tilføjer til eksiterende data i et område. 
        document.querySelector(placement).innerHTML += element;
    }

     //========================== FIND ID AND PAGE INFORMATION
    let current = getURL();
    function getURL () {
        let id = 0;
        const pageURL = window.location.pathname; //Pathname bruges i stedet for href, fordi vi behøver ikke kigge i domænenavnet(På studie serveren ville det være https://mmd.ucn.dk/), alt efter er pathname f.eks. /class/mmda0920/

        if(pageURL.indexOf("pageId") != -1) {
            let split = pageURL.split("pageId=");
            id = split[1];
        }
        return id;
    }
    function findCurrent (current) {
        let currentSite = data.find(site => site.id == current); // Kigger på current(Kunne være f.eks 0), og skal finde en post i vores data-set som matcher.
        return currentSite; // Den skal give den post som matcher tilbage til den som spurgte, her ville det være hvem end som brugte function findCurrent. Den vil så give hele JSON objektet som mathcer id'et.
    }
    //========================== MAKE BLOCKS OF ELEMENTS FOR PRODUCT
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
                currentPage = "";
            //== Tilføjer currentPage class, til Nav-element som matcher current(Altså den aktive side på dette tidspunkt).
            if (site.id == current) {
                currentPage = 'class="currentPage"';
            }
            //== Skaber HTML elementer med information fra hver Post som matcher ID'et.
            navigation += '<li id="nav-' + siteTitle +'" ' + currentPage +'><a href="?pageId="' + site.id +'">' + siteTitle +'</a></li>';
        })
        navigation += '</ul>';

        //== Mobil/Tablet and Desktop Mediaqueries
        // - Mobil og Tablet, bruges til at kigge hvilke elementer som skal skabes/ikke skabes. F.eks. til en HamburgerMenu. 
        let mobil = window.matchMedia("(max-width: 480px)"),
            tablet = window.matchMedia("(min-width: 481px) and (max-width: 1024px)");
        if (mobil.matches || tablet.matches) { //Matches går ind og kigger på vores MediaQueryString og ser om den "matcher", altså om den er rigtig i forhold til window.innerWidth.
            allNav += '<div id="burgerBtnContainer"><div class="burger"></div><div class="burger"></div><div class="burger"></div></div>' // Skaber HamburgerMenu
            allNav += '<section id="curtainContainer"><article id="curtain">' + navigation + '</article></section></nav>'; // Skaber Curtain som indeholder hele den Globale Navigation
            
            
            if (mobil.matches) {
                console.log("mobil")
            }
            if (tablet.matches) {
                console.log("tablet")
            }
        } 
        if (!mobil.matches && !tablet.matches) {
            console.log("not mobil")
            allNav += navigation;
            allNav += '</nav>';
        }
        console.log(allNav)
        createHTML("body", allNav);
    }
    makeNavigation();
    function makeFooter () {

    }
    function makeLayout (current) {
        //===== WHICH CASE TO USE TO DRAW CONTENT
        let currentSite = findCurrent(current);
        const currentTag = currentSite.tags[0]; //Vi tilføjer [0] fordi vi kigger i et array, som har et tal.
        switch (currentTag) {
            case IDforside[1]:
                makeForside();
                break;
            case 41:
                makeBegivenhed();
                break;
            case 42:
                makeNyhed();
                break;
            default:
                makeForside();
        }
        //===== EXTRA THINGS TO ADD
        makeTitle(currentSite);
        makeNavigation(currentSite);
        makeFooter();
    }
     //========================== CREATE THE PRODUCT
    function createSite(current) {
        if (current == 0 || current == undefined) {// Skal bruges til at hvis pageId = 0 eller ikke defineret, så skal den lave Forsiden som vi definere.
            const forside = data.find(forside => forside.id == IDforside[2]);
            current = forside.id;
        }

        makeLayout(current);
        console.log(current);

    }
    createSite(current);

    console.log("fisk",current);
    //Lave matchID og FindpageID sammen med drawSite??
    //findpagebyIDinURL - split at = to begin with?? only need the pageId number??
}

//======================== TO DO
//ændre i URL så den har den rette kategori( SNV.dk = 43 )