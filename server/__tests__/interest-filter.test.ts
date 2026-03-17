import { INTEREST_LEVELS } from "../../shared/schema";

type FilterableProspect = { interestLevel: string };

function applyInterestFilter(
  prospects: FilterableProspect[],
  filter: "All" | (typeof INTEREST_LEVELS)[number],
): FilterableProspect[] {
  if (filter === "All") return prospects;
  return prospects.filter((p) => p.interestLevel === filter);
}

const sampleProspects: FilterableProspect[] = [
  { interestLevel: "High" },
  { interestLevel: "High" },
  { interestLevel: "Medium" },
  { interestLevel: "Low" },
];

describe("interest-level column filter (client-side logic)", () => {
  test("All returns every prospect unchanged", () => {
    const result = applyInterestFilter(sampleProspects, "All");
    expect(result).toHaveLength(4);
  });

  test("High returns only High-interest prospects", () => {
    const result = applyInterestFilter(sampleProspects, "High");
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.interestLevel === "High")).toBe(true);
  });

  test("Medium returns only Medium-interest prospects", () => {
    const result = applyInterestFilter(sampleProspects, "Medium");
    expect(result).toHaveLength(1);
    expect(result[0].interestLevel).toBe("Medium");
  });

  test("Low returns only Low-interest prospects", () => {
    const result = applyInterestFilter(sampleProspects, "Low");
    expect(result).toHaveLength(1);
    expect(result[0].interestLevel).toBe("Low");
  });

  test("returns empty array when no prospects match the filter", () => {
    const noLow: FilterableProspect[] = [
      { interestLevel: "High" },
      { interestLevel: "Medium" },
    ];
    const result = applyInterestFilter(noLow, "Low");
    expect(result).toHaveLength(0);
  });

  test("each filter option is a valid INTEREST_LEVELS value", () => {
    expect(INTEREST_LEVELS).toContain("High");
    expect(INTEREST_LEVELS).toContain("Medium");
    expect(INTEREST_LEVELS).toContain("Low");
    expect(INTEREST_LEVELS).toHaveLength(3);
  });
});
