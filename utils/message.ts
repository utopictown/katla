export function getCongratulationMessage(attempt: number, totalPlay: number) {
  if (totalPlay === 0 && attempt === 0) {
    return "Kontlo";
  }

  switch (attempt) {
    case 0:
      return "Kontlo";
    case 1:
      return "Kontlo";
    case 2:
      return "Kontlo";
    case 3:
      return "Kontlo";
    case 4:
      return "Kontlo";
    default:
      return "Kontlo!!";
  }
}
