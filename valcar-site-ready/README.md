# Valcar — Web de Compraventa de Coches

Catálogo con filtros + ficha del coche + reserva de cita. Hecho con **React + Vite + Tailwind**.

## Teléfono
- **Llamadas / WhatsApp**: `666 27 07 07`

## Datos de coches
- Los coches se cargan desde `public/cars.json`.
- Actualiza ese fichero para añadir/quitar coches (Vercel redeploy automático al hacer push).

## Ejecutar en local
```bash
npm install
npm run dev
# abre http://localhost:5173
```

## Deploy con GitHub + Vercel
1. Sube este proyecto a tu repositorio GitHub (por ejemplo `valcar-site`).
2. Ve a https://vercel.com → **Add New > Project** → Importa tu repo.
3. Vercel detecta Vite automáticamente:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy** y listo (te dará una URL pública).
5. (Opcional) Conecta un dominio en *Settings > Domains*.

## Estructura
```
public/
  cars.json      # Catálogo (editas aquí)
src/
  App.jsx        # Lógica de filtros + UI + drawer + formulario
  main.jsx
  index.css      # Tailwind
index.html
```

## Notas
- Para recibir las solicitudes del formulario por email, integra EmailJS/Formspree/Make dentro de `BookingForm`.
- Si quieres cargar coches desde Google Sheets, dímelo y te paso un fetch con CSV->JSON o API.
