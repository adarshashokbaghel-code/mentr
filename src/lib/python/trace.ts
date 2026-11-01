/** A value in a live-py-tutor trace. Compound objects usually appear as ["REF", id]. */
export type Encoded =
  | null
  | boolean
  | number
  | string
  | Encoded[]
  | { [key: string]: Encoded };

export type StackFrame = {
  func_name: string;
  is_highlighted?: boolean;
  is_zombie?: boolean;
  frame_id: number;
  encoded_locals?: Record<string, Encoded>;
  ordered_varnames?: string[];
};

export type TraceStep = {
  line?: number;
  event?: string;
  func_name?: string;
  globals?: Record<string, Encoded>;
  ordered_globals?: string[];
  stack_to_render?: StackFrame[];
  heap?: Record<string, Encoded>;
  stdout?: string;
  exception_msg?: string;
};

export type TutorResult = {
  code: string;
  trace: TraceStep[];
};
