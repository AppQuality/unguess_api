type PaginationParams = {
  items: Array<any>;
  limit?: StoplightComponents["parameters"]["limit"] | string;
  start?: StoplightComponents["parameters"]["start"] | string;
  total: number;
};

export const paginateItems = async (data: PaginationParams) => {
  let { items, limit, start, total } = data;

  if (typeof total === "string") {
    total = parseInt(total);
  }

  return items.length
    ? {
        items,
        start,
        limit,
        size: items.length,
        total,
      }
    : emptyPaginatedResponse();
};

export const formatCount = (count: any[]): number => {
  return parseInt(count.map((el: any) => el["count"])[0]);
};

export const emptyPaginatedResponse = () => {
  return {
    items: [],
    start: 0,
    limit: 0,
    size: 0,
    total: 0,
  };
};
