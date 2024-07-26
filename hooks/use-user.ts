import { auth, getDocument } from "@/lib/firebase";
import { User } from "@/types/userTypes";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { setInLocalStorage } from "@/actions/set-in-localstorage";
import { getFromLocalStorage } from "@/actions/get-from-localstorage";
import { usePathname, useRouter } from "next/navigation";

//Verificamos si el usuario está autenticado o no
export const useUser = () => {
	const [user, setUser] = useState<User | undefined | DocumentData>(undefined);

	/* Agregamos las rutas que queremos proteger cuando el usuario está autenticado */
	const pathName = usePathname(); // Obtiene el path actual de la URL mediante el hook usePathname
	const router = useRouter();
	// Define las rutas que están relacionadas con la autenticación (login, registro, recuperación de contraseña)
	const protectedRoutes = ["/dashboard"];
	// Verifica si la ruta actual está en la lista de rutas de autenticación
	const isInProtectedRoute = protectedRoutes.includes(pathName);

	const getUserFromDB = async (uid: string) => {
		const path = `users/${uid}`;

		try {
			let res = await getDocument(path);
			setUser(res);
			setInLocalStorage("user", res);
		} catch (error) {
			console.error("Error getting user from DB:", error);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
			// Si el usuario está autenticado
			if (authUser) {
				const userInLocal = getFromLocalStorage("user");
				if (userInLocal) {
					setUser(userInLocal);
				} else {
					await getUserFromDB(authUser.uid);
				}
			} else {
				if (isInProtectedRoute) router.push("/");
			}
		});

		return () => unsubscribe();
	}, []);

	return user;
};
