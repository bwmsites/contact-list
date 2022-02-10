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

const Home = () => {
    const [contacts, setContacts] = useState([])
    const [includeDeleted, setIncludeDeleted] = useState(true)

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

    const [contact, setContact] = useState({ name: null, phone: null, deleted: false })
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
                    >
                        { BUTTON_LABELS[currentOperation] }
                    </Button>
                    <Button
                        colorScheme='red'
                        size='sm'
                        disabled={currentOperation === OPERATIONS.create || contact.deleted}
                        marginLeft='2'
                    >
                        Delete Contact
                    </Button>
                    <Button
                        colorScheme='yellow'
                        size='sm'
                        display={contact.deleted ? 'block' : 'none'}
                        marginLeft='20'
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