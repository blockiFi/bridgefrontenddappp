
import  {bridgeAbi , ERC20Abi} from "./abi";
const state = {
    wrappedAssets : [],
    nativeAssets : [],
    address: "",
    assetSupportedNetworks : [],
    activeNetwork : {},
    networks : [ 
          { 
            id : "97",
            name : "Bsc TestNet",
            network: "BSC",
            bridgeAddress : "0x73acF7178baA99eDF3260aCb400377DC2EFf1316",
           },
            {   id : "80001",
            name : "Polygon Mumbai",
            network: "Polygon",
            bridgeAddress : "0x1D9413C979A181D6b3EE3F750ed1cE476D33994b",
           },
           {   id : "4",
           name : "Rinkeby TestNet",
           network: "Rinkeby",
           bridgeAddress : "0x70CAE200E036045Ab4e328724E2DC8107C01dc56",
          },
          {   id : "43113",
          name : "Avalanche TestNet",
          network: "Avalanche",
          bridgeAddress : "0x943DB53F06465AE05f99B70A725ebebeBAB0D7C8",
         }
         
     
            ]
    
}

const getters = {}
const actions = {
    async approveSpend({state},data){
        
        window.currentasset1   =  await new window.web3.eth.Contract( ERC20Abi , data.address);
       await window.currentasset1.methods.approve(state.activeNetwork.bridgeAddress ,window.web3.utils.toBN(window.web3.utils.toWei(data.amount)).toString() ).send({from: this.state.currentUser.user.address});
         
    },
    async loadAssets({state, commit} ){
        
        let id = await window.web3.eth.getChainId();
        let network = {};
        state.networks.forEach(net => {
            if(net.id == id){
                network = net;
                commit("setActiveNetwork" ,network );
            }
        });
        window.bridge   =  await new window.web3.eth.Contract( bridgeAbi ,network.bridgeAddress);
      let nativeAssets = await window.bridge.methods.getnativeAssetsList().call({from: this.state.currentUser.user.address});
      let foriegnAssets = await window.bridge.methods.getforiegnAssetsList().call({from: this.state.currentUser.user.address});
      commit("clearAssets");
    //   nativeassets.forEach(async (asset) => 
    let wrappedAssets = [];
    commit("setaddress" , this.state.currentUser.user.address);

      for(let asset of foriegnAssets)
      {
        window.currentasset   =  await new window.web3.eth.Contract( ERC20Abi ,asset);
        let name = await window.currentasset.methods.name().call({from: this.state.currentUser.user.address});
        let symbol = await window.currentasset.methods.symbol().call({from: this.state.currentUser.user.address});
        let balance = await window.currentasset.methods.balanceOf(this.state.currentUser.user.address).call({from: this.state.currentUser.user.address});
        let chainID = await window.bridge.methods.foriegnAssetChain(asset).call({from: this.state.currentUser.user.address});
        wrappedAssets.push({
            id : Math.floor(Math.random() * 1000) + 1,
            name : name,
            symbol  : symbol,
            address : asset,
            balance : window.web3.utils.fromWei(balance),
            networkID : chainID,
           
        })

      }
      commit("addWrappedAssets" , wrappedAssets);
      let nativeAssetss = []
        for(let asset of nativeAssets ){ 
         window.currentasset   =  await new window.web3.eth.Contract( ERC20Abi ,asset);
        let name = await window.currentasset.methods.name().call({from: this.state.currentUser.user.address});
        let symbol = await window.currentasset.methods.symbol().call({from: this.state.currentUser.user.address});
        let balance = await window.currentasset.methods.balanceOf(this.state.currentUser.user.address).call({from: this.state.currentUser.user.address});
        let supportedChains = await window.bridge.methods.getSupportedchainIds(asset).call({from: this.state.currentUser.user.address});
        nativeAssetss.push({
            id : Math.floor(Math.random() * 1000) + 1,
            name : name,
            symbol  : symbol,
            address : asset,
            supportedChains :supportedChains,
            balance :  window.web3.utils.fromWei(balance)
        })
       

      } 
      
      commit("addNativeAssets" , nativeAssetss);
    },
    // getAssetSupportedNetworks({commit}, address){
    //     let id = await window.web3.eth.net.getId();
    //     if(network.id == id){
    //         window.bridge   =  await new window.web3.eth.Contract( bridgeAbi ,network.bridgeAddress);
    //         let supportedChains = await window.bridge.methods.getSupportedchainIds(address).call({from: this.state.currentUser.user.address});
    
    //     }
    // }
}

const mutations = {
    clearAssets(state){
        state.wrappedAssets = null;
        state.nativeAssets = null;
        state.wrappedAssets = [];
        state.nativeAssets = [];
    },
    addWrappedAssets(state , assets){
        state.wrappedAssets = assets;
    } ,
    addNativeAssets(state , assets){
        state.nativeAssets = assets;
    },
    setaddress(state ,  address){
        state.address = address;
    },
    setActiveNetwork(state , network){
        state.activeNetwork = network;
    }
    
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}