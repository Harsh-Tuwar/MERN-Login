import axios from 'axios';

const setAuthToken = token => {
	if (token) {
		// if we have authToken, then add it to every requrest
		axios.defaults.headers.common["Authorization"] = token;
	} else {
		// delete auth header
		delete axios.defaults.headers.common["Authorization"];
	}
}

export default setAuthToken;