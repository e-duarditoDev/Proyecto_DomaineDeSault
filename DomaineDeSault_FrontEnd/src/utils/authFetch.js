//Helper para el uso del token en siguientes llamadas a la APIRest

export const authFetch = async (url, options = {}) => {

    //Obtener el token del local storage
    const token = localStorage.getItem("token");

    //Montar el token para API
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    //Inyectar el token
    return fetch(url, {
        ...options,
        headers
    });
};