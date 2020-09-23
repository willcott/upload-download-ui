import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const uuid = uuidv4();

export const uploadFiles = async () => {
  var file = document.getElementById("myfile").files[0];

  const formData = new FormData();
  formData.append("file", file, file.name);

  return axios.post(`http://localhost:8000/upload/${uuid}`, formData);
};

export const getStatus = async () => {
  return axios.get(`http://localhost:8000/status/${uuid}`);
};

export const downloadFiles = () => {
  download(`http://localhost:8000/download/${uuid}`, "helloWorld.mp4");
};

const download = (dataurl, filename) => {
  var a = document.createElement("a");
  a.href = dataurl;
  a.setAttribute("download", filename);
  a.click();
};
