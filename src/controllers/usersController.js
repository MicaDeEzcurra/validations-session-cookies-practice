const bcrypt = require('bcryptjs');
const jsonModel = require('../models/jsonModel');
const userModel = jsonModel('users')
const { validationResult } = require('express-validator');

const controller = {
   register: function(req, res) {
      return res.render('users/register');
   },
   processRegister: function(req, res){


      
      const errors = validationResult(req);

      if(errors.isEmpty()){
         req.body.password = bcrypt.hashSync(req.body.password, 10);
   
         delete req.body.retype;
   
   
         const newUser = {
            id: userModel.nextId(),
            ...req.body,
            image: req.file.filename
         }
   
         userModel.save(newUser);
   
         return res.redirect('/users/login');
      }

      return res.render('users/register', { errors: errors.mapped(), old: req.body})

   },
   login: function(req, res) {
      return res.render('users/login');
   },
   processLogin: function (req, res) {
      // return res.send(req.body);

      const errors = validationResult(req);

      if(errors.isEmpty()){

         const user = userModel.findBySomething( e => e.email == req.body.email);

         delete user.password;
         req.session.user = user;
   
         if(req.body.remember){
            res.cookie('email', user.email, { maxAge: 1000 * 60 * 60 * 24 });
         }
   
         return res.redirect('/');
      }

      return res.render('users/login', { errors: errors.mapped(), old: req.body })

   },
   logout: function (req, res) {
      req.session.destroy();

      if(req.cookies.email){
         res.clearCookie('email');
      }

      return res.redirect('/');
   },

   profile: function (req, res) {
      return res.render('users/profile')
   }
}

module.exports = controller;