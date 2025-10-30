
const API = {
    listCategories: "https://www.themealdb.com/api/json/v1/1/list.php?c=list",
    byName: (q) => `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`,
    byCategory: (c) => `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(c)}`,
    byId: (id) => `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`
};


const qInput = document.getElementById("q");
const btnSearch = document.getElementById("btnSearch");
const btnClear = document.getElementById("btnClear");
const categorySel = document.getElementById("category");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");


const setStatus = (msg, bad=false) => {
    statusEl.textContent = msg || "";
    statusEl.style.color = bad ? "#fca5a5" : "var(--muted)";
};
const clearResults = () => { resultsEl.innerHTML = ""; };

const cardHTML = (m) => `
  <article class="card">
    <figure><img src="${m.strMealThumb}" alt="${m.strMeal}" loading="lazy"></figure>
    <div class="body">
      <h3>${m.strMeal}</h3>
      <div class="meta">
        ${m.strCategory ? `<span class="badge">${m.strCategory}</span>` : ""}
        ${m.strArea ? `<span class="badge">${m.strArea}</span>` : ""}
      </div>
    </div>
  </article>
`;


async function hydrateByIds(ids, limit = 21){
    const take = ids.slice(0, limit);
    const out = [];
    for(const id of take){
        const r = await fetch(API.byId(id));
        if(!r.ok) continue;
        const d = await r.json();
        if(Array.isArray(d.meals) && d.meals[0]) out.push(d.meals[0]);
    }
    return out;
}


async function loadCategories(){
    try{
        const res = await fetch(API.listCategories);
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const cats = (data.meals || []).map(c => c.strCategory).sort((a,b)=>a.localeCompare(b));
        // Fill select
        for(const c of cats){
            const opt = document.createElement("option");
            opt.value = c;
            opt.textContent = c;
            categorySel.appendChild(opt);
        }
    }catch(e){
        console.error(e);

    }
}


async function runSearch(){
    const q = (qInput.value || "").trim();
    const cat = categorySel.value;

    clearResults();
    setStatus("Loading…");

    try{

        if(cat){

            const rCat = await fetch(API.byCategory(cat));
            if(!rCat.ok) throw new Error(`HTTP ${rCat.status}`);
            const dCat = await rCat.json();
            let items = Array.isArray(dCat.meals) ? dCat.meals : [];


            if(q){
                const qLow = q.toLowerCase();
                items = items.filter(m => (m.strMeal || "").toLowerCase().includes(qLow));
            }

            if(items.length === 0){
                setStatus("No results found.");
                return;
            }


            const details = await hydrateByIds(items.map(m => m.idMeal));
            details.sort((a,b)=>a.strMeal.localeCompare(b.strMeal));
            resultsEl.innerHTML = details.map(cardHTML).join("");
            setStatus(`Showing ${details.length} meals (category${q ? " + search" : ""}).`);
            return;
        }


        if(q){
            const rName = await fetch(API.byName(q));
            if(!rName.ok) throw new Error(`HTTP ${rName.status}`);
            const dName = await rName.json();
            const meals = Array.isArray(dName.meals) ? dName.meals : [];
            if(meals.length === 0){
                setStatus("No results found.");
                return;
            }
            meals.sort((a,b)=>a.strMeal.localeCompare(b.strMeal));
            resultsEl.innerHTML = meals.map(cardHTML).join("");
            setStatus(`Showing ${meals.length} meals (name search).`);
            return;
        }


        setStatus("Type something to search or choose a category.");
    }catch(err){
        console.error(err);
        setStatus("Could not fetch data. Try again.", true);
    }
}


btnSearch.addEventListener("click", runSearch);
btnClear.addEventListener("click", () => {
    qInput.value = "";
    categorySel.value = "";
    clearResults();
    setStatus("");
    qInput.focus();
});
qInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") runSearch();
});
categorySel.addEventListener("change", runSearch);

// ============ Init ============
loadCategories().then(()=>{
    // Optional: initial example
    qInput.value = "Arrabiata";
    runSearch();
});
