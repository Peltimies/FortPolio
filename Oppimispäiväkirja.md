# 📚 Oppimispäiväkirja

## 🗓️ Syyskuu-Lokakuu 2024

### Viikko 38 - Projektin aloitus
#### 🏗️ Pääkomponenttien luonti
- Toteutettu projektin perusrakenne:
  - Navbar-komponentti
  - Highway-komponentti (myöhemmin uudelleennimetty)
- **Haaste**: Biome-tietojen näyttäminen valetietokannasta
- **Ratkaisu**: Dynaaminen toteutus
  1. Sivusto listaa biomet ID:n perusteella
  2. ID:tä klikkaamalla pääsee uudelle sivulle
  3. Uusi sivu näyttää biomin sisällön
- **Opitut asiat**:
  - Dynaaminen reititys Angularissa
  - Tietorakenteiden suunnittelu
  - Komponenttien välinen kommunikaatio

### Projektin Kehitys

#### 📝 Alkutila
![Projektin alkutilanne](C:\JAMK\Ticorporate\FortPolio\Kuvat\alkutilanne.png)

#### 📝 Viikon Edistys
##### Toiminnallisuuden kehitys
- Ensimmäinen toiminto toteutettu: biomien listaus valetietokannasta
- Toiminnallisuus demonstroitu kahdella näkymällä:
  1. ![Biomien listaus](C:\JAMK\Ticorporate\FortPolio\Kuvat\proto_biomes.png)
  2. ![Encounter-järjestelmä](C:\JAMK\Ticorporate\FortPolio\Kuvat\roll1.png)

##### Tietokantarakenne

