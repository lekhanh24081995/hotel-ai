export type FetchArgs = [string | URL, RequestInit | undefined];

export type FetchInterceptor = typeof fetchInterceptor;

export type FetchInterceptorDefaultOptions = {
  fetch?: ReturnType<FetchInterceptor>;
  baseUrl?: string | URL;
  headers?: HeadersInit;
  interceptors?: {
    request?: (
      requestArgs: FetchArgs,
      fetch: NonNullable<FetchInterceptorDefaultOptions['fetch']>
    ) => Promise<FetchArgs>;

    response?: (
      response: Response,
      requestArgs: FetchArgs,
      fetch: NonNullable<FetchInterceptorDefaultOptions['fetch']>
    ) => Promise<Response>;
  };
};

const applyDefaultOptions = (
  [input, requestInit]: FetchArgs,
  defaultOptions?: FetchInterceptorDefaultOptions
): FetchArgs => {
  const headers = new Headers(defaultOptions?.headers);
  new Headers(requestInit?.headers).forEach((value, key) => {
    headers.set(key, value);
  });

  let inputToReturn: FetchArgs[0] = input;

  const isRelativeUrl =
    !(input instanceof URL) && !/^(?:[a-z]+:)?\/\//i.test(input);
  if (isRelativeUrl && defaultOptions?.baseUrl) {
    inputToReturn = `${defaultOptions.baseUrl}${input}`;
  }

  return [
    inputToReturn,
    {
      ...requestInit,
      headers
    }
  ];
};

// To handle Request object we need to read body as ArrayBuffer.
// If you have a better way, please let me know.
const mergeRequestObjectWithRequestInit = (
  request: Request,
  requestInit?: RequestInit
): Promise<RequestInit> => {
  const mergedRequest = new Request(request, requestInit);
  return new Response(mergedRequest.body).arrayBuffer().then((body) => ({
    method: mergedRequest.method,
    headers: mergedRequest.headers,
    body: body,
    referrer: mergedRequest.referrer,
    referrerPolicy: mergedRequest.referrerPolicy,
    mode: mergedRequest.mode,
    credentials: mergedRequest.credentials,
    cache: mergedRequest.cache,
    redirect: mergedRequest.redirect,
    integrity: mergedRequest.integrity,
    keepalive: mergedRequest.keepalive,
    signal: mergedRequest.signal,
    window: requestInit?.window
  }));
};

const normalizeArgs = async (
  ...args: Parameters<typeof fetch>
): Promise<FetchArgs> => {
  let input: string | URL;
  let requestInit: RequestInit | undefined;
  if (args[0] instanceof Request) {
    input = args[0].url;
    requestInit = await mergeRequestObjectWithRequestInit(args[0], args[1]);
  } else {
    input = args[0];
    requestInit = args[1];
  }

  return [input, requestInit];
};

const fetchInterceptor =
  (defaultOptions?: FetchInterceptorDefaultOptions) =>
  async (...args: Parameters<typeof fetch>): Promise<Response> => {
    const defaultOptionAppliedArgs = applyDefaultOptions(
      await normalizeArgs(...args),
      defaultOptions
    );

    // apply request interceptor
    const fetchProvided = defaultOptions?.fetch || fetch;
    let requestInterceptorAppliedArgs: FetchArgs;
    if (defaultOptions?.interceptors?.request) {
      requestInterceptorAppliedArgs =
        await defaultOptions?.interceptors?.request?.(
          defaultOptionAppliedArgs,
          fetchProvided
        );
    } else {
      requestInterceptorAppliedArgs = defaultOptionAppliedArgs;
    }

    // ajax call
    const response = await fetchProvided(...requestInterceptorAppliedArgs);

    // apply response interceptor
    return (
      defaultOptions?.interceptors?.response?.(
        response,
        requestInterceptorAppliedArgs,
        fetchProvided
      ) || response
    );
  };

export default fetchInterceptor;
