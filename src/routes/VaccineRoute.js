import express from "express";
import dotenv from "dotenv";
import { checkUserAuth, isAdmin } from "../utility/Auth.js";
import { CreateVaccine, DeleteVaccine, GetAllVaccine, GetVaccineReportByDate, getOneVaccine } from "../controller/VaccineController.js";


dotenv.config();
const router = express.Router();

router.use(checkUserAuth);
router.get("/", GetAllVaccine);
router.get("/:id", getOneVaccine);

// check if user is admin
router.use(isAdmin);
router.post("/", CreateVaccine);
router.delete("/:id", DeleteVaccine);
router.get("/report/:date", GetVaccineReportByDate);



export default router;
