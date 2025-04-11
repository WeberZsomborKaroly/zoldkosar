
const checkAndFixToken = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log('Token ellenőrzése és javítása...');
  
  if (!token && userStr) {
    try {
     
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


const result = checkAndFixToken();
console.log('Token ellenőrzés eredménye:', result ? 'Sikeres' : 'Sikertelen');


if (!result) {
  alert('A munkamenet lejárt vagy érvénytelen. Kérjük, jelentkezzen be újra!');
 
}

export default checkAndFixToken;
