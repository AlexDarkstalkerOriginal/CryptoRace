var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Account = require("nebulas").Account;
var Transaction = require("nebulas").Transaction;
var Unit = require("nebulas").Unit;
var neb = new Neb();
neb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));

var NebPay = require("nebpay");   
var nebPay = new NebPay();
var dappAddress = "n22D5DqmPnpcSWnKr6NUg44arhF2E9dSyfr";

// онлоад
  window.onload = function(){         
    if(typeof(webExtensionWallet) === "undefined"){     
          $(".noExtension").show();   
          $(".content").hide();
      }else{          
      }
  };  
// онлоад

var hash_value = '';

var vm = new Vue({
  el: '.app',
  data: {      
    cars_market: [],
    cars_race: [],
    pack_cars: [],
    player_cars: [],
    ranked_players: [],
    cars_race_battleground: [],
    my_cars: [],   
    user_lvl: 0,
    user_exp: 0,
    nitro: 0,
    energy: 0,
    user_current: 0,
    id_pack: 0,
    id_defender: 0,
    id_attacker: 0,
    id_car: 0,
    tab_garage: false,
    tab_my_cars: true,    
    tab_market: false,    
    tab_race: false,
    tab_packs: false,
    tab_congrat: false,
    tab_player: false,
    tab_ranked: false,
    tab_achive: false,
    tab_battleground_race: false,
    no_cars: false
  },
   methods: {
    sell: function(id) {      
      $('.sell_fake').trigger('click');
      vm.id_car = id;
    },   
    unsell: function(id) {      
      var to = dappAddress;
      var value = 0;
      var callFunction = 'offMarket';          
      var id = id;
      var args = [];
      args.push(id);
      var callArgs = JSON.stringify(args);
      nebPay.call(to, value, callFunction, callArgs, { 
        listener: cbUnsellTrans
      }); 
    },   
    buy: function (id, price) {
      var to = dappAddress;
      var value = price;
      var callFunction = 'buyCar';          
      var id = id;      
      var args = [];
      args.push(id);      
      var callArgs = JSON.stringify(args);
      nebPay.call(to, value, callFunction, callArgs, { 
        listener: cbUnsellTrans
      }); 
    },
    attack_race: function(id) {
      $('.attack_fake').trigger('click');          
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMyCars';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMyCars,        
      });
      vm.id_defender = id;        
    },
    attack_init: function (id) {
      var to = dappAddress;
      var value = 0;
      var callFunction = 'fight';
      var attacker = id;
      var road = 0;
      vm.id_attacker = id;
      var defender = vm.id_defender;
      var args = [];
      args.push(attacker);
      args.push(defender);
      args.push(road);
      var callArgs = JSON.stringify(args);    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbCarsRace
      }); 
    },
  }
})  

// маркет темплейт
    Vue.component('car-market', {
    props: ['id', 'name', 'luck', 'robust', 'controllability', 'speed', 'src', 'rarity', 'owner', 'price'],
    template: `<div class="car">
                <div class="visual_wrap">
                  <img v-bind:src="src" alt="">\
                </div>          
                <h2 v-bind:class="rarity">{{name}}</h2>          
                <span class="price">{{price}} NAS</span>
                <div class="stats_car">
                  <span class="speed"><span class="value">{{speed}}</span> km/h</span>              
                  <span class="lucky">lucky: <span class="value">{{luck}}</span></span>
                  <span class="reliability">robust: <span class="value">{{robust}}</span></span>
                  <span class="handling">handling: <span class="value">{{controllability}}</span></span>
                 </div>
                <div class="owner">owner: <span class="value">{{owner}}</span></div>
                <button v-on:click="vm.buy(id, price)" class="buy">Buy</button>
              </div>`,
    })
// маркет темплейт

