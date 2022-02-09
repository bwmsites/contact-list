import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Contact from 'App/Models/Contact'

export default class ContactSeeder extends BaseSeeder {
  public async run () {
    await Contact.createMany([
      {
        name: 'Winston Churchill',
        email: 'wchurchill@buckingham.en'
      },
      {
        name: 'Slade Wilson',
        email: 'slade.wilson@deathstroke.com'
      },
      {
        name: 'Sarah Libermahn',
        email: 'slibermahn@subtaken.org'
      },
      {
        name: 'Angel Vivaldi',
        email: 'vivaldi@theprovider.com'
      },
      {
        name: 'Scruge McDuck',
        email: 'scruge@unclemcduck.net'
      }
    ])
  }
}
