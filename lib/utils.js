export const getList = (lists, name) => {
  return lists.filter(list => list.name === name)[0]
}
