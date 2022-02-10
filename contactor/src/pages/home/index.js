import { useState, useEffect } from 'react';
import { getAllContacts } from '../../services/contactService';
import {
    Container,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Input,
    Flex
} from "@chakra-ui/react";

const Home = () => {
    const [contacts, setContacts] = useState([])

    const handleGetContactsList = async () => {
        const response = await getAllContacts();

        if (response.status === 200) {
            setContacts(response.data)
            setTableMessage('Click over a contact to select it')
        }
    }
    useEffect(() => {
        const fetchContacts = async () => {
            await handleGetContactsList();
        }
        
        fetchContacts()
    }, [])

    const [contact, setContact] = useState({ name: null, email: null })
    const [tableMessage, setTableMessage] = useState('No Contacts to Show')

    const handleChangeContactName = (event) => {
        setContact({
            name: event.target.value,
            ...contact
        })
    }

    const handleChangeContactEmail = (event) => {
        setContact({
            email: event.target.value,
            ...contact
        })
    }

    const handleSelectContact = (selectedContact) => {
        setContact(selectedContact)
    }

    return (
        <Container marginTop='32' maxW='xl' centerContent>
            <Box marginBottom='30'>
                <Flex>
                    <Input width='auto' placeholder='Contact Name' value={contact.name} onChange={handleChangeContactName} />
                    <Input width='auto' placeholder='Contact Email' value={contact.email} onChange={handleChangeContactEmail} />
                </Flex>
            </Box>
            <Box>
                <Table variant='striped' colorScheme='teal'>
                    <TableCaption>{tableMessage}</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Email</Th>
                        </Tr>
                    </Thead>
                    <Tbody cursor='pointer'>
                        { contacts.length && contacts.map(contact => (
                            <Tr onClick={() => handleSelectContact(contact)}>
                                <Td>{contact.name}</Td>
                                <Td>{contact.email}</Td>
                            </Tr>
                        )) }
                    </Tbody>
                </Table>
            </Box>
        </Container>
    );
}

export default Home;