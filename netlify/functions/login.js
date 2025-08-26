import { createClient } from '@supabase/supabase-js';

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return { statusCode: 400, body: "Email and password are required" };
  }

  // Aquí necesitas la URL y la API Key de Supabase
  const SUPABASE_URL = process.env.SUPABASE_URL || "TU_URL_DE_SUPABASE";
  const SUPABASE_KEY = process.env.SUPABASE_KEY || "TU_API_KEY_DE_SUPABASE";

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: usuarios, error } = await supabase
    .from('usuarios')
    .select('email, password')
    .eq('email', email)
    .single();

  if (error || !usuarios) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Usuario no encontrado" }),
    };
  }

  if (usuarios.password !== password) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Contraseña incorrecta" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Login exitoso!" }),
  };
};
