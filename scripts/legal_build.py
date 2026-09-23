# -*- coding: utf-8 -*-
"""Turn the two signed PDFs into src/site/legal-copy.js.

    python3 scripts/legal_build.py src/site/legal-copy.js

The PDFs live in the client folder, not in this repo, and the path to them is
at the top of this file.

The PDFs are bilingual: English in the left column, Arabic in the right. The
extraction crops to the English column, strips what Arabic still bleeds in, and
rebuilds the structure the layout dump loses — headings, clauses, sub-clauses,
bullets and one table. `legal_fixes.py` carries every hand correction, so re-running
this against a new revision of either document reproduces the same result.
"""
import json, re, subprocess, sys
import legal_fixes as fixes

DOCS = "/Users/thegoodmachine/Documents/The Good Machine/4. Clients - Work/Pure Health/14 Projects/Website Research and Images/Documents"
AR = re.compile('[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿'
                '‪-‮‎‏⁦-⁩؜]')
FOOT = re.compile(r'^\d*\s*\d{4}-\d{4}-\d{4},\s*v\.\s*\d+\s*$')

PRIVACY_HEADS = [
    '1. Aim and purpose of this Privacy Policy', '2. Definitions', '3. Your Consent',
    '4. Personally Identifiable Information Collection Methods and Categories',
    '5. Utilization of Your Personally Identifiable Information',
    '6. Sharing your Personally Identifiable Information',
    '7. Transferring your Personally Identifiable Information',
    '8. Your rights', '9. Personally Identifiable Information Security',
    '10. Personally Identifiable Information Storage and Retention',
    '11. Changes to this Privacy Policy', '12. Contacting Us',
]
TERMS_HEADS = [
    '1. Terms', '2. Accounts', '3. Data Usage',
    '4. Health Records Integration (EMR Connectivity)', '5. Payments',
    '6. Refund Request Review Process', '7. Non-Refundable Cases',
    '8. Online Doctor Service', '9. FitCoins', '10. App Features',
    '11. Digital Twin', '12. Your use of the App',
] + fixes.RUNON_HEADINGS


def lines_of(path, width):
    txt = subprocess.run(['pdftotext', '-layout', '-x', '0', '-y', '0', '-W', str(width),
                          '-H', '792', path, '-'], capture_output=True, text=True).stdout
    out = []
    for raw in txt.split('\n'):
        s = re.sub(r'\s+', ' ', AR.sub(' ', raw)).strip()
        if not s or FOOT.match(s) or re.fullmatch(r'\d{1,3}', s):
            continue
        out.append(s)
    return out


def blocks_of(lines):
    """Fold the wrapped lines back into clauses and bullets."""
    CLAUSE = re.compile(r'^\d{1,2}\.\d{1,2}\.?\s+')
    BULLET = re.compile(r'^[••−\-]\s+')
    blocks, kind, buf = [], None, ''

    def flush():
        if buf.strip():
            blocks.append({'k': kind, 't': re.sub(r'\s+', ' ', buf).strip()})

    for s in lines:
        if CLAUSE.match(s):
            flush(); kind, buf = 'p', s
        elif BULLET.match(s):
            flush(); kind, buf = 'li', BULLET.sub('', s)
        elif kind is None:
            kind, buf = 'p', s
        else:
            buf += ' ' + s
    flush()
    return blocks


# A hyphen the source used to break a word across two lines. Rejoining the
# lines leaves it stranded mid-word with a space after it — "AI- assisted".
LINE_HYPHEN = re.compile(r'(?<=[A-Za-z])- (?=[a-z])')


def apply_text_fixes(blocks):
    for b in blocks:
        for old, new in fixes.REPLACEMENTS:
            b['t'] = b['t'].replace(old, new)
        b['t'] = LINE_HYPHEN.sub('-', b['t'])
    return blocks


