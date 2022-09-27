import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Heading,
  Link,
} from "@chakra-ui/react";

import useHABRStore from "../../store/hbar";

const DiscountModal = (props) => {
  const hbarPaymentState = useHABRStore((state) => state.hbarPaymentState);

  console.log(hbarPaymentState.post.success.data.transactionId);
  var abc = hbarPaymentState.post.success.data.transactionId;
  var def = abc.replace(/[^\d+]/g, '-');
  var xyz = def.replace('-', '.');
  var qwe = xyz.replace('-', '.');
  console.log(qwe);


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
          May be issue with the transaction or Transaction rejected.{" "}
         Please try agian
        </AlertDescription>
      </Alert>
    </>
    )
  } else {
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
            Thank you for paying with HBAR. Your Transaction is confirmed. Your TX
            has been saved. Please find your one-time discount code below.{" "}
            <Link
            color="teal"
            target="_blank"
            href={`${process.env.REACT_APP_HBAR_TRANSACTION_REFFERENCE}transaction/${qwe}`}
          >
            Check Transaction Refference here
          </Link>
            <Heading>Qu-2022-eefFII</Heading>
          </AlertDescription>
        </Alert>
      </>
    );
  }
  
};

export default DiscountModal;
