import { UserOperationStruct } from '@account-abstraction/contracts';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import React, { useCallback, useState, useEffect } from 'react';
import {
  AccountImplementations,
  ActiveAccountImplementation,
} from '../../../App/constants';
import {
  useBackgroundDispatch,
  useBackgroundSelector,
} from '../../../App/hooks';
import {
  getAccountInfo,
  getActiveAccount,
} from '../../../Background/redux-slices/selectors/accountSelectors';
import { selectCurrentOriginPermission } from '../../../Background/redux-slices/selectors/dappPermissionSelectors';
import { getActiveNetwork } from '../../../Background/redux-slices/selectors/networkSelectors';
import {
  selectCurrentPendingSendTransactionRequest,
  selectCurrentPendingSendTransactionUserOp,
} from '../../../Background/redux-slices/selectors/transactionsSelectors';
import {
  createUnsignedUserOp,
  rejectTransaction,
  sendTransaction,
  setUnsignedUserOperation,
} from '../../../Background/redux-slices/transactions';
import { EthersTransactionRequest } from '../../../Background/services/types';
import AccountInfo from '../../components/account-info';
import OriginInfo from '../../components/origin-info';
import Config from '../../../../exconfig';

const SignTransactionComponent =
  AccountImplementations[ActiveAccountImplementation].Transaction;

