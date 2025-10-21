import React, { useEffect, useMemo, useState } from "react"

// =============================
// 🔧 CONFIGURACIÓN RÁPIDA
// =============================
const PHONE_NUMBER = "666 27 07 07" // <- CAMBIA AQUÍ
const WHATSAPP_NUMBER = "666 27 07 07" // <- CAMBIA AQUÍ

function classNames(...c) {
  return c.filter(Boolean).join(" ")
}

function formatPrice(n) {
  if (typeof n !== "number") return "-"
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
      {children}
    </span>
  )
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs">
      {children}
    </span>
  )
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-semibold">{value ?? "-"}</span>
    </div>
  )
}

function CarCard({ car, onOpen }) {
  const kmTxt = car?.km != null ? car.km.toLocaleString("es-ES") : "-"
  const loc = car?.location || "Ciudad Real"

  return (
    <button
      onClick={() => onOpen(car)}
      className="group relative w-full overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:shadow-md focus:outline-none"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={car.images?.[0]}
          alt={car.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {car.fuel && <Badge>{car.fuel}</Badge>}
          {car.gearbox && <Badge>{car.gearbox}</Badge>}
        </div>
        <div className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-2 py-1 text-sm font-semibold">
          {formatPrice(car.price)}
        </div>
      </div>
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold">{car.title}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {car.year ?? "-"} · {kmTxt} km · {loc}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {car.power != null && <Chip>{car.power} CV</Chip>}
          {car.engine && <Chip>{car.engine}</Chip>}
        </div>
      </div>
    </button>
  )
}

function Drawer({ open, onClose, children }) {
  return (
    <div className={classNames("fixed inset-0 z-50", open ? "pointer-events-auto" : "pointer-events-none")}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={classNames("absolute inset-0 bg-black/40 transition-opacity", open ? "opacity-100" : "opacity-0")}
      />
      {/* Panel */}
      <div
        className={classNames(
          "absolute right-0 top-0 h-full w-full max-w-3xl transform bg-white shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

function BookingForm({ car }) {
  const [form, setForm] = useState({ name: "", phone: "", date: "", notes: "" })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Conecta este submit a EmailJS/Formspree/Make si quieres notificaciones
    console.log("Solicitud de cita:", { carId: car.id, ...form })
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-xl border bg-green-50 p-4 text-green-800">
        <h4 className="font-semibold">¡Solicitud enviada!</h4>
        <p className="mt-1 text-sm">Te contactaremos pronto para confirmar tu cita para ver el {car.title}.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid gap-1">
        <label className="text-sm font-medium">Nombre</label>
        <input
          name="name"
          required
          className="rounded-lg border px-3 py-2 outline-none focus:ring"
          placeholder="Tu nombre"
          value={form.name}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Teléfono</label>
        <input
          name="phone"
          required
          pattern="^[+0-9\s-]{6,}$"
          className="rounded-lg border px-3 py-2 outline-none focus:ring"
          placeholder="Tu teléfono"
          value={form.phone}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Fecha preferida</label>
        <input
          type="date"
          name="date"
          required
          className="rounded-lg border px-3 py-2 outline-none focus:ring"
          value={form.date}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Notas</label>
        <textarea
          name="notes"
          rows={3}
          className="rounded-lg border px-3 py-2 outline-none focus:ring"
          placeholder="Horario, dudas, etc."
          value={form.notes}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 font-semibold text-white transition hover:opacity-90"
      >
        Reservar cita
      </button>
    </form>
  )
}

export default function App() {
  const [cars, setCars] = useState([])
  const [query, setQuery] = useState("")
  const [fuel, setFuel] = useState("Todos")
  const [gearbox, setGearbox] = useState("Todos")
  const [maxPrice, setMaxPrice] = useState(60000)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch("/cars.json")
      .then((r) => r.json())
      .then((data) => setCars(Array.isArray(data) ? data : []))
      .catch(() => setCars([]))
  }, [])

  const fuels = useMemo(() => ["Todos", ...Array.from(new Set(cars.map((c) => c.fuel).filter(Boolean)))], [cars])
  const gearboxes = useMemo(() => ["Todos", ...Array.from(new Set(cars.map((c) => c.gearbox).filter(Boolean)))], [cars])

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      const haystack = [c.title, c.engine, c.color].filter(Boolean).join(" ").toLowerCase()
      const matchesQuery = haystack.includes(query.toLowerCase())
      const matchesFuel = fuel === "Todos" || c.fuel === fuel
      const matchesGearbox = gearbox === "Todos" || c.gearbox === gearbox
      const matchesPrice = typeof c.price === "number" ? c.price <= maxPrice : true
      return matchesQuery && matchesFuel && matchesGearbox && matchesPrice
    })
  }, [cars, query, fuel, gearbox, maxPrice])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black font-bold text-white">RRR</div>
            <div>
              <h1 className="text-lg font-bold leading-tight">rrrvehiculos</h1>
              <p className="text-xs text-gray-600">Coches de ocasión · Ciudad Real</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="rounded-xl border px-3 py-2 text-sm font-semibold">
              Llamar {PHONE_NUMBER}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\s|\+/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold">rrrvehiculos — ocasión en Ciudad Real</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sin compras online. Reserva una cita para verlo en persona o llámanos para más información.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="md:col-span-3">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por modelo, motor, color..."
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                />
              </div>
              <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="rounded-xl border px-3 py-2">
                {fuels.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <select value={gearbox} onChange={(e) => setGearbox(e.target.value)} className="rounded-xl border px-3 py-2">
                {gearboxes.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Precio máx.</label>
                <input
                  type="range"
                  min={5000}
                  max={60000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="w-28 text-right text-sm font-semibold">{formatPrice(maxPrice)}</div>
              </div>
            </div>
          </div>

          <div className="hidden items-center justify-center rounded-2xl bg-[url('https://images.unsplash.com/photo-1541447271487-09612b3f49a4?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center p-6 md:flex md:col-span-2">
            <div className="rounded-2xl bg-white/90 p-4 text-center shadow">
              <p className="text-sm">¿Quieres vender tu coche?</p>
              <p className="text-xs text-gray-600">Tasación sin compromiso</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\s|\+/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
              >
                Hablamos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Listado */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">No hay vehículos que coincidan con los filtros.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} onOpen={setSelected} />
            ))}
          </div>
        )}
      </section>

      {/* Drawer Ficha */}
      <Drawer open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div>
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <img src={selected.images?.[0]} alt={selected.title} className="h-full w-full object-cover" />
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl"
                aria-label="Cerrar"
              >
                ×
              </button>
              <div className="absolute bottom-4 right-4 rounded-xl bg-white/90 px-3 py-1 text-lg font-bold">
                {formatPrice(selected.price)}
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-5">
              <div className="md:col-span-3">
                <h3 className="text-xl font-bold">{selected.title}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {selected.year ?? "-"} · {(selected.km != null ? selected.km.toLocaleString("es-ES") : "-")} km · {selected.location || "Ciudad Real"}
                </p>

                {/* Highlights */}
                {selected.highlights?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.highlights.map((h, i) => (
                      <Badge key={i}>{h}</Badge>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border bg-gray-50 p-4 sm:grid-cols-3">
                  <Stat label="Combustible" value={selected.fuel} />
                  <Stat label="Cambio" value={selected.gearbox} />
                  <Stat label="Potencia" value={selected.power != null ? `${selected.power} CV` : "-"} />
                  <Stat label="Motor" value={selected.engine} />
                  <Stat label="Puertas" value={selected.doors != null ? `${selected.doors}` : "-"} />
                  <Stat label="Consumo" value={selected.consumption} />
                </div>

                {/* Features */}
                {selected.features?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold">Equipamiento</h4>
                    <ul className="mt-2 grid list-disc gap-x-6 gap-y-1 pl-5 sm:grid-cols-2">
                      {selected.features.map((f, i) => (
                        <li key={i} className="text-sm text-gray-700">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Contacto / Cita */}
              <aside className="md:col-span-2">
                <div className="rounded-2xl border p-4">
                  <h4 className="text-lg font-semibold">¿Te interesa?</h4>
                  <p className="mt-1 text-sm text-gray-600">Reserva una cita o llámanos ahora.</p>

                  <div className="mt-3 grid gap-2">
                    <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="inline-flex items-center justify-center rounded-xl border px-4 py-2 font-semibold">
                      Llamar {PHONE_NUMBER}
                    </a>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\s|\+/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 font-semibold text-white"
                    >
                      WhatsApp
                    </a>
                  </div>

                  <div className="mt-4 h-px bg-gray-200" />

                  <div className="mt-4">
                    <h5 className="mb-2 font-semibold">Reservar cita</h5>
                    <BookingForm car={selected} />
                  </div>
                </div>

                {/* Mini-galería */}
                {selected.images?.length > 1 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {selected.images.slice(1).map((src, i) => (
                      <img key={i} src={src} alt={`Foto ${i + 2}`} className="aspect-video w-full rounded-xl object-cover" />
                    ))}
                  </div>
                )}
              </aside>
            </div>
          </div>
        )}
      </Drawer>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-2">
          <div>
            <p className="font-semibold">rrrvehiculos</p>
            <p className="text-sm text-gray-600">Ciudad Real · L-V 10:00-14:00 / 16:00-20:00</p>
          </div>
          <div className="flex items-center gap-3 md:justify-end">
            <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="rounded-xl border px-3 py-2 text-sm font-semibold">
              Llamar
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\s|\+/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
