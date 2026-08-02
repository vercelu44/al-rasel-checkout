import CheckoutFlow from "./components/CheckoutFlow";



export default function CheckoutPaymentPage({ params }) {

  return (
    <div className="container mx-auto py-10">
      <CheckoutFlow orderId={params.id} />
    </div>
  );
}