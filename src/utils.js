import { DHE } from "./constants";

export function getMondays(y, m) {
  const r = [];
  const d = new Date(y, m - 1, 1);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  while (d.getMonth() === m - 1) {
    r.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return r;
}

export function fmt(d) {
  return d ? `${d.getDate()}.${d.getMonth() + 1}.${String(d.getFullYear()).slice(2)}` : "—";
}

export function dn(d) {
  return d ? DHE[d.getDay()] : "—";
}

export function pickDate(y, m, used, from, to) {
  for (let i = from; i <= to; i++) {
    const dt = new Date(y, m - 1, i);
    if (!used.has(i) && dt.getDay() !== 5 && dt.getDay() !== 6) {
      used.add(i);
      return dt;
    }
  }
  return null;
}

export function buildSchedule(y, m) {
  const mons = getMondays(y, m);
  const last = new Date(y, m, 0).getDate();
  const used = new Set();
  const posts = [];

  const mon1 = mons[0];
  if (mon1) {
    used.add(mon1.getDate());
    posts.push({ id: "mon1", date: mon1, type: "שני חסכוני", tk: "monday" });
  }

  const hol = pickDate(y, m, used, 4, 12);
  if (hol) posts.push({ id: "hol", date: hol, type: "חג / אירוע", tk: "holiday" });

  const fun = pickDate(y, m, used, 9, 18);
  if (fun) posts.push({ id: "fun", date: fun, type: "מצחיק / אפליקציה", tk: "fun" });

  const rec = pickDate(y, m, used, 16, 24);
  if (rec) posts.push({ id: "rec", date: rec, type: "דרושים", tk: "recruit" });

  const mon2 = mons[mons.length - 1];
  const last5 = mon2 && !used.has(mon2.getDate()) ? mon2 : pickDate(y, m, used, 22, last);
  if (last5) {
    used.add(last5.getDate());
    posts.push({ id: "mon2", date: last5, type: "שני חסכוני", tk: "monday" });
  }

  [1, 2, 3, 4].forEach(i =>
    posts.push({ id: `pr${i}`, date: null, type: "פוסט מבצע", tk: "promo", promoText: "" })
  );

  return posts
    .sort((a, b) => (!a.date ? 1 : !b.date ? -1 : a.date - b.date))
    .map((p, i) => ({ ...p, num: i + 1 }));
}

export function serializePosts(posts) {
  return posts.map(p => ({ ...p, date: p.date ? p.date.toISOString() : null }));
}

export function deserializePosts(posts) {
  return posts.map(p => ({ ...p, date: p.date ? new Date(p.date) : null }));
}
