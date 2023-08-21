import { useState, useContext } from "react";
import {
    Button,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import useXLMStore from "../../store/xlm-wallet";
import DiscountModal from "./discount";
import { ShopContext } from "../../context";

const XlmModal = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [buyyerAddress, setBuyyerAddress] = useState("");
    const shop = useContext(ShopContext);
    const postXLMpayment = useXLMStore((state) => state.postXLMpayment);
    const xlmPaymentState = useXLMStore((state) => state.xlmPaymentState);
    const resetxlmPaymentState = useXLMStore(
        (state) => state.resetxlmPaymentState
    );
    const toast = useToast();

    const onModalClose = () => {
        resetxlmPaymentState();
        onClose();
    };

    const onPayClick = async ({ lookId }) => {
        try {
            postXLMpayment({ price: props.lookCryptoPrice });
        } catch (e) { }
    };

    return (
        <>
            <DiscountModal />
            <Button
                isLoading={xlmPaymentState.post.loading}
                onClick={() =>
                    onPayClick({
                        lookId: props.lookId,
                    })
                }
                isFullWidth
            >
                Pay {props.lookCryptoPrice ? props.lookCryptoPrice : "0"} XLM to get
                100% off
            </Button>
        </>
    );
};

export default XlmModal;
