import axios from "axios";
import getToken from "@/utils/token";

const axiosInstance = axios.create({
	baseURL: process.env.server,
	headers: {
		AmsPublickey: process.env.amsPublickey,
		// AmsPrivateKey: process.env.amsPrivateKey,
	},
});

// axiosInstance.defaults.baseURL = 'http://localhost:5000/';

// Add a request interceptor
axiosInstance.interceptors.request.use(
	function (config) {
		// Do something before request is sent
		if (!config.headers.authorization) {
			config.headers.authorization = `Bearer ${getToken()}`;
		}
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		return response;
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error);
	}
);

export default axiosInstance;
