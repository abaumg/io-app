import { fromNullable } from "fp-ts/lib/Option";
import { BrandEnum } from "../../definitions/pagopa/walletv2/PaymentInstrument";
import defaultCardIcon from "../../img/wallet/cards-icons/unknown.png";
export const cardIcons: { [key in BrandEnum]: any } = {
  MAESTRO: require("../../img/wallet/cards-icons/maestro.png"),
  MASTERCARD: require("../../img/wallet/cards-icons/mastercard.png"),
  VISA_ELECTRON: require("../../img/wallet/cards-icons/visa-electron.png"),
  VISA_CLASSIC: require("../../img/wallet/cards-icons/visa.png"),
  VPAY: require("../../img/wallet/cards-icons/vPay.png")
};

export const getCardIconFromBrand = (brand: BrandEnum | undefined) =>
  fromNullable(brand).fold(defaultCardIcon, b => cardIcons[b]);
