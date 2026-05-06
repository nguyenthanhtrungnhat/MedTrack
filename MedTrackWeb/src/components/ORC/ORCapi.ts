import axios from "axios";

export const saveTreatment = (data: any) => {
  return axios.post("http://localhost:3000/api/treatment", data);
};