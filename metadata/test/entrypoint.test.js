/*
    Please be careful when throwing errors from setInterval,
    there is no context, it will turn off the whole hlambda server.
    This is the worst thing that can happen to Hlambda server.
*/

console.log("I'm working!!! Entry point code executed.");

// setInterval(async () => {
//   try {
//     console.log('[tick] Hey!');
//     throw new Error('YOY!');
//   } catch (error) {
//     console.log(error);
//   }
// }, 2000);

// throw new Error('NE!');
