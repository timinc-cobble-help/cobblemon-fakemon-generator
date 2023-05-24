export function camelCase(str) {
  return str.replace(/-([a-z])/g, (matchedLetter) =>
    matchedLetter[1].toUpperCase()
  );
}

export function capitalize(str) {
  return (
    str[0].toUpperCase() +
    str
      .slice(1)
      .replace(
        /-([a-z])/g,
        (matchedLetter) => " " + matchedLetter[1].toUpperCase()
      )
  );
}
