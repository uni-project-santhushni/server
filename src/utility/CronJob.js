import { sendTextEmail } from "../../service/email.js";
import { GetUpcomingVaccines } from "../controller/UserController.js";
import Database from "../service/Database.js";
import { CalculateAgeInDays, GetVaccinationDate } from "./DayCalculation.js";

export const TriggerEveryMidnight = async () => {
  try {
    const [cattle] = await Database.query(
      "SELECT * FROM cattle inner join users on cattle.owner_id = users.user_id"
    );
    // {
    //     id: 433879,
    //     name: 'sample 2',
    //     birthday: 2023-11-09T18:30:00.000Z,
    //     owner_id: 3
    //   }

    const [vaccine] = await Database.query("SELECT * FROM vaccine");
    // {
    //     vaccine_id: 5,
    //     vaccine_name: 'Sample Vaccine',
    //     given_age: 10,
    //     description: 'bhujbuy uy gbuy buyh bl '
    //   },

    const age = CalculateAgeInDays(cattle[0].birthday);

    vaccine?.forEach(async (v) => {
      const vaccineAge = v.given_age;
      cattle?.forEach(async (c) => {
        // Get age of cattle in months
        const birthday = new Date(c.birthday);
        const ageInDays = CalculateAgeInDays(birthday);

        // before 3 days of given_age of vaccine, log a message
        if (ageInDays >= vaccineAge - 3 && ageInDays <= vaccineAge) {
          // calculate vaccination date

          const vaccinationDate = GetVaccinationDate(birthday, vaccineAge);

          await sendTextEmail(
            c.email,
            "Upcoming Vaccine",
            `Your cattle ${c.name} is ${
              ageInDays - vaccineAge
            } days away from the ${
              v.vaccine_name
            } vaccine. The vaccination date is ${vaccinationDate.toDateString()}`
          );
        }
        // console.log(ageInDays - vaccineAge);
      });
    });
  } catch (err) {
    console.log(err);
  }
};
