export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool';
  content: string;
  id: string;
  name?: string;
  display?: {
    name: string;
    props: Record<string, any>;
  };
};

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;

export interface Session {
  user: IUser & {
    id: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  access_token: string;
}

export interface AuthResult {
  type: string;
  message: string;
}
