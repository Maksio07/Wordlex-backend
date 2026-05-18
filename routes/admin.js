const express = require('express')
const router = express.Router()
const csrfProtection = require('../middleware/csrf')
const { emailValidator, passwordValidator } = require('../util/validation')
const adminCtrl = require('../controllers/adminCtrl')
const authCtrl = require('../controllers/authCtrl')

router.get('/admin/:admin_id', csrfProtection, adminCtrl.getUsers)
router.put('/admin/:admin_id/add-new-admin', csrfProtection, adminCtrl.createNewAdmin)
router.post('/admin/login', csrfProtection, emailValidator, passwordValidator, adminCtrl.loginAdmin)
router.post('/admin/logout', csrfProtection, authCtrl.logout)
router.delete('/admin/:admin_id', csrfProtection, adminCtrl.deleteUsers)

module.exports = router
