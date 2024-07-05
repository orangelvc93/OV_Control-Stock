// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBtPO07HSz8etClkIHcj_uY1mgG1usLlIo",
	authDomain: "admin-products-84e4f.firebaseapp.com",
	projectId: "admin-products-84e4f",
	storageBucket: "admin-products-84e4f.appspot.com",
	messagingSenderId: "184394590721",
	appId: "1:184394590721:web:46cfc9319e6233dccc6e00",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/* Para que afecte a todo el proyecto */
export default app;

/* Exportamos el servicio de autenticación */
export const auth = getAuth(app);

/* =========funciones de autenticación ============================================ */

/* ----- Crear usuario con email y password---------- */
export const createUser = async (user: { email: string; password: string }) => {
	return await createUserWithEmailAndPassword(auth, user.email, user.password);
};
/* -----Iniciar sesión con email y password---------- */
export const signIn = async (user: { email: string; password: string }) => {
	return await signInWithEmailAndPassword(auth, user.email, user.password);
};

/* ---------Actualizar el nombre y foto del usuario en caso de que esté creado--------- */
export const updateUser = (user: {
	displayName?: string | null;
	photoURL?: string | null;
}) => {
	if (auth.currentUser) {
		return updateProfile(auth.currentUser, user);
	}
};
