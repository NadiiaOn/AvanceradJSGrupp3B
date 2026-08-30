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
            <div className="REA bg-olive flex justify-center text-heading text-[28px] font-semibold"> REA</div>
            <div className="navbar flex justify-center text-text">Navbar</div>
            <div className="products-categories flex justify-center">Products Categories</div>
            <div className="product-container " >
                {products.filter((product) => product.id === 1)
                    .map((product) => (<div key={product.id} className="product-card flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden">
                            <div className="product-image w-full md:w-[60%] flex items-center justify-center p-6">
                                <img src={product.images} alt={product.title} />
                            </div>  
                            <div className="product-details w-full md:w-[40%] p-8 flex flex-col gap-3">
                        <p className="product-brand text-sm uppercase font-semibold">Brand: {product.brand}</p>    
                        <h3 className="product-name font-heading text-2xl">{product.title}</h3>
                        <p className="product-description text-xl opacity-75">{product.description}</p>
                        <p className="product-price font-heading text-2xl font-semibold">${product.price}</p>
                        <p className="product-delivery text-sm opacity-75">Delivery: {product.shippingInformation}</p>
                        <p className="product-discount text-sm text-cta font-semibold">Discount: ${product.discount}</p>
                        <p className="product-stock text-sm" hidden>Stock: {product.stock}</p> 
                        <p className="product-availability-status text-sm opacity-75" >Availability: {product.availabilityStatus}</p>
                        <p className="product-rating text-sm" >Rating: {product.rating}</p>
                        <button className="all-reviews">All Reviews</button>
                        <p className="product-return-policy text-sm opacity-75">Return Policy: {product.returnPolicy}</p>
                        <button>Add to cart</button>
                        <button>Buy</button>
                        <button>Favorites</button> 
                        </div>
                            
                    </div>
                ))}
            </div>
            
            
            <div className="bye-together">
                <h4>Products related to this item</h4>
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
                <h4 className="text-lg font-semibold text-[20px] ">Reviews</h4>
                {products.filter((product) => product.id === 1)
                    .map((product) => (
                        <div key={product.id} className="review-card">
                            <p className="reviewer-name">Reviewer: {product.reviews[0].reviewerName}</p>
                            <p className="reviewer-email">Reviewer Email: {product.reviews[0].reviewerEmail}</p>
                            <p className="review-comment">Comment: {product.reviews[0].comment}</p>
                            <p className="review-rating">Rating: {product.reviews[0].rating}</p>
                            <p className="review-date">Date: {product.reviews[0].date}</p>
                        </div>
                ))}
            </div>
            <div className="create-product-form"></div>
            <div className="footer bg-footer "> </div>
        </div>
    );
}


