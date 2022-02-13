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

export const deleteContact = async (contactId) => {
    const response = await serviceRequest.delete(`${CONTACTS_URL}/${contactId}`)
    return response
}

export const restoreContact = async (contactId) => {
    const response = await serviceRequest.patch(`${CONTACTS_URL}/${contactId}/restore`)
    return response
}

export const updateContact = async (contactId, data) => {
    try {
        const response = await serviceRequest.patch(`${CONTACTS_URL}/${contactId}`, data)
        return response
    } catch (error) {
        return error
    }
}

export const createContact = async (data) => {
    return serviceRequest.post(CONTACTS_URL, data)
}