import LegalDocument from "~/components/LegalDoc/Legaldocument";
import { termsOfServiceData } from "~/Data/Termsofservice";

export default function TermsOfService() {
    return <LegalDocument data={termsOfServiceData} />;
}
