const express = require("express");
const router = express.Router();

const ctrl = require("./user");

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.post("/logout", ctrl.logout);
router.get("/check", ctrl.check);
router.post("/resign", ctrl.resign);

module.exports = router;
