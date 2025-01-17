import {
  ActionType,
  createAsyncAction,
  createStandardAction
} from "typesafe-actions";

import {
  CreditCard,
  NullableWallet,
  PaymentManagerToken,
  Wallet,
  WalletResponse
} from "../../../types/pagopa";
import { PayloadForAction } from "../../../types/utils";
import { NetworkError } from "../../../utils/errors";

// this action load wallets following a backoff retry strategy
export const fetchWalletsRequestWithExpBackoff = createStandardAction(
  "WALLETS_LOAD_BACKOFF_REQUEST"
)();

export const fetchWalletsRequest = createStandardAction(
  "WALLETS_LOAD_REQUEST"
)();

export const fetchWalletsSuccess = createStandardAction("WALLETS_LOAD_SUCCESS")<
  ReadonlyArray<Wallet>
>();

export const fetchWalletsFailure = createStandardAction("WALLETS_LOAD_FAILURE")<
  Error
>();

export const addWalletCreditCardInit = createStandardAction(
  "WALLET_ADD_CREDITCARD_INIT"
)();

type AddWalletCreditCardRequestPayload = Readonly<{
  creditcard: NullableWallet;
}>;

export const addWalletCreditCardRequest = createStandardAction(
  "WALLET_ADD_CREDITCARD_REQUEST"
)<AddWalletCreditCardRequestPayload>();

// this action follows a backoff retry strategy
export const addWalletCreditCardWithBackoffRetryRequest = createStandardAction(
  "WALLET_ADD_CREDITCARD_WITH_BACKOFF_REQUEST"
)<AddWalletCreditCardRequestPayload>();

export const addWalletCreditCardSuccess = createStandardAction(
  "WALLET_ADD_CREDITCARD_SUCCESS"
)<WalletResponse>();

// this action describes when a new card is completed onboarded (add + pay + checkout)
// and available in wallets list
export const addWalletNewCreditCardSuccess = createStandardAction(
  "WALLET_ADD_NEW_CREDITCARD_SUCCESS"
)();

export const addWalletNewCreditCardFailure = createStandardAction(
  "WALLET_ADD_NEW_CREDITCARD_FAILURE"
)();

export type CreditCardFailure =
  | {
      kind: "GENERIC_ERROR";
      reason: string;
    }
  | {
      kind: "ALREADY_EXISTS";
    };

export const addWalletCreditCardFailure = createStandardAction(
  "WALLET_ADD_CREDITCARD_FAILURE"
)<CreditCardFailure>();

// used to accumulate all the urls browsed into the pay webview
export const creditCardPaymentNavigationUrls = createStandardAction(
  "CREDITCARD_PAYMENT_NAVIGATION_URLS"
)<ReadonlyArray<string>>();

type DeleteWalletRequestPayload = Readonly<{
  walletId: number;
  onSuccess?: (action: ActionType<typeof deleteWalletSuccess>) => void;
  onFailure?: (action: ActionType<typeof deleteWalletFailure>) => void;
}>;

export const deleteWalletRequest = createStandardAction(
  "WALLET_DELETE_REQUEST"
)<DeleteWalletRequestPayload>();

export const deleteWalletSuccess = createStandardAction(
  "WALLET_DELETE_SUCCESS"
)<PayloadForAction<typeof fetchWalletsSuccess>>();

export const deleteWalletFailure = createStandardAction(
  "WALLET_DELETE_FAILURE"
)<PayloadForAction<typeof fetchWalletsFailure>>();

export const setFavouriteWalletRequest = createStandardAction(
  "WALLET_SET_FAVOURITE_REQUEST"
)<number | undefined>();

export const setFavouriteWalletSuccess = createStandardAction(
  "WALLET_SET_FAVOURITE_SUCCESS"
)<Wallet>();

export const setFavouriteWalletFailure = createStandardAction(
  "WALLET_SET_FAVOURITE_FAILURE"
)<Error>();

export const setWalletSessionEnabled = createStandardAction(
  "WALLET_SET_SESSION_ENABLED"
)<boolean>();

