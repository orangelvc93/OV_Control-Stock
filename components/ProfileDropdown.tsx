"use client";
import {
	CircleUserRound,
	FileText,
	ImagePlus,
	LifeBuoy,
	LoaderCircle,
	LogOut,
	User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { fileToBase64 } from "@/actions/convert-file-to-base64";
import { signOutAccount, updateDocument, uploadBase64 } from "@/lib/firebase";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { setInLocalStorage } from "@/actions/set-in-localstorage";

export function ProfileDropdown() {
	let user = useUser();
	/* Posibilidad de actualizar la foto de perfil del usuario */
	const [image, setImage] = useState<string>("");

	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Implementación para seleccionar una imagen de perfil
	const chooseImage = async (event: any) => {
		setIsLoading(true);
		// Obtenemos el archivo seleccionado por el usuario
		const file = event.target.files[0];
		console.log(file);

		try {
			const base64 = await fileToBase64(file);
			console.log(base64);

			/* Una vez tenemos el archivo, lo subimos a firebase  */
			const imagePath = `${user?.uid}/profile`;
			const imageUrl = await uploadBase64(imagePath, base64);

			/* Una vez subida la imagen, procedemos a agregarlo al usuario en firebase */
			await updateDocument(`users/${user?.uid}`, { image: imageUrl });

			setImage(imageUrl);

			if (user) {
				user.image = imageUrl;
				setInLocalStorage("user", user);
			}

			const notify = () =>
				toast.success(`Imagen cargada con éxito`, {
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
		} catch (error) {
			toast.warn(`Error al cargar la imagen`, {
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
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (user?.image) setImage(user.image);
	}, [user]);

	return (
		<>
			{/* Agregamos el toast */}
			<ToastContainer limit={3} />

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">
						<span className="mr-2">Usuario</span>
						{image ? (
							<Image
								src={image}
								width={500}
								height={500}
								alt="user-img"
								className="object-cover w-6 h-6 rounded-full m-auto"
							/>
						) : (
							<CircleUserRound className="m-auto w-6 h-6" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel className="text-center">
						{isLoading ? (
							<LoaderCircle className="w-14 h-14 animate-spin m-auto mb-3" />
						) : (
							<>
								{image ? (
									<Image
										src={image}
										width={500}
										height={500}
										alt="user-img"
										className="object-cover w-20 h-20 rounded-full m-auto"
									/>
								) : (
									<CircleUserRound className="m-auto w-20 h-20" />
								)}
								<div className="flex justify-center relative bottom-2">
									<div>
										<input
											id="files"
											type="file"
											accept="image/png, image/jpeg, image/webp"
											onChange={(event) => chooseImage(event)}
											className="hidden"
										/>
										<label htmlFor="files">
											<div className="w-[40px] has-[28px] text-white cursor-pointer rounded-lg  bg-slate-950 hover:bg-slate-800 flex justify-center items-center">
												<ImagePlus className="w-[18px] has-[18px]:" />
											</div>
										</label>
									</div>
								</div>
							</>
						)}

						<div>{user?.name}</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<User className="mr-2 h-4 w-4" />
							<span>Usuario</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<FileText className="mr-2 h-4 w-4" />
							<span>Términos y condiciones</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<LifeBuoy className="mr-2 h-4 w-4" />
							<span>Soporte</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={signOutAccount}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Cerrar Sesión</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
