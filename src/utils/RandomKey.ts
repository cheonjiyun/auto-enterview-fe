export const RandomJobPostingKey = () => {
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += Math.floor(Math.random() * 16).toString(16);
  }
  return result;
};
