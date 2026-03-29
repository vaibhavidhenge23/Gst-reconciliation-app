// GST calculation engine

// Calculate GST
// interstate = true → IGST, false → CGST + SGST
export function calculateGST(amount, rate, interstate = false) {
  const gstAmount = (amount * rate) / 100;
  return {
    baseAmount: amount,
    gstRate: rate,
    gstAmount,
    cgst: interstate ? 0 : gstAmount / 2,
    sgst: interstate ? 0 : gstAmount / 2,
    igst: interstate ? gstAmount : 0,
    total: amount + gstAmount,
  };
}

// Reconcile Purchase vs Sales
export function reconcileGST(purchaseGST, salesGST) {
  const payable = salesGST - purchaseGST;
  return {
    purchaseGST,
    salesGST,
    gstPayable: payable > 0 ? payable : 0,
    itcAvailable: payable < 0 ? Math.abs(payable) : 0,
    mismatch: Math.abs(salesGST - purchaseGST) > 1000, // ₹1000+ diff = mismatch
  };
}

// Filing deadlines
export function getFilingDeadlines(month, year) {
  return [
    { form: "GSTR-1",  dueDate: new Date(year, month, 11), desc: "Sales return" },
    { form: "GSTR-3B", dueDate: new Date(year, month, 20), desc: "Monthly summary" },
  ];
}
