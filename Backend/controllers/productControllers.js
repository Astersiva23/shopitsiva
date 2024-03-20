import catchAysncErrors from "../middlewares/catchAysncErrors.js";
import Product from "../models/product.js";
import APIFilters from "../utils/apiFilters.js";
import errorHandler from "../utils/errorHandler.js";

// here we create new products  => /api/vi/products
export const getProducts = catchAysncErrors(async (req, res) => {
const resPerPage = 4
const apiFilters = new APIFilters(Product,req.query).search().filters();// here we use the search products fucntion.

console.log("reg.user",req?.user);

let products = await apiFilters.query
let filteredProductscount = products.length

apiFilters.pagination(resPerPage);  
products = await apiFilters.query.clone();

    res.status(200).json({
        filteredProductscount,
        resPerPage,
        products,
    });
});

// here we create new products  => /api/vi/admin/products
export const newProducts = catchAysncErrors( async (req, res) => {

req.body.user =  req.user._id

   const product = await Product.create(req.body)
   res.status(200).json({
    product,
   });
});

// here we add get single product function =>/api/v1/products/:id
export const getProductDetails =  catchAysncErrors(async (req, res,next) => {
    const product = await Product.findById(req?.params?.id);
if(!product)
{
    return next(new errorHandler('product not found',404));    // next is a inbuilt middleware that is pereesented inn express it gives next middleware from the stack
}
    res.status(200).json({
     product,
    });
 });

 // iam here to update our product details with the same path  =>/api/v1/products/:id

 export const updateProductDetails = catchAysncErrors (async (req, res) => {
 let product = await Product.findById(req?.params?.id);
if(!product)
{
    console.log("Product not found");
    return res.status(404).json({
        error:"Product not found",
    });
}

product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {new:true})  // new:true means it returns doc of products
    res.status(200).json({
     product,
    });
 });


 export const deleteProductDetails = catchAysncErrors( async (req, res) => {
    const product = await Product.findById(req?.params?.id);
   if(!product)      // find product by id and if no means error shown
   {
       console.log("Product not found");
       return res.status(404).json({
           error:"Product not found",
       });
   }
   await product.deleteOne(); // here we detele the product 
       res.status(200).json({
        message: "Product deleted successfully", // pass the message if the product deleted .
       });
    });