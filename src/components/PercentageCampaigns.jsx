import { useOutletContext, useParams } from "react-router";

const MIN_DISCOUNT = 10;

export default function PercentageCampaigns() {
  const { id } = useParams();
  const { products } = useOutletContext();

  const product = products.find((product) => product.id === Number(id));

  if (!product) return null;

  const discount = Number(product.discountPercentage);

  if (Number.isNaN(discount) || discount < MIN_DISCOUNT) return null;
  return (
    <section className="bg-olive flex justify-center text-heading text-2xl text-white">
      Discount {discount} %
    </section>
  );
}
