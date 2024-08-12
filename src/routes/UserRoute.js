import express from "express";
import dotenv from "dotenv";
import {
  CheckAuth,
  GetAllUsers,
  GetCheckupReportByDate,
  GetCurrentUser,
  GetUpcomingVaccines,
  MakeUserActive,
  UpdateUser,
  UpdateUserAsAdmin,
  UserLogin,
  UserLogout,
  UserRegister,
  getOneUser,
  requestReportToEmail,
} from "../controller/UserController.js";
import { checkUserAuth, isAdmin } from "../utility/Auth.js";

dotenv.config();
const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/logout", UserLogout);

// check auth
router.use(checkUserAuth);



router.get("/self", GetCurrentUser);
router.put("/", UpdateUser);


router.get("/check-auth", CheckAuth);
router.get('/upcoming-vaccines', GetUpcomingVaccines);
router.get("/:id", getOneUser);



// check if user is admin
router.use(isAdmin);
router.get("/", GetAllUsers);
router.put("/:id", UpdateUserAsAdmin);
router.put("/activate/:id", MakeUserActive);
router.get("/report/:date", GetCheckupReportByDate);
router.get("/report-to-email/:date", requestReportToEmail);

export default router;
