import { createClient } from '@supabase/supabase-js';

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
      headers: { "Content-Type": "application/json" }
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data: usuario, error } = await supabase
      .from('nombre_de_tu_tabla') // Cambia esto por 'reproductor_usuarios' o 'taller_usuarios'
      .select('password')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Credenciales incorrectas" }),
        headers: { "Content-Type": "application/json" }
      };
    }

    // Comparación directa de contraseñas de texto plano
    if (usuario.password !== password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Credenciales incorrectas" }),
        headers: { "Content-Type": "application/json" }
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Login exitoso!" }),
      headers: { "Content-Type": "application/json" }
    };

  } catch (err) {
    console.error("Error en la función:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno del servidor" }),
      headers: { "Content-Type": "application/json" }
    };
  }
};
