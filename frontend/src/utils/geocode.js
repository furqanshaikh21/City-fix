// import axios from '../utils/axios'; // <--- Change this to use your custom instance

// const OPENCAGE_API_KEY = 'c5ad451038034d6ab7d4e074857629bb';

// export const reverseGeocode = async (lat, lng) => {
//   try {
//     const res = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
//       params: {
//         q: `${lat},${lng}`,
//         key: OPENCAGE_API_KEY,
//         no_annotations: 1,
//       }
//     });
//     const results = res.data.results;
//     if (results.length > 0) {
//       return results[0].formatted; // You can also extract city/state if you want
//     }
//     return 'Unknown Location';
//   } catch (error) {
//     console.error('Reverse Geocoding Error:', error);
//     return 'Unknown Location';
//   }
// };

import axios from 'axios';

// Replace with your actual LocationIQ API key from your dashboard
const LOCATIONIQ_API_KEY = 'pk.2b30319e87d86eba717801639c93cdc6';

export const reverseGeocode = async (latitude, longitude) => {
    try {
        const response = await axios.get(
            // This is the correct URL structure
            `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
        );

        if (response.data && response.data.display_name) {
            return response.data.display_name; // This will be the full address string
        } else {
            return 'Address not found';
        }
    } catch (error) {
        console.error('Reverse Geocoding Error:', error);
        // LocationIQ might return specific status codes for limits or invalid keys
        if (error.response) {
            console.error('LocationIQ API Error Response:', error.response.data);
            console.error('Status:', error.response.status);
        }
        return 'Failed to get address';
    }
};