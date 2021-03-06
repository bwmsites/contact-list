/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'Welcome to contactor api v. 0.0.1' }
})

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'ContactsController.getAllContacts')
    Route.get('/:contactId', 'ContactsController.getContactById')
    Route.post('/', 'ContactsController.createContact')
    Route.patch('/:contactId', 'ContactsController.updateContact')
    Route.delete('/:contactId', 'ContactsController.deleteContact')
    Route.patch('/:contactId/restore', 'ContactsController.restoreContact')
  }).prefix('/contacts')
}).prefix('/api')
