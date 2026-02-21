document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem("metametaEnabled") === "true"){
        const page = window.location.pathname.split("/").pop();
        console.log(page);
        let replacefrom;
        let replaceto;
        switch(page){
            case "around-the-world":
                replacefrom = "quite";
                replaceto = "puite";
                break;
            case "the-final-remix":
                replacefrom = "Check your answer";
                replaceto = "Check your ansber";
                break;
            case "alien-math":
                replacefrom = ">The End<";
                replaceto = ">The Nnd<";
                break;
            case "i-wanna-baba-is-you":
                replacefrom = "recommended";
                replaceto = "aecommended";
                break;
            case "cursed-and-hexed":
                replacefrom = "Teams";
                replaceto = "Veams";
                break;
            case "erm-actually":
                replacefrom = "Actually";
                replaceto = "Actuallk";
                break;
            case "shiny-red-button":
                replacefrom = "Check your answer";
                replaceto = "Check yotr answer";
                break;
            case "workout-routine":
                replacefrom = "View solution";
                replaceto = "Vlew solution";
                break;
            case "i-really-love":
                replacefrom = "Home";
                replaceto = "Hume";
                break;
            case "puzzledoku":
                replacefrom = "    Puzzles";
                replaceto = "    Zuzzles";
                break;

            case "did-you-mean":
                replacefrom = "About";
                replaceto = "Ybout";
                break;
            case "bad-time":
                replacefrom = "View solution";
                replaceto = "View oolution";
                break;
            case "biological-wordfare":
                replacefrom = "Wordfare";
                replaceto = "Wormfare";
                break;
            case "flex-tape":
                replacefrom = "Flex Tape";
                replaceto = "Dlex Tape";
                break;
            case "three-is-a-gang":
                replacefrom = "Gang";
                replaceto = "Xang";
                break;
            case "obligatory-balatro-puzzle":
                replacefrom = "highest";
                replaceto = "jighest";
                break;
            case "concert":
                replacefrom = "Japanese";
                replaceto = "Rapanese";
                break;
            case "start-here":
                replacefrom = "work superior";
                replaceto = "wore superior";
                break;
            case "puzzle-factory":
                replacefrom = "    Puzzles";
                replaceto = "    Puzzqes";
                break;

            case "a-silly-crossword-ii":
                replacefrom = "    Puzzles";
                replaceto = "    Puszles";
                break;
            case "side-to-side":
                replacefrom = "exactly";
                replaceto = "eiactly";
                break;
            case "cutting-onions":
                replacefrom = "Cutting";
                replaceto = "Futting";
                break;
            case "may-i-have-a-silly-crossword":
                replacefrom = ">Overworld<";
                replaceto = ">Ogerworld<";
                break;
            case "superposition":
                replacefrom = "About";
                replaceto = "Awout";
                break;
            case "when-the-puzzle":
                replacefrom = "when the puzzle";
                replaceto = "whec the puzzle";
                break;
            case "lost-in-translation":
                replacefrom = "Teams";
                replaceto = "Teahs";
                break;
        }
        console.log(replacefrom, replaceto);
        document.body.innerHTML = document.body.innerHTML.replace(replacefrom, replaceto);
    }
});
