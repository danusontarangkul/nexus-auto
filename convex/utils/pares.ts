export const parseNum = (val: string | null | undefined) =>
  val ? Number(val) : null;
