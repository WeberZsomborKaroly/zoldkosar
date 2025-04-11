import React from 'react';
import './DataPrivacyPolicy.css';

const DataPrivacyPolicy = () => {
    return (
        <div className="data-privacy-container">
            <div className="data-privacy-content">
                <h1>Adatkezelési Tájékoztató</h1>
                
                <section>
                    <h2>1. Bevezetés</h2>
                    <p>
                        Üdvözöljük a ZöldKosár webáruház Adatkezelési Tájékoztatójában. Ez a dokumentum részletes információkat 
                        nyújt arról, hogyan gyűjtjük, használjuk, tároljuk és védjük az Ön személyes adatait 
                        weboldalunk használata során.
                    </p>
                    <p>
                        Adatkezelőként elkötelezettek vagyunk az Ön személyes adatainak védelme mellett, és 
                        betartjuk az Európai Unió Általános Adatvédelmi Rendeletét (GDPR) valamint a magyar 
                        adatvédelmi jogszabályokat.
                    </p>
                </section>

                <section>
                    <h2>2. Az adatkezelő adatai</h2>
                    <p>Név: ZöldKosár Webáruház Kft.</p>
                    <p>Székhely: 8900 Zalaegerszeg, Kossuth Lajos utca 45.</p>
                    <p>Cégjegyzékszám: 20-09-123456</p>
                    <p>Adószám: 12345678-2-20</p>
                    <p>E-mail: info@zoldkosar.hu</p>
                    <p>Telefonszám: +36 30 123 4567</p>
                </section>

                <section>
                    <h2>3. Milyen adatokat gyűjtünk?</h2>
                    <h3>3.1. Regisztráció során megadott adatok</h3>
                    <ul>
                        <li>Név</li>
                        <li>E-mail cím</li>
                        <li>Jelszó (titkosított formában tároljuk)</li>
                        <li>Telefonszám</li>
                    </ul>

                    <h3>3.2. Vásárlás során megadott adatok</h3>
                    <ul>
                        <li>Szállítási cím</li>
                        <li>Számlázási cím</li>
                        <li>Fizetési adatok (a fizetési szolgáltatón keresztül)</li>
                    </ul>

                    <h3>3.3. Automatikusan gyűjtött adatok</h3>
                    <ul>
                        <li>IP cím</li>
                        <li>Böngésző típusa és verziója</li>
                        <li>Eszköz típusa</li>
                        <li>Látogatás időpontja és időtartama</li>
                        <li>Megtekintett oldalak</li>
                        <li>Kattintások</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Az adatkezelés célja</h2>
                    <ul>
                        <li>A webáruház szolgáltatásainak biztosítása</li>
                        <li>Megrendelések feldolgozása és teljesítése</li>
                        <li>Kapcsolattartás a vásárlókkal</li>
                        <li>Számlázás és könyvelés</li>
                        <li>Jogszabályi kötelezettségek teljesítése</li>
                        <li>Weboldal működésének elemzése és fejlesztése</li>
                        <li>Személyre szabott ajánlatok készítése (hozzájárulás esetén)</li>
                        <li>Hírlevél küldése (hozzájárulás esetén)</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Az adatkezelés jogalapja</h2>
                    <ul>
                        <li><strong>Szerződés teljesítése:</strong> vásárlással kapcsolatos adatkezelés</li>
                        <li><strong>Jogi kötelezettség teljesítése:</strong> számlázási adatok kezelése</li>
                        <li><strong>Jogos érdek:</strong> weboldal működésének biztosítása, visszaélések megelőzése</li>
                        <li><strong>Hozzájárulás:</strong> marketing célú adatkezelés, hírlevél küldése</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Adatmegőrzési időtartam</h2>
                    <ul>
                        <li>Regisztrációs adatok: a regisztráció törléséig</li>
                        <li>Vásárlási adatok: a szerződés teljesítését követő 5 évig (polgári jogi elévülési idő)</li>
                        <li>Számlázási adatok: a számla kiállítását követő 8 évig (számviteli törvény szerint)</li>
                        <li>Marketing célú adatok: a hozzájárulás visszavonásáig</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Adattovábbítás, adatfeldolgozók</h2>
                    <p>
                        Személyes adatait az alábbi adatfeldolgozók részére továbbíthatjuk:
                    </p>
                    <ul>
                        <li>Tárhelyszolgáltató: [Szolgáltató neve]</li>
                        <li>Futárszolgálat: [Futárszolgálat neve]</li>
                        <li>Fizetési szolgáltató: [Szolgáltató neve]</li>
                        <li>Könyvelő iroda: [Iroda neve]</li>
                    </ul>
                    <p>
                        Az adatfeldolgozók kizárólag az adatkezelő utasításai alapján, a fent meghatározott célok 
                        érdekében kezelhetik az adatokat.
                    </p>
                </section>

                <section>
                    <h2>8. Az Ön jogai</h2>
                    <ul>
                        <li><strong>Hozzáférési jog:</strong> tájékoztatást kérhet arról, hogy milyen adatait kezeljük</li>
                        <li><strong>Helyesbítési jog:</strong> kérheti pontatlan adatainak helyesbítését</li>
                        <li><strong>Törlési jog:</strong> kérheti adatainak törlését, ha az adatkezelésnek nincs más jogalapja</li>
                        <li><strong>Korlátozáshoz való jog:</strong> bizonyos esetekben kérheti adatai kezelésének korlátozását</li>
                        <li><strong>Adathordozhatósághoz való jog:</strong> kérheti, hogy adatait tagolt, géppel olvasható formátumban átadjuk</li>
                        <li><strong>Tiltakozáshoz való jog:</strong> jogos érdeken alapuló adatkezelés esetén tiltakozhat az adatkezelés ellen</li>
                    </ul>
                    <p>
                        Jogainak gyakorlásához kérjük, írjon az info@zoldkosar.hu e-mail címre. Kérelmét 30 napon belül teljesítjük.
                    </p>
                </section>

                <section>
                    <h2>9. Adatbiztonság</h2>
                    <p>
                        Megfelelő technikai és szervezési intézkedéseket alkalmazunk az Ön személyes adatainak 
                        védelme érdekében. Ezek közé tartoznak:
                    </p>
                    <ul>
                        <li>Titkosított adattárolás és adattovábbítás (SSL)</li>
                        <li>Jelszóval védett rendszerek</li>
                        <li>Rendszeres biztonsági mentések</li>
                        <li>Hozzáférési jogosultságok szabályozása</li>
                        <li>Adatvédelmi incidensek kezelésére vonatkozó eljárások</li>
                    </ul>
                </section>

                <section>
                    <h2>10. Cookie-k (sütik) használata</h2>
                    <p>
                        Weboldalunk cookie-kat használ a felhasználói élmény javítása érdekében. A cookie-k 
                        használatáról részletes tájékoztatást a Cookie Szabályzatunkban talál.
                    </p>
                </section>

                <section>
                    <h2>11. Panaszkezelés</h2>
                    <p>
                        Ha úgy érzi, hogy személyes adatainak kezelése kapcsán jogsérelem érte, kérjük, először 
                        velünk vegye fel a kapcsolatot az info@zoldkosar.hu e-mail címen.
                    </p>
                    <p>
                        Amennyiben panasza nem kerül megnyugtatóan rendezésre, a Nemzeti Adatvédelmi és 
                        Információszabadság Hatósághoz fordulhat:
                    </p>
                    <p>
                        Nemzeti Adatvédelmi és Információszabadság Hatóság<br />
                        Cím: 1055 Budapest, Falk Miksa utca 9-11.<br />
                        Postacím: 1363 Budapest, Pf.: 9.<br />
                        Telefon: +36 1 391 1400<br />
                        E-mail: ugyfelszolgalat@naih.hu<br />
                        Weboldal: www.naih.hu
                    </p>
                </section>

                <section>
                    <h2>12. Az Adatkezelési Tájékoztató módosítása</h2>
                    <p>
                        Fenntartjuk a jogot, hogy jelen Adatkezelési Tájékoztatót egyoldalúan módosítsuk. 
                        A módosításokról weboldalunkon tájékoztatjuk a felhasználókat. A módosított Adatkezelési 
                        Tájékoztató a weboldalon történő közzététellel lép hatályba.
                    </p>
                </section>

                <section>
                    <h2>13. Záró rendelkezések</h2>
                    <p>
                        Jelen Adatkezelési Tájékoztató 2025. április 7-től hatályos.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default DataPrivacyPolicy;
