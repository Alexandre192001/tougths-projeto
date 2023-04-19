const express = require("express")
const router = express.Router()
const ToughtController = require('../controllers/ToughtsController')
const checkAuth = require('../middleware/auth').checkAuth

router.get('/', ToughtController.showToughts)
router.get('/dashboard',checkAuth, ToughtController.dashboard)
router.get('/add',checkAuth, ToughtController.createTought)
router.post('/add', checkAuth, ToughtController.createTougthtCreate)
router.post("/delete", checkAuth, ToughtController.removeTought)
router.get('/edit/:id', checkAuth, ToughtController.updateTought)
router.post('/edit', checkAuth, ToughtController.updateToughtSave)

module.exports = router