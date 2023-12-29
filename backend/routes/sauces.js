const express = require('express')
const router = express.Router()

const saucesCtrl = require('../controllers/sauces')
const auth = require('../middleware/auth') //to protect routes with middleware user authentification. use it in params before controllers
const multer = require('../middleware/multer-config') // to autorize users to upload files with multer module

router.get('/', auth, saucesCtrl.getAllSauce) //Use the controller with getAllSauce function
router.post('/', auth, multer, saucesCtrl.createSauce) //... with createSauce function
router.get('/:id', auth, saucesCtrl.getOneSauce) //... with getOneSauce function
router.put('/:id', auth, multer, saucesCtrl.modifySauce) //... with modifySauce function
router.delete('/:id', auth, multer, saucesCtrl.deleteSauce) //... with deleteSauce function
router.post('/:id/like', auth, saucesCtrl.rateSauce)

module.exports = router
