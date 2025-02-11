# Types of error:

### Operational Error:

The error that we can predict will happen in the future. Just examples only:

1. Invalid user inputs
2. Fail to run the server
3. Failed to connect database
4. Broken links

### Programmatical Error:

Developers create bugs. Just examples only:

1. Using undefined variables
2. Passing string instead of object
3. Using properties that do not exist
4. Using req.query instead of body

### Unhandled Rejection:

An unhandled rejection refers to a situation in asynchronous programming where a Promise is rejected, but no error handler is attached to handle the rejection.

When a Promise is rejected, it can be handled using the **`.catch()`** method or by chaining a **`.then()`** method with a second callback function that handles the error. If a rejection occurs and no error handler is attached, it results in an unhandled rejection.

Unhandled rejections can lead to unexpected behavior in your application, such as silent failures or crashes. It is generally considered good practice to handle rejections appropriately to ensure proper error handling and prevent unhandled rejections.

### Uncaught Exceptions:

An uncaught exception refers to an error or exception that is thrown during the execution of a program but is not caught or handled by any exception-handling mechanism. When an exception is not caught, it propagates up the call stack until it reaches the top-level of the program or a global error handler, and if still unhandled, it results in an "Uncaught Exception" error.

Uncaught exceptions can lead to unexpected program termination or abnormal behavior. They often indicate programming errors, such as invalid operations, null references, or unexpected conditions that were not anticipated and handled in the code.

To handle exceptions and prevent uncaught exceptions, developers typically use try-catch blocks or other error-handling mechanisms to catch and handle exceptions appropriately. By catching and handling exceptions, you can gracefully handle errors, provide feedback to the user, and prevent application crashes.
