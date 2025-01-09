# Alkupään Koodiesimerkkien selitykset

### 1. Vanha Add Encounter
- Erot: Validointi ja virheenkäsittely
- Visuaalinen käyttäjäpalaute
- Tietojenkäsittely, alunperin käytin pushia -> lopullisessa käytän spreadia
- Alkuperäisessä console.warn, josta sain pahaa palautetta demossa vaikka olikin vain placeholderi
```typescript
public addEnc(): void {
    // 1️⃣ Tarkistetaan onko meillä valittu biomi ja sen ID
    if (this.filteredEncounters && this.filteredEncounters._id) {
        
        // 2️⃣ Kutsutaan servicen addEnc-metodia
        this.eservice
            .addEnc(
                this.filteredEncounters._id,  // Biomin ID
                this.newEncounter             // Uuden encounterin tiedot
            )
            .subscribe(
                // 3️⃣ Jos lisäys onnistuu:
                (response) => {
                    // A: Lisätään uusi encounter paikalliseen listaan
                    this.filteredEncounters.enc.push(
                        response.enc[response.enc.length - 1]  // Otetaan viimeisin lisätty
                    );
                    
                    this.resetForm();             // B: Tyhjennetään lomake
                    this.closeAddEncounterModal();  // C: Suljetaan modaali-ikkuna
                },
                // 4️⃣ Jos tulee virhe:
                (error) => console.error('Error adding encounter:', error)
            );
    } else {
        // 5️⃣ Jos biomia ei ole valittu:
        console.warn('No valid encounter to add. Please select a valid encounter first.');
    }
}
```
### 2. Vanha Save Encounter
- Vanha: Ei validointia, ei visuaalista virheen käsittelyä, käsittelee kaikki muokkaustilassa olevat encounterit
- Uusi: Validointi ja visuaalinen virheenkäsittely, käsittelee yhden encounterin kerrallaan

- Kehitys: Koodi on käyttäjäystävällisempi ja ammattimaisempi

```typescript
saveEnc() {
    // 1️⃣ Tarkistetaan onko meillä biomi ja encountereita
    if (this.filteredEncounters && this.filteredEncounters.enc) {
        
        // 2️⃣ Käydään läpi kaikki encounterit
        this.filteredEncounters.enc.forEach((enc: any) => {
            // 3️⃣ Tarkistetaan onko encounter muokkaustilassa
            if (enc.isEditing) {
                // 4️⃣ Kutsutaan servicen saveEnc-metodia
                this.eservice
                    .saveEnc(
                        this.filteredEncounters._id,  // Biomin ID
                        enc._id,                      // Encounterin ID
                        enc                           // Encounterin tiedot
                    )
                    .subscribe(
                        // 5️⃣ Jos tallennus onnistuu:
                        (response) => {
                            console.log('Encounter updated:', response);
                            enc.isEditing = false;  // Poistetaan muokkaustila
                        },
                        // 6️⃣ Jos tulee virhe:
                        (error) => {
                            console.error('Error saving encounter:', error);
                        }
                    );
            }
        });
    }
}
```

### 3. Vanha Backend saveEnc
- Vanha: Yksinkertainen, säilyttää vanhan arvon jos uutta ei ole annettu
- Uusi: Luo kokonaan uuden objektin vanhan tilalle
```javascript
// 1. Funktion määrittely
saveEnc: async (req, res) => {  // Asynkroninen funktio, ottaa request ja response parametrit
    try {
      // 2. Parametrien purku (destructuring)
      const { biomeId, encId } = req.params;      // URL-parametrit: /biomes/:biomeId/encounters/:encId
      const { name, description, weight, img } = req.body;  // POST-pyynnön body-data

      // 3. Biomin haku tietokannasta
      const encounterDoc = await RandomEncounter.findById(biomeId);  // Etsii biomin ID:llä
      if (!encounterDoc) {  // Jos biomia ei löydy...
        return res.status(404).json({ message: 'Biome not found' });  // ...palauta 404-virhe
      }

      // 4. Encounterin haku biomin sisältä
      const encounter = encounterDoc.enc.id(encId);  // Mongoosen .id()-metodi etsii alakokoelmasta
      if (!encounter) {  // Jos encounteria ei löydy...
        return res.status(404).json({ message: 'Encounter not found' });  // ...palauta 404-virhe
      }

      // 5. Kenttien päivitys
      // Jos uutta arvoa ei ole annettu (undefined), säilytetään vanha arvo
      encounter.name = name || encounter.name;
      encounter.description = description || encounter.description;
      encounter.weight = weight || encounter.weight;
      encounter.img = img || encounter.img;

      // 6. Tallennus tietokantaan
      await encounterDoc.save();  // Tallentaa koko biomin, koska encounter on sen alakokoelma

      // 7. Onnistuneen päivityksen vastaus
      return res
        .status(200)  // HTTP 200 OK
        .json({ message: 'Encounter updated successfully', encounter });  // Palautetaan viesti ja päivitetty encounter

    // 8. Virheenkäsittely
    } catch (error) {
      console.error(error);  // Lokitetaan virhe konsoliin
      return res.status(500).json({ message: 'Server error' });  // Palautetaan yleinen palvelinvirhe
    }
  },
```


    

