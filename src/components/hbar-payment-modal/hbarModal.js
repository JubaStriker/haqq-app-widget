import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import Carousel from "../carousel";
import useHABRStore from "../../store/hbar";
import { useState, useContext } from "react";
import { ShopContext } from "../../context";
import axios from "axios";
const HbarModal = (props) => {
  console.log(props);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [lookHbarPrice, setLookHbarPrice] = useState('5');
  const hbarWalletState = useHABRStore((state) => state.hbarWalletState);

  const postHBARpayment = useHABRStore((state) => state.postHBARpayment)

  const getHBARWalletConnect = useHABRStore(
    (state) => state.getHBARWalletConnect
  );
  const hbarAssociateToken = useHABRStore((state) => state.hbarAssociateToken);
  const hbarPayToken = useHABRStore((state) => state.hbarPayToken);

  const shop = useContext(ShopContext);
  console.log(shop);
  console.log(hbarWalletState.get);

  const connectWalletHandler = () => {
    onOpen();
    getHBARWalletConnect();
  };

  console.log(hbarWalletState.get?.success?.data?.tokenId);

  const associateTokenHandler = () => {
    const { accountId, network, topic } = hbarWalletState.get.success.data;
    hbarAssociateToken({ accountId, network, topic, shop });
  };


  
  const postHbarPaymentHandler = async () => {
    const { accountId, network, topic } = hbarWalletState.get.success.data;
    postHBARpayment({   topic, accountId, network, lookHbarPrice, shop, })
  }

  const hbarPayTokenHandler = async () => {
    const { network, topic, accountId } =
      hbarWalletState.get.success.data;

    const { data } = await axios.get(
      `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_shop?shop=${shop}`
    );

    console.log(data);

    const tokensInAccount = await fetch(
      `https://testnet.mirrornode.hedera.com/api/v1/tokens?account.id=${accountId}`
    );

    const fetchedTokens = await tokensInAccount.json();

    console.log(fetchedTokens.tokens);

    const tokenMatched = fetchedTokens.tokens.some((item) => {
      return item.token_id === data.walletToken;
    });

    console.log(tokenMatched);
    if (tokenMatched) {
      hbarPayToken({
        topic,
        accountId,
        network,
        tokenId: data.walletToken,
        merchantId: data.walletAddress,
      });
    }
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
    } else if (
      hbarWalletState.get.success.ok &&
      hbarWalletState.get.success.data !== null
    ) {
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
                {props.lookPrice}
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
                  onClick={() => postHbarPaymentHandler()}
                 
                >
                  Pay HBAR
                </Button>
                <Button
                colorScheme={"teal"}
                isFullWidth
                onClick={() => associateTokenHandler()}
                >
                  Associat Token
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      );
    } else if (
      hbarWalletState.get.success.ok &&
      hbarWalletState.get?.success?.data?.tokenId !== null
    ) {
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
                  onClick={() => hbarPayTokenHandler()}
                >
                  Pay HBAR Token
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Button
            onClick={() => connectWalletHandler()}
            isFullWidth
            colorScheme="teal"
          >
            Connect To Wallet
          </Button>
        </>
      );
    }
  };

  return (
    <>
      <Button onClick={() => connectWalletHandler()} isFullWidth>
        Pay 5 USDC to get 100% off
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay>
          <ModalContent>
            <ModalHeader bg="teal" color="#fff">
              Please connect to Hashpack Wallet
            </ModalHeader>
            <ModalBody>{renderWalletStatus()}</ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default HbarModal;
