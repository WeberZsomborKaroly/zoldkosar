import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { fetchPromotions, getActivePromotion, getCurrentPrice } from '../utils/promotionUtils';
import './Home.css';
import BlogModal from './BlogModal';
import FortuneWheel from './wheel/FortuneWheel';
// Képek importálása
import egeszsegesKep from '../kepek/Home/egeszseges_taplalkozasjpg.jpg';
import szezonalisKep from '../kepek/Home/szezonalis_termekek.jpg';
import okologiaiKep from '../kepek/Home/okologiai_labnyom.jpg';
import allatmenhelyKep from '../kepek/Home/allatmenhely.jpg';
import allatmenhely2Kep from '../kepek/Home/allatmenhely2.jpg';
import szezonTavaszKep from '../kepek/Home/szezon_tavasz.jpg';
// Termék képek importálása
import csirkemellKep from '../kepek/Products/csirkemell.png';
import chivasKep from '../kepek/Products/chivas.png';
import milkaKep from '../kepek/Products/milkacsoki.png';
import bananKep from '../kepek/Products/banan.png';
import serpenyoKep from '../kepek/Products/serpenyo.png';
import almaKep from '../kepek/Products/alma.png';
import kenyerKep from '../kepek/Products/felbarna_kenyer.png';
import tejKep from '../kepek/Products/friss_tej.png';
import paradicsomKep from '../kepek/Products/paradicsom.png';
import defaultKep from '../kepek/Products/default.png';

