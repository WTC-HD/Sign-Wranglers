"use client";
import { useState, useEffect, useRef } from "react";
import { CANDIDATE_TIERS, partyAbbreviation } from "@/app/config/races";
import { SITE_CONFIG } from "@/app/config/site";
import Link from "next/link";

export default function Home() {
  const [view, setView] = useState("");
  const [formStep, setFormStep] = useState(1);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [candidateDropdownOpen, setCandidateDropdownOpen] = useState(false);
  const [openTiers, setOpenTiers] = useState<string[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [pickupCandidates, setPickupCandidates] = useState<string[]>([]);
  const [pickupAllSigns, setPickupAllSigns] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  function closeDropdownOnEnter(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
      setCandidateDropdownOpen(false);
    }
  }

  useEffect(() => {
    if (!statusMessage) return;

    const timer = setTimeout(() => setStatusMessage(""), 3000);

    return () => clearTimeout(timer);
  }, [statusMessage]);

  function toggleCandidate(name: string) {
    setSelectedCandidates((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  function toggleTier(tier: string) {
    setOpenTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  }

  function togglePickupCandidates(name: string) {
    setPickupCandidates((prev) => {
      if (prev.includes(name)) {
        return prev.filter((c) => c !== name);
      } else {
        return [...prev, name];
      }
    });
  }

  async function handleSubmit() {
    const requestData = {
      name: name,
      address: address,
      email: email,
      candidates: selectedCandidates,
    };

    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (result.success) {
      setStatusMessage("Request submitted");
      setName("");
      setAddress("");
      setEmail("");
      setSelectedCandidates([]);
      setFormStep(1);
    } else {
      setStatusMessage("Something went wrong: " + result.error);
    }
  }

  async function handlePickupSubmit() {
    const response = await fetch("/api/pickup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        address: address,
        email: email,
        candidates: pickupAllSigns ? ["All signs in yard"] : pickupCandidates
      }),
    });

    const result = await response.json();

    if (result.success) {
      setStatusMessage("Pickup requested!");
      setName("");
      setAddress("");
      setEmail("");
      setPickupCandidates([]);
      setPickupAllSigns(false);
      setFormStep(1);
    } else {
      setStatusMessage("Something went wrong: " + result.error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl text-brand-accent [text-shadow:4px_4px_0_#000]">
        {SITE_CONFIG.name}
      </h1>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => { setView("request"); setFormStep(1); }}
          className="pixel-btn bg-brand-primary px-4 py-3 text-xs text-brand-accent hover:bg-brand-primary-hover"
        >
          Sign(s) Dropoff
        </button>

        <button
          onClick={() => { setView("pickup"); setFormStep(1); }}
          className="pixel-btn bg-brand-primary px-4 py-3 text-xs text-brand-accent hover:bg-brand-primary-hover"
        >
          Sign(s) Removal
        </button>

        <Link
          href="/candidates"
          className="pixel-btn bg-brand-primary px-4 py-3 text-xs text-brand-accent hover:bg-brand-primary-hover"
        >
          Candidate Directory
        </Link>
      </div>

      {/* Page for requesting a sign */}
      {view === "request" && (
        <div>
          {formStep === 1 && (
            <>
              <div className="relative mt-8">
                <button
                  type="button"
                  onClick={() => setCandidateDropdownOpen(!candidateDropdownOpen)}
                  className="pixel-btn flex w-80 items-center justify-between bg-brand-primary px-4 py-3 text-left text-xs text-brand-accent hover:bg-brand-primary-hover"
                >
                  <span>
                    {selectedCandidates.length > 0
                      ? `${selectedCandidates.length} candidate(s) selected`
                      : "Select candidates"}
                  </span>
                  <span>{candidateDropdownOpen ? "▲" : "▼"}</span>
                </button>

                {candidateDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-0"
                      onClick={() => setCandidateDropdownOpen(false)}
                    />
                    <div
                      className="pixel-panel absolute z-10 mt-2 max-h-80 w-80 overflow-y-auto bg-surface p-4"
                      onKeyDown={closeDropdownOnEnter}
                    >
                    {CANDIDATE_TIERS.map((tierGroup, tierIndex) => (
                      <div
                        key={tierGroup.tier}
                        className={tierIndex > 0 ? "mt-4 border-t border-brand-primary-hover pt-4" : ""}
                      >
                        <button
                          type="button"
                          onClick={() => toggleTier(tierGroup.tier)}
                          className="flex w-full items-center justify-between py-1 text-xs uppercase tracking-wide text-brand-accent"
                        >
                          <span>{tierGroup.tier}</span>
                          <span>{openTiers.includes(tierGroup.tier) ? "▲" : "▼"}</span>
                        </button>

                        {openTiers.includes(tierGroup.tier) && (
                          <div className="mt-2">
                            {tierGroup.groups.map((group, index) => (
                              <div
                                key={group.category}
                                className={index > 0 ? "mt-3 border-t border-brand-primary pt-3" : ""}
                              >
                                <p className="mb-2 text-xs uppercase tracking-wide text-brand-accent-muted">
                                  {group.category}
                                </p>
                                {group.items.map((candidate) => (
                                  <div
                                    key={candidate.name}
                                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-brand-primary"
                                  >
                                    <label className="flex flex-1 items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={selectedCandidates.includes(candidate.name)}
                                        onChange={() => toggleCandidate(candidate.name)}
                                        className="h-4 w-4 accent-brand-accent"
                                      />
                                      {candidate.name} {partyAbbreviation(candidate.party)}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setFormStep(2)}
                className="pixel-btn mt-8 bg-brand-primary px-4 py-3 text-xs text-brand-accent hover:bg-brand-primary-hover"
              >
                Next
              </button>
            </>
          )}

          {formStep === 2 && (
            <>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addressRef.current?.focus();
                  }
                }}
                placeholder="Enter your name"
                className="mt-8 block border-2 border-black bg-surface px-4 py-2 text-foreground"
              />

              <input
                ref={addressRef}
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    emailRef.current?.focus();
                  }
                }}
                placeholder="Enter your address"
                className="mt-8 block border-2 border-black bg-surface px-4 py-2 text-foreground"
              />

              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-8 block border-2 border-black bg-surface px-4 py-2 text-foreground"
              />

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setFormStep(1)}
                  className="pixel-btn bg-brand-primary px-4 py-3 text-xs text-brand-accent hover:bg-brand-primary-hover"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="pixel-btn bg-brand-primary px-4 py-3 text-xs text-brand-accent hover:bg-brand-primary-hover"
                >
                  Submit
                </button>
              </div>
            </>
          )}

          {statusMessage && <p className="mt-4">{statusMessage}</p>}
        </div>
      )}

      {/* Page for picking up signs */}
      {view === "pickup" && (
        <div>
          {formStep === 1 && (
            <>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addressRef.current?.focus();
                  }
                }}
                placeholder="Enter name here"
                className="mt-8 block border-2 border-black bg-surface px-4 py-2 text-foreground"
              />
              <input
                ref={addressRef}
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    emailRef.current?.focus();
                  }
                }}
                placeholder="Enter the address"
                className="mt-8 block border-2 border-black bg-surface px-4 py-2 text-foreground"
              />
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (optional, for a confirmation)"
                className="mt-8 block border-2 border-black bg-surface px-4 py-2 text-foreground"
              />

              <button
                onClick={() => setFormStep(2)}
                className="pixel-btn mt-8 bg-brand-primary px-4 py-3 text-xs text-brand-accent hover:bg-brand-primary-hover"
              >
                Next
              </button>
            </>
          )}

          {formStep === 2 && (
            <>
              <label className="mt-8 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pickupAllSigns}
                  onChange={() => setPickupAllSigns(!pickupAllSigns)}
                  className="h-4 w-4 accent-brand-accent"
                />
                Pick up all signs in my yard
              </label>

              {!pickupAllSigns && (
              <div className="relative mt-8">
                <button
                  type="button"
                  onClick={() => setCandidateDropdownOpen(!candidateDropdownOpen)}
                  className="pixel-btn flex w-80 items-center justify-between bg-brand-primary px-4 py-3 text-left text-xs text-brand-accent hover:bg-brand-primary-hover"
                >
                  <span>
                    {pickupCandidates.length > 0
                      ? `${pickupCandidates.length} candidate(s) selected`
                      : "Select candidates"}
                  </span>
                  <span>{candidateDropdownOpen ? "▲" : "▼"}</span>
                </button>

                {candidateDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-0"
                      onClick={() => setCandidateDropdownOpen(false)}
                    />
                    <div
                      className="pixel-panel absolute z-10 mt-2 max-h-80 w-80 overflow-y-auto bg-surface p-4"
                      onKeyDown={closeDropdownOnEnter}
                    >
                    {CANDIDATE_TIERS.map((tierGroup, tierIndex) => (
                      <div
                        key={tierGroup.tier}
                        className={tierIndex > 0 ? "mt-4 border-t border-brand-primary-hover pt-4" : ""}
                      >
                        <button
                          type="button"
                          onClick={() => toggleTier(tierGroup.tier)}
                          className="flex w-full items-center justify-between py-1 text-xs uppercase tracking-wide text-brand-accent"
                        >
                          <span>{tierGroup.tier}</span>
                          <span>{openTiers.includes(tierGroup.tier) ? "▲" : "▼"}</span>
                        </button>

                        {openTiers.includes(tierGroup.tier) && (
                          <div className="mt-2">
                            {tierGroup.groups.map((group, index) => (
                              <div
                                key={group.category}
                                className={index > 0 ? "mt-3 border-t border-brand-primary pt-3" : ""}
                              >
                                <p className="mb-2 text-xs uppercase tracking-wide text-brand-accent-muted">
                                  {group.category}
                                </p>
                                {group.items.map((candidate) => (
                                  <div
                                    key={candidate.name}
                                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-brand-primary"
                                  >
                                    <label className="flex flex-1 items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={pickupCandidates.includes(candidate.name)}
                                        onChange={() => togglePickupCandidates(candidate.name)}
                                        className="h-4 w-4 accent-brand-accent"
                                      />
                                      {candidate.name} {partyAbbreviation(candidate.party)}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  </>
                )}
              </div>
              )}

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setFormStep(1)}
                  className="pixel-btn bg-brand-primary px-4 py-3 text-xs text-brand-accent hover:bg-brand-primary-hover"
                >
                  Back
                </button>
                <button
                  onClick={handlePickupSubmit}
                  className="pixel-btn bg-brand-primary px-4 py-3 text-xs text-brand-accent hover:bg-brand-primary-hover"
                >
                  Submit
                </button>
              </div>
            </>
          )}

          {statusMessage && <p className="mt-4">{statusMessage}</p>}
        </div>
      )}
    </main>
  );
}