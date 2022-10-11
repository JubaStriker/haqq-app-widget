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
  Input,
  SkeletonText,
  Alert,
  AlertIcon,
  Image,
  Heading,
  Grid,
  GridItem,
  Center,
  Spinner,
} from "@chakra-ui/react";
import useHABRStore from "../../store/hbar";
import DiscountModal from "./discount";
import { ShopContext } from "../../context";
import Carousel from "../../components/carousel";

const HbarModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [lookHbarPrice, setLookHbarPrice] = useState();
  const shop = useContext(ShopContext);
  const hbarWalletState = useHABRStore((state) => state.hbarWalletState);
  const hbarWalletConnect = useHABRStore((state) => state.getHBARWalletConnect);
  const hbarPaymentState = useHABRStore((state) => state.hbarPaymentState);
  const postHBARpayment = useHABRStore((state) => state.postHBARpayment);
  const hbarCreateToken = useHABRStore((state) => state.hbarCreateToken);

  useEffect(() => {
    const fetchHbarPrice = async () => {
      const resp = await fetch(
        "https://api.coinconvert.net/convert/usd/hbar?amount=1"
      );
      const response = await resp.json();
      const convertedHbar = response.HBAR * props.lookPrice;
      setLookHbarPrice(convertedHbar.toFixed(2));
    };
    fetchHbarPrice();
  }, []);

  const resethbarPaymentState = useHABRStore(
    (state) => state.resetHBARPaymentState
  );

  const resetHBARWalletSate = useHABRStore(
    (state) => state.resetHBARWalletSate
  );

  const onModalClose = () => {
    resetHBARWalletSate();
    resethbarPaymentState();
    onClose();
  };

  const connectWallet = async () => {
    onOpen();
    const walletDetails = await hbarWalletConnect();
  };

  const payHbar = async ({ lookHbarPrice }) => {
    let topic = hbarWalletState.get.success.data.topic;
    let accountId = hbarWalletState.get.success.data.accountId;
    let network = hbarWalletState.get.success.data.network;
    const payhbar = await postHBARpayment({
      topic,
      accountId,
      network,
      lookHbarPrice,
      shop,
    });
  };

  const createToken = async () => {
    let topic = hbarWalletState.get.success.data.topic;
    let accountId = hbarWalletState.get.success.data.accountId;
    let network = hbarWalletState.get.success.data.network;
    await hbarCreateToken({
      topic,
      accountId,
      network,

    });
  };

  const renderWalletStatus = () => {
    if (hbarWalletState.get.loading) {
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
    } else if (hbarWalletState.get.failure.error) {
      return (
        <>
          <Button
            colorScheme={"teal"}
            onClick={() => connectWallet()}
            isFullWidth
          >
            Connect to Wallet
          </Button>
          <Alert status="error">
            <AlertIcon />
            {hbarPaymentState.post.failure.message}
          </Alert>
          <Text>{hbarPaymentState.post.failure.message}</Text>
        </>
      );
    } else if (hbarWalletState.get.success.ok) {
      return (
        <>
          <Box
            maxW="100%"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            textAlign={"center"}
          >
            <Carousel medias={props.lookImage} height={320} width={220} />
            <Box p="6">
              <Box
                mt="1"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                noOfLines={1}
              >
                {props.lookName}
              </Box>

              <Box>
                {lookHbarPrice}
                <Box as="span" color="gray.600" fontSize="sm">
                  HBAR
                </Box>
              </Box>

              <Box display="flex" mt="2" alignItems="center">
                Wallet Address that HBAR transfering from
                <Box as="span" ml="2" color="gray.600" fontSize="sm">
                  {hbarWalletState.get.success.data.accountId}
                </Box>
              </Box>

              <Box display="flex" mt="2" alignItems="center">
                <Button
                  colorScheme={"teal"}
                  isFullWidth
                  onClick={() => createToken()}
                >
                  Create Token
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      );
    } else {
      return (
        <Box p={10}>
          <Button
            colorScheme={"teal"}
            onClick={() => connectWallet()}
            isFullWidth
          >
            Connect to Wallet
          </Button>
        </Box>
      );
    }
  };

  const renderPaymentStatus = () => {
    if (hbarPaymentState.post.loading) {
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
    } else if (hbarPaymentState.post.failure.error) {
      return (
        <>
          <Button
            colorScheme={"teal"}
            onClick={() => connectWallet()}
            isFullWidth
          >
            Connect to Wallet
          </Button>
          <Alert status="error">
            <AlertIcon />
            {hbarPaymentState.post.failure.message}
          </Alert>
          <Text>{hbarPaymentState.post.failure.message}</Text>
        </>
      );
    } else if (hbarPaymentState.post.success.ok) {
      return <DiscountModal />;
    } else {
      return (
        <Box p={10}>
          <Button
            colorScheme={"teal"}
            onClick={() => connectWallet()}
            isFullWidth
          >
            Connect to Wallet
          </Button>
        </Box>
      );
    }
  };

  return (
    <>
      <Button onClick={() => connectWallet()} isFullWidth>
        Pay {lookHbarPrice ? lookHbarPrice : "10"} HABR to get 100% off
      </Button>

      <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="teal" color="#fff">
            {hbarWalletState.get.success.ok
              ? "Your Discount:"
              : "Please connect to Hashpack Wallet"}
          </ModalHeader>

          <ModalBody>
            {hbarPaymentState.post.success.ok
              ? renderPaymentStatus()
              : renderWalletStatus()}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HbarModal;
