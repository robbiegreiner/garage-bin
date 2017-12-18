exports.seed = function(knex, Promise) {

  return knex('items').del()
    .then(() => {
      return Promise.all([
        knex('items').insert([
          {
            id: 1,
            name: 'baseballs',
            reason: 'might play one day',
            cleanliness: 'Dusty'
          },
          {
            id: 2,
            name: '1972 Bike',
            reason: 'might ride one day',
            cleanliness: 'Sparkling'
          },
          {
            id: 3,
            name: '1988 Pontiac Fiero',
            reason: 'sentimental',
            cleanliness: 'Rancid'
          }
        ])
          .catch(error => console.log(`There was a data seeding error ${ error }`))
      ]);
    })
    .catch(error => console.log(`There was a data seeding error ${ error }`));
};
