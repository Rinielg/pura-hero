# -*- coding: utf-8 -*-
"""Corrections applied to the raw PDF extraction.

Every entry is a defect of the EXTRACTION, not of the source document: a word
duplicated where the Arabic column crossed the English one, a stray numeral
from the facing column, a pair of words transposed by the bidi algorithm.
Source-document oddities ("mental, mental", "serrvice", "prevail apply",
"section5", "app..") are left exactly as written.
"""

REPLACEMENTS = [
    # --- terms: bidi crossings -------------------------------------------
    ('visualisation), Ne Next Best Action engine',
     'visualisation), Next Best Action engine'),
    ('Clinical consultations Services: telehealth through our Virtual Consultations service',
     'Clinical Services: telehealth consultations through our Virtual Consultations service'),
    ('and Apple Pay / Samsung A Pay.', 'and Apple Pay / Samsung Pay.'),
    ('withdraw consent to EMR (E connectivity at any time through [Settings > Delete account]',
     'withdraw consent to EMR connectivity at any time through [Settings > Delete account]'),
    ('Digital Twin and PureScore are for intended informational and wellness purposes only.',
     'Digital Twin and PureScore are intended for informational and wellness purposes only.'),
    ('electronic medical records (where authorized), , laboratory results',
     'electronic medical records (where authorized), laboratory results'),
    ('earning rates, or — the discontinuation of the programme — Pure Health 14 will provide',
     'earning rates, or the discontinuation of the programme — Pure Health will provide'),
    ("Pure Health 's determination", "Pure Health's determination"),
    ('8. Online Doctor Service /', '8. Online Doctor Service'),
    ('wearables including but not - limited to, Apple', 'wearables including but not limited to, Apple'),
    ('4. 4. Health Records Integration', '4. Health Records Integration'),
    ('and owned by Pure )" Health Medical Supplies', 'and owned by Pure Health Medical Supplies'),
    ('through which you (“you”, " “your” or “Individuals”)',
     'through which you (“you”, “your” or “Individuals”)'),
    ('as “Service Provider(s)”). )" The wide range', 'as “Service Provider(s)”). The wide range'),
    ('("Terms of Use") )" and the Pura Privacy Policy', '("Terms of Use") and the Pura Privacy Policy'),
    ('will apply.By registering', 'will apply. By registering'),
    ('those details (e.g. change of email or phone number). You ) can access',
     'those details (e.g. change of email or phone number). You can access'),
    ('using your " SEHA ID, and sharing it with designated " doctors/physicians',
     'using your SEHA ID, and sharing it with designated doctors/physicians'),
    ('(the "AI Companion") is a " conversational feature', '(the "AI Companion") is a conversational feature'),
    ('(e.g., SEHA), : which you are responsible', '(e.g., SEHA), which you are responsible'),
    ('before the applicable cutoff time . whichever comes first',
     'before the applicable cutoff time, whichever comes first'),
    ('Counterparts and Electronic Signatures: : These Terms',
     'Counterparts and Electronic Signatures: These Terms'),
    ('made from time to time to ) these Terms)', 'made from time to time to these Terms)'),
    ('By paying , you agree', 'By paying, you agree'),
    ('12.2.10Collect', '12.2.10 Collect'),
    ('12.2.11Otherwise', '12.2.11 Otherwise'),
    # --- privacy: bidi crossings -----------------------------------------
    ('contacting us at care.pura@pura.ai; care.p or', 'contacting us at care.pura@pura.ai; or'),
    ('6.5.3. Using “Communication ” settings available in the app',
     '6.5.3. Using “Communication settings” available in the app'),
    ('within the Group ( (i.e. entities', 'within the Group (i.e. entities'),
    ('please contact us : at: care.pura@pura.ai', 'please contact us at: care.pura@pura.ai'),
    ('We limit access to Personally your Identifiable Information',
     'We limit access to your Personally Identifiable Information'),
    ('automated processing individual (including profiling) that decision produces legal effects making concerning you',
     'automated processing (including profiling) that produces legal effects concerning you'),
]

