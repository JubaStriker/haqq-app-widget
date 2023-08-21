import { useEffect, useState, useContext } from "react";
import {
  Container,
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Link,
  Button,
  Flex,
  SimpleGrid,
  VStack,
  Divider,
  Skeleton,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
} from "@chakra-ui/react";
import Carousel from "../../components/carousel";
import useLooksStore from "../../store/looks";
import useProductsStore from "../../store/products";
import { ExternalLinkIcon, } from "@chakra-ui/icons";
import { ShopContext } from "../../context";
import Flickity from "react-flickity-component";
import HbarModal from "../../components/hbar-payment-modal";
import "../../embed.css";
import axios from "axios";
import XrpModal from "../../components/xrp-payment-modal";
import NearModal from "../../components/near-payment-modal";
import XlmModal from "../../components/xlm-payment-modal";

const ProductsModal = (props) => {
  const { isOpen, onClose, productIds = [], lookId } = props;
  const products = useProductsStore((state) => state.products);
  const getProducts = useProductsStore((state) => state.getProducts);
  const shop = useContext(ShopContext);

  useEffect(() => {
    getProducts({ products: productIds, shop });
  }, []);

  const renderProducts = () => {
    if (products.get.loading) {
      return (
        <SimpleGrid minChildWidth="220px" spacing="10px">
          {[1, 2, 3].map((e, i) => (
            <Center p={4} key={i}>
              <Skeleton width="160px" height="182px" />
            </Center>
          ))}
        </SimpleGrid>
      );
    } else if (products.get.failure.error) {
      return (
        <Box>
          <Flex direction="column" align="center">
            <VStack spacing="3">
              <Heading as="h1" size="md">
                {products.get.failure.message}
              </Heading>
            </VStack>
            <br />
            <Divider />
            <br />
            <VStack spacing="3">
              <Button
                onClick={() => getProducts({ products: productIds, shop })}
              >
                Try Again
              </Button>
            </VStack>
          </Flex>
        </Box>
      );
    } else if (products.get.success.data.length) {
      return (
        <Flickity
          options={{
            groupCells: 1,
            pageDots: false,
            contain: true,
            autoPlay: false,
          }}
        >
          {products.get.success.data.map((product) => (
            <Center key={product.admin_graphql_api_id || product.id}>
              <Box
                role={"group"}
                p={4}
                maxW={"240px"}
                w={"full"}
                rounded={"lg"}
                pos={"relative"}
                zIndex={1}
              >
                <Box
                  rounded={"lg"}
                  pos={"relative"}
                  height={"320px"}
                  _groupHover={{
                    _after: {
                      filter: "blur(20px)",
                    },
                  }}
                >
                  <Carousel medias={product.images} height={320} width={220} />
                </Box>
                <Stack pt={3} align={"center"}>
                  <Text
                    color={"gray.500"}
                    fontSize={"xs"}
                    textTransform={"uppercase"}
                  >
                    {product.variants && product.variants.length
                      ? `${product.variants.length} variants available`
                      : null}
                  </Text>
                  <Heading
                    textAlign="center"
                    fontSize={"md"}
                    fontFamily={"body"}
                    fontWeight={500}
                  >
                    {product.title}
                  </Heading>
                  <Link
                    marginTop={"10px"}
                    href={`http://${shop}/products/${product.handle}?app=shoplook&lookid=${lookId}`}
                    target="_blank"
                    width="full"
                  >
                    <Button
                      fontSize="sm"
                      isFullWidth
                      rightIcon={<ExternalLinkIcon />}
                    >
                      View Product
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </Center>
          ))}
        </Flickity>
      );
    } else {
      return null;
    }
  };
  return (
    <>
      <Modal
        isCentered
        scrollBehavior={"inside"}
        closeOnOverlayClick
        blockScrollOnMount={false}
        preserveScrollBarGap
        lockFocusAcrossFrames={false}
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader margin="0" padding="0" textAlign="center" mt="12px">
            Shop the products in this look
          </ModalHeader>
          <ModalCloseButton size="lg" border="1px solid black" />
          <ModalBody>{renderProducts()}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};



const EmbedRoute = (props) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const looks = useLooksStore((state) => state.looks);
  const getLooks = useLooksStore((state) => state.getLooks);
  const shop = useContext(ShopContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productIds, setProductIds] = useState([]);
  const [isModalvis, setIsModalvis] = useState(false);
  const [currentLookId, setCurrentLookId] = useState("");
  const [freePlanLimitReached, setFreePlanLimitReached] = useState(false);

  console.log("Looks: ", looks.get.success.data)

  useEffect(async () => {
    getLooks({ shop });
    try {
      await axios.get(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/post_views?shop=${shop}`
      );
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_views?shop=${shop}`
      );
      if (data && !data.subscribed && data.count > 1000) {
        setFreePlanLimitReached(true);
      }
    } catch (e) { }
  }, []);

  const onLooksClick = ({ lookId, products }) => {
    setProductIds(products);
    setCurrentLookId(lookId);
    setIsModalvis(true);
    onOpen();
  };

  const onModalClose = () => {
    setCurrentLookId("");
    setProductIds([]);
    setIsModalvis(false);
    onClose();
  };

  const renderList = () => {
    if (looks.get.loading) {
      return [1, 2, 3].map((e, i) => (
        <Center key={i}>
          <Skeleton width="275px" height="400px" />
        </Center>
      ));
    } else if (looks.get.failure.error) {
      return (
        <Box>
          <Flex direction="column" align="center">
            <VStack spacing="3">
              <Heading as="h1" size="md">
                {looks.get.failure.message}
              </Heading>
            </VStack>
            <br />
            <Divider />
            <br />
            <VStack spacing="3">
              <Button onClick={() => getLooks({ shop })}>Try Again</Button>
            </VStack>
          </Flex>
        </Box>
      );
    } else if (looks.get.success.data.length) {
      return (
        <>
          {isModalvis ? (
            <ProductsModal
              isOpen={isOpen}
              onClose={onModalClose}
              lookId={currentLookId}
              productIds={productIds}
            />
          ) : null}

          {looks.get.success.data.map((look) => (
            <Center key={look.id || look.objectId}>
              <Box
                role={"group"}
                p={4}
                maxW={"330px"}
                w={"full"}
                bg={bgColor}
                // boxShadow={'2xl'}
                rounded={"lg"}
                pos={"relative"}
                zIndex={1}
              >
                <Box
                  rounded={"lg"}
                  pos={"relative"}
                  height={"400px"}
                  // _after={{
                  // 	transition: 'all .3s ease',
                  // 	content: '""',
                  // 	w: 'full',
                  // 	h: 'full',
                  // 	pos: 'absolute',
                  // 	top: 5,
                  // 	left: 0,
                  // 	backgroundImage: `url(${look.get('medias')[0].url()})`,
                  // 	filter: 'blur(15px)',
                  // 	zIndex: -1,
                  // }}
                  _groupHover={{
                    _after: {
                      filter: "blur(20px)",
                    },
                  }}
                >
                  {/* <Image
											rounded={'lg'}
											height={230}
											width={282}
											objectFit={'cover'}
											src={'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80'}
										/> */}
                  <Carousel medias={look.medias} height={400} width={275} />
                </Box>
                <Stack pt={3} align={"center"}>
                  <Text
                    color={"gray.500"}
                    fontSize={"xs"}
                    textTransform={"uppercase"}
                  >
                    {look.products.length} products in this look
                  </Text>
                  <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                    {look.name}

                  </Heading>
                  <Button
                    marginTop={"10px"}
                    onClick={() =>
                      onLooksClick({
                        lookId: look.id || look.objectId,
                        products: look.products,
                      })
                    }
                    isFullWidth
                  >
                    Shop The Look
                  </Button>
                  {look.blockchain === 'hedera' ?
                    <HbarModal lookPrice={look.price} lookImage={look.medias} lookId={look.id || look.objectId} lookName={look.name} /> :
                    ""
                  }

                  {look.blockchain === 'ripple' ?

                    <XrpModal lookXrpPrice={look.cryptoPrice} lookImage={look.medias} lookId={look.id || look.objectId} lookName={look.name} /> :
                    ""
                  }

                  {look.blockchain === 'near' ?

                    <NearModal lookNearPrice={look.cryptoPrice} lookImage={look.medias} lookId={look.id || look.objectId} lookName={look.name} cryptoReceiver={look.cryptoReceiver} /> :
                    ""
                  }
                  {look.blockchain === 'stellar' ?

                    <XlmModal
                      lookCryptoPrice={look.cryptoPrice || look.price}
                      lookImage={look.medias}
                      lookId={look.id || look.objectId}
                      lookName={look.name}
                    /> :
                    ""
                  }

                </Stack>
              </Box>
            </Center>
          ))}
        </>
      );
    }
  };

  if (freePlanLimitReached) {
    return (
      <Container maxW={"7xl"} py="5" pr="0">
        <Center>
          <Heading textAlign="center" size="sm">
            Your free trial limit has been exceded. Please visit the Lookbook
            app dashboard from your Shopify admin page to subscribe to the paid
            plan.
          </Heading>
        </Center>
      </Container>
    );
  } else {
    return (
      <Container maxW={"7xl"} py="5" pr="0">
        {/* <Center>
        <Heading>Shop The Look</Heading>
        
      </Center> */}
        <br />
        <Flickity
          options={{
            groupCells: 1,
            pageDots: false,
            contain: true,
            autoPlay: false,
          }}
        >
          {renderList()}
        </Flickity>
      </Container>

    );
  }
};

export default EmbedRoute;