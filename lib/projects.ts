export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  discipline: string;
  /** Path under /public. Swap these for your own work. */
  image: string;
  tint: string; // accent used in hover/overlay
  description: string;
  // Case study fields
  tags: string[];
  overview: string;
  challenge: string;
  solution: string;
  outcome: string;
  images: string[];
};

export const projects: Project[] = [];

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