// результат гонки темплейт
    Vue.component('car-race', {
    props: ['id', 'name', 'luck', 'robust', 'controllability', 'speed', 'src', 'rarity', 'owner', 'boolen', 'draw', 'time'],
    template: `<div class="car">
                  <div class="visual_wrap">
                    <img v-bind:src="src" alt="">\
                  </div>          
                  <h2 v-bind:class="rarity">{{name}}</h2>          
                  <div class="stats_car">
                    <span class="speed"><span class="value">{{speed}}</span> km/h</span>              
                  <span class="lucky">lucky: <span class="value">{{luck}}</span></span>
                  <span class="reliability">robust: <span class="value">{{robust}}</span></span>
                  <span class="handling">handling: <span class="value">{{controllability}}</span></span>
                  </div>                  
                  <div class="owner">owner: <span class="value">{{owner}}</span></div>
                  <span class="time_race">Result time: {{time}} min</span>                  
                  <div v-if="boolen" class="result win">Winner</div><div v-else class="result loose">Looser</div>\
                  <div v-if="draw" class="result draw">Draw</div>\                                                  
                </div>`,
    })
// результат гонки темплейт

// машины из пака темплейт
    Vue.component('car-congrat', {
    props: ['id', 'name', 'luck', 'robust', 'controllability', 'speed', 'src', 'rarity'],
    template: `<div class="car">
                <div class="visual_wrap">
                  <img v-bind:src="src" alt="">\
                </div>          
                <h2 v-bind:class="rarity">{{name}}</h2>          
                <div class="stats_car">
                  <span class="speed"><span class="value">{{speed}}</span> km/h</span>              
                  <span class="lucky">lucky: <span class="value">{{luck}}</span></span>
                  <span class="reliability">robust: <span class="value">{{robust}}</span></span>
                  <span class="handling">handling: <span class="value">{{controllability}}</span></span>
                </div>
                <button v-on:click="vm.sell(id)" class="sell">Sell</button>
              </div>`,
    })
// машины из пака темплейт

// машины игрока темплейт
    Vue.component('car-player', {
    props: [''],
    template: `<div class="car">
                <div class="visual_wrap">
                  <img src="img/Porsche.png" alt="">
                </div>          
                <h2 class="legend">Ferrari</h2>         
                <div class="stats_car">
                  <span class="speed"><span class="value">197</span> km/h</span>              
                  <span class="lucky">lucky: <span class="value">70</span></span>
                  <span class="reliability"robust: <span class="value">90</span></span>
                  <span class="handling">handling: <span class="value">10</span></span>
                </div>                    
              </div>`,
    })
// машины игрока темплейт

// май карс темплейт
    Vue.component('my-cars', {
    props: ['id', 'name', 'luck', 'robust', 'controllability', 'speed', 'src', 'bool', 'rarity'],
    template: `<div class="car">
                  <div class="visual_wrap">
                    <img v-bind:src="src" alt="">\
                  </div>          
                  <h2 v-bind:class="rarity">{{name}}</h2>                            
                  <div class="stats_car">
                    <span class="speed"><span class="value">{{speed}}</span> km/h</span>              
                    <span class="lucky">lucky: <span class="value">{{luck}}</span></span>
                    <span class="reliability">robust: <span class="value">{{robust}}</span></span>
                    <span class="handling">handling: <span class="value">{{controllability}}</span></span>
                  </div>
                  <button v-if="bool" v-on:click="vm.unsell(id)" class="unsell sell">Unsell</button><button v-else v-on:click="vm.sell(id)" class="sell">Sell</button>
                </div>`,    
    })
// май карс темплейт

// май карс попап темплейт
    Vue.component('my-cars-popup', {
    props: ['id', 'name', 'luck', 'robust', 'controllability', 'speed', 'src', 'bool', 'rarity'],
    template: `<div class="car">
                  <div class="visual_wrap">
                    <img v-bind:src="src" alt="">\
                  </div>          
                  <h2 v-bind:class="rarity">{{name}}</h2>                            
                  <div class="stats_car">
                    <span class="speed"><span class="value">{{speed}}</span> km/h</span>              
                    <span class="lucky">lucky: <span class="value">{{luck}}</span></span>
                    <span class="reliability">robust: <span class="value">{{robust}}</span></span>
                    <span class="handling">handling: <span class="value">{{controllability}}</span></span>
                  </div>
                  <button v-on:click="vm.attack_init(id)" class="attack">Attack</button>
                </div>`,                    
    })
// май карс попап темплейт

