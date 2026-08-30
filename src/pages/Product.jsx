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
        <div>
            <div className="REA"> </div>
            <div className="navbar"> </div>
            <div className="products-categories"> </div>
            <div className="product-container">
                {products.filter((product) => product.id === 1)
                    .map((product) => (
                        <div key={product.id} className="product-card">
                        <img src={product.images} alt={product.name} />  
                        <p className="product-brand">Brand: {product.brand}</p>    
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">Price: ${product.price}</p>
                        <p className="product-delivery">Delivery: {product.shippingInformation}</p>
                        <p className="product-discount">Discount: ${product.discount}</p>
                        <p className="product-stock" hidden>Stock: {product.stock}</p> 
                        <p className="product-availability-status" >Availability: {product.availabilityStatus}</p>
                        <p className="product-rating">Rating: {product.rating}</p>
                        <p className="product-return-policy">Return Policy: {product.returnPolicy}</p>
                            
                    </div>
                ))}
            </div>
            <button>Add to cart</button>
            <button onClick={openModal}>Buy</button>
            {isOpen && (
                <div className="cart-container">
                    <div className="cart">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                    </div>
                </div>
            )}
        
            <button>Favorites</button> 
            <div className="bye-together">
                <h4>Products related to this item</h4>
                {products.filter((product) => product.category === "beauty")
                    .slice(0, 4) // Limit to 4 products
                    .map((product) => (
                        <div key={product.id} className="product-card">
                        <img src={product.images} alt={product.name} />  
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-price">Price: ${product.price}</p>
                        <p className="product-delivery">Delivery: {product.shippingInformation}</p>
                        <p className="product-rating">Rating: {product.rating}</p>
                    </div>
                ))}
            </div>
            <div className="footer"> </div>
        </div>
    );
}


