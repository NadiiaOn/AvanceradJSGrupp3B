// The main file for the Nadiia module, which exports all the campaign functions.
import { CampaignIerarchy } from "./DiscountCampaigns.js";

const CART_KEY = "cart";

export function getCart() {
  let cartItems = [];
  try {
    cartItems = JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
  } catch {
    cartItems = [];
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return { cartItems, totalPrice };
}

export async function getDiscountedTotal() {
  const res = await fetch('/api/campaigns/current');
  const { cartItems, totalPrice } = getCart();
  if (!res.ok) return totalPrice; 

  const campaign = CampaignIerarchy(await res.json());

  return campaign.calculateDiscountedPriceForCart(cartItems, totalPrice);
}

export default class rabattModule {
  static descriptor = {
    name: "RabattModule",
    methodsAndInputs: [
      {
        method: "productsFromDb",
        input: ["productsFromDB - an array of products from the db"],
        output:
          "an array of Product instances with getters for price formatting",
      },
    ],
  };

  makeInstances(productsFromDB) {
    return productsFromDB.map((x) => new Product(x));
  }
}

/*
export default class DiscountCampaignsModule {

  static descriptor = {
    name: "DiscountCampaigns",
    methodsAndInputs: [
      {
        method: 'calculateDiscountedPriceForCart',
        input: ['cartItems, totalPrice'],
        output: 'discountedTotalPrice, totalPrice'
      }
    ],
   
  };
  

}
  */
  /*
    // description of the form needed to for user registration
    userRegForm: {
      firstName: {
        label: 'Förnamn',
        type: 'text',
        initialValue: '',
        required: true
      },
      lastName: {
        label: 'Efternamn',
        type: 'text',
        initialValue: '',
        required: true
      },
      email: {
        label: 'E-post',
        type: 'email',
        initialValue: '',
        required: true
      }
    }
  };

  createMailLink({ firstName, lastName, email }) {
    return <a href={"mailto:" + email}>{firstName} {lastName}</a>;
  }

}
  */
