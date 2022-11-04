/*
    Please be careful when throwing errors from setInterval,
    there is no context, it will turn off the whole hlambda server.
    This is the worst thing that can happen to Hlambda server.
*/

console.log("I'm working!!! Entry point code executed.");

// setInterval(async () => {
//   try {
//     console.log('[tick] Hello World!');
//     throw new Error('AWKWARD ERROR!');
//   } catch (error) {
//     console.log(error);
//   }
//   // throw new Error("DON'T DO THIS! This will kill the system, you will have to recover to old metadata.");
// }, 2000);

// throw new Error('You can do this... don\'t know why but you can.');
