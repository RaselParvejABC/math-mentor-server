# Math Mentor Server

## Live
> - https://math-mentor.vercel.app/

## Overview (Techs and Features)
> - MongoDB as Database
>   - Incorporates CRUD Operations
> - dotenv to load sensitive data from Environment Variable
> - cookie-parser middleware to facilitate cookie read/write
> - jsonwebtoken package to sign and verify JWT
>   - JWT saved as HTTP-Only Cookie at Client Storage
> - cors middleware to allow only two client deployed on Firebase Hosting, and localhost when in non-production mode
> - firebase-admin package to retrieve User Name and Photo by User `uid`
> - Routes
>   - /user/* for JWT Token Sign and Revoke, and providing his/her reviews with JWT claim
>   - /services/* for providing services and number of services in Database
>   - /service/* for inserting new service in database, getting a service document by service id, average rating of a service and all the reviews of a service.
>   - /review/* for C, R, U and D operations of/on a review.