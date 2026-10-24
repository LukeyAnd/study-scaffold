/* Supplied Gemini tax content; retained as an unverified example bank. */
(function () {
'use strict';
const TOPICS = [
  { id: 't1', name: '1. Tax Research & Courts' },
  { id: 't2', name: '2. Tax Planning & NPV' },
  { id: 't3', name: '3. Entity Selection (SE/QBI)' },
  { id: 't4', name: '4. Corp & Partnership Formation' },
  { id: 't5', name: '5. Gross Income & Deferrals' },
  { id: 't6', name: '6. Book-to-Tax & 163(j)' },
  { id: 't7', name: '7. Basis & Loss Limitations' },
  { id: 't8', name: '8. Corp & Partnership Liquidations' },
  { id: 't9', name: '9. State Tax & Apportionment' }
];

const GLOSSARY = {
  'Golsen Rule': 'Tax Court policy requiring it to follow the binding precedent of the specific U.S. Circuit Court of Appeals to which the taxpayer can appeal.',
  'IRC 7701(o)': 'Codified Economic Substance Doctrine: requires BOTH (1) an objective meaningful change in economic position AND (2) a subjective substantial non-tax purpose.',
  'IRC 199A': 'Qualified Business Income (QBI) deduction: up to 20% of pass-through ordinary business income (excludes S Corp W-2 wages and partner guaranteed payments).',
  'IRC 1361': 'S Corporation eligibility statute: max 100 shareholders (family = 1), 1 class of stock (voting differences allowed), only U.S. individuals/estates/certain trusts.',
  'IRC 351(b)': 'Corporate formation boot rule: Recognized Gain = lesser of Realized Gain or Boot Received. Losses are never recognized under IRC 351.',
  'IRC 351': 'Corporate formation nonrecognition: $0 gain/loss if property is transferred solely for stock and property transferors own >= 80% control immediately after.',
  'IRC 357(c)': 'Liabilities in excess of basis: if total liabilities assumed by the corporation exceed aggregate adjusted basis of transferred property, excess is recognized as gain and stock basis becomes $0.',
  'IRC 358': 'Shareholder stock basis formula: Adjusted Basis of Property + Gain Recognized - Boot Received - Liabilities Assumed.',
  'IRC 362': 'Corporate inside basis formula: Transferor Adjusted Basis + Gain Recognized by Transferor.',
  'IRC 721': 'Partnership formation nonrecognition: $0 gain/loss when contributing property for a partnership interest (does NOT protect receipt of a capital interest for services).',
  'IRC 722': 'Partner initial outside basis: Cash contributed + Adjusted Basis of property contributed + Gain recognized (adjusted for IRC 752 debt shifts).',
  'IRC 704(c)': 'Built-in gain/loss rule: pre-contribution built-in gain or loss (FMV - Basis at contribution) MUST be allocated back to the contributing partner upon sale.',
  'IRC 752': 'Partnership liability shifts: increases in a partner share of debt = deemed cash contribution (+basis); decreases or individual debt assumed = deemed cash distribution (-basis).',
  'IRC 1223': 'Holding period tacking: contributing Capital or Section 1231 assets tacks prior holding period; ordinary assets (cash/inventory) start fresh at Day 1.',
  'IRC 451(c)': 'Advance payment deferral (with Rev. Proc. 2004-34): accrual taxpayer recognizes Year 1 Book (AFS) revenue in Year 1 and MUST recognize 100% of remaining unearned revenue in Year 2.',
  'IRC 104(a)(2)': 'Personal physical injury exclusion: excludes compensatory damages (including lost wages) on account of physical injury/sickness. Punitive damages and non-physical torts are taxable.',
  'ASC 740': 'GAAP accounting for income taxes: temporary differences create Deferred Tax Assets (DTAs) or Deferred Tax Liabilities (DTLs); permanent differences impact Effective Tax Rate only.',
  'IRC 163(j)': 'Business interest limitation: caps deductible business interest expense at 100% of Business Interest Income + 30% of Adjusted Taxable Income (ATI). Excess carries forward indefinitely.',
  'IRC 705': 'Partner outside basis rollforward: + Taxable Income + Tax-Exempt Income + Debt Increase - Distributions - Losses - Nondeductible Expenses.',
  'IRC 704(d)': 'Hurdle 1 of loss limits: partner loss deduction is capped at total Outside Basis (includes recourse and nonrecourse debt). Excess carries forward indefinitely.',
  'IRC 465': 'Hurdle 2 of loss limits (At-Risk): caps loss at economic risk (Cash + Basis + Recourse Debt + Qualified Nonrecourse Real Estate Financing; excludes regular nonrecourse debt).',
  'IRC 469': 'Hurdle 3 of loss limits (Passive Activity Loss): passive losses clearing IRC 465 can only offset passive income until complete disposition of the activity.',
  'IRC 731(a)(2)': 'Partnership liquidating loss rule: loss is recognized ONLY if partner receives SOLELY cash, unrealized receivables, and/or inventory. Any other property (e.g., land) blocks loss recognition.',
  'IRC 731': 'Partnership distribution recognition: partner recognizes gain ONLY if Cash Distributed > Outside Basis immediately before distribution.',
  'IRC 732(a)': 'Non-liquidating property distribution basis: carryover of partnership inside basis, capped at partner remaining outside basis after deducting cash.',
  'IRC 732(b)': 'Liquidating property distribution basis: distributed non-hot property takes a substituted basis equal to partner remaining outside basis after cash and inventory/receivables.',
  'IRC 336(b)': 'Corporate liquidation liability floor: if distributed property is subject to a liability > actual FMV, Deemed FMV for corporate gain equals the liability.',
  'IRC 336(a)': 'Corporate liquidation recognition: liquidating C Corporation recognizes gain or loss as if it sold distributed property to shareholders at Fair Market Value.',
  'IRC 331': 'Shareholder corporate liquidation rule: shareholder treats net FMV received as full payment in exchange for stock (Net FMV - Stock Basis = Capital Gain/Loss).',
  'Public Law 86-272': 'Federal statute granting state NET INCOME TAX immunity if out-of-state seller only solicits orders for tangible personal property approved and shipped from out-of-state.'
};


const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const fmt = (n) => '$' + Math.round(n).toLocaleString();


const GENERATORS = [
  // ==================== MODULE 1: TAX RESEARCH (6 ANGLES) ====================
  {
    id: 't1_1_golsen', topic: 't1', archNum: 1, angle: 'Circuit Conflict Resolution', isMath: false,
    generate() {
      const circuits = ['5th Circuit', '8th Circuit', '9th Circuit', '10th Circuit', '11th Circuit'];
      const home = pick(circuits);
      const other = circuits.find(c => c !== home);
      return {
        prompt: `[Judicial Conflict] A corporate taxpayer headquartered in the ${home} receives a Notice of Deficiency and petitions the U.S. Tax Court. Three years ago, the Tax Court ruled in favor of the IRS on this exact issue in a case appealable to the ${other}. However, the ${home} Court of Appeals recently reversed a District Court decision and held in favor of taxpayers on the identical statutory question. How will the U.S. Tax Court rule in this taxpayer's case?`,
        correct: `Rule for the taxpayer; under the Golsen Rule, the Tax Court must follow the binding precedent of the ${home} Court of Appeals to which this case is appealable.`,
        distractors: [
          `Rule for the IRS; as a national court, the Tax Court applies its own uniform national precedent from the ${other} case.`,
          `Dismiss the petition; the taxpayer cannot litigate in the U.S. Tax Court when a circuit split exists without paying the tax deficiency first.`,
          `Certify the question directly to the Joint Conference Committee for statutory clarification.`
        ],
        concept: `Under the Golsen Rule (Golsen v. Commissioner), although the U.S. Tax Court is a single national court, it follows the binding precedent of the specific U.S. Circuit Court of Appeals that has appellate venue over the taxpayer's residence or principal place of business.`,
        math: `Taxpayer Venue: ${home}\nControlling Appellate Precedent: ${home} Court of Appeals (Pro-Taxpayer)\nGolsen Rule Outcome: Tax Court must follow ${home} precedent.`,
        whyWrong: [
          `Incorrect: The Golsen Rule overrides internal Tax Court uniformity whenever the taxpayer's home circuit has issued a squarely on-point precedent.`,
          `Incorrect: The Tax Court never requires prepayment of a tax deficiency, regardless of circuit splits.`,
          `Incorrect: Congressional committees do not adjudicate live judicial disputes.`
        ]
      };
    }
  },
  {
    id: 't1_2_forum_shopping', topic: 't1', archNum: 2, angle: 'Litigation Forum Strategy', isMath: false,
    generate() {
      const defAmt = randInt(3, 9) * 100000;
      return {
        prompt: `[Client Advisory] Your client receives a ${fmt(defAmt)} IRS Notice of Deficiency regarding an aggressive valuation position. The client has two non-negotiable demands: (1) they want their case decided by a civilian jury of local peers, and (2) they refuse to pay the ${fmt(defAmt)} deficiency prior to trial. Why must you inform the client that their two demands are legally impossible to satisfy simultaneously?`,
        correct: `The U.S. District Court is the ONLY trial court that offers a jury trial, and it strictly requires paying the ${fmt(defAmt)} deficiency in full first and suing for a refund; conversely, the U.S. Tax Court is the ONLY court that does not require prepayment, and it prohibits jury trials.`,
        distractors: [
          `The U.S. Court of Federal Claims offers jury trials without prepayment, but only for disputes under $50,000.`,
          `The U.S. Tax Court permits jury trials, but only if the taxpayer posts a 150% cash bond with the IRS first.`,
          `All three federal trial courts require paying the ${fmt(defAmt)} deficiency upfront before filing a petition.`
        ],
        concept: `Forum selection in federal tax litigation involves an inescapable trade-off among the three trial courts: (1) U.S. Tax Court = NO prepayment required, bench trial only (no jury), tax specialist judges; (2) U.S. District Court = MUST pay tax first and file a refund suit, ONLY court with a jury trial option; (3) U.S. Court of Federal Claims = MUST pay tax first, bench trial only (no jury), national jurisdiction.`,
        math: `Forum Trade-Off Matrix:\n• Want NO Prepayment? -> Must use U.S. Tax Court (No Jury allowed).\n• Want a Jury Trial? -> Must use U.S. District Court (Must prepay ${fmt(defAmt)} first).`,
        whyWrong: [
          `Incorrect: The U.S. Court of Federal Claims requires full prepayment and never offers jury trials.`,
          `Incorrect: Jury trials are statutorily unavailable in the U.S. Tax Court under any circumstances.`,
          `Incorrect: The U.S. Tax Court allows deficiency litigation prior to paying the disputed tax.`
        ]
      };
    }
  },
  {
    id: 't1_3_audit_flaw_plr', topic: 't1', archNum: 3, angle: 'Spot the Flaw (Research Memo)', isMath: false,
    generate() {
      return {
        prompt: `[Spot the Flaw] A junior tax associate drafts a defense memo stating: "Our client's position is rock-solid because we found a 2024 IRS Private Letter Ruling (PLR) issued to a competitor in our industry that approved this exact structure, and a PLR outranks an older Revenue Ruling." What is the fatal flaw in the associate's legal analysis?`,
        correct: `Under IRC 6110(k)(3), a Private Letter Ruling (PLR) is binding ONLY with respect to the specific taxpayer to whom it was issued and cannot be cited as binding precedent by other taxpayers; furthermore, Revenue Rulings rank higher in the hierarchy of administrative authority than PLRs.`,
        distractors: [
          `Private Letter Rulings are issued by the Senate Finance Committee rather than the IRS, so they only apply to legislative history.`,
          `A PLR is binding precedent for all taxpayers in the same NAICS industry code, but only for 36 months after issuance.`,
          `Revenue Rulings are non-binding internal IRS memos, whereas PLRs have the full force and effect of Final Treasury Regulations.`
        ],
        concept: `In the hierarchy of administrative tax authority: Final/Temporary Treasury Regulations hold the highest authority, followed by Revenue Rulings and Revenue Procedures (published in the Internal Revenue Bulletin as official IRS precedent for all taxpayers). Private Letter Rulings (PLRs) apply solely to the specific taxpayer who requested and paid for the ruling.`,
        math: `Administrative Weight Hierarchy:\n1. Final / Temporary Treasury Regulations (Highest)\n2. Revenue Rulings & Revenue Procedures (Published Precedent)\n3. Private Letter Rulings (PLRs) -> Non-precedential for third parties!`,
        whyWrong: [
          `Incorrect: PLRs are issued by the IRS National Office, not Congress.`,
          `Incorrect: Other taxpayers cannot rely on a PLR as binding precedent even in the exact same industry (the 3-year sunset rule applies to Temporary Regulations under IRC 7805(e), not PLRs).`,
          `Incorrect: You reversed the status of Revenue Rulings and PLRs.`
        ]
      };
    }
  },
  {
    id: 't1_4_bill_path', topic: 't1', archNum: 4, angle: 'Constitutional Defect Analysis', isMath: false,
    generate() {
      return {
        prompt: `[Constitutional Procedure] Suppose a U.S. Senator introduces a brand-new federal corporate tax rate bill directly in the Senate Finance Committee, the Senate passes it first, and sends it to the House of Representatives. Under Article I, Section 7 of the U.S. Constitution, why is this bill constitutionally defective?`,
        correct: `Under the Origination Clause, all bills for raising federal revenue must originate in the House of Representatives (specifically the House Ways and Means Committee), after which the Senate Finance Committee may amend the bill and a Joint Conference Committee reconciles differences.`,
        distractors: [
          `All federal tax legislation must be drafted and introduced by the Secretary of the Treasury before Congress can vote on it.`,
          `Tax bills must pass the Joint Committee on Taxation by a two-thirds supermajority before reaching either chamber.`,
          `The Senate Finance Committee has exclusive authority to originate revenue bills, but only during odd-numbered years.`
        ],
        concept: `Under Article I, Section 7 of the U.S. Constitution, all revenue-raising legislation must start in the House of Representatives (House Ways and Means Committee). Once passed by the House, it goes to the Senate Finance Committee, and differences between the House and Senate bills are ironed out in the Joint Conference Committee.`,
        math: `Constitutional Enactment Sequence:\nHouse Ways & Means -> Full House -> Senate Finance -> Full Senate -> Joint Conference Committee -> President`,
        whyWrong: [
          `Incorrect: Only members of Congress can introduce legislation; Treasury is part of the Executive Branch.`,
          `Incorrect: Only a simple majority in the House and Senate is required after committee markup.`,
          `Incorrect: The Senate is constitutionally barred from originating revenue bills.`
        ]
      };
    }
  },
  {
    id: 't1_5_reg_compare', topic: 't1', archNum: 5, angle: 'Compare Authority Weight', isMath: false,
    generate() {
      return {
        prompt: `[Authority Comparison] During an IRS audit, an agent cites a Proposed Treasury Regulation issued 6 months ago to disallow your client's deduction, while your client's position is supported by an existing Revenue Ruling. A colleague also mentions a Temporary Regulation issued 4 years ago on a related issue. Which statement accurately evaluates the legal force of both the Proposed Regulation and the 4-year-old Temporary Regulation?`,
        correct: `Neither binds the taxpayer: Proposed Regulations are merely non-binding drafts open for comment, and Temporary Regulations automatically expire 3 years after issuance under IRC 7805(e); thus, the existing Revenue Ruling controls.`,
        distractors: [
          `Both the Proposed Regulation and the 4-year-old Temporary Regulation are fully binding and outrank the Revenue Ruling.`,
          `The Proposed Regulation is binding for 3 years, whereas the Temporary Regulation remains valid indefinitely until repealed.`,
          `The Revenue Ruling is invalid because IRS Revenue Rulings expire automatically after 24 months.`
        ],
        concept: `Taxpayers and practitioners must distinguish among three types of Treasury Regulations: (1) Final Regulations (full force of law), (2) Temporary Regulations (binding immediately upon publication, but automatically sunset after 3 years under IRC 7805(e)), and (3) Proposed Regulations (carry no binding legal weight until finalized).`,
        math: `Regulation Lifespan & Weight:\n• Final Reg: Binding indefinitely\n• Temporary Reg: Binding for max 3 years (4-year-old Temp Reg = Expired!)\n• Proposed Reg: 0 binding weight (Draft only)`,
        whyWrong: [
          `Incorrect: Proposed Regulations never bind taxpayers, and Temporary Regulations sunset after 3 years.`,
          `Incorrect: You swapped the rules—Temporary Regulations expire after 3 years, and Proposed Regulations are never binding.`,
          `Incorrect: Revenue Rulings do not have a 24-month expiration date; they remain valid until revoked, modified, or superseded.`
        ]
      };
    }
  },
  {
    id: 't1_6_admin_sources', topic: 't1', archNum: 6, angle: 'Match Pronouncement to Purpose', isMath: false,
    generate() {
      return {
        prompt: `[Practitioner Matching] A CPA needs to find: (Item 1) the official IRS procedural instructions for making an automatic accounting method change to defer advance payments, and (Item 2) the IRS's official substantive application of the tax law to a specific set of public facts binding on all IRS auditors. Which two administrative pronouncements correspond to Item 1 and Item 2?`,
        correct: `Item 1 is a Revenue Procedure (e.g., Rev. Proc. 2004-34); Item 2 is a Revenue Ruling.`,
        distractors: [
          `Item 1 is a Private Letter Ruling; Item 2 is a Technical Advice Memorandum.`,
          `Item 1 is a Revenue Ruling; Item 2 is an Action on Decision (AOD).`,
          `Item 1 is a Treasury Decision; Item 2 is a Private Letter Ruling.`
        ],
        concept: `Revenue Procedures ("Rev. Procs") explain the internal practices, filing mechanics, and procedural steps taxpayers must follow (such as how to elect deferral or file accounting method changes). Revenue Rulings ("Rev. Ruls") apply substantive tax law to a specific factual scenario and serve as official precedent for all taxpayers nationwide.`,
        math: `Pronouncement Roles:\n• Revenue Procedure = "HOW" to comply procedurally (elections, filing steps, safe harbors)\n• Revenue Ruling = "WHAT" the substantive tax result is on a given set of facts`,
        whyWrong: [
          `Incorrect: PLRs and TAMs are taxpayer-specific rulings, not published national procedural guides or public precedents.`,
          `Incorrect: You swapped Revenue Ruling with Revenue Procedure, and an AOD merely states whether the IRS accepts an adverse court ruling.`,
          `Incorrect: Treasury Decisions announce Final/Temporary Regulations, and PLRs are private.`
        ]
      };
    }
  },

  // ==================== MODULE 2: TAX PLANNING & NPV (6 ANGLES) ====================
  {
    id: 't2_1_npv_forward', topic: 't2', archNum: 1, angle: 'Forward NPV Calculation', isMath: true,
    generate() {
      const exp = randInt(5, 15) * 10000;
      const rate = pick([21, 24, 30, 32, 35]);
      const r = pick([6, 8, 10]);
      const taxSaved = exp * (rate / 100);
      const pvYr1 = Math.round(taxSaved / (1 + r / 100));
      const gain = taxSaved - pvYr1;
      return {
        prompt: `[Forward Math] A corporation in a constant ${rate}% tax bracket (with an ${r}% after-tax discount rate) can either prepay and deduct a ${fmt(exp)} qualifying expense on December 31 of Year 0 or pay and deduct it at the end of Year 1. Assuming economic cash outflow timing is identical, what is the incremental Net Present Value (NPV) gained from accelerating the tax deduction into Year 0?`,
        correct: `${fmt(gain)} (Year 0 tax shield of ${fmt(taxSaved)} minus Year 1 discounted tax shield of ${fmt(pvYr1)})`,
        distractors: [
          `${fmt(taxSaved)} (Full nominal Year 0 tax shield without subtracting Year 1 PV)`,
          `${fmt(Math.round(exp - exp / (1 + r / 100)))} (Discounting the pre-tax expenditure instead of the tax savings)`,
          `$0, because the corporate marginal tax rate is ${rate}% in both Year 0 and Year 1.`
        ],
        concept: `Under Time Value of Money (TVM) tax planning, accelerating a deduction captures the tax shield (Deduction * t) immediately in Year 0 rather than waiting 1 year and discounting it by (1 + r).`,
        math: `1. Nominal Tax Shield = ${fmt(exp)} * ${rate}% = ${fmt(taxSaved)}\n2. PV in Year 0 = ${fmt(taxSaved)}\n3. PV in Year 1 = ${fmt(taxSaved)} / (1.${r < 10 ? '0' + r : r}) = ${fmt(pvYr1)}\n4. Net NPV Gain from Acceleration = ${fmt(taxSaved)} - ${fmt(pvYr1)} = ${fmt(gain)}`,
        whyWrong: [
          `Incorrect: ${fmt(taxSaved)} is the total Year 0 tax savings, not the incremental NPV improvement over deducting it in Year 1.`,
          `Incorrect: You forgot to multiply the ${fmt(exp)} expense by the ${rate}% tax rate before discounting.`,
          `Incorrect: Even when tax rates are flat, receiving a tax refund/reduction 1 year earlier yields a positive time-value benefit.`
        ]
      };
    }
  },
  {
    id: 't2_2_reverse_breakeven_rate', topic: 't2', archNum: 2, angle: 'Reverse-Engineer Breakeven Rate', isMath: true,
    generate() {
      const ded = randInt(6, 14) * 10000;
      const t0 = pick([20, 24, 25]);
      const r = pick([10, 15, 20]);
      // Breakeven t1 where t1 / (1 + r) = t0  =>  t1 = t0 * (1 + r)
      const t1Break = (t0 * (1 + r / 100)).toFixed(1);
      const yr0Sav = Math.round(ded * (t0 / 100));
      return {
        prompt: `[Reverse-Engineering] A taxpayer can deduct a ${fmt(ded)} business expense today in Year 0 at their current ${t0}% marginal tax rate (saving ${fmt(yr0Sav)} immediately), OR delay the deduction for 1 year into Year 1 when Congress is expected to raise tax rates. If the taxpayer's discount rate is ${r}%, what is the minimum ("breakeven") marginal tax rate required in Year 1 to make waiting until Year 1 at least as valuable in Present Value terms as deducting it in Year 0?`,
        correct: `${t1Break}% (where Year 1 nominal tax savings of ${fmt(Math.round(yr0Sav * (1 + r / 100)))} discounted by ${r}% equals ${fmt(yr0Sav)})`,
        distractors: [
          `${t0}.0% (any tax rate above ${t0}% makes waiting better, ignoring the ${r}% discount rate)`,
          `${(t0 + r).toFixed(1)}% (simply adding ${t0}% + ${r}% instead of multiplying ${t0}% * 1.${r})`,
          `${(t0 / (1 + r / 100)).toFixed(1)}% (dividing by 1.${r} instead of multiplying)`
        ],
        concept: `Delaying a deduction by 1 year imposes a time-value penalty of (1 + r). Therefore, for a Year 1 deduction to beat a Year 0 deduction in NPV terms, the Year 1 tax rate (t1) must grow by at least the discount rate factor: t1 / (1 + r) >= t0, which means t1 >= t0 * (1 + r).`,
        math: `Breakeven Equation:\nPV(Year 1 Tax Shield) = PV(Year 0 Tax Shield)\n(Deduction * t1) / (1 + ${r / 100}) = Deduction * ${t0}%\nt1 = ${t0}% * (1 + ${r / 100}) = ${t1Break}%\nCheck: At ${t1Break}%, Year 1 nominal savings = ${fmt(Math.round(yr0Sav * (1 + r / 100)))}; divided by 1.${r} = ${fmt(yr0Sav)}!`,
        whyWrong: [
          `Incorrect: If the Year 1 tax rate is only slightly above ${t0}%, the ${r}% time-value discount makes waiting a losing proposition.`,
          `Incorrect: Rates compound multiplicatively: t1 = t0 * (1 + r) = ${t1Break}%, not t0 + r.`,
          `Incorrect: Dividing by (1 + r) lowers the tax rate rather than compensating for the 1-year delay.`
        ]
      };
    }
  },
  {
    id: 't2_3_char_conv_equiv', topic: 't2', archNum: 3, angle: 'Pre-Tax Equivalent Yield Comparison', isMath: true,
    generate() {
      const capGain = randInt(10, 25) * 10000;
      const ltcgRate = 15;
      const ordRate = pick([32, 35, 37]);
      const netLtcgCash = Math.round(capGain * (1 - ltcgRate / 100));
      const ordAfterTaxSame = Math.round(capGain * (1 - ordRate / 100));
      const reqOrdPreTax = Math.round(netLtcgCash / (1 - ordRate / 100));
      return {
        prompt: `[Side-by-Side Trade-Off] An investor in the ${ordRate}% ordinary income bracket and ${ltcgRate}% long-term capital gains bracket is comparing two investments:\n• Asset A generates a ${fmt(capGain)} Long-Term Capital Gain (leaving ${fmt(netLtcgCash)} after the ${ltcgRate}% LTCG tax).\n• Asset B generates Ordinary Income taxed at ${ordRate}%.\n\nHow much PRE-TAX Ordinary Income must Asset B generate so that the investor pockets the exact same ${fmt(netLtcgCash)} after-tax cash as Asset A?`,
        correct: `${fmt(reqOrdPreTax)} of pre-tax ordinary income (because ${fmt(reqOrdPreTax)} * [1 - ${ordRate}%] = ${fmt(netLtcgCash)})`,
        distractors: [
          `${fmt(capGain)} of pre-tax ordinary income (which only leaves ${fmt(ordAfterTaxSame)} after ${ordRate}% tax)`,
          `${fmt(netLtcgCash + Math.round(capGain * (ordRate / 100)))} (adding the ordinary tax on ${fmt(capGain)} instead of grossing up by [1 - ${ordRate}%])`,
          `${fmt(Math.round(capGain * (1 + (ordRate - ltcgRate) / 100)))}`
        ],
        concept: `Character Conversion creates a powerful tax wedge: to match the after-tax cash flow of a preferential Long-Term Capital Gain, an ordinary-income investment must earn a much higher pre-tax return: Required Pre-Tax Ordinary = After-Tax Target / (1 - t_ordinary).`,
        math: `1. Target After-Tax Cash from Asset A (LTCG) = ${fmt(capGain)} * (1 - 0.${ltcgRate}) = ${fmt(netLtcgCash)}\n2. Solve for Pre-Tax Ordinary Income (X): X * (1 - 0.${ordRate}) = ${fmt(netLtcgCash)}\n3. X = ${fmt(netLtcgCash)} / ${(1 - ordRate / 100).toFixed(2)} = ${fmt(reqOrdPreTax)}`,
        whyWrong: [
          `Incorrect: Earning ${fmt(capGain)} of ordinary income leaves only ${fmt(ordAfterTaxSame)} after paying the ${ordRate}% tax.`,
          `Incorrect: Any extra pre-tax income you earn is also taxed at ${ordRate}%, so you must divide ${fmt(netLtcgCash)} by (1 - 0.${ordRate}).`,
          `Incorrect: You must gross up by dividing by (1 - t_ordinary), not multiplying by (1 + rate difference).`
        ]
      };
    }
  },
  {
    id: 't2_4_assign_income_audit', topic: 't2', archNum: 4, angle: 'Spot the Flaw (Income Shifting)', isMath: true,
    generate() {
      const rent = randInt(3, 7) * 10000;
      const wage = randInt(1, 2) * 10000;
      const div = randInt(2, 4) * 10000;
      const pRate = 37, cRate = 12;
      const validShifted = wage + div;
      const actualSavings = Math.round(validShifted * ((pRate - cRate) / 100));
      const claimedSavings = Math.round((rent + wage + div) * ((pRate - cRate) / 100));
      return {
        prompt: `[Spot the Flaw] Dr. Smith (in the ${pRate}% tax bracket) attempts three strategies to shift income to her 22-year-old college-student son (in the ${cRate}% tax bracket):\n1. Retains legal title to a medical office building, but signs a binding contract directing the tenant to pay ${fmt(rent)} of annual rent directly to her son.\n2. Employs her son part-time in her medical clinic performing actual bookkeeping services for a reasonable W-2 wage of ${fmt(wage)}.\n3. Transfers legal title of corporate stock to her son on January 1, which pays ${fmt(div)} of dividends during the year.\n\nDr. Smith claims she shifted all ${fmt(rent + wage + div)} and saved ${fmt(claimedSavings)}. How much income was LEGALLY shifted to the son's tax return, and what is the true family tax savings?`,
        correct: `Only ${fmt(validShifted)} (Items 2 and 3) was legally shifted, saving ${fmt(actualSavings)}; Item 1 (${fmt(rent)} rent) remains taxed to Dr. Smith at ${pRate}% under the Assignment of Income Doctrine because she kept title to the building.`,
        distractors: [
          `All ${fmt(rent + wage + div)} was legally shifted, saving ${fmt(claimedSavings)}, because the tenant paid the ${fmt(rent)} rent directly to the son.`,
          `Only ${fmt(div)} (Item 3) was legally shifted, saving ${fmt(Math.round(div * 0.25))}, because parents are prohibited from deducting wages paid to their children.`,
          `$0 was shifted; the Assignment of Income Doctrine prohibits all three transactions between related family members.`
        ],
        concept: `Under the Assignment of Income Doctrine ("Fruit-and-Tree" metaphor from Helvering v. Horst and Lucas v. Earl), income from property (${fmt(rent)} rent) is always taxed to the owner of the underlying property ("the tree") unless the property itself is transferred (as in Item 3, where the stock was gifted). Paying reasonable compensation for actual services rendered by a family member (Item 2) is also a valid deductible business expense.`,
        math: `• Item 1 (${fmt(rent)} Rent without transferring building): Fails Assignment of Income -> Taxed to Parent ($0 shifted)\n• Item 2 (${fmt(wage)} Reasonable Wage for real work): Valid shift -> Saves ${fmt(wage)} * (37% - 12%) = ${fmt(Math.round(wage * 0.25))}\n• Item 3 (${fmt(div)} Dividends after gifting stock title): Valid shift -> Saves ${fmt(div)} * (37% - 12%) = ${fmt(Math.round(div * 0.25))}\nTotal Valid Shift = ${fmt(validShifted)} | True Tax Savings = ${fmt(actualSavings)}`,
        whyWrong: [
          `Incorrect: Detaching rent from the building without transferring legal title to the building violates Helvering v. Horst.`,
          `Incorrect: Bona fide reasonable wages paid to a child for actual work performed in a trade or business are fully deductible under IRC 162.`,
          `Incorrect: Gifting income-producing property (Item 3) and paying reasonable wages for actual services (Item 2) are classic, completely legal income-shifting techniques.`
        ]
      };
    }
  },
  {
    id: 't2_5_7701o_diagnostic', topic: 't2', archNum: 5, angle: 'Judicial Doctrine Diagnostic', isMath: false,
    generate() {
      return {
        prompt: `[Judicial Doctrine Diagnostic] A corporation enters into a complex cross-border repo transaction that generates a $5,000,000 capital loss on paper. Upon audit, the taxpayer proves that it had a subjective non-tax desire to burnish its balance sheet ratios, but the IRS proves that the transaction had zero net cash flow potential and did not meaningfully change the corporation's objective economic position apart from federal income tax savings. Under IRC 7701(o) (Codified Economic Substance), does the transaction survive IRS challenge?`,
        correct: `No—IRC 7701(o) is a conjunctive ("AND") two-prong test requiring BOTH an objective meaningful change in economic position AND a subjective substantial non-tax purpose; failing the objective prong alone invalidates the tax benefit.`,
        distractors: [
          `Yes—IRC 7701(o) is a disjunctive ("OR") test, so proving a subjective non-tax purpose is sufficient even without an objective change in economic position.`,
          `Yes—IRC 7701(o) applies only to individual taxpayers and partnerships, not to C Corporations.`,
          `No—because the Step-Transaction Doctrine requires all corporate transactions to be completed within a single taxable year.`
        ],
        concept: `Before 2010, some federal circuits applied a disjunctive ("OR") test for economic substance. When Congress enacted IRC 7701(o), it mandated a strict CONJUNCTIVE ("AND") two-prong test: whenever the economic substance doctrine is relevant, a transaction is treated as having economic substance ONLY IF (1) it changes the taxpayer's economic position in a meaningful way (apart from federal tax effects) AND (2) the taxpayer has a substantial non-tax purpose for entering into it.`,
        math: `IRC 7701(o) Conjunctive Formula:\nProng 1 (Objective Economic Change) [FAILED] + Prong 2 (Subjective Non-Tax Purpose) [PASSED] = FAILED!`,
        whyWrong: [
          `Incorrect: Congress enacted IRC 7701(o) specifically to eliminate the disjunctive ("OR") standard used by some courts.`,
          `Incorrect: IRC 7701(o) applies heavily to corporate tax shelters (and in fact excludes personal non-business transactions of individuals).`,
          `Incorrect: The Step-Transaction Doctrine collapses interdependent steps regardless of whether they cross a year-end.`
        ]
      };
    }
  },
  {
    id: 't2_6_step_vs_substance', topic: 't2', archNum: 6, angle: 'Distinguish Judicial Doctrines', isMath: false,
    generate() {
      return {
        prompt: `[Case Matching] Match the two classic IRS challenges below to the exact Judicial Doctrine being invoked:\n• Challenge A: A shareholder sells depreciated property to their wholly owned corporation at a loss, and 5 days later the corporation sells it to a pre-arranged third-party buyer; the IRS collapses the two sales into a single direct sale by the shareholder.\n• Challenge B: Two shareholders label a 50-year non-amortizable "lease" with a $1 buyout option at the end as a rental agreement, and the IRS recharacterizes the payments as a financed purchase of the asset.`,
        correct: `Challenge A invokes the Step-Transaction Doctrine; Challenge B invokes the Substance-Over-Form Doctrine.`,
        distractors: [
          `Challenge A invokes the Assignment of Income Doctrine; Challenge B invokes the Golsen Rule.`,
          `Challenge A invokes the Constructive Receipt Doctrine; Challenge B invokes the Step-Transaction Doctrine.`,
          `Both Challenge A and Challenge B invoke Public Law 86-272.`
        ],
        concept: `The Step-Transaction Doctrine collapses a series of formally separate, pre-arranged, or interdependent steps into a single integrated transaction to determine the true tax result. The Substance-Over-Form Doctrine looks past the legal labels chosen by the parties ("lease" vs. "sale", or "debt" vs. "equity") and taxes the underlying economic reality.`,
        math: `Doctrine Distinctions:\n• Multiple Interdependent Steps Collapsed into One -> Step-Transaction Doctrine\n• Misleading Legal Label Recharacterized to True Economics -> Substance-Over-Form Doctrine`,
        whyWrong: [
          `Incorrect: Assignment of Income deals with shifting income to another taxpayer, and the Golsen Rule is a Tax Court precedent rule.`,
          `Incorrect: Constructive receipt is a cash-method timing rule, not a multi-step restructuring doctrine.`,
          `Incorrect: Public Law 86-272 is a state net income tax immunity statute.`
        ]
      };
    }
  },

  // ==================== MODULE 3: ENTITY SELECTION (6 ANGLES) ====================
  {
    id: 't3_1_net_scorp_vs_sole_tradeoff', topic: 't3', archNum: 1, angle: 'Combined SE Tax vs. QBI Trade-Off', isMath: true,
    generate() {
      const profit = 200000;
      const salary = 80000;
      // Sole Prop: SE tax = 200k * .9235 * .153 = 28,259. S Corp FICA = 80k * .153 = 12,240. Payroll Tax Saved = 16,019.
      // QBI Sole Prop (ignoring 1/2 SE tax for simplicity as stated) = 200k * 20% = 40,000.
      // QBI S Corp = (200k - 80k) * 20% = 24,000. Lost QBI Deduction = 16,000 -> At 24% income tax rate, extra income tax = 16,000 * 24% = 3,840.
      const seSole = Math.round(profit * 0.9235 * 0.153);
      const ficaS = Math.round(salary * 0.153);
      const payrollSaved = seSole - ficaS;
      const qbiSole = Math.round(profit * 0.20);
      const qbiScorp = Math.round((profit - salary) * 0.20);
      const lostQbiDed = qbiSole - qbiScorp;
      return {
        prompt: `[Holistic Trade-Off] Many students forget that converting from a Sole Proprietorship to an S Corporation creates TWO opposing tax effects: it SAVES payroll/SE taxes, but it REDUCES the IRC 199A QBI deduction because W-2 wages are excluded from QBI.\n\nSuppose a business earns ${fmt(profit)} of net profit before owner compensation, and the owner is in the 24% income tax bracket (ignore the 1/2 SE tax deduction adjustment for simplicity). If the owner elects S Corporation status and pays a ${fmt(salary)} W-2 salary:\n1. How much Employment/SE tax does the S Corp save (${fmt(seSole)} Sole Prop SE tax vs. ${fmt(ficaS)} S Corp FICA)?\n2. By how much does the ${fmt(salary)} W-2 salary shrink the owner's 20% IRC 199A QBI deduction (${fmt(qbiSole)} vs. ${fmt(qbiScorp)})?`,
        correct: `Saves ${fmt(payrollSaved)} in SE/FICA taxes, but shrinks the IRC 199A QBI deduction by ${fmt(lostQbiDed)} (which costs ${fmt(Math.round(lostQbiDed * 0.24))} in extra income tax at 24%, for a net overall savings of ${fmt(payrollSaved - Math.round(lostQbiDed * 0.24))}).`,
        distractors: [
          `Saves ${fmt(payrollSaved)} in SE/FICA taxes, and increases the IRC 199A QBI deduction by ${fmt(lostQbiDed)}.`,
          `Saves ${fmt(payrollSaved)} in SE/FICA taxes, with $0 impact on the IRC 199A QBI deduction because W-2 wages qualify as QBI.`,
          `Saves $0 in SE/FICA taxes, and shrinks the IRC 199A QBI deduction by ${fmt(salary)}.`
        ],
        concept: `Converting a Sole Proprietorship to an S Corporation is a classic double-edged sword on exams: paying a ${fmt(salary)} W-2 salary shields the remaining ${fmt(profit - salary)} distribution from 15.3% SE tax (saving ${fmt(payrollSaved)}), BUT because W-2 wages do not count as QBI under IRC 199A, the owner loses the 20% QBI deduction on that ${fmt(salary)} salary (${fmt(salary)} * 20% = ${fmt(lostQbiDed)} smaller QBI deduction).`,
        math: `1. Payroll/SE Tax Side:\n   • Sole Prop SE Tax = ${fmt(profit)} * 92.35% * 15.3% = ${fmt(seSole)}\n   • S Corp FICA Tax = ${fmt(salary)} * 15.3% = ${fmt(ficaS)} -> Saves ${fmt(payrollSaved)}\n2. IRC 199A QBI Side:\n   • Sole Prop QBI Deduction = ${fmt(profit)} * 20% = ${fmt(qbiSole)}\n   • S Corp QBI Deduction = (${fmt(profit)} - ${fmt(salary)}) * 20% = ${fmt(qbiScorp)} -> Shrinks QBI Deduction by ${fmt(lostQbiDed)}!`,
        whyWrong: [
          `Incorrect: Paying W-2 wages reduces pass-through QBI; it never increases QBI (unless the taxpayer is above the high-income W-2 wage cap threshold).`,
          `Incorrect: Under IRC 199A(c)(4), reasonable compensation paid to an S Corp shareholder is excluded from QBI.`,
          `Incorrect: The QBI deduction shrinks by 20% of the salary (${fmt(lostQbiDed)}), not 100% of the salary, and the S Corp saves ${fmt(payrollSaved)} in SE tax.`
        ]
      };
    }
  },
  {
    id: 't3_2_reverse_scorp_salary', topic: 't3', archNum: 2, angle: 'Reverse-Engineer S Corp Salary from QBI', isMath: true,
    generate() {
      const preWageProfit = randInt(18, 28) * 10000;
      const qbiDed = randInt(16, 24) * 1000; // means QBI is 80k..120k
      const impliedQbi = qbiDed * 5;
      const impliedSalary = preWageProfit - impliedQbi;
      return {
        prompt: `[Reverse-Engineering] An S Corporation earned ${fmt(preWageProfit)} of operating profit before deducting its sole shareholder-employee's W-2 salary (the shareholder is below the IRC 199A taxable income phase-out threshold). On their individual Form 1040, the shareholder claimed a valid 20% IRC 199A QBI deduction of exactly ${fmt(qbiDed)}. Working backward, what W-2 salary did the S Corporation pay the shareholder, and how much FICA payroll tax (at 15.3%) was owed on that salary?`,
        correct: `W-2 Salary paid was ${fmt(impliedSalary)}, generating ${fmt(Math.round(impliedSalary * 0.153))} of FICA tax.`,
        distractors: [
          `W-2 Salary paid was ${fmt(impliedQbi)}, generating ${fmt(Math.round(impliedQbi * 0.153))} of FICA tax.`,
          `W-2 Salary paid was ${fmt(preWageProfit - qbiDed)}, generating ${fmt(Math.round((preWageProfit - qbiDed) * 0.153))} of FICA tax.`,
          `W-2 Salary paid was ${fmt(qbiDed)}, generating ${fmt(Math.round(qbiDed * 0.153))} of FICA tax.`
        ],
        concept: `Since the IRC 199A deduction equals 20% of pass-through QBI, you can work backward: QBI = QBI Deduction / 0.20 = ${fmt(impliedQbi)}. Since S Corp QBI equals Pre-Salary Profit minus W-2 Salary, the W-2 Salary must be ${fmt(preWageProfit)} - ${fmt(impliedQbi)} = ${fmt(impliedSalary)}.`,
        math: `1. Implied Pass-Through QBI = ${fmt(qbiDed)} / 20% = ${fmt(impliedQbi)}\n2. Implied W-2 Salary = ${fmt(preWageProfit)} (Pre-Wage Profit) - ${fmt(impliedQbi)} (QBI) = ${fmt(impliedSalary)}\n3. FICA Payroll Tax on W-2 Salary = ${fmt(impliedSalary)} * 15.3% = ${fmt(Math.round(impliedSalary * 0.153))}`,
        whyWrong: [
          `Incorrect: ${fmt(impliedQbi)} is the remaining pass-through QBI after subtracting the salary, not the W-2 salary itself.`,
          `Incorrect: You subtracted the 20% QBI deduction (${fmt(qbiDed)}) directly from pre-wage profit instead of dividing ${fmt(qbiDed)} by 0.20 first.`,
          `Incorrect: ${fmt(qbiDed)} is the 20% tax deduction, not the W-2 salary.`
        ]
      };
    }
  },
  {
    id: 't3_3_partner_gp_vs_draw', topic: 't3', archNum: 3, angle: 'Advisory Restructuring (GP vs. Allocation)', isMath: true,
    generate() {
      const totInc = randInt(20, 30) * 10000;
      const gp = randInt(6, 10) * 10000;
      const lostQbiDed = Math.round(gp * 0.20);
      return {
        prompt: `[Structuring Advisory] The 50/50 AB General Partnership earns ${fmt(totInc)} of ordinary income. Currently, the partnership agreement pays Partner A a ${fmt(gp)} guaranteed payment for services and splits the remaining ${fmt(totInc - gp)} 50/50. A tax advisor suggests amending the agreement to eliminate the ${fmt(gp)} guaranteed payment and instead give Partner A a priority profit allocation equal to the same dollar amount. Why does eliminating the ${fmt(gp)} guaranteed payment increase the partners' combined IRC 199A QBI deduction without changing their Self-Employment tax?`,
        correct: `For a general partner, both guaranteed payments and ordinary distributive shares are subject to SE tax, but guaranteed payments are excluded from QBI under IRC 199A; replacing the ${fmt(gp)} GP with a profit allocation increases total QBI by ${fmt(gp)} and boosts the 20% QBI deduction by ${fmt(lostQbiDed)}.`,
        distractors: [
          `Eliminating the ${fmt(gp)} guaranteed payment exempts Partner A from paying 15.3% Self-Employment tax on that ${fmt(gp)}.`,
          `Guaranteed payments are nondeductible by the partnership, so eliminating the GP reduces partnership taxable income by ${fmt(gp)}.`,
          `Replacing the guaranteed payment with a profit allocation converts the ${fmt(gp)} into tax-free return of basis.`
        ],
        concept: `Under IRC 707(c) and IRC 1402, a general partner pays Self-Employment (SE) tax on BOTH guaranteed payments for services and their distributive share of ordinary business income. However, under IRC 199A(c)(4), guaranteed payments for services do NOT qualify as QBI! Converting a guaranteed payment into an ordinary distributive share preserves ${fmt(gp)} of QBI (worth ${fmt(lostQbiDed)} in extra IRC 199A deductions).`,
        math: `With ${fmt(gp)} GP:\n• Total Partnership QBI = ${fmt(totInc)} - ${fmt(gp)} = ${fmt(totInc - gp)}\nWithout GP (Pure Distributive Share):\n• Total Partnership QBI = ${fmt(totInc)}\n• Extra 20% IRC 199A Deduction Gained = ${fmt(gp)} * 20% = +${fmt(lostQbiDed)}`,
        whyWrong: [
          `Incorrect: A general partner's distributive share of ordinary business income is still 100% subject to Self-Employment tax.`,
          `Incorrect: Guaranteed payments ARE deductible by the partnership in computing ordinary business income.`,
          `Incorrect: A distributive share of partnership profit is fully taxable as ordinary income.`
        ]
      };
    }
  },
  {
    id: 't3_4_ccorp_retention_vs_passthrough', topic: 't3', archNum: 4, angle: 'Retention vs. Distribution Entity Comparison', isMath: true,
    generate() {
      const ebit = randInt(30, 60) * 10000;
      const cCorpTax = Math.round(ebit * 0.21);
      const divTax = Math.round((ebit - cCorpTax) * 0.20);
      const cCorpDoubleTax = cCorpTax + divTax; // 36.8%
      // Pass-through owner in 37% bracket with full 20% QBI deduction -> effective rate = 37% * 80% = 29.6%
      const passTaxWithQbi = Math.round(ebit * 0.80 * 0.37);
      return {
        prompt: `[Entity Comparison] A business generates ${fmt(ebit)} of taxable operating profit (ignore SE/NIIT taxes to isolate income tax rates). The sole owner is in the 37% ordinary bracket and 20% qualified dividend bracket, and the business qualifies in full for the 20% IRC 199A QBI deduction if operated as an S Corporation.\n• Scenario A (100% Reinvestment): The business retains 100% of earnings inside the company and distributes $0 dividends.\n• Scenario B (100% Distribution): The business distributes 100% of after-tax cash to the owner every year.\n\nCompare the current-year tax bill of a C Corporation vs. an S Corporation in Scenario A and Scenario B:`,
        correct: `In Scenario A (0% dividend), the C Corp pays less current tax (${fmt(cCorpTax)} at 21% vs. ${fmt(passTaxWithQbi)} S Corp tax at 29.6% effective rate); in Scenario B (100% dividend), the S Corp wins (${fmt(passTaxWithQbi)} vs. ${fmt(cCorpDoubleTax)} C Corp double tax at 36.8%).`,
        distractors: [
          `The S Corporation pays less tax in BOTH Scenario A and Scenario B (${fmt(cCorpTax)} vs. ${fmt(cCorpDoubleTax)}).`,
          `The C Corporation pays less tax in BOTH Scenario A and Scenario B because 21% + 20% is lower than 37%.`,
          `In Scenario A, the S Corporation pays $0 tax because it did not distribute any cash to the shareholder.`
        ],
        concept: `Pass-through owners (S Corps/Partnerships) are taxed immediately on 100% of entity profits whether distributed or retained (37% * 80% after QBI = 29.6% effective rate). C Corporations pay only 21% at the entity level until dividends are paid; once 100% of after-tax earnings are distributed as dividends, the second layer of tax (79% * 20% = 15.8%) pushes the C Corp combined rate to 36.8%.`,
        math: `1. S Corp Tax (Both Scenarios, with 20% QBI): ${fmt(ebit)} * 80% * 37% = ${fmt(passTaxWithQbi)} (29.6% effective)\n2. C Corp Scenario A (0% Dividend): ${fmt(ebit)} * 21% = ${fmt(cCorpTax)} (21.0% effective)\n3. C Corp Scenario B (100% Dividend): ${fmt(cCorpTax)} + (${fmt(ebit - cCorpTax)} * 20%) = ${fmt(cCorpDoubleTax)} (36.8% effective)`,
        whyWrong: [
          `Incorrect: When 0% dividends are paid in Year 1, the 21% flat corporate rate is lower than the 29.6% pass-through rate (though a future shareholder tax still looms).`,
          `Incorrect: In Scenario B, the 36.8% combined double-tax rate exceeds the 29.6% QBI-adjusted pass-through rate.`,
          `Incorrect: Pass-through shareholders are taxed on their allocable share of income when earned, regardless of whether cash is distributed.`
        ]
      };
    }
  },
  {
    id: 't3_5_scorp_cap_table_audit', topic: 't3', archNum: 5, angle: 'Spot the Flaw (S Corp Cap Table)', isMath: false,
    generate() {
      return {
        prompt: `[Cap Table Audit] You are reviewing the shareholder ledger of an S Corporation to verify compliance with IRC 1361:\n• Investor 1: A domestic Single-Member LLC (disregarded entity) wholly owned by a U.S. citizen.\n• Investor 2: A husband, wife, their son, and their granddaughter holding shares separately (counted by the CFO as 1 shareholder under the family attribution rule).\n• Investor 3: Class B nonvoting common stock held by employees (identical dividend and liquidation rights to Class A voting stock).\n• Investor 4: A family limited partnership (FLP) owned 100% by two U.S. citizens.\n\nWhich investor causes an immediate termination of the S Corporation election?`,
        correct: `Investor 4 (the family limited partnership); partnerships and corporations are ineligible shareholders under IRC 1361, even if all of their underlying partners are U.S. citizens.`,
        distractors: [
          `Investor 1 (the Single-Member LLC), because LLCs can never hold stock in an S Corporation.`,
          `Investor 3 (Class B nonvoting common stock), because having voting and nonvoting shares creates a prohibited second class of stock.`,
          `Investor 2, because family aggregation only applies to spouses and does not include children or grandchildren.`
        ],
        concept: `Under IRC 1361: (1) Partnerships, C Corporations, and Non-Resident Aliens can NEVER be S Corp shareholders (Investor 4 terminates the S election); (2) A disregarded Single-Member LLC owned by an eligible U.S. individual is looked through to its individual owner and IS an eligible shareholder; (3) Up to 6 generations of a family count as 1 shareholder; and (4) Voting vs. nonvoting common shares do not violate the single-class-of-stock rule as long as distribution and liquidation rights are identical.`,
        math: `IRC 1361 Cap Table Check:\n• SMLLC owned by US Citizen = VALID (Look-through)\n• Family Unit (6 generations) = VALID (Counts as 1)\n• Voting vs. Nonvoting Common = VALID (1 economic class)\n• Partnership / Corp / NRA = INVALID (Immediate Termination!)`,
        whyWrong: [
          `Incorrect: Per IRS rulings, a disregarded SMLLC owned by a U.S. citizen is treated as direct ownership by the individual citizen.`,
          `Incorrect: IRC 1361(c)(4) explicitly permits differences solely in voting rights.`,
          `Incorrect: IRC 1361(c)(1) aggregates all members of a family (up to 6 generations) as a single shareholder.`
        ]
      };
    }
  },
  {
    id: 't3_6_entity_matrix_match', topic: 't3', archNum: 6, angle: 'Entity Trait Matrix Diagnostic', isMath: false,
    generate() {
      return {
        prompt: `[Entity Diagnostic] Two co-founders are launching a real estate venture. They require: (1) complete state-law limited liability protection for all owners, (2) the ability to make special disproportionate allocations of tax losses (IRC 704(b)) to the money partner, and (3) the ability to include entity-level qualified nonrecourse mortgage debt in the owners' tax basis to deduct losses. Which entity structure satisfies all three requirements?`,
        correct: `A Multi-Member LLC taxed under its default classification as a Partnership (Subchapter K), because S Corporations prohibit special allocations and do not include entity-level third-party debt in shareholder stock/debt basis.`,
        distractors: [
          `An LLC that files Form 2553 to be taxed as an S Corporation, because S Corporations allow third-party bank mortgages to increase shareholder stock basis.`,
          `A General Partnership, because it provides automatic state-law limited liability to all general partners.`,
          `A C Corporation, because corporate net operating losses flow through to shareholders' personal Form 1040 returns.`
        ],
        concept: `Partnerships (including Multi-Member LLCs taxed as partnerships) have two massive advantages over S Corporations for leveraged real estate: (1) Partners include their share of partnership third-party debt in Outside Basis under IRC 752 (whereas S Corp shareholders ONLY get debt basis for direct loans made personally by the shareholder to the S Corp!), and (2) Partnerships allow flexible special allocations under IRC 704(b) (whereas S Corps must allocate strictly pro-rata per share/per day because of the single-class-of-stock rule).`,
        math: `S Corp vs. Partnership (LLC) Comparison:\n• Entity-Level Bank Debt in Owner Basis? Partnership = YES (IRC 752) | S Corp = NO!\n• Special Disproportionate Allocations? Partnership = YES (IRC 704(b)) | S Corp = NO (Pro-rata only)!`,
        whyWrong: [
          `Incorrect: S Corporation shareholders NEVER get basis for third-party entity debt (even if they personally guarantee it), and S Corps cannot make special allocations.`,
          `Incorrect: General partners in a General Partnership have unlimited personal liability for partnership obligations.`,
          `Incorrect: C Corporation losses are trapped inside the corporation and never pass through to shareholders.`
        ]
      };
    }
  },

  // ==================== MODULE 4: CORP & PARTNERSHIP FORMATION (6 ANGLES) ====================
  {
    id: 't4_1_multi_transferor_351', topic: 't4', archNum: 1, angle: 'Multi-Transferor Control & Accommodation Rule', isMath: true,
    generate() {
      const aBasis = randInt(4, 8) * 10000;
      const aFmv = aBasis + randInt(10, 18) * 10000;
      const bServices = randInt(5, 9) * 10000;
      const aRealGain = aFmv - aBasis;
      return {
        prompt: `[Threshold Cliff Advisory] Founder A wants to contribute appreciated patent rights (Adjusted Basis ${fmt(aBasis)}, FMV ${fmt(aFmv)}) for 75% of NewCo's stock, while Developer B contributes software coding services worth ${fmt(bServices)} (and $0 property) for the remaining 25% of NewCo's stock.\n\nUnder Treas. Reg. 1.351-1(a)(1)(ii), a service provider who ALSO contributes property worth at least 10% of the value of their services is treated as a property transferor so ALL of their stock counts toward the 80% control group. What happens if Developer B contributes $0 cash vs. if Developer B also contributes ${fmt(Math.round(bServices * 0.15))} cash (15% of service value)?`,
        correct: `With $0 cash from B, IRC 351 fails (A owns 75% < 80%) and A recognizes ${fmt(aRealGain)} gain; if B contributes ${fmt(Math.round(bServices * 0.15))} cash (15% >= 10% safe harbor), B's entire stock counts in the control group (100% >= 80%) and A recognizes $0 gain! (B still recognizes ${fmt(bServices)} ordinary service income in both cases).`,
        distractors: [
          `Founder A recognizes $0 gain in both cases because A and B together own 100% of NewCo immediately after formation.`,
          `Contributing ${fmt(Math.round(bServices * 0.15))} cash also makes Developer B's ${fmt(bServices)} of services completely tax-free under IRC 351.`,
          `Even if Developer B contributes $100 of nominal cash (less than 1% of service value), the IRS counts all 25% of B's stock toward the 80% test.`
        ],
        concept: `Under IRC 351, pure service providers are excluded from the 80% control group—so if B contributes only services for 25% of the stock, A holds only 75% (< 80%) and A's entire ${fmt(aRealGain)} gain becomes taxable! However, if B contributes both services AND a non-nominal amount of property (at least 10% of the value of the services received per Rev. Proc. 77-37), ALL of B's stock counts toward the 80% control group, saving A's tax-free treatment (though B is still taxed on the stock received for services).`,
        math: `• Case 1 (B contributes Services only): Property group = 75% (< 80%) -> A taxed on ${fmt(aRealGain)}!\n• Case 2 (B contributes Services + >=10% Cash): Property group = 75% + 25% = 100% (>= 80%) -> A taxed on $0!\n• B's Ordinary Service Income in BOTH cases = ${fmt(bServices)}`,
        whyWrong: [
          `Incorrect: Pure service contributors do not count toward the 80% control test under IRC 351(d).`,
          `Incorrect: Stock received in exchange for services is ALWAYS taxable as ordinary compensation income under IRC 61/83, even when the 80% control test is met.`,
          `Incorrect: Token/accommodation property transfers (< 10% of the value of services) are disregarded under Treas. Reg. 1.351-1(a)(1)(ii).`
        ]
      };
    }
  },
  {
    id: 't4_2_reverse_351_boot', topic: 't4', archNum: 2, angle: 'Reverse-Engineer Contributed Basis from Corp Basis', isMath: true,
    generate() {
      const origBasis = randInt(5, 11) * 10000;
      const boot = randInt(2, 5) * 10000;
      const realGain = boot + randInt(3, 7) * 10000;
      const fmv = origBasis + realGain;
      const corpBasis = origBasis + boot; // since recGain = boot
      const shStockBasis = origBasis; // origBasis + boot - boot = origBasis!
      return {
        prompt: `[Reverse-Engineering] In a qualifying IRC 351 incorporation, Elena transferred an appreciated crane (FMV ${fmt(fmv)}) to CraneCo in exchange for 100% of CraneCo's stock plus ${fmt(boot)} in cash boot. Because Elena's realized gain exceeded the ${fmt(boot)} boot, she recognized exactly ${fmt(boot)} of gain under IRC 351(b). Immediately after the exchange, CraneCo's inside basis in the crane under IRC 362 is ${fmt(corpBasis)}.\n\nWorking backward, what was Elena's original Adjusted Basis in the crane prior to the transfer, and what is Elena's ending Stock Basis under IRC 358?`,
        correct: `Original Crane Basis was ${fmt(origBasis)}, and Elena's ending Stock Basis is also ${fmt(shStockBasis)} (because +${fmt(boot)} gain recognized and -${fmt(boot)} boot received cancel out!).`,
        distractors: [
          `Original Crane Basis was ${fmt(corpBasis)}, and Elena's ending Stock Basis is ${fmt(corpBasis - boot)}.`,
          `Original Crane Basis was ${fmt(origBasis)}, and Elena's ending Stock Basis is ${fmt(origBasis + boot)}.`,
          `Original Crane Basis was ${fmt(fmv - boot)}, and Elena's ending Stock Basis is ${fmt(fmv)}.`
        ],
        concept: `Under IRC 362(a), the corporation's inside basis equals Transferor's Original Basis + Transferor's Gain Recognized. Therefore, Original Basis = Corporate Basis (${fmt(corpBasis)}) - Gain Recognized (${fmt(boot)}) = ${fmt(origBasis)}. Under IRC 358, whenever boot is fully taxed as recognized gain (+${fmt(boot)} gain recognized minus -${fmt(boot)} boot received), the shareholder's ending stock basis equals their exact original property basis (${fmt(origBasis)})!`,
        math: `1. Corporate Inside Basis Formula (IRC 362): OrigBasis + ${fmt(boot)} (Gain Rec) = ${fmt(corpBasis)}\n   -> OrigBasis = ${fmt(corpBasis)} - ${fmt(boot)} = ${fmt(origBasis)}\n2. Shareholder Stock Basis (IRC 358): ${fmt(origBasis)} (OrigBasis) + ${fmt(boot)} (Gain Rec) - ${fmt(boot)} (Boot) = ${fmt(shStockBasis)}`,
        whyWrong: [
          `Incorrect: ${fmt(corpBasis)} already includes the ${fmt(boot)} step-up for Elena's recognized gain.`,
          `Incorrect: You added the ${fmt(boot)} recognized gain to stock basis but forgot to subtract the ${fmt(boot)} cash boot received.`,
          `Incorrect: Corporate inside basis is based on carryover basis plus recognized gain, not FMV.`
        ]
      };
    }
  },
  {
    id: 't4_3_aggregate_357c_trap', topic: 't4', archNum: 3, angle: 'Aggregate vs. Asset-by-Asset 357(c) Trap', isMath: true,
    generate() {
      const bldgBasis = randInt(4, 7) * 10000;
      const bldgDebt = bldgBasis + randInt(4, 6) * 10000; // excess debt on building alone = 40k..60k
      const equipBasis = randInt(6, 9) * 10000; // unencumbered equipment basis > excess debt!
      const aggBasis = bldgBasis + equipBasis;
      const excessOnBldgOnly = bldgDebt - bldgBasis;
      const endStockBasis = aggBasis - bldgDebt;
      return {
        prompt: `[Spot the Flaw] In a single IRC 351 transaction, Marcus transfers TWO assets to his corporation in exchange for 100% of its stock:\n• Asset 1 (Building): Adjusted Basis of ${fmt(bldgBasis)}, FMV of ${fmt(bldgDebt + 80000)}, subject to a mortgage of ${fmt(bldgDebt)} assumed by the corporation.\n• Asset 2 (Unencumbered Equipment): Adjusted Basis of ${fmt(equipBasis)}, FMV of ${fmt(equipBasis + 30000)}, with $0 liabilities.\n\nA junior accountant tells Marcus he must recognize ${fmt(excessOnBldgOnly)} of gain under IRC 357(c) because the building's ${fmt(bldgDebt)} mortgage exceeds the building's ${fmt(bldgBasis)} basis. Why is the accountant wrong, and what is Marcus's true recognized gain and ending stock basis?`,
        correct: `IRC 357(c) compares AGGREGATE liabilities assumed (${fmt(bldgDebt)}) against the AGGREGATE adjusted basis of all property transferred (${fmt(aggBasis)}); since ${fmt(bldgDebt)} <= ${fmt(aggBasis)}, Marcus recognizes $0 gain and has an ending stock basis of ${fmt(endStockBasis)}.`,
        distractors: [
          `The accountant is right; IRC 357(c) is applied asset-by-asset, so Marcus recognizes ${fmt(excessOnBldgOnly)} of gain and has a stock basis of ${fmt(equipBasis)}.`,
          `Marcus recognizes ${fmt(bldgDebt)} of gain because all assumed liabilities are treated as cash boot under IRC 351(b).`,
          `Marcus recognizes $0 gain and his ending stock basis is ${fmt(aggBasis)} (ignoring the ${fmt(bldgDebt)} debt assumed).`
        ],
        concept: `Classic exam planning strategy! IRC 357(c) is tested on an AGGREGATE basis across all properties contributed by that transferor in the IRC 351 exchange—NOT asset-by-asset. Therefore, contributing a second unencumbered high-basis asset (${fmt(equipBasis)}) raises total aggregate basis to ${fmt(aggBasis)}, completely eliminating the ${fmt(excessOnBldgOnly)} excess-liability gain on the building!`,
        math: `1. Aggregate Adjusted Basis Contributed = ${fmt(bldgBasis)} + ${fmt(equipBasis)} = ${fmt(aggBasis)}\n2. Total Liabilities Assumed = ${fmt(bldgDebt)}\n3. IRC 357(c) Test: Is ${fmt(bldgDebt)} > ${fmt(aggBasis)}? NO! -> Recognized Gain = $0\n4. Ending Stock Basis (IRC 358) = ${fmt(aggBasis)} (Total Basis) - ${fmt(bldgDebt)} (Debt Assumed) = ${fmt(endStockBasis)}`,
        whyWrong: [
          `Incorrect: IRC 357(c)(1) explicitly compares "the sum of the amount of the liabilities assumed" to "the total of the adjusted basis of the property transferred."`,
          `Incorrect: Under IRC 357(a), bona fide liabilities assumed are not treated as boot.`,
          `Incorrect: Under IRC 358(d), liabilities assumed by the corporation still reduce the shareholder's stock basis by ${fmt(bldgDebt)}.`
        ]
      };
    }
  },
  {
    id: 't4_4_corp_vs_part_encumbered', topic: 't4', archNum: 4, angle: 'Corp (357c) vs. Partnership (752) Debt Comparison', isMath: true,
    generate() {
      const basis = randInt(5, 8) * 10000;
      const debt = basis + randInt(3, 5) * 10000; // debt > basis by 30k..50k
      // In Corp (357c): 100% excess debt over basis = debt - basis recognized immediately!
      const corpGain = debt - basis;
      // In 50/50 General Partnership (752): Partner retains 50% share of recourse debt, so net debt relief = 50% of debt!
      // Ensure 50% of debt < basis so Partnership triggers $0 gain! (e.g., max debt = 80k + 50k = 130k, 50% = 65k; if basis=50k, 50% of 100k = 50k <= 50k). Let's force basis = 60k, debt = 90k:
      const bFixed = 60000;
      const dFixed = pick([80000, 90000, 100000]);
      const cGain = dFixed - bFixed;
      const netDebtReliefPart = Math.round(dFixed * 0.50);
      const partEndBasis = bFixed - netDebtReliefPart;
      return {
        prompt: `[Side-by-Side Comparison] Taylor owns a warehouse with an Adjusted Basis of ${fmt(bFixed)} and an FMV of ${fmt(dFixed + 100000)}, encumbered by a ${fmt(dFixed)} recourse mortgage. Taylor is deciding whether to contribute the warehouse for a 50% ownership interest in either (Option 1) a C Corporation in a qualifying IRC 351 exchange (with a co-founder contributing cash for the other 50%), or (Option 2) a 50/50 General Partnership under IRC 721.\n\nCompare Taylor's recognized gain and ending basis in Option 1 (Corporation) vs. Option 2 (General Partnership):`,
        correct: `Option 1 (Corp): Recognizes ${fmt(cGain)} gain under IRC 357(c) with $0 stock basis | Option 2 (Partnership): Recognizes $0 gain with ${fmt(partEndBasis)} outside basis (because Taylor keeps 50% of the recourse debt under IRC 752!).`,
        distractors: [
          `Both Option 1 and Option 2 trigger ${fmt(cGain)} of recognized gain and $0 ending basis.`,
          `Option 1 (Corp): $0 gain | Option 2 (Partnership): ${fmt(cGain)} gain under IRC 731.`,
          `Option 1 (Corp): ${fmt(cGain)} gain | Option 2 (Partnership): $0 gain and ${fmt(bFixed)} outside basis.`
        ],
        concept: `Here is why partnerships are much more forgiving than corporations when contributing property with debt > basis: In a Corporation (IRC 357(c)), the shareholder gets ZERO credit for corporate-level debt, so whenever Debt (${fmt(dFixed)}) > Basis (${fmt(bFixed)}), the excess (${fmt(cGain)}) is taxed immediately. In a 50/50 General Partnership (IRC 752), the partner is only relieved of the OTHER partners' 50% share of the debt (${fmt(netDebtReliefPart)} net debt relief); since ${fmt(netDebtReliefPart)} net relief <= ${fmt(bFixed)} basis, Taylor recognizes $0 gain and keeps a ${fmt(partEndBasis)} outside basis!`,
        math: `• Option 1 (C Corp under IRC 357(c)):\n  Debt (${fmt(dFixed)}) - Basis (${fmt(bFixed)}) = ${fmt(cGain)} Immediate Gain | Stock Basis = $0\n• Option 2 (50/50 Partnership under IRC 722/752):\n  Basis (${fmt(bFixed)}) - 100% Debt Relieved (${fmt(dFixed)}) + 50% Debt Share (${fmt(netDebtReliefPart)}) = ${fmt(partEndBasis)} Outside Basis ($0 Gain!)`,
        whyWrong: [
          `Incorrect: In a partnership, a partner only recognizes gain if the NET debt relief (50% = ${fmt(netDebtReliefPart)}) exceeds their basis (${fmt(bFixed)}).`,
          `Incorrect: You reversed the corporate IRC 357(c) rule and the partnership IRC 752 rule.`,
          `Incorrect: Net debt relief of ${fmt(netDebtReliefPart)} reduces Taylor's outside basis from ${fmt(bFixed)} to ${fmt(partEndBasis)}.`
        ]
      };
    }
  },
  {
    id: 't4_5_704c_reverse_sale', topic: 't4', archNum: 5, angle: 'Reverse-Engineer Contribution FMV under 704(c)', isMath: true,
    generate() {
      const basis = randInt(4, 7) * 10000;
      const big = randInt(3, 6) * 10000;
      const contribFmv = basis + big;
      const postApp = randInt(2, 5) * 20000; // even number for clean 50/50 split
      const salePrice = contribFmv + postApp;
      const bGain = postApp * 0.5;
      const aGain = big + bGain;
      return {
        prompt: `[Reverse-Engineering] When the 50/50 AB Partnership was formed under IRC 721, Partner A contributed land with an Adjusted Basis of ${fmt(basis)} (and an unrecorded Fair Market Value at contribution). Two years later, the partnership sold the land for ${fmt(salePrice)}, resulting in a total tax gain of ${fmt(salePrice - basis)}. Under IRC 704(c), the partnership tax return properly allocated ${fmt(aGain)} of tax gain to Partner A and ${fmt(bGain)} of tax gain to Partner B.\n\nWorking backward from that allocation, what was the Fair Market Value of the land on the date Partner A originally contributed it?`,
        correct: `${fmt(contribFmv)} (because Partner B's ${fmt(bGain)} 50% share means total post-contribution appreciation was ${fmt(postApp)}, and ${fmt(salePrice)} minus ${fmt(postApp)} = ${fmt(contribFmv)}).`,
        distractors: [
          `${fmt(basis + aGain)} (adding Partner A's total allocated gain to basis)`,
          `${fmt(salePrice - bGain)} (subtracting only Partner B's 50% share instead of 100% of post-contribution appreciation)`,
          `${fmt(basis)} (assuming $0 built-in gain at contribution)`
        ],
        concept: `Under IRC 704(c), non-contributing Partner B ONLY receives 50% of the post-contribution appreciation (Sale Price - Contribution FMV). Therefore, if Partner B was allocated ${fmt(bGain)}, total post-contribution appreciation was 2 * ${fmt(bGain)} = ${fmt(postApp)}. Subtracting ${fmt(postApp)} from the ${fmt(salePrice)} sale price reveals the exact Contribution FMV (${fmt(contribFmv)})—or equivalently, Built-in Gain = Partner A's gain (${fmt(aGain)}) minus Partner B's gain (${fmt(bGain)}) = ${fmt(big)}, plus ${fmt(basis)} basis = ${fmt(contribFmv)}!`,
        math: `Method 1 (Via Post-Contribution Gain):\n• Partner B's 50% Post-Contribution Share = ${fmt(bGain)} -> Total Post-Contribution Gain = ${fmt(postApp)}\n• Contribution FMV = ${fmt(salePrice)} (Sale) - ${fmt(postApp)} (Post-Gain) = ${fmt(contribFmv)}\n\nMethod 2 (Via Built-In Gain Difference):\n• Pre-Contribution Built-In Gain = ${fmt(aGain)} (A's Gain) - ${fmt(bGain)} (B's Gain) = ${fmt(big)}\n• Contribution FMV = ${fmt(basis)} (Basis) + ${fmt(big)} (Built-In Gain) = ${fmt(contribFmv)}`,
        whyWrong: [
          `Incorrect: ${fmt(aGain)} includes both the pre-contribution built-in gain (${fmt(big)}) AND Partner A's 50% share of post-contribution gain (${fmt(bGain)}).`,
          `Incorrect: You subtracted only Partner B's 50% share (${fmt(bGain)}) from the sale price instead of the full 100% post-contribution gain (${fmt(postApp)}).`,
          `Incorrect: If Contribution FMV had been ${fmt(basis)}, Partner A and Partner B would have split the total gain equally.`
        ]
      };
    }
  },
  {
    id: 't4_6_holding_period_split', topic: 't4', archNum: 6, angle: 'Mixed Contribution Holding Period (IRC 1223)', isMath: false,
    generate() {
      return {
        prompt: `[Statutory Nuance] On October 1, Year 1, a sole proprietor contributes two business assets to form a new corporation under IRC 351 (or partnership under IRC 721) in exchange for 100 shares of stock:\n• Asset 1 (FMV $100,000): Land (a Section 1231 asset) held by the proprietor for 4 years.\n• Asset 2 (FMV $100,000): Inventory (an ordinary asset) purchased 2 months ago.\n\nIf the shareholder sells all 100 shares of stock 5 months later on March 1, Year 2, how is the shareholder's holding period in the stock determined under IRC 1223(1)?`,
        correct: `The stock has a split holding period: 50% of the shares (attributable to the Section 1231 land) tack the 4-year holding period and qualify as Long-Term, while 50% of the shares (attributable to the inventory) start a fresh holding period at contribution and are Short-Term (5 months).`,
        distractors: [
          `100% of the shares qualify as Long-Term because any contributed capital/1231 asset taints the entire stock block with a long-term holding period.`,
          `100% of the shares are Short-Term because contributing ordinary inventory resets the holding period of all shares to zero.`,
          `The corporation takes a fresh Day-1 holding period in the land, while the shareholder gets a Long-Term holding period in all 100 shares.`
        ],
        concept: `Under IRC 1223(1), a transferor's holding period for stock or a partnership interest tacks on the prior holding period of contributed Capital Assets and Section 1231 Assets, but starts fresh on the day after contribution for ordinary assets (cash, inventory, accounts receivable). When both types are contributed simultaneously, the shares take a fragmented/split holding period based on the relative FMVs of the contributed assets! Meanwhile, the corporation/partnership ALWAYS tacks the transferor's holding period for all inside assets under IRC 1223(2).`,
        math: `IRC 1223 Holding Period Rules:\n• Capital / § 1231 Asset Contributed ($100k Land) -> Tacks 4-year holding period (Long-Term)\n• Ordinary Asset Contributed ($100k Inventory/Cash) -> No tacking; starts Day 1 (Short-Term at 5 mos)`,
        whyWrong: [
          `Incorrect: You cannot tack a long-term holding period onto shares received in exchange for ordinary inventory.`,
          `Incorrect: The 50% of shares received for the Section 1231 land retain their tacked 4-year long-term holding period.`,
          `Incorrect: Under IRC 1223(2), the corporation tacks the shareholder's holding period in the land inside the corporation.`
        ]
      };
    }
  },

  // ==================== MODULE 5: GROSS INCOME & DEFERRALS (6 ANGLES) ====================
  {
    id: 't5_1_adv_payment_audit', topic: 't5', archNum: 1, angle: 'Spot the Flaw (3-Year Advance Payment)', isMath: true,
    generate() {
      const rate = randInt(2, 5) * 1000;
      const tot = 36 * rate; // 36-month contract
      const y1m = pick([3, 6]);
      const y1Book = y1m * rate;
      const y2Book = 12 * rate;
      const y3Book = tot - y1Book - y2Book;
      const y2TaxTrue = tot - y1Book;
      const understatementYr2 = y2TaxTrue - y2Book;
      return {
        prompt: `[Spot the Flaw] On ${y1m === 3 ? 'October 1' : 'July 1'}, Year 1, an accrual-method software training firm receives ${fmt(tot)} cash upfront for a 36-month service contract (${fmt(rate)}/month). On its Audited Financial Statements (Book), the company recognizes ${fmt(y1Book)} in Year 1, ${fmt(y2Book)} in Year 2, and ${fmt(y3Book)} in Year 3.\n\nThe company elects the deferral method under IRC 451(c) and Rev. Proc. 2004-34, and the tax preparer reports ${fmt(y1Book)} on the Year 1 tax return and ${fmt(y2Book)} on the Year 2 tax return (deferring ${fmt(y3Book)} to Year 3). By how much did the preparer UNDERSTATE Year 2 taxable income?`,
        correct: `Understated Year 2 taxable income by ${fmt(understatementYr2)}; under IRC 451(c), 100% of the remaining unearned advance payment (${fmt(y2TaxTrue)}) MUST be recognized in Year 2, leaving $0 for Year 3.`,
        distractors: [
          `Understated Year 1 taxable income by ${fmt(y2TaxTrue)}, because accrual taxpayers must always recognize 100% of cash upon receipt in Year 1.`,
          `$0 understatement; IRC 451(c) allows tax recognition to match GAAP book recognition over the entire 36-month contract.`,
          `Overstated Year 1 taxable income by ${fmt(y1Book)}, because the 1-year deferral election shifts 100% of the contract into Year 2.`
        ],
        concept: `Under IRC 451(c) and Rev. Proc. 2004-34, the tax deferral privilege for advance payments is strictly limited to ONE tax year after the year of receipt! Thus, while Year 1 tax revenue matches Year 1 AFS Book revenue (${fmt(y1Book)}), the entire remaining balance (${fmt(tot)} - ${fmt(y1Book)} = ${fmt(y2TaxTrue)}) must be included in Year 2 taxable income—meaning Year 2 tax income exceeds Year 2 book income by ${fmt(understatementYr2)}.`,
        math: `1. Total Upfront Cash (36 mos) = ${fmt(tot)}\n2. Year 1 Tax Income (= Year 1 Book) = ${fmt(y1Book)}\n3. Mandatory Year 2 Tax Income = ${fmt(tot)} - ${fmt(y1Book)} = ${fmt(y2TaxTrue)}\n4. Preparer's Reported Year 2 Income = ${fmt(y2Book)}\n5. Year 2 Tax Understatement = ${fmt(y2TaxTrue)} - ${fmt(y2Book)} = ${fmt(understatementYr2)}`,
        whyWrong: [
          `Incorrect: The Year 1 return (${fmt(y1Book)}) was completely correct under the IRC 451(c) deferral election.`,
          `Incorrect: IRC 451(c) never permits deferring advance payments into a third tax year (Year 3).`,
          `Incorrect: You cannot defer the portion already earned and recognized on the Year 1 financial statements.`
        ]
      };
    }
  },
  {
    id: 't5_2_constructive_receipt_compare', topic: 't5', archNum: 2, angle: '4-Check Year-End Constructive Receipt Audit', isMath: true,
    generate() {
      const chkA = randInt(8, 12) * 1000; // Agent received Dec 29 -> Taxable Yr 1
      const chkB = randInt(13, 17) * 1000; // Available at front desk Dec 30 -> Taxable Yr 1
      const chkC = randInt(5, 7) * 1000; // Post-dated / bank restriction until Jan 2 -> Yr 2
      const chkD = randInt(18, 22) * 1000; // Mailed Dec 30, arrived Jan 3 -> Yr 2
      const yr1Taxable = chkA + chkB;
      const yr2Taxable = chkC + chkD;
      return {
        prompt: `[Year-End Cutoff Audit] Dr. Chen, a calendar-year, cash-method orthodontist, asks you which of four year-end checks belong in Year 1 Gross Income vs. Year 2 Gross Income under Treas. Reg. 1.451-2 (Constructive Receipt):\n• Check A (${fmt(chkA)}): Handed by a patient to Dr. Chen's receptionist/billing agent on December 29, Year 1, and deposited on January 3, Year 2.\n• Check B (${fmt(chkB)}): Ready for Dr. Chen to pick up at a hospital on December 30, Year 1 with no restrictions, but Dr. Chen waited until January 2, Year 2 to pick it up.\n• Check C (${fmt(chkC)}): Handed to Dr. Chen on December 31, Year 1, but the patient's account had insufficient funds and the patient instructed Dr. Chen not to cash it until January 4, Year 2.\n• Check D (${fmt(chkD)}): Mailed by an insurance company on December 29, Year 1, arriving in Dr. Chen's office mailbox on January 3, Year 2.\n\nWhat is Dr. Chen's Gross Income in Year 1 and Year 2 from these four checks?`,
        correct: `Year 1: ${fmt(yr1Taxable)} (Checks A and B) | Year 2: ${fmt(yr2Taxable)} (Checks C and D)`,
        distractors: [
          `Year 1: ${fmt(chkB)} (Check B only) | Year 2: ${fmt(chkA + chkC + chkD)} (forgetting that receipt by an agent is receipt by the principal)`,
          `Year 1: ${fmt(chkA + chkB + chkC)} (including the NSF check) | Year 2: ${fmt(chkD)}`,
          `Year 1: ${fmt(chkA + chkB + chkD)} (including the check in transit in the mail) | Year 2: ${fmt(chkC)}`
        ],
        concept: `Under Cash Method and Constructive Receipt rules: (1) Receipt by a taxpayer's agent (Check A, ${fmt(chkA)}) is actual receipt by the taxpayer in Year 1; (2) Unconditionally available funds turned down by the taxpayer (Check B, ${fmt(chkB)}) are constructively received in Year 1; (3) An NSF check lacking available funds (Check C, ${fmt(chkC)}) has a substantial restriction and is taxed in Year 2; and (4) A check in the mail that does not arrive until January (Check D, ${fmt(chkD)}) is not accessible in Year 1 and is taxed in Year 2.`,
        math: `• Check A (Receipt by Agent Dec 29): +${fmt(chkA)} (Year 1)\n• Check B (Available at Desk Dec 30): +${fmt(chkB)} (Year 1)\n• Check C (NSF / Restricted until Jan): +${fmt(chkC)} (Year 2)\n• Check D (In Mail until Jan 3): +${fmt(chkD)} (Year 2)\n= Year 1 Total: ${fmt(yr1Taxable)} | Year 2 Total: ${fmt(yr2Taxable)}`,
        whyWrong: [
          `Incorrect: Under agency law, actual receipt of a check by the taxpayer's employee/receptionist on December 29 constitutes receipt by the taxpayer in Year 1.`,
          `Incorrect: When the payor lacks funds to cover the check in Year 1 (Check C), there is a substantial restriction barring constructive receipt.`,
          `Incorrect: A check placed in the mail in December that cannot physically be accessed until it arrives in January is taxed in Year 2.`
        ]
      };
    }
  },
  {
    id: 't5_3_lease_cancellation_vs_deposit', topic: 't5', archNum: 3, angle: 'Landlord Cash Inflows Classification', isMath: true,
    generate() {
      const curRent = randInt(4, 7) * 10000;
      const cancelFee = randInt(2, 3) * 10000;
      const advRent = randInt(1, 2) * 10000;
      const secDep = randInt(5, 8) * 10000;
      const totTaxable = curRent + cancelFee + advRent;
      return {
        prompt: `[Cash Inflow Classification] An accrual-method commercial landlord receives four distinct payments from tenants during Year 1:\n1. Current year rent payments: ${fmt(curRent)}\n2. Lease cancellation fee paid by a tenant to break a 5-year lease early: ${fmt(cancelFee)}\n3. Non-refundable prepaid rent for the final month of a new 3-year lease: ${fmt(advRent)}\n4. Refundable damage security deposits held in escrow (to be returned at lease end if no damage occurs): ${fmt(secDep)}\n\nHow much total Gross Income must the landlord recognize in Year 1?`,
        correct: `${fmt(totTaxable)} (Items 1, 2, and 3 are all immediately taxable in Year 1; only the ${fmt(secDep)} refundable security deposit is excluded)`,
        distractors: [
          `${fmt(curRent + cancelFee)} (assuming an accrual-method landlord can defer advance prepaid rent under IRC 451(c))`,
          `${fmt(curRent + advRent)} (assuming lease cancellation fees are deferred over the remaining original lease term)`,
          `${fmt(totTaxable + secDep)} (including the refundable security deposit in gross income)`
        ],
        concept: `Under Treas. Reg. 1.61-8(b), both advance/prepaid rent (${fmt(advRent)}) AND lease cancellation payments (${fmt(cancelFee)}) must be included in gross income in the year of receipt regardless of whether the landlord uses the cash or accrual method (and rent is generally ineligible for Rev. Proc. 2004-34 deferral). Only a bona fide refundable security deposit (${fmt(secDep)}) is excluded because the landlord has an unconditional obligation to repay it.`,
        math: `1. Current Year Rent:               +${fmt(curRent)}\n2. Lease Cancellation Fee:          +${fmt(cancelFee)} (Taxable upon receipt)\n3. Non-Refundable Prepaid Rent:     +${fmt(advRent)} (Taxable upon receipt)\n4. Refundable Security Deposit:      $0 (Excluded repayment liability)\n= Total Year 1 Gross Income:         ${fmt(totTaxable)}`,
        whyWrong: [
          `Incorrect: Prepaid rent is taxed upon receipt under Treas. Reg. 1.61-8(b) even for accrual-method taxpayers.`,
          `Incorrect: Lease cancellation fees are taxed immediately upon receipt (Hort v. Commissioner).`,
          `Incorrect: Refundable security deposits are liabilities, not gross income, under Commissioner v. Indianapolis Power & Light Co.`
        ]
      };
    }
  },
  {
    id: 't5_4_litigation_settlement_breakdown', topic: 't5', archNum: 4, angle: 'Litigation Settlement Allocation Matrix', isMath: true,
    generate() {
      const medAndPain = randInt(15, 25) * 10000;
      const lostWagesPhys = randInt(5, 8) * 10000;
      const punitivePhys = randInt(10, 14) * 10000;
      const ageDiscrimBackPay = randInt(6, 9) * 10000;
      const ageEmotional = randInt(3, 4) * 10000;
      const excluded = medAndPain + lostWagesPhys;
      const taxable = punitivePhys + ageDiscrimBackPay + ageEmotional;
      return {
        prompt: `[Settlement Allocation] A client settles two separate lawsuits during the year and receives five itemized checks:\n\nLawsuit 1 (Physical Injury from Factory Explosion):\n• ${fmt(medAndPain)} for physical pain, suffering, and uncompensated medical bills\n• ${fmt(lostWagesPhys)} for lost wages while hospitalized from the physical explosion injuries\n• ${fmt(punitivePhys)} in punitive damages to punish the factory's gross negligence\n\nLawsuit 2 (Wrongful Termination / Employment Discrimination — No Physical Injury):\n• ${fmt(ageDiscrimBackPay)} for lost back pay\n• ${fmt(ageEmotional)} for emotional distress and insomnia caused by the termination\n\nWhy are the ${fmt(lostWagesPhys)} of lost wages in Lawsuit 1 treated differently from the ${fmt(ageDiscrimBackPay)} of lost wages in Lawsuit 2, and what is the client's total Taxable vs. Excluded income under IRC 104(a)(2)?`,
        correct: `Excluded: ${fmt(excluded)} | Taxable: ${fmt(taxable)}; under IRC 104(a)(2), lost wages flowing from a PHYSICAL injury (${fmt(lostWagesPhys)}) are excluded, whereas lost wages/emotional distress from a non-physical tort (${fmt(ageDiscrimBackPay + ageEmotional)}) and all punitive damages (${fmt(punitivePhys)}) are taxable.`,
        distractors: [
          `Excluded: ${fmt(medAndPain)} | Taxable: ${fmt(lostWagesPhys + punitivePhys + ageDiscrimBackPay + ageEmotional)} (treating ALL lost wages as taxable even when caused by physical injury).`,
          `Excluded: ${fmt(medAndPain + lostWagesPhys + punitivePhys)} | Taxable: ${fmt(ageDiscrimBackPay + ageEmotional)} (treating punitive damages from a physical injury as excluded).`,
          `Excluded: ${fmt(medAndPain + lostWagesPhys + ageEmotional)} | Taxable: ${fmt(punitivePhys + ageDiscrimBackPay)} (treating emotional distress from employment termination as a physical sickness).`
        ],
        concept: `Under IRC 104(a)(2) and Supreme Court precedent (Commissioner v. Schleier), the origin of the claim controls: if the underlying claim is a physical personal injury or physical sickness (Lawsuit 1), ALL compensatory damages flowing from that physical injury—including lost wages (${fmt(lostWagesPhys)}) and pain/suffering (${fmt(medAndPain)})—are 100% excluded. Conversely, punitive damages (${fmt(punitivePhys)}) are ALWAYS taxable, and all damages from non-physical claims (Lawsuit 2, including emotional distress symptoms like insomnia/headaches) are taxable.`,
        math: `• Excluded (IRC 104(a)(2) Physical Compensatory):\n  ${fmt(medAndPain)} (Pain/Medical) + ${fmt(lostWagesPhys)} (Lost Wages from Physical Injury) = ${fmt(excluded)}\n• Taxable (Punitive + Non-Physical Claims):\n  ${fmt(punitivePhys)} (Punitive) + ${fmt(ageDiscrimBackPay)} (Non-Physical Back Pay) + ${fmt(ageEmotional)} (Non-Physical Emotional) = ${fmt(taxable)}`,
        whyWrong: [
          `Incorrect: Compensatory lost wages recovered on account of a physical personal injury (${fmt(lostWagesPhys)}) are excluded under IRC 104(a)(2).`,
          `Incorrect: IRC 104(a)(2) explicitly states that the exclusion does NOT apply to punitive damages (${fmt(punitivePhys)}).`,
          `Incorrect: Under IRC 104(a), emotional distress (and physical symptoms of emotional distress like insomnia) is not treated as a physical injury or sickness.`
        ]
      };
    }
  },
  {
    id: 't5_5_fruit_vs_tree_exclusions', topic: 't5', archNum: 5, angle: 'Exempt Principal vs. Taxable Yield/Gain Trap', isMath: true,
    generate() {
      const lifeProceeds = 500000;
      const lifeInterest = randInt(15, 25) * 1000;
      const inheritStockFmv = 200000;
      const inheritDividends = randInt(8, 14) * 1000;
      const muniInterest = randInt(10, 18) * 1000;
      const muniSaleGain = randInt(12, 22) * 1000;
      const totTaxable = lifeInterest + inheritDividends + muniSaleGain;
      return {
        prompt: `[Exempt Principal vs. Yield Trap] A taxpayer receives three pairs of inflows during the year:\n1. Life Insurance (IRC 101): ${fmt(lifeProceeds)} death benefit left with the insurer under an installment option that pays an extra ${fmt(lifeInterest)} of interest during the year.\n2. Inheritance (IRC 102): Inherited stock worth ${fmt(inheritStockFmv)} on the date of death, which subsequently pays ${fmt(inheritDividends)} of dividends during the year.\n3. Municipal Bonds (IRC 103): ${fmt(muniInterest)} of municipal bond interest, plus ${fmt(muniSaleGain)} of capital gain from selling the municipal bonds at a premium.\n\nHow much total Gross Income must the taxpayer recognize from these six items?`,
        correct: `${fmt(totTaxable)} (The ${fmt(lifeInterest)} life insurance interest, ${fmt(inheritDividends)} dividends on inherited stock, and ${fmt(muniSaleGain)} capital gain on selling municipal bonds are all taxable!).`,
        distractors: [
          `${fmt(lifeInterest + inheritDividends)} (assuming the ${fmt(muniSaleGain)} gain on selling municipal bonds is also tax-exempt under IRC 103).`,
          `${fmt(muniSaleGain)} (assuming interest on life insurance proceeds and dividends on inherited stock are excluded under IRC 101 and 102).`,
          `$0 (assuming all inflows connected to life insurance, inheritances, and municipal bonds are 100% tax-exempt).`
        ],
        concept: `Exam questions love testing the boundary between an excluded principal amount and a taxable yield or gain:\n1. IRC 101 excludes the ${fmt(lifeProceeds)} life insurance death benefit, but any post-death interest (${fmt(lifeInterest)}) is taxable under IRC 101(c).\n2. IRC 102 excludes the ${fmt(inheritStockFmv)} inherited stock ("the tree"), but subsequent dividends (${fmt(inheritDividends)}, "the fruit") are taxable under IRC 102(b).\n3. IRC 103 excludes municipal bond interest (${fmt(muniInterest)}), but capital gains from selling the bond (${fmt(muniSaleGain)}) are fully taxable!`,
        math: `• Pair 1: ${fmt(lifeProceeds)} Death Benefit ($0) + ${fmt(lifeInterest)} Interest (+${fmt(lifeInterest)})\n• Pair 2: ${fmt(inheritStockFmv)} Inherited Stock ($0) + ${fmt(inheritDividends)} Dividends (+${fmt(inheritDividends)})\n• Pair 3: ${fmt(muniInterest)} Muni Interest ($0) + ${fmt(muniSaleGain)} Muni Sale Gain (+${fmt(muniSaleGain)})\n= Total Taxable Gross Income: ${fmt(totTaxable)}`,
        whyWrong: [
          `Incorrect: IRC 103 exempts only interest paid by the state/municipality; capital gains from selling the bond in the market (${fmt(muniSaleGain)}) are taxable.`,
          `Incorrect: IRC 101(c) taxes interest on held life insurance proceeds, and IRC 102(b) taxes income/dividends produced by gifted or inherited property.`,
          `Incorrect: Statutory exclusions are construed narrowly and do not exempt post-death interest, post-inheritance dividends, or secondary-market bond sale gains.`
        ]
      };
    }
  },
  {
    id: 't5_6_life_ins_transfer_for_value', topic: 't5', archNum: 6, angle: 'Transfer-for-Value Exception (IRC 101(a)(2))', isMath: true,
    generate() {
      const face = randInt(40, 80) * 10000;
      const purchasePrice = randInt(6, 12) * 10000;
      const subPrems = randInt(2, 4) * 10000;
      const costBasis = purchasePrice + subPrems;
      const taxableGain = face - costBasis;
      return {
        prompt: `[Statutory Exception] Generally, life insurance death benefits are 100% excluded from gross income under IRC 101(a)(1). However, suppose an unrelated investor purchases an existing ${fmt(face)} life insurance policy from the insured for ${fmt(purchasePrice)} cash, pays ${fmt(subPrems)} in subsequent annual premiums, and collects the ${fmt(face)} death benefit when the insured dies. Under the Transfer-for-Value Rule (IRC 101(a)(2)), how much of the ${fmt(face)} death benefit is TAXABLE?`,
        correct: `${fmt(taxableGain)} is taxable (${fmt(face)} proceeds minus the investor's ${fmt(costBasis)} total consideration and subsequent premiums paid).`,
        distractors: [
          `$0 is taxable, because IRC 101(a) excludes 100% of life insurance death benefits regardless of whether the policy was sold.`,
          `All ${fmt(face)} is taxable without any reduction for the ${fmt(costBasis)} paid by the investor.`,
          `${fmt(face - purchasePrice)} is taxable (ignoring the ${fmt(subPrems)} of subsequent premiums paid).`
        ],
        concept: `Under the Transfer-for-Value Rule (IRC 101(a)(2)), if a life insurance policy is transferred for valuable consideration (sold to someone other than the insured, a partner of the insured, a partnership in which the insured is a partner, or a corporation in which the insured is an officer/shareholder), the general IRC 101 exclusion is LOST! The buyer can only exclude their actual tax basis (Purchase Price ${fmt(purchasePrice)} + Subsequent Premiums ${fmt(subPrems)} = ${fmt(costBasis)}), making the remaining ${fmt(taxableGain)} fully taxable.`,
        math: `1. Death Benefit Proceeds Received = ${fmt(face)}\n2. Less Purchase Price Paid = -${fmt(purchasePrice)}\n3. Less Subsequent Premiums Paid = -${fmt(subPrems)}\n4. Taxable Income under Transfer-for-Value (IRC 101(a)(2)) = ${fmt(taxableGain)}`,
        whyWrong: [
          `Incorrect: Purchasing a policy for valuable consideration triggers IRC 101(a)(2) and forfeits the full tax-free exclusion (unless a safe-harbor transferee exception applies).`,
          `Incorrect: The investor still recovers their ${fmt(costBasis)} investment (purchase price plus subsequent premiums) tax-free.`,
          `Incorrect: Under IRC 101(a)(2), both the initial consideration paid AND subsequent premiums paid are excluded.`
        ]
      };
    }
  },

  // ==================== MODULE 6: BOOK-TO-TAX & 163(j) (6 ANGLES) ====================
  {
    id: 't6_1_reverse_m1_book_to_tax', topic: 't6', archNum: 1, angle: 'Reverse Schedule M-1 (Taxable Income back to Book)', isMath: true,
    generate() {
      const bookNet = randInt(40, 75) * 10000;
      const fedTax = randInt(9, 15) * 10000;
      const mealsDis = randInt(1, 3) * 10000; // 50% disallowed portion
      const muni = randInt(2, 4) * 10000;
      const excessMacrs = randInt(5, 9) * 10000;
      const taxableInc = bookNet + fedTax + mealsDis - muni - excessMacrs;
      return {
        prompt: `[Reverse-Engineering Schedule M-1] Instead of solving from Book to Tax, work backward from Taxable Income to Book Net Income:\n\nA C Corporation reports final Federal Taxable Income (Line 10 of Schedule M-1) of ${fmt(taxableInc)}. During the year, its Schedule M-1 adjustments were:\n• Federal income tax expense per books: ${fmt(fedTax)}\n• 50% disallowed portion of business meals: ${fmt(mealsDis)}\n• Tax-exempt municipal bond interest income: ${fmt(muni)}\n• Excess of Tax MACRS depreciation over Book straight-line depreciation: ${fmt(excessMacrs)}\n\nWhat was the corporation's after-tax Book Net Income on Line 1 of Schedule M-1?`,
        correct: `${fmt(bookNet)} (reversing the M-1 signs: ${fmt(taxableInc)} - ${fmt(fedTax)} - ${fmt(mealsDis)} + ${fmt(muni)} + ${fmt(excessMacrs)})`,
        distractors: [
          `${fmt(taxableInc + fedTax + mealsDis - muni - excessMacrs)} (applying the forward Book-to-Tax signs instead of reversing them!)`,
          `${fmt(bookNet + fedTax)} (forgetting to subtract federal income tax expense when moving from Taxable Income to after-tax Book Net Income)`,
          `${fmt(bookNet - excessMacrs * 2)} (subtracting excess MACRS instead of adding it back when moving from Tax to Book)`
        ],
        concept: `Since the forward Schedule M-1 equation is: Book Net Income + Fed Tax + Disallowed Meals - Muni Interest - Excess MACRS = Taxable Income, solving backward from Taxable Income to Book Net Income requires flipping every sign: Book Net Income = Taxable Income - Fed Tax - Disallowed Meals + Muni Interest + Excess MACRS!`,
        math: `Forward Formula:\nBook + ${fmt(fedTax)} + ${fmt(mealsDis)} - ${fmt(muni)} - ${fmt(excessMacrs)} = ${fmt(taxableInc)}\n\nReverse Formula (Taxable Income -> Book Net Income):\n  Taxable Income:              ${fmt(taxableInc)}\n- Federal Tax Expense:        -${fmt(fedTax)}\n- 50% Disallowed Meals:       -${fmt(mealsDis)}\n+ Muni Bond Interest:         +${fmt(muni)}\n+ Excess MACRS Depreciation:  +${fmt(excessMacrs)}\n= After-Tax Book Net Income:   ${fmt(bookNet)}`,
        whyWrong: [
          `Incorrect: You applied the forward Book-to-Tax adjustments to Taxable Income instead of reversing the signs.`,
          `Incorrect: That is pre-tax Book Income; Line 1 of Schedule M-1 is after-tax Book Net Income.`,
          `Incorrect: Because excess MACRS reduced Taxable Income below Book Income, you must add it back when moving from Tax to Book.`
        ]
      };
    }
  },
  {
    id: 't6_2_net_deferred_tax_position', topic: 't6', archNum: 2, angle: 'Net DTA vs. DTL Balance Sheet Position (ASC 740)', isMath: true,
    generate() {
      const excessMacrs = randInt(12, 20) * 10000; // creates DTL
      const warrantyAccrual = randInt(4, 7) * 10000; // creates DTA
      const badDebtReserve = randInt(2, 4) * 10000; // creates DTA
      const muniInterest = randInt(3, 6) * 10000; // permanent ($0 DTA/DTL)
      const dtl = Math.round(excessMacrs * 0.21);
      const dta = Math.round((warrantyAccrual + badDebtReserve) * 0.21);
      const netDtl = dtl - dta;
      return {
        prompt: `[ASC 740 Balance Sheet Provision] In its first year of operations, a C Corporation (subject to a 21% tax rate) has four book-to-tax differences:\n1. Tax MACRS depreciation exceeds Book depreciation by ${fmt(excessMacrs)}.\n2. Book accrued warranty expense exceeds actual tax warranty payouts by ${fmt(warrantyAccrual)}.\n3. Book bad debt allowance exceeds actual tax write-offs by ${fmt(badDebtReserve)}.\n4. Tax-exempt municipal bond interest income is ${fmt(muniInterest)}.\n\nUnder ASC 740, what is the corporation's gross Deferred Tax Asset (DTA), gross Deferred Tax Liability (DTL), and net deferred tax balance sheet position at year-end?`,
        correct: `Gross DTA: ${fmt(dta)} | Gross DTL: ${fmt(dtl)} | Net Balance Sheet Position: Net DTL of ${fmt(netDtl)} (Muni interest is permanent and creates $0 deferred tax).`,
        distractors: [
          `Gross DTA: ${fmt(dtl)} | Gross DTL: ${fmt(dta)} | Net Balance Sheet Position: Net DTA of ${fmt(netDtl)} (swapping DTAs and DTLs).`,
          `Gross DTA: ${fmt(dta + Math.round(muniInterest * 0.21))} | Gross DTL: ${fmt(dtl)} (including permanent municipal bond interest in DTAs).`,
          `Gross DTA: ${fmt(warrantyAccrual + badDebtReserve)} | Gross DTL: ${fmt(excessMacrs)} (failing to multiply temporary differences by the 21% tax rate).`
        ],
        concept: `Under ASC 740: (1) Excess tax depreciation (${fmt(excessMacrs)}) means higher taxable income in future years -> Deferred Tax Liability (DTL) of ${fmt(excessMacrs)} * 21% = ${fmt(dtl)}; (2) Disallowed book accruals for warranties (${fmt(warrantyAccrual)}) and bad debts (${fmt(badDebtReserve)}) mean future tax deductions -> Deferred Tax Asset (DTA) of ${fmt(warrantyAccrual + badDebtReserve)} * 21% = ${fmt(dta)}; and (3) Municipal bond interest (${fmt(muniInterest)}) is a Permanent Difference that never reverses ($0 DTA/DTL).`,
        math: `1. Gross DTL = ${fmt(excessMacrs)} (Excess MACRS) * 21% = ${fmt(dtl)}\n2. Gross DTA = (${fmt(warrantyAccrual)} Warranty + ${fmt(badDebtReserve)} Bad Debt) * 21% = ${fmt(dta)}\n3. Muni Bond Interest (${fmt(muniInterest)}) = Permanent Difference ($0 DTA/DTL)\n4. Net Deferred Tax Position = ${fmt(dtl)} DTL - ${fmt(dta)} DTA = ${fmt(netDtl)} Net DTL`,
        whyWrong: [
          `Incorrect: You reversed DTAs and DTLs; taking extra tax depreciation today creates a future tax liability (DTL), while disallowed book reserves create future tax deductions (DTAs).`,
          `Incorrect: Municipal bond interest is a permanent difference and never generates a DTA or DTL.`,
          `Incorrect: Under ASC 740, temporary differences must be multiplied by the enacted statutory tax rate (21%).`
        ]
      };
    }
  },
  {
    id: 't6_3_reverse_163j_ati', topic: 't6', archNum: 3, angle: 'Reverse-Engineer ATI from 163(j) Carryforward', isMath: true,
    generate() {
      const ati = randInt(10, 25) * 100000;
      const intInc = randInt(3, 7) * 10000;
      const thirtyPctAti = Math.round(ati * 0.30);
      const allowed = intInc + thirtyPctAti;
      const carryforward = randInt(8, 16) * 10000;
      const totIntExp = allowed + carryforward;
      return {
        prompt: `[Reverse-Engineering IRC 163(j)] During the year, a corporation paid ${fmt(totIntExp)} of Business Interest Expense and earned ${fmt(intInc)} of Business Interest Income. After applying the IRC 163(j) limitation, exactly ${fmt(carryforward)} of Business Interest Expense was disallowed and carried forward to next year (meaning ${fmt(allowed)} was allowed as a current deduction).\n\nWorking backward, what was the corporation's Adjusted Taxable Income (ATI) for the year?`,
        correct: `${fmt(ati)} (because ${fmt(allowed)} allowed minus ${fmt(intInc)} interest income = ${fmt(thirtyPctAti)}, and ${fmt(thirtyPctAti)} / 30% = ${fmt(ati)}).`,
        distractors: [
          `${fmt(Math.round(allowed / 0.30))} (dividing the entire ${fmt(allowed)} allowed deduction by 30% without subtracting ${fmt(intInc)} Business Interest Income first).`,
          `${fmt(Math.round(thirtyPctAti * 0.30))} (multiplying ${fmt(thirtyPctAti)} by 30% instead of dividing by 30%).`,
          `${fmt(Math.round((totIntExp - intInc) / 0.30))} (using total interest expense instead of allowed interest expense).`
        ],
        concept: `Under IRC 163(j), Allowed Interest Deduction = Business Interest Income + (30% * ATI). Therefore, to solve backward for ATI:\nStep 1: Allowed Interest = Total Interest Expense (${fmt(totIntExp)}) - Disallowed Carryforward (${fmt(carryforward)}) = ${fmt(allowed)}.\nStep 2: Subtract 100% Business Interest Income (${fmt(allowed)} - ${fmt(intInc)} = ${fmt(thirtyPctAti)}).\nStep 3: Divide by 0.30 (${fmt(thirtyPctAti)} / 0.30 = ${fmt(ati)}).`,
        math: `1. Allowed Interest Deduction = ${fmt(totIntExp)} - ${fmt(carryforward)} = ${fmt(allowed)}\n2. Portion from 30% of ATI = ${fmt(allowed)} - ${fmt(intInc)} (Interest Income) = ${fmt(thirtyPctAti)}\n3. Solve for ATI: 0.30 * ATI = ${fmt(thirtyPctAti)} -> ATI = ${fmt(thirtyPctAti)} / 0.30 = ${fmt(ati)}`,
        whyWrong: [
          `Incorrect: Business Interest Income (${fmt(intInc)}) is allowed dollar-for-dollar (100%) on top of 30% of ATI, so you must subtract ${fmt(intInc)} before dividing by 0.30.`,
          `Incorrect: You multiplied by 0.30 instead of dividing by 0.30.`,
          `Incorrect: ${fmt(totIntExp)} includes the ${fmt(carryforward)} disallowed portion that exceeded the cap.`
        ]
      };
    }
  },
  {
    id: 't6_4_etr_permanent_diff', topic: 't6', archNum: 4, angle: 'Effective Tax Rate (ETR) vs. Cash Tax Rate (ASC 740)', isMath: true,
    generate() {
      const preTaxBook = 1000000;
      const permAddBack = pick([100000, 200000]); // fines/meals/key-person premiums
      const tempExcessMacrs = pick([150000, 250000]); // temporary difference
      // Under ASC 740, Total Tax Expense (Current + Deferred) is affected ONLY by Permanent Differences!
      const bookTaxableBaseForETR = preTaxBook + permAddBack;
      const totalAsc740TaxExp = Math.round(bookTaxableBaseForETR * 0.21);
      const etrPct = ((totalAsc740TaxExp / preTaxBook) * 100).toFixed(2);
      const currentTaxableInc = preTaxBook + permAddBack - tempExcessMacrs;
      const currentCashTax = Math.round(currentTaxableInc * 0.21);
      const deferredTaxExp = Math.round(tempExcessMacrs * 0.21);
      return {
        prompt: `[ASC 740 Provision Insight] A C Corporation (21% statutory tax rate) reports Pre-Tax Book Income of ${fmt(preTaxBook)}. It has two book-to-tax differences:\n• A ${fmt(permAddBack)} Permanent Difference (nondeductible government fines and 50% disallowed meals).\n• A ${fmt(tempExcessMacrs)} Favorable Temporary Difference (excess tax MACRS depreciation over book depreciation).\n\nWhy does the ${fmt(tempExcessMacrs)} temporary difference reduce Current Cash Tax Payable to ${fmt(currentCashTax)} WITHOUT lowering the company's GAAP Effective Tax Rate (ETR), and what is the company's GAAP Total Tax Expense and ETR?`,
        correct: `GAAP Total Tax Expense is ${fmt(totalAsc740TaxExp)} (an ETR of ${etrPct}%), because the ${fmt( deferredTaxExp)} current tax savings from MACRS is offset dollar-for-dollar by a ${fmt(deferredTaxExp)} Deferred Tax Expense (DTL); only the ${fmt(permAddBack)} permanent difference changes the ETR!`,
        distractors: [
          `GAAP Total Tax Expense is ${fmt(currentCashTax)} (an ETR of ${((currentCashTax / preTaxBook) * 100).toFixed(2)}%), because excess MACRS permanently lowers the GAAP Effective Tax Rate.`,
          `GAAP Total Tax Expense is ${fmt(Math.round(preTaxBook * 0.21))} (an ETR of 21.00%), because neither permanent nor temporary differences affect the GAAP Effective Tax Rate.`,
          `GAAP Total Tax Expense is ${fmt(totalAsc740TaxExp + deferredTaxExp)}, because both the permanent and temporary differences increase the ETR.`
        ],
        concept: `Crucial ASC 740 concept: Total GAAP Income Tax Expense = Current Tax Expense + Deferred Tax Expense. Temporary differences (like excess MACRS of ${fmt(tempExcessMacrs)}) reduce Current Tax Expense by ${fmt(deferredTaxExp)}, but simultaneously increase Deferred Tax Expense (DTL) by +${fmt(deferredTaxExp)}—netting to $0 impact on Total Tax Expense and ETR! Only Permanent Differences (${fmt(permAddBack)}) change Total GAAP Tax Expense and move the Effective Tax Rate away from 21%.`,
        math: `1. Current Taxable Income = ${fmt(preTaxBook)} + ${fmt(permAddBack)} (Perm) - ${fmt(tempExcessMacrs)} (Temp) = ${fmt(currentTaxableInc)}\n2. Current Tax Expense (Cash Tax) = ${fmt(currentTaxableInc)} * 21% = ${fmt(currentCashTax)}\n3. Deferred Tax Expense (DTL Increase) = ${fmt(tempExcessMacrs)} * 21% = +${fmt(deferredTaxExp)}\n4. Total GAAP Tax Expense = ${fmt(currentCashTax)} + ${fmt(deferredTaxExp)} = ${fmt(totalAsc740TaxExp)}\n5. GAAP Effective Tax Rate (ETR) = ${fmt(totalAsc740TaxExp)} / ${fmt(preTaxBook)} = ${etrPct}%`,
        whyWrong: [
          `Incorrect: ${fmt(currentCashTax)} is only the Current Tax Expense; under ASC 740, you must add the ${fmt(deferredTaxExp)} Deferred Tax Expense (DTL) to get Total Tax Expense.`,
          `Incorrect: Permanent differences (${fmt(permAddBack)}) permanently increase Total Tax Expense without a deferred tax offset, pushing the ETR above 21% to ${etrPct}%.`,
          `Incorrect: Favorable temporary differences reduce current tax and add an equal deferred tax, netting to zero ETR effect.`
        ]
      };
    }
  },
  {
    id: 't6_5_key_person_life_cycle', topic: 't6', archNum: 5, angle: 'Key-Person Life Insurance Full Cycle (M-1)', isMath: true,
    generate() {
      const prem = randInt(2, 4) * 10000;
      const deathBenefit = randInt(40, 80) * 10000;
      return {
        prompt: `[Two-Sided M-1 Symmetry] A C Corporation purchases a ${fmt(deathBenefit)} key-person term life insurance policy on its CEO, naming the corporation itself as the sole beneficiary.\n• In Year 1, the corporation pays and expenses ${fmt(prem)} of policy premiums on its GAAP income statement.\n• In Year 2, the CEO tragically passes away and the corporation records ${fmt(deathBenefit)} of life insurance proceeds in GAAP Book Income.\n\nHow are the Year 1 premium and the Year 2 death benefit treated on the corporation's Schedule M-1?`,
        correct: `Both are Permanent Differences: Year 1 has a ${fmt(prem)} permanent M-1 ADD-BACK (nondeductible under IRC 264), and Year 2 has a ${fmt(deathBenefit)} permanent M-1 SUBTRACTION (tax-exempt under IRC 101).`,
        distractors: [
          `Year 1 has a ${fmt(prem)} M-1 add-back creating a DTA, which reverses when the ${fmt(deathBenefit)} is taxed in Year 2.`,
          `Year 1 has $0 M-1 adjustment (premiums are deductible under IRC 162), and Year 2 has a ${fmt(deathBenefit)} M-1 subtraction.`,
          `Year 1 has a ${fmt(prem)} permanent M-1 subtraction, and Year 2 has a ${fmt(deathBenefit)} permanent M-1 add-back.`
        ],
        concept: `IRC 264(a)(1) and IRC 101(a) operate as symmetrical mirrors: because the ${fmt(deathBenefit)} life insurance death benefit will be 100% tax-exempt when received by the corporation (a permanent M-1 subtraction in Year 2), Congress disallows any tax deduction for the ${fmt(prem)} premiums paid on a policy where the taxpayer is a beneficiary (a permanent M-1 add-back in Year 1).`,
        math: `• Year 1 (Premiums Paid where Corp is Beneficiary):\n  Book Expense = ${fmt(prem)} | Tax Deduction (IRC 264) = $0 -> Permanent M-1 Add-Back of +${fmt(prem)}\n• Year 2 (Death Benefit Collected):\n  Book Income = ${fmt(deathBenefit)} | Tax Income (IRC 101) = $0 -> Permanent M-1 Subtraction of -${fmt(deathBenefit)}`,
        whyWrong: [
          `Incorrect: Neither the premium disallowance nor the death benefit exclusion is a temporary difference; both are permanent differences ($0 DTA/DTL).`,
          `Incorrect: Life insurance premiums are only deductible if the employee (not the corporation) is the beneficiary as taxable fringe compensation; when the corporation is the beneficiary, IRC 264 disallows the deduction.`,
          `Incorrect: You reversed the M-1 signs—nondeductible book expenses are added back, and tax-exempt book income is subtracted.`
        ]
      };
    }
  },
  {
    id: 't6_6_spot_flaw_m1', topic: 't6', archNum: 6, angle: 'Spot the Flaw (Schedule M-1 Audit)', isMath: true,
    generate() {
      const book = 500000;
      const fedTax = 100000;
      const capLoss = 30000; // net capital loss deducted on books, not deductible for C Corp tax!
      const charity = 20000;
      const trueTaxableBeforeCharity = book + fedTax + capLoss; // 630,000
      return {
        prompt: `[Spot the Flaw] A C Corporation has after-tax Book Net Income of ${fmt(book)}. On the GAAP income statement, the company deducted ${fmt(fedTax)} of federal income tax expense and ${fmt(capLoss)} of Net Capital Losses (the company had $0 capital gains this year). A staff accountant computed Taxable Income as ${fmt(book - capLoss)} by forgetting to add back the ${fmt(fedTax)} federal tax expense and subtracting the ${fmt(capLoss)} net capital loss again.\n\nWhat is the corporation's true Taxable Income, and how is the ${fmt(capLoss)} corporate Net Capital Loss treated for tax purposes?`,
        correct: `True Taxable Income is ${fmt(trueTaxableBeforeCharity)}; both the ${fmt(fedTax)} federal tax expense (permanent) and the ${fmt(capLoss)} net capital loss (temporary, carried back 3 years / forward 5 years under IRC 1211/1212) must be ADDED BACK to Book Net Income on Schedule M-1!`,
        distractors: [
          `True Taxable Income is ${fmt(book + fedTax - 3000)}, because C Corporations can deduct up to $3,000 of net capital losses against ordinary income just like individuals.`,
          `True Taxable Income is ${fmt(book + fedTax)}, because corporate net capital losses are fully deductible against corporate ordinary income.`,
          `True Taxable Income is ${fmt(trueTaxableBeforeCharity)}, and the ${fmt(capLoss)} net capital loss is a permanent difference that expires immediately.`
        ],
        concept: `Unlike individuals (who can deduct up to $3,000 of net capital losses against ordinary income), a C Corporation can deduct capital losses ONLY against capital gains (IRC 1211(a))! Therefore, a ${fmt(capLoss)} net capital loss deducted on the GAAP income statement is 100% disallowed in the current year (added back on Schedule M-1) and creates a Temporary Difference (DTA) that carries back 3 years and forward 5 years against capital gains.`,
        math: `  After-Tax Book Net Income:      ${fmt(book)}\n+ Federal Income Tax Expense:    +${fmt(fedTax)} (Permanent M-1 Add-Back)\n+ Disallowed Net Capital Loss:   +${fmt(capLoss)} (Temporary M-1 Add-Back -> DTA)\n= True Federal Taxable Income:    ${fmt(trueTaxableBeforeCharity)}`,
        whyWrong: [
          `Incorrect: The $3,000 net capital loss deduction against ordinary income applies ONLY to individuals under IRC 1211(b), never to corporations!`,
          `Incorrect: Corporations cannot deduct net capital losses against ordinary business income.`,
          `Incorrect: Disallowed corporate capital losses are temporary differences (carried back 3 years and forward 5 years), not permanent.`
        ]
      };
    }
  },

  // ==================== MODULE 7: PARTNERSHIP BASIS & LOSS LIMITS (6 ANGLES) ====================
  {
    id: 't7_1_ordering_trap_dist_before_loss', topic: 't7', archNum: 1, angle: 'Basis Ordering Trap (Distributions Before Losses)', isMath: true,
    generate() {
      const begBasis = randInt(5, 8) * 10000;
      const cashDist = randInt(3, 4) * 10000;
      const allocLoss = begBasis; // equals begBasis, so after cashDist, only (begBasis - cashDist) is deductible!
      const remAfterDist = begBasis - cashDist;
      const allowedLoss = remAfterDist;
      const suspLoss = allocLoss - allowedLoss; // equals cashDist!
      return {
        prompt: `[Ordering Rule Trap] Partner V begins the year with an Outside Basis of ${fmt(begBasis)} (all cash/recourse). During the year, the partnership breaks even on revenue until allocating Partner V an ordinary operating loss of ${fmt(allocLoss)}, and also distributes ${fmt(cashDist)} in cash to Partner V.\n\nPartner V's accountant deducts the ${fmt(allocLoss)} loss FIRST (reducing basis from ${fmt(begBasis)} to $0) and reports a ${fmt(cashDist)} taxable capital gain on the cash distribution under IRC 731. Why is the accountant wrong under Treas. Reg. 1.704-1(d), and what is the true tax result?`,
        correct: `Cash distributions reduce Outside Basis BEFORE losses! Thus, the ${fmt(cashDist)} cash distribution reduces basis from ${fmt(begBasis)} to ${fmt(remAfterDist)} ($0 gain under IRC 731), and only ${fmt(allowedLoss)} of the loss is deductible now, with ${fmt(suspLoss)} suspended under IRC 704(d).`,
        distractors: [
          `The accountant is right; losses are always deducted before cash distributions, triggering ${fmt(cashDist)} of capital gain and ${fmt(allocLoss)} of ordinary loss deduction.`,
          `Both the ${fmt(cashDist)} cash distribution is tax-free AND all ${fmt(allocLoss)} of loss is currently deductible, leaving a negative basis of -${fmt(cashDist)}.`,
          `Partner V must recognize ${fmt(cashDist)} of ordinary income and suspend 100% (${fmt(allocLoss)}) of the loss.`
        ],
        concept: `Under IRC 704(d) and IRC 705 ordering rules, Outside Basis is adjusted at year-end in a strict sequence:\n1. FIRST: Increase for current-year income.\n2. SECOND: Decrease for current-year distributions.\n3. THIRD (LAST): Decrease for current-year losses.\nBecause distributions come BEFORE losses, the ${fmt(cashDist)} cash distribution is 100% tax-free (reducing basis from ${fmt(begBasis)} to ${fmt(remAfterDist)}), which leaves only ${fmt(allowedLoss)} of basis to absorb the loss and suspends ${fmt(suspLoss)} under IRC 704(d)!`,
        math: `Strict Statutory Ordering (IRC 705 / 704(d)):\n1. Beginning Outside Basis:                  ${fmt(begBasis)}\n2. Less Cash Distribution FIRST (IRC 731):  -${fmt(cashDist)} -> $0 Gain Recognized!\n3. Remaining Basis Available for Losses:     ${fmt(remAfterDist)}\n4. Deductible Loss (Capped at Basis):       -${fmt(allowedLoss)}\n5. Loss Suspended under IRC 704(d):          ${fmt(suspLoss)} (Ending Basis = $0)`,
        whyWrong: [
          `Incorrect: Deducting losses before distributions violates Treas. Reg. 1.704-1(d) and Rev. Rul. 66-94.`,
          `Incorrect: Partnership outside basis can never be negative.`,
          `Incorrect: Partner V still has ${fmt(remAfterDist)} of remaining basis after the cash distribution to deduct ${fmt(allowedLoss)} of the loss.`
        ]
      };
    }
  },
  {
    id: 't7_2_reverse_3_tier_loss', topic: 't7', archNum: 2, angle: 'Reverse-Engineer Debt & Passive Income from Loss Hurdles', isMath: true,
    generate() {
      const cashContrib = randInt(4, 7) * 10000;
      const nonrecDebt = randInt(3, 5) * 10000;
      const totOutBasis = cashContrib + nonrecDebt;
      const s704 = randInt(2, 4) * 10000;
      const totLoss = totOutBasis + s704;
      const passInc = randInt(1, 3) * 10000;
      const s469 = cashContrib - passInc;
      return {
        prompt: `[Reverse-Engineering 3-Tier Loss Limits] A passive limited partner was allocated a ${fmt(totLoss)} ordinary loss from an equipment partnership. On the partner's tax workpapers, the loss was filtered through the three statutory hurdles as follows:\n• Hurdle 1 (IRC 704(d) Outside Basis): ${fmt(s704)} was suspended, and ${fmt(totOutBasis)} cleared Hurdle 1.\n• Hurdle 2 (IRC 465 At-Risk): ${fmt(nonrecDebt)} was suspended, and ${fmt(cashContrib)} cleared Hurdle 2.\n• Hurdle 3 (IRC 469 Passive Activity): ${fmt(s469)} was suspended, and ${fmt(passInc)} was deducted on Form 1040.\n\nWorking backward from those numbers, what was the partner's share of regular Nonrecourse Debt, what was their At-Risk Basis, and how much outside Passive Income did the partner have?`,
        correct: `Regular Nonrecourse Debt was ${fmt(nonrecDebt)}, At-Risk Basis was ${fmt(cashContrib)}, and outside Passive Income was ${fmt(passInc)}.`,
        distractors: [
          `Regular Nonrecourse Debt was ${fmt(s704)}, At-Risk Basis was ${fmt(totOutBasis)}, and outside Passive Income was ${fmt(s469)}.`,
          `Regular Nonrecourse Debt was ${fmt(nonrecDebt)}, At-Risk Basis was ${fmt(totOutBasis)}, and outside Passive Income was ${fmt(cashContrib)}.`,
          `Regular Nonrecourse Debt was ${fmt(s469)}, At-Risk Basis was ${fmt(passInc)}, and outside Passive Income was ${fmt(s704)}.`
        ],
        concept: `Understanding the gap between each hurdle lets you read any partnership K-1 workpaper backward:\n1. The amount clearing Hurdle 1 (${fmt(totOutBasis)}) is Total Outside Basis.\n2. The amount clearing Hurdle 2 (${fmt(cashContrib)}) is At-Risk Basis.\n3. The difference suspended at Hurdle 2 (${fmt(totOutBasis)} - ${fmt(cashContrib)} = ${fmt(nonrecDebt)}) is the partner's regular Nonrecourse Debt!\n4. The amount clearing Hurdle 3 (${fmt(passInc)}) is the partner's outside Passive Income.`,
        math: `• Total Outside Basis (Cleared IRC 704(d)) = ${fmt(totOutBasis)}\n• At-Risk Basis (Cleared IRC 465) = ${fmt(cashContrib)}\n• Implied Regular Nonrecourse Debt (Suspended at IRC 465) = ${fmt(totOutBasis)} - ${fmt(cashContrib)} = ${fmt(nonrecDebt)}\n• Outside Passive Income (Cleared IRC 469) = ${fmt(passInc)}`,
        whyWrong: [
          `Incorrect: ${fmt(s704)} is the loss exceeding total outside basis, and ${fmt(s469)} is the passive loss suspended at Hurdle 3.`,
          `Incorrect: ${fmt(totOutBasis)} includes the ${fmt(nonrecDebt)} nonrecourse debt, so At-Risk basis is only ${fmt(cashContrib)}.`,
          `Incorrect: You mismatched all three hurdle outputs.`
        ]
      };
    }
  },
  {
    id: 't7_3_advisory_unlock_suspended_loss', topic: 't7', archNum: 3, angle: 'Year-End Advisory to Unlock Suspended Losses', isMath: true,
    generate() {
      const s465 = randInt(3, 6) * 10000;
      return {
        prompt: `[Year-End Tax Planning] An active general partner (who materially participates > 500 hours/year, so IRC 469 does NOT limit their losses) has ${fmt(s465)} of partnership loss that ALREADY cleared IRC 704(d) Outside Basis because of regular nonrecourse equipment debt, but is currently suspended under IRC 465 (At-Risk Limitation).\n\nWhich of the following year-end actions before December 31 will legally unlock and allow the partner to deduct that ${fmt(s465)} loss on this year's return?`,
        correct: `Contribute ${fmt(s465)} of cash to the partnership (or refinance/convert ${fmt(s465)} of the partnership's nonrecourse debt into recourse debt for which the partner bears personal economic risk of loss).`,
        distractors: [
          `Have the partnership borrow an additional ${fmt(s465)} of regular nonrecourse equipment debt.`,
          `Generate ${fmt(s465)} of passive rental income from another partnership.`,
          `Do nothing; losses suspended under IRC 465 automatically convert into capital losses on Schedule D at year-end.`
        ],
        concept: `To unlock a loss suspended specifically at Hurdle 2 (IRC 465 At-Risk), the partner must increase their At-Risk Basis! Contributing cash (+${fmt(s465)}) or assuming personal recourse liability on ${fmt(s465)} of partnership debt increases At-Risk Basis under IRC 465(b), immediately releasing the suspended loss (and since the partner materially participates, it bypasses IRC 469 and is deductible immediately).`,
        math: `Target: Increase IRC 465 At-Risk Basis by +${fmt(s465)}\n• Cash Contribution / Recourse Debt Increase -> Increases At-Risk Basis by +${fmt(s465)} (Unlocks Loss!)\n• Regular Nonrecourse Debt -> Increases 704(d) Basis ONLY ($0 At-Risk increase!)\n• Passive Income -> Helps IRC 469 ONLY (Cannot bypass IRC 465!)`,
        whyWrong: [
          `Incorrect: Regular nonrecourse equipment debt increases IRC 704(d) Outside Basis, NOT IRC 465 At-Risk Basis.`,
          `Incorrect: Passive income only unlocks losses stuck at Hurdle 3 (IRC 469); a loss stuck at Hurdle 2 (IRC 465) never reaches IRC 469 until At-Risk basis is restored.`,
          `Incorrect: Losses suspended under IRC 465 carry forward indefinitely until At-Risk basis is increased or the activity is disposed of.`
        ]
      };
    }
  },
  {
    id: 't7_4_two_property_nonliq_dist', topic: 't7', archNum: 4, angle: 'Non-Liquidating Distribution vs. Sale Comparison', isMath: true,
    generate() {
      const outB = randInt(5, 8) * 10000;
      const cash = randInt(2, 3) * 10000;
      const remAfterCash = outB - cash;
      const equipInBasis = remAfterCash + randInt(2, 4) * 10000;
      const equipFmv = equipInBasis + 20000;
      const builtInGainIfSold = equipFmv - remAfterCash;
      return {
        prompt: `[Two-Step Transaction Tracking] Partner D (Outside Basis ${fmt(outB)}) receives a non-liquidating current distribution consisting of ${fmt(cash)} cash and equipment (Inside Basis ${fmt(equipInBasis)}, FMV ${fmt(equipFmv)}). One week after receiving the distribution, Partner D sells the equipment to a third party for its ${fmt(equipFmv)} FMV.\n\nHow much gain does Partner D recognize (1) at the moment of the partnership distribution under IRC 731, and (2) one week later when Partner D sells the equipment for ${fmt(equipFmv)}?`,
        correct: `At Distribution: $0 gain (Equipment takes a capped basis of ${fmt(remAfterCash)} under IRC 732(a)(2)) | At Subsequent Sale: ${fmt(builtInGainIfSold)} gain (${fmt(equipFmv)} sale price minus ${fmt(remAfterCash)} stepped-down equipment basis).`,
        distractors: [
          `At Distribution: ${fmt(cash + equipInBasis - outB)} gain | At Subsequent Sale: ${fmt(equipFmv - equipInBasis)} gain.`,
          `At Distribution: ${fmt(cash + equipFmv - outB)} gain | At Subsequent Sale: $0 gain.`,
          `At Distribution: $0 gain | At Subsequent Sale: ${fmt(equipFmv - equipInBasis)} gain (using the partnership's ${fmt(equipInBasis)} inside basis).`
        ],
        concept: `This two-step problem illustrates WHY IRC 731 doesn't need to tax property distributions immediately: Instead of taxing Partner D at distribution (since Cash ${fmt(cash)} <= Outside Basis ${fmt(outB)}), IRC 732(a)(2) caps Partner D's basis in the equipment at their remaining outside basis (${fmt(outB)} - ${fmt(cash)} = ${fmt(remAfterCash)}). When Partner D later sells the equipment for ${fmt(equipFmv)}, that stepped-down basis of ${fmt(remAfterCash)} triggers the full ${fmt(builtInGainIfSold)} deferred gain!`,
        math: `Step 1 (At Distribution under IRC 731 / 732(a)):\n• Cash (${fmt(cash)}) <= Outside Basis (${fmt(outB)}) -> $0 Gain at Distribution!\n• Remaining Outside Basis = ${fmt(outB)} - ${fmt(cash)} = ${fmt(remAfterCash)}\n• Partner's Basis in Equipment = min(${fmt(equipInBasis)}, ${fmt(remAfterCash)}) = ${fmt(remAfterCash)}\n\nStep 2 (At Sale 1 Week Later under IRC 1001):\n• Sale Price (${fmt(equipFmv)}) - Stepped-Down Basis (${fmt(remAfterCash)}) = ${fmt(builtInGainIfSold)} Recognized Gain!`,
        whyWrong: [
          `Incorrect: Property distributions never trigger immediate gain under IRC 731.`,
          `Incorrect: Gain is deferred until the partner actually sells the distributed equipment.`,
          `Incorrect: Because Partner D only had ${fmt(remAfterCash)} of outside basis left after deducting the ${fmt(cash)} cash, the equipment's basis was stepped down from ${fmt(equipInBasis)} to ${fmt(remAfterCash)}.`
        ]
      };
    }
  },
  {
    id: 't7_5_debt_reduction_deemed_cash_gain', topic: 't7', archNum: 5, angle: 'Debt Payoff Triggering Deemed Cash Gain (IRC 752(b)/731)', isMath: true,
    generate() {
      const outB = randInt(3, 6) * 10000;
      const totDebtPaidOff = randInt(16, 24) * 10000;
      const partnerSharePct = 50;
      const deemedCashDist = Math.round(totDebtPaidOff * 0.50);
      const recGain = deemedCashDist - outB;
      return {
        prompt: `[Hidden Trap: Phantom Gain] Partner G is a ${partnerSharePct}% partner in a partnership and has an Outside Basis of ${fmt(outB)} (after prior years' losses). During the year, the partnership distributes $0 actual cash to Partner G, but uses existing partnership cash reserves to pay off ${fmt(totDebtPaidOff)} of partnership debt. Why does Partner G owe capital gains tax this year despite receiving $0 physical cash, and how much gain must Partner G recognize?`,
        correct: `Under IRC 752(b), eliminating Partner G's ${partnerSharePct}% share of partnership debt is treated as a deemed cash distribution of ${fmt(deemedCashDist)}; since ${fmt(deemedCashDist)} exceeds Partner G's ${fmt(outB)} outside basis, Partner G recognizes ${fmt(recGain)} of capital gain under IRC 731!`,
        distractors: [
          `$0 gain, because IRC 731 only taxes actual physical cash distributions, not partnership debt reductions.`,
          `${fmt(totDebtPaidOff - outB)} of gain, because a 50% partner is treated as relieved of 100% of the partnership's debt.`,
          `${fmt(deemedCashDist)} of ordinary cancellation-of-debt (COD) income under IRC 61(a)(11).`
        ],
        concept: `One of the biggest real-world traps in Subchapter K: Under IRC 752(b), any decrease in a partner's share of partnership liabilities (${fmt(deemedCashDist)}) is treated as a distribution of MONEY (deemed cash) to the partner! Under IRC 731(a)(1), if that deemed cash distribution (${fmt(deemedCashDist)}) exceeds the partner's Outside Basis (${fmt(outB)}), the partner recognizes immediate capital gain of ${fmt(recGain)} ("phantom gain") with zero cash in hand!`,
        math: `1. Partnership Debt Paid Off = ${fmt(totDebtPaidOff)}\n2. Partner G's ${partnerSharePct}% Debt Reduction = Deemed Cash Distribution (IRC 752(b)) = ${fmt(deemedCashDist)}\n3. Less Partner G's Outside Basis = -${fmt(outB)}\n4. Recognized Capital Gain (IRC 731(a)(1)) = ${fmt(recGain)} (Ending Outside Basis = $0)`,
        whyWrong: [
          `Incorrect: IRC 752(b) explicitly treats a reduction in a partner's share of liabilities as a distribution of money for all purposes of IRC 731.`,
          `Incorrect: Partner G is only relieved of their ${partnerSharePct}% share (${fmt(deemedCashDist)}) of the liability.`,
          `Incorrect: Because the partnership paid off the debt in full rather than having it forgiven by a lender, this is a deemed distribution under IRC 752(b)/731 (capital gain to the extent it exceeds basis), not COD income.`
        ]
      };
    }
  },
  {
    id: 't7_6_basis_roll_audit', topic: 't7', archNum: 6, angle: 'Spot the Flaw (Why Adjust Basis for Tax-Exempt & Nondeductible Items?)', isMath: true,
    generate() {
      const beg = randInt(6, 10) * 10000;
      const muni = randInt(2, 4) * 10000;
      const fines = randInt(1, 2) * 10000;
      const trueEnd = beg + muni - fines;
      return {
        prompt: `[Conceptual + Math Audit] Partner H contributes ${fmt(beg)} cash to form a partnership. In Year 1, the partnership breaks even on operations, except it earns ${fmt(muni)} of tax-exempt municipal bond interest (Partner H's share = ${fmt(muni)}) and pays ${fmt(fines)} of nondeductible government fines (Partner H's share = ${fmt(fines)}). On January 1 of Year 2, the partnership liquidates and distributes Partner H's net cash share of ${fmt(trueEnd)} to Partner H.\n\nIf IRC 705 did NOT adjust Outside Basis for tax-exempt income and nondeductible expenses (leaving basis at ${fmt(beg)}), Partner H would recognize a ${fmt(trueEnd - beg)} taxable capital gain upon liquidation! Under IRC 705, what is Partner H's true ending Year 1 Outside Basis and Year 2 liquidation gain?`,
        correct: `Ending Year 1 Outside Basis is ${fmt(trueEnd)} (${fmt(beg)} + ${fmt(muni)} tax-exempt income - ${fmt(fines)} nondeductible fines), resulting in $0 gain upon the ${fmt(trueEnd)} cash liquidation!`,
        distractors: [
          `Ending Year 1 Outside Basis is ${fmt(beg)}, resulting in ${fmt(trueEnd - beg)} of taxable capital gain upon liquidation.`,
          `Ending Year 1 Outside Basis is ${fmt(beg - muni + fines)}, resulting in ${fmt(2 * (muni - fines))} of taxable capital gain upon liquidation.`,
          `Ending Year 1 Outside Basis is ${fmt(beg + muni)}, because nondeductible fines do not reduce outside basis.`
        ],
        concept: `This scenario explains the entire policy "WHY" behind IRC 705(a)(1)(B) and IRC 705(a)(2)(B): We ADD tax-exempt income (+${fmt(muni)}) to Outside Basis so that the tax-exempt cash doesn't get taxed as a capital gain when distributed later! Similarly, we SUBTRACT nondeductible expenses (-${fmt(fines)}) from Outside Basis so the partner cannot convert a disallowed deduction into a capital loss upon liquidation!`,
        math: `1. Initial Outside Basis:                   ${fmt(beg)}\n2. Plus Tax-Exempt Muni Interest (IRC 705): +${fmt(muni)} (Prevents taxing exempt cash at liquidation!)\n3. Less Nondeductible Fines (IRC 705):      -${fmt(fines)} (Prevents deducting fines as capital loss!)\n4. True Ending Year 1 Outside Basis:        ${fmt(trueEnd)}\n5. Year 2 Liquidation (${fmt(trueEnd)} Cash - ${fmt(trueEnd)} Basis) = $0 Gain/Loss!`,
        whyWrong: [
          `Incorrect: Failing to adjust basis for tax-exempt and nondeductible items would turn tax-exempt income into taxable capital gain upon liquidation.`,
          `Incorrect: You subtracted tax-exempt income and added nondeductible expenses.`,
          `Incorrect: Nondeductible, noncapital expenditures reduce outside basis under IRC 705(a)(2)(B).`
        ]
      };
    }
  },

  // ==================== MODULE 8: LIQUIDATIONS (6 ANGLES) ====================
  {
    id: 't8_1_advisory_part_liq_loss_cliff', topic: 't8', archNum: 1, angle: 'Advisory Cliff (Preserving a 731(a)(2) Liquidating Loss)', isMath: true,
    generate() {
      const outB = randInt(15, 25) * 10000;
      const cash = randInt(5, 9) * 10000;
      const equipFmv = 5000;
      const potentialLoss = outB - cash;
      const subBasisEquip = outB - cash;
      return {
        prompt: `[Structuring Advisory Cliff] Partner J is retiring from a partnership and has an Outside Basis of ${fmt(outB)}. The managing partner proposes two liquidating distribution packages of equal value:\n• Package 1: ${fmt(cash)} in cash only.\n• Package 2: ${fmt(cash - equipFmv)} in cash PLUS an old office printer/computer (a Section 1231 asset, not inventory) worth ${fmt(equipFmv)}.\n\nWhy is Package 1 vastly superior to Package 2 for Partner J's current-year tax return under IRC 731(a)(2) and IRC 732(b)?`,
        correct: `Under Package 1 (solely cash), Partner J immediately recognizes a ${fmt(potentialLoss)} capital loss under IRC 731(a)(2); under Package 2, receiving the ${fmt(equipFmv)} office printer BLOCKS the entire loss recognition ($0 loss allowed) and forces Partner J to assign a ${fmt(subBasisEquip + equipFmv)} substituted basis to a printer worth only ${fmt(equipFmv)}!`,
        distractors: [
          `Package 2 is better because Partner J can immediately deduct ${fmt(subBasisEquip)} of loss AND keep the office printer tax-free.`,
          `Both Package 1 and Package 2 allow Partner J to recognize an immediate capital loss on this year's tax return.`,
          `Neither Package 1 nor Package 2 allows a loss because partners can never recognize a loss on a partnership liquidation.`
        ],
        concept: `Under IRC 731(a)(2), a partner can recognize a loss on a liquidating distribution ONLY if the distribution consists EXCLUSIVELY of cash, unrealized receivables, and/or inventory! Throwing even a single non-hot asset (like a ${fmt(equipFmv)} office printer, vehicle, or parcel of land) into a liquidating distribution disqualifies 100% of the current loss and traps the entire remaining outside basis (${fmt(subBasisEquip + equipFmv)}) inside that asset as a substituted basis under IRC 732(b)!`,
        math: `• Package 1 (${fmt(cash)} Cash Only):\n  Solely Cash/Hot Assets? YES -> Immediate Recognized Capital Loss = ${fmt(outB)} - ${fmt(cash)} = ${fmt(potentialLoss)}!\n• Package 2 (${fmt(cash - equipFmv)} Cash + ${fmt(equipFmv)} Office Equipment):\n  Solely Cash/Hot Assets? NO! -> Recognized Loss = $0! Printer takes Substituted Basis of ${fmt(subBasisEquip + equipFmv)}!`,
        whyWrong: [
          `Incorrect: Receiving any property other than cash, unrealized receivables, or inventory strictly prohibits loss recognition under IRC 731(a)(2).`,
          `Incorrect: Package 2 violates the "solely cash, unrealized receivables, or inventory" requirement of IRC 731(a)(2).`,
          `Incorrect: Package 1 satisfies IRC 731(a)(2) and allows an immediate ${fmt(potentialLoss)} capital loss.`
        ]
      };
    }
  },
  {
    id: 't8_2_corp_vs_part_liq_side_by_side', topic: 't8', archNum: 2, angle: 'Side-by-Side Entity Liquidation Comparison', isMath: true,
    generate() {
      const insideBasis = randInt(10, 16) * 10000;
      const fmv = insideBasis + randInt(10, 18) * 10000;
      const ownerBasis = randInt(8, 13) * 10000;
      const cCorpGain = fmv - insideBasis;
      const shGain = fmv - ownerBasis;
      return {
        prompt: `[Side-by-Side Comparison] An entity holds a single parcel of unencumbered commercial land (Inside Basis ${fmt(insideBasis)}, FMV ${fmt(fmv)}) and distributes the land in complete liquidation to its sole owner (whose Outside Stock/Partnership Basis is ${fmt(ownerBasis)}).\n\nCompare the immediate recognized gain and the owner's ending basis in the land if the entity is (1) a C Corporation (IRC 336(a) & IRC 331) vs. (2) a Partnership (IRC 731 & IRC 732(b)):`,
        correct: `C Corporation: Corp recognizes ${fmt(cCorpGain)} gain AND Shareholder recognizes ${fmt(shGain)} capital gain (Land Basis = ${fmt(fmv)} FMV) | Partnership: Partnership recognizes $0 gain AND Partner recognizes $0 gain (Land takes a ${fmt(ownerBasis)} substituted basis).`,
        distractors: [
          `C Corporation: $0 Corp gain and ${fmt(shGain)} Shareholder gain | Partnership: ${fmt(cCorpGain)} Partnership gain and $0 Partner gain.`,
          `Both the C Corporation and the Partnership trigger ${fmt(cCorpGain)} of entity-level gain and give the owner a ${fmt(fmv)} FMV basis in the land.`,
          `C Corporation: ${fmt(cCorpGain)} Corp gain and ${fmt(shGain)} Shareholder gain | Partnership: $0 gain and the Partner takes a carryover inside basis of ${fmt(insideBasis)} in the land.`
        ],
        concept: `This comparison highlights the sharpest contrast in business taxation:\n• C Corporation Liquidation (IRC 336(a) / IRC 331): Treated as a deemed sale at FMV by the corporation (${fmt(cCorpGain)} gain) followed by a taxable exchange of stock by the shareholder (${fmt(shGain)} gain), giving the shareholder a stepped-up FMV basis (${fmt(fmv)}).\n• Partnership Liquidation (IRC 731 / IRC 732(b)): Completely tax-free when no cash is distributed ($0 entity gain, $0 partner gain), and the partner steps into a substituted basis equal to their outside basis (${fmt(ownerBasis)}).`,
        math: `• C Corporation Liquidation:\n  Corp Gain (IRC 336(a)) = ${fmt(fmv)} - ${fmt(insideBasis)} = ${fmt(cCorpGain)}\n  Shareholder Gain (IRC 331) = ${fmt(fmv)} - ${fmt(ownerBasis)} = ${fmt(shGain)} | Land Basis = ${fmt(fmv)}\n• Partnership Liquidation:\n  Entity & Partner Gain (IRC 731) = $0 | Land Substituted Basis (IRC 732(b)) = ${fmt(ownerBasis)}`,
        whyWrong: [
          `Incorrect: Liquidating C Corporations recognize full gain under IRC 336(a), while liquidating partnerships recognize $0 gain.`,
          `Incorrect: Partnership liquidations do not trigger gain on property distributions.`,
          `Incorrect: In a LIQUIDATING partnership distribution (IRC 732(b)), the land takes a substituted basis equal to the partner's outside basis (${fmt(ownerBasis)}), not the partnership's inside basis (${fmt(insideBasis)}).`
        ]
      };
    }
  },
  {
    id: 't8_3_corp_336b_reverse', topic: 't8', archNum: 3, angle: 'Spot the Flaw (Underwater Mortgage in Corporate Liquidation)', isMath: true,
    generate() {
      const inBasis = randInt(10, 16) * 10000;
      const actualFmv = inBasis + randInt(3, 6) * 10000;
      const mortgage = actualFmv + randInt(5, 9) * 10000;
      const cfoGain = actualFmv - inBasis;
      const trueGain = mortgage - inBasis;
      const understatement = trueGain - cfoGain; // equals mortgage - actualFmv
      return {
        prompt: `[Spot the Flaw] A liquidating C Corporation distributes an office building (Inside Basis ${fmt(inBasis)}, actual appraised FMV ${fmt(actualFmv)}) to its sole shareholder, who assumes the building's underwater mortgage of ${fmt(mortgage)}. The corporation's CFO calculates corporate-level gain under IRC 336(a) as ${fmt(cfoGain)} (Actual FMV ${fmt(actualFmv)} minus Inside Basis ${fmt(inBasis)}).\n\nUnder IRC 336(b), by how much did the CFO understate the corporation's recognized gain, and what is the true corporate gain?`,
        correct: `The CFO understated corporate gain by ${fmt(understatement)}; under IRC 336(b), because the ${fmt(mortgage)} liability assumed exceeds the ${fmt(actualFmv)} actual FMV, the Deemed FMV is ${fmt(mortgage)}, resulting in ${fmt(trueGain)} of corporate recognized gain!`,
        distractors: [
          `The CFO did not understate gain; corporate gain under IRC 336(a) is always based on actual appraised FMV (${fmt(actualFmv)}), yielding ${fmt(cfoGain)}.`,
          `The CFO overstated gain; subtracting the ${fmt(mortgage)} mortgage from ${fmt(actualFmv)} FMV creates a corporate loss.`,
          `True corporate gain is ${fmt(mortgage)} (the full amount of the mortgage without subtracting the ${fmt(inBasis)} inside basis).`
        ],
        concept: `Under IRC 336(b) (codifying the Tufts principle for corporate liquidations), if distributed property is subject to a liability that exceeds its actual Fair Market Value, the Fair Market Value of the property for purposes of computing corporate gain under IRC 336(a) is treated as NOT LESS than the amount of the liability (${fmt(mortgage)}).`,
        math: `1. Actual Appraised FMV = ${fmt(actualFmv)} vs. Liability Assumed = ${fmt(mortgage)}\n2. IRC 336(b) Deemed FMV Floor = max(${fmt(actualFmv)}, ${fmt(mortgage)}) = ${fmt(mortgage)}\n3. True Corporate Gain = ${fmt(mortgage)} (Deemed FMV) - ${fmt(inBasis)} (Inside Basis) = ${fmt(trueGain)}\n4. CFO's Understatement = ${fmt(trueGain)} - ${fmt(cfoGain)} = ${fmt(understatement)}`,
        whyWrong: [
          `Incorrect: IRC 336(b) overrides actual FMV whenever the liability assumed by the shareholder exceeds actual FMV.`,
          `Incorrect: Liabilities assumed by a shareholder increase (or set a floor on) the corporation's amount realized; they never create a loss.`,
          `Incorrect: The corporation still subtracts its ${fmt(inBasis)} adjusted inside basis from the ${fmt(mortgage)} deemed FMV.`
        ]
      };
    }
  },
  {
    id: 't8_4_sh_331_encumbered_prop', topic: 't8', archNum: 4, angle: 'Shareholder 331 Gain & 334(a) Basis with Assumed Debt', isMath: true,
    generate() {
      const fmv = randInt(30, 50) * 10000;
      const liab = randInt(10, 18) * 10000; // liab < fmv
      const netFmv = fmv - liab;
      const shStockBasis = randInt(8, 16) * 10000;
      const shCapGain = netFmv - shStockBasis;
      return {
        prompt: `[Shareholder-Level Mechanics] In a complete corporate liquidation under IRC 331, a shareholder (whose Stock Basis is ${fmt(shStockBasis)}) receives a warehouse with a gross Fair Market Value of ${fmt(fmv)}, subject to a ${fmt(liab)} mortgage that the shareholder personally assumes.\n\nWhat is the shareholder's recognized capital gain under IRC 331, and what is the shareholder's new tax basis in the warehouse under IRC 334(a)?`,
        correct: `Shareholder IRC 331 Capital Gain: ${fmt(shCapGain)} (Net FMV received of ${fmt(netFmv)} minus ${fmt(shStockBasis)} stock basis) | Shareholder Basis in Warehouse (IRC 334(a)): ${fmt(fmv)} (Full gross FMV!).`,
        distractors: [
          `Shareholder IRC 331 Capital Gain: ${fmt(fmv - shStockBasis)} (ignoring the ${fmt(liab)} mortgage assumed) | Warehouse Basis: ${fmt(fmv)}.`,
          `Shareholder IRC 331 Capital Gain: ${fmt(shCapGain)} | Warehouse Basis: ${fmt(netFmv)} (reducing the asset's basis by the assumed mortgage).`,
          `Shareholder IRC 331 Capital Gain: $0 | Warehouse Basis: ${fmt(shStockBasis + liab)}.`
        ],
        concept: `Watch how the ${fmt(liab)} assumed liability affects the two shareholder rules differently:\n1. For computing Shareholder Gain under IRC 331, the shareholder's Amount Realized is the NET Fair Market Value received (${fmt(fmv)} Gross FMV - ${fmt(liab)} Debt Assumed = ${fmt(netFmv)}), minus ${fmt(shStockBasis)} Stock Basis = ${fmt(shCapGain)} Capital Gain.\n2. However, under IRC 334(a), the shareholder's new tax basis in the warehouse is its FULL GROSS Fair Market Value (${fmt(fmv)}), because the shareholder both paid tax on the ${fmt(netFmv)} net equity AND assumed the ${fmt(liab)} debt (Crane rule)!`,
        math: `1. Shareholder Net Amount Realized = ${fmt(fmv)} (Gross FMV) - ${fmt(liab)} (Mortgage Assumed) = ${fmt(netFmv)}\n2. Shareholder Capital Gain (IRC 331) = ${fmt(netFmv)} - ${fmt(shStockBasis)} (Stock Basis) = ${fmt(shCapGain)}\n3. Shareholder Basis in Warehouse (IRC 334(a)) = ${fmt(fmv)} (Full Gross FMV!)`,
        whyWrong: [
          `Incorrect: Assuming a ${fmt(liab)} corporate debt reduces the shareholder's net amount realized from ${fmt(fmv)} to ${fmt(netFmv)}.`,
          `Incorrect: Under IRC 334(a), the shareholder takes a basis equal to the property's full gross FMV (${fmt(fmv)}), not net equity.`,
          `Incorrect: Corporate liquidations are fully taxable exchanges to the shareholder under IRC 331.`
        ]
      };
    }
  },
  {
    id: 't8_5_current_vs_liquidating_part_dist', topic: 't8', archNum: 5, angle: 'Non-Liquidating (732a) vs. Liquidating (732b) Basis Contrast', isMath: true,
    generate() {
      const outB = randInt(14, 22) * 10000;
      const cash = randInt(2, 4) * 10000;
      const remOutB = outB - cash;
      const landInsideBasis = randInt(4, 7) * 10000; // strictly less than remOutB!
      return {
        prompt: `[Regime Contrast] Partner P has an Outside Basis of ${fmt(outB)} and receives a distribution consisting of ${fmt(cash)} in cash and a parcel of capital-asset land with a partnership Inside Basis of ${fmt(landInsideBasis)} (and FMV of ${fmt(remOutB)}).\n\nCompare Partner P's tax basis in the distributed land and ending Outside Basis if this distribution is (Case 1) a Non-Liquidating Current Distribution under IRC 732(a) vs. (Case 2) a Complete Liquidating Distribution under IRC 732(b):`,
        correct: `Case 1 (Non-Liquidating): Land takes a carryover basis of ${fmt(landInsideBasis)} and Partner P keeps ${fmt(remOutB - landInsideBasis)} of Outside Basis | Case 2 (Liquidating): Land steps up to a substituted basis of ${fmt(remOutB)} and Partner P's Outside Basis becomes $0.`,
        distractors: [
          `Case 1 (Non-Liquidating): Land basis is ${fmt(remOutB)} | Case 2 (Liquidating): Land basis is ${fmt(landInsideBasis)} with a ${fmt(remOutB - landInsideBasis)} recognized loss.`,
          `In both Case 1 and Case 2, the land takes a carryover basis of ${fmt(landInsideBasis)}.`,
          `In both Case 1 and Case 2, the land takes a Fair Market Value basis of ${fmt(remOutB)} and triggers immediate capital gain.`
        ],
        concept: `Here is the exact difference between IRC 732(a) and IRC 732(b) when Remaining Outside Basis (${fmt(remOutB)}) EXCEEDS the property's Inside Basis (${fmt(landInsideBasis)}):\n• In a Non-Liquidating Current Distribution (IRC 732(a)), the partner remains in the partnership, so the land simply takes a carryover basis of ${fmt(landInsideBasis)} and the remaining ${fmt(remOutB - landInsideBasis)} stays in the partner's Outside Basis.\n• In a Complete Liquidation (IRC 732(b)), the partner's partnership interest is extinguished, so ALL remaining outside basis (${fmt(remOutB)}) must be pushed into the land as a substituted basis!`,
        math: `Remaining Outside Basis after ${fmt(cash)} Cash = ${fmt(outB)} - ${fmt(cash)} = ${fmt(remOutB)}\n• Case 1 (Non-Liquidating under IRC 732(a)):\n  Land Basis = Carryover Inside Basis = ${fmt(landInsideBasis)} | Remaining Outside Basis = ${fmt(remOutB - landInsideBasis)}\n• Case 2 (Liquidating under IRC 732(b)):\n  Land Basis = Substituted Remaining Basis = ${fmt(remOutB)} | Ending Outside Basis = $0`,
        whyWrong: [
          `Incorrect: You reversed the non-liquidating and liquidating rules, and receiving land blocks any loss recognition under IRC 731(a)(2).`,
          `Incorrect: In a complete liquidation, outside basis cannot remain floating after the partnership interest is terminated; it attaches to the distributed land.`,
          `Incorrect: Neither distribution triggers gain because cash (${fmt(cash)}) does not exceed outside basis (${fmt(outB)}).`
        ]
      };
    }
  },
  {
    id: 't8_6_hot_asset_ceiling_liq', topic: 't8', archNum: 6, angle: 'Reverse-Engineer Liquidating Loss with Inventory Ceiling', isMath: true,
    generate() {
      const cash = randInt(3, 5) * 10000;
      const invInside = randInt(2, 4) * 10000;
      const recLoss = randInt(4, 8) * 10000;
      const begOutB = cash + invInside + recLoss;
      return {
        prompt: `[Reverse-Engineering IRC 731(a)(2)] In a complete liquidation of her partnership interest, Partner Q received SOLELY ${fmt(cash)} in cash and inventory with a partnership Inside Basis of ${fmt(invInside)} (and FMV of ${fmt(invInside + 15000)}). On her tax return, Partner Q properly recognized a ${fmt(recLoss)} capital loss on the liquidation under IRC 731(a)(2).\n\nWorking backward, what was Partner Q's Outside Basis immediately before the liquidating distribution, and what is her tax basis in the distributed inventory?`,
        correct: `Pre-Liquidation Outside Basis was ${fmt(begOutB)} (${fmt(cash)} + ${fmt(invInside)} + ${fmt(recLoss)}), and her basis in the inventory is capped at ${fmt(invInside)} under IRC 732(c).`,
        distractors: [
          `Pre-Liquidation Outside Basis was ${fmt(cash + recLoss)}, and her basis in the inventory is $0.`,
          `Pre-Liquidation Outside Basis was ${fmt(begOutB)}, and her basis in the inventory was stepped up to ${fmt(invInside + recLoss)} with $0 loss.`,
          `Pre-Liquidation Outside Basis was ${fmt(cash + invInside + 15000 + recLoss)} (using inventory FMV instead of inside basis).`
        ],
        concept: `Under IRC 732(c)(1), inventory and unrealized receivables can NEVER take a basis higher than the partnership's inside basis (${fmt(invInside)}) in a liquidation (to prevent converting capital outside basis into ordinary COGS deductions!). Therefore, when a partner receives only cash (${fmt(cash)}) and inventory (${fmt(invInside)}), the unabsorbed outside basis is recognized as a capital loss (${fmt(recLoss)}), meaning Pre-Liquidation Outside Basis = ${fmt(cash)} + ${fmt(invInside)} + ${fmt(recLoss)} = ${fmt(begOutB)}.`,
        math: `Liquidating Loss Formula (IRC 731(a)(2)):\nOutside Basis - Cash (${fmt(cash)}) - Inventory Inside Basis (${fmt(invInside)}) = Recognized Loss (${fmt(recLoss)})\n-> Pre-Liquidation Outside Basis = ${fmt(cash)} + ${fmt(invInside)} + ${fmt(recLoss)} = ${fmt(begOutB)}\n-> Inventory Basis = ${fmt(invInside)}`,
        whyWrong: [
          `Incorrect: You forgot that the distributed inventory absorbed ${fmt(invInside)} of outside basis before the loss was calculated.`,
          `Incorrect: Inventory is a hot asset whose basis can never be stepped up above inside basis (${fmt(invInside)}) in a liquidation.`,
          `Incorrect: Partnership distribution basis rules use inside adjusted basis (${fmt(invInside)}), not FMV.`
        ]
      };
    }
  },

  // ==================== MODULE 9: STATE TAX ISSUES (6 ANGLES) ====================
  {
    id: 't9_1_factory_relocation_ssf_vs_3factor', topic: 't9', archNum: 1, angle: 'Policy & Tax Impact of Moving to Single Sales Factor', isMath: true,
    generate() {
      const inc = randInt(3, 6) * 1000000;
      const p = 60, w = 60, s = 15; // In-state manufacturer exporting to other states!
      const threePct = (p + w + s) / 3; // 45%
      const ssfPct = s; // 15%
      const threeInc = Math.round(inc * (threePct / 100));
      const ssfInc = Math.round(inc * (ssfPct / 100));
      const reduction = threeInc - ssfInc;
      return {
        prompt: `[Policy & Advisory Impact] Manufacturer Co. has its headquarters and factories in State M, so its State M factors are ${p}% Property, ${w}% Payroll, and only ${s}% Sales (85% of its goods are shipped to customers in other states). Manufacturer Co. earns ${fmt(inc)} of apportionable income.\n\nIf State M transitions from a traditional equally weighted 3-Factor Apportionment Formula to a Single Sales Factor (SSF) Formula, how does Manufacturer Co.'s State M taxable income change, and why do states enact SSF?`,
        correct: `State M apportioned income DROPS by ${fmt(reduction)} (from ${fmt(threeInc)} at ${threePct}% down to ${fmt(ssfInc)} at ${ssfPct}%); states enact SSF to reward in-state manufacturers with high property/payroll and shift the tax burden onto out-of-state sellers with high in-state sales.`,
        distractors: [
          `State M apportioned income INCREASES by ${fmt(reduction)} (from ${fmt(ssfInc)} up to ${fmt(threeInc)}).`,
          `State M apportioned income remains ${fmt(threeInc)} because SSF only applies to companies without physical presence in the state.`,
          `State M apportioned income becomes ${fmt(Math.round(inc * 0.60))} because SSF uses the highest of the three factors.`
        ],
        concept: `Under the traditional 3-Factor formula, an in-state manufacturer with ${p}% Property, ${w}% Payroll, and ${s}% Sales is taxed on (${p}% + ${w}% + ${s}%)/3 = ${threePct}% of its income (${fmt(threeInc)}). Switching to Single Sales Factor (SSF) drops the Property and Payroll factors completely, taxing the company on only ${s}% (${fmt(ssfInc)})—saving ${fmt(reduction)} in State M taxable income and encouraging companies to build factories and hire workers in-state!`,
        math: `1. 3-Factor Ratio = (${p}% Prop + ${w}% Payroll + ${s}% Sales) / 3 = ${threePct}% -> ${fmt(threeInc)}\n2. Single Sales Factor (SSF) Ratio = ${s}% -> ${fmt(ssfInc)}\n3. Reduction in State M Taxable Income = ${fmt(threeInc)} - ${fmt(ssfInc)} = ${fmt(reduction)}`,
        whyWrong: [
          `Incorrect: Because Sales (${s}%) is much lower than Property (${p}%) and Payroll (${w}%), switching to SSF reduces State M apportioned income.`,
          `Incorrect: SSF applies to all apportionable multistate taxpayers in that state.`,
          `Incorrect: SSF uses 100% of the Sales factor (${s}%), not the highest factor.`
        ]
      };
    }
  },
  {
    id: 't9_2_reverse_apportionment_sales_factor', topic: 't9', archNum: 2, angle: 'Reverse-Engineer In-State Sales from 3-Factor Apportionment', isMath: true,
    generate() {
      const totInc = 4000000;
      const propPct = 20;
      const payPct = 25;
      const salesPct = pick([45, 60, 75]);
      const avgPct = (propPct + payPct + salesPct) / 3;
      const appInc = Math.round(totInc * (avgPct / 100));
      const totSales = 20000000;
      const stateSales = Math.round(totSales * (salesPct / 100));
      return {
        prompt: `[Reverse-Engineering Apportionment] A corporation has ${fmt(totInc)} of total apportionable income and ${fmt(totSales)} of total nationwide sales. In State K (which uses an equally weighted 3-Factor Formula), the corporation's Property factor is ${propPct}%, its Payroll factor is ${payPct}%, and its final State K apportioned taxable income is ${fmt(appInc)} (an overall 3-factor average of ${avgPct}%).\n\nWorking backward, what was the corporation's State K Sales Factor percentage, and how many dollars of sales did it have in State K?`,
        correct: `State K Sales Factor was ${salesPct}%, meaning ${fmt(stateSales)} of State K sales.`,
        distractors: [
          `State K Sales Factor was ${avgPct}%, meaning ${fmt(Math.round(totSales * (avgPct / 100)))} of State K sales.`,
          `State K Sales Factor was ${avgPct - propPct - payPct > 0 ? avgPct - propPct - payPct : 15}%, meaning ${fmt(Math.round(totSales * 0.15))} of State K sales (forgetting to multiply the average by 3 first).`,
          `State K Sales Factor was ${(propPct + payPct) / 2}%, meaning ${fmt(Math.round(totSales * ((propPct + payPct) / 200)))} of State K sales.`
        ],
        concept: `Since the equally weighted 3-Factor average is (${propPct}% + ${payPct}% + Sales%) / 3 = ${avgPct}%, you multiply ${avgPct}% by 3 to get the sum of the three factors (${avgPct * 3}%), and subtract Property (${propPct}%) and Payroll (${payPct}%) to find Sales% = ${salesPct}%. Multiplying ${salesPct}% by ${fmt(totSales)} total sales gives ${fmt(stateSales)}.`,
        math: `1. Overall 3-Factor Average = ${fmt(appInc)} / ${fmt(totInc)} = ${avgPct}%\n2. Sum of All 3 Factors = ${avgPct}% * 3 = ${avgPct * 3}%\n3. State K Sales Factor % = ${avgPct * 3}% - ${propPct}% (Prop) - ${payPct}% (Pay) = ${salesPct}%\n4. State K Dollar Sales = ${fmt(totSales)} * ${salesPct}% = ${fmt(stateSales)}`,
        whyWrong: [
          `Incorrect: ${avgPct}% is the average of all three factors, not the Sales factor itself.`,
          `Incorrect: You must multiply the average (${avgPct}%) by 3 before subtracting Property and Payroll.`,
          `Incorrect: That is simply the average of Property and Payroll.`
        ]
      };
    }
  },
  {
    id: 't9_3_wayfair_vs_pl86272_matrix', topic: 't9', archNum: 3, angle: 'Wayfair Economic Nexus vs. PL 86-272 Matrix', isMath: false,
    generate() {
      return {
        prompt: `[Dual-Tax Matrix] Seller Corp (headquartered in Oregon) sells $450,000 of tangible machinery across 300 orders shipped via common carrier to customers in State W (where the Wayfair economic nexus threshold is $100,000 or 200 transactions). Seller Corp has no offices or inventory in State W; its only contact with State W is sending traveling sales reps to solicit machinery orders that are emailed back to Oregon for approval and shipment.\n\nState W imposes BOTH (1) a 6% Retail Sales/Use Tax, (2) a 0.5% Commercial Gross Receipts Tax, and (3) a 7% Corporate Net Income Tax. Which of State W's three taxes apply to Seller Corp?`,
        correct: `Seller Corp is subject to State W's Sales/Use Tax AND Gross Receipts Tax (via Wayfair economic nexus), but is IMMUNE from State W's 7% Corporate Net Income Tax under Public Law 86-272!`,
        distractors: [
          `Seller Corp is immune from all three taxes because Public Law 86-272 overrides South Dakota v. Wayfair for tangible personal property.`,
          `Seller Corp is subject to all three taxes because exceeding the $100,000 / 200-transaction Wayfair threshold automaticallyrepeals Public Law 86-272 protection.`,
          `Seller Corp is subject to the Corporate Net Income Tax, but immune from the Sales/Use Tax and Gross Receipts Tax.`
        ],
        concept: `You must separate Constitutional Nexus (Wayfair) from Federal Statutory Immunity (Public Law 86-272):\n1. Under South Dakota v. Wayfair, exceeding $100,000 sales or 200 transactions creates substantial economic nexus for ALL state taxes.\n2. However, Public Law 86-272 is a federal statute that blocks states from imposing a NET INCOME TAX on out-of-state sellers whose sole in-state activity is soliciting orders for tangible personal property approved and shipped from out-of-state. Because Public Law 86-272 applies ONLY to Net Income Taxes, Seller Corp must still collect Sales Tax and pay Gross Receipts Tax!`,
        math: `Tax-by-Tax Breakdown:\n• Sales/Use Tax -> Wayfair Nexus Met + PL 86-272 Inapplicable = TAXABLE!\n• Gross Receipts Tax -> Wayfair Nexus Met + PL 86-272 Inapplicable = TAXABLE!\n• Corporate Net Income Tax -> Protected by Public Law 86-272 = IMMUNE!`,
        whyWrong: [
          `Incorrect: Public Law 86-272 applies strictly to net income taxes; it provides zero immunity from sales/use taxes or gross receipts taxes.`,
          `Incorrect: Wayfair did not repeal Public Law 86-272; Congress's statutory immunity for net income taxes remains in full force when activities are limited to soliciting tangible goods.`,
          `Incorrect: You reversed the scope of Public Law 86-272.`
        ]
      };
    }
  },
  {
    id: 't9_4_pl86272_activity_audit', topic: 't9', archNum: 4, angle: 'Spot the Activity That Destroys PL 86-272 Immunity', isMath: false,
    generate() {
      return {
        prompt: `[Operational Audit] Out-of-state WidgetCorp relies on Public Law 86-272 to avoid paying Corporate Net Income Tax in State T. WidgetCorp's VP of Sales proposes four operational changes in State T for next year:\n• Proposal 1: Provide traveling sales reps in State T with company-owned cars and free product samples to hand out during sales calls.\n• Proposal 2: Run television and internet advertising campaigns targeted at State T buyers.\n• Proposal 3: Authorize sales reps in State T to perform on-site warranty repairs and technical calibration on customers' widgets once a quarter.\n• Proposal 4: Ship all approved widget orders from the out-of-state factory into State T via FedEx common carrier.\n\nWhich single proposal will DESTROY WidgetCorp's Public Law 86-272 net income tax immunity in State T?`,
        correct: `Proposal 3 (performing on-site warranty repairs and technical calibration in State T), because post-sale servicing/repair is not ancillary to the solicitation of orders and destroys Public Law 86-272 protection for the entire tax year.`,
        distractors: [
          `Proposal 1 (providing company cars and free samples to in-state sales reps).`,
          `Proposal 2 (running targeted advertising in State T).`,
          `Proposal 4 (shipping goods into State T via third-party common carrier).`
        ],
        concept: `Under the Supreme Court's decision in Wisconsin Dept. of Revenue v. William Wrigley, Jr., Co., Public Law 86-272 protects only solicitation of orders for tangible personal property and activities that serve no independent business function apart from solicitation (such as driving a company car, handing out free samples, or advertising). Performing repairs, installation, maintenance, or keeping inventory in the state serves an independent post-sale business function and destroys immunity!`,
        math: `Protected (Ancillary to Solicitation): Company cars, free samples, brochures, advertising, common carrier delivery.\nUnprotected (Destroys Immunity): Repairs, installation, warranty servicing, in-state inventory, approving orders in-state.`,
        whyWrong: [
          `Incorrect: Providing company cars and free promotional samples to sales reps is explicitly protected as ancillary to solicitation under Wrigley.`,
          `Incorrect: Advertising is part of soliciting orders and is protected under Public Law 86-272.`,
          `Incorrect: Delivery from outside the state via common carrier is a core requirement of Public Law 86-272.`
        ]
      };
    }
  },
  {
    id: 't9_5_tangible_vs_service_pl86272', topic: 't9', archNum: 5, angle: 'Product Transformation Trap (Hardware vs. SaaS)', isMath: true,
    generate() {
      const appInc = randInt(2, 5) * 1000000;
      const sPct = pick([20, 30, 40]);
      const stateRate = 8;
      const newStateTax = Math.round(appInc * (sPct / 100) * (stateRate / 100));
      return {
        prompt: `[Business Model Shift] For 10 years, TechCo sold boxed software on physical USB drives (tangible personal property) to customers in State V (which uses a Single Sales Factor formula and an ${stateRate}% corporate net income tax). TechCo has ${sPct}% of its nationwide sales in State V, earns ${fmt(appInc)} of apportionable net income, and sends sales reps into State V solely to solicit orders approved outside the state—paying $0 State V income tax under Public Law 86-272.\n\nThis year, TechCo stops shipping physical USB drives and switches 100% of its product to cloud-based SaaS subscriptions and remote IT consulting services while keeping the exact same in-state sales reps. What happens to TechCo's State V corporate income tax bill?`,
        correct: `TechCo loses Public Law 86-272 immunity immediately because the statute only covers tangible personal property (never services or SaaS/intangibles), triggering ${fmt(newStateTax)} of State V corporate income tax (${fmt(appInc)} * ${sPct}% * ${stateRate}%).`,
        distractors: [
          `TechCo still pays $0 State V income tax because its employees in State V only solicit orders and do not perform installation.`,
          `TechCo owes ${fmt(Math.round(appInc * (stateRate / 100)))} of State V income tax on 100% of its nationwide income.`,
          `Public Law 86-272 still protects 50% of the SaaS revenue as a digital good.`
        ],
        concept: `Public Law 86-272's statutory text (15 U.S.C. 381) applies EXCLUSIVELY to the solicitation of orders for "tangible personal property." As soon as a business shifts from selling physical goods to selling services, SaaS, cloud computing, or licensing intangibles, Public Law 86-272 offers ZERO protection—exposing ${sPct}% of TechCo's ${fmt(appInc)} net income to State V's ${stateRate}% income tax (${fmt(newStateTax)})!`,
        math: `1. Does PL 86-272 cover SaaS / Services? NO (Tangible Personal Property ONLY!)\n2. State V Apportioned Income (SSF = ${sPct}%) = ${fmt(appInc)} * ${sPct}% = ${fmt(Math.round(appInc * (sPct / 100)))}\n3. State V Corporate Income Tax (${stateRate}%) = ${fmt(Math.round(appInc * (sPct / 100)))} * ${stateRate}% = ${fmt(newStateTax)}`,
        whyWrong: [
          `Incorrect: Even if in-state reps limit their activity strictly to solicitation, Public Law 86-272 never protects solicitation of services or intangibles.`,
          `Incorrect: State V can only tax its apportioned share (${sPct}%) of TechCo's income, not 100%.`,
          `Incorrect: There is no 50% partial safe harbor for digital/SaaS services under Public Law 86-272.`
        ]
      };
    }
  },
  {
    id: 't9_6_throwback_nowhere_income', topic: 't9', archNum: 6, angle: 'Throwback Rule & "Nowhere Income" Math', isMath: true,
    generate() {
      const totSales = 10000000;
      const homeSales = randInt(3, 5) * 1000000;
      const pl86272Sales = randInt(2, 3) * 1000000;
      const taxableOtherSales = totSales - homeSales - pl86272Sales;
      const totInc = 2000000;
      const noThrowInc = Math.round(totInc * (homeSales / totSales));
      const withThrowInc = Math.round(totInc * ((homeSales + pl86272Sales) / totSales));
      const extraTaxableInc = withThrowInc - noThrowInc;
      return {
        prompt: `[Throwback Rule Mechanics] Apex Corp manufactures all of its tangible products in State H (which uses a Single Sales Factor formula) and earns ${fmt(totInc)} of apportionable income on ${fmt(totSales)} of total sales:\n• ${fmt(homeSales)} shipped to customers in State H\n• ${fmt(taxableOtherSales)} shipped to customers in State J (where Apex has a warehouse and pays income tax)\n• ${fmt(pl86272Sales)} shipped from State H to customers in State Z (where Apex is immune from income tax under Public Law 86-272)\n\nIf State H enacts a "Throwback Rule" to recapture untaxed "nowhere income," by how much does Apex Corp's State H taxable income increase?`,
        correct: `Increases by ${fmt(extraTaxableInc)} (from ${fmt(noThrowInc)} at ${(homeSales / totSales) * 100}% up to ${fmt(withThrowInc)} at ${((homeSales + pl86272Sales) / totSales) * 100}%, because the ${fmt(pl86272Sales)} of untaxed State Z sales are thrown back into State H's sales numerator).`,
        distractors: [
          `Increases by ${fmt(Math.round(totInc * ((pl86272Sales + taxableOtherSales) / totSales)))} (throwing back both State J and State Z sales into State H).`,
          `$0 increase, because destination sourcing prohibits origin states from ever taxing goods shipped out of state.`,
          `Decreases by ${fmt(extraTaxableInc)}, because the Throwback Rule removes in-state sales from the numerator.`
        ],
        concept: `When a manufacturer ships goods from an origin state (State H) into a destination state where the seller is immune from income tax under Public Law 86-272 (State Z), those ${fmt(pl86272Sales)} of sales escape taxation in the destination state ("nowhere income"). Under a state Throwback Rule, sales shipped from State H into a state where the taxpayer is not taxable are "thrown back" into State H's sales factor numerator!`,
        math: `1. Without Throwback: State H Sales % = ${fmt(homeSales)} / ${fmt(totSales)} = ${(homeSales / totSales) * 100}% -> ${fmt(noThrowInc)} Taxable Income\n2. With Throwback: State H Sales % = (${fmt(homeSales)} + ${fmt(pl86272Sales)} State Z Nowhere Sales) / ${fmt(totSales)} = ${((homeSales + pl86272Sales) / totSales) * 100}% -> ${fmt(withThrowInc)} Taxable Income\n3. Increase in State H Taxable Income = ${fmt(withThrowInc)} - ${fmt(noThrowInc)} = ${fmt(extraTaxableInc)}`,
        whyWrong: [
          `Incorrect: Sales to State J (${fmt(taxableOtherSales)}) are NOT thrown back because Apex Corp is subject to income tax in State J.`,
          `Incorrect: Many states enforce a statutory Throwback Rule specifically to recapture untaxed destination sales shipped from a factory in the origin state.`,
          `Incorrect: The Throwback Rule adds untaxed out-of-state sales to the origin state's numerator, increasing apportioned income.`
        ]
      };
    }
  }
];


globalThis.STUDY_BANK = { id: 'tax-midterm-v1', title: 'Tax midterm', description: 'Nine modules. Multiple ways to think.', reviewStatus: 'Example content · not independently reviewed', topics: TOPICS.map(t => ({ ...t, name: t.name.replace(/^\d+\. /, '') })), glossary: GLOSSARY, questions: GENERATORS };
})();
