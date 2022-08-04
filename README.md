# HVC Community Boards 

HVC Community Boards is a hub for the HVC community to connect and support each other. Connect with your classmates, your fellow cast members, and the whole HVC community! Find out when your friends will be at events like More Improv More Better! Support members of the community by visiting Marketplace Boards! NEVER MISS A CHANCE FOR MORE JOY & EASE!​
LET'S MAKE THE HAPPY VALLEY HAPPIER!

### 1. Working Prototype
You can access a working prototype of the React app here: https://we-friendly.vercel.app/ and Node app here: https://we-friendly.herokuapp.com/



### 2. User Stories
This app is for two types of users: community members and teachers.

##### Landing Page
* as a visitor,
* I want to read about the HVC Community Boards App,
* so I can decide if I want to sign up

##### Landing Page
* as a community member or teacher,
* I want to click a link to a signup form
* so I can sign up for the app

##### Landing Page
* as a registered user,
* I want to log into my account,
* so I can access the app

##### Signup Page
* as a community member or teacher
* I want to sign up for an account
* so I can join the HVC Community Boards app

##### Membership Pending Page
* as a prospective member
* I want to see a message that the status of my membership is pending
* so I know my signup form was submitted

##### Report a Problem Page
* as a community member or teacher
* I want to report issues to the site administrator
* so they can monitor and address any concerns with site performance or user conduct

##### Community Hub Page
* as a community member or teacher
* I want to view the Community Hub Board
* so I can connect with the general HVC community

##### Community Hub Page
* as a community member or teacher
* I want to post to the Community Hub Board
* so I can reach out to the general HVC community

##### Marketplace Page (Bulletin-Board and Directory)
* as a community member or teacher
* I want to view the HVC Marketplace Boards
* so I can look for businesses to support or items to buy

##### Marketplace Page (Bulletin-Board and Directory)
* as a community member or teacher
* I want to post to the HVC Marketplace Boards
* so I can share my business or items with other users

##### New Listing Page



### 3. Functionality (TO DO)
The app's functionality (v1.0) includes:
* All users can access a demo account to try the app.
* All users can create an account.
* All users can click on contact information links for the app creator.
* Logged-in users can search for reviews by business name, zipcode, state, category and/or identity group. 
* Logged-in users can search for businesses and services by name, zipcode, state and/or category.
* Logged-in users can read all reviews, write reviews, and edit and delete the reviews they have written.
* Logged-in users can view details about, save and add businesses/services, and edit details for businesses they have added.
* Logged-in users can navigate between the Landing, Reviews and Businesses pages, and their Saved page - using top navigation.
* Logged-in users can log out to return to the Landing page.
* All users can use accessibility features such as text-to-speech and navigation via keyboard.



### 4. Technology
* Front-End: HTML5, CSS3, JavaScript ES6, Angular, Typescript
* Back-End: Node.js, Express.js, Mocha, Chai, RESTful API Endpoints, PostgreSQL
* Development Environment: Heroku, DBeaver



### 5. Wireframes (TODO)
Landing Page
:-------------------------:
![Landing Page](/github-images/wireframes/landing-page.jpeg)
Sign Up Page
![Sign Up Page](/github-images/wireframes/sign-up-page.jpg)
Log In Page
![Log In Page](/github-images/wireframes/log-in-page.jpeg)
Reviews Page
![Reviews Page](/github-images/wireframes/reviews.jpg)
Businesses Page
!["Businesses Page"](/github-images/wireframes/businesses.jpeg)
"me-friendly" Page 
![me-friendly Page](/github-images/wireframes/me-friendly.jpg)
Add Review
![Add Review](/github-images/wireframes/add-review.jpg)
Edit Review
![Edit Review](/github-images/wireframes/edit-review.jpg)
Add Business
![Add Business](/github-images/wireframes/add-business.jpeg)
Edit Business
![Edit Business](/github-images/wireframes/edit-business.jpeg)




### 6. Front-end Structure - Angular Components Map
* __index.html__
    * __app__
        * __landing__ 
            * __login__ (to be created)
            * __problem__
        * __report__
        * __signup__
            * __problem__
            * __pending__
        * __hub__
            * __hub-post__ (to be created)
            * __new-hub-post__ (to be created)
            * __problem__
        * __marketplace__ (to be created)
            * __bulletin-board__
                * __bulletin__ (to be created)
                * __new-bulletin__ (to be created)
            * __directory__
                * __listing__ (to be created)
                * __new-listing__
            * __problem__


