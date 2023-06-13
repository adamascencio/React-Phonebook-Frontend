import axios from "axios";

const baseUrl = "/api/persons";

const getPersons = () => {
  const request = axios.get(baseUrl);
  return request.then((res) => res.data);
};

const createPerson = (personObj) => {
  const request = axios.post(baseUrl, personObj);
  return request.then((res) => res.data);
};

const deletePerson = (id) => {
  const url = `${baseUrl}/:${id}`;
  const request = axios.delete(url);
  return request.then((res) => res.data);
};

const updatePerson = (id, personObj) => {
  const url = `${baseUrl}/:${id}`;
  const request = axios.put(url, personObj);
  return request.then((res) => res.data).catch((error) => 0);
};

export default {
  getPersons,
  createPerson,
  deletePerson,
  updatePerson,
};
