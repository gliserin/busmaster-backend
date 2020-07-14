const { Router } = require("express");
const router = Router();

router.use("/user", require("./user"));
router.use("/bus", require("./bus"));
router.use("/dashboard", require("./dashboard"));

module.exports = router;
