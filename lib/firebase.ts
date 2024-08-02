// Import the functions you need from the SDKs you need
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadString,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import {
	createUserWithEmailAndPassword,
	getAuth,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";

import {
	addDoc,
	collection,
	doc,
	getDoc,
	getFirestore,
	setDoc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
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
/* Exportamos el servicio de base de datos */
export const db = getFirestore(app);
/* Exportamos el servicio de storage para guardar imágenes */
export const storage = getStorage(app);

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

/* ---------Recuperar contraseña --------- */
//Envía un correo para resetear la contraseña del usuario
export const sendResetEmail = (email: string) => {
	return sendPasswordResetEmail(auth, email);
};

/* ---------Cerrar Sesión de usuario --------- */
export const signOutAccount = () => {
	localStorage.removeItem("user");
	return auth.signOut();
};

/* =========funciones de la DB ============================================ */

/* --------- Obtener un documento de la colección ---------- */
export const getDocument = async (path: string) => {
	return (await getDoc(doc(db, path))).data();
};

/* --------- Agregamos un documento a la colección con el path especificado ---------- */
//Tomamos el path o ruta y la data con la funcion addDoc para agregar los datos en la db de firestore
export const addDocument = (path: string, data: any) => {
	// Añadimos una propiedad de fecha de creación para que sea automáticamente actualizada con la fecha y hora actual al crear un nuevo documento
	data.createAt = serverTimestamp();
	return addDoc(collection(db, path), data);
};
// Diferencia entre setDocument y addDocument es que el primero guarda el documento en un id al azar y el otro hay que decirle en que id guardar

/* --------- Guardamos un documento a la colección con el path especificado ---------- */
//Tomamos el path o ruta y la data con la funcion setDoc para guardar los datos en la db de firestore
export const setDocument = (path: string, data: any) => {
	// Añadimos una propiedad de fecha de creación para que sea automáticamente actualizada con la fecha y hora actual al crear un nuevo documento
	data.createAt = serverTimestamp();
	return setDoc(doc(db, path), data);
};

/* --------- Actualizar contenido del usuario  ---------- */
export const updateDocument = (path: string, data: any) => {
	return updateDoc(doc(db, path), data);
};

/* --------- Almacenamiento de Firebase  ---------- */
// sirve para subir un archivo con el formato base64 y obtener su url
export const uploadBase64 = async (path: string, base64: string) => {
	return uploadString(ref(storage, path), base64, "data_url").then(() => {
		return getDownloadURL(ref(storage, path));
	});
};
