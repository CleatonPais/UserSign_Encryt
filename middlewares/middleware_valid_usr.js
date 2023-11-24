export const isValid = (req, res, next) => {
  if (req.session.isValidated) {
    next();
  } else {
    req.session.error = "You have to Login first";
    res.redirect("/login");
  }
};
