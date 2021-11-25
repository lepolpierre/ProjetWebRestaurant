"use strict";

const express = require("express");
const multer  = require('multer');
// multer({ dest: './public/images' });
const fileStorageEngine = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, "./public/images");
    },
    filename: (req,file,cb)=>{
        cb(null, `${Date.now()}--${file.originalname}`);
    }
});

const upload = multer({storage: fileStorageEngine});



const platControllers = require('../controllers/platControllers');

const {isAuth, isConnected} = require('../middlewares/auth');



const router = express.Router();

router.get('/', isConnected, platControllers.getMenu2);
router.get('/json', platControllers.getJson);


router.get('/plat/add', isAuth, platControllers.addPlatAdmin);                  // Affiche from ajout de plat
router.post('/plat/add', upload.single('file'),platControllers.addPlat);               // Ajout de plat


router.get('/plat/:platId', isConnected, platControllers.getPlat);   // Affichage d'un plat.



module.exports = router;