# End-Project
Funktioner
Hämtar data från TheMealDB API med fetch och async/await.


Visar maträtter dynamiskt som kort med bild, namn, kategori och ursprungsland.


Användaren kan:
Söka på maträttens namn.
Välja en kategori (ex. “Seafood”, “Dessert”).
Kombinera sökning och kategori.
Rensa sökningen med en knapp.
Resultaten sorteras automatiskt i alfabetisk ordning (A–Z).
Fel- och statusmeddelanden visas tydligt (t.ex. “Loading…”, “No results found.”).


API-anrop görs mot följande endpoints:
list.php?c=list – hämtar alla kategorier.
filter.php?c= – hämtar rätter i vald kategori.
search.php?s= – söker rätter via namn.
lookup.php?i= – hämtar detaljerad info via ID.
Async/await används i alla fetch-anrop med try/catch för felhantering.


DOM-manipulation:
Dynamisk rendering av kort i <div id="results">.
Valmeny (<select>) fylls automatiskt med kategorier.


Funktioner:
setStatus() – visar statusmeddelanden.
clearResults() – tömmer resultat.
hydrateByIds() – laddar in fullständig information för rätter baserat på deras ID.

Eventhantering:

Enter i sökfältet kör sökning.
Val av kategori uppdaterar listan automatiskt.


Kort översikt av flödet
Vid sidstart hämtas alla kategorier via loadCategories().
Exempelsökning “Arrabiata” körs automatiskt.
När användaren söker eller väljer kategori:
Resultat hämtas via rätt API-funktion.
Data sorteras och skrivs ut som kort.
Status uppdateras (antal träffar, fel etc).


Krav & beroenden
Ren JavaScript (ingen extern ramverk behövs).
Webbläsare som stödjer fetch och async/await.
Internetanslutning (för att nå TheMealDB API).

