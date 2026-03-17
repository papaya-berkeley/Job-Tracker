import { validateProspect, isDeadlineOverdue } from "../prospect-helpers";

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

describe("application deadline validation", () => {
  test("accepts a valid YYYY-MM-DD date string", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      applicationDeadline: "2099-12-31",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts omitted deadline (field not provided)", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
    });

    expect(result.valid).toBe(true);
  });

  test("accepts explicit null deadline", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      applicationDeadline: null,
    });

    expect(result.valid).toBe(true);
  });

  test("rejects deadline in MM/DD/YYYY format", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      applicationDeadline: "12/31/2099",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Deadline must be a valid date (YYYY-MM-DD)");
  });

  test("rejects deadline with missing parts", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      applicationDeadline: "2099-12",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Deadline must be a valid date (YYYY-MM-DD)");
  });

  test("rejects non-string deadline value", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      applicationDeadline: 20991231,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Application deadline must be a string");
  });

  test("accepts a past date (overdue is a display concern, not a validation error)", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      applicationDeadline: "2000-01-01",
    });

    expect(result.valid).toBe(true);
  });
});

describe("isDeadlineOverdue", () => {
  test("returns true for a past date", () => {
    expect(isDeadlineOverdue("2000-01-01")).toBe(true);
  });

  test("returns false for a future date", () => {
    expect(isDeadlineOverdue("2099-12-31")).toBe(false);
  });

  test("returns false for today's date", () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    expect(isDeadlineOverdue(`${yyyy}-${mm}-${dd}`)).toBe(false);
  });
});
