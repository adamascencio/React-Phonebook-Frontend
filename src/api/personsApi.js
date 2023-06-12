import axios from "axios";

const baseUrl = "https://74zfpy-3001.csb.app";

const getPersons = () => {
  const request = axios.get(`${baseUrl}/api/persons`);
  return request.then((res) => res.data);
};

const createPerson = (personObj) => {
  const url = `${baseUrl}/api/persons`;
  const request = axios.post(url, personObj);
  return request.then((res) => res.data);
};

const deletePerson = (id) => {
  const url = `${baseUrl}/api/persons/:${id}`;
  const request = axios.delete(url);
  return request.then((res) => res.data);
};

const updatePerson = (id, personObj) => {
  const url = `${baseUrl}/api/persons/:${id}`;
  const request = axios.put(url, personObj);
  return request.then((res) => res.data).catch((error) => 0);
};

export default {
  getPersons,
  createPerson,
  deletePerson,
  updatePerson,
};
