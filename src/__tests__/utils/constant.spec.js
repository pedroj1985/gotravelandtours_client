import { describe, it, expect } from "vitest";
import { paymentData, orderStatusList } from "../../utils/constant";

describe("paymentData", () => {
  it("should map accommodation types", () => {
    expect(paymentData.accomodation).toBe("lodging");
    expect(paymentData.vehicle).toBe("rent");
    expect(paymentData.activity).toBe("activity");
    expect(paymentData.service).toBe("service");
    expect(paymentData.transportation).toBe("transportation");
  });

  it("should define payment methods", () => {
    expect(paymentData.paymentMethod.EXT).toBe("EXT");
    expect(paymentData.paymentMethod.TROPIPAY).toBe("Tropipay");
  });

  it("should list currencies with code and label", () => {
    expect(paymentData.currency).toHaveLength(3);
    expect(paymentData.currency[0]).toEqual({
      code: "USD",
      label: "Dólar estadounidense"
    });
    expect(paymentData.currency[1]).toEqual({
      code: "CUP",
      label: "Peso cubano"
    });
    expect(paymentData.currency[2]).toEqual({
      code: "EUR",
      label: "Euro"
    });
  });

  it("should list product type filters with expected structure", () => {
    expect(paymentData.productTypeFilter).toHaveLength(6);
    paymentData.productTypeFilter.forEach(item => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("value");
      expect(item).toHaveProperty("label");
    });
  });

  it('should have AL mapping to lodging', () => {
    const al = paymentData.productTypeFilter.find(p => p.id === "AL");
    expect(al.value).toBe("lodging");
    expect(al.label).toBe("Accommodation");
  });
});

describe("orderStatusList", () => {
  it("should map all expected statuses", () => {
    expect(orderStatusList.open).toBe("Open");
    expect(orderStatusList.confirmed).toBe("Confirmed");
    expect(orderStatusList.accepted).toBe("Accepted");
    expect(orderStatusList.rejected).toBe("Rejected");
    expect(orderStatusList.autorized).toBe("Autorized");
    expect(orderStatusList.close).toBe("Close");
    expect(orderStatusList.closed).toBe("Closed");
    expect(orderStatusList.pending).toBe("Pending");
    expect(orderStatusList.cancel).toBe("Cancel");
    expect(orderStatusList.cm).toBe("CM");
  });

  it("should have exactly 10 statuses", () => {
    expect(Object.keys(orderStatusList)).toHaveLength(10);
  });

  it("should not have undefined values", () => {
    Object.values(orderStatusList).forEach(value => {
      expect(value).toBeDefined();
      expect(typeof value).toBe("string");
    });
  });
});
