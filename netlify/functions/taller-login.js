import { createClient } from '@supabase/supabase-js';

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: "Method Not Allowed",
      headers: { "Content-Type": "text/plain" }
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: "Email and password are required" }),
        headers: { "Content-Type": "application/json" }
      };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL || "https://dothtuwrsplezhaxkjmw.supabase.co";
    const SUPABASE_KEY = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvdGh0dXdyc3BsZXpoYXhram13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NzIzMjEsImV4cCI6MjA3MTI0ODMyMX0.B13yokCG9VQ49kjZ5pHeBdqBtW7i2CP8yg2l2Ekhqnc";

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data: usuarios, error } = await supabase
      .from('taller_usuarios')
      .select('email, password')
      .eq('email', email)
      .single();

    if (error || !usuarios) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Usuario no encontrado" }),
        headers: { "Content-Type": "application/json" }
      };
    }

    // Nota importante: Las contraseñas en texto plano no son seguras.
    // Deberías usar hashing (ej. bcrypt) para compararlas.
    if (usuarios.password !== password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Contraseña incorrecta" }),
        headers: { "Content-Type": "application/json" }
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Login exitoso!" }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (err) {
    console.error("Error en la función Lambda:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno del servidor" }),
      headers: { "Content-Type": "application/json" }
    };
  }
};
