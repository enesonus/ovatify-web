import { initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	OAuthProvider,
	signInWithPopup,
	signOut,
	createUserWithEmailAndPassword
} from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { prepareToast } from "./toast";

const firebaseConfig = {
	apiKey: "AIzaSyDVuHFYrD_xip5Q1DyjuQZ7Wyx5fe74H8I",
	authDomain: "ovatify.firebaseapp.com",
	projectId: "ovatify",
	storageBucket: "ovatify.appspot.com",
	messagingSenderId: "498057476584",
	appId: "1:498057476584:web:765fb04c5f9daf83170c5d",
	measurementId: "G-WFBMCJ46SM"
};

const firebaseApp = initializeApp(firebaseConfig);

// Used everywhere auth is needed
export const auth = getAuth(firebaseApp);

// Error Messages
export const FIREBASE_ERRORS = {
	invalidCredentials: "Firebase: Error (auth/invalid-login-credentials).",
	emailInUse: "Firebase: Error (auth/email-already-in-use)."
};

// Functions below are reference for later, not used anywhere yet
export async function firebaseSignOut() {
	await signOut(auth);
	prepareToast({
		type: "success",
		message: "Thanks for hanging out, see ya around!"
	});
}

export async function signInWithGoogle() {
	const credential = signInWithPopup(auth, new GoogleAuthProvider());
	return loginHandler(credential);
}

export async function signInWithApple() {
	const provider = new OAuthProvider("apple.com");
	const credential = signInWithPopup(auth, provider);
	return loginHandler(credential);
}

async function loginHandler(promise: Promise<UserCredential>) {
	let response: unknown;
	let serverError: string | null = null;
	try {
		response = await promise;
		prepareToast({
			message: "Access granted! Logged into the mainframe!",
			type: "success"
		});
	} catch (err) {
		serverError = "err.message"; // handle later
		console.error(err);
		prepareToast({
			message: "serverError",
			type: "error"
		});
	}
	return { response, serverError };
}

export function createUser(email: string, password: string) {
	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			console.log(user);
		})
		.catch((error) => {
			console.log("Error code: ", error.code);
			console.log("Error message: ", error.message);
		});
}
