import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.26.0/+esm'

// Configura tu cliente de Supabase
const supabaseUrl = 'https://wegxwsdxqqgkpmjoleaa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlZ3h3c2R4cXFna3Btam9sZWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NzY4MjEsImV4cCI6MjAzNjA1MjgyMX0.eIQYsgcGr8QGRvSH6OuYNiSf-LpceDShqRWRYg999Oo'
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Guarda los datos del usuario en Supabase.
 * @param {string} name - Nombre del usuario.
 * @param {string} wish - Lo que el usuario desea que sea el bebé.
 * @param {string} guess - Lo que el usuario cree que será el bebé.
 * @returns {Promise} Una promesa que se resuelve cuando los datos se han guardado.
 */
export const saveUserData = async (name, wish, guess) => {
  const { data, error } = await supabase
    .from('users')
    .insert([
      { name, wish, guess }
    ])
  
  if (error) throw error
  return data
}

/**
 * Guarda los resultados del juego para el último usuario.
 * @param {number} time - Tiempo que tardó el usuario en completar el juego.
 * @param {number} attempts - Número de intentos que hizo el usuario.
 * @returns {Promise} Una promesa que se resuelve cuando los resultados se han guardado.
 */
export const saveGameResults = async (time, attempts) => {
  const { data, error } = await supabase
    .from('users')
    .select()
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) throw error

  const { data: updateData, error: updateError } = await supabase
    .from('users')
    .update({ time, attempts })
    .eq('id', data.id)

  if (updateError) throw updateError
  return updateData
}

/**
 * Obtiene todos los datos de usuarios y sus resultados.
 * @returns {Promise<Array>} Una promesa que se resuelve con un array de todos los datos.
 */
export const getAllData = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export default { saveUserData, saveGameResults, getAllData }