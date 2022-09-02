export const getRandomUsers = (count=1) =>
  fetch(`https://randomuser.me/api/?nat=US&results=${count}`).then((r) => r.json());





 

