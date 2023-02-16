# zkDompet-Contracts
- Uses sample code from OpenZeppelin Defender workshop
# Deployment notes
- only need to deploy `Verifier` contract from generated `verifier.sol`
- use `snarkjs generatecall` in the circom root folder to generate call data that returns `true` when submitted to the `Verifier` contract
# Defender Meta-Transactions Workshop

Code for the workshop on Meta-Transactions using [OpenZeppelin Defender](https://openzeppelin.com/defender).

This project consists of a sample _names registry_ contract, that accepts registrations for names either directly or via a meta-transaction, along with a client dapp, plus the meta-transaction relayer implementation.

Live demo running at [defender-metatx-workshop-demo.openzeppelin.com](https://defender-metatx-workshop-demo.openzeppelin.com/).

## test 

curl \
  -X GET \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H "X-Api-Key: AM8iFEdNdPftCCWUwcKgQDwEPzbq65Yu" \
  -H "Authorization: Bearer 5dZKF4qtTDAjJVe7KZsfSiYNko1K7MGmgxmUp21p2CrzxgvRMKC5sPrfoF4e1m9b" \
    "https://defender-api.openzeppelin.com/relayer/relayers/summary"

### deploy contract 
0x446008101d998584837e01c3bbc0d3055e37b189 ## relayer ? 
### submit transaction
0xBb0582EaD520EDE2996D62A5e44A3d86e056991B,100000000000000,0x00

## deploy
```bash
yarn hardhat run scripts/deploy-multisigWithVerifier.js --network mumbai
```
### test this now 
MinimalForwarder: 0x9B6CB4DD4836b2AB59fe84938f062e4504c90F83
MultiSigWalletMetaTxnWithVerifier: 0x93f80F3b22907d01098B2Ac0311A35d4FDD46736

### new new 
# sha256 of 0x264dABD1fbF0da59Cb22E0B4b6146aA26dA669BF
36081fc7cc32451b2ac9667bfb9815f61e5d8ac07c88db19c913742820939495

MinimalForwarder: 0xC32D8793ef43238878171fa83e1A975b1ffb5173
MultiSigWalletMetaTxnWithVerifierNew: 0xFeF4977cB4620714D45e00f759CE82FE0A28e378

## Structure

- `app`: React code for the client dapp, bootstrapped with create-react-app.
- `autotasks/relay`: Javascript code for the meta-transaction relay, to be run as a Defender Autotask, compiled using rollup.
- `contracts`: Solidity code for the Registry contract, compiled with [hardhat](https://hardhat.org/).
- `scripts`: Custom scripts for common tasks, such as uploading Autotask code, signing sample meta-txs, etc.
- `src`: Shared code for signing meta-txs and interacting with the Forwarder contract.
- `test`: Tests for contracts and autotask.

## Scripts

- `yarn deploy`: Compiles and deploys the Registry and Forwarder contracts to xDAI, and writes their addresses in `deploy.json`.
- `yarn sign`: Signs a meta-tx requesting the registration of `NAME`, using the private key defined in `PRIVATE_KEY`, and writes it to `tmp/request.json`.
- `yarn events`: Lists all the `Registered` events from the deployed contract on xDAI.
- `yarn invoke`: Invokes the relay Autotask via `WEBHOOK_URL` with the contents of `tmp/request.json` generated by `yarn sign`.
- `yarn upload`: Compiles and uploads the Autotask code to `AUTOTASK_ID`.
- `yarn relay`: Runs the relay Autotask script locally, using the Defender Relayer for `RELAY_API_KEY`.
- `yarn test`: Runs tests for contracts and Autotask using hardhat.

## Environment

Expected `.env` file in the project root:

- `PRIVATE_KEY`: Private key used for deploying contracts and signing meta-txs locally.
- `RELAYER_API_KEY`: Defender Relayer API key, used for sending txs with `yarn relay`.
- `RELAYER_API_SECRET`: Defender Relayer API secret.
- `AUTOTASK_ID`: Defender Autotask ID to update when running `yarn upload`.
- `TEAM_API_KEY`: Defender Team API key, used for uploading autotask code.
- `TEAM_API_SECRET`: Defender Team API secret.

Expected `.env` file in `/app`:

- `REACT_APP_WEBHOOK_URL`: Webhook of the Autotask to invoke for relaying meta-txs.
- `REACT_APP_QUICKNODE_URL`: Optional URL to Quicknode for connecting to the xDAI network from the dapp.

## Run the code

To run the workshop code yourself on the xDai network you will need to [sign up to Defender](https://defender.openzeppelin.com/) and [apply for mainnet access](https://openzeppelin.com/apply/), or change the code to use a public testnet.

### Fork and clone the repo

First fork the repository and then Git Clone your fork to your computer and install dependencies

```js
$ git clone https://github.com/OpenZeppelin/workshops.git
$ cd workshops/01-defender-meta-txs/
$ yarn
```

### Configure the project

Create a `.env` file in the project root

```js
PRIVATE_KEY="Private key used for deploying contracts and signing meta-txs locally"
RELAYER_API_KEY="Defender Relayer API key, used for sending txs with yarn relay"
RELAYER_API_SECRET="Defender Relayer API secret"
AUTOTASK_ID="Defender Autotask ID to update when running yarn upload"
TEAM_API_KEY="Defender Team API key, used for uploading autotask code"
TEAM_API_SECRET="Defender Team API secret"
```

Store the value of a new private key in our projects `.env` file and fund the address with xDai (You can use a [faucet](https://blockscout.com/poa/xdai/faucet)).

### Deploy contracts

Deploy the MinimalForwarder and Registry contracts to xDai

```js
$ yarn deploy
```

### Create Relayer

Create a relayer using [Defender Relay](https://docs.openzeppelin.com/defender/relay) on xDai.
Fund your xDai relayer (You can use a [faucet](https://blockscout.com/poa/xdai/faucet)).
Create an API key for your relayer and store the relayer API key and API secret in our projects `.env` file.

Sign a request to register a name, this will create a request in `tmp/request.json` that we can then view

```js
$ NAME=alice yarn sign
$ cat tmp/request.json
```

We can then use the script to send the request to our relayer, and [view the transaction on Blockscout](https://blockscout.com/poa/xdai).  We can also view the name registrations.

```js
$ yarn relay
$ yarn events
```

### Create Autotask

Create an [Autotask in Defender](https://docs.openzeppelin.com/defender/autotasks), with a webhook trigger and connected to our xDai relayer.  We can leave the code as is as we will update it using a script.

Once the Autotask is created get the Autotask ID from the URL (https://defender.openzeppelin.com/#/autotask/[AUTO_TASK_ID]) and store it in our projects `.env` file.

To update our Autotask we need a Team API key.  From the right hand menu in Defender, select Team API Keys, then Create API Key, with Capabilities to Update Autotasks code and a note such as *Update Autotask code*.  Copy the Team API key and secret and store it in our projects `.env` file.

We can then update our Autotask code programmatically by uploading our code:

```js
$ yarn upload
```

We can sign another name for the registry and then send a request to the Autotask webhook to relay and finally view the registry.

```js
$ NAME=alice yarn sign
$ curl -XPOST 'Your Autotask Webhook URI goes here' -H 'Content-type: application/json' -d '@tmp/request.json'
$ yarn events
```

### Run app

Copy the Autotask Webhook URI and store in our apps `.env` file (in the `app` directory).

We can then install dependencies using `yarn` and run the app.

```js
$ yarn
$ yarn start
```

1. Open app: [http://localhost:3000/](http://localhost:3000/)
2. [Connect MetaMask to xDai network](https://metamask.zendesk.com/hc/en-us/articles/360052711572-How-to-connect-to-the-xDai-network) and change to xDai network
3. Enter a name to register and sign the metatransaction in MetaMask
4. Your name will be registered, showing the address that created the metatransaction and the name.
