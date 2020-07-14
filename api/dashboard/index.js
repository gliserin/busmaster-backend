const express = require("express");
const router = express.Router();

const ctrl = require("./dashboard");

router.get("/mybuscount", ctrl.myBusCount);
router.get("/myplace", ctrl.myPlace);
router.get("/ranking", ctrl.ranking);

module.exports = router;
