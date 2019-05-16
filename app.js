let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

///////////////////GRAPHQL////////////////////////

//Graphql Dependencies
let express_graphql = require('express-graphql');
let { buildSchema } = require('graphql');


// GraphQL schema
let schema = buildSchema(`
    type Query {
        message: String
        course(id: Int!): Course
        courses(topic: String): [Course]
    },

    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`)

let coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

const getCourse = (args) => { 
    let id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

const getCourses = (args) => {
    if (args.topic) {
        let topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

// Root resolver
let root = {
    message: () => 'Hello World!',
    course: getCourse,
    courses: getCourses
}

///////////////END GRAPHQL////////////////////////
let indexRouter = require('./routes/index');

let app = express();//creates server

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

///////////////////GRAPHQL////////////////////////

// Create a GraphQL endpoint
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

///////////////END GRAPHQL////////////////////////

module.exports = app;


//////////////////////////////////////////////////

////VVV Query code for successfull requests VVV//
// query getSingleCourse($courseID: Int!) {
//     course(id: $courseID) {
//         title
//         author
//         description
//         topic
//         url
//   },
//   message
// }

////query variables 
//{"courseID":1}

////Query code 2
// query getCourseWithFragments($courseID1: Int!, $courseID2: Int!) {
//     course1: course(id: $courseID1) {
//            ...courseFields
//     },
//     course2: course(id: $courseID2) {
//           ...courseFields
//     } 
// }

// fragment courseFields on Course {
//     title
//     author
//     description
//     topic
//     url
// }

////query variables 2
//{"courseID1":1,"courseID2":2}

//////////////////////////////////////////////////


////Example fetch request for graphql for front end reference
// let courses = fetch(
//     "http://localhost:3000/graphql?", 
//     {
//         "credentials":"omit",
//         "headers":
//             {
//                 "accept":"application/json",
//                 "content-type":"application/json"
//             },
//         "referrer":"http://localhost:3000/",
//         "referrerPolicy":"origin",
//         "body":
//             "{\"query\":\"query getCourseWithFragments($courseID1: Int!, $courseID2: Int!) {\\n      course1: course(id: $courseID1) {\\n             ...courseFields\\n      },\\n      course2: course(id: $courseID2) {\\n            ...courseFields\\n      } \\n}\\n\\nfragment courseFields on Course {\\n  title\\n  author\\n  description\\n  topic\\n  url\\n}\\n\",\"variables\":{\"courseID1\":1,\"courseID2\":2},\"operationName\":\"getCourseWithFragments\"}",
//         "method":"POST",
//         "mode":"cors"
//     }
// ).then(res=>res.json())