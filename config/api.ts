import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.6:9090';

const fetchData = async (endpoint) => {
    const jwtToken = await AsyncStorage.getItem('@token');
    console.log("JWT TOKEN: ", jwtToken);
    try{
        const response = await fetch(`${BASE_URL}${endpoint}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        });

        if(!response.ok){
            throw new Error("Data fetch response not ok");
        }

        const text = await response.text();
        console.log('Raw response:', text);
        return text ? JSON.parse(text) : null;

    } catch(err){
        console.error('Error fetching data: ', err);
        throw err;
    }

};

const postData = async (endpoint, body) => {
    const jwtToken = await AsyncStorage.getItem('@token');
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error('Data post request not ok.');
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;

    } catch (err) {
        console.error('Error posting data: ', err);
        throw err;
    }
};

const deleteData = async (endpoint: string) => {
    const jwtToken = await AsyncStorage.getItem('@token');
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Data delete request not ok.');
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;

    } catch (err) {
        console.error('Error deleting data: ', err);
        throw err;
    }
};

export default {
  fetchData,
  postData,
  deleteData,
};