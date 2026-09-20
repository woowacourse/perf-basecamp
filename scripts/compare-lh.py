#!/usr/bin/env python3
"""lh-result/의 측정 결과를 라벨별 중앙값으로 비교한다.

    ./scripts/compare-lh.py before after-hero step2
    ./scripts/compare-lh.py            # 라벨 생략 시 전체 자동 탐지
"""
import glob
import json
import os
import re
import statistics
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lh-result')
METRICS = [
    ('perf', 'Performance', 'score'),
    ('fcp', 'FCP', 'ms'),
    ('lcp', 'LCP', 'ms'),
    ('tbt', 'TBT', 'ms'),
    ('cls', 'CLS', 'raw'),
    ('si', 'Speed Index', 'ms'),
]
AUDIT = {
    'fcp': 'first-contentful-paint',
    'lcp': 'largest-contentful-paint',
    'tbt': 'total-blocking-time',
    'cls': 'cumulative-layout-shift',
    'si': 'speed-index',
}


def read(path):
    with open(path, encoding='utf-8') as fp:
        d = json.load(fp)
    a = d.get('audits', {})
    score = d.get('categories', {}).get('performance', {}).get('score')
    row = {'perf': round(score * 100) if score is not None else None,
           'version': d.get('lighthouseVersion'),
           'method': d.get('configSettings', {}).get('throttlingMethod')}
    for key, audit in AUDIT.items():
        row[key] = a.get(audit, {}).get('numericValue')
    return row


def labels_from_disk():
    """라벨을 파일 생성 시각순으로 반환한다(측정한 순서 = 개선 단계 순서)."""
    first_seen = {}
    for p in glob.glob(os.path.join(ROOT, 'lh*-*.json')):
        m = re.match(r'lh\d+-(.+)\.json$', os.path.basename(p))
        if not m:
            continue
        label = m.group(1)
        mtime = os.path.getmtime(p)
        if label not in first_seen or mtime < first_seen[label]:
            first_seen[label] = mtime
    return sorted(first_seen, key=first_seen.get)


def median(rows, key):
    vals = [r[key] for r in rows if r.get(key) is not None]
    return statistics.median(vals) if vals else None


def fmt(val, unit):
    if val is None:
        return '-'
    if unit == 'score':
        return f'{val:.0f}'
    if unit == 'raw':
        return f'{val:.3f}'
    return f'{val:,.0f}ms'


def main():
    labels = sys.argv[1:] or labels_from_disk()
    if not labels:
        print('lh-result/에 측정 결과가 없습니다.')
        return

    data, meta = {}, {}
    for label in labels:
        files = sorted(glob.glob(os.path.join(ROOT, f'lh*-{label}.json')))
        if not files:
            print(f'! {label}: 파일 없음', file=sys.stderr)
            continue
        rows = [read(f) for f in files]
        data[label] = rows
        meta[label] = (len(rows), rows[0]['version'], rows[0]['method'])

    if not data:
        return

    labels = list(data)
    width = max(len(l) for l in labels + ['metric']) + 2

    print('측정 조건')
    for label in labels:
        n, ver, method = meta[label]
        print(f'  {label:<{width}} {n}회  lighthouse {ver}  throttling={method}')
    print()

    header = f'{"metric":<14}' + ''.join(f'{l:>{width+6}}' for l in labels)
    print(header)
    print('-' * len(header))
    for key, name, unit in METRICS:
        line = f'{name:<14}'
        for label in labels:
            line += f'{fmt(median(data[label], key), unit):>{width+6}}'
        print(line)

    if len(labels) >= 2:
        first, last = labels[0], labels[-1]
        print()
        print(f'{first} -> {last}')
        for key, name, unit in METRICS:
            b, a = median(data[first], key), median(data[last], key)
            if b is None or a is None:
                continue
            if unit == 'score':
                change = f'{a - b:+.0f}점'
            elif unit == 'raw':
                change = f'{a - b:+.3f}'
            elif b == 0:
                change = '-'
            else:
                change = f'{(a - b) / b * 100:+.1f}%'
            print(f'  {name:<14}{fmt(b, unit):>12} -> {fmt(a, unit):>12}   {change}')


if __name__ == '__main__':
    main()
