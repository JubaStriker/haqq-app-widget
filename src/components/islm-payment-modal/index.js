import { useState, useContext } from "react";
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
    Link
} from "@chakra-ui/react";
import useCouponsStore from "../../store/coupons";
import { ShopContext } from "../../context";
import { useSDK } from '@metamask/sdk-react';
import useISLMStore from "../../store/islm";


const IslmModal = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [account, setAccount] = useState();
    const {
        isOpen: isDiscountCodeModalOpen,
        onOpen: onDiscountCodeModalOpen,
        onClose: onDiscountCodeModalClose,
    } = useDisclosure();

    var code;
    const { sdk, provider } = useSDK();

    const connect = async () => {
        try {

            const accounts = await sdk.connect();
            setAccount(accounts?.[0]);

        } catch (err) {
            console.warn(`failed to connect..`, err);
        }
    };

    const addHaqqChain = () => {
        if (!provider) {
            throw new Error(`invalid ethereum provider`);
        }
        provider
            .request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "0xd3c3",
                        chainName: "Haqq TestEdge2",
                        blockExplorerUrls: ["https://explorer.testedge2.haqq.network/"],
                        nativeCurrency: { symbol: "ISLMT", decimals: 18 },
                        rpcUrls: ["https://rpc.eth.testedge2.haqq.network"],
                    },
                ],
            })
            .then((res) => {
                console.log("add", res)
                onClose()
            })
            .catch((e) => console.log("ADD ERR", e));
    };


    const shop = useContext(ShopContext);
    const { postIslmPayment, islmPaymentState } = useISLMStore(
        (state) => state
    );

    const { couponState, getCouponAction, storePaymentTxId } = useCouponsStore((state) => state);

    const toast = useToast();

    const onModalClose = () => {
        onClose();
    };

    const payment = async () => {
        const txid = await postIslmPayment({
            cryptoReceiver: props.cryptoReceiver,
            price: props.lookCryptoPrice,
            sender: account,
            provider
        })
        const lookId = props.lookId;
        if (txid) {
            storePaymentTxId(txid);
            getCouponAction({ txid, shop, lookId });
            onDiscountCodeModalOpen();
        } else {
            toast({
                title: "Something went wrong. Please retry again.",
                status: "error",
                isClosable: true,
            });
        }
    }

    const onDiscountModalClose = () => {
        onDiscountCodeModalClose();
    };

    const onPayClick = async () => {
        try {
            connect()
            onOpen();

        } catch (e) {
            console.log("Error: " + e.message);
            toast({
                title: "Something went wrong. Please retry again.",
                status: "error",
                isClosable: true,
            });
            onClose();
        }
    };

    const renderPaymentStatus = () => {
        if (islmPaymentState.post.loading) {
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
                    </Box>
                </>
            );
        } else if (islmPaymentState.post.failure.error) {
            return (
                <>
                    <Alert status="error">
                        <AlertIcon />
                        <Heading>Something went wrong!</Heading>
                    </Alert>
                    <Text>{islmPaymentState.post.failure.message}</Text>
                </>
            );
        } else if (true) {
            return (
                <Box p={10}>
                    <Grid gap={6} >
                        <GridItem >
                            {provider?.chainId === '0xd3c3' ? '' :
                                <>
                                    <Grid mb={'6'}>
                                        <GridItem>
                                            <Center fontSize={"large"} fontWeight={'semibold'}>
                                                <Text>
                                                    You are not connected to
                                                </Text>
                                                <Image src={"https://haqq.network/assets/media-kit/haqq-sign.png"} width="25px" height='25px' mx={'1'} />
                                                <Text>
                                                    HAQQ Network
                                                </Text>
                                            </Center>
                                        </GridItem>
                                    </Grid>
                                    <Button
                                        onClick={addHaqqChain}
                                        isFullWidth
                                        mb={'4'}
                                    >
                                        <Grid>
                                            <GridItem>
                                                <Center>
                                                    <Image src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/768px-MetaMask_Fox.svg.png"} width="25px" height='25px' mx={'1'} />
                                                    <Text>
                                                        Switch to HAQQ Network
                                                    </Text>
                                                </Center>
                                            </GridItem>
                                        </Grid>
                                    </Button>
                                </>
                            }



                            {provider?.chainId === '0xd3c3' ?
                                <>
                                    <Text size="sm" fontWeight="semibold" textAlign="center" mb={'6'}>
                                        Connected wallet: {' '}
                                        <Text as={'span'} fontSize="lg" fontWeight="bold" textAlign="center" mb={'6'}
                                        >

                                            {account?.slice(0, 4)}.....{account?.slice(35, 50)}
                                        </Text>
                                    </Text>

                                    <Button
                                        onClick={payment}
                                        isFullWidth
                                        mb={'4'}

                                    >
                                        <Grid>
                                            <GridItem>
                                                <Center>
                                                    <Text fontSize="lg" fontWeight="bold" textAlign="center">
                                                        Pay {props.lookCryptoPrice}
                                                    </Text>
                                                    <Image src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSynmlwrLwR-BROzDeRjTDlb3YsxqM6mcNwHFkMmBjflA&s"} width="25px" height='25px' mx={'1'} />
                                                    <Text fontSize="lg" fontWeight="bold" textAlign="center">
                                                        ISLM
                                                    </Text>
                                                </Center>
                                            </GridItem>
                                        </Grid>
                                    </Button>


                                    <Heading size="xl" fontWeight="bold" textAlign="center">
                                        {props.lookName}
                                    </Heading>
                                    <Text size="lg" textAlign="center">
                                        {props.lookCryptoPrice ? props.lookCryptoPrice : "0"} ISLM
                                    </Text>
                                </> : ''}
                        </GridItem>

                    </Grid>
                </Box>
            );
        }
    };

    const renderDiscountCode = () => {
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
                        re-initiating payment.
                    </Text>
                    <Text>{couponState.get.failure.message}</Text>
                </>
            );
        } else if (couponState.get.success.ok) {
            const { data: couponData } = couponState.get.success;
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
                        Thank you for paying with ISLM. Your Transaction is confirmed. Your
                        TX has been saved. Please find your one-time discount code below.{" "}
                        <Link
                            color="teal"
                            target="_blank"
                            href={`${process.env.REACT_APP_ISLM_TRANSACTION_REFFERENCE}/${couponState.storePaymentTxId}`}
                        >
                            Check Transaction Reference here
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
                Pay {props.lookCryptoPrice ? props.lookCryptoPrice : "0"} ISLM to get 100% off
            </Button>

            <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader colorScheme="blue.500">
                        <Grid>
                            <GridItem>
                                <Center>
                                    {provider?.chainId === '0xd3c3' ?
                                        <>
                                            <Image src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/768px-MetaMask_Fox.svg.png"} width="30px" height='30px' mx={'1'} />
                                            <Text>
                                                Metamask connected
                                            </Text>
                                        </> :
                                        <>
                                            <Text>
                                                Connect with
                                            </Text>
                                            <Image src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/768px-MetaMask_Fox.svg.png"} width="30px" height='30px' mx={'1'} />
                                            <Text>
                                                metamask.
                                            </Text>
                                        </>}

                                </Center>
                            </GridItem>
                        </Grid>
                    </ModalHeader>
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

export default IslmModal;
