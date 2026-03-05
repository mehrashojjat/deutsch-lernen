#!/usr/bin/env python3
import csv
from pathlib import Path
wk = Path('word_data/quiz_csv/b1.csv')
head = Path('word_data/quiz_csv/b1.csv.HEAD.bak')
merged = Path('word_data/quiz_csv/b1.csv.merged')
# backup working file
wk_backup = Path('word_data/quiz_csv/b1.csv.working.bak')
if not wk_backup.exists():
    wk.rename(wk_backup) if wk.exists() else None
# restore working file from backup if we moved it
if wk_backup.exists() and not wk.exists():
    wk_backup.replace(wk)
# build map from working file (may include translation_tr)
tr_map = {}
with wk.open('r', encoding='utf-8') as f:
    reader = csv.reader(f)
    hdr = next(reader)
    try:
        id_idx = hdr.index('id')
    except ValueError:
        id_idx = 0
    if 'translation_tr' in hdr:
        tr_idx = hdr.index('translation_tr')
    else:
        tr_idx = len(hdr)-1
    for r in reader:
        if not r: continue
        try:
            rid = r[id_idx].strip()
        except IndexError:
            continue
        val = ''
        if tr_idx < len(r):
            val = r[tr_idx].strip()
        if val:
            tr_map[rid]=val
# read HEAD base
if not head.exists():
    print('HEAD backup not found:', head)
    raise SystemExit(1)
with head.open('r', encoding='utf-8') as f:
    reader = csv.reader(f)
    hdr = next(reader)
    if 'translation_tr' not in hdr:
        hdr.append('translation_tr')
    rows = [hdr]
    merged_count = 0
    total = 0
    for r in reader:
        total += 1
        if not r:
            rows.append(r)
            continue
        rid = r[0].strip() if r else ''
        tr = tr_map.get(rid, '')
        if len(r) < len(hdr):
            r = r + ['']*(len(hdr)-len(r))
        r[-1] = tr
        if tr:
            merged_count += 1
        rows.append(r)
# write merged
with merged.open('w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print(f'Merged translations into {merged} — total rows: {total}, merged: {merged_count}')
