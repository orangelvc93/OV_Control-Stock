"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { useUser } from "@/hooks/use-user";
import { redirect, usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	/* ----- Si un usuario autenticado intenta acceder a una de las páginas de autenticación (como el login o el registro), será redirigido automáticamente al dashboard, ya que no tiene sentido que un usuario autenticado vea las páginas de autenticación. ------ */
	// Importa los hooks useUser y usePathname desde su respectivo módulo
	const user = useUser(); // Obtiene la información del usuario autenticado mediante el hook useUser
	const pathName = usePathname(); // Obtiene el path actual de la URL mediante el hook usePathname
	// Define las rutas que están relacionadas con la autenticación (login, registro, recuperación de contraseña)
	const authRoutes = ["/", "/sign-up", "forgot-password"];
	// Verifica si la ruta actual está en la lista de rutas de autenticación
	const isInAuthRoute = authRoutes.includes(pathName);
	// Si el usuario está autenticado y la ruta actual es una de las rutas de autenticación,
	// redirige al usuario al dashboard
	if (user && isInAuthRoute) return redirect("/dashboard");

	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