- **Vale tietokanta**
  ``` typescript
  export class InMemoryService implements InMemoryDbService {
  createDb() {
    const highwayEncs = [
      {
        id: 1,
        name: 'Highwaymen',
        description: 'A group of bandits, armed to the teeth, are lying in wait to ambush unsuspecting travelers.'
      },
      // ... other highway encounters
    ];

    const dungeonEncs = [
      {
        id: 9,
        name: 'Injured Dungeoneer',
        description: 'An injured dungeoneer is limping around the dungeon and needs medical attention'
      },
      // ... other dungeon encounters
    ];

    const wildernessEncs = [
      {
        id: 12,
        name: 'Owlbear',
        description: 'An Owlbear is heard rummaging through the bushes nearby'
      },
      // ... other wilderness encounters
    ];

    return { highwayEncs, dungeonEncs, wildernessEncs };
  }
}

### Viikko 39
- Valtion virallinen kertausharjoitus

### Viikko 40 - Modaalit ja tietokantaintegraatio
#### 🎲 Modaalien toteutus
- Enctable-komponentin modaalit:
  - Nopanheiton tulosten näyttäminen
  - Satunnaisten kohtaamisten esittäminen
  - Yksittäisten kohtaamisten tarkastelu

#### 🔌 Backend-integraatio
- Frontend yhdistetty backendiin
  - Valetietokannan ongelmat ratkaistu
  - Tiedonkulku optimoitu

#### 💾 MongoDB Atlas -migraatio
- Tietokanta siirretty pilveen
  - Docker-riippuvuudesta luovuttu
  - Yhteys tietokantaan pilvipalvelun kautta

#### 🛠️ Uudet toiminnallisuudet
- Aloitettu CRUD-operaatioiden toteutus:
  - Edit-toiminnallisuus
  - Delete-toiminnallisuus

## 🗓️ Marraskuu 2024

## 18.11.2024 - Encountereiden tallennus
---

🎯 **Saavutus**: Encountereiden tallennus saatu toimivaksi pitkän työstämisen jälkeen.

#### 💡 Tekninen oivallus:
Ongelma oli tietokannan `saveEnc`-metodissa. Alkuperäinen koodi:
```javascript
_id: req.params.biomeId,
'enc.name': req.body.name  // Tämä esti encounterin nimen päivittymisen
```

**Miksi tämä oli ongelma?**
- Toiminto mätsää tallennettavan encounterin nimen
- Jos nimi on muuttunut, haku ei löydä dokumenttia
- Ehto etsii enciä, jonka nimi vastaa uutta nimeä

#### ✅ Ratkaisu:
```javascript
_id: req.params.biomeId,
'enc._id': req.body._id  // Nyt löytyy aina ID:n perusteella
```

**Loppuviikon tehtävät:**
- Toiminnon implementointi
- Demon toiminnallisuuden varmistaminen

### 22.11.2024 - Demo ja palaute
---

🎓 **Demo-arvosana**: 3

#### 📝 Kehityskohteet seuraavaan demoon:
1. Syvällisempi analyysi ongelmatilanteista
   - Mitä ongelmia kohdattiin?
   - Miksi ne ilmenivät?
   - Miten ne ratkaistiin?
2. Selkeämpi esittely tehdyistä asioista
3. Työskentelytapojen avaaminen
4. Loppupohdinta
   - Mikä meni hyvin?
   - Mikä meni huonosti?

## 25.11.2024 - 🔐 Google-kirjautuminen ja tavallinen kirjautuminen
---
## Tavoitteet Google-kirjautumiselle toteuttamiselle:
- Tehdä login-sivu
- 

## Tavoitteet tavallisen kirjautumisen toteuttamiselle:

🌟 **Viikon aloitus**: Positiivinen palaute motivoi työskentelyä!

#### 🔍 Pohdinta aiheesta: Google-kirjautuminen:
- Aloitettu Tuikan tutoriaalin pohjalta
- Haaste: Esimerkkikoodin soveltaminen omaan projektiin
- Oppimiskokemus: Koodin soveltaminen vaatii syvällistä ymmärrystä

#### 🔍 Pohdinta aiheesta: Tavallinen kirjautuminen:
- Kaikki olikin jo valmiina, kun koodi oltiin tehty backend1 tunnilla
- Tarvitsi ainoastaan luoda tunnarit tietokantaan ja homma pelitti

### 🔐 Google-kirjautumisen toteutus

#### 1. Projektin alustus
- Pohja otettu tutoriaali-tehtävästä
- Asennettu tarvittava paketti: `@abacritt/angularx-social-login`

#### 2. Abacritt-kirjasto
> Avoimen lähdekoodin Angular-kirjasto sosiaalisen median kirjautumisille
- Tukee useita kirjautumistapoja (Google, Facebook)
- Automatisoi:
  - Kirjautumisprosessin
  - Käyttäjätietojen haun
  - Istunnonhallinnan
- Yksinkertaistaa integraation toteutusta

#### 3. Konfiguraatio (`app.config.ts`)
```typescript
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocialLoginModule, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  imports: [
    FormsModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:4200'],
        disallowedRoutes: []
      }
    })
  ]
})
export class AppModule {}
```

#### 4. Komponenttien selitykset

##### 📦 Moduulit
- **SocialLoginModule**
  - Hallinnoi Googlen kirjautumisprosessia
  - Käsittelee autentikaation logiikan

- **GoogleSigninButtonModule**
  - Tarjoaa valmiin Google-kirjautumispainikkeen
  - Noudattaa Googlen brändäysohjeita

##### 🔒 JWT-autentikaatio
- **JwtModule.forRoot()**
  - Hallinnoi JWT-pohjaista autentikaatiota
  - Konfiguraation osat:
    - `tokenGetter`: Hakee JWT-tokenin
    - `allowedDomains`: Määrittää sallitut domainit (`localhost:4200`)
    - `disallowedRoutes`: Määrittää kielletyt reitit

#### 4. Frontend-toteutus

##### 🖥️ Kirjautumiskomponentit
- **LoginComponent**
  - Käsittelee sekä Google- että tavallisen kirjautumisen
  - Sisältää kirjautumislomakkeen ja Google-kirjautumispainikkeen
  - Ohjaa käyttäjän dashboardille onnistuneen kirjautumisen jälkeen

##### 🔐 AuthService
```typescript
// Tavallinen kirjautuminen
login(username: string, password: string): Observable<boolean> {
  return this.http.post(this.basicLoginUrl, { username, password })
    .pipe(map((res: any) => {
      const token = res['token'];
      if (token) {
        this.token = token;
        sessionStorage.setItem('accesstoken', token);
        return true;
      }
      return false;
    }));
}

