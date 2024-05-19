import type { 
    MiddlewaresConfig,
  } from "@medusajs/medusa"
  import { 
    urlencoded,
  } from "body-parser"
  
  export const config: MiddlewaresConfig = {
    routes: [
      {
        matcher: "/payhere/*",
        middlewares: [
          urlencoded({ extended: true }),
        ],
      },
    ],
  }