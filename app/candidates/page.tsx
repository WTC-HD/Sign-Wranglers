import { CANDIDATE_TIERS, partyAbbreviation } from "@/app/config/races";
import Link from "next/link";

export default function CandidatesPage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-12">
            <h1 className="text-2xl text-brand-accent [text-shadow:4px_4px_0_#000]">
                Candidate Directory
            </h1>

            <Link
                href="/"
                className="pixel-btn mt-6 bg-brand-primary px-4 py-3 text-xs text-brand-accent hover:bg-brand-primary-hover"
            >
                Back to Home
            </Link>

            {CANDIDATE_TIERS.map((tierGroup) => (
                <div key={tierGroup.tier} className="mt-10 w-full max-w-4xl">
                    <h2 className="border-b-2 border-brand-accent-muted pb-2 text-lg text-brand-accent">
                        {tierGroup.tier}
                    </h2>

                    {tierGroup.groups.map((group) => (
                        <div key={group.category} className="mt-6">
                            <p className="mb-3 text-xs uppercase tracking-wide text-brand-accent-muted">
                                {group.category}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {group.items.map((candidate) => (
                                    <div
                                        key={candidate.name}
                                        className="pixel-panel flex w-56 flex-col gap-2 bg-surface p-4"
                                    >
                                        <p className="text-sm text-brand-accent">
                                            {candidate.name}
                                        </p>

                                        {candidate.party != null && (
                                            <p className="text-xs text-brand-accent-muted">
                                                {candidate.party} {partyAbbreviation(candidate.party)}
                                            </p>
                                        )}

                                        {candidate.website != null && (
                                            <a
                                                href={candidate.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pixel-btn mt-2 bg-brand-primary px-3 py-2 text-center text-xs text-brand-accent hover:bg-brand-primary-hover"
                                            >
                                                Campaign Website
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </main>
    );
}
