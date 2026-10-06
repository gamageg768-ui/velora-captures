export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  discipline: string;
  image: string;       // path inside /public, e.g. '/work/my-photo.jpg'
  tint?: string;       // optional accent colour on hover overlay
  description?: string;
  tags?: string[];
  overview?: string;
  challenge?: string;
  solution?: string;
  outcome?: string;
  images?: string[];   // extra images for the case study page
};

// ─── ADD YOUR PHOTOS HERE ────────────────────────────────────────────────────
//
// 1. Drop your photo into the  public/work/  folder
//    (e.g. public/work/portrait-01.jpg)
//
// 2. Copy one of the entries below, fill in your details, save.
//
// 3. git add . && git push  — Vercel redeploys automatically.
//
// Minimum required fields: slug, title, client, year, discipline, image
// ─────────────────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  // {
  //   slug: 'portrait-session-01',
  //   title: 'Golden Hour Portraits',
  //   client: 'Personal Project',
  //   year: '2024',
  //   discipline: 'Portrait',
  //   image: '/work/portrait-session-01.jpg',
  // },
];

export const disciplines = [
  'Portrait',
  'Editorial',
  'Commercial',
  'Events',
  'Landscape',
  'Architecture',
  'Film',
  'Product',
];