def split_paragraphs(blocks):
    out = []
    for b in blocks:
        for marker in fixes.PARA_SPLIT:
            i = b['t'].find(marker)
            if i > 0:
                out.append({'k': b['k'], 't': b['t'][:i].strip()})
                b = {'k': 'p', 't': b['t'][i:].strip()}
        out.append(b)
    return out


def merge_broken_bullets(blocks):
    """A bullet the column break cut in half rejoins the one above it."""
    out = []
    for b in blocks:
        if (out and b['k'] == 'li' and out[-1]['k'] == 'li'
                and re.search(r'\b(but not|and|or|the)$', out[-1]['t'])):
            out[-1]['t'] += ' ' + b['t']
        else:
            out.append(b)
    return out


def split_swallowed_bullets(blocks):
    out = []
    for b in blocks:
        done = False
        for head, second in fixes.SPLIT_LI:
            if b['k'] == 'li' and b['t'].startswith(head) and second in b['t']:
                i = b['t'].index(second)
                out.append({'k': 'li', 't': b['t'][:i].strip()})
                out.append({'k': 'li', 't': b['t'][i:].strip()})
                done = True
                break
        if not done:
            out.append(b)
    return out


def split_tails(blocks):
    out = []
    for b in blocks:
        if b['k'] in ('li', 'sub'):
            for marker in fixes.SPLIT_TAIL:
                i = b['t'].find(marker)
                if i > 0:
                    out.append({'k': b['k'], 't': b['t'][:i].strip()})
                    b = {'k': 'p', 't': b['t'][i:].strip()}
        out.append(b)
    return out


def split_headings(blocks, heads):
    """Cut the known section headings out of whatever they ran into."""
    out = []
    for b in blocks:
        text = b['t']
        while True:
            hit = next(((h, text.index(h)) for h in heads if h in text), None)
            if not hit:
                break
            h, i = hit
            before = text[:i].strip()
            if before:
                out.append({'k': b['k'], 't': before})
            n, title = h.split(' ', 1)
            out.append({'k': 'h', 'n': n.rstrip('.'), 't': title})
            text = text[i + len(h):].strip(' .')
            b = {'k': 'p', 't': text}
        if text.strip():
            out.append({'k': b['k'], 't': text.strip()})
    return out


SUBCLAUSE = re.compile(r'(?=(?<![\d.])\d{1,2}\.\d{1,2}\.\d{1,2}(?:\.\d{1,2})?\.?\s)')
ROMAN = re.compile(r'(?=(?<![A-Za-z])(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)\)\s)')


def split_subclauses(blocks):
    out = []
    for b in blocks:
        if b['k'] != 'p':
            out.append(b); continue
        parts = [p.strip() for p in SUBCLAUSE.split(b['t']) if p.strip()]
        if len(parts) > 1:
            out.append({'k': 'p', 't': parts[0]})
            for p in parts[1:]:
                out.append({'k': 'sub', 't': p})
            continue
        parts = [p.strip() for p in ROMAN.split(b['t']) if p.strip()]
        if len(parts) > 2:
            # A block that OPENS on a roman marker is all list; one that opens
            # on prose keeps that prose as its own paragraph.
            lead_is_item = bool(ROMAN.match(b['t']))
            for i, p in enumerate(parts):
                out.append({'k': 'sub' if (i or lead_is_item) else 'p', 't': p})
            continue
        out.append(b)
    return out


NUM = re.compile(r'^(\d{1,2}(?:\.\d{1,2}){1,3}\.?)\s+')


def number_and_title(blocks):
    """Lift the clause number out of the text, and the bold clause titles."""
    for b in blocks:
        if b['k'] in ('p', 'sub'):
            m = NUM.match(b['t'])
            if m:
                b['n'] = m.group(1)
                b['t'] = b['t'][m.end():]
                key = b['n'].rstrip('.')
                title = fixes.CLAUSE_TITLES.get(key)
                if title and b['t'].startswith(title):
                    b['title'] = title
                    b['t'] = b['t'][len(title):].strip()
        if b['k'] == 'li':
            m = re.match(r'^([A-Z][^:.]{2,60}):\s+', b['t'])
            if m:
                b['lead'] = m.group(1) + ':'
                b['t'] = b['t'][m.end():]
    return blocks


