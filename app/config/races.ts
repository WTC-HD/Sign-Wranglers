type Candidate = {
  name: string;
  party?: string;
  website?: string;
}

type Tier = {
  tier: string;
  groups: { category: string; items: Candidate[] }[];
};

export function partyAbbreviation(party?: string) {
  if (party === "Republican") return "(R)";
  if (party === "Democratic") return "(D)";
  return "";
}

// The : Tier[] annotation matters here - without it, TypeScript infers a
// narrow type straight from this literal array, and any candidate missing
// an optional field (like party or website) breaks access to it elsewhere.
export const CANDIDATE_TIERS: Tier[] = [
  {
    tier: "National",
    groups: [
      { category: "US House", items: [
        {name: "Chuck Gray", party: "Republican", website: "https://chuckforwyoming.com/"},
        {name: "Lisa Kinney", party: "Democratic", website: "https://lisakinneyforcongress.com/"},
      ] },
      { category: "US Senate", items: [
        {name: "Harriet Hageman", party: "Republican", website: "https://hageman.house.gov/"},
        {name: "James Byrd", party: "Democratic", website: "https://www.byrdforsenate.com/"},
      ] },
    ],
  },
  {
    tier: "Statewide",
    groups: [
      { category: "Wyoming Governor", items: [
        {name: "Eric Barlow", party: "Republican", website: "https://www.barlowforwyo.com/"},
        {name: "Kenneth R. Casner", party: "Democratic", website: "https://wyodems.org/person/kenneth-r-casner/"},
      ] },
      { category: "Wyoming Secretary of State", items: [
        {name: "Robert Short", party: "Republican", website: "https://www.shortforstate.com/"},
        {name: "Bryan McCarty", party: "Democratic", website: "https://wyodems.org/person/bryan-mccarty/"},
      ] },
      { category: "Wyoming State Auditor", items: [{name: "Kristi Racines", party: "Republican", website: "https://www.kristiracines.com/"}] },
      { category: "Wyoming Superintendent of Public Instruction", items: [
        { name: "Steve Harshman", party: "Republican", website: "https://www.harshmanforwyoming.com/"},
        { name: "Ana Cordova", party: "Democratic", website: "https://www.facebook.com/Ana4WY/"},
      ] },
      { category: "Wyoming State Treasurer", items: [{name: "Curt Meier", party: "Republican", website: "https://www.meier4wyo.com/"}] },
    ],
  },
  {
    tier: "Local",
    groups: [
      { category: "Natrona County State House HD 35", items: [{name: "Christopher Dresang", party: "Republican", website: "https://www.dresangfornatrona.com/"}]},

      { category: "Natrona County State House HD 36", items: [
        {name: "Art Washut", party: "Republican", website: "https://artwashutforhouse36.com/"},
        {name: "Stewart McAdoo", party: "Democratic", website: "https://www.mcadoofordistrict36.com/"},
      ]},

      { category: "Natrona County State House HD 37", items: [
        {name: "Brian Costello", party: "Republican", website: "https://www.costelloforcasper.com/"},
        {name: "Betsy Erickson", party: "Democratic", website: "https://www.betsyerickson.com/"},
      ]},

      { category: "Natrona County State House HD 38", items: [
        {name: "Robert Hendry", party: "Republican", website: "https://www.hendryforhouse.com/"},
        {name: "Catherine McQueen", party: "Democratic", website: "https://ballotpedia.org/Catherine_McQueen"},
      ]},

      { category: "Natrona County State House HD 56", items: [{name: "Elissa Campbell", party: "Republican", website: "https://www.campbell4wyoming.com/"}]},

      { category: "Natrona County State House HD 57", items: [
        {name: "Julie Jarvis", party: "Republican", website: "https://jarviswyo.com/"},
        {name: "Luc Colgrove", party: "Democratic", website: "https://www.facebook.com/ColgroveForHD57"},
      ]},

      { category: "Natrona County State House HD 58", items: [
        {name: "Bill Allemand", party: "Republican", website: "https://www.facebook.com/RepBillAllemandHD58/"},
        {name: "Keenan Morgan", party: "Democratic", website: "https://wyodems.org/person/keenan-morgan/"},
      ]},

      { category: "Natrona County State House HD 59", items: [
        {name: "J.R. Riggins", party: "Republican", website: "https://jrforhouse.com/"},
        {name: "Laurie Longtine", party: "Democratic"},
      ]},

      { category: "Natrona County State House HD 62", items: [{name: "Kevin J. Campbell", party: "Republican"}]},

      { category: "Natrona County State Senate SD 27", items: [{name: "Kevin Helling", party: "Republican"}]},

      { category: "Natrona County State Senate SD 29", items: [{name: "Lisa Engebretsen", party: "Republican"}]},

      { category: "Natrona County City Council Ward I", items: [{name: "Brett Hobza"}]},
      { category: "Natrona County City Council Ward II", items: [
        {name: "Michael Bond"},
        {name: "Shane True"},
      ]},
      { category: "Natrona County City Council Ward III", items: [
        {name: "Terry Wingerter"},
        {name: "Brandy Haskins"},
      ]},

      { category: "Natrona County Commissioners", items: [
        {name: "Dallas Laird", party: "Republican"},
        {name: "Ray Pacheco", party: "Republican"},
        {name: "Matt Keating", party: "Republican"},
        {name: "Candace Machado", party: "Democratic"},
        {name: "Lisa Jamieson", party: "Democratic"},
      ]},

      { category: "Natrona County School Board", items: [
        {name: "Teal-Slate Sign (contains all candidates)"},
        {name: "Kevin Christopherson"},
        {name: "Michael Stedillie"},
        {name: "Eric Nelson"},
        {name: "Taylor Rosty"},
      ]},
    ],
  },
  {
    tier: "Ballot Initiatives",
    groups: [
      { category: "Property Tax Reduction", items: [{name: "No on tax reduction"}]},
    ]
  }
];
