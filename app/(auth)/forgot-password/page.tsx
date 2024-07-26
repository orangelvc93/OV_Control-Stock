import { Logo } from "@/components/Logo";
import { Metadata } from "next";
import { RecoverPasswordForm } from "./components/RecoverPasswordForm";

export const metadata: Metadata = {
	title: "Recuperar Contraseña",
	description:
		"te enviaremos un correo para recuperar tu usuario y contraseña.",
};

const ForgotPassword = () => {
	return (
		<div className="flex items-center md:h-[70vh] lg:p-8">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
				<RecoverPasswordForm />
			</div>
		</div>
	);
};

export default ForgotPassword;
