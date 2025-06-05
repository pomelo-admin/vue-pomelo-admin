// 定义请求参数类型
export interface RequestParams {
  query: Record<string, any>;
  body: Record<string, any>;
  params: Record<string, any>;
  headers: Record<string, any>;
}
