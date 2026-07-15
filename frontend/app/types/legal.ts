export type LegalBlock =
    | { type: "paragraph"; text: string }
    | { type: "list"; intro?: string; items: string[]; outro?: string }
    | { type: "contact"; items: string[] };

export interface LegalSection {
    number: string;
    title: string;
    blocks: LegalBlock[];
}

export interface LegalDocumentData {
    eyebrow: string;
    title: string;
    lastUpdated: string;
    sections: LegalSection[];
}
