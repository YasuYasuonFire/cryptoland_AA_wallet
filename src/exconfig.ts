// eslint-disable-next-line import/no-anonymous-default-export
export default {
  enablePasswordEncryption: false,
  showTransactionConfirmationScreen: true,
  factory_address: '0x09c58cf6be8E25560d479bd52B4417d15bCA2845',
  stateVersion: '0.1',
  network: {
    chainID: '5',
    family: 'EVM',
    name: 'Goerli',
    provider: 'https://goerli.infura.io/v3/bdabe9d2f9244005af0f566398e648da',
    entryPointAddress: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
    bundler:
      'https://node.stackup.sh/v1/rpc/6b17b6a47ec9df3bb1372468d52f530448b9e2939ec43c9128f558d35118b9c2',
    baseAsset: {
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
      image:
        'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
    },
  },
  paymasterAddress: [ //paymasterコントラクトのアドレス
    '0xBb1b4b23Fa7f4EE1Af8681F03fec91361987A54c',
    '0x00000AB48215239dBE1bc1e7bFCC818EB426ad7B'//for test
  ],
  videoURL: [//paymasterに対応した広告動画URL
    "https://player.vimeo.com/video/823615097?h=bd5248c7a2&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
    "https://player.vimeo.com/video/437490927?h=26d7f84e5c"
  ],
};
