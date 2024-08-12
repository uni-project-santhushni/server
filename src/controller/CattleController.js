import Database from "../service/Database.js";
import randomstring from "randomstring";

export const CreateCattle = async (req, res) => {
  const { name, birthday, owner } = req.body;

  if (!birthday || !owner) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const random = randomstring.generate({
    length: 6,
    charset: "numeric",
  });

  try {
    await Database.query(
      "INSERT INTO cattle (id, name, birthday, owner_id) VALUES (?, ?, ?, ?)",
      [random, name ? name : null, birthday, owner]
    );

    return res.status(201).json({ message: "Cattle created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetAllCattle = async (req, res) => {
  try {
    const [rows] = await Database.query(
      "SELECT * FROM cattle inner join users on cattle.owner_id = users.user_id"
    );
    console.log(rows);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetCattleFromFarmer = async (req, res) => {
  const { email } = req.session.user;
  
  try {
// get user id from email
const [user] = await Database.query("SELECT * FROM users WHERE email = ?", [email]);

    const [rows] = await Database.query(
      "SELECT * FROM cattle inner join users on cattle.owner_id = users.user_id WHERE users.user_id = ?", [
        user[0].user_id
      ]
    );
    console.log(rows);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOneCattle = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    const [rows] = await Database.query("SELECT * FROM cattle WHERE id = ?", [
      id,
    ]);

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetVaccineTimeTable = async (req, res) => {
    const { cattle_id } = req.params;
    
    if (!cattle_id) {
        return res.status(400).json({ message: "cattle_id is required" });
    }
    
    let vaccine = [];
    let takenVaccine = [];

    try {
        const [_vaccine] = await Database.query("SELECT * FROM vaccine");
        vaccine = _vaccine;

        const [_takenVaccine] = await Database.query("SELECT * FROM take_vaccine WHERE cattle_id = ?", [cattle_id]);
        takenVaccine = _takenVaccine;

        const response = vaccine.map((v) => {
            const found = takenVaccine.find(tv => tv.vaccine_id == v.vaccine_id);
            return {
                ...v,
                taken: !!found
            };
        });

        console.log(response);

        return res.status(200).json(response);


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const TakeVaccine = async (req, res) => {
    const { vaccine_id, cattle_id } = req.params;

    if (!vaccine_id || !cattle_id) {
        return res.status(400).json({ message: "vaccine_id and cattle_id is required" });
    }

    try {
        await Database.query("INSERT INTO take_vaccine (vaccine_id, cattle_id) VALUES (?, ?)", [vaccine_id, cattle_id]);
        return res.status(201).json({ message: "Vaccine taken successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const DeleteTakeVaccine = async (req, res) => {
    const { vaccine_id, cattle_id } = req.params;

    if (!vaccine_id || !cattle_id) {
        return res.status(400).json({ message: "vaccine_id and cattle_id is required" });
    }

    try {
        await Database.query("DELETE FROM take_vaccine WHERE vaccine_id = ? AND cattle_id = ?", [vaccine_id, cattle_id]);
        return res.status(200).json({ message: "Vaccine deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const CreateCheckup = async (req, res) => {
    const { cattle_id } = req.params;
    const { date, general_health, bcs, temperature, respiratory_rate } = req.body;

    if (!cattle_id || !date || !general_health || !bcs || !temperature || !respiratory_rate) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        await Database.query("INSERT INTO checkup (cattle_id, date, general_health, bcs, temperature, respiratory_rate) VALUES (?, ?, ?, ?, ?, ?)", [cattle_id, date, general_health, bcs, temperature, respiratory_rate]);
        return res.status(201).json({ message: "Checkup created successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    
}


export const GetCheckupOfCattle = async (req, res) => {
    const { cattle_id } = req.params;

    if (!cattle_id) {
        return res.status(400).json({ message: "cattle_id is required" });
    }

    try {
        const [rows] = await Database.query("SELECT * FROM checkup WHERE cattle_id = ?", [cattle_id]);
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}