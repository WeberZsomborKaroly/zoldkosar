-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 02. 13:08
-- Kiszolgáló verziója: 10.4.6-MariaDB
-- PHP verzió: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `webshop_project`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `aruhaz_arak`
--

CREATE TABLE `aruhaz_arak` (
  `id` int(11) NOT NULL,
  `termek_id` int(11) NOT NULL,
  `aruhaz_nev` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ar` float NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jelszo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vezeteknev` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keresztnev` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefon` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szerepkor` enum('felhasznalo','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'felhasznalo',
  `szuletesi_datum` date DEFAULT NULL,
  `iranyitoszam` int(11) DEFAULT NULL,
  `telepules` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kozterulet` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hazszam` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `egyeb` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szamlazasi_nev` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szamlazasi_iranyitoszam` int(11) DEFAULT NULL,
  `szamlazasi_telepules` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szamlazasi_kozterulet` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szamlazasi_hazszam` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szamlazasi_egyeb` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adoszam` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szallitasi_nev` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szallitasi_iranyitoszam` int(11) DEFAULT NULL,
  `szallitasi_telepules` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szallitasi_kozterulet` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szallitasi_hazszam` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szallitasi_egyeb` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hirlevel` tinyint(1) DEFAULT 0,
  `email_megerositva` tinyint(1) DEFAULT 0,
  `megerosito_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token_lejar` datetime DEFAULT NULL,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp(),
  `utolso_belepes` timestamp NULL DEFAULT NULL,
  `aktiv` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`id`, `email`, `jelszo`, `vezeteknev`, `keresztnev`, `telefon`, `szerepkor`, `szuletesi_datum`, `iranyitoszam`, `telepules`, `kozterulet`, `hazszam`, `egyeb`, `szamlazasi_nev`, `szamlazasi_iranyitoszam`, `szamlazasi_telepules`, `szamlazasi_kozterulet`, `szamlazasi_hazszam`, `szamlazasi_egyeb`, `adoszam`, `szallitasi_nev`, `szallitasi_iranyitoszam`, `szallitasi_telepules`, `szallitasi_kozterulet`, `szallitasi_hazszam`, `szallitasi_egyeb`, `hirlevel`, `email_megerositva`, `megerosito_token`, `token_lejar`, `letrehozva`, `utolso_belepes`, `aktiv`) VALUES
(1, 'admin@webshop.hu', '$2b$10$8KzQ9.QQ9LWZ2GXzQ2ZUyOtU4JyNmUCFGBF1Ow.9s4p1qR5zF5Hl2', 'Admin', 'Admin', '+36201234567', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, NULL, '2025-03-25 10:08:37', NULL, 1),
(2, 'Zsombor545@outlook.com', '$2a$08$O1ACjhKZj7AYPnwL1Zvu2OR5VT7flx4UryvZGc.VaqubinREmb12m', 'weber', 'Zsombor', '06206258394', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-03-25 10:09:43', NULL, 1),
(3, 'Zsomborweber08@gmail.com', '$2a$08$A2ZPwFuMR9lUcDR7k5rMa.qWV9lY13PLYeXl10UV9vk0ujck/mThK', 'Weber', 'Zsombor', '1564', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-03-25 10:56:09', NULL, 1),
(4, 'kovacs.jozsef@premontrei-keszthely.hu', '$2a$08$FwtlU.d9ljmKW9/1RIQK1OarUVmQw/.HY/tLP0/sxHXH3TEe/LUQi', 'Kovacs ', 'Jozsef', '056465465', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-03-25 11:27:47', NULL, 1),
(5, 'jankadoczi@gmail.com', '$2a$08$pSeoheEtquD4AP91mf95JOYvE3UvewG/ws4sIkwNoN3jsXZWA19qW', 'Janka', 'Dóczi', '36702995027', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-03-25 11:47:27', NULL, 0),
(6, 'benjixry@gmail.com', '$2a$08$.JcyvcWV9nTQ034BfdRwieHwY2B6yxioIv6iF8/aEXxCt37yBqLrS', 'Kovács', 'Benedek', '+36201234567', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-03-26 08:41:26', NULL, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoriak`
--

CREATE TABLE `kategoriak` (
  `id` int(11) NOT NULL,
  `nev` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `szulo_kategoria` int(11) DEFAULT NULL,
  `hivatkozas` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tizennyolc_plusz` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `kategoriak`
--

INSERT INTO `kategoriak` (`id`, `nev`, `szulo_kategoria`, `hivatkozas`, `tizennyolc_plusz`) VALUES
(1, 'Háztartási', NULL, 'haztartasi', 0),
(2, 'Édességek', NULL, 'edessegek', 0),
(3, '18+', NULL, '18-plusz', 1),
(4, 'Étel', NULL, 'etelek', 0),
(5, 'Tejtermékek', NULL, NULL, 0),
(6, 'Pékáruk', NULL, NULL, 0),
(7, 'Zöldségek', NULL, NULL, 0),
(8, 'Gyümölcsök', NULL, NULL, 0),
(12, 'Non-food', NULL, 'Non-food', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kosar`
--

CREATE TABLE `kosar` (
  `id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `termek_id` int(11) NOT NULL,
  `mennyiseg` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `kosar`
--

INSERT INTO `kosar` (`id`, `felhasznalo_id`, `termek_id`, `mennyiseg`, `created_at`) VALUES
(56, 1, 50, 1, '2025-03-28 11:15:27'),
(57, 1, 9, 3, '2025-04-02 07:57:56'),
(58, 1, 10, 1, '2025-04-02 08:15:21');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kupons`
--

CREATE TABLE `kupons` (
  `id` int(11) NOT NULL,
  `kod` varchar(255) NOT NULL,
  `kedvezmeny_tipus` enum('szazalek','fix') NOT NULL COMMENT 'szazalek: százalékos kedvezmény, fix: fix összegű kedvezmény',
  `ertek` int(11) NOT NULL COMMENT 'Százalékos kedvezmény esetén 1-100 közötti érték, fix kedvezmény esetén forint',
  `minimum_osszeg` int(11) DEFAULT 0 COMMENT 'Minimális kosárérték, amihez a kupon használható',
  `felhasznalhato` int(11) DEFAULT NULL COMMENT 'Hányszor használható fel a kupon (null = korlátlan)',
  `felhasznalva` int(11) NOT NULL DEFAULT 0 COMMENT 'Hányszor használták már fel a kupont',
  `aktiv` tinyint(1) NOT NULL DEFAULT 1,
  `ervenyes_kezdete` datetime DEFAULT NULL,
  `ervenyes_vege` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `kupons`
--

INSERT INTO `kupons` (`id`, `kod`, `kedvezmeny_tipus`, `ertek`, `minimum_osszeg`, `felhasznalhato`, `felhasznalva`, `aktiv`, `ervenyes_kezdete`, `ervenyes_vege`) VALUES
(1, 'UJVASARLO', 'szazalek', 10, 5000, NULL, 0, 1, '2025-03-25 10:15:15', '2026-03-25 10:15:15'),
(2, 'NYAR2024', 'szazalek', 15, 10000, NULL, 0, 1, '2025-03-25 10:15:15', '2024-08-31 00:00:00'),
(3, 'FIX1000', 'fix', 1000, 5000, NULL, 0, 1, '2025-03-25 10:15:15', '2026-03-25 10:15:15'),
(4, 'FIX2000', 'fix', 2000, 10000, NULL, 0, 1, '2025-03-25 10:15:15', '2026-03-25 10:15:15'),
(5, 'TESZT20', 'szazalek', 20, 0, 10, 0, 1, '2025-03-25 10:15:15', '2026-03-25 10:15:15'),
(8, 'JOSKAKIRALY', 'fix', 8000, 10, NULL, 1, 1, '2025-03-25 10:35:19', '2025-03-29 00:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `receptek`
--

CREATE TABLE `receptek` (
  `id` int(11) NOT NULL,
  `nev` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kulcsszo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hozzavalok` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `leiras` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendelesek`
--

CREATE TABLE `rendelesek` (
  `id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `rendeles_szam` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `osszeg` int(11) NOT NULL,
  `statusz` enum('új','feldolgozás alatt','szállítás alatt','teljesítve','törölve') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'új',
  `szallitasi_cim` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `megjegyzes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp(),
  `modositva` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `rendelesek`
--

INSERT INTO `rendelesek` (`id`, `felhasznalo_id`, `rendeles_szam`, `osszeg`, `statusz`, `szallitasi_cim`, `megjegyzes`, `letrehozva`, `modositva`) VALUES
(1, 1, '', 13438, '', '{\"nev\":\" Zsombor Weber\",\"email\":\"Zsomborweber08@gmail.com\",\"telefon\":\"06306258394\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Gyenesdiás\",\"utca\":\"vörösmarty utca \",\"hazszam\":\"2\"},\"megjegyzes\":\"Email teszt\",\"szallitasiKoltseg\":0}', NULL, '2025-03-25 10:57:25', NULL),
(2, 1, '', 8949, '', '{\"nev\":\" sdf\",\"email\":\"Zsomborweber08@gmail.com\",\"telefon\":\"1648\",\"szallitasiCim\":{\"megye\":\"Vas\",\"iranyitoszam\":\"4657\",\"varos\":\"dsgsg\",\"utca\":\"sdgsdg\",\"hazszam\":\"sdsdg\"},\"megjegyzes\":\"teszt email 2\",\"szallitasiKoltseg\":500}', NULL, '2025-03-25 11:02:20', NULL),
(12, 1, '', 8449, '', '{\"nev\":\" Zsombor Weber\",\"email\":\"Zsomborweber08@gmail.com\",\"telefon\":\"7674665365\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"7675\",\"varos\":\"rdfdf\",\"utca\":\"sdgsdf\",\"hazszam\":\"sdgsd\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-25 11:23:37', NULL),
(13, 1, '', 8988, '', '{\"nev\":\" Weber Zsombor\",\"email\":\"Zsomborweber08@gmail.com\",\"telefon\":\"06306258394\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Gyenes\",\"utca\":\"Vörösmarty utca\",\"hazszam\":\"2\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-25 11:24:48', NULL),
(14, 1, '', 53449, '', '{\"nev\":\" KOKO\",\"email\":\"kovacs.jozsef@premontrei-keszthely.hu\",\"telefon\":\"0630204578\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"83620\",\"varos\":\"Taptaharkány\",\"utca\":\"asfas\",\"hazszam\":\"sgesd\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-25 11:28:51', NULL),
(16, 1, '', 22449, '', '{\"nev\":\" DSGSD\",\"email\":\"Zsomborweber08@gmail.com\",\"telefon\":\"dfdsg\",\"szallitasiCim\":{\"megye\":\"Baranya\",\"iranyitoszam\":\"dsgfsd\",\"varos\":\"sdggd\",\"utca\":\"sdggsdgds\",\"hazszam\":\"sdgsgdsdg\"},\"megjegyzes\":\"sgdsgdggsd\",\"szallitasiKoltseg\":0}', NULL, '2025-03-25 11:37:24', NULL),
(17, 1, '', 4990, '', '{\"nev\":\" weber zsombor\",\"email\":\"Zsomborweber08@gmail.com\",\"telefon\":\"06306258394\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Gyenesdiás\",\"utca\":\"Wörösmarty UTcs\",\"hazszam\":\"2\"},\"megjegyzes\":\"Anyád\",\"szallitasiKoltseg\":0}', NULL, '2025-03-25 11:41:18', NULL),
(18, 1, '', 4300, 'szállítás alatt', '{\"nev\":\" rsdtg\",\"email\":\"Zsomborweber08@gmail.com\",\"telefon\":\"dsdgsd\",\"szallitasiCim\":{\"megye\":\"Szabolcs-Szatmár-Bereg\",\"iranyitoszam\":\"dsgdsg\",\"varos\":\"gsddgsds\",\"utca\":\"gdsgsdg\",\"hazszam\":\"ddgssdg\"},\"megjegyzes\":\"gdgsgdgsd\",\"szallitasiKoltseg\":2500}', NULL, '2025-03-25 11:44:18', '2025-03-25 11:50:23'),
(19, 1, '', 123988, 'törölve', '{\"nev\":\" Janka Dóczi\",\"email\":\"jankadoczi@gmail.com\",\"telefon\":\"06702995027\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Szent jozsef utca\",\"hazszam\":\"28/a\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-25 11:48:52', '2025-03-25 11:50:22'),
(20, 1, '', 10000, '', '{\"nev\":\" CXBX\",\"email\":\"XCBXCB@GMAIL.COM\",\"telefon\":\"XCBXCB\",\"szallitasiCim\":{\"megye\":\"Szabolcs-Szatmár-Bereg\",\"iranyitoszam\":\"CXBXC\",\"varos\":\"XCBCXB\",\"utca\":\"CXBBCXCXB\",\"hazszam\":\"XCBCBXXCB\"},\"megjegyzes\":\"CXBXCCBXCB\",\"szallitasiKoltseg\":2500}', NULL, '2025-03-25 11:51:25', NULL),
(21, 1, '', 15000, '', '{\"nev\":\" gjfg\",\"email\":\"gfjfg@gmail.com\",\"telefon\":\"fgjj\",\"szallitasiCim\":{\"megye\":\"Tolna\",\"iranyitoszam\":\"fgd\",\"varos\":\"dfgfg\",\"utca\":\"ggg\",\"hazszam\":\"ghfgf\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-25 11:57:03', NULL),
(22, 1, '', 7500, '', '{\"nev\":\" vbnjm\",\"email\":\"hfjg@gmail.com\",\"telefon\":\"dfgdgd\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"787978\",\"varos\":\"dfgdfg\",\"utca\":\"dfgdffg\",\"hazszam\":\"47\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-25 12:00:29', NULL),
(23, 1, '', 7500, '', '{\"nev\":\" safasf\",\"email\":\"dsgssd@gmauil.com\",\"telefon\":\"dsgdsgd\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"sgdgdsdg\",\"varos\":\"sdgsdgsdg\",\"utca\":\"sdsdgsdg\",\"hazszam\":\"sdgsdgsdg\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-25 12:01:01', NULL),
(24, 1, '', 2050, '', '{\"nev\":\" dsgs\",\"email\":\"Zsomborweber08@gmail.com\",\"telefon\":\"78674\",\"szallitasiCim\":{\"megye\":\"Bács-Kiskun\",\"iranyitoszam\":\"786\",\"varos\":\"786786\",\"utca\":\"786786\",\"hazszam\":\"87687\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":1500}', NULL, '2025-03-25 12:46:42', NULL),
(25, 1, '', 2350, '', '{\"nev\":\" Kovács Benedek\",\"email\":\"admin@webshop.hu\",\"telefon\":\"06201111111\",\"szallitasiCim\":{\"megye\":\"Vas\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"wfasz\",\"szallitasiKoltseg\":500}', NULL, '2025-03-26 10:35:06', NULL),
(26, 1, '', 2350, '', '{\"nev\":\" Kovács Benedek\",\"email\":\"admin@webshop.hu\",\"telefon\":\"06201111111\",\"szallitasiCim\":{\"megye\":\"Vas\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"wfasz\",\"szallitasiKoltseg\":500}', NULL, '2025-03-26 10:35:07', NULL),
(27, 1, '', 2350, '', '{\"nev\":\" Kovács Benedek\",\"email\":\"admin@webshop.hu\",\"telefon\":\"06201111111\",\"szallitasiCim\":{\"megye\":\"Vas\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"wfasz\",\"szallitasiKoltseg\":500}', NULL, '2025-03-26 10:35:08', NULL),
(28, 1, '', 2350, '', '{\"nev\":\" Kovács Benedek\",\"email\":\"admin@webshop.hu\",\"telefon\":\"06201111111\",\"szallitasiCim\":{\"megye\":\"Vas\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"wfasz\",\"szallitasiKoltseg\":500}', NULL, '2025-03-26 10:35:08', NULL),
(29, 1, '', 1650, '', '{\"nev\":\" Kovács Benedek\",\"email\":\"benjixry@gmail.com\",\"telefon\":\"06303528689\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-26 11:03:13', NULL),
(30, 1, '', 499, '', '{\"nev\":\" Kovács Benedek\",\"email\":\"benjixry@gmail.com\",\"telefon\":\"06305296059\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-26 11:05:57', NULL),
(31, 1, '', 1100, '', '{\"nev\":\" Kovács Benedek\",\"email\":\"benjixry@gmail.com\",\"telefon\":\"06708835521\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-26 11:09:46', NULL),
(32, 1, '', 1100, '', '{\"nev\":\" Kovács Benedek\",\"email\":\"benjixry@gmail.com\",\"telefon\":\"06305296059\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-26 11:12:46', NULL),
(33, 1, '', 1100, '', '{\"nev\":\" Kovács Benedek\",\"email\":\"benjixry@gmail.com\",\"telefon\":\"06305296059\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-26 11:16:02', NULL),
(34, 1, '', 300, '', '{\"nev\":\" Kovács Benedek\",\"email\":\"benjixry@gmail.com\",\"telefon\":\"06303528689\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-26 11:18:03', NULL),
(35, 1, '', 300, 'teljesítve', '{\"nev\":\" Kovács Benedek\",\"email\":\"benjixry@gmail.com\",\"telefon\":\"06303528689\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"\",\"szallitasiKoltseg\":0}', NULL, '2025-03-26 11:18:06', '2025-04-02 09:52:30'),
(36, 1, '', 300, 'teljesítve', '{\"nev\":\" Kovács Benedek\",\"email\":\"benjixry@gmail.com\",\"telefon\":\"06303528689\",\"szallitasiCim\":{\"megye\":\"Zala\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"\",\"fizetesiMod\":\"utanvet\",\"kartyaAdatok\":{\"kartyaSzam\":\"\",\"kartyaNev\":\"\",\"lejaratiDatum\":\"\",\"cvv\":\"\"},\"szallitasiKoltseg\":0}', NULL, '2025-03-28 09:22:09', '2025-04-02 09:50:43'),
(37, 1, '', 1549, 'szállítás alatt', '{\"nev\":\"Kovács Benedek\",\"email\":\"benjixry@gmail.com\",\"telefon\":\"+36201234567\",\"szallitasiCim\":{\"megye\":\"Veszprém\",\"iranyitoszam\":\"8360\",\"varos\":\"Keszthely\",\"utca\":\"Vásártér\",\"hazszam\":\"10.\"},\"megjegyzes\":\"\",\"fizetesiMod\":\"utanvet\",\"kartyaAdatok\":{\"kartyaSzam\":\"\",\"kartyaNev\":\"\",\"lejaratiDatum\":\"\",\"cvv\":\"\"},\"szallitasiKoltseg\":500}', NULL, '2025-03-28 10:33:06', '2025-03-28 11:12:08');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles_tetelek`
--

CREATE TABLE `rendeles_tetelek` (
  `id` int(11) NOT NULL,
  `rendeles_id` int(11) NOT NULL,
  `termek_id` int(11) NOT NULL,
  `mennyiseg` int(11) NOT NULL DEFAULT 1,
  `egysegar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `rendeles_tetelek`
--

INSERT INTO `rendeles_tetelek` (`id`, `rendeles_id`, `termek_id`, `mennyiseg`, `egysegar`) VALUES
(1, 1, 2, 3, 450),
(2, 1, 9, 2, 499),
(3, 1, 5, 2, 1500),
(4, 1, 7, 1, 590),
(5, 1, 4, 1, 7500),
(6, 2, 4, 1, 7500),
(7, 2, 2, 1, 450),
(8, 2, 9, 1, 499),
(36, 12, 9, 1, 499),
(37, 12, 4, 1, 7500),
(38, 12, 2, 1, 450),
(39, 13, 4, 1, 7500),
(40, 13, 6, 1, 399),
(41, 13, 7, 1, 590),
(42, 13, 9, 1, 499),
(43, 14, 2, 1, 450),
(44, 14, 9, 1, 499),
(45, 14, 4, 7, 7500),
(49, 16, 9, 1, 499),
(50, 16, 2, 1, 450),
(51, 16, 4, 5, 7500),
(52, 17, 9, 10, 499),
(53, 18, 2, 4, 450),
(54, 19, 2, 2, 450),
(55, 19, 9, 2, 499),
(56, 19, 7, 1, 590),
(57, 19, 4, 16, 7500),
(58, 19, 5, 1, 1500),
(59, 20, 4, 1, 7500),
(60, 21, 4, 2, 7500),
(61, 22, 4, 1, 7500),
(62, 23, 4, 1, 7500),
(63, 24, 19, 1, 550),
(64, 25, 19, 2, 550),
(65, 25, 10, 5, 150),
(66, 26, 10, 5, 150),
(67, 26, 19, 2, 550),
(68, 27, 10, 5, 150),
(69, 27, 19, 2, 550),
(70, 28, 10, 5, 150),
(71, 28, 19, 2, 550),
(72, 29, 19, 3, 550),
(73, 30, 9, 1, 499),
(74, 31, 19, 2, 550),
(75, 32, 19, 2, 550),
(76, 33, 19, 2, 550),
(77, 34, 10, 1, 150),
(78, 34, 10, 1, 150),
(79, 35, 10, 1, 150),
(80, 35, 10, 1, 150),
(81, 36, 10, 1, 150),
(82, 36, 10, 1, 150),
(83, 37, 9, 1, 499),
(84, 37, 19, 1, 550);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE `termekek` (
  `id` int(11) NOT NULL,
  `nev` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ar` int(11) NOT NULL,
  `egysegar` int(11) DEFAULT NULL,
  `kategoria_id` int(11) DEFAULT NULL,
  `leiras` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kiszereles` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keszlet` int(11) NOT NULL DEFAULT 0,
  `akcios` tinyint(1) DEFAULT 0,
  `akcios_ar` int(11) DEFAULT NULL,
  `akcio_kezdete` date DEFAULT NULL,
  `akcio_vege` date DEFAULT NULL,
  `hivatkozas` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ajanlott_termekek` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tizennyolc_plusz` tinyint(1) DEFAULT 0,
  `afa_kulcs` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meret` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `szin` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kep` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp(),
  `modositva` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `aktiv` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `termekek`
--

INSERT INTO `termekek` (`id`, `nev`, `ar`, `egysegar`, `kategoria_id`, `leiras`, `kiszereles`, `keszlet`, `akcios`, `akcios_ar`, `akcio_kezdete`, `akcio_vege`, `hivatkozas`, `ajanlott_termekek`, `tizennyolc_plusz`, `afa_kulcs`, `meret`, `szin`, `kep`, `letrehozva`, `modositva`, `aktiv`) VALUES
(1, 'Milka csoki', 1600, NULL, 2, 'Finom tejcsokoládé', NULL, 1500, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'kepek/milka.jpg', '2025-03-25 10:08:37', NULL, 1),
(2, 'Banán', 450, NULL, 8, 'Friss banán', NULL, 213, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'kepek/banan.jpg', '2025-03-25 10:08:37', '2025-03-26 09:15:07', 1),
(3, 'Serpenyő', 7500, NULL, 1, 'Kiváló minőségű serpenyő', NULL, 1000, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'kepek/serpenyo.jpg', '2025-03-25 10:08:37', NULL, 1),
(4, 'Chivas Regal', 7500, NULL, 3, 'Prémium whiskey', NULL, 398, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'kepek/chivas.jpg', '2025-03-25 10:08:37', '2025-03-25 12:01:01', 1),
(5, 'Csirkemell', 1500, NULL, 4, 'Friss csirkemell', NULL, 476, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'kepek/csirkemell.jpg', '2025-03-25 10:08:37', NULL, 1),
(6, 'Friss tej', 399, NULL, 5, 'Friss, pasztőrözött tehéntej', '1 liter', 50, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'https://via.placeholder.com/300x200?text=Friss+tej', '2025-03-25 10:08:38', NULL, 1),
(7, 'Félbarna kenyér', 590, NULL, 6, 'Frissen sütött félbarna kenyér', '750g', 30, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'https://via.placeholder.com/300x200?text=Félbarna+kenyér', '2025-03-25 10:08:38', NULL, 1),
(8, 'Paradicsom', 799, NULL, 7, 'Friss, magyar paradicsom', '1 kg', 40, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'https://via.placeholder.com/300x200?text=Paradicsom', '2025-03-25 10:08:38', NULL, 1),
(9, 'Alma', 499, NULL, 8, 'Hazai jonagold alma', '1 kg', 58, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'https://via.placeholder.com/300x200?text=Alma', '2025-03-25 10:08:38', '2025-03-28 10:33:06', 1),
(10, 'Ásványvíz 0.5l', 150, NULL, 1, 'Szénsavmentes ásványvíz', NULL, 177, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'asvany.jpg', '2025-03-25 12:09:08', '2025-03-28 09:22:09', 1),
(11, 'Ásványvíz 1.5l', 250, NULL, 1, 'Szénsavmentes ásványvíz', NULL, 150, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'asvany15.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(12, 'Coca-Cola 0.5l', 350, NULL, 1, 'Szénsavas üdítőital', NULL, 120, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'cola.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(13, 'Fanta 0.5l', 350, NULL, 1, 'Narancs ízű szénsavas üdítőital', NULL, 100, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'fanta.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(14, 'Sprite 0.5l', 350, NULL, 1, 'Citrom ízű szénsavas üdítőital', NULL, 90, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'sprite.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(15, 'Soproni sör 0.5l', 400, NULL, 1, 'Magyar világos sör', NULL, 80, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'soproni.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(16, 'Dreher sör 0.5l', 420, NULL, 1, 'Magyar világos sör', NULL, 75, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'dreher.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(17, 'Borsodi sör 0.5l', 390, NULL, 1, 'Magyar világos sör', NULL, 85, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'borsodi.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(18, 'Narancslé 1l', 600, NULL, 1, '100% gyümölcstartalmú narancslé', NULL, 50, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'narancle.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(19, 'Almalé 1l', 550, NULL, 1, '100% gyümölcstartalmú almalé', NULL, 41, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'almale.jpg', '2025-03-25 12:09:08', '2025-03-28 10:33:06', 1),
(20, 'Kenyér fehér', 450, NULL, 6, 'Friss fehér kenyér', NULL, 40, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'kenyer.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(21, 'Zsemle', 50, NULL, 6, 'Friss zsemle', NULL, 100, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'zsemle.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(22, 'Kifli', 50, NULL, 6, 'Friss kifli', NULL, 100, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'kifli.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(23, 'Kakaós csiga', 250, NULL, 6, 'Friss kakaós csiga', NULL, 30, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'kakaos.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(24, 'Túrós batyu', 280, NULL, 6, 'Friss túrós batyu', NULL, 25, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'turos.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(25, 'Pogácsa', 200, NULL, 6, 'Sajtos pogácsa', NULL, 40, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'pogacsa.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(26, 'Croissant', 300, NULL, 6, 'Vajas croissant', NULL, 35, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'croissant.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(27, 'Bagett', 350, NULL, 6, 'Francia bagett', NULL, 20, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'bagett.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(28, 'Rozskenyér', 500, NULL, 6, 'Teljes kiőrlésű rozskenyér', NULL, 15, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'rozs.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(29, 'Briós', 320, NULL, 6, 'Édes briós', NULL, 25, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'brios.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(30, 'Csirkemell filé 1kg', 1800, NULL, 4, 'Friss csirkemell filé', NULL, 30, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'csirkemell.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(31, 'Sertéskaraj 1kg', 2200, NULL, 4, 'Friss sertéskaraj', NULL, 25, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'karaj.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(32, 'Darált hús 500g', 1200, NULL, 4, 'Sertés darált hús', NULL, 20, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'daralt.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(33, 'Csirkecomb 1kg', 1500, NULL, 4, 'Friss csirkecomb', NULL, 35, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'csirkecomb.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(34, 'Sertésoldalas 1kg', 1900, NULL, 4, 'Friss sertésoldalas', NULL, 15, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'oldalas.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(35, 'Pulykamell 1kg', 2000, NULL, 4, 'Friss pulykamell', NULL, 20, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'pulyka.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(36, 'Marha hátszín 1kg', 5000, NULL, 4, 'Prémium marha hátszín', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'marha.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(37, 'Csirkeszárny 1kg', 1300, NULL, 4, 'Friss csirkeszárny', NULL, 40, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'szarny.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(38, 'Kolbász 200g', 900, NULL, 4, 'Házi kolbász', NULL, 30, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'kolbasz.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(39, 'Szalámi 100g', 800, NULL, 4, 'Téliszalámi', NULL, 25, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'szalami.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(40, 'Burgonya 1kg', 350, NULL, 7, 'Friss burgonya', NULL, 100, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'burgonya.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(41, 'Hagyma 1kg', 300, NULL, 7, 'Vöröshagyma', NULL, 80, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'hagyma.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(42, 'Répa 1kg', 400, NULL, 7, 'Friss sárgarépa', NULL, 70, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'repa.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(43, 'Uborka 1kg', 600, NULL, 7, 'Friss kígyóuborka', NULL, 50, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'uborka.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(44, 'Paprika 1kg', 800, NULL, 7, 'Friss kaliforniai paprika', NULL, 40, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'paprika.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(45, 'Cukkini 1kg', 700, NULL, 7, 'Friss cukkini', NULL, 30, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'cukkini.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(46, 'Padlizsán 1kg', 750, NULL, 7, 'Friss padlizsán', NULL, 25, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'padlizsan.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(47, 'Fokhagyma 100g', 300, NULL, 7, 'Friss fokhagyma', NULL, 60, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'fokhagyma.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(48, 'Saláta', 350, NULL, 7, 'Friss fejes saláta', NULL, 45, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'salata.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(49, 'Brokkoli 500g', 500, NULL, 7, 'Friss brokkoli', NULL, 35, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'brokkoli.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(50, 'Tej 1l', 350, NULL, 5, '2,8%-os tehéntej', NULL, 100, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'tej.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(51, 'Sajt 200g', 600, NULL, 5, 'Trappista sajt', NULL, 50, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'sajt.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(52, 'Túró 250g', 400, NULL, 5, 'Félzsíros túró', NULL, 40, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'turo.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(53, 'Tejföl 330g', 450, NULL, 5, '20%-os tejföl', NULL, 60, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'tejfol.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(54, 'Vaj 100g', 500, NULL, 5, '82%-os vaj', NULL, 45, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'vaj.jpg', '2025-03-25 12:09:08', '2025-03-26 09:15:07', 1),
(55, 'Joghurt 150g', 250, NULL, 5, 'Natúr joghurt', NULL, 70, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'joghurt.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(56, 'Kefir 175g', 220, NULL, 5, 'Élőflórás kefir', NULL, 55, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'kefir.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(57, 'Mozzarella 125g', 550, NULL, 5, 'Friss mozzarella sajt', NULL, 30, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'mozzarella.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(58, 'Mascarpone 250g', 700, NULL, 5, 'Krémes mascarpone', NULL, 25, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'mascarpone.jpg', '2025-03-25 12:09:08', '2025-03-25 12:09:08', 1),
(59, 'Parmezán 100g', 900, NULL, 5, 'Érlelt parmezán sajt', NULL, 20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kepek/parmezan.png', '2025-03-25 12:09:08', '2025-03-25 13:00:18', 1);

--
-- Eseményindítók `termekek`
--
DELIMITER $$
CREATE TRIGGER `termek_modositas_trigger` BEFORE UPDATE ON `termekek` FOR EACH ROW BEGIN
    SET NEW.modositva = CURRENT_TIMESTAMP;
END
$$
DELIMITER ;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `aruhaz_arak`
--
ALTER TABLE `aruhaz_arak`
  ADD PRIMARY KEY (`id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_felhasznalo_email` (`email`);

--
-- A tábla indexei `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD PRIMARY KEY (`id`),
  ADD KEY `szulo_kategoria` (`szulo_kategoria`);

--
-- A tábla indexei `kosar`
--
ALTER TABLE `kosar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `kupons`
--
ALTER TABLE `kupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kod` (`kod`);

--
-- A tábla indexei `receptek`
--
ALTER TABLE `receptek`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `rendelesek`
--
ALTER TABLE `rendelesek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `idx_rendeles_szam` (`rendeles_szam`);

--
-- A tábla indexei `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rendeles_id` (`rendeles_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `termekek`
--
ALTER TABLE `termekek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_termek_kategoria` (`kategoria_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `aruhaz_arak`
--
ALTER TABLE `aruhaz_arak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `kategoriak`
--
ALTER TABLE `kategoriak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `kosar`
--
ALTER TABLE `kosar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT a táblához `kupons`
--
ALTER TABLE `kupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `receptek`
--
ALTER TABLE `receptek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `rendelesek`
--
ALTER TABLE `rendelesek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT a táblához `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT a táblához `termekek`
--
ALTER TABLE `termekek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `aruhaz_arak`
--
ALTER TABLE `aruhaz_arak`
  ADD CONSTRAINT `aruhaz_arak_ibfk_1` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD CONSTRAINT `kategoriak_ibfk_1` FOREIGN KEY (`szulo_kategoria`) REFERENCES `kategoriak` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `kosar`
--
ALTER TABLE `kosar`
  ADD CONSTRAINT `kosar_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kosar_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `rendelesek`
--
ALTER TABLE `rendelesek`
  ADD CONSTRAINT `rendelesek_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  ADD CONSTRAINT `rendeles_tetelek_ibfk_1` FOREIGN KEY (`rendeles_id`) REFERENCES `rendelesek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rendeles_tetelek_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `termekek`
--
ALTER TABLE `termekek`
  ADD CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoriak` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
