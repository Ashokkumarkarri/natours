# Handling Uncaught Exceptions in Node.js

All **errors** or **bugs** which occurs in **sync code** and which are not handled anywhere are called **uncaught Exceptions**.

```js
//Catching Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!🔥 Shutting down...');
  process.exit(1); //code 0:success, code 1:uncaught exception
});
```
