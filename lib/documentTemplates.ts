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
    label: "Complaint to the Commissioner of Labour",
    description:
      "A formal complaint to the Department of Labour regarding unpaid wages, unlawful termination, or unpaid EPF/ETF/gratuity.",
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
        id: "employer",
        label: "Employer (company) name and address",
        type: "textarea",
        placeholder: "ABC (Pvt) Ltd, No. 45, Union Place, Colombo 02",
      },
      {
        id: "position",
        label: "Your position / job title",
        placeholder: "Accounts Assistant",
      },
      {
        id: "joined",
        label: "Date you joined",
        placeholder: "15 January 2022",
      },
      {
        id: "issue",
        label: "Describe the issue",
        type: "textarea",
        placeholder:
          "My salary for March and April 2026 has not been paid despite repeated reminders…",
      },
    ],
    render: (v) => `${v.address || "[Your Address]"}

${formatDate()}

The Commissioner of Labour,
Department of Labour,
Labour Secretariat,
Colombo 05,
Sri Lanka.

Dear Sir / Madam,

COMPLAINT REGARDING A LABOUR MATTER

I, ${v.name || "[Your Name]"} (NIC No. ${
      v.nic || "[NIC]"
    }), residing at the above address, wish to lodge a formal complaint against my employer in respect of a labour matter.

Employer details:
${v.employer || "[Employer Name and Address]"}

Position held: ${v.position || "[Position]"}
Date of joining: ${v.joined || "[Date of joining]"}

Particulars of the complaint:

${
  v.issue ||
  "[Describe clearly what happened, the amounts involved (if any), the dates, and any steps you have already taken such as written reminders or discussions with HR]"
}

I respectfully request that this matter be inquired into under the Shop and Office Employees Act, the Wages Boards Ordinance, and/or the Industrial Disputes Act, as appropriate, and that my employer be directed to remedy the matter according to law.

I am willing to attend the Labour Office, provide any documents required, and give a full statement at an inquiry. I have enclosed copies of relevant documents in support of this complaint.

Yours faithfully,

............................................
${v.name || "[Your Name]"}
NIC: ${v.nic || "[NIC]"}
`,
  },
  {
    id: "request",
    label: "Right to Information Request — Department of Labour",
    description:
      "An RTI request to the Department of Labour under Act No. 12 of 2016 (e.g. EPF balance, inspection records, complaint status).",
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
        id: "information",
        label: "Information requested",
        type: "textarea",
        placeholder:
          "A statement of EPF contributions remitted by my employer ABC (Pvt) Ltd (EPF No. …) for the period January 2022 to April 2026.",
      },
    ],
    render: (v) => `${v.address || "[Your Address]"}

${formatDate()}

The Information Officer,
Department of Labour,
Labour Secretariat,
Colombo 05,
Sri Lanka.

Dear Sir / Madam,

REQUEST FOR INFORMATION UNDER THE RIGHT TO INFORMATION ACT, NO. 12 OF 2016

I, ${v.name || "[Your Name]"} (NIC No. ${
      v.nic || "[NIC]"
    }), a citizen of Sri Lanka, hereby request the following information from the Department of Labour under Section 24 of the Right to Information Act, No. 12 of 2016:

${
  v.information ||
  "[Describe clearly the information you are requesting — e.g. EPF/ETF contribution history, status of a complaint, inspection reports, circulars or guidelines]"
}

I prefer to receive the information by post / email to the address given above.

I understand that the Department is required to respond within fourteen (14) working days of receipt of this request.

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
    description:
      "Start from an empty page — useful for resignation letters, HR complaints, demand letters, etc.",
    fields: [
      {
        id: "title",
        label: "Document title",
        placeholder: "e.g. Resignation letter — ABC (Pvt) Ltd",
      },
    ],
    render: (v) => `${v.title || "Untitled Document"}\n\n[Write your content here]\n`,
  },
];

export function getTemplate(id: DocumentTemplate): TemplateDef | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
