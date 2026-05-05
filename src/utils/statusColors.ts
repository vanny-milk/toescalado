export const statusColors = {
  confirmed: {
    bg: "bg-green-500/20",
    text: "text-green-500",
    border: "border-green-500/50",
    label: "Confirmado",
  },
  pending: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-500",
    border: "border-yellow-500/50",
    label: "A Confirmar",
  },
  unavailable: {
    bg: "bg-red-500/20",
    text: "text-red-500",
    border: "border-red-500/50",
    label: "Indisponível",
  },
} as const;

export type StatusType = keyof typeof statusColors;
