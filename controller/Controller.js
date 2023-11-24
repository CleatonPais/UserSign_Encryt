import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

class Controller {
  static test_get = (req, res) => {
    console.log("in test get");
    res.send("From controller to test page");
  };

  static dashboard_get = (req, res) => {
    // correct login
    // req.session.valid_msg = "Winner Winner Chiken Dinner";;
    //       req.session.valid_name = user_matched.name;
    const valid_msg = req.session.valid_msg;
    delete req.session.valid_msg;
    const valid_name = req.session.valid_name;
    req.session.valid_name;

    res.render("dashboard.ejs", { valid_msg, valid_name });
  };

  static signup_get = (req, res) => {
    // signup for new user
    // req.session.signup_msg = "Please signup first";
    //     req.session.signup_usr_name = form_data.name;
    const signup_msg = req.session.signup_msg;
    delete req.session.signup_msg;
    const signup_usr_email = req.session.signup_usr_email;
    delete req.session.signup_usr_email;

    res.render("signup.ejs", { signup_msg, signup_usr_email });
  };

  static signup_post = async (req, res) => {
    // signup?username=&email=&password=
    try {
      const form_data = req.body;
      console.log(form_data);

      const user_matched = await userModel.findOne({ email: form_data.email });
      if (!user_matched) {
        // res.send("New User Detected");

        const hashedpass = await bcrypt.hash(form_data.password, 10);
        console.log(hashedpass);

        const user_to_save = new userModel({
          name: form_data.username,
          email: form_data.email,
          password: hashedpass,
        });

        const user_saved = await user_to_save.save();

        req.session.msg_new = "Welcome new user";
        req.session.usr_new = user_saved.name;

        // res.send(user_saved);

        res.redirect("/dashboard");
      } else {
        req.session.ex_msg = "This is an existing user.";
        req.session.ex_usr_name = user_matched.name;

        // this session variable will be used in login_get
        res.redirect("/login");
      }

      //   res.send(form_data);
    } catch (err) {
      console.log(`cannot save user due to \n ${err}`);
    }
  };

  static login_get = (req, res) => {
    // get and delete session varibale but store in local varibale
    const ex_msg = req.session.ex_msg;
    delete req.session.ex_msg;
    const ex_usr_name = req.session.ex_usr_name;
    delete req.session.ex_usr_name;

    // handle new user case
    // req.session.msg_new = "Welcome new user";
    //     req.session.usr_new = user_saved.name

    const msg_new = req.session.msg_new;
    delete req.session.msg_new;
    const usr_new = req.session.usr_new;
    delete req.session.usr_new;

    // handle incorrect passord
    // req.session.pwd_msg = "Please enter correct password";
    // req.session.name_wrong_pass = user_matched.name;

    const pwd_msg = req.session.pwd_msg;
    delete req.session.pwd_msg;
    const name_wrong_pass = req.session.name_wrong_pass;
    req.session.name_wrong_pass;

    res.render("login.ejs", {
      ex_msg,
      ex_usr_name,
      msg_new,
      usr_new,
      pwd_msg,
      name_wrong_pass,
    });
  };

  static login_post = async (req, res) => {
    try {
      const form_data = req.body;
      console.log(form_data);

      const user_matched = await userModel.findOne({ email: form_data.email });
      if (!user_matched) {
        // res.send("User does not exist. Please register");

        req.session.signup_msg = "Please signup first";
        req.session.signup_usr_email = form_data.email;

        // use varibale insignup_get

        res.redirect("/signup");
      } else {
        console.log("user found" + user_matched);
        const pass_matched = await bcrypt.compare(
          form_data.password,
          user_matched.password
        );
        if (pass_matched) {
          req.session.isValidated = true;

          req.session.valid_msg = "Winner Winner Chiken Dinner";
          req.session.valid_name = user_matched.name;
          // user in this.dashbord_get
          res.redirect("/dashboard");
        } else {
          // res.send("Please enter correct password");

          req.session.pwd_msg = "Please enter correct password";
          req.session.name_wrong_pass = user_matched.name;
          res.redirect("/login");
        }
      }
    } catch (err) {
      console.log(`Cannot verfity user deatiles due to \n ${err}`);
    }
  };

  static logout_post = (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
    });
    // req.session.destroy();
    res.redirect("/login");
  };
}

export default Controller;
