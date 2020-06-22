const { body } = require('express-validator');
const jsonModel = require('../models/jsonModel');
const userModel = jsonModel('users')
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
   register: [
      body('email')
         .notEmpty().withMessage('Este campo es obligatorio').bail()
         .isEmail().withMessage('Debes colocar un email vaildo').bail()
         .custom((value, { req }) => {

            const user = userModel.findBySomething( e => e.email == req.body.email)

            if(user){
               return false
            }

            return true
            
         }).withMessage('Email ya registrado'),
      body('image')
         .custom(function(value, { req }){
            if(req.file != undefined){
               return true;
            }
            return false;
         }).withMessage('poneme una imagen').bail()
         .custom(function(value, { req }){

            const extensionesAceptadas = ['.jpg', '.jpeg', '.png']
            let ext = path.extname(req.file.originalname);
            console.log(ext)

            return extensionesAceptadas.includes(ext);

         }).withMessage('imagen invalida'),
      
         //password
         body('password')
            .notEmpty().withMessage('campo obligatorio').bail()
            .isLength({min: 3}).withMessage('debe tener por lo menos 3 chars').bail()
            .custom((value, { req }) => req.body.password == req.body.retype).withMessage('las passwords no coinciden'),
         body('retype')
            .notEmpty().withMessage('campo obligatorio')
   ],
   login: [
      body('email')
         .notEmpty().withMessage('Este campo es obligatorio').bail()
         .isEmail().withMessage('Debes colocar un email vaildo').bail()
         .custom((value, { req }) => {

            const user = userModel.findBySomething(e => e.email == req.body.email)

            if(user){
               if (bcrypt.compareSync(req.body.password, user.password)) {
                  return true
               }
            }

            return false;

         }).withMessage('La password y el email no coinciden'),
   ]
}