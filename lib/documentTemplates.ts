import type { DocumentTemplate } from "@/types";

export interface TemplateField {
  id: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea";
}

export interface TemplateDef {
  id: DocumentTemplate;
  label: string;
  description: string;
  fields: TemplateField[];
  render: (values: Record<string, string>) => string;
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: "complaint",
    label: "Police Complaint Letter",
    description:
      "A formal complaint letter you can hand in at your local police station.",
    fields: [
      { id: "name", label: "Your full name", placeholder: "W. A. Perera" },
      {
        id: "address",
        label: "Your address",
        type: "textarea",
        placeholder: "No. 12, Galle Road, Colombo 03",
      },
      { id: "nic", label: "NIC number", placeholder: "200112345678" },
      {
        id: "station",
        label: "Police station",
        placeholder: "Bambalapitiya Police Station",
      },
      {
        id: "incident",
        label: "Describe what happened",
        type: "textarea",
        placeholder:
          "On 12 April 2026 at about 9:30 pm, while I was walking along…",
      },
    ],
    render: (v) => `${v.address || "[Your Address]"}

${formatDate()}

The Officer-in-Charge,
${v.station || "[Police Station]"},
Sri Lanka.

Dear Sir / Madam,

COMPLAINT REGARDING AN INCIDENT

I, ${v.name || "[Your Name]"} (NIC No. ${
      v.nic || "[NIC]"
    }), residing at the above address, wish to make a formal complaint regarding the following incident:

${v.incident || "[Describe the incident, date, time, location, and persons involved]"}

I respectfully request that this complaint be recorded in the Information Book and investigated according to law. I am willing to give a full statement and provide any further information required.

Please issue me an IB extract as proof that this complaint has been lodged.

Yours faithfully,

............................................
${v.name || "[Your Name]"}
NIC: ${v.nic || "[NIC]"}
`,
  },
  {
    id: "request",
    label: "Right to Information Request",
    description:
      "An RTI request to a Sri Lankan public authority under Act No. 12 of 2016.",
    fields: [
      { id: "name", label: "Your full name", placeholder: "W. A. Perera" },
      {
        id: "address",
        label: "Your address",
        type: "textarea",
        placeholder: "No. 12, Galle Road, Colombo 03",
      },
      { id: "nic", label: "NIC number", placeholder: "200112345678" },
      {
        id: "authority",
        label: "Public authority",
        placeholder: "Ministry of Education",
      },
      {
        id: "information",
        label: "Information requested",
        type: "textarea",
        placeholder:
          "A copy of the circular issued on 5 March 2026 regarding school transfers…",
      },
    ],
    render: (v) => `${v.address || "[Your Address]"}

${formatDate()}

The Information Officer,
${v.authority || "[Public Authority]"},
Sri Lanka.

Dear Sir / Madam,

REQUEST FOR INFORMATION UNDER THE RIGHT TO INFORMATION ACT, NO. 12 OF 2016

I, ${v.name || "[Your Name]"} (NIC No. ${
      v.nic || "[NIC]"
    }), a citizen of Sri Lanka, hereby request the following information under Section 24 of the Right to Information Act, No. 12 of 2016:

${v.information || "[Describe clearly the information you are requesting]"}

I prefer to receive the information by post / email to the address given above.

I understand that your institution is required to respond within fourteen (14) working days of receipt of this request.

Thank you for your assistance.

Yours faithfully,

............................................
${v.name || "[Your Name]"}
NIC: ${v.nic || "[NIC]"}
`,
  },
  {
    id: "custom",
    label: "Blank Document",
    description: "Start from an empty page and write your own content.",
    fields: [
      {
        id: "title",
        label: "Document title",
        placeholder: "e.g. Refund request to XYZ store",
      },
    ],
    render: (v) => `${v.title || "Untitled Document"}\n\n[Write your content here]\n`,
  },
];

export function getTemplate(id: DocumentTemplate): TemplateDef | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
