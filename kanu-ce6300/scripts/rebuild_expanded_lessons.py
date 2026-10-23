"""Regenerate browser-ready teaching data from the editable JSON source.
Run from any directory: python scripts/rebuild_expanded_lessons.py
"""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
source=root/'expanded-lessons.json'
obj=json.loads(source.read_text(encoding='utf-8'))
assert isinstance(obj,dict) and obj,'Expected lesson map'
for lesson_id,item in obj.items():
    for name in ('goal','explore','steps','decision','recall','challenge'):
        assert item.get(name),f'{lesson_id}: missing {name}'
    assert len(item['challenge'])==2, f'{lesson_id}: challenge must have prompt, solution'
out=root/'expanded-lessons.js'
out.write_text('window.RS_DEEP_LESSONS = '+json.dumps(obj,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print(f'Updated {out.name} with {len(obj)} authored lesson expansions')
