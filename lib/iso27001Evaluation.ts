export type EvaluationAnswer =
    | "YES"
    | "PARTIAL"
    | "NO"
    | "DONT_KNOW"
    | "NOT_APPLICABLE";

export type ProfileFieldType =
    | "text"
    | "email"
    | "date"
    | "textarea"
    | "select"
    | "multiselect"
    | "yes-no"
    | "yes-no-partial"
    | "yes-no-dont-know"
    | "file";

export type ProfileField = {
    id: string;
    label: string;
    type: ProfileFieldType;
    options?: string[];
};

export type EvaluationQuestion = {
    id: string;
    section: string;
    question: string;
    mapping: string;
    weight: 1 | 2 | 3;
    evidence: string;
};

export type EvaluationSection = {
    id: string;
    title: string;
    group: "ISO 27001 readiness" | "Annex A controls";
    questions: EvaluationQuestion[];
};

export type ReportQuestion = {
    id: string;
    question: string;
    purpose: string;
    type: "textarea" | "select" | "yes-no";
    options?: string[];
};

export type EvaluationScore = {
    percentage: number;
    applicableWeight: number;
    earnedWeight: number;
    answeredCount: number;
    applicableAnsweredCount: number;
    totalQuestions: number;
    readinessLevel: string;
    interpretation: string;
};

export type StoredEvaluation = {
    profile: Record<string, string | string[]>;
    answers: Record<string, EvaluationAnswer | "">;
    comments: Record<string, string>;
    report: Record<string, string>;
};

export const answerLabels: Record<EvaluationAnswer, string> = {
    YES: "Yes",
    PARTIAL: "Partially",
    NO: "No",
    DONT_KNOW: "Don't know",
    NOT_APPLICABLE: "Not applicable",
};

export const answerScores: Record<EvaluationAnswer, number | null> = {
    YES: 2,
    PARTIAL: 1,
    NO: 0,
    DONT_KNOW: 0,
    NOT_APPLICABLE: null,
};

export const companyProfileFields: ProfileField[] = [
    { id: "A1", label: "Company name", type: "text" },
    { id: "A2", label: "Contact person", type: "text" },
    { id: "A3", label: "Email", type: "email" },
    { id: "A4", label: "Phone number", type: "text" },
    {
        id: "A5",
        label: "Industry",
        type: "select",
        options: [
            "Technology",
            "Finance",
            "Healthcare",
            "Legal",
            "Manufacturing",
            "Retail",
            "Public sector",
            "Other",
        ],
    },
    {
        id: "A6",
        label: "Number of employees",
        type: "select",
        options: ["1-10", "11-50", "51-200", "201-500", "500+"],
    },
    {
        id: "A7",
        label: "Countries where the company operates",
        type: "text",
    },
    { id: "A8", label: "Do you handle customer data?", type: "yes-no" },
    { id: "A9", label: "Do you handle personal data?", type: "yes-no" },
    {
        id: "A10",
        label: "Do you handle sensitive personal data?",
        type: "yes-no-dont-know",
    },
    {
        id: "A11",
        label:
            "Do you process financial, legal, healthcare, security, or confidential business information?",
        type: "multiselect",
        options: [
            "Financial information",
            "Legal information",
            "Healthcare information",
            "Security information",
            "Confidential business information",
        ],
    },
    {
        id: "A12",
        label:
            "Main systems used, for example Microsoft 365, Google Workspace, AWS, Azure, CRM, ERP",
        type: "textarea",
    },
    { id: "A13", label: "Do employees work remotely?", type: "yes-no-partial" },
    { id: "A14", label: "Do you use cloud services?", type: "yes-no" },
    {
        id: "A15",
        label: "Do you outsource IT, payroll, development, hosting, or support?",
        type: "yes-no",
    },
    {
        id: "A16",
        label:
            "Do customers ask for ISO 27001, security questionnaires, or vendor due diligence?",
        type: "yes-no-partial",
    },
    {
        id: "A17",
        label: "Desired scope of ISO 27001 assessment",
        type: "textarea",
    },
    { id: "A18", label: "Target date for being audit-ready", type: "date" },
    {
        id: "A19",
        label: "Main reason for assessment",
        type: "select",
        options: [
            "Customer requirement",
            "Internal risk",
            "Certification",
            "Procurement",
            "Other",
        ],
    },
    {
        id: "A20",
        label: "Upload existing policies, risk register, asset list, or security documentation",
        type: "file",
    },
];