type StartOrResumeAddCreditCardSagaPayload = Readonly<{
  creditCard: CreditCard;
  language?: string;
  setAsFavorite: boolean;
  onSuccess?: (wallet: Wallet) => void;
  onFailure?: (error?: "ALREADY_EXISTS") => void;
}>;

export const runStartOrResumeAddCreditCardSaga = createStandardAction(
  "RUN_ADD_CREDIT_CARD_SAGA"
)<StartOrResumeAddCreditCardSagaPayload>();

/**
 * user wants to pay
 * - request: we know the idWallet, we need a fresh PM session token
 * - success: we got a fresh PM session token
 * - failure: we can't get a fresh PM session token
 */
export const refreshPMTokenWhileAddCreditCard = createAsyncAction(
  "REFRESH_PM_TOKEN_WHILE_ADD_CREDIT_CARD_REQUEST",
  "REFRESH_PM_TOKEN_WHILE_ADD_CREDIT_CARD_SUCCESS",
  "REFRESH_PM_TOKEN_WHILE_ADD_CREDIT_CARD_FAILURE"
)<{ idWallet: number }, PaymentManagerToken, Error>();

export type AddCreditCardWebViewEndReason = "USER_ABORT" | "EXIT_PATH";
// event fired when the paywebview ends its challenge (used to reset pmSessionToken)
export const addCreditCardWebViewEnd = createStandardAction(
  "ADD_CREDIT_CARD_WEB_VIEW_END"
)<AddCreditCardWebViewEndReason>();

export const runSendAddCobadgeTrackSaga = createStandardAction(
  "RUN_SEND_ADD_COBADGE_MESSAGE_SAGA"
)();

export const sendAddCobadgeMessage = createStandardAction(
  "SEND_ADD_COBADGE_MESSAGE"
)<boolean>();

type UpdatePaymentStatusPayload = { idWallet: number; paymentEnabled: boolean };
/**
 * change the payment status (enable or disable a payment method to pay with pagoPa)
 */
export const updatePaymentStatus = createAsyncAction(
  "WALLET_UPDATE_PAYMENT_STATUS_REQUEST",
  "WALLET_UPDATE_PAYMENT_STATUS_SUCCESS",
  "WALLET_UPDATE_PAYMENT_STATUS_FAILURE"
)<UpdatePaymentStatusPayload, Wallet, NetworkError>();

export type WalletsActions =
  | ActionType<typeof fetchWalletsRequest>
  | ActionType<typeof fetchWalletsSuccess>
  | ActionType<typeof fetchWalletsFailure>
  | ActionType<typeof deleteWalletRequest>
  | ActionType<typeof deleteWalletSuccess>
  | ActionType<typeof addCreditCardWebViewEnd>
  | ActionType<typeof refreshPMTokenWhileAddCreditCard>
  | ActionType<typeof deleteWalletFailure>
  | ActionType<typeof setFavouriteWalletRequest>
  | ActionType<typeof setFavouriteWalletSuccess>
  | ActionType<typeof setFavouriteWalletFailure>
  | ActionType<typeof runStartOrResumeAddCreditCardSaga>
  | ActionType<typeof addWalletCreditCardInit>
  | ActionType<typeof addWalletCreditCardRequest>
  | ActionType<typeof addWalletCreditCardWithBackoffRetryRequest>
  | ActionType<typeof addWalletCreditCardSuccess>
  | ActionType<typeof addWalletCreditCardFailure>
  | ActionType<typeof addWalletNewCreditCardSuccess>
  | ActionType<typeof addWalletNewCreditCardFailure>
  | ActionType<typeof setWalletSessionEnabled>
  | ActionType<typeof creditCardPaymentNavigationUrls>
  | ActionType<typeof fetchWalletsRequestWithExpBackoff>
  | ActionType<typeof runSendAddCobadgeTrackSaga>
  | ActionType<typeof sendAddCobadgeMessage>
  | ActionType<typeof updatePaymentStatus>;
