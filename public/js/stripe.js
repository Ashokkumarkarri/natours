import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51Qsg01Qj04cDBWQUuIpDWjFACdjUtqkrB167In396ZV5odIpH0yfUhT1BYK15UZkcVwddQ0aWEKzAB4ohFiHA52600Cslk1LDv',
);

export const bookTour = async (tourId) => {
  try {
    //1) GET checkout session from API

    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    //2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch {
    console.log(err);
    showAlert('error', err);
  }
};
