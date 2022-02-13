import { useState, useEffect, useRef } from 'react';
import httpStatus from 'http-status';
import { getAllContacts, deleteContact, restoreContact, updateContact, createContact } from '../../services/contactService';
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
    Text,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useToast
} from "@chakra-ui/react";


const TABLE_MESSAGES = {
    filled: 'Click over a contact to select it',
    empty: 'No contacts to show'
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
    const toast = useToast()

    const [contacts, setContacts] = useState([])
    const [includeDeleted, setIncludeDeleted] = useState(false)

    const cancelDeleteRef = useRef()

    const handleGetContactsList = async (includeDeleted = false) => {
        const response = await getAllContacts(includeDeleted);

        if (response.status === httpStatus.OK) {
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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

    const handleCreateContact = () => {
        createContact(contact).then(response => {
            handleShowFeedbackMessage('Contact successfuly created', `Contact ${contact.name} has been created.`, 'success');
            handleGetContactsList()
            setContact(response.data)
        }).catch(error => {
            const { data: { message }, status } = error.response
            handleShowFeedbackMessage('Something went wrong', message, (status === httpStatus.UNPROCESSABLE_ENTITY ? 'warning' : 'error'))
        })
    }

    const handleDeleteContact = async () => {
        const response = await deleteContact(contact.contact_id)

        if (response.status === httpStatus.OK) {
            handleShowFeedbackMessage('Contact successfuly deleted', `Contact ${contact.name} has been deleted`, 'success')
            handleGetContactsList()
            resetStates()
        }
    }

    const handleRestoreContact = async () => {
        const response = await restoreContact(contact.contact_id)

        if (response.status === httpStatus.OK) {
            handleSelectContact(response.data)
            handleGetContactsList()
        }
    }

    const handleUpdateContact = async () => {
        try {    
            const response = await updateContact(contact.contact_id, contact)

            if (response.status === httpStatus.UNPROCESSABLE_ENTITY) {
                handleShowFeedbackMessage('Data Already Exists', `The phone ${contact.phone} already exists in the database`, 'warning');
                return
            }
            
            handleGetContactsList()
        } catch (error) {
            handleShowFeedbackMessage('An Error Occurred', error, 'error');
        }
    }

    const handleOpenDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    }

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    }

    const handleShowFeedbackMessage = (title, description, status) => toast({
        title,
        description,
        status,
        duration: 9000,
        isClosable: true
    });

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
                        onClick={currentOperation === OPERATIONS.create ? handleCreateContact : handleUpdateContact}
                    >
                        { BUTTON_LABELS[currentOperation] }
                    </Button>
                    <Button
                        colorScheme='red'
                        size='sm'
                        disabled={currentOperation === OPERATIONS.create || contact.deleted}
                        marginLeft='2'
                        onClick={handleOpenDeleteDialog}
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
                                <Td textDecoration={contact.deleted ? 'line-through' : 'none'}>{contact.name}</Td>
                                <Td textDecoration={contact.deleted ? 'line-through' : 'none'}>{contact.phone}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Container>
        <AlertDialog
            isOpen={isDeleteDialogOpen}
            leastDestructiveRef={cancelDeleteRef}
            onClose={handleCloseDeleteDialog}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete Contact
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want to delete the selected contact?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelDeleteRef}
                            onClick={handleCloseDeleteDialog}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme='red'
                            onClick={() => (handleDeleteContact() && handleCloseDeleteDialog())}
                            ml={3}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
        </>
    );
}

export default Home;