// ранкед игроков темплейт
  // <div class="player_info">
  //               <span class="name">Nilko</span><img src="img/edit.png" alt="" class="edit">
  //               <span class="exp">exp <span class="current">20</span>/<span class="full">100</span></span>
  //               <span class="lvl"><span class="value">1</span> lvl</span>
  //               <span class="adress">owner: <span class="value">n1JNiQyqSq96kjfAafRao393YW84dFvCR9m</span></span>
  //             </div>
  Vue.component('rank-player', {
    props: ['id', 'lvl', 'owner'],
    template: `<div class="player_info">                                
                <span class="lvl"><span class="value">{{lvl}}</span> lvl</span>
                <span class="adress">owner: <span class="value">{{owner}}</span></span>
              </div>`,
    })
// ранкед игроков темплейт

// вкладки гонки темплейт
   Vue.component('cars-race-battleground', {
    props: ['id', 'name', 'luck', 'robust', 'controllability', 'speed', 'src', 'bool', 'rarity', 'owner'],
    template: `<div class="car">
                <div class="visual_wrap">
                  <img v-bind:src="src" alt="">\
                </div>          
                <h2 v-bind:class="rarity">{{name}}</h2>                          
                <div class="stats_car">
                  <span class="speed"><span class="value">{{speed}}</span> km/h</span>              
                    <span class="lucky">lucky: <span class="value">{{luck}}</span></span>
                    <span class="reliability">robust: <span class="value">{{robust}}</span></span>
                    <span class="handling">handling: <span class="value">{{controllability}}</span></span>
                </div>          
                <div class="owner">owner: <span class="value">{{owner}}</span></div>
                <button v-on:click="vm.attack_race(id)" class="race">Race</button>
              </div>`,
    })
// вкладки гонки темплейт

// переключение табов
  $('.tab_garage').click(function(){
    vm.tab_garage = false;
    vm.tab_my_cars = true;
    vm.tab_market = false;
    vm.tab_race = false;
    vm.tab_packs = false;
    vm.tab_congrat = false;
    vm.tab_player = false;
    vm.tab_ranked = false;
    vm.tab_achive = false;
    vm.tab_battleground_race = false;
    vm.no_cars = false;
    get_user_info();
  });
  $('.tab_race').click(function(){
    vm.tab_garage = false;
    vm.tab_my_cars = false;
    vm.tab_market = false;
    vm.tab_race = false;
    vm.tab_packs = false;
    vm.tab_congrat = false;
    vm.tab_player = false;
    vm.tab_ranked = false;
    vm.tab_achive = false;
    vm.tab_battleground_race = true;
    vm.no_cars = false;
    get_user_info();
  });
  $('.tab_market').click(function(){
    vm.tab_garage = false;
    vm.tab_my_cars = false;
    vm.tab_market = true;
    vm.tab_race = false;
    vm.tab_packs = false;
    vm.tab_congrat = false;
    vm.tab_player = false;
    vm.tab_ranked = false;
    vm.tab_achive = false;
    vm.tab_battleground_race = false;
    vm.no_cars = false;
    get_user_info();
  });
  $('.tab_market').click(function(){
    vm.tab_garage = false;
    vm.tab_my_cars = false;
    vm.tab_market = true;
    vm.tab_race = false;
    vm.tab_packs = false;
    vm.tab_congrat = false;
    vm.tab_player = false;
    vm.tab_ranked = false;
    vm.tab_achive = false;
    vm.tab_battleground_race = false;
    vm.no_cars = false;
    get_user_info();
  });
  $('.tab_packs').click(function(){
    vm.tab_garage = false;
    vm.tab_my_cars = false;
    vm.tab_market = false;
    vm.tab_race = false;
    vm.tab_packs = true;
    vm.tab_congrat = false;
    vm.tab_player = false;
    vm.tab_ranked = false;
    vm.tab_achive = false;
    vm.tab_battleground_race = false;
    vm.no_cars = false;
    get_user_info();
  });
  $('.tab_ranked').click(function(){
    vm.tab_garage = false;
    vm.tab_my_cars = false;
    vm.tab_market = false;
    vm.tab_race = false;
    vm.tab_packs = false;
    vm.tab_congrat = false;
    vm.tab_player = false;
    vm.tab_ranked = true;
    vm.tab_achive = false;
    vm.tab_battleground_race = false;
    vm.no_cars = false;
    get_user_info();
  });
  $('.tab_achieve').click(function(){
    vm.tab_garage = false;
    vm.tab_my_cars = false;
    vm.tab_market = false;
    vm.tab_race = false;
    vm.tab_packs = false;
    vm.tab_congrat = false;
    vm.tab_player = false;
    vm.tab_ranked = false;
    vm.tab_achive = true;
    vm.tab_battleground_race = false;
    vm.no_cars = false;
    get_user_info();
  });
