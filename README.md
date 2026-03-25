# StayConnect

StayConnect is a full-stack property listing platform inspired by Airbnb. Users can sign up, log in, create and manage listings, upload images, leave reviews, and save listings to a wishlist.

## Current Features

- User authentication with Passport (signup, login, logout)
- Listing CRUD (create, read, update, delete)
- Owner-based authorization for listing edit/delete
- Review create/delete with author-based authorization
- Cloudinary image upload for listings
- OpenCage geocoding to store listing coordinates
- Leaflet map on listing detail page
- Wishlist toggle and profile page
- Flash messages and form validation feedback

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS + ejs-mate
- Passport + passport-local + passport-local-mongoose
- Joi validation
- Multer + Cloudinary
- Bootstrap + custom CSS

## Project Structure

```text
StayConnect/
|- controllers/
|- models/
|- routes/
|- views/
|- public/
|- middleware.js
|- schema.js
|- cloudConfig.js
|- app.js
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Use these variables for the current codebase:

```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API=your_cloudinary_api_key
CLOUD_API_SECREAT=your_cloudinary_api_secret
OPENCAGE_KEY=your_opencage_api_key
SESSION_SECRET=your_session_secret
```

Notes:

- The app currently also accepts legacy session keys `MY_SECRET` and `MY_SECREAT` as fallback.
- MongoDB URL is currently hardcoded to:
  - `mongodb://127.0.0.1:27017/StayConnect`

### 3. Run MongoDB locally

Make sure your local MongoDB server is running on `127.0.0.1:27017`.

### 4. Start the app

```bash
npm test
```

Current `npm test` script starts the server (`node app.js`).

Open:

```text
http://localhost:3000
```

## Seed Sample Data (Optional)

```bash
node init/index.js
```

This clears existing listings and inserts sample listing data.

## Main Routes

### Listings

- `GET /listings` - all listings
- `GET /listings/new` - new listing form (auth required)
- `POST /listings` - create listing (auth required)
- `GET /listings/:id` - listing details
- `GET /listings/:id/edit` - edit listing form (owner only)
- `PUT /listings/:id` - update listing (owner only)
- `DELETE /listings/:id` - delete listing (owner only)

### Reviews

- `POST /listings/:id/reviews` - add review (auth required)
- `DELETE /listings/:id/reviews/:ReviewsId` - delete review (review author only)

### Users

- `GET /users/signup` - signup form
- `POST /users/signup` - create user
- `GET /users/login` - login form
- `POST /users/login` - login
- `GET /users/logout` - logout
- `GET /users/profile` - profile page (auth required)
- `POST /users/wishlist/:listingId` - toggle wishlist item (auth required)

## Validation and Authorization

- Joi schemas are defined in `schema.js`
- Access control middleware is in `middleware.js`
- Async error wrapper is in `utils/WrapAsync.js`

## Current Limitations

- Search fields in navbar are UI-ready but not fully wired to backend filtering yet.
- `npm test` currently runs the app instead of executing Jest tests.
- Mongo session store setup exists but is currently commented out in `app.js`.
- Booking flow is not implemented yet.

## License

ISC
