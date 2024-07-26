"use client";

//En use-user.ts obtenemos los datos del usuario por primera vez y lo guardamos en localStorage para evitar peticiones innecesarias, ya que firebase cobra luego de las 50.000 consultas diarias.

export const setInLocalStorage = (key: string, value: any) => {
	return localStorage.setItem(key, JSON.stringify(value));
};
