import { motion } from "framer-motion";
import type { LegalDocumentData } from "~/types/legal";
import LegalSectionBlock from "./Legalsectionblock";

interface LegalDocumentProps {
    data: LegalDocumentData;
}

const LegalDocument = ({ data }: LegalDocumentProps) => {
    return (
        <main className="pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            {data.eyebrow}
                        </span>
                        <div className="w-16 h-px bg-foreground/30" />
                    </div>
                    <h1 className="text-4xl md:text-6xl tracking-tight mb-12">
                        {data.title}
                    </h1>
                    <div className="text-sm text-muted-foreground mb-12">
                        {data.lastUpdated}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-12"
                >
                    {data.sections.map((section) => (
                        <section key={section.number} className="space-y-4">
                            <h2 className="text-xl tracking-tight">
                                {section.number} — {section.title}
                            </h2>
                            <div className="w-full h-px bg-border mb-4" />
                            {section.blocks.map((block, index) => (
                                <LegalSectionBlock
                                    key={`${section.number}-${index}`}
                                    block={block}
                                />
                            ))}
                        </section>
                    ))}
                </motion.div>
            </div>
        </main>
    );
};

export default LegalDocument;
