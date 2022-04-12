const getEmptyPage = () => {
  return {
    items: [],
    total: 0,
    limit: 0,
    start: 0,
    size: 0,
  };
};

type Pagination = {
  items: any[];
  limit?: any;
  start?: any;
  total?: any;
};

export default async (data: Pagination) => {
  let { items, limit, start, total } = data;

  if (typeof limit === "string") {
    limit = parseInt(limit);
  }

  if (typeof start === "string") {
    start = parseInt(start);
  }

  if (start < 0 || limit < 0) {
    throw Error("Bad request, pagination data is not valid");
  }

  return items.length
    ? {
        items,
        start,
        limit,
        size: items.length,
        total,
      }
    : getEmptyPage();
};
