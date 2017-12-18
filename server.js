const express = require('express');

const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');

const requireHTTPS = (request, response, next) => {
  if (request.header('x-forwarded-proto') !== 'https'){
    response.redirect(`https://${request.header('host')}${request.url}`);
  }
  next();
};

if (process.env.NODE_ENV === 'production') {
  app.use(requireHTTPS);
}

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then((items) => {
      response.status(200).json(items);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/items', (request, response) => {
  const item = request.body;

  for (let requiredParameter of ['name', 'reason', 'cleanliness']) {
    if (!item[requiredParameter]) {
      return response.status(422).send({ error: `You're missing a ${requiredParameter}.` });
    }
  }

  database('items').insert(item, '*')
    .then(item => {
      response.status(201).json(item);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.patch('/api/v1/items/:itemId', (request, response) => {
  const id = request.params.itemId;
  const cleanliness = request.body.cleanliness;
  database('items').where('id', id).update({cleanliness})
    .then( () => {
      response.status(204).send();
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`running on ${app.get('port')}.`);
});

module.exports = app;