const SignTransactionConfirmation = ({
  activeNetwork,
  activeAccount,
  accountInfo,
  originPermission,
  transactions,
  userOp,
  onReject,
  onSend,
}: {
  activeNetwork: any;
  activeAccount: any;
  accountInfo: any;
  originPermission: any;
  transactions: EthersTransactionRequest[];
  userOp: UserOperationStruct;
  onReject: any;
  onSend: any;
}) => {
  const [showAddPaymasterUI, setShowAddPaymasterUI] = useState<boolean>(false);
  const [addPaymasterLoader, setAddPaymasterLoader] = useState<boolean>(false);
  const [paymasterError, setPaymasterError] = useState<string>('');
  const [paymasterAddress, setPaymasterAddress] = useState<string>('');
  const backgroundDispatch = useBackgroundDispatch();
  const [showAdMovie, setShowAdMovie] = React.useState<boolean>(false);//広告動画表示の状態を管理
  const [paymasterIndex, setPaymasterIndex] = useState<number>(0);//Configで定義したpaymasterから取得するindexを格納
  const [showText, setShowText] = useState(false); //動画を非表示にした後に表示する文字列の状態を管理

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showAdMovie) {
      timer = setTimeout(() => {
        setShowAdMovie(false);
        setShowText(true);
      }, 15000); //動画を表示したから一定時間経過後、文字列（くじの結果）を表示する。
    }

    return () => {
      clearTimeout(timer);
    };
  }, [showAdMovie]);


  const addPaymaster = useCallback(async () => {
    //1/2の確率で、PaymasterIndexに対応したPaymasterコントラクトアドレスを設定する。それ以外は、Paymasterなし
    const lottery = Math.random();
    console.log("lottery: ", lottery);
    if (lottery <= 0.5) {
      const paymasterAndData = Config.paymasterAddress[paymasterIndex]; //paymasterコントラクトアドレスのみ格納
      setPaymasterAddress(paymasterAndData);
      console.log('paymasterAndData', paymasterAndData);
      backgroundDispatch(
        setUnsignedUserOperation({
          ...userOp,
          paymasterAndData,
          preVerificationGas: 1000000,
          verificationGasLimit: 1000000,
        })
      );
    } else {
      setPaymasterAddress("");
      console.log("No paymaster set");
    }
  }, [activeNetwork.chainID, backgroundDispatch, paymasterAddress, userOp]);

  //広告動画のランダム選択のため、スポンサー数nを引数に取り、0,1...n-1のいずれかを取得。
  const getRandomInt = (n: number) => {
    const result: number = Math.floor(Math.random() * n);
    console.log("PaymasterIndex: ", result);
    setPaymasterIndex(result);
  }

  return (
    <Container>
      <Box sx={{ p: 2 }}>
        <Typography textAlign="center" variant="h6">
          Send transaction request
        </Typography>
      </Box>
      {activeAccount && (
        <AccountInfo activeAccount={activeAccount} accountInfo={accountInfo} />
      )}
      <Stack spacing={2} sx={{ position: 'relative', pt: 2, mb: 4 }}>
        <OriginInfo permission={originPermission} />
        <Typography variant="h6" sx-={{ p: 2 }}>
          {transactions.length > 1 ? ' Transactions data' : 'Transaction data'}
        </Typography>
        <Stack spacing={2}>
          {transactions.map((transaction: EthersTransactionRequest, index) => (
            <Paper key={index} sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                To:{' '}
                <Typography component="span" variant="body2">
                  {transaction.to}
                </Typography>
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Data:{' '}
                <Typography component="span" variant="body2">
                  {transaction.data?.toString()}
                </Typography>
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Value:{' '}
                <Typography component="span" variant="body2">
                  {transaction.value
                    ? ethers.utils.formatEther(transaction.value)
                    : 0}{' '}
                  {activeNetwork.baseAsset.symbol}
                </Typography>
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>
      {!showAddPaymasterUI && (
        <Paper
          elevation={3}
          sx={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            width: '100%',
          }}
        >
          <Box
            justifyContent="space-around"
            alignItems="center"
            display="flex"
            sx={{ p: 2 }}
          >
            <Button sx={{ width: 150 }} variant="outlined" onClick={onReject}>
              Reject
            </Button>
            <Button
              sx={{ width: 150 }}
              variant="contained"
              onClick={() => {
                // onSend();
                getRandomInt((Config.paymasterAddress).length);//スポンサーをランダムに選択
                addPaymaster();//選択したスポンサーをpaymasterに設定する or paymasterなし　を1/2の確率で選択
                setShowAdMovie(true);//Sendボタン押下と同時に広告表示

              }}
            >
              Send
              {showAdMovie && (
                <CircularProgress
                  size={48}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Button>
          </Box>

          {showAdMovie && (
            <Box sx={{
              marginTop: 2,
              display: 'flex',
              justifyContent: 'center'
            }}>
              {/* paymasterに対応した動画URLをconfigから取得 */}
              <iframe src={Config.videoURL[paymasterIndex] + "&autoplay=1&muted=1"}
                width="280" height="150" frameborder="0" allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen ></iframe>
            </Box>
          )}
          {!showAdMovie && showText && paymasterAddress && (
            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h6">当たり〜ガス代無料です！</Typography>
            </Box>
          )}
          {!showAdMovie && showText && !paymasterAddress && (
            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h6">はずれ〜ガス代は自腹でね</Typography>
            </Box>
          )}

        </Paper>
      )
      }
    </Container >
  );
};

const SignTransactionRequest = () => {
  const [stage, setStage] = useState<
    'custom-account-screen' | 'sign-transaction-confirmation'
  >('custom-account-screen');

  const [context, setContext] = useState(null);

  const backgroundDispatch = useBackgroundDispatch();
  const activeAccount = useBackgroundSelector(getActiveAccount);
  const activeNetwork = useBackgroundSelector(getActiveNetwork);
  const accountInfo = useBackgroundSelector((state) =>
    getAccountInfo(state, activeAccount)
  );

  const sendTransactionRequest = useBackgroundSelector(
    selectCurrentPendingSendTransactionRequest
  );

  const pendingUserOp = useBackgroundSelector(
    selectCurrentPendingSendTransactionUserOp
  );

  const originPermission = useBackgroundSelector((state) =>
    selectCurrentOriginPermission(state, {
      origin: sendTransactionRequest?.origin || '',
      address: activeAccount || '',
    })
  );

  const onSend = useCallback(
    async (_context?: any) => {
      if (activeAccount)
        await backgroundDispatch(
          sendTransaction({
            address: activeAccount,
            context: _context || context,
          })
        );
      // window.close();
    },
    [activeAccount, backgroundDispatch, context]
  );

  const onComplete = useCallback(
    async (modifiedTransaction: EthersTransactionRequest, context?: any) => {
      if (activeAccount) {
        backgroundDispatch(createUnsignedUserOp(activeAccount));
        setContext(context);
        if (Config.showTransactionConfirmationScreen === false) {
          onSend(context);
        }
        setStage('sign-transaction-confirmation');
      }
    },
    [setContext, setStage, activeAccount, backgroundDispatch, onSend]
  );

  const onReject = useCallback(async () => {
    if (activeAccount)
      await backgroundDispatch(rejectTransaction(activeAccount));
    window.close();
  }, [backgroundDispatch, activeAccount]);

  if (
    stage === 'sign-transaction-confirmation' &&
    pendingUserOp &&
    sendTransactionRequest.transactionRequest
  )
    return (
      <SignTransactionConfirmation
        activeNetwork={activeNetwork}
        activeAccount={activeAccount}
        accountInfo={accountInfo}
        originPermission={originPermission}
        onReject={onReject}
        onSend={onSend}
        transactions={[sendTransactionRequest.transactionRequest]}
        userOp={pendingUserOp}
      />
    );

  return SignTransactionComponent &&
    sendTransactionRequest.transactionRequest ? (
    <SignTransactionComponent
      onReject={onReject}
      transaction={sendTransactionRequest.transactionRequest}
      onComplete={onComplete}
    />
  ) : null;
};

export default SignTransactionRequest;
