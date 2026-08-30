"use client";
import { useState, useEffect, useRef } from "react";
import { CANDIDATE_TIERS, partyAbbreviation } from "@/app/config/races";
import Ticker from "@/app/components/Ticker";
import FeedbackSurvey from "@/app/components/FeedbackSurvey";
import Logo from "@/app/components/Logo";
import PopupHeader from "@/app/components/PopupHeader";
import { trackEventOnce } from "@/app/lib/trackEvent";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [view, setView] = useState("");
  const [formStep, setFormStep] = useState(1);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [candidateDropdownOpen, setCandidateDropdownOpen] = useState(false);
  const [openTiers, setOpenTiers] = useState<string[]>([]);
  const [openVoterInfoSections, setOpenVoterInfoSections] = useState<string[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [pickupCandidates, setPickupCandidates] = useState<string[]>([]);
  const [pickupAllSigns, setPickupAllSigns] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");

  const [pollingAddress, setPollingAddress] = useState("");
  const [showPollingPopup, setShowPollingPopup] = useState(false);
  const [showRegistrationGuide, setShowRegistrationGuide] = useState(false);

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

  function toggleVoterInfoSection(section: string) {
    setOpenVoterInfoSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
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
        // "All signs in yard" isn't a real candidate name - it's a sentinel
        // value so the admin dashboard can show what was actually requested
        // without a separate database column for this one edge case.
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
    <main className="flex min-h-screen flex-col pb-32">
      <Ticker />

      {/* flex-1 + justify-center vertically centers this whole block as a
          tight unit within the remaining viewport height, instead of
          stretching the button area to fill leftover space - that used to
          leave a big gap between the top row and the buttons. */}
      <div className="flex flex-1 flex-col items-center justify-center gap-1 px-6 pt-8 pb-2 text-center sm:px-12 md:px-16 md:pt-10 md:pb-2">
        {/* Shares the same max-w-3xl grid-cols-2 shape as the Candidate
            Directory / Voter Info row below, so the Logo's column lines
            up directly above Candidate Directory, and the polling panel's
            column lines up above Voter Info. */}
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 items-center gap-4 sm:grid-cols-2">
          <div className="flex justify-center">
            <Logo />
          </div>

          <div className="flex justify-center">
            <div className="pixel-panel w-full max-w-xs bg-surface p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-brand-accent-muted">
                Find Your Polling Place
              </p>

              <input
                type="text"
                value={pollingAddress}
                onChange={(e) => setPollingAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && pollingAddress) {
                    e.preventDefault();
                    setShowPollingPopup(true);
                    trackEventOnce("polling_lookup");
                  }
                }}
                placeholder="Enter your address"
                className="block w-full border-2 border-black bg-surface px-3 py-2 text-xs text-foreground"
              />

              <button
                onClick={() => {
                  setShowPollingPopup(true);
                  trackEventOnce("polling_lookup");
                }}
                disabled={!pollingAddress}
                className="pixel-btn mt-2 w-full bg-brand-primary px-3 py-2 text-xs text-brand-accent hover:bg-brand-primary-hover disabled:opacity-50"
              >
                Find My Polling Place
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-1">
          <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2">
            <Link
              href="/candidates"
              className="pixel-btn flex items-center justify-center gap-2 bg-brand-primary px-4 py-2 text-sm text-brand-accent hover:bg-brand-primary-hover"
            >
              <Image src="/logo-cowboy-gold.png" alt="" width={28} height={28} className="h-7 w-7" />
              Candidate Directory
            </Link>

            <button
              onClick={() => {
                setShowRegistrationGuide(true);
                trackEventOnce("voter_info_click");
              }}
              className="pixel-btn flex items-center justify-center gap-2 bg-brand-primary px-4 py-2 text-sm text-brand-accent hover:bg-brand-primary-hover"
            >
              <Image src="/registration-icon.png" alt="" width={28} height={28} className="h-7 w-7" />
              Voter Info
            </button>
          </div>

          <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              onClick={() => { setView("request"); setFormStep(1); }}
              className="pixel-btn bg-brand-primary px-4 py-2 text-sm text-brand-accent hover:bg-brand-primary-hover"
            >
              Sign(s) Dropoff
            </button>

            <button
              onClick={() => { setView("pickup"); setFormStep(1); }}
              className="pixel-btn bg-brand-primary px-4 py-2 text-sm text-brand-accent hover:bg-brand-primary-hover"
            >
              Sign(s) Removal
            </button>
          </div>
        </div>
      </div>

      {/* Wyoming's election isn't indexed by the Google Civic API yet
          (see app/api/polling-location/route.ts), so a real lookup
          fails for every address right now. Showing this instead of
          attempting a lookup that we know will fail. */}
      {showPollingPopup && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/60"
          onClick={() => setShowPollingPopup(false)}
        >
          <div
            className="pixel-panel mx-4 w-full max-w-xs bg-surface p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <PopupHeader title="Find Your Polling Place" onClose={() => setShowPollingPopup(false)} />

            <p className="text-xs text-brand-accent">
              Check back 2-3 weeks before an election to look up your polling place.
            </p>

            <a
              href="https://sos.wyo.gov/Elections/PollPlace/default.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-xs text-brand-accent-muted underline"
            >
              Or look up your polling place on the official WY SOS site
            </a>
          </div>
        </div>
      )}

      {showRegistrationGuide && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/60"
          onClick={() => setShowRegistrationGuide(false)}
        >
          <div
            className="pixel-panel mx-4 w-full max-w-sm max-h-[80vh] overflow-y-auto bg-surface p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <PopupHeader title="Voter Info" onClose={() => setShowRegistrationGuide(false)} />

            <div>
              <button
                type="button"
                onClick={() => toggleVoterInfoSection("Who Can Register")}
                className="flex w-full items-center justify-between py-1 text-xs uppercase tracking-wide text-brand-accent"
              >
                <span>Who Can Register</span>
                <span>{openVoterInfoSections.includes("Who Can Register") ? "▲" : "▼"}</span>
              </button>

              {openVoterInfoSections.includes("Who Can Register") && (
                <>
                  <p className="mt-2 text-xs text-brand-accent">
                    You must be 18 or older on Election Day, a U.S. citizen, and a
                    Wyoming resident for at least 30 days before the election. Past
                    felony convictions don&apos;t disqualify you if your voting
                    rights have been restored.
                  </p>

                  <a
                    href="https://sos.wyo.gov/elections/state/registeringtovote.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-xs text-brand-accent-muted underline"
                  >
                    Source: Wyoming Secretary of State
                  </a>
                </>
              )}
            </div>

            <div className="mt-3 border-t border-brand-primary-hover pt-3">
              <button
                type="button"
                onClick={() => toggleVoterInfoSection("Ways To Register")}
                className="flex w-full items-center justify-between py-1 text-xs uppercase tracking-wide text-brand-accent"
              >
                <span>Ways To Register</span>
                <span>{openVoterInfoSections.includes("Ways To Register") ? "▲" : "▼"}</span>
              </button>

              {openVoterInfoSections.includes("Ways To Register") && (
                <>
                  <p className="mt-2 text-xs text-brand-accent">
                    In person at your county clerk&apos;s office, by mail (notarized,
                    at least 14 days before the election), or same-day at your
                    polling place on Election Day itself.
                  </p>

                  <a
                    href="https://sos.wyo.gov/elections/state/registeringtovote.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-xs text-brand-accent-muted underline"
                  >
                    Full registration details: Wyoming Secretary of State
                  </a>
                </>
              )}
            </div>

            <div className="mt-3 border-t border-brand-primary-hover pt-3">
              <button
                type="button"
                onClick={() => toggleVoterInfoSection("Voting In Person")}
                className="flex w-full items-center justify-between py-1 text-xs uppercase tracking-wide text-brand-accent"
              >
                <span>Voting In Person</span>
                <span>{openVoterInfoSections.includes("Voting In Person") ? "▲" : "▼"}</span>
              </button>

              {openVoterInfoSections.includes("Voting In Person") && (
                <>
                  <p className="mt-2 text-xs text-brand-accent">
                    Bring a valid Wyoming driver&apos;s license. If you don&apos;t
                    have one, bring the last four digits of your Social Security
                    number plus another form of ID (passport, military ID, tribal
                    ID, student ID, etc.).
                  </p>

                  <a
                    href="https://sos.wyo.gov/Elections/VoterID/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-xs text-brand-accent-muted underline"
                  >
                    Source: Wyoming Secretary of State
                  </a>
                </>
              )}
            </div>

            <div className="mt-3 border-t border-brand-primary-hover pt-3">
              <button
                type="button"
                onClick={() => toggleVoterInfoSection("Absentee & Mail Voting")}
                className="flex w-full items-center justify-between py-1 text-xs uppercase tracking-wide text-brand-accent"
              >
                <span>Absentee &amp; Mail Voting</span>
                <span>{openVoterInfoSections.includes("Absentee & Mail Voting") ? "▲" : "▼"}</span>
              </button>

              {openVoterInfoSections.includes("Absentee & Mail Voting") && (
                <>
                  <p className="mt-2 text-xs text-brand-accent">
                    Any registered voter can request an absentee ballot from their
                    county clerk (by phone, mail, email, in person, or online) any
                    time during the election year, up until Election Day itself.
                    Ballots go out starting 28 days before the election (45 days
                    for military/overseas voters). Your completed ballot must
                    reach the county clerk&apos;s office by 7:00 PM on Election
                    Day — mail can take up to a week, so send it back early.
                    Once the clerk receives it, your ballot is final and can&apos;t
                    be changed.
                  </p>

                  <a
                    href="https://sos.wyo.gov/elections/state/absenteevoting.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-xs text-brand-accent-muted underline"
                  >
                    Full absentee voting details: Wyoming Secretary of State
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page for requesting a sign */}
      {view === "request" && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/60"
          onClick={() => setView("")}
        >
          <div
            className="pixel-panel mx-4 w-full max-w-xs max-h-[80vh] overflow-y-auto bg-surface p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
          <PopupHeader title="Sign(s) Dropoff" onClose={() => setView("")} />

          {formStep === 1 && (
            <>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCandidateDropdownOpen(!candidateDropdownOpen)}
                  className="pixel-btn flex w-full items-center justify-between bg-brand-primary px-4 py-3 text-left text-xs text-brand-accent hover:bg-brand-primary-hover"
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
                    {/* Invisible full-screen div behind the dropdown panel -
                        clicking anywhere outside the panel hits this and
                        closes it, without needing a document-level listener. */}
                    <div
                      className="fixed inset-0 z-0"
                      onClick={() => setCandidateDropdownOpen(false)}
                    />
                    <div
                      className="pixel-panel relative z-10 mt-2 w-full bg-surface p-4"
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
                className="block w-full border-2 border-black bg-surface px-4 py-2 text-foreground"
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
                className="mt-4 block w-full border-2 border-black bg-surface px-4 py-2 text-foreground"
              />

              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-4 block w-full border-2 border-black bg-surface px-4 py-2 text-foreground"
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

          {statusMessage && <p className="mt-4 text-xs text-brand-accent">{statusMessage}</p>}
          </div>
        </div>
      )}

      {/* Page for picking up signs */}
      {view === "pickup" && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/60"
          onClick={() => setView("")}
        >
          <div
            className="pixel-panel mx-4 w-full max-w-xs max-h-[80vh] overflow-y-auto bg-surface p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
          <PopupHeader title="Sign(s) Removal" onClose={() => setView("")} />

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
                className="block w-full border-2 border-black bg-surface px-4 py-2 text-foreground"
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
                className="mt-4 block w-full border-2 border-black bg-surface px-4 py-2 text-foreground"
              />
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (optional, for a confirmation)"
                className="mt-4 block w-full border-2 border-black bg-surface px-4 py-2 text-foreground"
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
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pickupAllSigns}
                  onChange={() => setPickupAllSigns(!pickupAllSigns)}
                  className="h-4 w-4 accent-brand-accent"
                />
                Pick up all signs in my yard
              </label>

              {!pickupAllSigns && (
              <div className="relative mt-4">
                <button
                  type="button"
                  onClick={() => setCandidateDropdownOpen(!candidateDropdownOpen)}
                  className="pixel-btn flex w-full items-center justify-between bg-brand-primary px-4 py-3 text-left text-xs text-brand-accent hover:bg-brand-primary-hover"
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
                    {/* Invisible full-screen div behind the dropdown panel -
                        clicking anywhere outside the panel hits this and
                        closes it, without needing a document-level listener. */}
                    <div
                      className="fixed inset-0 z-0"
                      onClick={() => setCandidateDropdownOpen(false)}
                    />
                    <div
                      className="pixel-panel relative z-10 mt-2 w-full bg-surface p-4"
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

          {statusMessage && <p className="mt-4 text-xs text-brand-accent">{statusMessage}</p>}
          </div>
        </div>
      )}

      <FeedbackSurvey />
    </main>
  );
}