function q(
    id: string,
    section: string,
    question: string,
    mapping: string,
    weight: 1 | 2 | 3,
    evidence: string
): EvaluationQuestion {
    return { id, section, question, mapping, weight, evidence };
}

export const evaluationSections: EvaluationSection[] = [
    {
        id: "context-scope",
        title: "Context and scope",
        group: "ISO 27001 readiness",
        questions: [
            q("B1", "Context and scope", "Have you defined the scope of your information security management system?", "Context/scope", 3, "ISMS scope document"),
            q("B2", "Context and scope", "Does the scope clearly state which teams, systems, offices, products, and services are included?", "Scope", 3, "Scope statement"),
            q("B3", "Context and scope", "Have you identified internal and external factors that affect information security?", "Organizational context", 2, "Context analysis, SWOT, risk notes"),
            q("B4", "Context and scope", "Have you identified interested parties, such as customers, regulators, suppliers, employees and owners?", "Interested parties", 2, "Stakeholder register"),
            q("B5", "Context and scope", "Have you identified information security requirements from customers, contracts, laws or regulations?", "Requirements", 3, "Contract review, legal register"),
            q("B6", "Context and scope", "Have you considered whether climate-related issues could affect your ISMS, operations, suppliers or continuity?", "Context / 2024 amendment", 1, "Business continuity/risk notes"),
            q("B7", "Context and scope", "Is there a documented overview of critical business processes?", "Business context", 2, "Process map"),
            q("B8", "Context and scope", "Is there a documented overview of critical information assets?", "Asset context", 3, "Asset inventory"),
            q("B9", "Context and scope", "Has management approved the scope and purpose of the ISMS?", "Governance", 3, "Approval record"),
            q("B10", "Context and scope", "Is the scope reviewed when the business changes?", "Continual relevance", 2, "Review log"),
        ],
    },
    {
        id: "leadership-governance",
        title: "Leadership and governance",
        group: "ISO 27001 readiness",
        questions: [
            q("C1", "Leadership and governance", "Has top management formally committed to information security?", "Leadership", 3, "Management statement"),
            q("C2", "Leadership and governance", "Is there an approved information security policy?", "Policy", 3, "Security policy"),
            q("C3", "Leadership and governance", "Is the policy communicated to employees and relevant suppliers?", "Communication", 2, "Intranet, onboarding material"),
            q("C4", "Leadership and governance", "Are information security roles and responsibilities clearly assigned?", "Roles/responsibility", 3, "RACI, role descriptions"),
            q("C5", "Leadership and governance", "Is there a named person responsible for the ISMS?", "ISMS ownership", 3, "Appointment record"),
            q("C6", "Leadership and governance", "Does management regularly review information security performance?", "Management review", 3, "Meeting minutes"),
            q("C7", "Leadership and governance", "Are security objectives aligned with business objectives?", "Security objectives", 2, "Objectives/KPIs"),
            q("C8", "Leadership and governance", "Is there a budget or resource allocation for information security?", "Resources", 2, "Budget, roadmap"),
            q("C9", "Leadership and governance", "Are managers responsible for enforcing security requirements in their teams?", "Accountability", 2, "Role descriptions"),
            q("C10", "Leadership and governance", "Are information security risks reported to management?", "Governance reporting", 3, "Risk reports"),
        ],
    },
    {
        id: "risk-planning",
        title: "Risk management and planning",
        group: "ISO 27001 readiness",
        questions: [
            q("D1", "Risk management and planning", "Do you have a documented information security risk assessment method?", "Risk assessment", 3, "Risk methodology"),
            q("D2", "Risk management and planning", "Do you maintain an information security risk register?", "Risk management", 3, "Risk register"),
            q("D3", "Risk management and planning", "Are risks assessed using likelihood and impact?", "Risk scoring", 3, "Risk matrix"),
            q("D4", "Risk management and planning", "Are risks linked to information assets, systems, suppliers or business processes?", "Risk linkage", 2, "Risk register"),
            q("D5", "Risk management and planning", "Are risk owners assigned?", "Risk ownership", 3, "Risk register"),
            q("D6", "Risk management and planning", "Are risk treatment decisions documented?", "Risk treatment", 3, "Treatment plan"),
            q("D7", "Risk management and planning", "Are controls selected based on identified risks?", "Control selection", 3, "Risk treatment plan"),
            q("D8", "Risk management and planning", "Do you maintain a Statement of Applicability, also called SoA?", "SoA", 3, "Statement of Applicability"),
            q("D9", "Risk management and planning", "Does the SoA explain which controls are applicable or not applicable?", "SoA completeness", 3, "SoA"),
            q("D10", "Risk management and planning", "Are information security objectives measurable?", "Objectives", 2, "KPI list"),
            q("D11", "Risk management and planning", "Are objectives reviewed regularly?", "Planning/review", 2, "Review notes"),
            q("D12", "Risk management and planning", "Are major changes assessed for information security risk before implementation?", "Change risk", 3, "Change records"),
        ],
    },
    {
        id: "support-documentation",
        title: "Support, competence and documentation",
        group: "ISO 27001 readiness",
        questions: [
            q("E1", "Support, competence and documentation", "Are employees trained in information security?", "Awareness", 3, "Training records"),
            q("E2", "Support, competence and documentation", "Is information security included in onboarding?", "Onboarding", 3, "Onboarding checklist"),
            q("E3", "Support, competence and documentation", "Do employees acknowledge security policies?", "Policy acceptance", 2, "Signed acknowledgement"),
            q("E4", "Support, competence and documentation", "Are role-specific security skills defined for IT, HR, finance, support or developers?", "Competence", 2, "Competence matrix"),
            q("E5", "Support, competence and documentation", "Is ISMS documentation controlled with owner, version and review date?", "Document control", 3, "Document register"),
            q("E6", "Support, competence and documentation", "Are obsolete policies removed or clearly marked as outdated?", "Document control", 1, "Version history"),
            q("E7", "Support, competence and documentation", "Is there a central place for policies, procedures and security documentation?", "Accessibility", 2, "Intranet/folder"),
            q("E8", "Support, competence and documentation", "Are employees told how to report incidents, phishing or security weaknesses?", "Awareness/reporting", 3, "Awareness material"),
            q("E9", "Support, competence and documentation", "Are security responsibilities included in employment contracts or handbooks?", "HR/security", 2, "Contract template"),
            q("E10", "Support, competence and documentation", "Are external consultants or contractors required to follow security rules?", "External workers", 2, "Contractor agreement"),
        ],
    },
    {
        id: "operation",
        title: "Operation of the ISMS",
        group: "ISO 27001 readiness",
        questions: [
            q("F1", "Operation of the ISMS", "Are risk assessments performed at planned intervals?", "Operational planning", 3, "Risk review schedule"),
            q("F2", "Operation of the ISMS", "Are risk assessments performed when major changes occur?", "Change management", 3, "Change risk records"),
            q("F3", "Operation of the ISMS", "Are risk treatment actions tracked to completion?", "Risk treatment", 3, "Action tracker"),
            q("F4", "Operation of the ISMS", "Are security controls monitored to confirm they work as intended?", "Control monitoring", 3, "Control tests"),
            q("F5", "Operation of the ISMS", "Are outsourced processes controlled from an information security perspective?", "Supplier/outsourcing", 3, "Supplier reviews"),
            q("F6", "Operation of the ISMS", "Are exceptions to policies documented and approved?", "Exception management", 2, "Exception register"),
            q("F7", "Operation of the ISMS", "Are recurring operational security tasks assigned to owners?", "Operations", 2, "Task list"),
            q("F8", "Operation of the ISMS", "Are security incidents handled according to a documented process?", "Incident management", 3, "Incident procedure"),
            q("F9", "Operation of the ISMS", "Are lessons learned from incidents used to improve controls?", "Improvement", 2, "Post-incident review"),
        ],
    },
    {
        id: "performance-evaluation",
        title: "Performance evaluation",
        group: "ISO 27001 readiness",
        questions: [
            q("G1", "Performance evaluation", "Do you measure information security performance with KPIs or metrics?", "Monitoring", 2, "KPI dashboard"),
            q("G2", "Performance evaluation", "Are access reviews, incident trends, training completion or vulnerability status tracked?", "Monitoring", 2, "Reports"),
            q("G3", "Performance evaluation", "Are internal audits of the ISMS performed?", "Internal audit", 3, "Audit plan/report"),
            q("G4", "Performance evaluation", "Are internal audit findings documented and assigned to owners?", "Audit findings", 3, "Audit log"),
            q("G5", "Performance evaluation", "Does management conduct formal ISMS management reviews?", "Management review", 3, "Review minutes"),
            q("G6", "Performance evaluation", "Are management review decisions documented?", "Management review", 2, "Action log"),
            q("G7", "Performance evaluation", "Are customer, supplier or regulatory security requirements reviewed periodically?", "Compliance monitoring", 2, "Requirement register"),
        ],
    },
    {
        id: "improvement",
        title: "Improvement",
        group: "ISO 27001 readiness",
        questions: [
            q("H1", "Improvement", "Are nonconformities documented?", "Nonconformity", 3, "Nonconformity log"),
            q("H2", "Improvement", "Are root causes analyzed for serious issues?", "Corrective action", 3, "RCA document"),
            q("H3", "Improvement", "Are corrective actions assigned, tracked and verified?", "Corrective action", 3, "Action tracker"),
            q("H4", "Improvement", "Are recurring security issues analyzed for patterns?", "Continual improvement", 2, "Trend analysis"),
            q("H5", "Improvement", "Is the ISMS improved based on audits, incidents, risk reviews and management reviews?", "Improvement", 3, "Improvement roadmap"),
        ],
    },
    {
        id: "organizational-controls",
        title: "Organizational controls",
        group: "Annex A controls",
        questions: [
            q("I1", "Organizational controls", "Do you have a formal information security policy approved by management?", "Organizational controls", 3, "Policy"),
            q("I2", "Organizational controls", "Are security roles and responsibilities documented?", "Organizational controls", 3, "RACI"),
            q("I3", "Organizational controls", "Are duties separated to reduce fraud, error or misuse?", "Segregation of duties", 2, "Access model"),
            q("I4", "Organizational controls", "Do you maintain an inventory of information assets?", "Asset management", 3, "Asset register"),
            q("I5", "Organizational controls", "Are owners assigned to important information assets?", "Asset ownership", 3, "Asset register"),
            q("I6", "Organizational controls", "Is acceptable use of information and systems defined?", "Acceptable use", 2, "Acceptable use policy"),
            q("I7", "Organizational controls", "Is information classified based on sensitivity or business value?", "Classification", 3, "Classification policy"),
            q("I8", "Organizational controls", "Are rules defined for handling, storing and sharing classified information?", "Information handling", 3, "Handling procedure"),
            q("I9", "Organizational controls", "Is threat intelligence collected or reviewed in a structured way?", "Threat intelligence", 2, "Threat reports"),
            q("I10", "Organizational controls", "Are security requirements included in project management?", "Project security", 2, "Project checklist"),
            q("I11", "Organizational controls", "Are supplier security requirements defined before onboarding suppliers?", "Supplier security", 3, "Supplier checklist"),
            q("I12", "Organizational controls", "Are supplier agreements required to include confidentiality and security obligations?", "Supplier agreements", 3, "Contract clauses"),
            q("I13", "Organizational controls", "Are critical suppliers reviewed periodically?", "Supplier monitoring", 3, "Supplier review"),
            q("I14", "Organizational controls", "Are cloud services assessed for security before use?", "Cloud security", 3, "Cloud risk assessment"),
            q("I15", "Organizational controls", "Are responsibilities between your company and cloud providers documented?", "Cloud shared responsibility", 3, "Cloud responsibility matrix"),
            q("I16", "Organizational controls", "Is there a documented incident management process?", "Incident management", 3, "Incident procedure"),
            q("I17", "Organizational controls", "Are incidents logged and categorized?", "Incident records", 3, "Incident register"),
            q("I18", "Organizational controls", "Are legal, regulatory and contractual security requirements identified?", "Compliance", 3, "Legal register"),
            q("I19", "Organizational controls", "Are intellectual property, confidentiality and data protection requirements considered?", "Compliance", 2, "Legal/compliance review"),
            q("I20", "Organizational controls", "Is information security considered in business continuity planning?", "Business continuity", 3, "BCP"),
            q("I21", "Organizational controls", "Are backup, recovery and continuity requirements defined for critical systems?", "ICT readiness", 3, "Recovery plan"),
            q("I22", "Organizational controls", "Is there a documented process for privacy and personal data protection?", "Privacy", 3, "GDPR/privacy policy"),
            q("I23", "Organizational controls", "Are security responsibilities defined for remote work?", "Remote work", 2, "Remote work policy"),
            q("I24", "Organizational controls", "Are security requirements defined for mobile devices?", "Mobile devices", 2, "MDM/BYOD policy"),
            q("I25", "Organizational controls", "Are records retained and deleted according to defined rules?", "Retention/deletion", 2, "Retention policy"),
        ],
    },
    {
        id: "people-controls",
        title: "People controls",
        group: "Annex A controls",
        questions: [
            q("J1", "People controls", "Are background checks performed where appropriate and legally allowed?", "Screening", 2, "Screening policy"),
            q("J2", "People controls", "Are information security responsibilities included in employment terms?", "Employment terms", 3, "Contract template"),
            q("J3", "People controls", "Do employees receive regular security awareness training?", "Awareness", 3, "Training records"),
            q("J4", "People controls", "Is phishing, password security, data handling and incident reporting covered in training?", "Awareness content", 3, "Training material"),
            q("J5", "People controls", "Are disciplinary consequences defined for serious policy violations?", "Disciplinary process", 2, "HR policy"),
            q("J6", "People controls", "Is there a formal offboarding process?", "Offboarding", 3, "Offboarding checklist"),
            q("J7", "People controls", "Are access rights removed promptly when employees leave or change role?", "Access removal", 3, "Access logs"),
            q("J8", "People controls", "Are confidentiality obligations maintained after employment ends?", "Confidentiality", 2, "NDA/contract clause"),
        ],
    },
    {
        id: "physical-controls",
        title: "Physical controls",
        group: "Annex A controls",
        questions: [
            q("K1", "Physical controls", "Are offices, server rooms or restricted areas protected against unauthorized access?", "Physical access", 3, "Access control records"),
            q("K2", "Physical controls", "Are visitors registered or supervised?", "Visitor management", 2, "Visitor log"),
            q("K3", "Physical controls", "Are access cards, keys or codes managed and reviewed?", "Physical access management", 2, "Key/card register"),
            q("K4", "Physical controls", "Is equipment protected from theft, damage or unauthorized use?", "Equipment security", 2, "Asset controls"),
            q("K5", "Physical controls", "Are screens, papers and devices protected in public or shared areas?", "Clear desk/screen", 2, "Clear desk policy"),
            q("K6", "Physical controls", "Are laptops and mobile devices protected when outside the office?", "Off-site equipment", 3, "Device policy"),
            q("K7", "Physical controls", "Are storage media protected, reused or disposed of securely?", "Media handling", 3, "Disposal records"),
            q("K8", "Physical controls", "Are environmental risks such as fire, water, power outage or overheating considered?", "Environmental security", 2, "Office/server risk assessment"),
            q("K9", "Physical controls", "Are backups or critical equipment stored securely?", "Backup/media security", 3, "Backup storage evidence"),
            q("K10", "Physical controls", "Are physical security incidents reported and investigated?", "Physical incident management", 2, "Incident log"),
        ],
    },
    {
        id: "technological-controls",
        title: "Technological controls",
        group: "Annex A controls",
        questions: [
            q("L1", "Technological controls", "Are user accounts unique and assigned to named individuals?", "Identity management", 3, "User list"),
            q("L2", "Technological controls", "Is multi-factor authentication used for important systems?", "Authentication", 3, "MFA settings"),
            q("L3", "Technological controls", "Are privileged/admin accounts restricted?", "Privileged access", 3, "Admin role list"),
            q("L4", "Technological controls", "Are access rights approved before being granted?", "Access control", 3, "Access request records"),
            q("L5", "Technological controls", "Are access rights reviewed regularly?", "Access review", 3, "Access review report"),
            q("L6", "Technological controls", "Are passwords or passphrases managed according to a defined policy?", "Authentication", 2, "Password policy"),
            q("L7", "Technological controls", "Are shared accounts avoided or controlled?", "Accountability", 3, "Account inventory"),
            q("L8", "Technological controls", "Are systems locked automatically after inactivity?", "Endpoint security", 1, "Device configuration"),
            q("L9", "Technological controls", "Is endpoint protection used on laptops and workstations?", "Malware protection", 3, "EDR/AV dashboard"),
            q("L10", "Technological controls", "Are operating systems and applications patched regularly?", "Vulnerability management", 3, "Patch reports"),
            q("L11", "Technological controls", "Are vulnerabilities identified through scans, vendor alerts or other methods?", "Vulnerability management", 3, "Scan reports"),
            q("L12", "Technological controls", "Are critical vulnerabilities prioritized and remediated within defined timelines?", "Vulnerability treatment", 3, "Remediation SLA"),
            q("L13", "Technological controls", "Are secure configuration baselines used for devices, servers or cloud services?", "Secure configuration", 3, "Baseline/config records"),
            q("L14", "Technological controls", "Is logging enabled for important systems?", "Logging", 3, "Log settings"),
            q("L15", "Technological controls", "Are logs reviewed or monitored for suspicious activity?", "Monitoring", 3, "SIEM/log review"),
            q("L16", "Technological controls", "Are backups performed for critical systems and data?", "Backup", 3, "Backup logs"),
            q("L17", "Technological controls", "Are backups tested through restore exercises?", "Restore testing", 3, "Restore test records"),
            q("L18", "Technological controls", "Is encryption used for laptops, mobile devices or sensitive storage?", "Encryption", 3, "Encryption settings"),
            q("L19", "Technological controls", "Is encryption used for data transmitted over networks or the internet?", "Transmission security", 3, "TLS/VPN settings"),
            q("L20", "Technological controls", "Are networks segmented or protected to reduce unauthorized access?", "Network security", 2, "Network diagram"),
            q("L21", "Technological controls", "Are firewalls or equivalent network controls used?", "Network protection", 3, "Firewall rules"),
            q("L22", "Technological controls", "Is remote access protected with MFA and secure protocols?", "Remote access", 3, "VPN/ZTNA settings"),
            q("L23", "Technological controls", "Are cloud environments configured according to security best practices?", "Cloud configuration", 3, "Cloud security review"),
            q("L24", "Technological controls", "Is sensitive test data anonymized, masked or otherwise protected?", "Data masking/test data", 2, "Test data procedure"),
            q("L25", "Technological controls", "Are production and development environments separated?", "Environment separation", 3, "Architecture diagram"),
            q("L26", "Technological controls", "Are changes to systems reviewed, approved and tested before release?", "Change management", 3, "Change tickets"),
            q("L27", "Technological controls", "Is secure development guidance used for software development?", "Secure development", 3, "SDLC policy"),
            q("L28", "Technological controls", "Are code reviews, dependency checks or security testing performed?", "Application security", 3, "Pull request/security scan"),
            q("L29", "Technological controls", "Are secrets, API keys and credentials stored securely?", "Secrets management", 3, "Vault/secrets process"),
            q("L30", "Technological controls", "Are data loss prevention or sharing restrictions used for sensitive information?", "Data leakage prevention", 2, "DLP/settings"),
            q("L31", "Technological controls", "Are email security controls used, such as spam filtering, phishing protection or domain authentication?", "Email security", 2, "Email security settings"),
            q("L32", "Technological controls", "Are clocks synchronized across systems to support logging and investigations?", "Time synchronization", 1, "NTP settings"),
            q("L33", "Technological controls", "Are obsolete systems, accounts and software removed or isolated?", "Lifecycle/security hygiene", 3, "Decommission records"),
            q("L34", "Technological controls", "Are technical security incidents investigated using logs and evidence?", "Incident investigation", 3, "Incident report"),
        ],
    },
];

