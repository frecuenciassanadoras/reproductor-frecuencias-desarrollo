exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Método no permitido' };
    }

    try {
        const { email, password } = JSON.parse(event.body);

        // Aquí iría tu lógica de verificación con Supabase o tu base de datos
        // Por ahora, usamos una validación simple para probar el flujo
        if (email === 'demo@test.com' && password === '123456') {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Acceso concedido' })
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Email o contraseña incorrectos' })
            };
        }
    } catch (error) {
        return { statusCode: 500, body: 'Error interno del servidor' };
    }
};
