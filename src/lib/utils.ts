export const isHexColor = (color: string) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const isTailwindColor = (color: string) => {
  return /^bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuscia|pink|rose)-(100|200|300|400|500|600|700|800|900)$/.test(
    color
  );
};
