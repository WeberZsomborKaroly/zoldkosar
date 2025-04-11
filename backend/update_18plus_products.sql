-- Add missing product
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

-- Update image paths to ensure they're correct
UPDATE termekek 
SET kep = '/src/kepek/Products/18+/kobanyai0,5.png' 
WHERE nev = 'Kőbányai világos sör 0.5L' AND tizennyolc_plusz = 1;

UPDATE termekek 
SET kep = '/src/kepek/Products/18+/kobanyai2l.png' 
WHERE nev = 'Kőbányai világos sör 2L' AND tizennyolc_plusz = 1;

UPDATE termekek 
SET kep = '/src/kepek/Products/18+/volgyesfeledesrose.png' 
WHERE nev = 'Völgyes félédes rozé bor' AND tizennyolc_plusz = 1;

UPDATE termekek 
SET kep = '/src/kepek/Products/18+/volgyesfeledesvorosbor.png' 
WHERE nev = 'Völgyes félédes vörösbor' AND tizennyolc_plusz = 1;

UPDATE termekek 
SET kep = '/src/kepek/Products/18+/volgyesszarazfeherbor.png' 
WHERE nev = 'Völgyes száraz fehérbor' AND tizennyolc_plusz = 1;
