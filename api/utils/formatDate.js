export function formatDate(dateString) {
  const date = new Date(dateString);
  return date
    .toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");
}
