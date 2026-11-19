GHID POZE (folderul assets/)

Demo-ul încarcă imagini placeholder de pe Unsplash. Dacă o imagine nu se încarcă, ea dispare automat, iar pagina rămâne în regulă.
Înainte de lansare, înlocuiește-le cu poze reale ale firmei:

  hero.jpg      - 1600x900, echipa sau duba de intervenție, ideal pe timp de noapte
  camion.jpg    - 800x500, schimb de roată la un TIR
  mobil.jpg     - 800x500, intervenție pe marginea drumului / A1
  turism.jpg    - 800x500, echilibrare sau schimb anvelope la turism

Apoi schimbă în index.html atributele src din
  https://images.unsplash.com/...   ->   assets/hero.jpg  (etc.)

Sfaturi: JPG sau WebP, sub 200 KB per poză (squoosh.app), nume fără diacritice sau spații.
Înlocuiește și: numărul +40700000000 / 40700000000 (în index.html și js/app.js), adresa din secțiunea Locație, coordonatele și URL-ul din JSON-LD.
