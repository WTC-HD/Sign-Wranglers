import { ELECTION_INFO } from "@/app/config/election";

export default function Ticker() {
  return (
    <div className="ticker w-full border-b-[3px] border-black bg-brand-primary py-2">
      <div className="ticker-track text-xs text-brand-accent">
        {[0, 1].map((i) => (
          <span key={i}>
            🗳 {ELECTION_INFO.name}: {ELECTION_INFO.date}
             — Polls open {ELECTION_INFO.opens} to {ELECTION_INFO.closes}.
             - {ELECTION_INFO.otherInfo} Source:{" "}
            <a
              href={ELECTION_INFO.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {ELECTION_INFO.sourceLabel}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}
