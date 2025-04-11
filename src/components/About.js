import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>Rólunk</h1>
                    <p>Ismerje meg a ZöldKosár Webshop történetét, küldetését és csapatát</p>
                </div>
            </section>

            <section className="about-section">
                <div className="about-card">
                    <div className="about-image-container">
                        <img 
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop" 
                            alt="ZöldKosár üzlet" 
                            className="about-image" 
                        />
                    </div>
                    <div className="about-content">
                        <h2>Történetünk</h2>
                        <p>
                            A ZöldKosár Webshop fejlesztése 2024 januárjában kezdődött, amikor felismertük a növekvő igényt egy olyan online platform iránt, amely friss, helyi és fenntartható módon termesztett élelmiszereket kínál a vásárlóknak.
                        </p>
                        <p>
                            Projektünk a Keszthelyi Premontrei két végzős tanulója által került megvalósításra, akik a modern webfejlesztési technológiákat és a felhasználói élményt helyezték a középpontba. A fejlesztés során szorosan együttműködtünk helyi termelőkkel és kiskereskedőkkel, hogy megértsük igényeiket és kihívásaikat.
                        </p>
                        <p>
                            2025 áprilisában indítottuk el a webshop első verzióját, amely azóta is folyamatosan fejlődik és bővül új funkciókkal. Büszkék vagyunk arra, hogy rövid idő alatt sikerült egy olyan platformot létrehoznunk, amely összeköti a helyi termelőket a tudatos vásárlókkal.
                        </p>
                    </div>
                </div>
            </section>

            <section className="about-section reverse">
                <div className="about-card">
                    <div className="about-content">
                        <h2>Küldetésünk</h2>
                        <p>
                            A ZöldKosár Webshop küldetése, hogy hidat képezzen a helyi termelők és a tudatos vásárlók között. Célunk egy olyan platform biztosítása, ahol a vásárlók könnyen hozzáférhetnek minőségi, friss és fenntartható módon termesztett élelmiszerekhez.
                        </p>
                        <p>
                            Elkötelezettek vagyunk a környezetvédelem mellett, ezért támogatjuk a rövid ellátási láncokat és a helyi gazdaságot. Platformunkon keresztül csökkentjük az élelmiszerek szállításából eredő szén-dioxid kibocsátást, és minimalizáljuk a csomagolási hulladékot.
                        </p>
                        <p>
                            Társadalmi felelősségvállalásunk részeként bevételünk 20%-át a Zalaegerszegi Bogáncs Állatmenhely támogatására fordítjuk, mert hisszük, hogy a technológiai innováció és a társadalmi felelősségvállalás kéz a kézben járnak.
                        </p>
                    </div>
                    <div className="about-image-container">
                        <img 
                            src="https://images.unsplash.com/photo-1470072768013-bf9532016c10?q=80&w=2070&auto=format&fit=crop" 
                            alt="Küldetésünk" 
                            className="about-image" 
                        />
                    </div>
                </div>
            </section>

            <section className="about-section">
                <div className="about-card">
                    <div className="about-image-container">
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                            alt="Csapatunk" 
                            className="about-image" 
                        />
                    </div>
                    <div className="about-content">
                        <h2>Csapatunk</h2>
                        <p>
                            A ZöldKosár Webshop mögött egy fiatal, innovatív és elkötelezett csapat áll. Fejlesztőink a legmodernebb technológiákat használják, hogy a legjobb felhasználói élményt nyújtsák vásárlóinknak.
                        </p>
                        <p>
                            Csapatunk tagjai között vannak:
                        </p>
                        <ul>
                            <li><strong>Fejlesztők</strong> - Akik a webshop technikai hátterét biztosítják és folyamatosan fejlesztik a platformot</li>
                            <li><strong>Termékmenedzserek</strong> - Akik a helyi termelőkkel tartják a kapcsolatot és gondoskodnak a termékek minőségéről</li>
                            <li><strong>UX/UI szakértők</strong> - Akik a felhasználói élményt és a webshop használhatóságát optimalizálják</li>
                            <li><strong>Logisztikai szakemberek</strong> - Akik biztosítják a rendelések gyors és pontos kiszállítását</li>
                            <li><strong>Ügyfélszolgálati munkatársak</strong> - Akik készséggel állnak a vásárlók rendelkezésére bármilyen kérdés esetén</li>
                        </ul>
                        <p>
                            Mindannyian elkötelezettek vagyunk a fenntarthatóság, a helyi értékek támogatása és a kiváló szolgáltatás nyújtása mellett.
                        </p>
                    </div>
                </div>
            </section>

            <section className="about-contact">
                <h2>Kapcsolat</h2>
                <div className="contact-info">
                    <div className="contact-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <p>8900 Zalaegerszeg, Fő utca 123.</p>
                    </div>
                    <div className="contact-item">
                        <i className="fas fa-phone"></i>
                        <p>+36 30 123 4567</p>
                    </div>
                    <div className="contact-item">
                        <i className="fas fa-envelope"></i>
                        <p>info@zoldkosar.hu</p>
                    </div>
                    <div className="contact-item">
                        <i className="fas fa-clock"></i>
                        <p>Ügyfélszolgálat: H-P 8:00-18:00</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