### 7. Back-end Structure - Business Objects (TODO)
* Users (database table)
    * id (auto-generated)
    * username (at least 3 characters, validated for uniqueness)
    * password (at least 8 chars, at least one alpha and one number validation)
    * name (full name, at least 3 chars)
* Businesses (database table)
    * id (auto-generated)
    * user_id (foreign key to users table)
    * adder_id (foreign key to users table)
    * category (from enum business_type type)
    * name (at least 3 characters)
    * address (VARCHAR(255)),
    * city (VARCHAR(255) NOT NULL)
    * state (from enum state_district_territory type NOT NULL)
    * zipcode (5 characters)
    * website (VARCHAR(255), validated for url)
* Reviews (database table)
    * id (auto-generated)
    * reviewer_id (foreign key to users table)
    * business_id (foreign key to businesses table)
    * date_modified (TIMESTAMPTZ NOT NULL DEFAULT now)
    * friendly_for (from enum identity_group type)
    * rating (1-5, NOT NULL)
    * review (VARCHAR(255) NOT NULL)


    



### 8. API Documentation (TODO)
#### API Overview 
```text
    /api
    .
    ├── /auth
    │   └── POST
    │       ├── /login
    ├── /users
    │   └── POST
    │       └── /
    ├── /businesses
    |   └── GET
    |       ├── /
    |       ├── /:business_id
    |       ├── /added-by-me/:adder_id
    |   └── POST
    |       ├── /
    |   └── PATCH
    |       └── /:business_id
    ├── /reviews
    |   └── GET
    |       ├── /
    |       ├── /:review_id
    |       ├── /written-by-me/:reviewer_id
    |   └── POST
    |       ├── /
    |   └── DELETE
    |       ├── /:review_id
    |   └── PATCH
    |       └── /:review_id
    
```

##### POST `/api/auth/login`
```js
    // req.body
    {
        "name": "Cowardly Lion",
        "password": "Friendly1",
        "username": "KingOfTheForest"
    }

    // res.body
    {
        "authToken": String,
        "userId": 1
    }
```

##### POST `/api/users`
```js
    // req.body
    {
        "name": "Cowardly Lion",
        "password": "Friendly1",
        "username": "KingOfTheForest"
    }

    // res.body
    {
        "name": "Cowardly Lion",
        "password": "Friendly1",
        "username": "KingOfTheForest"
    }
```

##### GET `/api/businesses`
```js

    // res.body
    [
        {
            "id": 8,
            "adder_id": 1,
            "category": "restaurant/bar",
            "name": "Woodstar Cafe",
            "address": "60 Masonic Street",
            "city": "Northampton",
            "state": "MA",
            "zipcode": "01060",
            "website": "woodstarcafe.com"
        },
        {
            "id": 9,
            "adder_id": 2,
            "category": "shopping",
            "name": "Cedar Chest",
            "address": "150 Main Street",
            "city": "Northampton",
            "state": "MA",
            "zipcode": "01060",
            "website": "explorecedarchest.com"
        },
        {
            "id": 10,
            "adder_id": 3,
            "category": "hotel/accommodations",
            "name": "The Colonel Williams Inn",
            "address": "111 Staver Road",
            "city": "Brattleboro",
            "state": "VT",
            "zipcode": "05344",
            "website": "thecolonelwilliamsinn.com"
        },
        {
            "id": 11,
            "adder_id": 1,
            "category": "service",
            "name": "Home Environmental Services",
            "address": "4 School Street",
            "city": "Westfield",
            "state": "MA",
            "zipcode": "01085",
            "website": "homeenvironmentalservices.com"
        },
        {
            "id": 12,
            "adder_id": 2,
            "category": "housing/realty",
            "name": "Mill Valley Estates",
            "address": "420 Riverglade Drive",
            "city": "Amherst",
            "state": "MA",
            "zipcode": "01002",
            "website": "millvalleyapts.com"
        },
        {
            "id": 14,
            "adder_id": 1,
            "category": "healthcare",
            "name": "Carroll McGrath APRN",
            "address": "234 Russell Street, Suite 203",
            "city": "Hadley",
            "state": "MA",
            "zipcode": "01035",
            "website": "www.psychologytoday.com/us/psychiatrists/carroll-mcgrath-aprn-hadley-ma/174408"
        },
        {
            "id": 16,
            "adder_id": 1,
            "category": "restaurant/bar",
            "name": "Thai Garden",
            "address": "2 Bridge Street",
            "city": "Northampton",
            "state": "MA",
            "zipcode": "01060",
            "website": "thaigardennorthampton.com"
        },
        {
            "id": 15,
            "adder_id": 1,
            "category": "restaurant/bar",
            "name": "Thai Garden",
            "address": "2 Bridge St",
            "city": "Northampton",
            "state": "MA",
            "zipcode": "01060",
            "website": "thaigardennorthampton.com"
        }
    ]
```

