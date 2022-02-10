import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Contact from 'App/Models/Contact'

export default class ContactSeeder extends BaseSeeder {
  public async run () {
    await Contact.createMany([
      {
        name: 'Winston Churchill',
        phone: '555-9352',
        deleted: false
      },
      {
        name: 'Slade Wilson',
        phone: '555-8151',
        deleted: false
      },
      {
        name: 'Sarah Libermahn',
        phone: '555-2802',
        deleted: false
      },
      {
        name: 'Angel Vivaldi',
        phone: '555-6594',
        deleted: false
      },
      {
        name: 'Scruge McDuck',
        phone: '555-8732',
        deleted: false
      }
    ])
  }
}
