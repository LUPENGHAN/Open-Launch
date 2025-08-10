import type { NextConfig } from "next"

import createMDX from "@next/mdx"
import remarkGfm from "remark-gfm"

// 安全提取 UploadThing 主机名
const uploadthingHost = (() => {
  const v = process.env.NEXT_PUBLIC_UPLOADTHING_URL
  if (!v) return undefined
  try {
    return v.includes("://") ? new URL(v).hostname : v
  } catch {
    return undefined
  }
})()

// 先构造一个可变数组，显式声明元素结构，避免 TS 报错
const remotePatterns: Array<{
  protocol: "http" | "https"
  hostname: string
  pathname?: string
  port?: string
}> = [
  { protocol: "https", hostname: "yt3.googleusercontent.com" },
  { protocol: "https", hostname: "yt3.ggpht.com" },
  { protocol: "https", hostname: "avatars.githubusercontent.com" },
  { protocol: "https", hostname: "lh3.googleusercontent.com" },
  { protocol: "https", hostname: "designmodo.com" },
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "nexty.dev" },
  // 你的 ufs.sh 源
  { protocol: "https", hostname: "yxucdfr9f5.ufs.sh", pathname: "/f/**" },
]

// 按条件追加 UploadThing host
if (uploadthingHost) {
  remotePatterns.push({ protocol: "https", hostname: uploadthingHost })
}

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns,
    // 开发期如果还碰到零散域名，也可以临时：
    // unoptimized: true,
  },
}

const withMDX = createMDX({ options: { remarkPlugins: [remarkGfm] } })
export default withMDX(nextConfig)
