import Contact from 'App/Models/Contact'
import { expect, use } from 'chai'
import assertArrays from 'chai-arrays'
import test from 'japa'
import request from 'supertest'

use(assertArrays)

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/api`

test.group('Contacts Operations', () => {
	test('[POST]/api/contacts   ->   It should return a 400 (Bad Request / Invalid Params)', async () => {
		const params = {}

		const response = await request(BASE_URL).post('/contacts').send(params)
		const body = response.body

		expect(response.status).to.equal(400)
		expect(body).to.have.property('errors')
		expect(body.errors).to.be.array()
	})

	test('[POST]/api/contacts   ->   It should return a 201 (Created)', async () => {
		const contact1 = {
			name: 'John Doe',
			phone: '555-1000',
		}

		const contact2 = {
			name: 'Janne Doe',
			phone: '555-2000',
		}

		const responseContact1 = await request(BASE_URL).post('/contacts').send(contact1)
		const responseContact2 = await request(BASE_URL).post('/contacts').send(contact2)

		expect(responseContact1.status).to.equal(201)
		expect(responseContact2.status).to.equal(201)
	})

	test('[POST]/api/contacts   ->   It should return a 422 (Entity Already Exists)', async () => {
		const contact = {
			name: 'John Doe',
			phone: '555-1000',
		}

		const response = await request(BASE_URL).post('/contacts').send(contact)

		expect(response.status).to.equal(422)
	})

	test('[GET]/api/contacts   ->   It should a 200 (OK)', async () => {
		const response = await request(BASE_URL).post('/contacts')
		const body = response.body as Contact[]

		expect(response.status).to.equal(400)
		expect(body).to.be.not.empty
	})

	test('[PATCH]/api/contacts/:contactId   ->   It should return a 422 (Unprocessable Entity)', async () => {
		const contactId = 1
		const params = {
			phone: '555-2000',
		}

		const response = await request(BASE_URL).patch(`/contacts/${contactId}`).send(params)

		expect(response.status).to.equal(422)
	})

	test('[PATCH]/api/contacts/:contactId   ->   It should return a 200 (OK)', async () => {
		const contactId = 1
		const params = {
			phone: '555-1001',
		}

		const response = await request(BASE_URL).patch(`/contacts/${contactId}`).send(params)

		expect(response.status).to.equal(200)
	})
})
