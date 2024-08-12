import express from "express";
import dotenv from "dotenv";
import { checkUserAuth, isAdmin } from "../utility/Auth.js";
import { CreateCattle, CreateCheckup, DeleteTakeVaccine, GetAllCattle, GetCattleFromFarmer, GetCheckupOfCattle, GetVaccineTimeTable, TakeVaccine, getOneCattle } from "../controller/CattleController.js";


dotenv.config();
const router = express.Router();

router.use(checkUserAuth);
router.get("/farmer/all", GetCattleFromFarmer);
router.get("/:id", getOneCattle);
router.get("/vaccine-time-table/:cattle_id", GetVaccineTimeTable);
router.get("/checkup/:cattle_id", GetCheckupOfCattle);

// check if user is admin
router.use(isAdmin);

router.post("/", CreateCattle);
router.get("/", GetAllCattle);
router.post("/take-vaccine/:vaccine_id/:cattle_id", TakeVaccine);
router.delete("/take-vaccine/:vaccine_id/:cattle_id", DeleteTakeVaccine);
router.post("/checkup/:cattle_id", CreateCheckup);
export default router;
