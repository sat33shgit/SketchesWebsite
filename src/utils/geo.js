// Utility to get user's country name using ipapi.co
export async function getCountryName() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.country_name) {
        return data.country_name;
      }
    }
  } catch (err) {
    // Ignore errors, fallback to Unknown
  }
  return 'Unknown';
}
