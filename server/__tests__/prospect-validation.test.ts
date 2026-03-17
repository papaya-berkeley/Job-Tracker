import { validateProspect } from "../prospect-helpers";

describe("prospect creation validation", () => {
  test("rejects a blank company name", () => {
    const result = validateProspect({
      companyName: "",
      roleTitle: "Marketing officer",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Company name is required");
  });

  test("rejects a blank role title", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role title is required");
  });
});

describe("target salary validation", () => {
  test("accepts a valid salary string", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      targetSalary: "$120,000",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts salary in shorthand format", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      targetSalary: "$90k–$110k",
    });

    expect(result.valid).toBe(true);
  });

  test("accepts omitted salary (field not provided)", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
    });

    expect(result.valid).toBe(true);
  });

  test("accepts explicit null salary", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      targetSalary: null,
    });

    expect(result.valid).toBe(true);
  });

  test("rejects salary longer than 100 characters", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      targetSalary: "a".repeat(101),
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be 100 characters or less");
  });

  test("accepts salary of exactly 100 characters", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      targetSalary: "a".repeat(100),
    });

    expect(result.valid).toBe(true);
  });

  test("rejects non-string salary value", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      targetSalary: 120000,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Target salary must be a string");
  });
});
