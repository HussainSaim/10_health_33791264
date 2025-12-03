# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

## dotenv

To secure database credentials, this application uses the dotenv module to manage environment variables. Instead of hardcoding sensitive information like database passwords directly in the code, they are stored in a `.env` file that is kept private and never committed to the repository (under normal circumstances).


 The `.env` file contains database credentials:
   ```
   BB_USER='berties_books_app'
   BB_PASSWORD='qwertyuiop'
   BB_DATABASE='berties_books'
   ```
The `require('dotenv').config()` statement in index.js loads these variables from the `.env` file into `process.env`
 Database credentials are accessed via environment variables:
   - `process.env.BB_USER`
   - `process.env.BB_PASSWORD`
   - `process.env.BB_DATABASE`


## Sanitisation

I have applied sanitisation to all INSERTS into the database.
This includes:
First Name
Last Name
Email
Username
Book Name
Book Price

I have not included password as the input is hashed before INSERT so XSS is not possible.


## Validation

I have valiadted the values of the name (of the book) to make sure it is not empty. I have also validated the price by ensuring it is a float of at least 0.01.

## API 

The API consists of all the books in the database and allows it to be called upon. It can be sorted by name and price as well as the ability to search.