<template>
    <div>
    <button class="btn btn-primary connect-button" v-if="!user.id" @click="login">Connect</button>
    <button class="btn connect-address" v-if="user.id">{{addressFormated}}</button>
    </div>
</template>
<script>
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
// const evmChains = window.evmChains;
// Web3modal instance
let web3Modal
// import  {bridgeAbi , ERC20Abi} from "../store/modules/abi";
var Web3 = require('web3');
// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount;
export default {
    data(){
        return {
          
        }
    },
    computed: {
    user : function(){
     return this.$store.state.currentUser.user;
   },
    addressFormated : function(){
     if(!this.user.address) return "";
     return this.user.address.substring(0 ,6) + "...." + this.user.address.substring(this.user.address.length -4 ,this.user.address.length)
   },
    },
    mounted () {
       this.init();
    
    if(!this.user.address){
      this.onConnect();
    }
    },
   methods : {
    openMenu(){
    this.menu = !this.menu;
    },
    async  addGoulToMetaMask(){
const tokenAddress = '0x0A4F3Ba339f930f8E1373e1Bb4935A630c382e5F';
const tokenSymbol = 'GHOUL';
const tokenDecimals = 18;
const tokenImage = '';

try {
  // wasAdded is a boolean. Like any RPC method, an error may be thrown.
  const wasAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20', // Initially only supports ERC20, but eventually more!
      options: {
        address: tokenAddress, // The address that the token is at.
        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
        decimals: tokenDecimals, // The number of decimals in the token
        image: tokenImage, // A string url of the token logo
      },
    },
  });

  if (wasAdded) {
    console.log('Thanks for your interest!');
  } else {
    console.log('Your loss!');
  }
} catch (error) {
  console.log(error);
}
    },   
async  addGdaiToMetaMask(){
const tokenAddress = '0x0138391b1edf11911C74717392645238d0Da1Fd9';
const tokenSymbol = 'gDai';
const tokenDecimals = 18;
const tokenImage = '';

try {
  // wasAdded is a boolean. Like any RPC method, an error may be thrown.
  const wasAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20', // Initially only supports ERC20, but eventually more!
      options: {
        address: tokenAddress, // The address that the token is at.
        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
        decimals: tokenDecimals, // The number of decimals in the token
        image: tokenImage, // A string url of the token logo
      },
    },
  });

  if (wasAdded) {
    console.log('Thanks for your interest!');
  } else {
    console.log('Your loss!');
  }
} catch (error) {
  console.log(error);
}
    },
    async init() {
      console.log("Initializing example");
        console.log("WalletConnectProvider is", WalletConnectProvider);
        console.log("Fortmatic is", Fortmatic);
        console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);
        
        // Check that the web page is run in a secure context,
        // as otherwise MetaMask won't be available
        // if(location.protocol !== 'https:') {
        //   // https://ethereum.stackexchange.com/a/62217/620
        //   const alert = document.querySelector("#alert-error-https");
        //   alert.style.display = "block";
        //   document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
        //   return;
        // }

        // Tell Web3modal what providers we have available.
        // Built-in web browser provider (only one can exist as a time)
        // like MetaMask, Brave or Opera is added automatically by Web3modal
        const providerOptions = {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              // Mikko's test key - don't copy as your mileage may vary
              infuraId: "d2ae878adfc8418fb4f4d73eefa31332",
            }
          },

         
        };

        web3Modal = new Web3Modal({
          cacheProvider: false, // optional
          providerOptions, // required
          disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
        });

        console.log("Web3Modal instance is", web3Modal);
    },
    async onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
     

     
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    console.log(accounts);
    this.fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    console.log(chainId);
    this.fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    console.log(networkId);
    this.fetchAccountData();
  });

  await this.refreshAccountData();
},
async  refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  // document.querySelector("#connected").style.display = "none";
  // document.querySelector("#prepare").style.display = "block";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  // document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await this.fetchAccountData(provider);
  // document.querySelector("#btn-connect").removeAttribute("disabled")
},
async  onDisconnect() {

  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

        selectedAccount = null;
        
        localStorage.removeItem("user");
         this.$store.dispatch("currentUser/logout" );
         this.dialog = false
      },
      logout(){
         localStorage.removeItem("user");
         this.$store.dispatch("currentUser/logout" );
         this.dialog = false
      },
      login(){
        this.$store.dispatch('metamask/innitaliseWeb3').then(
            response =>{
              console.log(response);
              this.$store.dispatch('metamask/validateMetamaskAvailable')
              .then(
            response =>{
              console.log(response);
              this.$store.dispatch('metamask/loginMetaMask').then(
              () =>  {
                    this.$toast.success("login successful");
                    this.$store.dispatch("currentUser/setUser" , localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user"))  : {});
              }) 
            }
            ).catch (
                error => {
                    this.$toast.error(error);
                }
            )
            }
        ).catch (
            error => {
                this.$toast.error(error);
            }
        )
        },
 async  fetchAccountData() {

// Get a Web3 instance for the wallet
const web3 = new Web3(provider);
console.log("Web3 instance is", web3);
window.web3 = web3;

// Get list of accounts of the connected wallet
const accounts = await web3.eth.getAccounts();

// MetaMask does not give you all accounts, only the selected account
console.log("Got accounts", accounts);
selectedAccount = accounts[0];
console.log(selectedAccount)
const chainId = await web3.eth.getChainId();
console.log(chainId);
        let user = {};
        user.id  =  Math.floor(Math.random() * 1000) + 1;
        user.address = accounts[0];
        this.$store.dispatch("currentUser/setUser" , user);


  this.$store.dispatch("swap/loadAssets" );

// Because rendering account does its own RPC commucation
// with Ethereum node, we do not want to display any results
// until data for all accounts is loaded


}
  }
}
</script>