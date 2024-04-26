import { Base } from "../types/base";

export const getBaseColor = (base: Base) => {
  switch (base.Aspects[0]) {
    case "Vigilance":
      return "#3b82f6";
    case "Command":
      return "#16a34a";
    case "Aggression":
      return "#b91c1c";
    case "Cunning":
      return "#eab308";
    default:
      return "white";
  }
};