// переключение табов

// попапы
  $('.popup').magnificPopup({
    type:'inline',
    fixedContentPos: true, 
    mainClass: 'mfp-fade',      
    showCloseBtn: true,
    closeOnBgClick: false
  });   

  $('.transaction').magnificPopup({
    type:'inline',
    fixedContentPos: true, 
    mainClass: 'mfp-fade',      
    showCloseBtn: true,
    closeOnBgClick: false
  });   
// попапы

// документ.реди
  $(document).ready(function(){
    var to = dappAddress;
    var value = 0;
    var callFunction = 'getMyCars';
    var callArgs = "[]";    
    nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbMyCars
    });        
    var callFunction2 = 'getMyInfo';
    nebPay.simulateCall(to, value, callFunction2, callArgs, { 
      listener: cbUser
    });        
  })
// документ.реди  и гет май карс

// сбМайКарс  и гет май карс
  $('.tab_garage').click(function(){
    var to = dappAddress;
    var value = 0;
    var callFunction = 'getMyCars';
    var callArgs = "[]";    
    nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbMyCars
    });   
  });

  function cbMyCars(resp) {    
    get_user_info();
    if (resp.result == "Error: You don't have any car") {
      vm.tab_garage = false;
      vm.tab_my_cars = false;
      vm.tab_market = false;
      vm.tab_race = false;
      vm.tab_packs = false;
      vm.tab_congrat = false;
      vm.tab_player = false;
      vm.tab_ranked = false;
      vm.tab_achive = false;
      vm.tab_battleground_race = false;
      vm.no_cars = true;
    } else {           
      vm.my_cars = [];
      var my_cars_arr = JSON.parse(resp.result);      
      $.each(my_cars_arr, function(index,value){
        if (my_cars_arr[index].sale == 1) {          
          my_cars_arr[index].bool = true;
        } else {
          my_cars_arr[index].bool = false;
        };
        my_cars_arr[index].name = fix_name(my_cars_arr[index].name);
        vm.my_cars.push(my_cars_arr[index]);
      })
    }
  }  
// сбМайКарс  и гет май карс

// гет пак
  $('.buy_packs button').click(function () {
    var to = dappAddress;    
    var callFunction = 'getCars';
    var callArgs = [];    
    var pack_id = $(this).attr('pack-id');        
    vm.id_pack = pack_id;    
    callArgs.push(pack_id);
    callArgs = JSON.stringify(callArgs);
    if (pack_id == 2) {
      var value = 0.01;
    } else {  
      var value = 0; 
    };
    nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbCheckGetPack
    });   
  })  

  function cbCheckGetPack(resp) { 
    get_user_info();   
    if (resp.result == 'true') {     
      var to = dappAddress;    
      var callFunction = 'getCars';
      var callArgs = [];                
      callArgs.push(vm.id_pack);
      callArgs = JSON.stringify(callArgs);
      if (vm.id_pack == 2) {
        var value = 0.01;
      } else {  
        var value = 0; 
      };
      nebPay.call(to, value, callFunction, callArgs, { 
        listener: cbPackTrans
      });         
    } else {
      $('.err_result').html('<h1>' + resp.result + '</h1>')
    }
  }
// гет пак 

// обработчик транзакции на гет пак
  function cbPackTrans(resp) {
    hash_value = resp.txhash;    
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                                    
        clearInterval(reload_trans);                          
          get_user_info();
          vm.tab_garage = false;
          vm.tab_my_cars = false;
          vm.tab_market = false;
          vm.tab_race = false;
          vm.tab_packs = false;
          vm.tab_congrat = true;
          vm.tab_player = false;
          vm.tab_ranked = false;
          vm.tab_achive = false;
          vm.tab_battleground_race = false;
          vm.no_cars = false;

          var to = dappAddress;
          var value = 0;
          var callFunction = 'getMyCars';
          var callArgs = "[]";    
          nebPay.simulateCall(to, value, callFunction, callArgs, { 
            listener: cbCongrat
          });        

      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);   
  }

  function cbCongrat(resp) {
    var pack_arr = JSON.parse(resp.result);            
    vm.pack_cars = [];
    var length = pack_arr.length;
    vm.pack_cars.push(pack_arr[length- 1]);
    vm.pack_cars.push(pack_arr[length - 2]);        
    vm.pack_cars.push(pack_arr[length - 3]);            
    for (var i = 0; i < 3; i++) {            
      vm.pack_cars[i].name = fix_name(vm.pack_cars[i].name);      
    }            
  }