const Home = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showFortuneWheel, setShowFortuneWheel] = useState(false);
    const [activeCoupon, setActiveCoupon] = useState(null);
    const [blogPosts] = useState([
        {
            id: 4,
            title: 'Bevételünk 20%-a állatmenhelynek megy',
            excerpt: 'Webshopunk büszkén támogatja a Zalaegerszegi Bogáncs Állatmenhelyet. Ismerd meg, hogyan segítünk az állatvédelemben...',
            image: allatmenhely2Kep, 
            date: '2025. április 1.',
            fullContent: [
                'Örömmel jelentjük be, hogy a ZöldKosár Webshop bevételének 20%-át a Zalaegerszegi Bogáncs Állatmenhely támogatására fordítjuk. Ez a kezdeményezés 2025 áprilisától állandó részévé vált üzletpolitikánknak.',
                'A Bogáncs Állatmenhely több mint 15 éve nyújt menedéket és gondoskodást a gazdátlan, bántalmazott vagy elhagyott állatok számára. Havonta átlagosan 50-60 állatot mentenek meg és gondoznak, amíg új, szerető otthonra nem találnak.',
                'A menhely főbb tevékenységei közé tartozik:',
                '• Kóbor és elhagyott állatok befogadása és gondozása\n• Orvosi ellátás és rehabilitáció biztosítása\n• Örökbefogadási programok szervezése\n• Állatvédelmi oktatás és szemléletformálás\n• Ivartalanítási programok támogatása',
                'A te vásárlásod is számít! Minden alkalommal, amikor a ZöldKosár Webshopban vásárolsz, közvetlenül hozzájárulsz ezeknek a védtelen állatoknak a jólétéhez. A bevételünk 20%-ából a menhely képes biztosítani:',
                '• Minőségi táplálékot az állatok számára\n• Szükséges orvosi kezeléseket és gyógyszereket\n• A menhely infrastruktúrájának fejlesztését\n• Állatvédelmi programok szervezését',
                'Ha személyesen is szeretnéd támogatni a menhelyet vagy örökbefogadás iránt érdeklődsz, az alábbi elérhetőségeken teheted meg:',
                'Zalaegerszegi Bogáncs Állatmenhely\n8900 Zalaegerszeg, Csilla dűlő 6.\nTelefon: +36 30 / 424 35 79\nWeboldal: www.bogancsmenhely.hu\nFacebook: https://www.facebook.com/Bogancs.Tamogatas/',
                'Köszönjük, hogy vásárlásoddal Te is hozzájárulsz ehhez a nemes ügyhöz! Együtt valódi változást hozhatunk az állatok életébe.'
            ],
            tags: ['társadalmi felelősségvállalás', 'állatvédelem', 'adományozás', 'fenntarthatóság']
        },
        {
            id: 5,
            title: 'Tavaszi receptek - Szezonális finomságok',
            excerpt: 'Fedezd fel a tavasz legfrissebb hozzávalóit és készíts belőlük különleges fogásokat. Íme néhány szezonális recept ötlet...',
            image: szezonTavaszKep,
            date: '2025. április 2.',
            fullContent: [
                'A tavasz beköszöntével megérkeznek a friss, szezonális alapanyagok is a piacokra és boltokba. Használd ki a természet bőkezűségét, és készíts egészséges, vitamindús ételeket!',
                'Íme néhány szezonális alapanyag, ami most a legfrissebb:',
                '• Spárga - A tavaszi szezon sztárja, tele vitaminokkal és ásványi anyagokkal',
                '• Medvehagyma - Vadon termő, intenzív ízű zöldfűszer',
                '• Retek - Ropogós, frissítő zöldség, tele C-vitaminnal',
                '• Újhagyma - Enyhe, kellemes íz, salátákhoz, szendvicsekhez tökéletes',
                '• Sóska - Kellemesen savanykás ízű levélzöldség',
                'Tavaszi spárgakrémleves:',
                'Hozzávalók (4 személyre):',
                '• 500g zöld spárga',
                '• 1 fej vöröshagyma',
                '• 2 gerezd fokhagyma',
                '• 1 evőkanál vaj',
                '• 1 liter zöldségalaplé',
                '• 200ml tejszín',
                '• Só, bors ízlés szerint',
                '• Friss petrezselyem a díszítéshez',
                'Elkészítés:',
                '1. A spárgát mosd meg, törd le a fás végeit, majd vágd 2-3 cm-es darabokra.',
                '2. Egy nagyobb lábasban olvaszd fel a vajat, add hozzá az apróra vágott hagymát és fokhagymát, dinszteld üvegesre.',
                '3. Add hozzá a spárgát, pirítsd 2-3 percig, majd öntsd fel az alaplével.',
                '4. Főzd 15-20 percig, amíg a spárga megpuhul, majd botmixerrel pürésítsd.',
                '5. Öntsd hozzá a tejszínt, forrald össze, ízesítsd sóval, borssal.',
                '6. Tálaláskor díszítsd friss petrezselyemmel és egy kevés tejszínnel.',
                'Medvehagymás túrókrém:',
                'Hozzávalók:',
                '• 250g túró',
                '• 100g tejföl',
                '• 1 csokor medvehagyma',
                '• 1 gerezd fokhagyma',
                '• Só, bors ízlés szerint',
                '• 1 teáskanál citromlé',
                'Elkészítés:',
                '1. A medvehagymát alaposan mosd meg, szárítsd le, majd vágd apróra.',
                '2. A túrót villával törd össze, keverd el a tejföllel.',
                '3. Add hozzá az apróra vágott medvehagymát, a zúzott fokhagymát, a citromlevet, sózd, borsozd ízlés szerint.',
                '4. Legalább 1 órát pihentesd a hűtőben, hogy az ízek összeérjenek.',
                '5. Pirítóssal, friss zöldségekkel tálald.',
                'Vásárolj friss, szezonális alapanyagokat webshopunkban, és készítsd el ezeket a finom tavaszi recepteket otthon!'
            ],
            tags: ['tavasz', 'szezonális receptek', 'spárga', 'medvehagyma', 'egészséges táplálkozás']
        },
        {
            id: 1,
            title: 'Egészséges táplálkozás alapjai',
            excerpt: 'Fedezd fel, hogyan állíts össze kiegyensúlyozott étrendet és milyen alapvető élelmiszereket érdemes beszerezni...',
            image: egeszsegesKep,
            date: '2025. február 27.',
            fullContent: [
                'Az egészséges táplálkozás nem csak egy trend, hanem életmód. A kiegyensúlyozott étrend kialakítása kulcsfontosságú az egészségünk megőrzésében és a betegségek megelőzésében.',
                'Az első és legfontosabb szabály: együnk változatosan! A szervezetünknek különböző tápanyagokra van szüksége, amelyeket különböző élelmiszerekből tudunk beszerezni. A napi étrendünkben szerepeljenek:',
                '• Friss zöldségek és gyümölcsök - naponta legalább 400g',
                '• Teljes kiőrlésű gabonafélék',
                '• Minőségi fehérjeforrások (hal, sovány hús, tojás, hüvelyesek)',
                '• Egészséges zsírok (olívaolaj, avokádó, olajos magvak)',
                'Emellett fontos a megfelelő folyadékbevitel is. Naponta legalább 2-2,5 liter vizet igyunk, és kerüljük a cukros üdítőket.',
                'Az egészséges táplálkozás nem jelenti azt, hogy teljesen le kell mondanunk a kedvenc ételeinkről. A kulcs a mértékletesség és a tudatosság az ételválasztásban.'
            ],
            tags: ['egészséges életmód', 'táplálkozás', 'vitaminok', 'életmódváltás']
        },
        {
            id: 2,
            title: 'Szezonális termékek előnyei',
            excerpt: 'Miért érdemes szezonális termékeket vásárolni? Útmutató a friss és egészséges élelmiszerek kiválasztásához...',
            image: szezonalisKep,
            date: '2025. február 25.',
            fullContent: [
                'A szezonális termékek vásárlása nem csak környezettudatos döntés, hanem gazdasági és egészségügyi szempontból is előnyös választás.',
                'A szezonális zöldségek és gyümölcsök általában:',
                '• Olcsóbbak, mint az üvegházban termesztett társaik',
                '• Magasabb tápértékkel rendelkeznek',
                '• Jobb ízűek',
                '• Kevesebb növényvédő szert tartalmaznak',
                'Tavasszal érdemes fogyasztani: spárga, retek, újhagyma, saláta',
                'Nyáron: paradicsom, paprika, cukkini, barack',
                'Ősszel: szőlő, alma, körte, sütőtök',
                'Télen: káposzta, cékla, zeller',
                'A szezonális termékek vásárlásával a helyi termelőket is támogatjuk, és csökkentjük az élelmiszerek szállításából eredő környezeti terhelést.'
            ],
            tags: ['szezonális', 'helyi termékek', 'környezettudatosság', 'egészséges táplálkozás']
        },
        {
            id: 3,
            title: 'Fenntartható vásárlási szokások',
            excerpt: 'Hogyan csökkentheted az ökológiai lábnyomod bevásárlás közben? Tippek a környezettudatos vásárláshoz...',
            image: okologiaiKep,
            date: '2025. február 20.',
            fullContent: [
                'A környezettudatos vásárlás nem csak divat, hanem felelősség. Minden döntésünkkel hatással vagyunk a környezetünkre, ezért fontos, hogy tudatosan válasszuk meg vásárlási szokásainkat.',
                'Néhány egyszerű tipp a fenntartható vásárláshoz:',
                '• Használj újrahasználható bevásárlótáskát',
                '• Válassz csomagolásmentes termékeket',
                '• Részesítsd előnyben a helyi termékeket',
                '• Tervezd meg előre a bevásárlást, hogy elkerüld a pazarlást',
                'A tudatos vásárlás része az is, hogy figyelünk az élelmiszerek eredetére és a termelés körülményeire. Válasszunk olyan termékeket, amelyek:',
                '• Fair trade kereskedelemből származnak',
                '• Környezetbarát csomagolásban vannak',
                '• Minimális szállítási távolságot tettek meg',
                '• Fenntartható gazdálkodásból származnak'
            ],
            tags: ['környezetvédelem', 'fenntarthatóság', 'tudatos vásárlás', 'zero waste']
        }
    ]);
    const navigate = useNavigate();
    
    // Refs for carousel scrolling
    const productCarouselRef = useRef(null);
    const blogCarouselRef = useRef(null);

    // Function to get the correct image based on product name
    const getProductImage = (productName) => {
        const name = productName.toLowerCase();
        if (name.includes('csirkemell')) return csirkemellKep;
        if (name.includes('chivas')) return chivasKep;
        if (name.includes('milka')) return milkaKep;
        if (name.includes('banán')) return bananKep;
        if (name.includes('serpenyő')) return serpenyoKep;
        if (name.includes('alma')) return almaKep;
        if (name.includes('kenyér')) return kenyerKep;
        if (name.includes('tej')) return tejKep;
        if (name.includes('paradicsom')) return paradicsomKep;
        return defaultKep;
    };

    const handleCouponWin = (couponData) => {
        setActiveCoupon({
            code: couponData.code,
            discount: couponData.discount
        });
        
        setMessage({
            type: 'success',
            text: `Gratulálunk! Nyertél egy ${couponData.discount}% kedvezményt! Kuponkód: ${couponData.code}`
        });
        setTimeout(() => setMessage(null), 5000);
    };
    
    // Check for active wheel coupon
    useEffect(() => {
        if (user) {
            const wheelCoupon = localStorage.getItem('wheelCoupon');
            if (wheelCoupon) {
                const couponData = JSON.parse(wheelCoupon);
                setActiveCoupon({
                    code: couponData.code,
                    discount: couponData.discount
                });
            }
        }
    }, [user]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Próbáljuk meg lekérni a népszerű termékeket az admin panelből
                try {
                    const response = await axiosInstance.get('/admin/products/top');
                    if (response.data && response.data.length > 0) {
                        console.log('Fetched top products from API:', response.data);
                        // Csak az ID-kat tároljuk el
                        const topProductIds = response.data.map(product => product.id);
                        
                        // Lekérjük az összes terméket
                        const allProductsResponse = await axiosInstance.get('/termekek');
                        
                        // Szűrjük a termékeket a top termékek ID-i alapján
                        const filteredProducts = allProductsResponse.data.filter(
                            product => topProductIds.includes(product.id)
                        );
                        
                        console.log('Filtered top products:', filteredProducts);
                        setProducts(filteredProducts);
                        return;
                    }
                } catch (error) {
                    console.log('Could not fetch top products from API, using mock data');
                }
                
                // Ha nem sikerült az API-ról lekérni, akkor használjuk a localStorage-ban tárolt adatokat
                // vagy ha az sincs, akkor használjunk mock adatokat
                const mockTopProducts = [
                    {
                        id: 1,
                        nev: 'Csirkemell filé',
                        ar: 1800,
                        leiras: 'Friss csirkemell filé, kiváló minőségű, hazai forrásból.',
                        kategoria_id: 8
                    },
                    {
                        id: 2,
                        nev: 'Chivas Regal 12 éves',
                        ar: 9990,
                        leiras: 'Prémium skót whisky, 12 éves érlelésű.',
                        kategoria_id: 2
                    },
                    {
                        id: 3,
                        nev: 'Milka csokoládé',
                        ar: 450,
                        leiras: 'Alpesi tejcsokoládé, 100g.',
                        kategoria_id: 1
                    },
                    {
                        id: 4,
                        nev: 'Banán',
                        ar: 450,
                        leiras: 'Friss, érett banán, kg.',
                        kategoria_id: 5
                    },
                    {
                        id: 5,
                        nev: 'Teflon serpenyő',
                        ar: 4990,
                        leiras: '28 cm átmérőjű tapadásmentes serpenyő.',
                        kategoria_id: 3
                    }
                ];
                
                // Elmentjük a localStorage-ba a népszerű termékeket
                localStorage.setItem('topProducts', JSON.stringify(mockTopProducts));
                setProducts(mockTopProducts);
                
            } catch (error) {
                console.error('Hiba a termékek betöltésekor:', error);
                
                // Ha minden más sikertelen, használjunk alapértelmezett termékeket
                const defaultProducts = [
                    {
                        id: 1,
                        nev: 'Csirkemell filé',
                        ar: 1800,
                        leiras: 'Friss csirkemell filé, kiváló minőségű, hazai forrásból.',
                        kategoria_id: 8
                    },
                    {
                        id: 2,
                        nev: 'Chivas Regal 12 éves',
                        ar: 9990,
                        leiras: 'Prémium skót whisky, 12 éves érlelésű.',
                        kategoria_id: 2
                    }
                ];
                setProducts(defaultProducts);
            }
        };

        fetchProducts();
        loadPromotions();
    }, []);

    useEffect(() => {
        // Aktív kupon ellenőrzése
        const checkActiveCoupon = () => {
            const storedCoupon = localStorage.getItem('activeCoupon');
            if (storedCoupon) {
                try {
                    const coupon = JSON.parse(storedCoupon);
                    // Ellenőrizzük, hogy a kupon még érvényes-e (nem járt le)
                    const expiryDate = new Date(coupon.expiryDate);
                    if (expiryDate > new Date()) {
                        setActiveCoupon(coupon);
                    } else {
                        // Ha lejárt, töröljük
                        localStorage.removeItem('activeCoupon');
                    }
                } catch (error) {
                    console.error('Hiba a kupon betöltésekor:', error);
                }
            }
        };

        checkActiveCoupon();
    }, []);

    const loadPromotions = async () => {
        const promos = await fetchPromotions(axiosInstance);
        setPromotions(promos);
    };

    const handleAddToCart = async (termekId) => {
        if (!user) {
            setMessage({
                type: 'error',
                text: 'A kosárhoz adáshoz be kell jelentkezni!'
            });
            setTimeout(() => setMessage(null), 3000);
            return;
        }
        
        try {
            // Find the product
            const product = products.find(p => p.id === termekId);
            if (!product) {
                throw new Error('A termék nem található!');
            }
            
            // Get the current price (original or discounted)
            const currentPrice = getCurrentPrice(product, promotions);
            
            // Send the request to add to cart with the current price
            const response = await axiosInstance.post('/kosar/add', {
                termek_id: termekId,
                mennyiseg: 1,
                ar: currentPrice // Send the current price to the backend
            });
            
            setMessage({
                type: 'success',
                text: 'Termék sikeresen hozzáadva a kosárhoz!'
            });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Hiba a kosárhoz adás során:', error);
            setMessage({
                type: 'error',
                text: 'Hiba történt a kosárhoz adás során!'
            });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleShowDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    // Carousel scroll functions
    const scrollCarousel = (direction, ref) => {
        if (ref.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };
    
    const handleGoToCart = () => {
        navigate('/cart');
    };

    const [activeCategory, setActiveCategory] = useState('Rendelés & Szállítás');
    const [expandedFaqs, setExpandedFaqs] = useState({});

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    const toggleFaq = (index) => {
        setExpandedFaqs(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // FAQ data organized by categories
    const faqData = {
        'Rendelés & Szállítás': [
            {
                id: 1,
                question: 'Mennyi idő alatt érkezik meg a rendelésem?',
                answer: 'A rendelések általában 1-3 munkanapon belül kerülnek kiszállításra. Nagyobb forgalom esetén ez az időtartam legfeljebb 5 munkanapra nőhet. A rendelés leadása után e-mailben értesítést küldünk a várható kiszállítási időről.'
            },
            {
                id: 2,
                question: 'Hogyan követhetem nyomon a rendelésem?',
                answer: 'A rendelés leadása után e-mailben küldünk egy követési linket, amellyel nyomon követheti csomagja állapotát. Bejelentkezés után a fiókjában is megtekintheti a rendelései státuszát.'
            },
            {
                id: 3,
                question: 'Milyen szállítási módok közül választhatok?',
                answer: 'Jelenleg kettő szállítási módot kínálunk: futárszolgálat (1-2 munkanap), csomagpontra szállítás (2-3 munkanap).'
            }
        ],
        'Fizetés': [
            {
                id: 4,
                question: 'Hogyan tudok fizetni?',
                answer: 'Többféle fizetési módot kínálunk: Bankkártyás fizetés (Visa, Mastercard), Banki utalás, Utánvét (készpénzes vagy kártyás fizetés a futárnál), SZÉP kártya (csak élelmiszer kategóriában).'
            },
            {
                id: 5,
                question: 'Hogyan tudok számlát kérni?',
                answer: 'A rendelés leadása során a számlázási adatoknál jelezheti, hogy számlát szeretne kérni. Amennyiben ezt elmulasztotta, a rendelést követő 24 órán belül e-mailben is kérheti a számla kiállítását.'
            },
            {
                id: 6,
                question: 'Hogyan tudok kuponokat felhasználni?',
                answer: 'A kuponkódokat a pénztár oldalon a "Kuponkód" mezőbe írhatja be. A rendszer automatikusan érvényesíti a kedvezményt, amennyiben a kupon feltételei teljesülnek.'
            }
        ],
        'Termékek': [
            {
                id: 7,
                question: 'Mi a teendő hibás termék esetén?',
                answer: 'Amennyiben hibás terméket kapott, kérjük, jelezze felénk a problémát az ügyfélszolgálatunkon keresztül. A hibás termékeket ingyenesen kicseréljük vagy visszatérítjük az árát, az Ön választása szerint.'
            },
            {
                id: 8,
                question: 'Van lehetőség termékek visszaküldésére?',
                answer: 'Igen, a termékeket a kézhezvételtől számított 14 napon belül indoklás nélkül visszaküldheti. A visszaküldés költségét a vásárló viseli. Élelmiszerek esetén csak bontatlan csomagolásban fogadjuk el a visszaküldött termékeket.'
            },
            {
                id: 9,
                question: 'Honnan tudhatom, hogy egy termék raktáron van-e?',
                answer: 'A termék adatlapján mindig feltüntetjük a raktárkészletet. Ha a termék raktáron van, akkor azonnal rendelhető. Ha nincs raktáron, akkor a várható beszerzési időt is megjelenítjük.'
            }
        ],
        'Egyéb': [
            {
                id: 10,
                question: 'Hogyan tudok felhasználói fiókot létrehozni?',
                answer: 'A weboldal jobb felső sarkában található "Regisztráció" gombra kattintva töltheti ki a regisztrációs űrlapot. A regisztrációt követően e-mailben visszaigazolást küldünk, amelyben található aktiváló linkre kattintva véglegesítheti a regisztrációt.'
            },
            {
                id: 11,
                question: 'Elfelejtettem a jelszavamat. Mit tegyek?',
                answer: 'A bejelentkezési oldalon található "Elfelejtett jelszó" linkre kattintva kérhet új jelszót. Az e-mail címére küldünk egy linket, amelyen keresztül új jelszót adhat meg.'
            },
            {
                id: 12,
                question: 'Milyen adatokat tárolnak rólam?',
                answer: 'Csak a vásárlóhoz és szállításhoz szükséges adatokat tároljuk: név, e-mail cím, szállítási cím, számlázási adatok. Az adatkezelési tájékoztatónkban részletesen olvashat arról, hogyan kezeljük az Ön adatait.'
            }
        ]
    };

    return (
        <div className="home-container">
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            
            {/* Fortune Wheel Button and Active Coupon */}
            {user && (
                <div className="fortune-wheel-section">
                    {activeCoupon ? (
                        <div className="active-wheel-coupon">
                            <div className="coupon-info">
                                <i className="fas fa-ticket-alt"></i>
                                <span>Aktív kuponod: <strong>{activeCoupon.code}</strong> ({activeCoupon.discount}% kedvezmény)</span>
                            </div>
                            <div className="coupon-actions">
                                <button 
                                    className="use-coupon-button" 
                                    onClick={handleGoToCart}
                                >
                                    Beváltás
                                </button>
                                <button 
                                    className="fortune-wheel-button small" 
                                    onClick={() => setShowFortuneWheel(true)}
                                >
                                    <i className="fas fa-gift"></i> Részletek
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button 
                            className="fortune-wheel-button" 
                            onClick={() => setShowFortuneWheel(true)}
                        >
                            <i className="fas fa-gift"></i> Szerencsekerék
                        </button>
                    )}
                </div>
            )}
            
            {/* Fortune Wheel Modal */}
            {showFortuneWheel && (
                <FortuneWheel 
                    onClose={() => setShowFortuneWheel(false)}
                    onCouponWin={handleCouponWin}
                />
            )}
            
            {/* Hero szekció */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>ZöldKosár Webshop</h1>
                    <p>Minőségi termékek, gyors kiszállítás, elégedett vásárlók</p>
                    <div className="hero-buttons">
                        <button className="hero-button primary" onClick={() => navigate('/products')}>Vásárlás most</button>
                        <button 
                            className="hero-button secondary" 
                            onClick={() => navigate('/about')}
                        >
                            Rólunk
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Kiemelt termékek szekció gördülő sorral */}
            <section className="featured-products">
                <div className="section-header">
                    <h2 className="section-title">Legnépszerűbb Termékeink</h2>
                    <div className="carousel-controls">
                        <button className="carousel-control" onClick={() => scrollCarousel('left', productCarouselRef)}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button className="carousel-control" onClick={() => scrollCarousel('right', productCarouselRef)}>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                
                <div className="product-carousel" ref={productCarouselRef}>
                    {products.map(product => {
                        const activePromotion = getActivePromotion(product.id, promotions);
                        const currentPrice = getCurrentPrice(product, promotions);
                        
                        return (
                            <div key={product.id} className="product-card">
                                <div className="product-badge">Népszerű</div>
                                {activePromotion && (
                                    <div className="product-discount-badge">
                                        -{activePromotion.discount_percent}%
                                    </div>
                                )}
                                <div className="product-image-container">
                                    <img 
                                        src={getProductImage(product.nev)} 
                                        alt={product.nev} 
                                        className="product-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = defaultKep;
                                        }}
                                    />
                                </div>
                                <div className="product-info">
                                    <h3>{product.nev}</h3>
                                    {activePromotion ? (
                                        <div className="price-container">
                                            <p className="original-price">{product.ar.toLocaleString()} Ft</p>
                                            <p className="discount-price">{currentPrice.toLocaleString()} Ft</p>
                                        </div>
                                    ) : (
                                        <p className="price">{product.ar.toLocaleString()} Ft</p>
                                    )}
                                    <div className="product-actions">
                                        <button 
                                            className="details-button"
                                            onClick={() => handleShowDetails({
                                                id: product.id,
                                                name: product.nev,
                                                price: currentPrice,
                                                originalPrice: activePromotion ? product.ar : null,
                                                discountPercent: activePromotion ? activePromotion.discount_percent : null,
                                                description: product.leiras,
                                                image: getProductImage(product.nev)
                                            })}
                                        >
                                            Részletek
                                        </button>
                                        <button 
                                            className="cart-button"
                                            onClick={() => handleAddToCart(product.id)}
                                        >
                                            <i className="fas fa-shopping-cart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            
            {/* Állatmenhely támogatási szekció */}
            <section className="charity-section">
                <div className="charity-container">
                    <div className="charity-image">
                        <div className="charity-badge">20%</div>
                    </div>
                    <div className="charity-content">
                        <h2>Bevételünk 20%-a állatmenhelynek megy</h2>
                        <p>
                            A ZöldKosár Webshop büszkén támogatja a Zalaegerszegi Bogáncs Állatmenhelyet. Minden vásárlásoddal 
                            hozzájárulsz a gazdátlan, bántalmazott vagy elhagyott állatok gondozásához és új, szerető otthonuk megtalálásához.
                        </p>
                        <div className="charity-info">
                            <div className="charity-info-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>8900 Zalaegerszeg, Csilla dűlő 6.</span>
                            </div>
                            <div className="charity-info-item">
                                <i className="fas fa-phone-alt"></i>
                                <span>+36 30 / 424 35 79</span>
                            </div>
                            <div className="charity-info-item">
                                <i className="fas fa-globe"></i>
                                <a href="http://www.bogancsmenhely.hu" target="_blank" rel="noopener noreferrer">www.bogancsmenhely.hu</a>
                            </div>
                            <div className="charity-info-item">
                                <i className="fab fa-facebook-f"></i>
                                <a href="https://www.facebook.com/Bogancs.Tamogatas/" target="_blank" rel="noopener noreferrer">Bogáncs.Tamogatas</a>
                            </div>
                        </div>
                        <div className="charity-actions">
                            <button className="charity-button" onClick={() => setSelectedBlog(blogPosts.find(post => post.id === 4))}>További információ</button>
                            <a href="https://bogancsmenhely.hu/penzadomany" target="_blank" rel="noopener noreferrer" className="charity-button secondary">
                                <i className="fas fa-paw"></i> Közvetlen támogatás
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Blog szekció */}
            <section className="blog-section">
                <div className="section-header">
                    <h2 className="section-title">Blog & Inspiráció</h2>
                    <div className="carousel-controls">
                        <button className="carousel-control" onClick={() => scrollCarousel('left', blogCarouselRef)}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button className="carousel-control" onClick={() => scrollCarousel('right', blogCarouselRef)}>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                
                <div className="blog-carousel" ref={blogCarouselRef}>
                    {blogPosts.map(post => (
                        <div key={post.id} className="blog-card">
                            <div className="blog-image-container" onClick={() => setSelectedBlog(post)}>
                                <img src={post.image} alt={post.title} className="blog-image" />
                                <div className="blog-date">{post.date}</div>
                            </div>
                            <div className="blog-content">
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <div className="blog-tags">
                                    {post.tags.slice(0, 2).map((tag, index) => (
                                        <span key={index} className="blog-tag">{tag}</span>
                                    ))}
                                </div>
                                <span 
                                    className="read-more-link"
                                    onClick={() => setSelectedBlog(post)}
                                >
                                    Tovább olvasom
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                {selectedBlog && (
                    <BlogModal 
                        post={selectedBlog} 
                        onClose={() => setSelectedBlog(null)}
                    />
                )}
            </section>
            
            {/* Előnyök szekció */}
            <section className="benefits-section">
                <div className="benefit-card">
                    <div className="benefit-icon">🚚</div>
                    <h3>Ingyenes Szállítás</h3>
                    <p>15.000 Ft feletti rendelés esetén</p>
                </div>
                <div className="benefit-card">
                    <div className="benefit-icon">⏱️</div>
                    <h3>Gyors Kiszállítás</h3>
                    <p>1-3 munkanapon belül</p>
                </div>
                <div className="benefit-card">
                    <div className="benefit-icon">🔄</div>
                    <h3>Egyszerű Visszatérítés</h3>
                    <p>14 napon belül</p>
                </div>
                <div className="benefit-card">
                    <div className="benefit-icon">🔒</div>
                    <h3>Biztonságos Fizetés</h3>
                    <p>Titkosított tranzakciók</p>
                </div>
            </section>
            
            {/* Gyakori kérdések szekció */}
            <section className="faq-section">
                <div className="faq-content">
                    <h2>Gyakori kérdések</h2>
                    <p className="faq-intro">Az alábbiakban összegyűjtöttük a leggyakrabban feltett kérdéseket.</p>
                    
                    <div className="faq-categories">
                        <button 
                            className={`faq-category-btn ${activeCategory === 'Rendelés & Szállítás' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('Rendelés & Szállítás')}
                        >
                            Rendelés & Szállítás
                        </button>
                        <button 
                            className={`faq-category-btn ${activeCategory === 'Fizetés' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('Fizetés')}
                        >
                            Fizetés
                        </button>
                        <button 
                            className={`faq-category-btn ${activeCategory === 'Termékek' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('Termékek')}
                        >
                            Termékek
                        </button>
                        <button 
                            className={`faq-category-btn ${activeCategory === 'Egyéb' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('Egyéb')}
                        >
                            Egyéb
                        </button>
                    </div>
                    
                    <div className="faq-items-container">
                        {faqData[activeCategory].map((faq) => (
                            <div className="faq-item" key={faq.id}>
                                <div 
                                    className="faq-question" 
                                    onClick={() => toggleFaq(faq.id)}
                                >
                                    <h3>{faq.question}</h3>
                                    <span className="faq-toggle">{expandedFaqs[faq.id] ? '-' : '+'}</span>
                                </div>
                                <div className="faq-answer" style={{display: expandedFaqs[faq.id] ? 'block' : 'none'}}>
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Termék részletek modal */}
            {showModal && selectedProduct && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedProduct.name}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-image-container">
                                <img 
                                    src={selectedProduct.image} 
                                    alt={selectedProduct.name} 
                                    className="modal-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultKep;
                                    }}
                                />
                            </div>
                            <div className="modal-details">
                                <p className="modal-description">{selectedProduct.description || 'Nincs leírás'}</p>
                                <div className="modal-price-container">
                                    {selectedProduct.originalPrice && (
                                        <p className="original-price">{selectedProduct.originalPrice.toLocaleString()} Ft</p>
                                    )}
                                    <p className="discount-price">{selectedProduct.price.toLocaleString()} Ft</p>
                                    {selectedProduct.discountPercent && (
                                        <p className="discount-text">-{selectedProduct.discountPercent}% kedvezmény</p>
                                    )}
                                </div>
                                <div className="modal-actions">
                                    <button 
                                        className="modal-button cart-button"
                                        onClick={() => handleAddToCart(selectedProduct.id)}
                                    >
                                        <i className="fas fa-shopping-cart"></i>
                                        <span style={{ marginLeft: '10px' }}>Kosárba helyezés</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Blog modal */}
            {selectedBlog && <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />}
        </div>
    );
};

export default Home;
