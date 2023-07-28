const problemController = require("../Controllers/problemController");
const express = require("express");
const router = express.Router();

router.post("/problem/category", problemController.getProblemsByCategory);
router.post("/problem/difficulty", problemController.filterByDifficulty);
router.post("/problem/company", problemController.filterByCompany);
router.get("/totalProblems", problemController.getTotalProblems);
router.get("/onefifty", problemController.filterByTop150);
router.get("/seventyfive", problemController.filterByTop75);
router.post("/problems", problemController.getProblems);
router.post("/solved", problemController.getNumberOfProblemsSolved);
router.get("/companies", problemController.getCompanies);

module.exports = router;
