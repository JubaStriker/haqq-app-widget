import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Heading,
    Link,
} from "@chakra-ui/react";

import useXRPStore from "../../store/xrpl";

const DiscountModal = (props) => {
    const xrpPaymentState = useXRPStore((state) => state.xrpPaymentState);

    console.log(xrpPaymentState.post.success.data);
    if (!xrpPaymentState.post.success.ok) {
        return null;
    }
    return (
        <>
            <Alert
                status={
                    xrpPaymentState.post.success.data.result?.meta?.TransactionResult ===
                        "tesSUCCESS"
                        ? "success"
                        : "error"
                }
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
                    Thank you for paying with XRP. Your Transaction is confirmed. Your TX
                    has been saved. Please find your one-time discount code below.{" "}
                    <Link
                        color="teal"
                        target="_blank"
                        href={`${process.env.REACT_APP_XRP_TRANSACTION_REFFERENCE}transactions/${xrpPaymentState.post.success.data.result?.hash}`}
                    >
                        Check Transaction Refference here
                    </Link>
                    <Heading>xrp-shop-1xhheu</Heading>
                </AlertDescription>
            </Alert>
        </>
    );
};

export default DiscountModal;
