import axios from 'axios';

const serviceRequest = axios.create({
    baseURL: 'http://localhost:3333/api',
    timeout: 1000,
});

const CONTACTS_URL = '/contacts'

export const getAllContacts = async () => {
    const response = await serviceRequest.get(`${CONTACTS_URL}`)
    console.log('Contacts Got: ', response.data)
    return response
}