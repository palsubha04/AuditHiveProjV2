export default function formatString(input) {
  if (!input) return '';

  // Replace underscores with spaces and convert to lowercase
  const formatted = input.replace(/_/g, ' ').toLowerCase();

  // Capitalize the first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}