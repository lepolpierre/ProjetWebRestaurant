"use strict";
const express = require("express");         // Express
const router = express.Router();

const platControllers = require('../controllers/platControllers');
const {isAuth, isConnected} = require('../middlewares/auth');



// Permet la récupération des champs et fichiers du formulaire
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



// ======================================= ROUTES =================================
router.get('/', isConnected, platControllers.getMenu);
router.get('/json', platControllers.getJson);

router.get('/plat/add', isAuth, platControllers.addPlatAdmin);  // Affiche from ajout de plat
// Ajoute le plat à la BD.
router.post('/plat/add',
    upload.fields(
        [
            { name: 'file', maxCount: 1 }, 
            { name: 'plat', maxCount: 1 }
        ]
    ),
    platControllers.addPlat
);              

router.get('/plat/:platId', isConnected, platControllers.getPlat);   // Affichage d'un plat.


router.get('/modifier/:platId', isAuth, platControllers.platModification);         // Affichage du plat à modifier.
router.post('/modifier', 
    upload.fields(
        [
            { name: 'file', maxCount: 1 }, 
            { name: 'plat', maxCount: 1 }
        ]
    ),
    platControllers.updatePlat
);

router.get('/supprimer/:platId', platControllers.supprimerPlat);   // supprimer un plat par admin






module.exports = router;