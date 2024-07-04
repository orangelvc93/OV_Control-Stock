'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"


import { useForm } from "react-hook-form"
import * as z from 'zod'


export const FormLogin = () => {

    /*Estructura y validaciones del Formulario ============== */
    const formSchema = z.object({
        email: z.string().email('El formato del email es incorrecto. Ejemplo: user@example.com').min(1, { message: 'Este campo es requerido' }),
        password: z.string().min(6, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    })

    /* Configuramos el validador del formulario con Zod y establecemos los valores iniciales */
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
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
    const onSubmit = (user: z.infer<typeof formSchema>) => {
        console.log(user)
    }


    return (
        <>
            <div className="text-center">
                <h1 className="text-2xl font-semibold">
                    Iniciar Sesión
                </h1>
                <p className="text-sm text-muted-foreground">
                    Ingresa tu email y contraseña para iniciar sesión.
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">

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

                    <Link href='/forgot-password' className="underline text-muted-foreground underline-offset-4 hover:text-primary mb-6 text-sm text-end">
                        ¿Olvidaste la contraseña?
                    </Link>

                    {/* ===========Submit==================== */}
                    <Button type="submit">Iniciar Sesión</Button>
                </div>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                ¿Aun no tienes cuenta? {""}

                <Link href='/sign-up' className="underline  underline-offset-4 hover:text-primary">
                    Regístrate
                </Link>
            </p>
        </>
    )
}
