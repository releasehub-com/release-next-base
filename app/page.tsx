import { cookies } from "next/headers";
import ClientSideRenderer from "@/components/ClientSideRenderer";

export default function Home() {
  const cookieStore = cookies();
  const initialVersion = cookieStore.get("landing_version")?.value || "default";

  return <ClientSideRenderer initialVersion={initialVersion} />;
}
