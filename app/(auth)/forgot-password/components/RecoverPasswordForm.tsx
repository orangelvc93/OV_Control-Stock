"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendResetEmail } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as z from "zod";

export const RecoverPasswordForm = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const router = useRouter();

	/*Estructura y validaciones del Formulario ============== */
	const formSchema = z.object({
		email: z
			.string()
			.email("El formato del email es incorrecto. Ejemplo: user@example.com")
			.min(1, { message: "Este campo es requerido" }),
	});

	/* Configuramos el validador del formulario con Zod y establecemos los valores iniciales */
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "", // Aquí puedes proporcionar un valor inicial específico si lo deseas
		},
	});

	/* Extraemos las propiedades
    register: registra los datos de entrada y maneja el estado y la validación
    handleSubmit: maneja el evento de envío del formulario y ejecuta las funciones de callback
    formState: contiene información del estado del formulario*/
	const { register, handleSubmit, formState } = form;
	/* extraemos errors para tomar los errores de validación que ocurran  */
	const { errors } = formState;

	/* Iniciar sesión============== */
	const onSubmit = async (user: z.infer<typeof formSchema>) => {
		/* console.log(user) */
		/* Apenas hacemos la solicitud el loader esta activo */
		setIsLoading(true);

		/* Realizar la petición al backend para enviar el correo de recuperación */
		try {
			await sendResetEmail(user.email);
			/* Definimos los parametros que debe tener el toast */
			const notify = () =>
				toast.success("Exito", {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
					transition: Bounce,
				});
			notify();
			setTimeout(() => {
				router.push("/");
			}, 4000);
		} catch (error: any) {
			console.log(error);

			/* Definimos los parametros que debe tener el toast */
			const notify = () =>
				toast.error("El usuario o contraseña son incorrectos!", {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
					transition: Bounce,
				});
			notify();
		} finally {
			/* Cuando finaliza la solicitud finalizamos el loader */
			setIsLoading(false);
		}
	};

	return (
		<div className="md:border border-solid border-gray-300 rounded-xl p-10">
			{/* Agregamos el toast */}
			<ToastContainer limit={3} />
			<div className="text-center">
				<h1 className="text-2xl font-semibold">Recuperar Contraseña</h1>
				<p className="text-sm text-muted-foreground">
					te enviaremos un correo para recuperar tu contraseña.
				</p>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="grid gap-2">
					{/* ==========Email================== */}
					<div className="mb-3">
						<label
							className="font-bold text-lg"
							htmlFor="email"
						>
							Correo
						</label>
						<Input
							{...register("email")}
							id="email"
							placeholder="name@example.com"
							type="email"
							autoComplete="email"
						/>
						<p className="form-error">{errors.email?.message}</p>
					</div>

					{/* ===========Submit==================== */}
					<Button
						type="submit"
						disabled={isLoading}
					>
						{isLoading && (
							<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
						)}
						Recuperar
					</Button>
				</div>
			</form>

			<p className="text-center text-sm text-muted-foreground mt-3">
				<Link
					href="/"
					className="underline  underline-offset-4 hover:text-primary"
				>
					{"<- Ir atras"}
				</Link>
			</p>
		</div>
	);
};
