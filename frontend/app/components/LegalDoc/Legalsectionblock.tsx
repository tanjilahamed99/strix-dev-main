import type { LegalBlock } from "~/types/legal";

interface LegalSectionBlockProps {
    block: LegalBlock;
}

const LegalSectionBlock = ({ block }: LegalSectionBlockProps) => {
    switch (block.type) {
        case "paragraph":
            return (
                <p className="text-muted-foreground leading-relaxed">
                    {block.text}
                </p>
            );

        case "list":
            return (
                <div className="text-muted-foreground leading-relaxed">
                    {block.intro && <p>{block.intro}</p>}
                    <ul className="list-disc list-inside space-y-1 my-4">
                        {block.items.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                    {block.outro && <p>{block.outro}</p>}
                </div>
            );

        case "contact":
            return (
                <div className="text-sm">
                    {block.items.map((item) => (
                        <p key={item}>{item}</p>
                    ))}
                </div>
            );

        default:
            return null;
    }
};

export default LegalSectionBlock;