export const reportQuestions: ReportQuestion[] = [
    { id: "R1", question: "What are your top three information security concerns today?", purpose: "Prioritize recommendations", type: "textarea" },
    { id: "R2", question: "Which customer or partner security requirements are most urgent?", purpose: "Connect to business value", type: "textarea" },
    { id: "R3", question: "Which systems would cause the biggest damage if unavailable?", purpose: "Identify critical systems", type: "textarea" },
    { id: "R4", question: "Which data would cause the biggest damage if leaked?", purpose: "Identify sensitive information", type: "textarea" },
    { id: "R5", question: "Have you had any security incidents in the last 12 months?", purpose: "Risk indicator", type: "yes-no" },
    { id: "R6", question: "Are you planning to pursue formal ISO 27001 certification?", purpose: "Adapt roadmap", type: "yes-no" },
    { id: "R7", question: "What is your preferred timeline?", purpose: "Roadmap", type: "select", options: ["1-3 months", "3-6 months", "6-12 months"] },
    { id: "R8", question: "Do you want a downloadable gap report?", purpose: "Product flow", type: "yes-no" },
    { id: "R9", question: "Do you want a task list based on missing controls?", purpose: "Product flow", type: "yes-no" },
    { id: "R10", question: "Do you want policy templates based on your answers?", purpose: "Product flow", type: "yes-no" },
];

