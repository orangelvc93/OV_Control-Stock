import { Logo } from "@/components/Logo";
import { Metadata } from "next";
import { FormLogin } from "./components/FormLogin";

export const metadata: Metadata = {
	title: "Ingreso",
	description: "Pagina de ingreso a la aplicación.",
};

const AuthPage = () => {
	return (
		<section className="flex justify-center items-center md:h-[95vh] md:px-10 lg:px-25">
			{/* Contenedor de las columnas ================== */}
			<div className="container h-[85vh] flex-col justify-center md:grid lg:max-w-none lg:grid-cols-2 px-0">
				{/* Columna de imagen ================== */}
				<div className="relative hidden h-full flex-col p-10 text-white lg:flex">
					<div className="bg-auth absolute inset-0"></div>
					<Logo />

					<div className="relative z-20 mt-auto">
						<p>
							&ldquo;Esta aplicación web me ayudó a tener un control de los
							productos en stock &ldquo;
						</p>
						<footer className="text-sm">Orangel Valdespino</footer>
					</div>
				</div>

				{/* Columna del formulario ================== */}
				<div className="flex items-center md:h-[70vh] lg:p-8">
					<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
						<FormLogin />
					</div>
				</div>
			</div>
		</section>
	);
};

export default AuthPage;
