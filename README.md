# JSON-SQL Interpreter

## Run SQL Queries on JSON Data

This project provides a simple and intuitive way to execute SQL queries directly against JSON data without requiring a database. It’s ideal for exploring, filtering, and analyzing JSON using familiar SQL syntax.

📍 Demo: https://jsonsql.netlify.app/

## Usage

```js
import queryJson from "json-sql-interpreter";

const query = "SELECT name, meta.city FROM users WHERE meta.age > 26";
const data = {
    users: [
        {
            id: 1,
            name: "Alice",
            meta: {
                age: 25,
                city: "Pune",
            },
        },
        {
            id: 2,
            name: "Bob",
            meta: {
                age: 30,
                city: "Mumbai",
            },
        },
        {
            id: 3,
            name: "Charlie",
            meta: {
                age: 35,
                city: "Pune",
            },
        },
    ],
};

const result = queryJson(data, query);
console.log(result);
```

```
Output:

JSON Query Tool Initialized...
[ { name: 'Bob', city: 'Mumbai' }, { name: 'Charlie', city: 'Pune' } ]
```
