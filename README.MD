# Cassie's Classes

Sample website for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

## dotenv

To secure database credentials, this application uses the dotenv module to manage environment variables. Instead of hardcoding sensitive information like database passwords directly in the code, they are stored in a `.env` file that is kept private and never committed to the repository (under normal circumstances).


 The `.env` file contains database credentials:
   ```
  HEALTH_HOST='localhost'
  HEALTH_USER='health_app'
  HEALTH_PASSWORD='qwertyuiop'
  HEALTH_DATABASE='health'
  HEALTH_BASE_PATH='http://localhost:8000'
   ```
The `require('dotenv').config()` statement in index.js loads these variables from the `.env` file into `process.env`



## Sanitisation

I have applied sanitisation to all INSERTS into the database.
This includes:
First Name
Last Name
Email
Username
As well as the additions made when creating a new class


I have not included password as the input is hashed before INSERT so XSS is not possible.


## Validation

I have applied validation in the registeration page to ensure that the username, first name and last name was not empty. I also used it to ensure the email was input in the correct format and to ensure that users created a password longer than 8 characters.

