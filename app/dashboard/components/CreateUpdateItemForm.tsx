"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";

/* Importaciones para el formulario */

import { addDocument, uploadBase64 } from "@/lib/firebase";
import { User } from "@/types/userTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer, toast } from "react-toastify";
import * as z from "zod";
import { ItemImage } from "@/types/ItemImageTypes";
import DragAndDropImage from "@/components/DragAndDropImage";
import { useUser } from "@/hooks/use-user";
import { Product } from "@/types/productTypes";

export function CreateUpdateItemForm() {
	const user = useUser();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	/*Estructura y validaciones del Formulario ============== */
	const formSchema = z.object({
		image: z.object({
			path: z.string(),
			url: z.string(),
		}),
		name: z
			.string()
			.min(4, { message: "El nombre debe tener al menos 4 caracteres" }),
		// "coerce" significa que la función intentará convertir el valor proporcionado en un número, incluso si el valor inicial no es estrictamente un número.
		price: z.coerce.number().gte(0, "El valor mínimo debe ser 0"),
		soldUnits: z.coerce.number().gte(0, "El valor mínimo debe ser 0"),
	});

	/* Configuramos el validador del formulario con Zod y establecemos los valores iniciales */
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			image: {} as ItemImage, // Aquí puedes proporcionar un valor inicial específico si lo deseas
			name: "", // Aquí también puedes proporcionar un valor inicial específico si lo deseas
			price: undefined,
			soldUnits: undefined,
		},
	});

	/* Extraemos las propiedades
    register: registra los datos de entrada y maneja el estado y la validación
    handleSubmit: maneja el evento de envío del formulario y ejecuta las funciones de callback
    formState: contiene información del estado del formulario
    setValue: Asignar un valor a un campo del formulario sin usar un input
    */
	const { register, handleSubmit, formState, setValue } = form;
	/* extraemos errors para tomar los errores de validación que ocurran  */
	const { errors } = formState;

	// Actualizar el valor de la imagen
	const handleImage = (url: string) => {
		let path = `${user?.uid}/${Date.now()}`;
		setValue("image", { url, path });
	};

	/* Crear o actualizar un producto============== */
	const onSubmit = async (item: z.infer<typeof formSchema>) => {
		console.log(item);
		createItem(item);
	};
	/* ============Crear item en la DB de Firebase ========================= */
	const createItem = async (item: Product) => {
		const path = `users/${user?.uid}/products`;
		setIsLoading(true);
		try {
			// Subir imagen y obtener url
			const base64 = item.image.url;
			const imagePath = item.image.path;
			const imageUrl = await uploadBase64(imagePath, base64);

			item.image.url = imageUrl;

			// Realizar la petición al backend para crear el item en la base de datos
			await addDocument(path, item);

			const notify = () =>
				toast.success(`Item creado con éxito`, {
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
		} catch (error: any) {
			console.log(error);
			const notify = () =>
				toast.warn(error.message, {
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
			// Cuando finaliza la solicitud finalizamos el loader
			setIsLoading(false);
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="px-6">
					Crear <CirclePlus className="w-[20px] ml-2" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Crear Producto</DialogTitle>
					<DialogDescription>
						Gestiona tu producto con la siguiente información
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid gap-2">
						{/* ==========Image================== */}
						<div className="mb-3">
							<label
								className="font-bold text-lg"
								htmlFor="name"
							>
								Imagen
							</label>
							<DragAndDropImage handleImage={handleImage} />
						</div>
						{/* ==========Name================== */}
						<div className="mb-3">
							<label
								className="font-bold text-lg"
								htmlFor="name"
							>
								Nombre
							</label>
							<Input
								{...register("name")}
								id="name"
								placeholder="Nombre del producto"
								type="text"
								autoComplete="name"
							/>
							<p className="form-error">{errors.name?.message}</p>
						</div>
						{/* ==========Precio================== */}
						<div className="mb-3">
							<label
								className="font-bold text-lg"
								htmlFor="price"
							>
								Precio
							</label>
							<Input
								{...register("price")}
								id="price"
								placeholder="0.00"
								type="number"
								step="0.01"
							/>
							<p className="form-error">{errors.price?.message}</p>
						</div>
						{/* ==========Unidades vendidas================== */}
						<div className="mb-3">
							<label
								className="font-bold text-lg"
								htmlFor="soldUnits"
							>
								Unidades vendidas
							</label>
							<Input
								{...register("soldUnits")}
								id="soldUnits"
								placeholder="0.00"
								type="number"
								step="1"
							/>
							<p className="form-error">{errors.soldUnits?.message}</p>
						</div>
						<DialogFooter>
							{/* ===========Submit==================== */}
							<Button
								type="submit"
								disabled={isLoading}
							>
								{isLoading && (
									<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
								)}
								Crear
							</Button>
						</DialogFooter>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
