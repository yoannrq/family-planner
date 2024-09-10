const randomizer = {
  id: () => {
    return Math.floor(Math.random() * 9) + 1;
  },

  name: () => {
    return (Math.random() + 1).toString(36).substring(7);
  },
};

export default randomizer;
