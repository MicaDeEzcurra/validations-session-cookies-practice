const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const multer = require('multer');
const path = require('path')
const validator = require('../middlewares/validator');
const auth = require('../middlewares/auth');
const guest = require('../middlewares/guest');

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../../public/images/users'));
   },
   filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
   }
});

var upload = multer({ 
   storage: storage,
   // Validate image
   fileFilter: (req, file, cb) => {
      const acceptedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

      const ext = path.extname(file.originalname);

      if (!acceptedExtensions.includes(ext)) {
         req.file = file;
      }

      cb(null, acceptedExtensions.includes(ext));
   }
 });

router.get('/register', guest, controller.register);
router.post('/register', upload.single('image'), validator.register, guest, controller.processRegister);
router.get('/login', guest, controller.login);
router.post('/login', validator.login, guest, controller.processLogin);
router.post('/logout', auth, controller.logout);
router.get('/profile', auth, controller.profile);

module.exports = router;