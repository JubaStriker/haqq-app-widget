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
    Input,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Image,
    Heading,
    Spinner,
    useToast,
    Link,
    Flex,
    Stack,
} from "@chakra-ui/react";
import { ShopContext } from "../../context";
import useCouponsStore from "../../store/coupons";
import { keyStores } from "near-api-js";
import * as nearAPI from "near-api-js";
import useNearStore from "../../store/near";
import { CheckCircleIcon, CloseIcon, ExternalLinkIcon } from "@chakra-ui/icons";




const NearModal = (props) => {

    const lookId = props.lookId
    const [senderAccount, setSenderAccount] = useState(undefined);

    const nearState = useNearStore((state) => state.nearState)
    const sendNear = useNearStore((state) => state.sendNear)
    const toast = useToast();

    const getAccount = (changeEvent) => {
        setSenderAccount(changeEvent.target.value);
    };


    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

    const connectionConfig = {
        networkId: "testnet",
        keyStore: myKeyStore,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };

    const interactWallet = async (action) => {

        try {
            const nearConnection = await nearAPI.connect(connectionConfig);
            const appKeyPrefix = 'near-payment';
            const walletConnection = new nearAPI.WalletConnection(nearConnection, appKeyPrefix);

            if (action === "connect") {

                try {
                    const account = await nearConnection.account(senderAccount);
                    const accountState = await account.state();
                    console.log(accountState);
                }
                catch (err) {
                    console.log(err);
                    toast({
                        title: "Account does not exist!",
                        status: "error",
                        isClosable: true,
                    });
                    return false;
                }

                walletConnection.requestSignIn({
                    contractId: senderAccount,
                    methodNames: [], // optional
                    successUrl: `${window.location.href}`, // optional redirect URL on success
                    failureUrl: `${window.location.href}` // optional redirect URL on failure
                });
            }
            else if (action === "disconnect") {
                walletConnection.signOut();
                localStorage.clear()
                window.location.reload();

            }
        }
        catch (e) {
            console.log(e)
            toast({
                title: "Something went wrong!",
                status: "error",
                isClosable: true,
            });
        }
    }


    const localStorageObj = myKeyStore.localStorage;
    const keys = Object.keys(localStorageObj);
    const nearAccountKey = localStorageObj[keys[0]];

    let accountID;

    if (nearAccountKey && nearAccountKey !== 'light') {
        const url = window.location;
        const urlObject = new URL(url);
        const searchParams = urlObject.searchParams;
        accountID = searchParams.get("account_id");
    }

    const sendNearHandler = async () => {

        const amountObj = props.lookNearPrice;
        const amount = JSON.stringify(amountObj);
        const receiver = props.cryptoReceiver
        const result = await sendNear(amount, accountID, receiver)
        if (result.transaction.hash) {
            const txid = result.transaction_outcome.id;
            onModalClose();
            getCouponAction({ txid, shop, lookId });
            onDiscountCodeModalOpen();

            toast({
                title: "Payment successful",
                status: "success",
                isClosable: true,
            });
        }


    }

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDiscountCodeModalOpen,
        onOpen: onDiscountCodeModalOpen,
        onClose: onDiscountCodeModalClose,
    } = useDisclosure();


    const shop = useContext(ShopContext);

    const { getCouponAction, couponState } = useCouponsStore((state) => state);


    const onModalClose = () => {
        onClose();
    };

    const onDiscountModalClose = () => {
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
                        re-initiating payment.
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
                        Thank you for paying with NEAR. Your Transaction is confirmed. Your
                        TX has been saved. Please find your one-time discount code below.{" "}
                        <Link
                            color="teal"
                            target="_blank"
                            href={nearState.send.success?.link}
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
                Pay {props.lookNearPrice ? props.lookNearPrice : "0"} NEAR to get 100% off
            </Button>

            <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader colorScheme="blue.500">Connect With Near Wallet</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody minHeight={'lg'}>
                        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} >
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
                                        placeholder="Enter your NEAR wallet address"
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


                        </Stack>
                        <Stack>
                            {accountID ?

                                <Flex

                                    align={'center'}
                                    justify={'center'}
                                    maxW={''}>

                                    <Stack
                                        spacing={4}
                                        w={'full'}
                                        maxW={'lg'}
                                        rounded={'xl'}
                                        boxShadow={'lg'}
                                        p={6}
                                        my={12}>

                                        <Heading fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>

                                            <Text color={'blue.500'} as={'span'} align={'left'}>
                                                Confirm Payment
                                            </Text>{' '}
                                        </Heading>

                                        <Flex gap={'2'} justifyItems={'center'} alignItems={'center'}>
                                            <Text fontSize={'2xl'} fontWeight={'semibold'}>
                                                You are about to pay <Text as={'span'} fontWeight={'bold'} color={'green.500'}>{props.lookNearPrice}</Text>


                                            </Text>

                                            <Image src="https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png" alt="" h={'7'} w={'7'} />
                                        </Flex>

                                        <Stack spacing={6}>
                                            <Button
                                                onClick={sendNearHandler}
                                                isLoading={nearState.send.loading}
                                                loadingText='Paying...'
                                                type='submit'
                                                bg={'blue.400'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'blue.500',
                                                }}>
                                                Pay <Text as={'span'} ml={'2'}></Text>
                                            </Button>
                                        </Stack>
                                    </Stack>

                                </Flex>
                                :
                                ""}
                        </Stack>
                        <Stack>
                            {nearState.send.success?.link ?
                                <Box textAlign="center" py={10} px={6}>
                                    <CheckCircleIcon boxSize={'50px'} color={'green.500'} />

                                    <Heading as="h2" size="xl" mt={6} mb={2}>
                                        NEAR Token sending successful
                                    </Heading>
                                    <Text color={'gray.500'}>
                                        OPEN LINK BELOW to see transaction in NEAR Explorer!'
                                    </Text>
                                    <Text>
                                        <Link href={nearState.send.success?.link} isExternal>
                                            Transaction Reference <ExternalLinkIcon mx='2px' />
                                        </Link>
                                    </Text>
                                </Box>
                                : ""}
                            {nearState.send.failure?.error ?
                                <Box textAlign="center" py={10} px={6}>
                                    <CloseIcon boxSize={'50px'} color={'red.500'} />
                                    <Heading as="h2" size="xl" mt={6} mb={2}>
                                        NEAR Token sending unsuccessful
                                    </Heading>

                                    <Text color={'red.500'}>
                                        {nearState.send.failure?.error.message}
                                    </Text>

                                </Box>
                                : ""}

                        </Stack>
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