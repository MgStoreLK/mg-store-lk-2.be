import {
  MedusaRequest,
  MedusaResponse,
  ProductCategoryService
} from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
const url = require('url');

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const parsedUrl = url.parse(req.url, true);
  const {
      offset,
      limit,
      parent_category_id } = parsedUrl?.query;

    if (!offset || !limit) {
      throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Invalid Query"
        )
    }
  const productCategoryService : ProductCategoryService = req.scope.resolve("productCategoryService")
  try{
      const result = await productCategoryService
        .listAndCount(
          { parent_category_id: parent_category_id? parent_category_id:null },
           { skip: Number(offset), take: Number(limit), order: {'name': 'ASC'}, relations: ["category_children"] })
        .then(result =>({product_categories: result[0], count: result[1]}))
      res.send(result);
  }catch(e){
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "Server Error")
  }
}