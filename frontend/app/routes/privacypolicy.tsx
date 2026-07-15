import LegalDocument from "~/components/LegalDoc/Legaldocument";
import { privacyPolicyData } from "~/Data/Privacypolicy";

export default function PrivacyPolicy() {
    return <LegalDocument data={privacyPolicyData} />;
}