// обработчик транзакции на гет пак

// фикс нейм
  function fix_name (name) {    
    switch(name) {
      case '3.1':  
        var resp = 'Bentley';
        return resp;
        break;
      case '3.2':  
        var resp = 'Rolls Royce';
        return resp;
        break;
      case '3.3':  
        var resp = 'Jaguar';
        return resp;
        break;
      case '3.4':  
        var resp = 'Ferrari';
        return resp;
        break;
      case '3.5':  
        var resp = 'Porsche';
        return resp;
        break;
      case '2.1':  
        var resp = 'Smart';
        return resp;
        break;
      case '2.2':  
        var resp = 'Volvo';
        return resp;
        break;
      case '2.3':  
        var resp = 'Nissan';
        return resp;
        break;
      case '2.4':  
        var resp = 'Chevrolet';
        return resp;
        break;
      case '2.5':  
        var resp = 'Tesla';
        return resp;
        break;
      case '1.1':  
        var resp = 'Reno';
        return resp;
        break;
      case '1.2':  
        var resp = 'Wolkswagen';
        return resp;
        break;
      case '1.3':  
        var resp = 'Mazda';
        return resp;
        break;
      case '1.4':  
        var resp = 'BMW';
        return resp;
        break;
      case '1.5':  
        var resp = 'Lexus';
        return resp;
        break;        
      default:
        break;
    }
  }
// фикс нейм

// продать машину
   $('#sell .sell').click(function(){
    var to = dappAddress;
    var value = 0;
    var callFunction = 'goMarket';
    var prize = $('#sell input').val();
    var id_this = vm.id_car;
    var args = [];
    args.push(id_this);
    args.push(prize);    
    var callArgs = JSON.stringify(args);    
    nebPay.call(to, value, callFunction, callArgs, { 
      listener: cbTransactionSell              
    });        
    })

    function cbTransactionSell(resp) {   
     hash_value = resp.txhash;    
      if (resp.txhash == undefined) {
       } else {
        $('.transaction').trigger('click');
        $('.hash').html('txHash: <p>' + hash_value + '</p>');           
      } 

      var reload_trans = setInterval(function(){
        neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
          result_trans = receipt.status;        
        if (result_trans == 1) {
          $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
          setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                            
          $('.tab_market').trigger('click');                
          get_user_info();
          clearInterval(reload_trans);                                  
        } else if (result_trans == 2) {
          $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
        } else {
          $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
          setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
          clearInterval(reload_trans);          
        }
        })}, 1000);  
      }  
// продать машину

// гет маркет  
  $('.tab_market').click(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getAllCarsOnMarket';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMarketCars              
      });    
  })

  function cbMarketCars(resp) {      
      var market_cars = JSON.parse(resp.result);        
      vm.cars_market = [];
      get_user_info();
      $.each(market_cars,function(index,value){  
        market_cars[index].name = fix_name(market_cars[index].name);
        market_cars[index].price = market_cars[index].price/1000000000000000000;
        vm.cars_market.push(market_cars[index]);
      });
  }
// гет маркет

// обработчик ансейл
  function cbUnsellTrans(resp) {
    hash_value = resp.txhash;    
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                                    
        clearInterval(reload_trans);                          
          get_user_info();
          vm.tab_garage = false;
          vm.tab_my_cars = true;
          vm.tab_market = false;
          vm.tab_race = false;
          vm.tab_packs = false;
          vm.tab_congrat = false;
          vm.tab_player = false;
          vm.tab_ranked = false;
          vm.tab_achive = false;
          vm.tab_battleground_race = false;
          vm.no_cars = false;

          var to = dappAddress;
          var value = 0;
          var callFunction = 'getMyCars';
          var callArgs = "[]";    
          nebPay.simulateCall(to, value, callFunction, callArgs, { 
            listener: cbMyCars
          });        

      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);   
    }
