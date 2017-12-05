# Back Ann

Backend of the chat platform in NodeJs. The app is deployed on Heroku.

## Development server

Run `node server.js` for a dev server. Navigate to `http://localhost:8080/` using postman for example to access the API (described below). Use `nodemon` instead of `node` if you want the app to automatically reload when any of the source files is changed.

## Folder architecture

- `database`: contains all the database configs (`/config`), models (`/models`), controllers (`/controllers`) and migrations schemas (`/migrations`). The ORM used is [sequelize](http://docs.sequelizejs.com/) and the DBMS is PostgreSQL on Heroku.

- `websocket`: contains all the events (`/events`) handled by the websocket server. It also contains the `sockets` object that stores all the running chat rooms with the connected clients.

- `routes`: contains all the functions executed for each route of the API (described below).

- `test`: contains all the testing files. `Mocha` and `Chai` are used for unit tests. To perform the tests run `npm test`. First a local PostgreSQL database has to be setup if you want all of the tests to succeed (see below).

## 1. Database

#### PostgreSQL

The DBMS used is PostgreSQL. First you need to install PostgreSQL on your computer to have the backend working properly locally. To connect manually to a local database run `sudo -u <username> psql <database>`. The `<database>` parameter is optional.

Useful commands:

- `\l`: list databases

- `\dt`: list tables

- `\q`: quit psql

If you connect by specifying a `<database>` name you can then write SQL queries in the console to retrieve data from the tables.

#### Sequelize

The ORM used is [sequelize](http://docs.sequelizejs.com/). It is helpful for database migration, seeding and requesting. Once PostgreSQL is setup on your computer, run `./prepare.sh`. It will create the database `jenyai` defined in `database/config/config.json` and the tables defined by the models in the `database/models/` folder. This script has to be run each time a schema in the database is created, modified or deleted.

Here are some useful commands used to generate new schemas (which also means create new tables) and populate them with data:

- `sequelize model:generate --name <model_name> --attributes <atttr1>:<type1>,<atttr2>:<type2>`: generates a new model with the associated migration. It automatically creates `id`, `createdAt` and `updatedAt` fields.

- `sequelize seed:generate --name <seed_name>`: generates a new seeder.

More information can be found on the [official website](http://docs.sequelizejs.com/).

#### Tables

Here are listed the name of the existing tables and their purpose:  

- `conversations`: stores all the conversations the students had with a teacher or the agent.

- `rooms`: stores all the available chat rooms a user can connect to.

- `waitinglist`: used to store the email of the people that subscibe from the landing page.

## 2. Websocket

The websocket folder is composed of the subfolders:

- `events`: contains the event handlers for the events triggered from the chat interface.

- `managers`: contains the utilities that are used to manage a room or a user.

- `middlewares`: contains the middlewares used to protect the event handlers. They act like a route guard.

#### Events

Here are listed all the events either received from the chat interface or emitted to it.

###### Received

---

- `init`: initializes a connection with a user.

> **token**: string - an encrypted string that contains information about the user. The token has to be valid otherwise the connection is refused (see `utils/tokenManager.js` for more information on the token format).

---

- `disconnect`: ends a connection with a user.

---

- `student-select` (teacher only): connects a teacher to a student.

> **id**: string - id of the student to connect to.

---

- `student-switch` (teacher only): switch the interlocutor of a student: either the teacher or the agent.

> **id**: string - id of the student to switch.

---

- `message`: transmits a message from a user to an other.

> **type**: string - type of the message (see `websocket/events/message` for more information on message types).

> **payload**: object - additional information required to process the message.

---

- `typing-on`: warn a user that h.is.er interlocutor is typing a message.

> **id**: string - id of the user to warn.

---

- `typing-off`: warn a user that h.is.er interlocutor is done typing a message.

> **id**: string - id of the user to warn.

---

###### Emitted

---

- `init`: initializes a connection.

> **id**: uuid - id of the user that established a connection.

---

- `student-connected` (teacher only): connects a teacher to a student.

> **student**: object - contains ↓↓↓

>> **id**: uuid - id of the student.

>> **name**: string - name of the student.

>> **discussWithAgent**: boolean - true if the student is discussing with the agent, false otherwise.

> **messages**: array - contains all the messages of the conversation.

---

- `student-updated` (teacher only): send the updated information about a student to h.is.er associated teacher.

> **id**: uuid - id of the student.

> **name**: string - name of the student.

> **discussWithAgent**: boolean - true if the student is discussing with the agent, false otherwise.

---

- `student-selected` (teacher only): emitted when a student is selected by a teacher.

> **id**: uuid - id of the selected student.

---

- `student-disconnected` (teacher only): warn a teacher that a student disconnected from the room.

> **student**: uuid - id of the student that disconnected.

---

- `message`: sends a message.

> **message**: object - message to send ↓↓↓

>> **emitter**: uuid - id of the emitter.

>> **emitterType**: string - either 'student' or 'teacher'.

>> **recipient**: uuid - id of the recipient.

>> **timestamp**: timestamp - date when the message was issued.

>> **message**: object - contains the message ↓↓↓

>>> **type**: string - type of the message ('text', 'video'...).

>>> **payload**: object - contains all the required data associated to the message type.

---

- `typing-off`: indicates that the emitter is done typing a message.

> **emitter**: uuid - id of the emitter that triggered the event.

---

- `typing-on`: indicates that the emitter is typing a message.

> **emitter**: uuid - id of the emitter that triggered the event.

---

## 3. Routes

Here are described the existing routes of the API. To test the routes locally, a tool such as Postman is required.

The routes deal with the management of:

- `conversations`

- `rooms`

#### Rooms

- `/classroom` (post): creates a new chat room.

> Required body params:

>> **id**: string (see config file for length) - id of the chat room

>> **password**: string (see config file for length) - password of the chat room


- `/classroom/:id` (get): check if a room exists for `id`.

> Required url params:

>> **id**: string - id to test

>> **password**: string (see config file for length) - id of the chat room


- `/classroom/:id` (post): check if a room exists for `id` and `password`.

> Required url params:

>> **id**: string - id to test

> Required body params:

>> **password**: string - password to test


- `/classroom/:id` (delete): delete the room `id`.

> Required url params:

>> **id**: string (see config file for length) - id of the room

## 4. Tests

Run the test with the command `npm test`. All tests files are stored in the `test` folder.

## Heroku apps

- staging: https://staging-jenyai.herokuapp.com

- production: https://prod-jenyai.herokuapp.com
