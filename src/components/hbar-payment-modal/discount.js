import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Heading,
  Link,
} from "@chakra-ui/react";

import useHABRStore from "../../store/hbar";
import useCouponsStore from "../../store/coupons";
import { useContext, useEffect } from "react";
import { ShopContext } from "../../context";

const DiscountModal = (props) => {
  const hbarPaymentState = useHABRStore((state) => state.hbarPaymentState);
  const { couponState, postCouponsAction } = useCouponsStore((state) => state);
  const shop = useContext(ShopContext);
  var abc = hbarPaymentState.post.success.data.transactionId;
  var def = abc.replace(/[^\d+]/g, "-");
  var xyz = def.replace("-", ".");
  var qwe = xyz.replace("-", ".");
  console.log(qwe);

  useEffect(() => {
    postCouponsAction({ shop }); //
  }, []);

  if (!hbarPaymentState.post.success.data) {
    return (
      <>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="300px"
          rounded="md"
          boxShadow="2xl"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Sorry!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            May be issue with the transaction or Transaction rejected. Please
            try agian
          </AlertDescription>
        </Alert>
      </>
    );
  } else {
    if (couponState?.get?.success?.data) {
      return (
        <>
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="300px"
            rounded="md"
            boxShadow="2xl"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Here is your discount code!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Thank you for paying with HBAR. Your Transaction is confirmed.
              Your TX has been saved. Please find your one-time discount code
              below.{" "}
              <Link
                color="teal"
                target="_blank"
                href={`${process.env.REACT_APP_HBAR_TRANSACTION_REFFERENCE}transaction/${qwe}`}
              >
                Check Transaction Refference here
              </Link>
              <Heading>
                {couponState?.get?.success?.data?.discount?.code}
              </Heading>
            </AlertDescription>
          </Alert>
        </>
      );
    }
  }
};

export default DiscountModal;