# Lopulliset koodiesimerkit
## Frontend

### 1. Encounter Service (Kohtaamisten käsittely)
## Mikä on Service?
Angularissa käytetään servicejä, jotta:
-Hakee dataa palvelimelta
-Käsittelee dataa
-Jakaa tietoa eri komponenttien välillä

## Encounter Service?
Tämä palvelu hoitaa kaikki kohtaamisiin liittyvät HTTP-pyynnöt:
- `getEncounters`: Hakee kaikki kohtaamiset tietystä biomista
- `saveEncounter`: Tallentaa uuden kohtaamisen
- `deleteEncounter`: Poistaa kohtaamisen
- `editEncounter`: Muokkaa olemassa olevaa kohtaamista

Encounter Service käyttää Observablea tiedon hakemiseen ja käsittelyyn. Observable toimii kuin "posteljooni" 📬, joka kuljettaa tietoa palvelimen (backend) ja komponentin välillä.

Esimerkiksi getEncounters()-metodi:
```typescript
public getEncounters(): Observable {
    return this.http               // 1️⃣ HttpClient-palvelu (kuin puhelin 📱)
        .get(`${this.baseUrl}`, {  // 2️⃣ HTTP GET -pyyntö (soitto palvelimelle 📞)
            headers: this.getHeaders() // 3️⃣ Headers (kirjeen otsikkotiedot ✉️) (autentikaatiotiedot/sisältötyypit/välimuistitiedot jne.)
        })
        .pipe(catchError(this.handleError)); // 4️⃣ Virheiden käsittely (turvaverkko 🕸️)
}
```

### 2. Save Encounter (Kohtaamisen tallennus)

Esimerkki:
```typescript
// ✅✅✅ Yhden encounterin tallennus ✅✅✅
saveEnc(enc: any) {  // 1️⃣ Funktio ottaa vastaan encounterin (enc)
    this.eservice     // 2️⃣ Käytetään encounter serviceä
        .saveEnc(     // 3️⃣ Kutsutaan servicen saveEnc-metodia kolmella parametrilla:
            this.filteredEncounters._id,  // A: Nykyisen biomin ID
            enc._id,                      // B: Muokattavan encounterin ID
            {
                ...enc,                   // C: Kopioidaan kaikki encounterin tiedot (Tämä siksi, jotta säilytetään alkuperäiset tiedot, encounterissa on useampi eri kenttää, niin niitä ei kaikki tarvii kirjoittaa uudelleen)
                die: enc.roll,            // D: Päivitetään nopan arvo encounteriin tietokannassa
            }
        )
        .subscribe({  // 4️⃣ Tilataan vastaus palvelimelta (kuin odotettaisiin pizzaa)
            // 5️⃣ Jos tallennus onnistuu:
            next: (response) => {
                // A: Näytetään onnistumisviesti käyttäjälle
                this.snackBar.open(
                    'Encounter saved successfully!', 
                    'Close', 
                    {
                        duration: 3000,  // Viesti näkyy 3 sekuntia
                        panelClass: ['mat-snackbar-success'], // Vihreä väri
                    }
                );
                // B: Poistetaan edit-tila
                enc.isEditing = false;
            },
            // 6️⃣ Jos tulee virhe:
            error: (error) => {
                // A: Logataan virhe konsoliin
                console.error('Error saving encounter:', error);
                // B: Näytetään virheviesti käyttäjälle
                this.snackBar.open(
                    'Error saving encounter: ' + (error.message || 'Unknown error'),
                    'Close',
                    {
                        duration: 3000,  // Viesti näkyy 3 sekuntia
                        panelClass: ['mat-snackbar-error'], // Punainen väri
                    }
                );
            }
        });
}
```

