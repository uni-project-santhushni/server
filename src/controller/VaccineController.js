import Database from "../service/Database.js";


export const CreateVaccine = async (req, res) => {
    const { vaccine_name, given_age, description } = req.body;
    
    if (!vaccine_name || !given_age || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      await Database.query(
        "INSERT INTO vaccine (vaccine_name, given_age, description) VALUES (?, ?, ?)",
        [vaccine_name, given_age, description]
      );
  
      return res.status(201).json({ message: "Vaccine created successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    
}


export const GetAllVaccine = async (req, res) => {
    try {
      const [rows] = await Database.query(
        "SELECT * FROM vaccine"
      );
      console.log(rows);
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
}

export const getOneVaccine = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
  
    try {
      const [rows] = await Database.query("SELECT * FROM vaccine WHERE vaccine_id = ?", [
        id,
      ]);
  
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
}

export const DeleteVaccine = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
  
    try {
      await Database.query("DELETE FROM vaccine WHERE vaccine_id = ?", [
        id,
      ]);
  
      return res.status(200).json({ message: "Vaccine deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
}

export const GetVaccineReportByDate = async (req, res) => {
    const { date } = req.params;
  
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
  
    try {
      const [rows] = await Database.query(
        "SELECT take_vaccine.*, vaccine.* FROM take_vaccine INNER JOIN vaccine on  take_vaccine.vaccine_id = vaccine.vaccine_id WHERE DATE(taked_date) = ?",
        [date]
      );
  
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
}