require('dotenv').config();

import { AutotaskClient } from "defender-autotask-client";


const autotaskJob = async () => {
    // console.log(process.env.TEAM_API_KEY)
    const client = new AutotaskClient({ apiKey: process.env.TEAM_API_KEY!, apiSecret: process.env.TEAM_API_SECRET! });

    const currentTasks = await client.list();
    console.log(`currentTasks:${JSON.stringify(currentTasks)}`)

    // update the autotask
    // const autotask = await client.update({
    //     autotaskId: "fa2b0fb5-7527-40ad-a08b-aa0ab94819f3",
    //     name: "mumbai-autotask-1",
    //     paused: false,
    //     encodedZippedCode: ""
    // })
    const autotaskId = "fa2b0fb5-7527-40ad-a08b-aa0ab94819f3"
    // await client.updateCodeFromFolder(autotaskId, './relay_folder');

    await client.updateCodeFromSources(autotaskId, {
        'index.js': `
const { Relayer } = require("defender-relay-client");
exports.handler = async function (credentials) {
    const relayer = new Relayer(credentials);
    
    const txRes = await relayer.sendTransaction({
        value: 0,
        gasLimit: 1000000,
        nonce: "0",
        to: '0xFeF4977cB4620714D45e00f759CE82FE0A28e378',
        from: '0x264dABD1fbF0da59Cb22E0B4b6146aA26dA669BF',
        data: '0xe382f013046eae630acc71b5684e94af27e3e423ef7ca30949a1acfdd1ab5a4a9fc83c3619e3813b071cff644fc37acf1948763f8e94ee8b5ad273e73cd93bf8d65a3b211741d0356896a3fe19d911cab4da84493088257f1efddabf7814b2744d6ca15406567d0ec99b96e9eef31d7ea028d889aaff9bcdd5bcf8f7e855e50c90304dd317e9f97c8038e916a70ffde4acf19123e6375645f6c948b70398dcebf93bf5b124b3c95db8664035f237bdb40db835b7269444b9173f686ba06e9edc45d1be0407bb354016eb8d673a1a0504d39e7e03b2d23213036ba2560f463f544fbc42ee0856701141525422d20d81bd3ed7c671b303de6fd084b75749bd57d7801cc227000000000000000000000000000000000000000000000000000000000000002100000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000bb0582ead520ede2996d62a5e44a3d86e056991b0000000000000000000000000000000000000000000000000000886c98b76000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000403336303831666337636333323435316232616339363637626662393831356636316535643861633037633838646231396339313337343238323039333934393500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000'
    });
    
    console.log(txRes);
    return txRes.hash;
};`,
      });

    // run the autotask
    const runResponse = await client.runAutotask(autotaskId, { foo: "bar" });

    console.log(`runResponse:${JSON.stringify(runResponse)}`)
}

export default autotaskJob;

autotaskJob()



// https://defender.openzeppelin.com/#/autotask/fa2b0fb5-7527-40ad-a08b-aa0ab94819f3