// обработчик ансейл

// гет вкладку гонки 
   $('.tab_race').click(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getAllCapsForFight';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbRaceCars              
      });    
   })

    function cbRaceCars(resp) {      
      var race_cars = JSON.parse(resp.result);        
      vm.cars_race_battleground = [];
      get_user_info();
      $.each(race_cars,function(index,value){  
        race_cars[index].name = fix_name(race_cars[index].name);        
        vm.cars_race_battleground.push(race_cars[index]);
      });
    }
// гет вкладку гонки 

// обработчик гонки   
  function cbCarsRace(resp) {  
    if (resp.execute_err == '') {
      var to = dappAddress;
      var value = 0;
      var callFunction = 'fight';
      var attacker = vm.id_attacker;
      var defender = vm.id_defender;
      var road = 0;
      var args = [];
      args.push(attacker);
      args.push(defender);
      args.push(road);
      var callArgs = JSON.stringify(args);    
      nebPay.call(to, value, callFunction, callArgs, { 
        listener: cbTransactionRace
      }); 
    } else {
      $('#error_info .error').html(resp.result);      
      $('.error_info_fake').trigger('click');
    }
  }

  function cbTransactionRace(resp) {
    hash_value = resp.txhash;    
    var fight_result = JSON.stringify(resp);     
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);     
        get_user_info();
        vm.tab_garage = false;
        vm.tab_my_cars = false;
        vm.tab_market = false;
        vm.tab_race = true;
        vm.tab_packs = false;
        vm.tab_congrat = false;
        vm.tab_player = false;
        vm.tab_ranked = false;
        vm.tab_achive = false;
        vm.tab_battleground_race = false;
        vm.no_cars = false;
              
        var to = dappAddress;
        var value = 0;
        var callFunction = 'getLastH';
        var callArgs = "[]";        
        nebPay.simulateCall(to, value, callFunction, callArgs, { 
          listener: cbRaceRender
        });        

        clearInterval(reload_trans);                          
      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);   
  }

   function cbRaceRender(resp) {        
    console.log('race render ' + JSON.stringify(resp));
    get_user_info();
    var race_arr = JSON.parse(resp.result);    
    var attacker = race_arr.atacker;
    var defender = race_arr.defender;    
    var result = race_arr.res;
    attacker.name = fix_name(attacker.name);
    defender.name = fix_name(defender.name);
    attacker.time = race_arr.timeA;
    defender.time = race_arr.timeD;

    if (result == "A"){      
      defender.boolen = false;
      defender.draw = false;      
      attacker.boolen = true;
      attacker.draw = false;      
    } else if(result == "D") {
      defender.boolen = true;
      defender.draw = false;     
      attacker.boolen = false;
      attacker.draw = false;       
    } else {
      defender.boolen = false;
      defender.draw = true;     
      attacker.boolen = false;
      attacker.draw = true;       
    };

    vm.cars_race = [];
    vm.cars_race.push(attacker);
    vm.cars_race.push(defender);    
  }
// обработчик гонки 

// кнопка окей, сори
  $('.ok_err').click(function(){
    $('#error_info .mfp-close').trigger('click');
  });
  get_user_info();
// кнопка окей, сори

// гет ранкед
  $('.tab_ranked').click(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getTop';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbRanked            
      });    
  })

  function cbRanked(resp) {      
      var ranked_player = JSON.parse(resp.result);        
      vm.ranked_players = [];
      get_user_info();
      console.log('cbranked ' + JSON.stringify(resp))
      $.each(ranked_player,function(index,value){          
        vm.ranked_players.push(ranked_player[index]);
      });
  }
// гет ранкед

// юзер инфо
  function get_user_info() {
    var to = dappAddress;
      var value = 0;    
      var callArgs = "[]";        
      var callFunction2 = 'getMyInfo';
      nebPay.simulateCall(to, value, callFunction2, callArgs, { 
        listener: cbUser
      });      
    }
  function cbUser(resp) {
     console.log('user ' + JSON.stringify(resp));
     var info = JSON.parse(resp.result);
     vm.user_lvl = info.lvl;
     vm.user_exp = info.expirenece;
     vm.user_current = info.current;
     vm.nitro = info.buff.nitro;
     vm.energy = info.buff.energy;
   } 
// юзер инфо