### 3. Delete Encounter (Kohtaamisen poisto)
Komponentti sisältää:
- Varmistusdialogi pomahtaa ruudulle ennen poistoa
- Jos painetaan OK suoritetaan -> if (result)
- Lähetetään palvelimelle pyyntö poistaa tämä kohtaaminen
- Jos poisto onnistuu -> next: () => Näytetään snackbar ilmoitus, että ollaan onnistuttu

Esimerkki:
```typescript
public addEnc(result: any): void {  // 1️⃣ Ottaa vastaan uuden encounterin tiedot
    console.log('addEnc() called with result:', result);

    // 2️⃣ Tarkistetaan onko encounterilla nimi
    if (!result.name) {
        console.log('Encounter name is required');
        this.snackBar.open(
            'Encounter name is required',  // Virheviesti
            'Close', 
            {
                duration: 3000,
                panelClass: ['mat-snackbar-error']  // Punainen viesti
            }
        );
    } else {
        // 3️⃣ Tarkistetaan onko meillä biomi johon encounter lisätään // filteredEncounters käytännössä sisältää sen biomin tiedot jossa nytten ollaan
        if (this.filteredEncounters && this.filteredEncounters._id) {
            console.log('Filtered encounters and ID exist');

            // 4️⃣ Kutsutaan servicen addEnc-metodia
            this.eservice.addEnc(
                this.filteredEncounters._id,  // Biomin ID
                {
                    ...result,               // Kaikki encounterin tiedot
                    die: result.roll,        // Nopan arvo
                }
            ).subscribe(
                // 5️⃣ Jos lisäys onnistuu:
                (response) => {
                    console.log('Encounter added:', response);
                    console.log('RULLA', result.roll);
                    console.log('Uusi enkki', this.availableDice);
                    
                    this.getEncounters();  // Päivitetään encounterien lista
                    
                    // Näytetään onnistumisviesti
                    this.snackBar.open(
                        'Encounter added successfully!',
                        'Close',
                        {
                            duration: 3000,
                            panelClass: ['mat-snackbar-success']  // Vihreä viesti
                        }
                    );
                },
                // 6️⃣ Jos tulee virhe:
                (error) => {
                    console.error('Error adding encounter:', error);
                    // Näytetään virheviesti
                    this.snackBar.open(
                        'Error adding encounter: ' + error.message,
                        'Close',
                        {
                            duration: 3000,
                            panelClass: ['mat-snackbar-error']  // Punainen viesti
                        }
                    );
                }
            );
        }
    }
}
```

### 4. Delete Encounter 
```typescript
// ❌❌❌ Encounterin poisto ❌❌❌
deleteEnc(biomeId: string, encounterId: string): void {  // 1️⃣ Ottaa biomin ja encounterin ID:t
    console.log('deleteEnc() called with:', biomeId, encounterId);
    console.log('Current filteredEncounters:', this.filteredEncounters);

    // 2️⃣ Kutsutaan servicen deleteEnc-metodia
    this.eservice.deleteEnc(biomeId, encounterId).subscribe(
        // 3️⃣ Jos poisto onnistuu:
        (response) => {
            console.log('Encounter deleted successfully:', response);

            // 4️⃣ Päivitetään näkymä: poistetaan encounter listasta
            this.filteredEncounters.enc = this.filteredEncounters.enc.filter(
                (enc: any) => enc._id !== encounterId  // Säilytetään vain ne, joiden ID ei ole poistetun ID
            );

            console.log('Updated filteredEncounters:', this.filteredEncounters);
        },
        // 5️⃣ Jos tulee virhe:
        (error) => {
            console.error('Error occurred while deleting encounter:', error);
        }
    );
}
```

## Backend

