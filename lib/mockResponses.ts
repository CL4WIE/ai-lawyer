const DISCLAIMER =
  "\n\n_Note: This is general information based on Sri Lankan labour law and is not a substitute for advice from a licensed attorney or the Department of Labour (https://labourdept.gov.lk/)._";

interface Canned {
  keywords: RegExp;
  answer: string;
}

const RESPONSES: Canned[] = [
  {
    keywords:
      /\b(salary|wage|wages|unpaid|pay(check|ment)?|not paid|withhold)\b/i,
    answer:
      "Under Sri Lankan labour law, your employer is legally required to pay your salary on the agreed date. If wages are withheld, you have clear remedies:\n\n- **Shop and Office Employees Act (No. 19 of 1954)** and the **Wages Boards Ordinance** govern how and when wages must be paid.\n- **Deductions** from salary are permitted only in limited cases (EPF, ETF, PAYE, authorised advances). Arbitrary deductions are unlawful.\n- **File a complaint** with the **Department of Labour** — it is free and no lawyer is required. Go to the nearest Labour Office (you can locate one via labourdept.gov.lk) with your appointment letter, payslips, and any messages from the employer.\n- **Industrial Disputes Act:** if the matter is not resolved, the Labour Commissioner can refer it for conciliation, arbitration, or to a Labour Tribunal.\n\nWould you like me to draft a written complaint to the Commissioner of Labour?",
  },
  {
    keywords:
      /\b(terminat(e|ed|ion)|dismiss(ed|al)?|fire(d)?|sack(ed)?|redundan(t|cy)|lay[- ]?off)\b/i,
    answer:
      "Dismissal and termination are tightly regulated in Sri Lanka. Key points:\n\n- **Termination of Employment of Workmen (Special Provisions) Act (No. 45 of 1971)** — if your employer has **15 or more employees** and you have **at least 180 days of service in the preceding 12 months**, non-disciplinary termination requires **either your written consent or the prior written approval of the Commissioner of Labour**.\n- **Disciplinary dismissal** still requires a fair procedure: written charges, a chance to respond, and a proper inquiry. A dismissal without due process can be challenged as wrongful.\n- **Labour Tribunal:** a workman dismissed without just cause can apply to a **Labour Tribunal** under the **Industrial Disputes Act** within **6 months** of termination for reinstatement and/or compensation.\n- **Notice / compensation:** the terms depend on your contract, length of service, and the formula approved by the Commissioner for non-disciplinary termination.\n\nTell me a bit more — how long have you worked there, and what reason did the employer give? I can also draft a complaint to the Labour Department or a Labour Tribunal application letter.",
  },
  {
    keywords: /\b(epf|provident fund|etf|trust fund|retirement contribution)\b/i,
    answer:
      "Your **Employees' Provident Fund (EPF)** and **Employees' Trust Fund (ETF)** are statutory retirement benefits. In plain terms:\n\n- **EPF Act (No. 15 of 1958):** employer must contribute **12%** and deduct **8%** from your salary every month. Payments go to the Central Bank of Sri Lanka (EPF Department).\n- **ETF Act (No. 46 of 1980):** employer must contribute **3%** of your total earnings (this is **not** deducted from your salary).\n- **Coverage:** applies to almost all employees in the private sector and corporations, from day one of employment.\n- **Non-payment:** if your employer has not remitted EPF/ETF, you can check your balance at the Digital EPF service (labourdept.gov.lk) and **lodge a complaint with the Labour Department or the EPF Department** — they can investigate and recover arrears with surcharges.\n- **Withdrawal:** EPF can generally be withdrawn on retirement, permanent disability, leaving employment to migrate, or for female members on marriage; ETF can also be withdrawn after 5 years under certain conditions.\n\nWould you like me to draft a complaint letter about unpaid EPF/ETF contributions?",
  },
  {
    keywords:
      /\b(overtime|ot|extra hours|work(ing)? hours|hours of work|night work)\b/i,
    answer:
      "Working hours and overtime are regulated primarily by the **Shop and Office Employees Act** and the **Wages Boards Ordinance**:\n\n- **Normal hours:** generally **8 hours a day and 45 hours a week**, excluding a meal interval.\n- **Overtime rate:** time worked beyond normal hours must be paid at **not less than 1.5 times** the hourly rate.\n- **Weekly limit:** total overtime is typically capped at **12 hours per week** for shop and office employees.\n- **Women and night work:** restrictions apply under the Shop and Office Employees Act and related regulations; written consent and Labour Department approval may be needed in some cases.\n- **Rest day:** you are entitled to a weekly rest day (usually a day and a half).\n\nIf overtime is unpaid or you are being forced to work excessive hours, this is a matter for the **Department of Labour**. I can draft a complaint letter for you.",
  },
  {
    keywords: /\b(leave|annual leave|casual leave|sick leave|holiday)\b/i,
    answer:
      "Statutory leave entitlements for most Sri Lankan private-sector employees under the **Shop and Office Employees Act**:\n\n- **Annual leave:** **14 days paid leave** per year after the first year of service. In the first calendar year, leave accrues proportionally based on when you joined.\n- **Casual leave:** **7 days paid leave** per year (commonly used for short personal matters or minor illness).\n- **Public and Mercantile holidays:** paid holidays on days gazetted for the year.\n- **Sick leave:** medical certificate may be required; treatment varies by contract and trade/wages board.\n\nLeave cannot generally be refused arbitrarily, and unused annual leave must be paid out on termination. If your employer is denying statutory leave, you can complain to the Labour Department.",
  },
  {
    keywords: /\b(maternity|pregnan(t|cy)|baby|birth|nursing)\b/i,
    answer:
      "Maternity rights in Sri Lanka are covered by the **Maternity Benefits Ordinance (No. 32 of 1939, as amended)** and the **Shop and Office Employees Act**:\n\n- **Paid maternity leave:** **84 working days (roughly 12 weeks)** for the first two live births; **42 working days** for the third and subsequent live births.\n- **Pay:** full pay during maternity leave for covered employees.\n- **Nursing intervals:** two nursing intervals per day are permitted until the child is one year old.\n- **Protection against dismissal:** an employer may not dismiss a woman because she is pregnant or on maternity leave — this is a serious offence.\n- **Claim path:** complaints about denied maternity benefits go to the **Department of Labour**.\n\nWould you like me to draft a maternity leave application to your employer, or a complaint letter to the Labour Department?",
  },
  {
    keywords:
      /\b(gratuity|length of service|end of service benefit|retirement pay)\b/i,
    answer:
      "Gratuity is governed by the **Payment of Gratuity Act (No. 12 of 1983)**:\n\n- **Who qualifies:** employees in workplaces with **15 or more workers**, who have completed **at least 5 years of continuous service**.\n- **Formula:** **half a month's salary for each completed year of service** (for monthly-paid employees). For daily-paid workers, **14 days' wages per year** of service.\n- **When payable:** on termination of employment for any reason (resignation, retirement, dismissal, death).\n- **Time limit:** gratuity must be paid within **30 days** of becoming payable; after that, surcharges apply.\n- **Non-payment:** you can claim unpaid gratuity through the **Labour Department** or the **Labour Tribunal**.\n\nI can draft a written demand for gratuity or a complaint letter if the employer refuses to pay.",
  },
  {
    keywords:
      /\b(harass(ment)?|bully(ing)?|discriminat(e|ion)|hostile|sexual harassment)\b/i,
    answer:
      "Workplace harassment in Sri Lanka is addressed both through labour law and the Penal Code:\n\n- **Sexual harassment** is a criminal offence under **Section 345 of the Penal Code** and can be reported to the police.\n- Employers have a **duty of care** to provide a safe workplace; an employer who tolerates harassment may also face a complaint under the **Industrial Disputes Act** and at the **Labour Tribunal**.\n- **Practical steps:**\n  1. Keep dated notes of each incident — what was said or done, where, and any witnesses.\n  2. Make a **written complaint to your employer** (HR or the head of the organisation) and keep a copy.\n  3. If the employer does not act, complain to the **Department of Labour** and, for criminal conduct, to the police.\n\nWould you like me to draft an internal complaint letter to HR or a complaint to the Labour Commissioner?",
  },
  {
    keywords:
      /\b(safety|accident|injur(y|ed)|hazard|factory|workplace injury|compensation)\b/i,
    answer:
      "Workplace safety and injury compensation in Sri Lanka are governed by the **Factories Ordinance** and the **Workmen's Compensation Ordinance (No. 19 of 1934, as amended)**:\n\n- **Factories Ordinance:** the employer must provide safe equipment, guarding of machinery, ventilation, and a clean workplace. The **Occupational Safety and Health (OSH) Division** of the Labour Department inspects factories.\n- **Workmen's Compensation:** if you suffer a **personal injury by accident arising out of and in the course of your employment**, you are entitled to compensation from the employer (or their insurer) — regardless of fault.\n- **What to do:**\n  1. Get medical treatment immediately and keep all reports and bills.\n  2. Report the accident to the employer in writing as soon as possible.\n  3. Notify the **Commissioner for Workmen's Compensation** at the Labour Department.\n- **Fatal accidents:** dependants are entitled to compensation as well.\n\nI can draft a written injury report to your employer or a claim letter to the Commissioner for Workmen's Compensation.",
  },
  {
    keywords:
      /\b(trade union|union|collective bargaining|strike|industrial action)\b/i,
    answer:
      "Trade union rights in Sri Lanka are protected by the **Trade Unions Ordinance (No. 14 of 1935)** and the **Industrial Disputes Act**:\n\n- **Right to form and join unions:** any seven or more employees may form a trade union and register it with the **Registrar of Trade Unions** at the Labour Department.\n- **Protection against anti-union discrimination:** dismissing or victimising an employee for union activity is an **unfair labour practice** and can be challenged under the Industrial Disputes Act.\n- **Collective agreements** registered under the Industrial Disputes Act are legally binding on the employer and union.\n- **Strikes** are permitted subject to notice requirements and restrictions in essential services.\n\nWould you like me to draft a letter to register a union, or a complaint about anti-union action?",
  },
  {
    keywords:
      /\b(contract|appointment letter|offer letter|probation|permanent|temporary)\b/i,
    answer:
      "Some quick essentials about employment contracts under Sri Lankan labour law:\n\n- **Written contract / appointment letter:** not strictly required for every employee, but for shop and office employees the Act requires the employer to maintain records of employment.\n- **Probation:** a probation period must be clearly stated in the letter of appointment; during probation an employer has more flexibility but cannot dismiss in bad faith.\n- **Permanent employment:** once you cross the probation period (or the employer lets you continue beyond it without written extension), you are ordinarily treated as confirmed.\n- **Contract terms cannot waive statutory rights** — e.g. a contract clause that says \"no EPF\" or \"no gratuity\" is unenforceable.\n- **Changes in terms:** an employer generally cannot unilaterally reduce your pay or worsen conditions without your consent.\n\nTell me what your contract says (or doesn't say) and I can help you understand where you stand.",
  },
  {
    keywords: /\b(labour department|labour office|commissioner|labour tribunal)\b/i,
    answer:
      "The **Department of Labour** (https://labourdept.gov.lk/) is the main government body handling employment disputes in Sri Lanka. Key routes:\n\n- **Nearest Labour Office:** for most individual grievances (unpaid wages, EPF/ETF, gratuity, leave, termination) — filing a complaint is free and no lawyer is required.\n- **Commissioner of Labour:** conciliates disputes and can approve or refuse non-disciplinary terminations.\n- **Labour Tribunals** (under the Industrial Disputes Act): a workman can apply within **6 months** of termination for reinstatement and/or compensation. Filing is low-cost.\n- **Workmen's Compensation Commissioner:** handles workplace injury claims.\n- **EPF / ETF Divisions:** for provident and trust fund issues.\n\nIf you tell me your situation in plain language, I can point you to the right office and draft the letter you need.",
  },
];

const GENERIC =
  "I can help you understand your rights as an employee in Sri Lanka and draft documents you can submit to your employer, the **Department of Labour**, or a **Labour Tribunal**.\n\nCommon topics I can help with:\n\n- Unpaid salary, wages, or overtime\n- Termination, dismissal, or redundancy\n- EPF and ETF contributions\n- Annual, casual, and maternity leave\n- Gratuity on resignation or retirement\n- Workplace harassment or unsafe conditions\n- Trade union rights and collective bargaining\n\nCould you share a bit more about what happened? For example:\n\n- How long have you been employed?\n- Do you have an appointment letter or written contract?\n- What steps have you already taken (spoken to HR, written a letter, contacted the Labour Department)?";

export function getMockAnswer(userMessage: string): string {
  const trimmed = userMessage.trim();
  if (!trimmed) return GENERIC + DISCLAIMER;

  for (const r of RESPONSES) {
    if (r.keywords.test(trimmed)) {
      return r.answer + DISCLAIMER;
    }
  }
  return GENERIC + DISCLAIMER;
}
