const userController = require("../Controllers/userController");
const express = require("express");
const router = express.Router();
const verify = require("../Middleware/auth");

router.post("/signup", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);
router.get("/role/:id", userController.getRole);
router.get("/users", userController.getUsers);
router.get("/verify", verify.verify);
router.get("/updateRole/:id", userController.updateRole);
module.exports = router;