##### GET `/api/businesses/:business_id`
```js
    // req.query
        `/14`

    // res.body
    {
        "id": 14,
        "adder_id": 1,
        "category": "healthcare",
        "name": "Carroll McGrath APRN",
        "address": "234 Russell Street, Suite 203",
        "city": "Hadley",
        "state": "MA",
        "zipcode": "01035",
        "website": "www.psychologytoday.com/us/psychiatrists/carroll-mcgrath-aprn-hadley-ma/174408"
    }
```

##### GET `/api/businesses/added-by-me/:adder_id`
```js
    // req.query
        `/2`

    // res.body
    [
        {
            "id": 9,
            "adder_id": 2,
            "category": "shopping",
            "name": "Cedar Chest",
            "address": "150 Main Street",
            "city": "Northampton",
            "state": "MA",
            "zipcode": "01060",
            "website": "explorecedarchest.com"
        },
        {
            "id": 12,
            "adder_id": 2,
            "category": "housing/realty",
            "name": "Mill Valley Estates",
            "address": "420 Riverglade Drive",
            "city": "Amherst",
            "state": "MA",
            "zipcode": "01002",
            "website": "millvalleyapts.com"
        }
    ]
```

##### POST `/api/businesses/`
```js
    // req.body
    {
        "adder_id": 3,
        "category": "restaurant/bar",
        "name": "Whetstone Station",
        "address": "36 Bridge St",
        "city": "Brattleboro",
        "state": "VT",
        "zipcode": "05301",
        "website": "whetstonestation.com"
    }

    // res.body
    {
        "id": 17,
        "adder_id": 3,
        "category": "restaurant/bar",
        "name": "Whetstone Station",
        "address": "36 Bridge St",
        "city": "Brattleboro",
        "state": "VT",
        "zipcode": "05301",
        "website": "whetstonestation.com"
    }
```

##### PATCH `/api/businesses/:business_id`
```js
    // req.body
    {
        "adder_id": 3,
        "category": "restaurant/bar",
        "name": "Whetstone Station",
        "address": "36 Bridge Street",
        "city": "Brattleboro",
        "state": "VT",
        "zipcode": "05301",
        "website": "whetstonestation.com"
    }

    // res.body

```

##### GET `/api/reviews`
```js
    // req.query
        
    // res.body
    [
        {
            "id": 1,
            "reviewer_id": 1,
            "business_id": 8,
            "date_modified": "2021-09-30T04:00:00.000Z",
            "friendly_for": "LGBTQIA+",
            "rating": 5,
            "review": "Very queer friendly! And great coffee too"
        },
        {
            "id": 2,
            "reviewer_id": 2,
            "business_id": 8,
            "date_modified": "2021-09-30T04:00:00.000Z",
            "friendly_for": "LGBTQIA+",
            "rating": 5,
            "review": "I felt totally welcomed. Northampton rocks!"
        },
        {
            "id": 3,
            "reviewer_id": 3,
            "business_id": 9,
            "date_modified": "2021-09-30T04:00:00.000Z",
            "friendly_for": "Disabled persons",
            "rating": 3,
            "review": "I had to go out into Thornes to take the elevator to the second floor, and some of the displays were close together, but the staff were helpful!"
        },
        {
            "id": 5,
            "reviewer_id": 2,
            "business_id": 9,
            "date_modified": "2021-10-30T04:00:00.000Z",
            "friendly_for": "Women",
            "rating": 5,
            "review": "Fun store! I mostly only saw women in there!"
        }
    ]
```

##### GET `/api/reviews/:review_id`
```js
    // req.query
        `/2`
    // res.body
    {
        "id": 2,
        "reviewer_id": 2,
        "business_id": 8,
        "date_modified": "2021-09-30T04:00:00.000Z",
        "friendly_for": "LGBTQIA+",
        "rating": 5,
        "review": "I felt totally welcomed. Northampton rocks!"
    }
```

