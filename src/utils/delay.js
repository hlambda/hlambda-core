export const sleep = (ms) =>
  new Promise((r) => {
    setTimeout(r, ms);
  });

export const delay = sleep;

export default sleep;