export const allEvaluationQuestions = evaluationSections.flatMap(
    (section) => section.questions
);

export function calculateEvaluationScore(
    answers: Record<string, EvaluationAnswer | "">
): EvaluationScore {
    let applicableWeight = 0;
    let earnedWeight = 0;
    let answeredCount = 0;
    let applicableAnsweredCount = 0;

    allEvaluationQuestions.forEach((question) => {
        const answer = answers[question.id];

        if (!answer) {
            return;
        }

        answeredCount += 1;

        const answerScore = answerScores[answer];

        if (answerScore === null) {
            return;
        }

        applicableAnsweredCount += 1;
        applicableWeight += question.weight;
        earnedWeight += (answerScore / 2) * question.weight;
    });

    const percentage = applicableWeight
        ? Math.round((earnedWeight / applicableWeight) * 100)
        : 0;

    return {
        percentage,
        applicableWeight,
        earnedWeight,
        answeredCount,
        applicableAnsweredCount,
        totalQuestions: allEvaluationQuestions.length,
        ...getReadinessLevel(percentage),
    };
}

function getReadinessLevel(percentage: number) {
    if (percentage >= 80) {
        return {
            readinessLevel: "High readiness",
            interpretation: "Close to audit-ready, but evidence should be verified.",
        };
    }

    if (percentage >= 60) {
        return {
            readinessLevel: "Medium readiness",
            interpretation: "Many parts exist, but gaps need to be closed.",
        };
    }

    if (percentage >= 40) {
        return {
            readinessLevel: "Low readiness",
            interpretation: "The basic structure is missing or incomplete.",
        };
    }

    return {
        readinessLevel: "Not ready",
        interpretation: "The ISMS is missing or very immature.",
    };
}
