export type BikeRecord = {
  brokenAt: string;
  note: string;
};

export type PublicBikeRecord = BikeRecord & {
  daysBroken: number;
};
