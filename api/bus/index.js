const express = require("express");
const router = express.Router();

const ctrl = require("./bus");

router.get("", ctrl.list);
router.get("/recent", ctrl.recentList);
router.post("", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