### 1. Save Encounter
```javascript
async saveEnc(req, res) {  // 1️⃣ Async-metodi, joka käsittelee HTTP-pyynnön
    console.log('Updating encounter for biome:', req.params.biomeId);
    console.log('Encounter ID:', req.params.encId);
    console.log('Request body:', req.body);

    try {
        // 2️⃣ Etsitään ensin biomi tietokannasta Id:n perusteella
        const biome = await RandomEncounter.findById(req.params.biomeId);
        if (!biome) {
            console.log('Biome not found');
            return res.status(404).json({ error: 'Biome not found' });
        }

        // 3️⃣ Etsitään kohtaamista kahdella tavalla:
        // A: Ensin ID:n perusteella
        let encounterIndex = biome.enc.findIndex(
            (e) => e._id.toString() === req.params.encId
        );

        // B: Jos ID:llä ei löydy, etsitään nimellä
        if (encounterIndex === -1 && req.body.name) {
            encounterIndex = biome.enc.findIndex((e) => e.name === req.body.name);
        }

        // Jos kohtaamista ei löydy kummallakaan tavalla
        if (encounterIndex === -1) {
            console.log('Update failed - encounter not found');
            return res.status(404).json({ error: 'Encounter not found' });
        }

        // 4️⃣ Tallennetaan alkuperäinen ID
        const originalId = biome.enc[encounterIndex]._id;

        // 5️⃣ Päivitetään kohtaamisen tiedot
        biome.enc[encounterIndex] = {
            _id: originalId,  // Säilytetään alkuperäinen ID
            name: req.body.name,
            description: req.body.description,
            weight: req.body.weight,
            roll: req.body.roll,
            img: req.body.img,
        };

        // 6️⃣ Tallennetaan muutokset tietokantaan
        const savedBiome = await biome.save();
        console.log('Update successful');
        res.json(savedBiome);  // Palautetaan päivitetty biomi

    } catch (error) {
        console.error('Error updating encounter:', error);
        res.status(500).json({ error: 'Error updating encounter' });
    }
}
```

### 2. Add Encounter 
```javascript
async addEnc(req, res) {  // 1️⃣ Async-metodi uuden encounterin lisäämiseen
    try {
        console.log('Lisätään encounter', req.body);

        // 2️⃣ Luodaan uusi encounter-objekti pyynnön tiedoista
        const newEncounter = {
            name: req.body.name,
            description: req.body.description,
            weight: req.body.weight,
            img: req.body.img,
        };

        console.log('Uus enkountter:', newEncounter);

        // 3️⃣ Päivitetään biomi lisäämällä uusi encounter
        const updatedEncounter = await RandomEncounter.findByIdAndUpdate(
            req.params.id,           // A: Biomin ID URL:sta
            { $push: { enc: newEncounter } },  // B: MongoDB $push lisää uuden encounterin taulukkoon
            { new: true }            // C: Palauttaa päivitetyn version
        );

        // 4️⃣ Tarkistetaan onnistuiko päivitys
        console.log('Päivitetty encounter:', updatedEncounter);
        if (!updatedEncounter) {
            return res.status(404).json({ error: 'Biomea ei löytynyt' });
        }

        // 5️⃣ Palautetaan päivitetty biomi
        res.json(updatedEncounter);

    } catch (err) {
        console.error('Virhe encounterin lisäämisessä:', err);
        res.status(500).json({ error: 'Virhe encounterin lisäämisessä' });
    }
}
```

### 3. Delete Encounter (Kohtaamisen poisto)
🗑️ Saadaan pyyntö poistaa tietty encounteri (ID:n perusteella)
🔍 findOneAndDelete, joka:
Etsii oikean encounterin (find)
Poistaa sen heti (delete)
Tekee molemmat yhdellä kertaa (and)
❓ Tarkistetaan onnistuiko poisto
✅ Ilmoitetaan onnistuneesta poistosta
❌ Jos tulee virhe, käsitellään se siististi
Erityisesti huomaa:

findOneAndDelete on MongoDB:n metodi, joka tekee etsinnän ja poiston yhdellä operaatiolla
Async/await käyttö tietokantaoperaatioissa
Selkeät virheilmoitukset sekä konsoliin että käyttäjälle
Palautetaan HTTP status 404 jos encounteria ei löydy, 500 jos tulee muu virhe

