-- 18+ termékek hozzáadása
INSERT INTO termekek (
    nev, 
    leiras, 
    ar, 
    akcios_ar, 
    keszlet, 
    kategoria_id,
    kep,
    kiszereles,
    akcios,
    akcio_kezdete,
    akcio_vege,
    hivatkozas,
    tizennyolc_plusz,
    aktiv
) VALUES 
-- Kőbányai 0.5L
(
    'Kőbányai világos sör 0.5L', 
    'Klasszikus magyar világos sör, 4.3% alkoholtartalom. Frissítő ízvilág, kellemes komlós utóíz. Tökéletes választás baráti összejövetelekre vagy egy hosszú nap után.', 
    399, 
    NULL, 
    50, 
    3,
    '/kepek/Products/18+/kobanyai0,5.png',
    '0.5L',
    0,
    NULL,
    NULL,
    'kobanyai-vilagos-sor-05l',
    1,
    1
),
-- Kőbányai 2L
(
    'Kőbányai világos sör 2L', 
    'Klasszikus magyar világos sör családi kiszerelésben, 4.3% alkoholtartalom. Gazdaságos választás nagyobb társaságoknak vagy hosszabb időszakra.', 
    899, 
    799, 
    30, 
    3,
    '/kepek/Products/18+/kobanyai2l.png',
    '2L',
    1,
    '2025-04-01',
    '2025-05-01',
    'kobanyai-vilagos-sor-2l',
    1,
    1
),
-- Völgyes félédes rozé
(
    'Völgyes félédes rozé bor', 
    'Gyümölcsös ízvilágú, kellemes savtartalmú félédes rozé bor. Friss gyümölcsös illatok, eper és málna aromák jellemzik. Tökéletes választás desszertekhez vagy önmagában fogyasztva.', 
    1299, 
    NULL, 
    25, 
    3,
    '/kepek/Products/18+/volgyesfeledesrose.png',
    '0.75L',
    0,
    NULL,
    NULL,
    'volgyes-feledes-roze-bor',
    1,
    1
),
-- Völgyes félédes vörösbor
(
    'Völgyes félédes vörösbor', 
    'Bársonyos, testes vörösbor gazdag gyümölcsös ízekkel. Fekete bogyós gyümölcsök, cseresznye és szilvás jegyek fedezhetők fel benne. Kiváló választás vörös húsokhoz vagy sajttálhoz.', 
    1399, 
    1199, 
    20, 
    3,
    '/kepek/Products/18+/volgyesfeledesvorosbor.png',
    '0.75L',
    1,
    '2025-04-01',
    '2025-05-15',
    'volgyes-feledes-vorosbor',
    1,
    1
),
-- Völgyes száraz fehérbor
(
    'Völgyes száraz fehérbor', 
    'Friss, üde száraz fehérbor élénk savakkal és gyümölcsös jegyekkel. Citrusos, almás aromák jellemzik, hosszú lecsengéssel. Ideális választás halételekhez, fehér húsokhoz vagy salátákhoz.', 
    1299, 
    NULL, 
    15, 
    3,
    '/kepek/Products/18+/volgyesszarazfeherbor.png',
    '0.75L',
    0,
    NULL,
    NULL,
    'volgyes-szaraz-feherbor',
    1,
    1
);
