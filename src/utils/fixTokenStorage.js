// Ez a szkript ellenőrzi és javítja a token tárolását a localStorage-ban

// Ellenőrizzük, hogy van-e token a localStorage-ban
const checkAndFixToken = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log('Token ellenőrzése és javítása...');
  
  if (!token && userStr) {
    try {
      // Ha nincs token, de van user objektum, akkor próbáljuk meg kinyerni a tokent a user objektumból
      const user = JSON.parse(userStr);
      if (user && user.accessToken) {
        console.log('Token hiányzik, de megtalálható a user objektumban. Javítás...');
        localStorage.setItem('token', user.accessToken);
        console.log('Token sikeresen beállítva a localStorage-ban.');
        return true;
      } else {
        console.log('Nem található token a user objektumban sem.');
        return false;
      }
    } catch (error) {
      console.error('Hiba a user objektum feldolgozása során:', error);
      return false;
    }
  } else if (token) {
    console.log('Token megtalálható a localStorage-ban:', token.substring(0, 15) + '...');
    return true;
  } else {
    console.log('Nincs token és user objektum sem a localStorage-ban.');
    return false;
  }
};

// Futtatjuk az ellenőrzést és javítást
const result = checkAndFixToken();
console.log('Token ellenőrzés eredménye:', result ? 'Sikeres' : 'Sikertelen');

// Ha sikertelen volt a javítás, akkor értesítjük a felhasználót
if (!result) {
  alert('A munkamenet lejárt vagy érvénytelen. Kérjük, jelentkezzen be újra!');
  // Opcionálisan átirányíthatjuk a bejelentkezési oldalra
  // window.location.href = '/login';
}

export default checkAndFixToken;
