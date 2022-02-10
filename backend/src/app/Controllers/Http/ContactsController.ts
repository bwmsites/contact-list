/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Contact from 'App/Models/Contact'

export default class ContactsController {
	phoneExistsResponse = {
		message: 'The given phone number already exists in database',
		code: 'PHONE_ALREADY_EXISTIS',
	}

	public async getAllContacts({ request }: HttpContextContract) {
		const { includeDeleted } = request.qs()

		if (includeDeleted) {
			return await Contact.all()
		}

		return await Contact.query().select().where('deleted', false)
	}

	public async getContactById({ request }: HttpContextContract) {
		const contactId = Number(request.param('contactId'))

		return await Contact.find(contactId)
	}

	public async createContact({ request, response }: HttpContextContract) {
		const newContactSchema = schema.create({
			name: schema.string(),
			phone: schema.string(),
		})

		try {
			const { name, phone } = await request.validate({ schema: newContactSchema })

			// Despite the database already handles duplicates I decided to use this approach for
			// handling the response manually
			const contact = await Contact.findBy('phone', phone)

			if (contact) {
				return response.status(422).send(this.phoneExistsResponse)
			}

			const newContact = await Contact.create({ name, phone, deleted: false })
			return response.status(201).send(newContact)
		} catch (error) {
			response.badRequest(error.messages)
		}
	}

	public async updateContact({ request, response }: HttpContextContract) {
		const contactId = Number(request.param('contactId'))

		const updateContactSchema = schema.create({
			name: schema.string.optional(),
			phone: schema.string.optional(),
		})

		try {
			const { name, phone } = await request.validate({ schema: updateContactSchema })

			// Despite the database already handles duplicates I decided to use this approach for
			// handling the response manually and make it more friendly
			if (phone) {
				const existingContact = await Contact.findBy('phone', phone)

				if (existingContact && existingContact.contactId !== contactId) {
					return response.status(422).send(this.phoneExistsResponse)
				}
			}

			const contact = await Contact.findOrFail(contactId)
			contact.merge({ name, phone })
			await contact.save()

			return contact
		} catch (error) {
			response.badRequest(error.messages)
		}
	}

	public async deleteContact({ request }: HttpContextContract) {
		const contactId = Number(request.param('contactId'))

		const contact = await Contact.findOrFail(contactId)
		contact.deleted = true
		await contact.save()

		return { id: contactId }
	}

	public async restoreContact({ request }: HttpContextContract) {
		const contactId = Number(request.param('contactId'))

		const contact = await Contact.findOrFail(contactId)
		contact.deleted = false
		await contact.save()

		return contact
	}
}
