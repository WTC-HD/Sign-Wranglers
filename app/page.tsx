"use client";
import { useState, useEffect, useRef } from "react";

const CANDIDATE_TIERS = [
  {
    tier: "National",
    groups: [
      { category: "US House", items: ["Kevin Christensen"] },
      { category: "US Senate", items: ["Sam Mead"] },
    ],
  },
  {
    tier: "Statewide",
    groups: [
      { category: "Wyoming Governor", items: ["Eric Barlow"] },
      { category: "Wyoming Secretary of State", items: ["Robert Short"] },
      { category: "Wyoming Superintendent of Public Instruction", items: ["Steve Harshman"] },
      { category: "Wyoming State Auditor", items: ["Kristi Racine"] },
      { category: "Wyoming State Treasurer", items: ["Curt Meier"] },
    ],
  },
  {
    tier: "Local",
    groups: [
      {
        category: "Natrona County State House",
        items: [
          "District 35 - Chris Dresang",
          "District 36 - Art Washut",
          "District 37 - Brian Costello",
          "District 38 - Robert Hendry",
          "District 56 - Elissa Campbell",
          "District 57 - Julie Jarvis",
          "District 58 - Peter Boyer",
          "District 59 - J.R. Riggins",
          "District 62 - Edis Allen",
        ],
      },
      {
        category: "Natrona County State Senate",
        items: [
          "District 27 - Kevin Helling",
          "District 29 - Lisa Engebretsen",
        ],
      },
      {
        category: "Natrona County City Council",
        items: [
          "Ward I - Brett Hobza",
          "Ward II - Michael Bond",
          "Ward II - Shane True",
          "Ward III - Kaycee Wiita",
          "Ward III - Brandy Haskins",
        ],
      },
      {
        category: "Natrona County Commissioners",
        items: ["Chad McNutt", "Ray Pacheco", "Charles Moore"],
      },
      {
        category: "Natrona County School Board",
        items: ["Teal-Slate Sign(contains all canidates", "Kevin Christopherson", "Michael Stedillie", "Eric Nelson", "Taylor Rosty", ],
      },
    ],
  },
  {
    tier: "Ballot Initatives",
    groups: [
        { category: "Property Tax Reduction", items: ["No on tax reduction"]},
    ]
  }
];


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
      <h1 className="text-2xl text-[#ffc72c] [text-shadow:4px_4px_0_#000]">
        Natrona County Political Sign Wranglers
      </h1>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => { setView("request"); setFormStep(1); }}
          className="pixel-btn bg-[#3d2817] px-4 py-3 text-xs text-[#ffc72c] hover:bg-[#5a3d24]"
        >
          Sign(s) Dropoff
        </button>

        <button
          onClick={() => { setView("pickup"); setFormStep(1); }}
          className="pixel-btn bg-[#3d2817] px-4 py-3 text-xs text-[#ffc72c] hover:bg-[#5a3d24]"
        >
          Sign(s) Removal
        </button>
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
                  className="pixel-btn flex w-80 items-center justify-between bg-[#3d2817] px-4 py-3 text-left text-xs text-[#ffc72c] hover:bg-[#5a3d24]"
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
                      className="pixel-panel absolute z-10 mt-2 max-h-80 w-80 overflow-y-auto bg-[#241a10] p-4"
                      onKeyDown={closeDropdownOnEnter}
                    >
                    {CANDIDATE_TIERS.map((tierGroup, tierIndex) => (
                      <div
                        key={tierGroup.tier}
                        className={tierIndex > 0 ? "mt-4 border-t border-[#5a3d24] pt-4" : ""}
                      >
                        <button
                          type="button"
                          onClick={() => toggleTier(tierGroup.tier)}
                          className="flex w-full items-center justify-between py-1 text-xs uppercase tracking-wide text-[#ffc72c]"
                        >
                          <span>{tierGroup.tier}</span>
                          <span>{openTiers.includes(tierGroup.tier) ? "▲" : "▼"}</span>
                        </button>

                        {openTiers.includes(tierGroup.tier) && (
                          <div className="mt-2">
                            {tierGroup.groups.map((group, index) => (
                              <div
                                key={group.category}
                                className={index > 0 ? "mt-3 border-t border-[#3d2817] pt-3" : ""}
                              >
                                <p className="mb-2 text-xs uppercase tracking-wide text-[#c9a227]">
                                  {group.category}
                                </p>
                                {group.items.map((candidate) => (
                                  <div
                                    key={candidate}
                                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#3d2817]"
                                  >
                                    <label className="flex flex-1 items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={selectedCandidates.includes(candidate)}
                                        onChange={() => toggleCandidate(candidate)}
                                        className="h-4 w-4 accent-[#ffc72c]"
                                      />
                                      {candidate}
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
                className="pixel-btn mt-8 bg-[#3d2817] px-4 py-3 text-xs text-[#ffc72c] hover:bg-[#5a3d24]"
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
                className="mt-8 block border-2 border-black bg-[#241a10] px-4 py-2 text-[#f5e6c8]"
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
                className="mt-8 block border-2 border-black bg-[#241a10] px-4 py-2 text-[#f5e6c8]"
              />

              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-8 block border-2 border-black bg-[#241a10] px-4 py-2 text-[#f5e6c8]"
              />

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setFormStep(1)}
                  className="pixel-btn bg-[#3d2817] px-4 py-3 text-xs text-[#ffc72c] hover:bg-[#5a3d24]"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="pixel-btn bg-[#3d2817] px-4 py-3 text-xs text-[#ffc72c] hover:bg-[#5a3d24]"
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
                className="mt-8 block border-2 border-black bg-[#241a10] px-4 py-2 text-[#f5e6c8]"
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
                className="mt-8 block border-2 border-black bg-[#241a10] px-4 py-2 text-[#f5e6c8]"
              />
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (optional, for a confirmation)"
                className="mt-8 block border-2 border-black bg-[#241a10] px-4 py-2 text-[#f5e6c8]"
              />

              <button
                onClick={() => setFormStep(2)}
                className="pixel-btn mt-8 bg-[#3d2817] px-4 py-3 text-xs text-[#ffc72c] hover:bg-[#5a3d24]"
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
                  className="h-4 w-4 accent-[#ffc72c]"
                />
                Pick up all signs in my yard
              </label>

              {!pickupAllSigns && (
              <div className="relative mt-8">
                <button
                  type="button"
                  onClick={() => setCandidateDropdownOpen(!candidateDropdownOpen)}
                  className="pixel-btn flex w-80 items-center justify-between bg-[#3d2817] px-4 py-3 text-left text-xs text-[#ffc72c] hover:bg-[#5a3d24]"
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
                      className="pixel-panel absolute z-10 mt-2 max-h-80 w-80 overflow-y-auto bg-[#241a10] p-4"
                      onKeyDown={closeDropdownOnEnter}
                    >
                    {CANDIDATE_TIERS.map((tierGroup, tierIndex) => (
                      <div
                        key={tierGroup.tier}
                        className={tierIndex > 0 ? "mt-4 border-t border-[#5a3d24] pt-4" : ""}
                      >
                        <button
                          type="button"
                          onClick={() => toggleTier(tierGroup.tier)}
                          className="flex w-full items-center justify-between py-1 text-xs uppercase tracking-wide text-[#ffc72c]"
                        >
                          <span>{tierGroup.tier}</span>
                          <span>{openTiers.includes(tierGroup.tier) ? "▲" : "▼"}</span>
                        </button>

                        {openTiers.includes(tierGroup.tier) && (
                          <div className="mt-2">
                            {tierGroup.groups.map((group, index) => (
                              <div
                                key={group.category}
                                className={index > 0 ? "mt-3 border-t border-[#3d2817] pt-3" : ""}
                              >
                                <p className="mb-2 text-xs uppercase tracking-wide text-[#c9a227]">
                                  {group.category}
                                </p>
                                {group.items.map((candidate) => (
                                  <div
                                    key={candidate}
                                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#3d2817]"
                                  >
                                    <label className="flex flex-1 items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={pickupCandidates.includes(candidate)}
                                        onChange={() => togglePickupCandidates(candidate)}
                                        className="h-4 w-4 accent-[#ffc72c]"
                                      />
                                      {candidate}
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
                  className="pixel-btn bg-[#3d2817] px-4 py-3 text-xs text-[#ffc72c] hover:bg-[#5a3d24]"
                >
                  Back
                </button>
                <button
                  onClick={handlePickupSubmit}
                  className="pixel-btn bg-[#3d2817] px-4 py-3 text-xs text-[#ffc72c] hover:bg-[#5a3d24]"
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