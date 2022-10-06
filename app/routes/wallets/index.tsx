import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      Nessun wallet selezionato. Seleziona un wallet a sinistra,{" "}
      <Link to="new" className="text-blue-500 underline">
        oppure creane uno nuovo.
      </Link>
    </p>
  );
}