// Google-kirjautuminen
glogin(gtoken: string): Observable<boolean> {
  return this.http.post(this.googleLoginUrl, { gtoken })
    .pipe(map((res: any) => {
      const token = res['token'];
      if (token) {
        sessionStorage.setItem('accesstoken', token);
        return true;
      }
      return false;
    }));
}
```

##### 🛡️ Reittien suojaus
- Toteutettu `authGuard`-funktionaalisella guardilla
  1. Tarkistaa jokaisen suojatun reitin kohdalla, onko käyttäjä kirjautunut sisään
  2. Jos käyttäjällä on voimassa oleva token sessionStoragessa, sallii pääsyn reitille
  3. Jos tokenia ei ole tai se on vanhentunut, ohjaa käyttäjän automaattisesti login-sivulle
  4. Toimii "portinvartijana" kaikille suojatuille reiteille, kuten dashboard, retables ja merchants

Esimerkki suojatuista reiteistä:
```typescript
export const routes: Routes = [
  // Julkiset reitit
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Suojatut reitit (vaativat kirjautumisen)
  { 
    path: 'dashboard', 
    component: KaruselliComponent,
    canActivate: [authGuard]  // Tarkistaa kirjautumisen
  },
  { 
    path: 'retables', 
    component: RetablesComponent,
    canActivate: [authGuard]  // Tarkistaa kirjautumisen
  }
]
```

#### 5. Backend-toteutus

### 📦 MongoDB User-malli

Käyttäjäskeema määrittelee sovelluksen käyttäjän tietorakenteen:

- `username`: Käyttäjän uniikki tunniste, jota käytetään kirjautumiseen
- `password`: Käyttäjän salasana (huom: tallennetaan salattuna)
- `isadmin`: Määrittää käyttäjän ylläpito-oikeudet

```typescript
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isadmin: { type: Boolean, required: true },
});
```

### 29.11.2024 - 09.12.2024
--- Kertausharjoitus, eli olen poissa ja palaan 09.12.2024. takaisin ---
- Tämän jälkeen, pyritään suorittamaan seuraavat tehtävät:
  1. Kirjautumisprosessin toteuttaminen loppuun - Kirjautumistietojen tallennus tietokantaan
  2. Selvitys LocalStoragen käyttöönotosta
  3. PWAn buildaus

## 🎯 Loppureflektio ja Ammatillinen Kehitys

### 💼 Pää- ja sivutyön näkyvyys projektissa
- **Päätyö (TC Dungeon Helper)**
  - Vastuualueeni FullStack -kehityksessä
  - Merchant ja Random Encounters -toiminnallisuudet

- **Sivutyö (Portfolio)**
  - Dokumentointi ja oppimispäiväkirjan ylläpito
  - Koodin laadun varmistaminen ja refaktorointi
  - Tiimin sisäinen mentorointi ja tuki
  - Autentikaation toteutus (Google-kirjautuminen ja perinteinen kirjautuminen)

### 🌟 Oppimiskokemukset ja oivallukset
- **Tekniset taidot**
  - Angular-osaamisen syventyminen
  - Autentikaation ja käyttäjähallinnan ymmärrys
  - REST API -integraatiot
  - Git-työskentelyn tehostuminen

- **Pehmeät taidot**
  - Tiimityöskentelyn merkitys projektin onnistumisessa
  - Kommunikaatiotaitojen kehittyminen
  - Ongelmienratkaisukyvyn vahvistuminen
  - Itsenäisen työskentelyn ja ajankäytön hallinta

### 🎯 Tavoitteiden toteutuminen
- **Saavutetut tavoitteet**
  - Toimiva autentikaatiojärjestelmä
  - Merchant-toiminnallisuuden perustoiminnot
  - Responsiivinen käyttöliittymä
  
- **Jatkokehityskohteet**
  - Käyttäjäkokemusten kerääminen ja analysointi
  - Testikattavuuden parantaminen
  - Suorituskyvyn optimointi

### 💡 Suunnitelman ulkopuoliset opit
- MongoDB Atlas -integraation haasteet ja ratkaisut
- Angular Material -kirjaston tehokas hyödyntäminen
- JWT-tokenien käyttö autentikaatiossa
- Vieraskäyttäjä-toiminnallisuuden toteutus

### 🔮 Tulevaisuuden näkymät
- **Uratoiveet**
  - Frontend-kehittäjän rooli modernissa ohjelmistotalossa
  - Mahdollisuus työskennellä monipuolisten web-sovellusten parissa
  - Kiinnostus UI/UX-suunnitteluun

- **Opintojakson tuki tavoitteille**
  - Käytännön kokemusta modernista web-kehityksestä
  - Ymmärrys full stack -kehityksen periaatteista
  - Tiimityöskentelyn ja projektinhallinnan taidot

### 🎯 Kehityskohteet
- **Tarvittava lisäosaaminen**
  - Testausautomaation syventäminen
  - State management -ratkaisujen (NgRx) opettelu
  - UI/UX-suunnittelun periaatteiden vahvistaminen
  - DevOps-työkalujen hallinta

### 💪 Vahvuudet
- Nopea oppimiskyky uusien teknologioiden kanssa
- Kyky työskennellä itsenäisesti ja tiimissä
- Ongelmienratkaisukyky ja sinnikkyys
- Dokumentoinnin ja koodin laadun arvostaminen

### 📚 Portfolio-valintojen perusteet
- Dokumentit osoittavat teknisen osaamisen kehityksen
- Koodiesimerkit demonstroivat ongelmanratkaisutaitoja
- Oppimispäiväkirja kuvastaa reflektointikykyä ja ammatillista kasvua
- Valitut työt edustavat monipuolista osaamista web-kehityksessä
