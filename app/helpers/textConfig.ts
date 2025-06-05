const truncate = (text: string, max: number) => {
  if (text) {
    if (text.length > max) return `${text.substring(0, max)}...`;
    return text;
  }
};

export { truncate };
