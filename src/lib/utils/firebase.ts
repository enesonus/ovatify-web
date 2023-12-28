import { initializeApp } from "firebase/app";
import {
	getAuth,
	sendEmailVerification,
	sendPasswordResetEmail,
	signOut,
	type User
} from "firebase/auth";
import { env } from "$env/dynamic/public";

export const requireEmailVerification = env.PUBLIC_REQUIRE_EMAIL_VERIFICATION !== "false";

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
	emailInUse: "Firebase: Error (auth/email-already-in-use).",
	popupClosed: "Firebase: Error (auth/popup-closed-by-user)."
};

export async function firebaseSignOut() {
	try {
		await signOut(auth);
	} catch (e) {
		console.error("Error signing user out from firebase", e);
	}
}

export async function firebaseDeleteUser() {
	try {
		await auth.currentUser?.delete();
	} catch (e) {
		console.error("Error deleting user from firebase", e);
	}
}

export async function firebaseSendVerificationEmail(user: User) {
	try {
		await sendEmailVerification(user);
	} catch (e) {
		console.error("Error sending firebase verification email", e);
	}
}

export async function firebaseSendPasswordResetEmail(userEmail: string) {
	try {
		await sendPasswordResetEmail(auth, userEmail);
		return true;
	} catch (e) {
		console.error("Error sending firebase password reset email", e);
		return false;
	}
}
