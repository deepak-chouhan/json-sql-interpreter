# JSON Query Tool Requirements

We will have a Live Demo Website.
It will use an importable Library API ex:
```
import { queryJson } from 'json-sql-interpreter';

const queryResult = queryJson(jsonDataSource, sqlQueryString);
```

## Supported Syntax

- **SELECT Clause:** The must accept a comma-separated list of fields name or wildcard (*)
- **Field Paths:** Fields can use dot notation for nested access (e.g., SELECT u.name, u.address.city)
- **Wildcard (*):** if * is used, all fields(including nested fields) from the selected source should be returned without modification
- **FROM Clause:** The tool must accept a data source within the input JSON structure that needs to be queried.
- **Nested Source Path:** it must support dot-notation to target the array(e.g. FROM data.users AS u).
- **Aliasing:** The AS u syntax must be supported, Currently only on source is planned. We will plan multiple sources for the future that might be required in joins (e.g. FROM data1.users as u1, data2.user2).
- **WHERE Clause:** The tool will accept record selection for filtering purposes.
- **Comparison Operators:** Basic comparisons (=, !=, >, <) must work correctly for numeric and string literals.
- **Logical Operators:** AND and OR must be supported to combine multiple conditions.
- **Precedence:** Parentheses () must correctly override the default operator precedence, ensuring complex logic is evaluated correctly (e.g. WHERE age > 23 AND (city = “Pune” OR city = “Mumbai”))

## Usability
- **User Flow:** A minimal UI must:
    - Allow the user to paste the block of JSON data.
    - Allow the user to upload the JSON file.
    - Allow the user type a SQL query string.
    - Allow the user to see resulting filtered and projected JSON output data in real-time or upon submission.
- **Error Reporting:** If the query string has a syntax error, the tool must throw an exception that specifies the line number and column/position where the parser failed.
- **Runtime Errors:** If the query attempts to access a data in the FROM, SELECT or WHERE clauses that does not exist in the JSON data, the tool must throw a helpful distinct error (e.g. PathNotFoundError: ‘user.address.city’ does not exist inside users).