# Where the source starts a new paragraph inside what the dump ran together.
PARA_SPLIT = [
    'The App is a digital platform through which you',
]

# A bullet the extraction swallowed into the one above it.
SPLIT_LI = [
    ('Electronic Medical Records: linkage', 'Wellness and Fitness: fitness challenges'),
    ('Corporate and B2B Services:', 'Platform Services:'),
    ('Reactivating a previously inactive account; and', 'Referring new users to Pura'),
    ('Suspend or permanently terminate', 'Take any other action available to Pure Health'),
]

# Prose the source sets under a list, which the dump folded into the last item.
SPLIT_TAIL = [
    'Pure Health reserves the right to introduce, modify, suspend, or withdraw any earning activity at any time.',
    'Pure Health reserves the right to, without notice and at its sole discretion:',
    'FitCoins are a discretionary benefit.',
    'Emergencies: The AI Companion is not intended for',
]

# Headings the source writes without a full stop, so they ran on into the
# paragraph before them.
RUNON_HEADINGS = [
    '13 App Material', '14 Intellectual Property', '15 Warranty Disclaimer',
    '16 Limitation of Liability', '17 Indemnity', '18 Force Majeure',
    '19 Termination', '20 Entire Agreement', '21 Electronic Communications',
    '22 General Information', '23 Governing Law',
]

# Clause titles the source sets in bold above the clause body.
CLAUSE_TITLES = {
    '9.1': 'What FitCoins Are', '9.2': 'Earning FitCoins',
    '9.3': 'Earning Limits and Dynamic Reward Values', '9.4': 'Redemption',
    '9.5': 'Expiry', '9.6': 'Account Closure and Suspension',
    '9.7': 'Non-Transferability and Prohibited Conduct', '9.8': 'No Cash Value',
    '9.9': 'Programme Changes', '10.1': 'Pure Score',
    '10.2': 'Promotions and Rewards', '10.3': 'AI Companion',
}

# Section 8.1 of the Privacy Policy is a two-column table. Nothing recovers a
# table from a text dump, so its rows are transcribed from the page.
RIGHTS_ROWS = [
    ('Withdraw Consent', [
        "You have the right to withdraw your consent for Services such as marketing communication. Simply contact us, and we'll manage your preferences accordingly.",
        'If you have provided us with a consent to use your personal data, you have a right to withdraw that consent by opting to Delete account easily at any time from the app.',
        'Withdrawing consent will not affect the lawfulness of our use of your personal data in reliance on that consent before it was withdrawn.',
    ]),
    ('Access Your Data', [
        'Please reach out to us if you wish to know what data we have stored about you.',
    ]),
    ('Correct or Delete Your Data', [
        'Please keep us updated if your personal data requires correction or deletion.',
        'If you want certain stored data corrected or deleted, contact us. While we strive to honor such requests, certain legal obligations may apply.',
    ]),
    ('Data portability', [
        'Where you require us to transfer your Personally Identifiable Information to a Service Provider or third party (in certain situations as permissible under the applicable health and data protection laws), please let us know as we can provide it in a zipped format for your convenience.',
    ]),
    ('Not to be subject to automated individual decision making', [
        'The right not to be subject to a decision based solely on automated processing (including profiling) that produces legal effects concerning you or similarly significantly affects you in which case it is your responsibility to delete the app.. Automated AI processing will generate generic recommendations with the limited data that is available.',
    ]),
    ('Complaints', [
        'If you have concerns, you have the right to lodge complaints with the supervisory authority or our Data Protection Officer. Feel free to contact them directly.',
    ]),
]

# The two PayTabs policies clause 5 links to, read off the PDF's own link
# annotations rather than guessed.
PAYTABS_LINKS = [
    ('Terms of Use | PayTabs', 'https://ai.paytabs.com/en/terms-of-use/'),
    ('Privacy Policy | PayTabs', 'https://ai.paytabs.com/en/privacy-policy/'),
]
