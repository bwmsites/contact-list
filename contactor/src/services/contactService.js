import axios from 'axios';

const serviceRequest = axios.create({
    baseURL: 'http://localhost:3333/api',
    timeout: 1000,
});

const CONTACTS_URL = '/contacts'

export const getAllContacts = async (includeDeleted) => {
    const response = await serviceRequest.get(`${CONTACTS_URL}${includeDeleted ? '?includeDeleted=true' : ''}`)
    return response
}