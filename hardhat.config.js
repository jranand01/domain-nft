// /** @type import('hardhat/config').HardhatUserConfig */
// require("@nomiclabs/hardhat-waffle")
// const fs = require("fs")
// const privateKey = fs.readFileSync(".secret").toString()
// const projectId = "1ee87a9a45ee44ef941f7e214bd2886a"
//
// module.exports = {
//   networks: {
//     hardhat:{
//       chainId: 1337
//     },
//     mumbai:{
//       url:`https://polygon-mumbai.infura.io/v3/${projectId}`,
//       accounts: [privateKey]
//     },
//     mainnet:{
//       url:`https://mumbai.polygonscan.com/address/${projectId}`,
//       accounts: []
//     }
//    },
//   solidity: "0.8.18"
// };


// /** @type import('hardhat/config').HardhatUserConfig */
// require("@nomiclabs/hardhat-waffle")
// const fs = require("fs")
// const privateKey = fs.readFileSync(".secret").toString()
// const projectId = "1ee87a9a45ee44ef941f7e214bd2886a"
//
// module.exports = {
//   networks: {
//     hardhat:{
//       chainId: 1337
//     },
//     mumbai:{
//       url:`https://polygon-mumbai.infura.io/v3/${projectId}`,
//       accounts: []
//     },
//     mainnet:{
//       url:`https://polygon-mainnet.infura.io/v3/${projectId}`,
//       accounts: []
//     }
//   },
//   solidity: "0.8.18"
// };


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
const ALCHEMY_API_KEY = "IKSuBmiTInkKCtIsDT95go71_3tqakdj";
const secret_PRIVATE_KEY = "bc338b14846f71e30fbdcb16c2bd9136610aac3b0ba7aaf3d61982df8da80afb";
module.exports = {
  solidity: "0.8.18",
  hardhat:{},
  networks: {
    polygen_mumbai: {
       url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${secret_PRIVATE_KEY}`],
    },
  },
};



