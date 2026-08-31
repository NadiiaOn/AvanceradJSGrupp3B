import { useState, useEffect } from "react";
import fetchProducts from "../api/fetchProducts";
//import CreateProductForm from "../components/CreateProductForm"; //ToDo: create product form component

export default function ProductPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const product = products.find((product) => product.id === product.id); 

    useEffect(() => {
        fetchProducts().then((data) => {
            setProducts(data);
        });
    }, []);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }


    return (
        <div className= "min-h-screen bg-bg text-text font-body text-[24px]">
            <div className="REA bg-olive flex justify-center text-heading text-[28px] font-semibold text-white"> REA</div>
            <div className="navbar flex justify-center text-text">Navbar</div>
            <div className="products-categories flex justify-center">Products Categories</div>
            <div className="product-container " >
                {products.filter((product) => product.id === 1)
                    .map((product) => (<div key={product.id} className="product-card flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden">
                            <div className="product-image w-full md:w-[60%] flex items-center justify-center p-6">
                                <img src={product.images} alt={product.title} />
                            </div>  
                            <div className="product-details w-full md:w-[40%] p-8 flex flex-col gap-3">
                        <p className="product-brand text-sm uppercase font-bold mb-10">Brand: {product.brand}</p>    
                        <h3 className="product-name font-heading text-4xl mb-10">{product.title}</h3>
                        <p className="product-description text-xl opacity-75 mb-6 ">{product.description}</p>
                        <p className="product-price font-heading text-2xl font-semibold mb-10">${product.price}</p>
                        <p className="product-delivery text-sm opacity-75 mb-2">Delivery: {product.shippingInformation}</p>
                        <p className="product-discount text-xl text-cta font-semibold mb-2">Discount: ${product.discount}</p>
                        <p className="product-stock text-sm" hidden>Stock: {product.stock}</p> 
                        <p className="product-availability-status text-sm opacity-75 mb-2" >Availability: {product.availabilityStatus}</p>
                        <div className="flex flex-row items-center gap-2"> <p className="product-rating text-sm w-full md:w-[40%] font-body" >Rating: {product.rating}</p>
                                <button className="all-reviews bg-cta gap-2 p-2 rounded-md text-[14px] text-text text-white text-sm w-full md:w-[60%]">All Reviews</button>
                        </div>
                        
                        <p className="product-return-policy text-sm opacity-75 mb-2">Return Policy: {product.returnPolicy}</p>
                            <button className="add-to-cart bg-cta gap-2 p-2 rounded-md text-white text-[20px] ">Add to cart</button>
                        <div className="flex flex-row ">
                            <button className="buy bg-cta gap-2 p-2 rounded-md text-white text-[20px] w-full md:w-[80%] ">Buy</button>
                            <button className="favorites bg-cta gap-2 p-2 rounded-md text-white text-[20px] w-full md:w-[15%] ml-10"></button> 
                        </div>
                       
                        </div>
                            
                    </div>
                ))}
            </div>
            
            
            <div className="bye-together">
                <h4 className="text-lg font-bold text-[28px] mb-4 mt-4 font-heading ">Products related to this item</h4>
                {products.filter((product) => product.category === "beauty")
                    .slice(0, 4) // Limit to 4 products
                    .map((product) => (
                        <div key={product.id} className="product-card">
                        <img src={product.images} alt={product.title} />  
                        <h3 className="product-name">{product.title}</h3>
                        <p className="product-price">Price: ${product.price}</p>
                        <p className="product-delivery">Delivery: {product.shippingInformation}</p>
                        <p className="product-rating">Rating: {product.rating}</p>
                    </div>
                ))}
            </div>
            <div className="reviews bg-card p-4 rounded-lg font-body text-[24px] text-text">
                <h4 className="text-lg font-bold text-[28px] mb-4 mt-4 font-heading ">Reviews</h4>
                {products.find((p) => p.id === 1)?.reviews.map((review, index) => (
                    <div key={index} className="review-card mb-4 p-4 bg-card rounded-lg">
                        <p className="reviewer-name">Reviewer: {review.reviewerName}</p>
                        <p className="reviewer-email">Reviewer Email: {review.reviewerEmail}</p>
                        <p className="review-comment">Comment: {review.comment}</p>
                            <p className="review-rating">Rating: {review.rating}</p>
                            <p className="review-date">Date: {new Date(review.date).toLocaleDateString('sv-SE')}</p>
                        </div>
                ))}
            </div>
            <div className="create-product-form"></div>
            <div className="footer bg-footer "> </div>
        </div>
    );
}


