// Standard RMIT undergraduate structure shared by all three degrees in this
// prototype: 288 total credit points across 6 semesters, 4 courses of 12cp
// each per semester, 24 courses total.
export const STANDARD_STRUCTURE = {
  totalCreditPoints: 288,
  totalSemesters: 6,
  creditPointsPerSemester: 48,
  coursesPerSemester: 4,
  totalCourses: 24,
}

export function degreeStructureFor() {
  return STANDARD_STRUCTURE
}

// Full 24-course curricula, in nominal completion order. Courses that also
// appear in the exchange-matching catalog (src/data/rmitUnits.js) carry a
// matching `rmitUnitId` so a student's remaining exchange-eligible units can
// be derived directly from how far through the curriculum they've gotten.
export const CURRICULA = {
  // ---- Bachelor of Information Technology (bp094) ----
  // Deliberately ordered so all 5 exchange-matching units (rmitUnitId
  // below) fall in semesters 5-6 — see the "Student A" demo case in
  // src/data/students.js, which needs a student who has comfortably
  // cleared the 72cp threshold while every unit in a specific partner
  // combination is still remaining (not yet completed).
  bp094: [
    { code: 'INTA1001', title: 'Introduction to Information Technology', creditPoints: 12, semester: 1 },
    { code: 'MATH1170', title: 'Discrete Mathematics for Computing', creditPoints: 12, semester: 1 },
    { code: 'COMM1298', title: 'Professional Communication', creditPoints: 12, semester: 1 },
    { code: 'COSC1113', title: 'Object-Oriented Programming', creditPoints: 12, semester: 1 },

    { code: 'ISYS1055', title: 'Database Concepts', creditPoints: 12, semester: 2 },
    { code: 'COSC1114', title: 'Operating Systems Principles', creditPoints: 12, semester: 2 },
    { code: 'NETW1001', title: 'Introduction to Networking', creditPoints: 12, semester: 2 },
    { code: 'ISYS2101', title: 'Systems Analysis and Design', creditPoints: 12, semester: 2 },

    { code: 'COSC2408', title: 'Programming Studio 1', creditPoints: 12, semester: 3 },
    { code: 'COSC2531', title: 'Human-Computer Interaction', creditPoints: 12, semester: 3 },
    { code: 'ISYS2150', title: 'IT Project Management', creditPoints: 12, semester: 3 },
    { code: 'SECU2100', title: 'Cybersecurity Fundamentals', creditPoints: 12, semester: 3 },

    { code: 'COSC3009', title: 'Cloud Computing Architectures', creditPoints: 12, semester: 4 },
    { code: 'COSC3813', title: 'Mobile Application Development', creditPoints: 12, semester: 4 },
    { code: 'ISYS3300', title: 'IT Governance and Ethics', creditPoints: 12, semester: 4 },
    { code: 'COSC3600', title: 'Capstone Project 1', creditPoints: 12, semester: 4 },

    { code: 'COSC1076', title: 'Programming Fundamentals', creditPoints: 12, semester: 5, rmitUnitId: 'ru-cosc1076' },
    { code: 'COSC2123', title: 'Algorithms and Analysis', creditPoints: 12, semester: 5, rmitUnitId: 'ru-cosc2123' },
    {
      code: 'COSC2299',
      title: 'Software Engineering Process and Tools',
      creditPoints: 12,
      semester: 5,
      rmitUnitId: 'ru-cosc2299',
    },
    { code: 'COSC2626', title: 'Web Programming', creditPoints: 12, semester: 5, rmitUnitId: 'ru-cosc2626' },

    { code: 'COSC3020', title: 'Distributed Systems', creditPoints: 12, semester: 6, rmitUnitId: 'ru-cosc3020' },
    { code: 'COSC3601', title: 'Capstone Project 2', creditPoints: 12, semester: 6 },
    { code: 'COSC3122', title: 'Artificial Intelligence Fundamentals', creditPoints: 12, semester: 6 },
    { code: 'ISYS3401', title: 'Professional Practice in IT', creditPoints: 12, semester: 6 },
  ],

  // ---- Bachelor of Business (bp250) ----
  bp250: [
    { code: 'BUSM1000', title: 'Introduction to Business', creditPoints: 12, semester: 1 },
    { code: 'ACCT1001', title: 'Accounting Fundamentals', creditPoints: 12, semester: 1 },
    { code: 'ECON1050', title: 'Microeconomics', creditPoints: 12, semester: 1 },
    { code: 'MKTG1025', title: 'Marketing Principles', creditPoints: 12, semester: 1, rmitUnitId: 'ru-mktg1025' },

    { code: 'MGMT1006', title: 'Management Principles', creditPoints: 12, semester: 2 },
    { code: 'ECON1051', title: 'Macroeconomics', creditPoints: 12, semester: 2 },
    { code: 'BLAW1002', title: 'Business Law', creditPoints: 12, semester: 2 },
    { code: 'STAT1010', title: 'Business Statistics', creditPoints: 12, semester: 2 },

    { code: 'MKTG2031', title: 'Consumer Behaviour', creditPoints: 12, semester: 3, rmitUnitId: 'ru-mktg2031' },
    { code: 'FINC2015', title: 'Corporate Finance', creditPoints: 12, semester: 3 },
    { code: 'MGMT2007', title: 'Organisational Behaviour', creditPoints: 12, semester: 3 },
    { code: 'BUSM2273', title: 'Business Analytics Fundamentals', creditPoints: 12, semester: 3 },

    {
      code: 'INTB1046',
      title: 'International Business',
      creditPoints: 12,
      semester: 4,
      rmitUnitId: 'ru-intb1046',
    },
    {
      code: 'MKTG2087',
      title: 'Digital Marketing Strategy',
      creditPoints: 12,
      semester: 4,
      rmitUnitId: 'ru-mktg2087',
    },
    { code: 'MGMT2201', title: 'Operations Management', creditPoints: 12, semester: 4 },
    { code: 'BUSM2410', title: 'Business Ethics and Sustainability', creditPoints: 12, semester: 4 },

    { code: 'MKTG2115', title: 'Marketing Analytics', creditPoints: 12, semester: 5, rmitUnitId: 'ru-mktg2115' },
    { code: 'FINC3013', title: 'Investment Analysis', creditPoints: 12, semester: 5 },
    { code: 'MGMT3020', title: 'Strategic Management', creditPoints: 12, semester: 5 },
    { code: 'BUSM3103', title: 'Entrepreneurship and Innovation', creditPoints: 12, semester: 5 },

    { code: 'BUSM3300', title: 'Capstone Business Project 1', creditPoints: 12, semester: 6 },
    { code: 'BUSM3301', title: 'Capstone Business Project 2', creditPoints: 12, semester: 6 },
    { code: 'MGMT3401', title: 'Leadership in Practice', creditPoints: 12, semester: 6 },
    { code: 'BUSM3500', title: 'Global Business Environment', creditPoints: 12, semester: 6 },
  ],

  // ---- Bachelor of Biomedical Science (bp217) ----
  bp217: [
    { code: 'ANAT1000', title: 'Human Anatomy 1', creditPoints: 12, semester: 1 },
    { code: 'PHYS1000', title: 'Human Physiology 1', creditPoints: 12, semester: 1 },
    { code: 'BIOL1010', title: 'Cell Biology', creditPoints: 12, semester: 1 },
    { code: 'CHEM1000', title: 'Chemistry for Biomedical Science', creditPoints: 12, semester: 1 },

    { code: 'ANAT1001', title: 'Human Anatomy 2', creditPoints: 12, semester: 2 },
    { code: 'PHYS1001', title: 'Human Physiology 2', creditPoints: 12, semester: 2 },
    { code: 'BIOL2033', title: 'Molecular Biology', creditPoints: 12, semester: 2, rmitUnitId: 'ru-biol2033' },
    { code: 'BIOC1001', title: 'Biochemistry Fundamentals', creditPoints: 12, semester: 2 },

    { code: 'BIOL2078', title: 'Genetics and Genomics', creditPoints: 12, semester: 3, rmitUnitId: 'ru-biol2078' },
    { code: 'PATH2000', title: 'Introduction to Pathophysiology', creditPoints: 12, semester: 3 },
    { code: 'PHAR2000', title: 'Pharmacology Fundamentals', creditPoints: 12, semester: 3 },
    { code: 'IMMU2000', title: 'Immunology', creditPoints: 12, semester: 3 },

    {
      code: 'BIOL2091',
      title: 'Applied Microbiology',
      creditPoints: 12,
      semester: 4,
      rmitUnitId: 'ru-biol2091',
    },
    { code: 'NEUR2000', title: 'Neuroscience Fundamentals', creditPoints: 12, semester: 4 },
    { code: 'BIOM2400', title: 'Biomedical Research Methods', creditPoints: 12, semester: 4 },
    { code: 'BIOM2401', title: 'Biomedical Data Analysis', creditPoints: 12, semester: 4 },

    { code: 'BIOT2011', title: 'Bioprocess Engineering', creditPoints: 12, semester: 5, rmitUnitId: 'ru-biot2011' },
    { code: 'PATH3000', title: 'Advanced Pathophysiology', creditPoints: 12, semester: 5 },
    { code: 'PHAR3000', title: 'Clinical Pharmacology', creditPoints: 12, semester: 5 },
    { code: 'BIOM3100', title: 'Biomedical Ethics and Law', creditPoints: 12, semester: 5 },

    { code: 'BIOM3200', title: 'Epidemiology and Public Health', creditPoints: 12, semester: 6 },
    { code: 'BIOM3900', title: 'Capstone Research Project 1', creditPoints: 12, semester: 6 },
    { code: 'BIOM3901', title: 'Capstone Research Project 2', creditPoints: 12, semester: 6 },
    { code: 'PATH3400', title: 'Diagnostics and Laboratory Medicine', creditPoints: 12, semester: 6 },
  ],
}

export function curriculumForProgram(programId) {
  return CURRICULA[programId] ?? []
}
