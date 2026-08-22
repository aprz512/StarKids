// Next.js 15 instrumentation: 服务器端错误日志
// onRequestError 捕获 RSC 渲染/路由处理/Server Action/中间件中的未处理错误,
// 生产环境客户端只显示 digest, 完整错误在这里输出到 stdout (docker logs 可见)。

type RequestErrorContext = {
  routerKind: string
  routePath: string
  routeType: string
  renderSource?: string
  revalidateReason?: string
}

export function register() {
  // 无需启动钩子
}

export function onRequestError(
  error: unknown,
  request: { path: string; method: string; headers: NodeJS.Dict<string | string[]> },
  context: RequestErrorContext
) {
  const err = error as Error & { digest?: string; cause?: unknown }
  console.error(
    `[RequestError] ${request.method} ${request.path} | route=${context.routePath} type=${context.routeType} source=${context.renderSource ?? "-"} digest=${err.digest ?? "-"}`
  )
  console.error(err.stack || err.message || String(error))
}
