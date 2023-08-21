import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Heading,
    Link,
    Modal,
    ModalBody,
} from "@chakra-ui/react";

import usexlmStore from "../../store/xlm-wallet";

const DiscountModal = (props) => {
    const xlmPaymentState = usexlmStore((state) => state.xlmPaymentState);

    if (!xlmPaymentState.post.success.ok) {
        return null;
    }
    return (
        <>
            <Modal isOpen>
                <ModalBody>
                    <Alert
                        status={"success"}
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
                            Thank you for paying with XLM. Your Transaction is confirmed. Your
                            TX has been saved. Please find your one-time discount code below.{" "}
                            <Link
                                color="teal"
                                target="_blank"
                                href={`${process.env.REACT_APP_XLM_TRANSACTION_REFFERENCE
                                    }transactions/${""}`}
                            >
                                Check Transaction Refference here
                            </Link>
                            <Heading>xlm-shop-1xhheu</Heading>
                        </AlertDescription>
                    </Alert>
                </ModalBody>
            </Modal>
        </>
    );
};

export default DiscountModal;
