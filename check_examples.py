import csv

total = 0
generic1 = 0
generic2 = 0
generic3 = 0
good = 0
examples_good = []

with open('word_data/quiz_csv/b1.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        total += 1
        ex = row.get('example_de', '').strip()
        if 'ist für viele Menschen im Alltag wichtig' in ex:
            generic1 += 1
        elif 'Ich möchte' in ex and 'und mehr darüber lernen' in ex:
            generic2 += 1
        elif 'ist ein Thema, über das wir heute sprechen' in ex:
            generic3 += 1
        else:
            good += 1
            examples_good.append((row['id'], row['word'], row['translation_en'], ex))

print(f'Total: {total}')
print(f'Generic noun template (... ist fuer viele Menschen ...): {generic1}')
print(f'Generic verb template (Ich moechte ... lernen): {generic2}')
print(f'Generic other template (... ist ein Thema ...): {generic3}')
print(f'Non-generic (potentially good): {good}')
print()
if examples_good:
    print('Sample non-generic examples:')
    for r in examples_good[:30]:
        print(f'  id={r[0]}, word={r[1]}, en={r[2]}')
        print(f'    example: {r[3]}')
