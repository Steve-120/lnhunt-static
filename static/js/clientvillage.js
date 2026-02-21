document.addEventListener("DOMContentLoaded", () => {
    const INVENTORY_KEY = "inventory"; 
    let inventoryList = [];
    let craftingList = Array(9).fill(null);
    let craftResult = null;
    let selectorItem = null;
    let furnaceItem = null;
    let furnaceFuel = null;
    let furnaceResult = null;

    const invGrid = document.querySelector("#_3x9");

    /*** === LOCAL STORAGE & INVENTORY MANAGEMENT === ***/
    function loadInventory() {
        try {
            const stored = localStorage.getItem(INVENTORY_KEY);
            if (stored) inventoryList = JSON.parse(stored) || [];
            else inventoryList = [];
        } catch (e) {
            console.error("Failed to load inventory:", e);
            inventoryList = [];
        }
    }

    function saveInventory() {
        try { localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventoryList)); }
        catch(e){ console.error("Failed to save inventory:", e); }
    }

    /** Add item to inventory if not already present */
    function addItemToInventory(item) {
        if (!item) return false;
        if (!inventoryList.includes(item)) {
            inventoryList.push(item);
            saveInventory();
            refreshInventory();
        }
        return true;
    }

    /*** === GAME LOGIC === ***/
    const CRAFTING_RECIPES = {
        // Wood Planks — any one Wood in the grid
        "log,,,,,,,,": "wood_planks",
        ",log,,,,,,,": "wood_planks",
        ",,log,,,,,,": "wood_planks",
        ",,,log,,,,,": "wood_planks",
        ",,,,log,,,,": "wood_planks",
        ",,,,,log,,,": "wood_planks",
        ",,,,,,log,,": "wood_planks",
        ",,,,,,,log,": "wood_planks",
        ",,,,,,,,log": "wood_planks",

        // Stick — two vertically contiguous wood planks anywhere
        "wood_planks,,,wood_planks,,,,,": "stick",
        ",wood_planks,,,wood_planks,,,,": "stick",
        ",,wood_planks,,,wood_planks,,,": "stick",
        ",,,wood_planks,,,wood_planks,,": "stick",
        ",,,,wood_planks,,,wood_planks,": "stick",
        ",,,,,wood_planks,,,wood_planks": "stick",

        // Bread — three wheat horizontally contiguous anywhere
        "wheat,wheat,wheat,,,,,,": "bread",
        ",,,wheat,wheat,wheat,,,": "bread",
        ",,,,,,wheat,wheat,wheat": "bread",

        // Iron Trapdoor — 2x2 of iron ingot anywhere
        "iron_ingot,iron_ingot,,iron_ingot,iron_ingot,,,,": "iron_trapdoor",
        ",iron_ingot,iron_ingot,,iron_ingot,iron_ingot,,,": "iron_trapdoor",
        ",,,iron_ingot,iron_ingot,,iron_ingot,iron_ingot,": "iron_trapdoor",
        ",,,,iron_ingot,iron_ingot,,iron_ingot,iron_ingot": "iron_trapdoor",

        "iron_ingot,iron_ingot,iron_ingot,iron_ingot,,stick,,,stick": "A139E339A7ECB",
        "bread,bread,bread,steak,steak,steak,bread,bread,bread": "7A8B9B224A179",
        "iron_ingot,iron_trapdoor,iron_ingot,iron_ingot,,iron_ingot,iron_ingot,iron_ingot,iron_ingot": "19B63EF8424C4",
        "iron_trapdoor,iron_trapdoor,iron_trapdoor,iron_ingot,,iron_ingot,iron_ingot,iron_ingot,iron_ingot": "19B63EF8424C4",
        "glass,glass,glass,glass,snow,glass,glass,glass,glass": "B8731EEBCFA17",
        "cobblestone,cobblestone,cobblestone,cobblestone,charcoal,cobblestone,cobblestone,log,cobblestone": "45E183CF6124A",
        "cobblestone,cobblestone,cobblestone,cobblestone,charcoal,cobblestone,cobblestone,cobblestone,cobblestone": "45E183CF6124A",
        "bread,bread,bread,bread,,bread,bread,bread,bread": "EC6285A6CC3B2",
        "glass,glass,glass,glass,glass,glass,,iron_ingot,": "142129C337A8C"
    };
    const FUEL_ITEMS = new Set(["log","charcoal","stick","wood_planks"]);
    const FURNACE_RECIPES = {
        "iron_ore":"iron_ingot",
        "raw_beef":"steak",
        "sand":"glass",
        "log":"charcoal"
    };

    function matchCraftingRecipe(grid) {
        return CRAFTING_RECIPES[grid.map(x=>x||"").join(',')] || null;
    }
    function matchFurnaceRecipe(input, fuel) {
        if(!FUEL_ITEMS.has(fuel)) return null;
        return FURNACE_RECIPES[input] || null;
    }

    /*** === UI HELPERS === */
    function itemImg(item) {
        if(!item) return "";
        const special = {
            "EC6285A6CC3B2":"DOUGHNUT","45E183CF6124A":"FIREPLACE","7A8B9B224A179":"HAMBURGER",
            "142129C337A8C":"MONITOR","A139E339A7ECB":"SCYTHE","B8731EEBCFA17":"SNOWGLOBE",
            "19B63EF8424C4":"TRASH BIN"
        };
        const tooltip = special[item]??item;
        return `<img src="../static/puzzle_resources/the-village/items/${item}.webp" width="48" height="48" title="${tooltip}">`;
    }

    function refreshInventory() {
        for(let i=0;i<3;i++){
            for(let j=0;j<9;j++){
                const id=9*i+j;
                const item=inventoryList[id]||null;
                const cell=document.querySelector(`#_inv_${i}_${j}`);
                if(!cell) continue;
                cell.innerHTML=itemImg(item);
                cell.onmousedown=e=>{
                    e.preventDefault();
                    selectorItem=item; // infinite items: don't remove from inventory
                    document.querySelector("#selector").innerHTML=itemImg(selectorItem);
                };
            }
        }
    }

    function emptyCrafting() {
        craftingList.fill(null);
        document.querySelectorAll("[id^='_craft_']").forEach(c=>c.innerHTML="");
        craftResult=null;
        document.querySelector("#craft_result").innerHTML="";
    }
    function emptyFurnace() {
        furnaceItem=null;
        furnaceFuel=null;
        furnaceResult=null;
        document.querySelector("#furnace_item").innerHTML="";
        document.querySelector("#furnace_fuel").innerHTML="";
        document.querySelector("#furnace_result").innerHTML="";
    }

    function bindCraftingCell(el,row,col){
        const idx=3*row+col;
        el.onmousedown=e=>{
            e.preventDefault();
            const tmp=selectorItem;
            selectorItem=craftingList[idx];
            craftingList[idx]=tmp;
            document.querySelector("#selector").innerHTML=itemImg(selectorItem);
            el.innerHTML=itemImg(tmp);
        };
    }

    function bindCraftResult(el){
        el.onmousedown=e=>{
            e.preventDefault();
            if(!craftResult) return;
            selectorItem=craftResult;
            document.querySelector("#selector").innerHTML=itemImg(selectorItem);
        };
    }

    function bindFurnaceResult(el){
        el.onmousedown=e=>{
            e.preventDefault();
            if(!furnaceResult) return;
            selectorItem=furnaceResult;
            document.querySelector("#selector").innerHTML=itemImg(selectorItem);
        };
    }

    function bindPressButton(button,{down,up,onClick}){
        button.onmousedown=e=>{
            e.preventDefault();
            button.src=down;
            button.onmouseup=mouseUp;
            button.onmouseleave=mouseLeave;
        };
        function mouseUp(e){ e.preventDefault(); button.src=up; if(onClick) onClick(); button.onmouseup=null; button.onmouseleave=null;}
        function mouseLeave(e){ e.preventDefault(); button.src=up; button.onmouseup=null; button.onmouseleave=null;}
    }

    /*** === UI SETUP === */
    // Crafting grid
    const grid3x3=document.querySelector("#_3x3");
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            const div=document.createElement("div");
            div.id=`_craft_${i}_${j}`;
            div.className="craft_cell";
            grid3x3.appendChild(div);
            bindCraftingCell(div,i,j);
        }
    }

    // Furnace slots
    const furnaceItemEl=document.querySelector("#furnace_item");
    const furnaceFuelEl=document.querySelector("#furnace_fuel");
    furnaceItemEl.onmousedown=e=>{
        e.preventDefault();
        const tmp=selectorItem;
        selectorItem=furnaceItem;
        furnaceItem=tmp;
        document.querySelector("#selector").innerHTML=itemImg(selectorItem);
        furnaceItemEl.innerHTML=itemImg(furnaceItem);
    };
    furnaceFuelEl.onmousedown=e=>{
        e.preventDefault();
        const tmp=selectorItem;
        selectorItem=furnaceFuel;
        furnaceFuel=tmp;
        document.querySelector("#selector").innerHTML=itemImg(selectorItem);
        furnaceFuelEl.innerHTML=itemImg(furnaceFuel);
    };

    // Inventory grid
    for(let i=0;i<3;i++){
        for(let j=0;j<9;j++){
            const div=document.createElement("div");
            div.id=`_inv_${i}_${j}`;
            div.className="craft_cell";
            invGrid.appendChild(div);
        }
    }

    // Cursor
    const selector=document.querySelector("#selector");
    document.onmousemove=e=>{
        e.preventDefault();
        selector.style.left=e.clientX-24+"px";
        selector.style.top=e.clientY-24+"px";
    };

    // Retry buttons
    bindPressButton(document.querySelector("#retry_button"),{
        down:"../static/puzzle_resources/the-village/retry_button_down.png",
        up:"../static/puzzle_resources/the-village/retry_button_up.png",
        onClick:emptyCrafting
    });
    bindPressButton(document.querySelector("#retry_button_2"),{
        down:"../static/puzzle_resources/the-village/retry_button_down.png",
        up:"../static/puzzle_resources/the-village/retry_button_up.png",
        onClick:emptyFurnace
    });

    // Result slots
    bindCraftResult(document.querySelector("#craft_result"));
    bindFurnaceResult(document.querySelector("#furnace_result"));

    // Craft button
    bindPressButton(document.querySelector("#craft_button"),{
        down:"../static/puzzle_resources/the-village/arrow_button_down.png",
        up:"../static/puzzle_resources/the-village/arrow_button_up.png",
        onClick:()=>{
            craftResult=matchCraftingRecipe(craftingList);
            document.querySelector("#craft_result").innerHTML=itemImg(craftResult||"no_item");
            addItemToInventory(craftResult); // add without consuming inputs
            //emptyCrafting();
        }
    });

    // Furnace button
    const furnaceButton=document.querySelector("#furnace_button");
    if(furnaceButton) bindPressButton(furnaceButton,{
        down:"../static/puzzle_resources/the-village/arrow_button_down.png",
        up:"../static/puzzle_resources/the-village/arrow_button_up.png",
        onClick:()=>{
            if(!furnaceItem || !furnaceFuel) return;
            furnaceResult=matchFurnaceRecipe(furnaceItem,furnaceFuel);
            document.querySelector("#furnace_result").innerHTML=itemImg(furnaceResult||"no_item");
            addItemToInventory(furnaceResult);
            furnaceItem=furnaceFuel=null;
            furnaceItemEl.innerHTML="";
            furnaceFuelEl.innerHTML="";
        }
    });

    // Load inventory and render
    loadInventory();
    refreshInventory();
});
