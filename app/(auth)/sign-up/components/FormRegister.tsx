'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createUser, updateUser } from "@/lib/firebase"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"


import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from 'zod'


export const FormRegister = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    /*Estructura y validaciones del Formulario ============== */
    const formSchema = z.object({
        uid: z.string(),
        name: z.string().min(4, { message: 'El nombre debe tener al menos 4 caracteres' }),
        email: z.string().email('El formato del email es incorrecto. Ejemplo: user@example.com').min(1, { message: 'Este campo es requerido' }),
        password: z.string().min(6, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    })

    /* Configuramos el validador del formulario con Zod y establecemos los valores iniciales */
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            uid: '', // Aquí puedes proporcionar un valor inicial específico si lo deseas
            name: '', // Aquí también puedes proporcionar un valor inicial específico si lo deseas
            email: '', // Aquí puedes proporcionar un valor inicial específico si lo deseas
            password: '', // Aquí también puedes proporcionar un valor inicial específico
        }
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
        console.log(user)
        // Apenas hacemos la solicitud el loader esta activo 
        setIsLoading(true)

        //Realizar la petición al backend para iniciar sesión 
        try {
            let res = await createUser(user);
            await updateUser({ displayName: user.name })
            console.log(res)
        } catch (error: any) {
            console.log(error)
            toast.error('Las credenciales del usuario no son validas', { duration: 3000 })
        } finally {
            // Cuando finaliza la solicitud finalizamos el loader 
            setIsLoading(false)
        }
    }


    return (
        <>
            <div className="text-center">
                <h1 className="text-2xl font-semibold">
                    Crear Nueva Cuenta
                </h1>
                <p className="text-sm text-muted-foreground">
                    Ingresa tus datos para crear una nueva cuenta.
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">

                    {/* ==========Name================== */}
                    <div className="mb-3">
                        <label className="font-bold text-lg" htmlFor="name">Nombre</label>
                        <Input
                            {...register('name')}
                            id="name"
                            placeholder="John Doe"
                            type="text"
                            autoComplete="name"
                        />
                        <p className="form-error">{errors.name?.message}</p>
                    </div>
                    {/* ==========Email================== */}
                    <div className="mb-3">
                        <label className="font-bold text-lg" htmlFor="email">Correo</label>
                        <Input
                            {...register('email')}
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoComplete="email"
                        />
                        <p className="form-error">{errors.email?.message}</p>
                    </div>
                    {/* ==========Password================== */}
                    <div className="mb-3">
                        <label className="font-bold text-lg" htmlFor="password">Contraseña</label>
                        <Input
                            {...register('password')}
                            id="password"
                            placeholder="name@example.com"
                            type="password"
                        />
                        <p className="form-error">{errors.password?.message}</p>
                    </div>



                    {/* ===========Submit==================== */}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && (<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />)}
                        Iniciar Sesión</Button>
                </div>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes una cuenta? {""}

                <Link href='/' className="underline  underline-offset-4 hover:text-primary">
                    Iniciar Sesión
                </Link>
            </p>
        </>
    )
}
