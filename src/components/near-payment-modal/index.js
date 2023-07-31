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
    Flex,
    Stack,
} from "@chakra-ui/react";
import { ShopContext } from "../../context";
import useCouponsStore from "../../store/coupons";



const NearModal = (props) => {




    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDiscountCodeModalOpen,
        onOpen: onDiscountCodeModalOpen,
        onClose: onDiscountCodeModalClose,
    } = useDisclosure();

    const [buyerAddress, setBuyerAddress] = useState("");


    var code;




    const shop = useContext(ShopContext);

    const { getCouponAction, couponState, postCouponAction } = useCouponsStore((state) => state);

    const toast = useToast();



    const onModalClose = () => {

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

        } catch (e) {
            toast({
                title: "Something went wrong. Please retry again.",
                status: "error",
                isClosable: true,
            });
            onClose();
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
                Pay {props.lookNearPrice ? props.lookNearPrice : "0"} NEAR to get 100% off
            </Button>

            <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader colorScheme="blue.500">Connect Near Wallet</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {/* <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                            {accountID ?
                                <Button
                                    onClick={() => interactWallet('disconnect')}
                                    rounded={'full'}
                                    bg={'red.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'red.500',
                                    }}>
                                    Disconnect Wallet
                                </Button>
                                : <Flex width={'full'} gap={'5'}>
                                    <Input
                                        variant='flushed'
                                        placeholder="Enter your wallet address"
                                        _placeholder={{ color: 'gray.500' }}
                                        type="text"
                                        size={'sm'}
                                        name='walletId'
                                        required
                                        onChange={getAccount}
                                    />
                                    {senderAccount ?
                                        <Button
                                            onClick={() => interactWallet('connect')}
                                            rounded={'full'}
                                            bg={'blue.400'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }}
                                            px={'6'}
                                        >
                                            Connect Wallet
                                        </Button> :
                                        <Button
                                            onClick={() => interactWallet('connect')}
                                            rounded={'full'}
                                            bg={'blue.400'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }}
                                            px={'6'}
                                            isDisabled={true}
                                        >
                                            Connect Wallet
                                        </Button>
                                    }
                                </Flex>}
                            {accountID ?
                                <Button rounded={'full'}>Connected Wallet:
                                    <Text as={'span'} color={'green.300'} ml={'2'}>{accountID}</Text>
                                </Button> :
                                ""}
                        </Stack> */}
                    </ModalBody>
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

export default NearModal;