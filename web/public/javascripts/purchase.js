
App = {
	web3Provider: null,
	contracts: {},
		init: function() {
		$.ajaxSetup({async: false});
	 return App.initWeb3();
	},
  
	initWeb3: function() {
	   if (typeof web3 !== 'undefined'){ //메타마스크 있는지 없는지 확인
	   App.web3Provider = web3.currentProvider;
	   web3 = new Web3(web3.currentProvider);
	 }else {
		App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
		web3 = new Web3(App.web3Provider);
	 }
  
	 return App.initContract();
	},
  
	initContract: function() {
		  $.getJSON('TCTDapp.json', function(data){
		App.contracts.TCTDapp = TruffleContract(data);//컨트랙 인스턴스화
		App.contracts.TCTDapp.setProvider(App.web3Provider);
		
	  });
  
	  $.getJSON('FlexibleToken.json', function(data){
		App.contracts.FlexibleToken = TruffleContract(data);//컨트랙 인스턴스화
		App.contracts.FlexibleToken.setProvider(App.web3Provider);
		
	  });
  
	  web3.eth.getAccounts(function(error, accounts){
		if(error) {
		  console.log(error);
		}
		
		var account = accounts[0];
  
  
  
		if(account === null || account === undefined/*회원등록해주세요 조건추가*/) //오른쪽맨위 주소 뜨게하는것
		{
		  document.getElementById("contractAddress").innerHTML="메타마스크에 로그인해주세요";
		  document.getElementById("isRegist").innerHTML = "안녕하세요";
		  $("#regiregi").attr('data-target', '#');
		}
		else{
		  
		  document.getElementById("contractAddress").innerHTML = account;
		}
  
		web3.eth.getBalance(account, function (error, result) { //이더개수 가져오는것 오른쪽 맨위
		  if (!error) {
			
			  var Ether_value = web3.fromWei(result,'ether');
		  } else {
			  console.error(error);
		  }
		  document.getElementById("Ether_value").innerHTML = Ether_value;
	
  
	  });
  
  
	  App.contracts.FlexibleToken.deployed().then(function(instance){  // 토큰개수 가져오는 것 오른쪽 맨위
		
		var token_value = instance.balanceOf(account);
		token_value.then(function(result) { 
		  document.getElementById("token_value").innerHTML = result;//will log results.
	   });
		
	  });
  
	  App.contracts.TCTDapp.deployed().then(function(instance){  //사람인지 아닌지 확인하기
		var is_person = instance.isPerson(account);
		is_person.then(function(result){
	
		  if(result === true)
		  {
				$("#enrollsubmit").submit();
			document.getElementById("isRegist").innerHTML = "안녕하세요";
			$("#regiregi").attr('data-target', '#');
			
		  }
		  else
		  {
				$("#regiregi").attr('data-target', '#modalRegisterForm');
			document.getElementById("isRegist").innerHTML = "회원등록";
		  }
		  //console.log(result);
		});
	  
	  });
  
	  App.contracts.TCTDapp.deployed().then(function(instance){
  
		var info_escrows = instance.escrows.call(3);
  
		info_escrows.then(function(result){
		  //console.log(result[3]);
		  //console.log(result);
		  
		});
		});
		
	
		App.contracts.TCTDapp.deployed().then(function(instance) {
			



			var carname_repair = document.getElementById("carname_repair").value;
			instance.getRepairCount(carname_repair).then(function(result) {
				let count = result.toNumber();
				for (let i = 0; i < count; i++) {
					instance.getRepairInfo(carname_repair, i).then(function(res) {
						
						 return res;
					}).then(function(conclude){
						var repairData = document.getElementById("repairData");
						var row = repairData.insertRow(repairData.rows.length); // 하단에 추가
						var cell1 = row.insertCell(0);
						var cell2 = row.insertCell(1);
						var cell3 = row.insertCell(2);
						var cell4 = row.insertCell(3);
						cell1.innerHTML = conclude.toString().split(",")[0];

						var str = new Array("1.후드","2.프론트휀더","3.도어","4.트렁크리드","5.라디에이터 서포트","6.쿼터패널","7.루프패널","8.사이드실 패널","9.프론트패널","10.크로스멤버","11.인사이드패널","12.사이드멤버","13.휠하우스","14.필러패널","15.대쉬패널","16.플로어패널","17.트렁크플로어","18.리어패널","19.패키지트레이");
						var str1 = new Array("교환","교체","판금/용접","수리 미완료");
						var ts = new Date(conclude.toString().split(",")[3]*1000);
							cell2.innerHTML = str[conclude.toString().split(",")[1]-1];
							cell3.innerHTML= str1[conclude.toString().split(",")[2]-1];
						  cell4.innerHTML = ts;
					});
					
				}
			
			});
			
		});




	  App.contracts.TCTDapp.deployed().then(function(instance){  //판매자 주소
		var info_escrows = instance.escrows.call(1); // 거래번호로 바꿔줘야함
		info_escrows.then(function(result){
		  var seller_CarName = result[1];
		  if(seller_CarName ==="")
		  {
			document.getElementById("seller_CarName").innerHTML = "";
		  }
		  else{
			document.getElementById("seller_CarName").innerHTML = seller_CarName;
		  }
		  
  
  
		  var seller_address = result[3]; //DB에서 가져올 정보
		  if(seller_address ==="0x0000000000000000000000000000000000000000")
		  {
			document.getElementById("seller_address").innerHTML ="";
		  }
		  else{
			document.getElementById("seller_address").innerHTML = seller_address;
		  }
		  
		  
  
		  var buyer_address = result[4];
		 
			document.getElementById("buyer_address").innerHTML = account;
		  
		  
  
  
		  var deposite_is = result[5];
		  if(deposite_is === true)
		  {
			document.getElementById("deposite_is").innerHTML = "입금완료"
		  }
		  else{
			document.getElementById("deposite_is").innerHTML = "입금대기"
		  }
  
  
		  var buyer_approve = result[6];
		  if(buyer_approve === true)
		  {
			document.getElementById("buyer_approve").innerHTML = "구매자 승인완료"
		  }
		  else{
			document.getElementById("buyer_approve").innerHTML = "구매자 승인대기"
		  }
  
		  var seller_approve = result[7];
		  if(seller_approve === true)
		  {
			document.getElementById("seller_approve").innerHTML = "구매자 승인완료"
		  }
		  else{
			document.getElementById("seller_approve").innerHTML = "구매자 승인대기"
		  }
  
  
		  var lived = result[8];
		  if(lived === true)
		  {
			document.getElementById("lived").innerHTML = "거래 진행중"
		  }
		  else{
			document.getElementById("lived").innerHTML = "거래 대기중"
		  }
		});
  
		
	  });
		});
		
		
		var carname= window.location.search.substring(16,33); 
		var _tempUrl = window.location.search.substring(34); 
		var _tempArray = _tempUrl.split('&');
		var _keyValuePair = new Array();
		for(var i = 0; i<_tempArray.length; i++)
		{
				_keyValuePair[i] = _tempArray[i].substring(7);
		}

		web3.eth.getAccounts(function(error, accounts){
			if(error) {
			console.log(error);
			}
			
			var account = accounts[0];
		  var enc =account;
		$('input[name=accountaddr]').attr('value',enc);
		});
			},
	
			


  
	
	callEther: function() {	
  
  
	web3.eth.getAccounts(function(error, accounts){
	  if(error) {
		console.log(error);
	  }
	  
	  var account = accounts[0];
	  var Ether_value = web3.fromWei(eth.getBalance(account), "ether")
	  document.getElementById("Ether_value").innerHTML = Ether_value;
	
	});
  },
  
	setPerson: function() {	
	  var Name = $('#name').val();
	 
  
	web3.eth.getAccounts(function(error, accounts){
	  if(error) {
		console.log(error);
	  }
	  
	  var account = accounts[0];
	 
  
	App.contracts.TCTDapp.deployed().then(function(instance){
		console.log(App.contracts.TCTDapp.transactionHash);
		console.log(App.contracts.TCTDapp.address);
	  return instance.setPerson(Name, {from: account});
	});
    console.log(Name);
	});
	},
	

	checkenrollcar: function() {

		web3.eth.getAccounts(function(error, accounts){
			if(error) {
			console.log(error);
			}
			var account = accounts[0];

	App.contracts.TCTDapp.deployed().then(function(instance){  //사람인지 아닌지 확인하기
		var is_person = instance.isPerson(account);
		is_person.then(function(result){
			setTimeout(function() {
			if(result ===false)
			{
					alert("회원가입 해주세요");
			}
			else if(document.joinForm.wholenumber.value.length != 17){
				alert("차대번호는 17자리로 입력해주세요!!");
					document.joinForm.wholenumber.focus();
			}
			else if(document.joinForm.carnum.value.length != 7)
			{
				alert("차량번호는 7자리로 입력해주세요!!");
			}
			else{
					App.setCar();
					document.joinForm.submit(); 
					return true;
			}
		},1);

		});
	  
		});
		
	});
	},

	checkenrollcar1: function() {

		web3.eth.getAccounts(function(error, accounts){
			if(error) {
			console.log(error);
			}
			var account = accounts[0];

	App.contracts.TCTDapp.deployed().then(function(instance){  //사람인지 아닌지 확인하기
		var is_person = instance.isPerson(account);
		is_person.then(function(result){
			setTimeout(function() {
			if(result ===false)
			{
					alert("회원가입 해주세요");
			}
			else if((document.carForm.carNum.value.length != 7) && (document.carForm.carNum.value.length != 17)){
				console.log(document.carForm.carNum.value.length);
				alert("17자나 7자를 입력해주세요!!");
					document.carForm.carNum.focus();
			}
			else{
					document.carForm.submit(); 
					return true;
			}
		},1);

		});
	  
		});
		
	});
	},
	checkenrollcar3: function() {

		web3.eth.getAccounts(function(error, accounts){
			if(error) {
			console.log(error);
			}
			var account = accounts[0];

	App.contracts.TCTDapp.deployed().then(function(instance){  //사람인지 아닌지 확인하기
		var is_person = instance.isPerson(account);
		is_person.then(function(result){
			setTimeout(function() {
			if(result ===false)
			{
					alert("회원가입 해주세요");
			}
			else if(document.joinForm.wholenumber.value.length != 17){
				alert("17자리를 입력해주세요!!");
					document.joinForm.wholenumber.focus();
			}
			else{
					App.setCar();
					document.joinForm.submit(); 
					return true;
			}
		},1);

		});
	  
		});
		
	});
	},
	
	


	
	setCar: function() {	
	  var car_registed_string = $('#car_registed_string').val();
  
	web3.eth.getAccounts(function(error, accounts){
	  if(error) {
		console.log(error);
	  }
	  
	  var account = accounts[0];
	 
  
	App.contracts.TCTDapp.deployed().then(function(instance){
	  return instance.setCar(car_registed_string, {from: account});
	});
	  console.log(account);
	});
  },
  
  setRepairInfo: function() {	
		_keyValuePair = _keyValuePair.map(Number);
var radio_val = new Array();
for(i=0; i<_tempArray.length; i++)
{
radio_val[i] = $("input[name="+ i +"]:checked").val();
radio_val = radio_val.map(Number);
}
  web3.eth.getAccounts(function(error, accounts){
	if(error) {
	  console.log(error);
	}
	
	var account = accounts[0];

  App.contracts.TCTDapp.deployed().then(function(instance){
	return instance.setRepairInfo(carname,  _keyValuePair, radio_val, {from: account});
  });
  
  });	
  },
	

  
  
  
	callCar: function() {
	  var materialContactFormName = $('#materialContactFormName').val();
  
	  web3.eth.getAccounts(function(error, accounts){
		if(error) {
		  console.log(error);
		}
	
		var account = accounts[0];
	  
		App.contracts.TCTDapp.deployed().then(function(instance){
		  
		  var count = instance.getRepairCount(materialContactFormName);
  
		  count.then(function(result){
			
			var count = result.toNumber();
			
			
			  
			return instance.getRepairInfo(materialContactFormName, 0,{from: account});
			  
			
		  }).then(function(repair_result){
			  console.log(repair_result);
  
		  })
		  
		  });
		});
  
	},
  
	withdrawCall: function() {
	  var withdraw_Address = $('#withdraw_Address').val();
	  var withdraw_value = $('#withdraw_value').val();
  
	  web3.eth.getAccounts(function(error, accounts){
		if(error) {
		  console.log(error);
		}
	
		var account = accounts[0];
  
		App.contracts.FlexibleToken.deployed().then(function(instance){
		   return instance.transfer(withdraw_Address,withdraw_value,{from: account});
		}).then(function(){
		   $('#withdraw_Address').val('');
		   $('#withdraw_value').val('');
		});
  });
	},
  
  
	ownerChange: function() {	
	  var toAddress = $('#toAddress').val();
	  var carNum_o = $('#carNum_o').val();
  
	web3.eth.getAccounts(function(error, accounts){
	  if(error) {
		console.log(error);
	  }
	  
	  var account = accounts[0];
	 
  
	App.contracts.TCTDapp.deployed().then(function(instance){
	  return instance.ownerChange(account,toAddress, carNum_o);
	}).then(function() {
	  $('#toAddress').val('');
	  $('#carNum_o').val('');    
	})
	  console.log(account);
	});
  },
	
  
	loadAccount: function() {
	  web3.eth.getAccounts(function(error, accounts){
		if(error) {
		  console.log(error);
		}
	
		var account = accounts[0];
  
		App.contracts.TCTDapp.deployed().then(function(instance){
		  return document.write(account);
		});
		
	 
  
  });
	},
  
	CoinApprove: function() {	
	  var Coin_Approve = $('#Coin_Approve').val();
	web3.eth.getAccounts(function(error, accounts){
	  if(error) {
		console.log(error);
	  }
	  
	  var account = accounts[0];
	 
  
	App.contracts.FlexibleToken.deployed().then(function(instance){
	  return instance.approve("0xb9779547EdcCAbC4a9Bc10c2444DBe02A56dEc20", Coin_Approve, {from: account});   //코인컨트랙 바뀌면 반드시 바꿔야함
	}).then(function() {
	  $('#Coin_Approve').val('');
	  //return App.callCar();
	  
	})
	  console.log(account);
	});
  },
  
  deposit: function() {	
  
	//var Trade_Num = $('#Trade_Num').val();
  web3.eth.getAccounts(function(error, accounts){
	if(error) {
	  console.log(error);
	}
	
	var account = accounts[0];
   
  
  App.contracts.TCTDapp.deployed().then(function(instance){
	 instance.deposit(2);   //거래번호 자동으로 등록되도록 '1'을 바꿔야함
  }).then(function() {
	//return App.callCar();
	
  });
	console.log(account);
  });
  },
  
  
  Create: function() {	
  
	//var Trade_Num = $('#Trade_Num').val();
  web3.eth.getAccounts(function(error, accounts){
	if(error) {
	  console.log(error);
	}
	
	var account = accounts[0];
   
  
  App.contracts.TCTDapp.deployed().then(function(instance){
	return instance.escrowCreate("BBB",1000,"0x11209149dbded216f234fc517e93eaad83e969d8", {from: account});   //차대번호 , 가격, 구매자주소순서로 변수로 바꿔주기
  }).then(function() {
	//$('#Trade_Num').val('');
	//return App.callCar();
	
  })
	console.log(account);
  });
  },
	
  
  buyerApprove: function() {	
  
	//var Trade_Num = $('#Trade_Num').val();
  web3.eth.getAccounts(function(error, accounts){
	if(error) {
	  console.log(error);
	}
	
	var account = accounts[0];
   
  
  App.contracts.TCTDapp.deployed().then(function(instance){
	return instance.Approve(2, {from: account});   //거래번호
  }).then(function() {
	//$('#Trade_Num').val('');
	//return App.callCar();
	
  })
	console.log(account);
  });
  },
  
  sellerApprove: function() {	
  
	//var Trade_Num = $('#Trade_Num').val();
  web3.eth.getAccounts(function(error, accounts){
	if(error) {
	  console.log(error);
	}
	
	var account = accounts[0];
   
  
  App.contracts.TCTDapp.deployed().then(function(instance){
	return instance.Approve(2, {from: account}); 
  }).then(function() {
	//$('#Trade_Num').val('');
	//return App.callCar();
	
  })
	console.log(account);
  });
  },
  
  
  
	listenToEvents: function() {
	  
	}
  };
  
  
  
  
  
  $(function() {
	$(window).load(function() {
	  App.init();
	  
	});
  });
