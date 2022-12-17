import axios from "axios";

const axiosClient = axios.create();

axiosClient.defaults.baseURL = "https://api.stackexchange.com/2.3";

axiosClient.defaults.headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

//All request will wait 2 seconds before timeout
axiosClient.defaults.timeout = 2000;

// axiosClient.defaults.withCredentials = true;

export function getRequest(URL, payload) {
  return axiosClient.get(`/${URL}`, payload).then((response) => response.data);
}

export function postRequest(URL, payload) {
  return axiosClient.post(`/${URL}`, payload).then((response) => response.data);
}

export function patchRequest(URL, payload) {
  return axiosClient
    .patch(`/${URL}`, payload)
    .then((response) => response.data);
}

export function deleteRequest(URL) {
  return axiosClient.delete(`/${URL}`).then((response) => response.data);
}