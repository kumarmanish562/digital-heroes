export function money(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function dateTime(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export function dateOnly(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    dateStyle: "medium"
  });
}
