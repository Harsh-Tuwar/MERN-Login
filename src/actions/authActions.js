import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// import action defs
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from '../actions/types';

// register User
export const registerUser = (userData, history) => dispatch => {
	axios
		.post("https://express-server-api.vercel.app/api/users/register", userData)
		.then((res) => {
			// re-direct to login on successful register
			history.push("/login");
		}).catch((err) => {
			console.log(err);
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		});
};


// Login User
export const loginUser = userData => dispatch => {
	axios.post("https://express-server-api.vercel.app/api/users/login", userData)
		.then((res) => {
			// save to local storage

			// set token to localstorage
			const { token } = res.data;
			localStorage.setItem("jwtToken", token);

			// set token to authHeader
			setAuthToken(token);

			// decode token to get user data
			const decoded = jwt_decode(token);

			// set current user
			dispatch(setCurrentUser(decoded));
		}).catch((err) => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		});
}

// set logged in user
export const setCurrentUser = decoded => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	};
}

// user loading
export const setUserLoading = () => {
	return {
		type: USER_LOADING
	};
}

// log user out
export const logUserOut = () => dispatch => {
	// remove authtoken from local storage
	localStorage.removeItem("jwtToken");

	// remove auth header for future request
	setAuthToken(false);

	// Set current user to empty object {} which will set isAuthenticated to false
  	dispatch(setCurrentUser({}));
}

// import axios from "axios";
// import setAuthToken from "../utils/setAuthToken";
// import jwt_decode from "jwt-decode";

// import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

// // Register User
// export const registerUser = (userData, history) => dispatch => {

//     // .post("http://localhost:5000/api/users/register", userData)
// 	axios({
// 		method: "POST",
// 		baseURL: "http://localhost:5000/",
// 		url: "/api/users/register",
// 		data: userData 
// 	}).then(res => history.push("/login"))
//     .catch(err =>
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       })
//     );
// };

// // Login - get user token
// export const loginUser = userData => dispatch => {
//   axios
//     .post("https://express-server-api.vercel.app/api/users/login", userData)
//     .then(res => {
//       // Save to localStorage

//       // Set token to localStorage
//       const { token } = res.data;
//       localStorage.setItem("jwtToken", token);
//       // Set token to Auth header
//       setAuthToken(token);
//       // Decode token to get user data
//       const decoded = jwt_decode(token);
//       // Set current user
//       dispatch(setCurrentUser(decoded));
//     })
//     .catch(err =>
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       })
//     );
// };

// // Set logged in user
// export const setCurrentUser = decoded => {
//   return {
//     type: SET_CURRENT_USER,
//     payload: decoded
//   };
// };

// // User loading
// export const setUserLoading = () => {
//   return {
//     type: USER_LOADING
//   };
// };

// // Log user out
// export const logUserOut = () => dispatch => {
//   // Remove token from local storage
//   localStorage.removeItem("jwtToken");
//   // Remove auth header for future requests
//   setAuthToken(false);
//   // Set current user to empty object {} which will set isAuthenticated to false
//   dispatch(setCurrentUser({}));
// };
