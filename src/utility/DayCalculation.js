import { differenceInDays, add } from "date-fns";

export const CalculateAgeInDays = (birthday) => {
    const today = new Date();
    return differenceInDays(today, birthday);
};

export const GetVaccinationDate = (birthday, vaccineAge) => {
    const date = new Date(birthday);
    
    return add(date, { days: vaccineAge });
}