const express = require("express");
const router = express.Router();
const itemController = require('../controllers/listItems')

router.get("/", itemController.listItems)
router.get("/info/:name", itemController.infoItems)


module.exports = router;