Esimerkki:
```javascript
async deleteById(req, res) {  // 1️⃣ Async-metodi encounterin poistamiseen ID:n perusteella
    try {
        console.log('Deleting encounter:', req.params.id);

        // 2️⃣ Etsitään ja poistetaan encounter samalla kertaa
        const deletedEnc = await RandomEncounter.findOneAndDelete(
            { _id: req.params.id }  // Etsitään ID:n perusteella
        );
        
        // 3️⃣ Tarkistetaan löytyikö poistettavaa
        if (!deletedEnc) {
            return res.status(404).json({ error: 'Encounter not found' });
        }
        
        // 4️⃣ Palautetaan onnistumisviesti
        res.json({ message: 'Encounter deleted successfully' });

    } catch (error) {
        // 5️
```

### 4. Create Merchant 

```typescript
createMerchant(result: any): void {  // 1️⃣ Metodi ottaa vastaan kauppiaan tiedot
    // 2️⃣ Validointi: Tarkistetaan onko nimi annettu
    if (!result.name) {
        console.log('Table name is required');
        this.snackBar.open(
            'Table name is required',  // Virheviesti
            'Close', 
            {
                duration: 2000,  // Viesti näkyy 2 sekuntia
                panelClass: ['mat-snackbar-error']  // Punainen väri
            }
        );
        return;  // Lopetetaan suoritus jos nimi puuttuu
    }

    // 3️⃣ Lähetetään tiedot servicen kautta backendille
    this.merchantService.createMerchant(result).subscribe({
        // 4️⃣ Jos luonti onnistuu:
        next: (response) => {
            console.log('Merchant created successfully:', response);
            
            this.getMerchants();  // Päivitetään kauppiaslista
            
            // Näytetään onnistumisviesti
            this.snackBar.open(
                'Merchant created successfully!',
                'Close',
                {
                    duration: 2000,
                    panelClass: ['mat-snackbar-success']  // Vihreä väri
                }
            );
        },
        // 5️⃣ Jos tulee virhe:
        error: (error) => {
            console.error('Error creating merchant:', error);
            this.snackBar.open(
                'Error creating merchant',
                'Close',
                {
                    duration: 2000,
                    panelClass: ['mat-snackbar-error']  // Punainen väri
                }
            );
        }
    });
}
```

### 5. Create Merchant Backend
📝 Saadaan kauppiaan perustiedot (nimi ja mitä myy)
📋 Varmistetaan että myytävät tavarat ovat listana
🎲 Valitaan satunnaisesti 10 esinettä myyntiin:
$match: Valitsee vain oikean tyyppiset esineet
$sample: Arpoo niistä 10 kappaletta
👨‍💼 Luodaan uusi kauppias näillä esineillä
📦 Haetaan kaikki esineiden tiedot (populate)
✅ Palautetaan valmis kauppias tietoineen
```javascript
async createMerchant(req, res) {  // 1️⃣ Async-metodi kauppiaan luomiseen
    try {
        const { name, type } = req.body;  // Otetaan nimi ja tyyppi pyynnöstä
        console.log('Request body:', req.body);

        // 2️⃣ Muutetaan type aina taulukoksi
        const typesArray = Array.isArray(type) ? type : [type];
        // Jos type on ["Armor", "Weapon"] -> typesArray = ["Armor", "Weapon"]
        // Jos type on "Armor" -> typesArray = ["Armor"]

        // 3️⃣ Haetaan satunnaiset esineet MongoDB:n aggregaatiolla
        const randomItems = await Item.aggregate([
            { $match: { type: { $in: typesArray } } },  // A: Etsii esineet joiden tyyppi on typesArray:ssa
            { $sample: { size: 10 } },                  // B: Valitsee 10 satunnaista esinettä
        ]);

        console.log('Random items selected:', randomItems);

        // 4️⃣ Luodaan uusi kauppias satunnaisella inventaariolla
        const newMerchant = await Merchant.create({
            name,
            inventory: randomItems.map((item) => item._id),  // Tallennetaan vain esineiden ID:t
        });

        console.log('New merchant created:', newMerchant);

        // 5️⃣ Haetaan kauppias ja täytetään inventaarion tiedot
        const populatedMerchant = await Merchant.findById(
            newMerchant._id
        ).populate('inventory');  // Hakee inventaarion esineiden kaikki tiedot

        console.log('Populated merchant:', populatedMerchant);

        // 6️⃣ Palautetaan luotu kauppias
        res.status(201).json(populatedMerchant);

    } catch (error) {
        res.status(500).json({
            error: 'Error creating merchant',
        });
    }
}
```