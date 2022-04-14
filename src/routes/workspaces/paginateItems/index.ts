const getEmptyPage = () => {
  return {
    items: [],
    start: 0,
    limit: 0,
    size: 0,
    total: 0,
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

  if (total < 0) throw Error("Bad request, pagination data is not valid");

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

export const formatPaginationParams = async (limit: any, start: any) => {
  if (typeof limit === "string") {
    limit = parseInt(limit) as StoplightComponents["parameters"]["limit"];
  }

  if (typeof start === "string") {
    start = parseInt(start) as StoplightComponents["parameters"]["start"];
  }

  if (start < 0 || limit < 0) {
    throw Error("Bad request, pagination data is not valid");
  }
  return { formattedLimit: limit, formattedStart: start };
};

export const formatCount = (count: any[]): number => {
  return parseInt(count.map((el: any) => el["COUNT(*)"])[0]);
};