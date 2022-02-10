import { useState, useEffect } from 'react';
import { getAllContacts, deleteContact, restoreContact, updateContact } from '../../services/contactService';
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
    Flex,
    Button,
    Checkbox,
    Text
} from "@chakra-ui/react";


const TABLE_MESSAGES = {
    filled: 'Click over a contact to select it',
    empty: ''
}

const OPERATIONS = {
    create: 'create',
    update: 'update',
    delete: 'delete'
}

const BUTTON_LABELS = {
    create: 'Add Contact',
    update: 'Update Contact'
}

const CONTACT_ORIGINAL_STATUS = { name: null, phone: null, deleted: false }

const Home = () => {
    const [contacts, setContacts] = useState([])
    const [includeDeleted, setIncludeDeleted] = useState(false)

    const handleGetContactsList = async (includeDeleted = false) => {
        const response = await getAllContacts(includeDeleted);

        if (response.status === 200) {
            setContacts(response.data)
            setTableMessage(TABLE_MESSAGES.filled)
        }
    }

    useEffect(() => {
        const fetchContacts = async () => {
            await handleGetContactsList(includeDeleted);
        }
        
        fetchContacts()
    }, [includeDeleted])

    const [contact, setContact] = useState(CONTACT_ORIGINAL_STATUS)
    const [tableMessage, setTableMessage] = useState(TABLE_MESSAGES.empty)
    const [currentOperation, setCurrentOperation] = useState(OPERATIONS.create)

    const handleChangeContactName = (event) => {
        setContact({
            ...contact,
            name: event.target.value
        })
    }

    const handleChangeContactPhone = (event) => {
        setContact({
            ...contact,
            phone: event.target.value
        })
    }

    const handleSelectContact = (selectedContact) => {
        setContact(selectedContact)
        setCurrentOperation(OPERATIONS.update)
    }

    const resetStates = () => {
        setContact(CONTACT_ORIGINAL_STATUS)
        setCurrentOperation(OPERATIONS.create)
    }

    const handleDeleteContact = async () => {
        const response = await deleteContact(contact.contact_id)

        if (response.status === 200) {
            handleGetContactsList()
            resetStates()
        }
    }

    const handleRestoreContact = async () => {
        const response = await restoreContact(contact.contact_id)

        if (response.status === 200) {
            handleSelectContact(response.data)
            handleGetContactsList()
        }
    }

    const handleUpdateContact = async () => {
        const response = await updateContact(contact.contact_id, contact)

        if (response.status === 422) {
            console.log('DEU ERRO: ', response.data.message)
            return
        }
        
        handleGetContactsList()
    }

    return (
        <>
        <Box bgColor='teal.500' h='60px'>
            <Text fontSize='3xl' color='#fff'>
                Contactor - Contacts Manager
            </Text>
        </Box>
        <Container marginTop='20' maxW='xl' centerContent>
            <Box marginBottom='30' width='xl'>
                <Flex flexDirection='row' alignItems='center' alignContent='space-evenly'>
                    <Input placeholder='Contact Name' marginRight='30' value={contact.name} onChange={handleChangeContactName} />
                    <Input placeholder='Contact Phone' value={contact.phone} onChange={handleChangeContactPhone} />
                </Flex>
                <Flex marginTop='2' flexDirection='row' alignItems='center' alignContent='flex-start'>
                    <Button
                        colorScheme='blue'
                        size='sm'
                        disabled={currentOperation === OPERATIONS.delete || contact.name === null || contact.deleted}
                        onClick={currentOperation === OPERATIONS.create ? () => {} : handleUpdateContact}
                    >
                        { BUTTON_LABELS[currentOperation] }
                    </Button>
                    <Button
                        colorScheme='red'
                        size='sm'
                        disabled={currentOperation === OPERATIONS.create || contact.deleted}
                        marginLeft='2'
                        onClick={handleDeleteContact}
                    >
                        Delete Contact
                    </Button>
                    <Button
                        colorScheme='yellow'
                        size='sm'
                        display={contact.deleted ? 'block' : 'none'}
                        marginLeft='20'
                        onClick={handleRestoreContact}
                    >
                        Restore Contact
                    </Button>
                </Flex>
            </Box>
            <Box marginTop='30'>
                <Checkbox isChecked={includeDeleted} onChange={(e) => setIncludeDeleted(e.target.checked)}>
                    Include Deleted Contacts
                </Checkbox>
                <Table variant='simple' colorScheme='teal' width='xl'>
                    <TableCaption>{tableMessage}</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Phone</Th>
                        </Tr>
                    </Thead>
                    <Tbody cursor='pointer'>
                        { contacts.length && contacts.map((contact, ix) => (
                            <Tr key={ix} onClick={() => handleSelectContact(contact)} bgColor={contact.deleted ? 'red.300' : ''}>
                                <Td>{contact.name}</Td>
                                <Td>{contact.phone}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Container>
        </>
    );
}

export default Home;