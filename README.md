## Phone Store using Vue JS

Simple Phone Buying store Using VueJS, firebase, NodeJS and MongoDB.

- #### Live Demo [here](https://vue-phone-store.herokuapp.com/).
  - Test User Credentials
    - Email: `nil@gmail.co`
    - Password: `123456`
  - Test Admin Credentials
    - Email: `admin@store.com`
    - Password: `123456`
- #### Github Repository [link](https://github.com/nil1729/vue-phone-store).

---

### Technology and Modules used for this Project

1. _`Node JS Express Framework`_ is used as a building Backend part of this Website.
2. _`firebase Firestore`_ is used to store information about Users.
3. _`MongoDB`_ is used to Store Products Details and URL of Photos.
4. _`firebase Storage`_ is used for store the Uploaded Files.
5. _`firebase Authentication`_ is used for for Authenticate a User. User can authenticate using _**Google Sign in**_ or _**Custom Email Password**_ Method.
6. _`Vue JS`_ is used as frontend Framework for building SPA.
7. _`Bootstrap`_ is used for building UI and this website is Responsive for Desktop Devices and Tabs only.
8. Site has _`Admin`_ functionality by which site owner can add Product to his Store.

---

## Run this Project on Local Environment.

1. **Prerequisites**
   - NodeJS installed on your Local machine
   - MongoDB installed on your local machine or have an Atlas Account.
   - A Gmail Account for Firebase Services.
2. **Credentials Setup**

   - Create a MongoDB Atlas Account for Host this Project Online. Find Tutorials [here](https://www.youtube.com/watch?v=KKyag6t98g8).
   - Setup a Firebase Project for using Firestore and Authentication. Find Tutorials [here](https://www.youtube.com/watch?v=6juww5Lmvgo).
   - Setup [Firestore](https://www.youtube.com/watch?v=UFLvSp4Mh9k&list=PL4cUxeGkcC9itfjle0ji1xOZ2cjRGY_WB&index=2) and [Enable Authenitaion Methods](https://www.youtube.com/watch?v=-OKrloDzGpU)
   - Generate Private keys for Firebase Admin. Find tutorials [here](https://youtu.be/WtYzHTXHBp0).

3. **Project Setup**

   - Clone this Repository or Download the zip File.
     ```
      >> git clone https://github.com/nil1729/vue-phone-store
     ```
   - Create a new file named `secret.json` on `config` directory which contains Generated Private keys on Firebase project.

     ```
         {
             "type": "service_account",
             "project_id": "",
             "private_key_id": "",
             "private_key": "",
             "client_email": "",
             "client_id": "",
             "auth_uri": "",
             "token_uri": "",
             "auth_provider_x509_cert_url": "",
             "client_x509_cert_url": ""
         }

     ```

   - Create another `cofig.js` file on `/client/src/firebase`. Put all firebase config Credentials for Frontend. (In following Format)

     ```
       const firebaseConfig = {
           apiKey: "",
           authDomain: "",
           databaseURL: "",
           projectId: "",
           storageBucket: "",
           messagingSenderId: "",
           appId: "",
           measurementId: ""
       };

       export default firebaseConfig;
     ```

   - Create a `.env` file on root directory. Which Contains MongoURI.
     ```
      DB_URI = <- Mongo Atlas URI ->
     ```
   - Run this command

     ```
      >> npm run dev  // to start Vue Development server and Backend server together.

      >> npm run server // to start only backend server

      >> npm run Client // to start Vue Development server only (But it will not working alone as api depends on Backend also)

     ```

4. **Admin Setup**
   - Run this Command on root directory
     ```
       >> npm run admin
     ```

---

### Website Preview

## <img src="./preview.png" alt="Nilanjan Deb">

---

#### TODO

1. Payment Method hasn't been implemented yet.

---

<p style="text-align: center;">Made With<span style="color: red;"> &#10084; </span>by <a href="https://github.com/nil1729" target="_blank"> Nilanjan Deb </a> </p>
