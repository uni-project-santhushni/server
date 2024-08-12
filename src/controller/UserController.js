import Database from "../service/Database.js";
import PWD from "bcryptjs";
import { CalculateAgeInDays } from "../utility/DayCalculation.js";
import { GetReportEmailBody } from "../utility/report-email-body.js";
import { sendHtmlEmail } from "../../service/email.js";

export const UserRegister = async (req, res) => {
  const { fName, lName, email, nic, password, confirmPassword } = req.body;

  if (!fName || !lName || !email || !nic || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const [rows] = await Database.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    console.log(rows);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const [rows2] = await Database.query("SELECT * FROM users WHERE nic = ?", [
      nic.toLowerCase(),
    ]);

    if (rows2.length > 0) {
      return res.status(400).json({ message: "NIC already exists" });
    }

    const hash = await PWD.hash(password, 10);
    console.log(nic.toLowerCase());
    await Database.query(
      "INSERT INTO users (fName, lName, email, nic, password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [fName, lName, email, nic.toLowerCase(), hash, "user"]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const UpdateUser = async (req, res) => {
  const { email } = req.session.user;

  const { fName, lName, nic } = req.body;

  if (!fName || !lName || !nic) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await Database.query(
      "UPDATE users SET fName = ?, lName = ?, nic = ? WHERE email = ?",
      [fName, lName, nic, email]
    );

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetCurrentUser = async (req, res) => {
  const { email } = req.session.user;

  try {
    const [rows] = await Database.query(
      "SELECT fName, lName, email, createAt, user_id, role, active, nic FROM users WHERE email = ?",
      [email]
    );

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const UserLogin = async (req, res) => {
  const { email, password, admin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let rows = [];
    if (admin) {
      [rows] = await Database.query(
        'SELECT * FROM users WHERE email = ? AND role="admin"',
        [email]
      );
    } else {
      [rows] = await Database.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await PWD.compare(password, rows[0].password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = {
      id: rows[0].id,
      fName: rows[0].fName,
      lName: rows[0].lName,
      email: rows[0].email,
      role: rows[0].role,
    };

    req.session.user = user;

    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const UserLogout = (req, res) => {
  req.session.destroy();

  return res.status(200).json({ message: "User logged out successfully" });
};

export const CheckAuth = (req, res) => {
  return res.status(200).json(req.session.user);
};

export const GetAllUsers = async (req, res) => {
  try {
    const [rows] = await Database.query(
      "SELECT fName, lName, email, createAt, user_id, role, active, nic FROM users"
    );

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOneUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await Database.query(
      "SELECT fName, lName, email, createAt, user_id, role, active, nic FROM users WHERE user_id = ?",
      [id]
    );

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const MakeUserActive = async (req, res) => {
  const { id } = req.params;

  try {
    await Database.query("UPDATE users SET active = 1 WHERE user_id = ?", [id]);

    return res.status(200).json({ message: "User activated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const UpdateUserAsAdmin = async (req, res) => {
  const { id } = req.params;
  const { fName, lName, role } = req.body;

  if (!fName || !lName || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await Database.query(
      "UPDATE users SET fName = ?, lName = ?, role = ? WHERE user_id = ?",
      [fName, lName, role, id]
    );

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetUpcomingVaccines = async (req, res) => {
  const { email } = req.session.user;
  try {
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetCheckupReportByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const [rows] = await Database.query(
      "SELECT * FROM checkup WHERE DATE(date) = ?",
      [date]
    );

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const requestReportToEmail = async (req, res) => {
  const { date } = req.params;

  try {
    const [checkup] = await Database.query(
      "SELECT * FROM checkup WHERE DATE(date) = ?",
      [date]
    );

    const [vaccine] = await Database.query(
      "SELECT take_vaccine.*, vaccine.* FROM take_vaccine INNER JOIN vaccine on  take_vaccine.vaccine_id = vaccine.vaccine_id WHERE DATE(taked_date) = ?",
      [date]
    );

    const htmlBody = await GetReportEmailBody(checkup, vaccine);

    await sendHtmlEmail(
      req.session.user.email,
      `Daily Report - ${date}`,
      htmlBody
    );

    res.status(200).send({ message: "Report send successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