##### GET `/api/reviews/written-by-me/:reviewer_id`
```js
    // req.query
        `/3`
    // res.body
    [
        {
            "id": 3,
            "reviewer_id": 3,
            "business_id": 9,
            "date_modified": "2021-09-30T04:00:00.000Z",
            "friendly_for": "Disabled persons",
            "rating": 3,
            "review": "I had to go out into Thornes to take the elevator to the second floor, and some of the displays were close together, but the staff were helpful!"
        }
    ]
```

##### POST `/api/reviews/`
```js
    // req.body
    {
        "reviewer_id": 2,
        "business_id": 17,
        "date_modified": "2021-09-30T04:00:00.000Z",
        "friendly_for": "LGBTQIA+",
        "rating": 5,
        "review": "Beautiful looking over the river. I snuggled up with my partner and the server commented on how cute we looked."
    }

    // res.body
    {
        "id": 6,
        "reviewer_id": 2,
        "business_id": 17,
        "date_modified": "2021-09-30T04:00:00.000Z",
        "friendly_for": "LGBTQIA+",
        "rating": 5,
        "review": "Beautiful looking over the river. I snuggled up with my partner and the server commented on how cute we looked."
    }
```

##### DELETE `/api/reviews/:review_id`
```js
    // req.query
    `/4`

    // res.body
    
```

##### PATCH `/api/reviews/:review_id`
```js
    // req.body
    {
        "reviewer_id": 2,
        "business_id": 9,
        "date_modified": "2021-10-30T04:00:00.000Z",
        "friendly_for": "Women",
        "rating": 5,
        "review": "Great place to buy gifts! I mostly only saw women in there!"
    }
    // res.body
    {
        "id": 5,
        "reviewer_id": 2,
        "business_id": 9,
        "date_modified": "2021-10-30T04:00:00.000Z",
        "friendly_for": "Women",
        "rating": 5,
        "review": "Great place to buy gifts! I mostly only saw women in there!"
    }

```






### 9. Screenshots (TODO)
Landing Page
:-------------------------:
![Landing Page](/github-images/screenshots/landing-page.png)
Sign Up Page
![Sign Up Page](/github-images/screenshots/sign-up-page.png)
Log In Page
![Log In Page](/github-images/screenshots/log-in-page.png)
Reviews
!["Reviews Page"](/github-images/screenshots/reviews.png)
Businesses
!["Businesses Page"](/github-images/screenshots/businesses.png)
"me-friendly"
!["me-friendly"](/github-images/screenshots/me-friendly.png)
Add Business
![Add Business](/github-images/screenshots/add-business.png)
Add Review
![Add Review](/github-images/screenshots/add-review.png)
Edit Business
![Edit Business](/github-images/screenshots/edit-business.png)
Edit Review
![Edit Review](/github-images/screenshots/edit-review.png)




### 10. Development Roadmap
This is v1.0 of the app, but future enhancements are expected to include the following user stories:
* as a teacher
* I want to delete any post or comment that does not adhere to community norms
* so everyone feels safe

* as a community member or teacher
* I want to view other users' profiles
* so I can find out more about them

* as a community member or teacher
* I want to edit or delete my own posts
* so I can fix, update, or remove them

* as a community member or teacher
* I want to comment on other users' posts
* so I can have conversations with other users

* as a community member or teacher
* I want to send private messages to other users
* so I can connect privately about posts I see on various Boards

* as a community member or teacher
* I want to view and respond to my private messages
* so I can connect privately with other users

* as a community member
* I want to join Boards for classes and casts
* so I can connect about topics related to those specific groups

* as a community member or teacher
* I want to view, post and comment on Boards for classes and casts
* so I can converse with my class/castmates

* as a teacher
* I want to invite members to join classes and casts I run
* so I can get all my students connected to group Boards

* as a teacher
* I want to set up a profile for my class or cast
* so members feel welcome, and because it's fun!

* as a teacher
* I want to approve or reject user requests to join my class or cast
* so that users are only joining their relevant groups

* as a community member
* I want to create a simple profile
* so other users know who I am


### 11. How to run it 
Use command line to navigate into the project folder and run the following in terminal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

#### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

#### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

#### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

#### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

#### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


##### Local Node scripts 
* To install the node project ===> npm install
* To migrate the database ===> npm run migrate -- 1
* To run Node server (on port 8000) ===> npm run dev
* To run tests ===> npm run test