def js(value):
    return json.dumps(value, ensure_ascii=False)


def emit(blocks):
    rows = []
    for b in blocks:
        parts = [f"k: {js(b['k'])}"]
        for key in ('n', 'lead', 'title'):
            if b.get(key):
                parts.append(f"{key}: {js(b[key])}")
        if b.get('ps'):
            parts.append('ps: ' + js(b['ps']))
        if b.get('items'):
            parts.append('items: ' + js(b['items']))
        if b.get('t'):
            parts.append(f"t: {js(b['t'])}")
        rows.append('  { ' + ', '.join(parts) + ' },')
    return '\n'.join(rows)


def build(path, width, heads):
    b = blocks_of(lines_of(path, width))
    b = apply_text_fixes(b)
    b = merge_broken_bullets(b)
    b = split_swallowed_bullets(b)
    b = split_paragraphs(b)
    b = split_tails(b)
    b = split_headings(b, heads)
    b = split_subclauses(b)
    b = split_tails(b)
    b = number_and_title(b)
    return [x for x in b if x.get('t') or x.get('ps') or x.get('items')]


privacy = build(f'{DOCS}/Pura App Privacy Policy _17.08.26_1.pdf', 340, PRIVACY_HEADS)
terms = build(f'{DOCS}/CLEAN   Pura App Terms & Conditions_20.08.26_1.pdf', 335, TERMS_HEADS)

# Drop the running title the first page repeats; it becomes the page header.
privacy = [b for b in privacy if not b['t'].startswith('Privacy Policy for Pura')]
terms[0]['t'] = terms[0]['t'].split('Welcome to Pura.', 1)[1]
terms[0]['t'] = 'Welcome to Pura.' + terms[0]['t']

# The rights table, and the two PayTabs policies clause 5 links to.
out = []
for b in privacy:
    if b.get('n') == '8.1.':
        out.append({'k': 'p', 'n': '8.1.', 't': 'You have the following rights, which you can exercise free of charge:'})
        for label, ps in fixes.RIGHTS_ROWS:
            out.append({'k': 'dt', 'lead': label, 'ps': ps})
        continue
    out.append(b)
privacy = out

for i, b in enumerate(terms):
    if 'PayTabs Policies' in b.get('t', ''):
        b['t'] = b['t'].split('Terms of Use | PayTabs')[0].strip()
        terms.insert(i + 1, {'k': 'links', 'items': fixes.PAYTABS_LINKS})
        break

HEADER = '''/**
 * The Privacy Policy and the Terms of Use, in full.
 *
 * GENERATED — do not hand-edit. The copy is the English column of the two
 * signed bilingual PDFs, lifted by `scripts/legal_build.py`, which also carries
 * every correction applied to the extraction. To change the copy, change the
 * PDF and re-run the script.
 *
 * Source documents:
 *   Pura App Privacy Policy _17.08.26_1.pdf
 *   CLEAN   Pura App Terms & Conditions_20.08.26_1.pdf
 *
 * Nothing here is reworded. Where the source has a typo, a doubled word or a
 * stray full stop, it is reproduced as written: this is the text PureHealth's
 * legal team signed, and a prototype that tidies it is quoting something that
 * was never agreed.
 *
 * Block kinds: `h` a numbered section heading, `p` a clause, `sub` a numbered
 * sub-clause, `li` a bullet, `dt` a row of the rights table in Privacy 8.1,
 * and `links` a row of outbound links.
 */

'''

with open(sys.argv[1], 'w') as f:
    f.write(HEADER)
    f.write("export const PRIVACY = [\n" + emit(privacy) + "\n]\n\n")
    f.write("export const TERMS = [\n" + emit(terms) + "\n]\n")
print('privacy', len(privacy), 'terms', len(terms))
