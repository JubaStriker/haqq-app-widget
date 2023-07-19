import { useEffect, useState, useContext } from "react";
import {
    Box,
    Text,
    Button,
    useDisclosure,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    Input,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Image,
    Heading,
    Grid,
    GridItem,
    Center,
    Spinner,
    useToast,
    Link,
} from "@chakra-ui/react";
import useXRPStore from "../../store/xrpl";
import useCouponsStore from "../../store/coupons";
import DiscountModal from "./discount";
import { ShopContext } from "../../context";
import useXummStore from "../../store/xumm";

const XrpModal = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDiscountCodeModalOpen,
        onOpen: onDiscountCodeModalOpen,
        onClose: onDiscountCodeModalClose,
    } = useDisclosure();

    const [buyerAddress, setBuyerAddress] = useState("");

    // const [code, setCode] = useState("");
    var code;

    // var buyerAddress;


    const shop = useContext(ShopContext);
    const xrpPaymentState = useXRPStore((state) => state.xrpPaymentState);
    const postXRPpayment = useXRPStore((state) => state.postXRPpayment);
    const { getXummPaymentPromptAction, xummState, verifyXummPayment } = useXummStore(
        (state) => state
    );
    const { getCouponAction, couponState, postCouponAction } = useCouponsStore((state) => state);
    const resetXRPPaymentState = useXRPStore(
        (state) => state.resetXRPPaymentState
    );
    const toast = useToast();



    const onModalClose = () => {
        resetXRPPaymentState();
        onClose();
    };

    const onDiscountModalClose = () => {
        console.log('onDiscountModalClose', code, buyerAddress)

        postCouponAction(code, buyerAddress)

        onDiscountCodeModalClose();
    };

    const onPayClick = async ({ lookId }) => {
        try {
            onOpen();
            const data = await getXummPaymentPromptAction({ lookId, shop });
            const client = new WebSocket(data.status);

            client.onopen = () => {
                console.log("Connected.....");
            };

            client.onmessage = async (e) => {
                // console.log(e);
                const newObj = await JSON.parse(e.data);
                // console.log(e.data, newObj);
                // console.log(newObj.txid);
                const txid = await newObj.txid;
                // console.log(txid);
                if (txid !== undefined) {
                    const res = await verifyXummPayment({ txid });
                    setBuyerAddress(res.result.Account)
                    // buyerAddress = res.result.Account
                    onModalClose();
                    getCouponAction({ txid, shop, lookId });
                    onDiscountCodeModalOpen();
                }
            };
        } catch (e) {
            toast({
                title: "Something went wrong. Please retry again.",
                status: "error",
                isClosable: true,
            });
            onClose();
        }
    };

    const renderPaymentStatus = () => {
        if (xummState.get.loading) {
            // return <SkeletonText mt="4" noOfLines={4} spacing="4" />;
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
        } else if (xummState.get.failure.error) {
            return (
                <>
                    {/* <Text>Your XRP Address</Text>
          <Input
            placeholder="XRP address "
            size="md"
            onChange={(e) => {
              setBuyyerAddress(e.target.value);
            }}
          />
          <Button colorScheme="blue" onClick={submitHandler} mt={3} isFullWidth>
            Pay
          </Button> */}
                    <Alert status="error">
                        <AlertIcon />
                        <Heading>Something went wrong!</Heading>
                    </Alert>
                    <Text>{xummState.get.failure.message}</Text>
                </>
            );
        } else if (xummState.get.success.ok) {
            return (
                <Box p={10}>
                    <Grid gap={6}>
                        <GridItem>
                            <Heading size="xl" fontWeight="bold" textAlign="center">
                                {props.lookName}
                            </Heading>
                            <Text size="lg" textAlign="center">
                                {props.lookXrpPrice ? props.lookXrpPrice : "0"} XRP
                            </Text>
                        </GridItem>
                        <GridItem alignContent={"center"}>
                            <Center width={"100%"}>
                                <Image
                                    border={"2px"}
                                    src={xummState.get.success?.data?.qr}
                                    width="200px"
                                />
                            </Center>
                        </GridItem>
                        <GridItem>
                            <Center>
                                <Text>
                                    Please scan the QR code with XUMM on your smartphone.
                                </Text>
                            </Center>
                        </GridItem>
                    </Grid>
                </Box>
            );
        }
    };

    const renderDiscountCode = () => {
        // console.log(couponState.get);

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
            // console.log(couponData);
            // setCode(couponData?.discount?.code)
            code = couponData?.discount?.code;
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
                        Thank you for paying with XRP. Your Transaction is confirmed. Your
                        TX has been saved. Please find your one-time discount code below.{" "}
                        <Link
                            color="teal"
                            target="_blank"
                            href={`${process.env.REACT_APP_XRP_TRANSACTION_REFFERENCE}transactions/${couponData?.tx?.result.hash}`}
                        >
                            Check Transaction Refference here
                        </Link>
                        <Heading>{couponData.discount?.code}</Heading>
                    </AlertDescription>
                </Alert>
            );
        }
        return null;
    };

    return (
        <>
            <Button
                onClick={() =>
                    onPayClick({
                        lookId: props.lookId,
                    })
                }
                isFullWidth
            >
                Pay {props.lookXrpPrice ? props.lookXrpPrice : "0"} XRP to get 100% off
            </Button>

            <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader colorScheme="blue.500">Open Xumm App</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>{renderPaymentStatus()}</ModalBody>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isDiscountCodeModalOpen}
                onClose={onDiscountModalClose}
                size="xl"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader colorScheme="blue.500">Discount</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>{renderDiscountCode()}</ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default XrpModal;
