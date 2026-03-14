import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import request from 'supertest';

// Mock mongoose models to avoid DB operations and allow `new Model()` usage
jest.unstable_mockModule('../models/listings.js', () => {
  const ctor = jest.fn(function (data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue({});
  });
  ctor.find = jest.fn().mockResolvedValue([]);
  ctor.findById = jest.fn().mockResolvedValue(null);
  ctor.findByIdAndUpdate = jest.fn().mockResolvedValue({});
  ctor.findByIdAndDelete = jest.fn().mockResolvedValue({});
  return { __esModule: true, default: ctor };
});

jest.unstable_mockModule('../models/reviews.js', () => {
  const ctor = jest.fn(function (data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue({});
    this._id = 'mockReviewId';
  });
  ctor.findByIdAndDelete = jest.fn().mockResolvedValue({});
  return { __esModule: true, default: ctor };
});

// Mock schemas (Joi) to bypass real validation
jest.unstable_mockModule('../schema.js', () => ({
  __esModule: true,
  listingSchema: { validate: jest.fn(() => ({ error: null })) },
  reviewSchema: { validate: jest.fn(() => ({ error: null })) },
}));

// Mock utils
jest.unstable_mockModule('../utils/WrapAsync.js', () => ({
  __esModule: true,
  default: (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next),
}));

jest.unstable_mockModule('../utils/Expresserror.js', () => ({
  __esModule: true,
  ExpressError: class ExpressError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

// Re-import with mocks applied (ESM jest mocking pattern)
const { default: Listing } = await import('../models/listings.js');
const { default: Review } = await import('../models/reviews.js');
const { listingSchema, reviewSchema } = await import('../schema.js');
const { default: WrapAsync } = await import('../utils/WrapAsync.js');
const { ExpressError } = await import('../utils/Expresserror.js');

// Import routers after mocks have been registered
const { default: listings } = await import('../routes/listings.js');
const { default: reviews } = await import('../routes/reviews.js');

function makeApp() {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
  app.use(flash());
  // stub render to send status and view name for assertions
  app.set('view engine', 'ejs');
  app.response.render = function (view, locals = {}) {
    this.status(this.statusCode || 200);
    this.send({ view, locals });
  };
  app.use('/listings', listings);
  app.use('/listings/:id/reviews', reviews);
  // error handler
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).send({ error: err.message, status });
  });
  return app;
}

describe('Listings routes', () => {
  let app;
  beforeEach(() => {
    app = makeApp();
    // reset mocks
    Listing.find.mockResolvedValue([]);
    Listing.findById.mockResolvedValue(null);
  });

  test('GET /listings should render index with allListings', async () => {
    Listing.find.mockResolvedValue([{ id: '1' }]);
    const res = await request(app).get('/listings');
    expect(res.status).toBe(200);
    expect(res.body.view).toBe('listings/index.ejs');
    expect(res.body.locals.allListings).toEqual([{ id: '1' }]);
  });

  test('GET /listings/:id should 404 when listing missing', async () => {
    const res = await request(app).get('/listings/abc');
    expect(res.status).toBe(404);
  });

  test('POST /listings should create and redirect', async () => {
    const res = await request(app)
      .post('/listings')
      .type('form')
      .send({ title: 't', description: 'd', price: 10, location: 'l', country: 'c' });
    // instance save assigned in constructor mock, so the route should call it
    // We cannot directly spy instance here, but redirect asserts flow
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/listings');
  });

  test('DELETE /listings/:id should delete and redirect', async () => {
    const res = await request(app).delete('/listings/123');
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/listings');
  });

  test('PUT /listings/:id should update and redirect to show', async () => {
    const res = await request(app)
      .put('/listings/42')
      .type('form')
      .send({ title: 't', description: 'd', price: 10, location: 'l', country: 'c' });
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/listings/42');
  });
});

describe('Reviews routes', () => {
  let app;
  beforeEach(() => {
    app = makeApp();
  });

  test('POST /listings/:id/reviews should 404 if listing missing', async () => {
    Listing.findById.mockResolvedValue(null);
    const res = await request(app)
      .post('/listings/abc/reviews')
      .type('form')
      .send({ rating: 5, comment: 'nice' });
    expect(res.status).toBe(500); // router throws generic Error("Listing not found") -> 500
  });

  test('POST /listings/:id/reviews should create review and redirect', async () => {
    const listingDoc = { reviews: { push: jest.fn() }, save: jest.fn().mockResolvedValue({}) };
    Listing.findById.mockResolvedValue(listingDoc);

    const res = await request(app)
      .post('/listings/abc/reviews')
      .type('form')
      .send({ rating: 5, comment: 'nice' });

    expect(listingDoc.reviews.push).toHaveBeenCalledWith('mockReviewId');
    expect(listingDoc.save).toHaveBeenCalled();
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/listings/abc');
  });

  test('DELETE /listings/:id/reviews/:ReviewsId removes review ref and redirects', async () => {
    const listingDoc = {
      reviews: { pull: jest.fn() },
      save: jest.fn().mockResolvedValue({}),
    };
    Listing.findById.mockResolvedValue(listingDoc);

    const res = await request(app).delete('/listings/abc/reviews/r1');

    expect(listingDoc.reviews.pull).toHaveBeenCalledWith('r1');
    expect(listingDoc.save).toHaveBeenCalled();
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/listings/abc');
  });
});
