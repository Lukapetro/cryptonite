import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";
import Home from "~/components/Home";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main>
      <Home />
    </main>
  );
}
