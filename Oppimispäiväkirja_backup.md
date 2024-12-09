python convert.py test.md# 📚 Oppimispäiväkirja

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
- Kaikki olikin jo valmiina, kun koodi oltiin tehnyt backend1 tunnilla
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

export const User = mongoose.model('User', UserSchema);
```

Esimerkki käyttäjän luomisesta joka ei ole admin:

```typescript
const newUser = new User({
  username: "mattimaallikko",
  password: "supersalainensalasana123",
  isadmin: true
});
```
> ### ⚠️ Tärkeä huomio
> **Ongelma:** Jos `isadmin: false`, sivu väittää virheellisesti että tunnukset eivät ole oikein.
>
> **Korjausehdotus:**
> - Muokataan koodi sallimaan kirjautuminen myös ei-admin käyttäjille
> - Ei-admin käyttäjät pääsevät sivulle, mutta eivät voi muokata/lisätä tietoja

##### 🔄 Autentikaation kulku
1. **Frontend** (`src/app/login/login.component.ts`, `src/app/services/auth.service.ts`):
   - Google-kirjautumispainikkeen klikkaus (`<asl-google-signin-button>`)
   - OAuth2 flow Googlen kanssa
   - ID-tokenin vastaanotto `LoginComponent.ngOnInit()`-metodissa
   - Token lähetetään backendille `AuthService.glogin()`-metodilla:
   ```typescript
   glogin(gtoken: string): Observable<boolean> {
     return this.http.post(googleLoginUrl, { gtoken })
       .pipe(
         map((res: any) => {
           const token = res['token'];
           if (token) {
             sessionStorage.setItem('accesstoken', token);
             return true;
           }
           return false;
         })
       );
   }
   ```

2. **Backend** (`db_dh/validatesocialtoken.js`, `db_dh/controllers/usercontroller.js`):
   - Tokenin validointi Google Auth Libraryn avulla:

   ```javascript
   async function validateSocialToken(token) {
     const ticket = await client.verifyIdToken({
       idToken: token,
       audience: GOOGLE_CLIENT_ID
     });
     const payload = ticket.getPayload();
     return payload['sub']; // Google user ID
   }
   ```
   - JWT-tokenin luonti ja palautus frontendille:
   ```javascript
   authenticateGUser: function(req, res) {
     validateSocialToken(req.body.gtoken).then(userid => {
       const user = { username: userid, isadmin: true };
       const jwttoken = createToken(user);
       res.json({ token: jwttoken });
     });
   }
   ```

4. **Tietoturvahuomiot**:
   - JWT-token tallennetaan sessionStorageen (ei localStorage)
   - Token vanhenee 24 tunnin kuluttua
   - Google Client ID ja JWT Secret ovat ympäristömuuttujissa
   - CORS on konfiguroitu sallimaan vain tietyt originit

> ### 💡 Jatkokehitysideat
> - Käyttäjäroolien tarkempi määrittely (admin/user)
> - Tokenin automaattinen päivitys
> - Kirjautumistietojen tallennus MongoDB:hen audit logia varten

### 29.11.2024 - 09.12.2024
--- Kertausharjoitus, eli olen poissa ja palaan 09.12.2024. takaisin ---
- Tämän jälkeen, pyritään suorittamaan seuraavat tehtävät:
  1. Kirjautumisprosessin toteuttaminen loppuun - Kirjautumistietojen tallennus tietokantaan
  2. Selvitys LocalStoragen käyttöönotosta
  3. PWAn buildaus