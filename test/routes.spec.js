const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(err => {
        throw err;
      });
  });
  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
      });
  });
});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
    .then( () => done())
    .catch(error => {
      throw error;
    });
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

  describe('GET /api/v1/items', () => {
    it('should get items from database', (done) => {
      chai.request(server)
      .get('/api/v1/items')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(3);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('baseballs');
        done();
      })
      .catch(error => {
        throw error;
      });
    });

    it('should return a 404 for a route that does not exist', () => {
      return chai.request(server)
        .get('/api/v1/sad')
        .then(response => {
          response.should.have.status(404);
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('POST /api/v1/items', () => {
    it('should add a new item in the database', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'Golf Clubs',
          reason: 'Still belong to a country club',
          cleanliness: 'Sparkling'
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('id');
          response.body[0].id.should.be.a('number');
        })
        .catch(err => {
          throw err;
        });
    });

    it('should return a 404 for a route that does not exist', () => {
      return chai.request(server)
        .post('/api/v1/items/sad')
        .then(response => {
          response.should.have.status(404);
        })
        .catch(err => {
          throw err;
        });
    });

  });

  describe('PATCH /api/v1/items/:itemId', () => {
    it('should update an item in the database', () => {
      chai.request(server)
        .patch('/api/v1/items/1')
        .send({
          cleanliness: 'Rancid'
        })
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return status 422 if project does not exist', () => {
      chai.request(server)
        .patch('/api/v1/items/123')
        .send({
          cleanliness: 'Rancid'
        })
        .then(response => {
          response.should.have.status(422);
        })
        .catch(error => {
          throw error;
        });
    });

  });

});
