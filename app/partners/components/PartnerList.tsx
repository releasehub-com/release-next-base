import { getPartners } from "../utils";
import PartnerIndex from "./PartnerIndex";

export default function PartnerList() {
  const partners = getPartners();
  return <PartnerIndex partners={partners} />;
}
