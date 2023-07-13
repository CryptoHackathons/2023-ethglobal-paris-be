const { exec } = require('child_process');
const ethers = require('ethers');

const fs = require('fs');
const {buildMimc7,buildBabyjub} = require('circomlibjs')
const mimcMerkle = require('./MiMCMerkle')
const { groth16 } = require("snarkjs");
const crypto = require('crypto');
const abi = require('./abi.json');
const dotenv = require('dotenv');
dotenv.config();


function hexToDec(hex) {
    return parseInt(hex, 16);
}

function unstringifyBigInts(o) {
  if (typeof o == "string" && /^[0-9]+$/.test(o)) {
    return BigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
    const res = {};
    const keys = Object.keys(o);
    keys.forEach(k => {
      res[k] = unstringifyBigInts(o[k]);
    });
    return res;
  } else {
    return o;
  }
}

const users = [
    "0x1dB47D1a06Df36f963af1b086B012bb278071372",
    "0x7054D076C898472cbFEB31a6fE72c135c86C6609",
    "0x85EdA6610C66cCd307f230621DdA24Fd3bE20245",
    "0xF16Aa7E201651e7eAd5fDd010a5a14589E220826"
] // assign users for demo

const targetTimeTW = '2023-07-12T19:27:00+08:00'; // assign time for demo
const targetTime = new Date(targetTimeTW);

// set time
function scheduleTask(time, task) {
    const currentTime = new Date().getTime();
    const targetTime = new Date(time).getTime();
  
    const delay = targetTime - currentTime;
  
    if (delay == 0) {
     
      task();
    } else {
      
      setTimeout(task, delay);
    }
}
  
function executeBash(){
    const bashScript = './compileZK.sh';
    exec(`bash ${bashScript}`, (error, stdout) => {
      if (error) {
        console.error('error:', error);
        return;
      }
  
      console.log('Success Compile!');
      console.log('Output:', stdout);
    })
}


async function closeLottery() {
    
    // for wallet setting
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract("0x515348dA021B3DEac53DB0Aa39837a7594c9654e", abi, wallet);
    const rrr = await contract.closeLotteryAndCallChainlinkCoordinator(1, 1);
    console.log(rrr);
    // for random number
    const idx = 0;

    // for merkletree proof 
    const leafs = [];
    const mimc7 = await buildMimc7()
    const babyJub = await buildBabyjub()
    const F = babyJub.F
    for (let i = 0; i < users.length; i++) {
        const identity_nullifier = '0x' + crypto.randomBytes(31).toString('hex');
        const address = hexToDec(users[i]);
        //const leaf = mimc7.multiHash([i + 1, address, identity_nullifier], 1);
        const leaf = mimc7.multiHash([i + 1, address], 1); // for demo
        leafs.push(leaf);
    }
    
    console.log(leafs);
    const tree = await mimcMerkle.treeFromLeafArray(leafs);

    const root = tree[0][0];  // root 
    
    const leafProof = mimcMerkle.getProof(idx,tree,leafs); // get leaf1 : leafs[0] proof
    
    const leafPos = mimcMerkle.idxToBinaryPos(idx,2); // (idx, height )   idx: 0 - 3 
   
    
    const inputs = {
        "leaf" : BigInt(F.toObject(leafs[idx])).toString(),
        "root" : BigInt(F.toObject(root)).toString(),
        "paths2_root" : [BigInt(F.toObject(leafProof[0])).toString(),BigInt(F.toObject(leafProof[1])).toString()],
        "paths2_root_pos" :  leafPos
    }

    fs.writeFileSync("./circuits/input.json",JSON.stringify(inputs),"utf-8")
    const{proof, publicSignals} = await groth16.fullProve(inputs, "./circuits/check_exist.wasm", "./circuits/circuit.zkey")
     
    const calldata = await groth16.exportSolidityCallData(unstringifyBigInts(proof), unstringifyBigInts(publicSignals))
    const args = JSON.parse("[" + calldata + "]")
    console.log("write in proof")
    fs.writeFileSync("./proof.json",JSON.stringify(args),"utf-8")

    // for demo not going to compile
    // const bashScript = './compileZK.sh';
  
    // exec(`bash ${bashScript}`, (error, stdout) => {
    //    if (error) {
    //      console.error('error:', error);
    //      return;
    //    }
    //})
    console.log('Success Compile!');
    
}

//function 

scheduleTask(targetTime, closeLottery);

module.exports = { closeLottery };