import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Heading,
  Link,
  Box,
  Spinner,
  Text,
} from "@chakra-ui/react";

import useHABRStore from "../../store/hbar";
import useCouponsStore from "../../store/coupons";
import { useContext, useEffect } from "react";
import { ShopContext } from "../../context";

const DiscountModal = (props) => {
  const { couponState, getCouponAction } = useCouponsStore((state) => state);
  const shop = useContext(ShopContext);
  // var abc = hbarPaymentState.post.success.data.transactionId;
  // var def = abc.replace(/[^\d+]/g, "-");
  // var xyz = def.replace("-", ".");
  // var qwe = xyz.replace("-", ".");
  // console.log(qwe);

  useEffect(() => {
    getCouponAction({ shop, lookId: props.lookId, txid: props.lookId }); //
  }, []);

  if (couponState.get.loading) {
    return (
      <>
        <Box minH={"100px"} width="20%" m="auto" p={5}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          ;
        </Box>
      </>
    );
  } else if (couponState.get.failure.error) {
    return (
      <>
        <Alert status="error">
          <AlertIcon />
          <Heading>Something went wrong!</Heading>
        </Alert>
        <Text>
          It looks like your payment is complete but our store failed to
          generate a coupon for you. Please contact store support before
          reinitaing payment.
        </Text>
        <Text>{couponState.get.failure.message}</Text>
      </>
    );
  } else if (couponState.get.success.ok) {
    const { data: couponData } = couponState.get.success;
    return (
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
          Thank you for paying with HBAR. Your Transaction is confirmed. Your TX
          has been saved. Please find your one-time discount code below.{" "}
          <Link
            color="teal"
            target="_blank"
            href={`${process.env.REACT_APP_HBAR_TRANSACTION_REFFERENCE}/${props.txid}`}
          >
            Check Transaction Refference here
          </Link>
          <Heading>{couponData.discount?.code}</Heading>
        </AlertDescription>
      </Alert>
    );
  } else {
    return null;
  }
};

export default DiscountModal;
