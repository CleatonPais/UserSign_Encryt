var i = 0;

export const test_middlewares = (req, res, next) => {
  i++;
  console.log("Testing middleware called:" + i);
};
