interface FetchListResult<T> {
  status_code: number;
  message: string;
  data: {
    items: T;
    pagination: {
      total: number;
      limit: number;
      offset: number;
    };
    link: {
      self: string;
      next: string;
      last: string;
    };
  };
}

interface FetchResult<T = any> {
  status_code: number;
  message: string;
  data: T;
}

interface DecodedToken {
  user: string;
  exp: number;
  iat: number;
}
