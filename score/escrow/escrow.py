from iconservice import *

TAG = 'TCTescrow'

class tctDappInterface(InterfaceScore):
    @interface
    def getCarOwner(self, _carNumber:str) -> Address:
        pass

    @interface
    def ownerChange(self, _from : Address, _to : Address, _carNumber : str):
        pass



class TokenInterface(InterfaceScore):
    @interface
    def transfer(self, _to: Address, _value: int, _data: bytes=None):
        pass
    
    @interface
    def transferFrom(self, fromAddr: Address, toAddr: Address, value: int) -> bool:
        pass


class TCTescrow(IconScoreBase):
    _ESCROW_DATA = '_escrow_data'
    _ESCROW_COUNT = '_escrow_count'
    _TCTDAPP_ADDR = '_tctdapp_addr'
    _TOKEN_ADDR = '_token_addr'

    def __init__(self, db: IconScoreDatabase) -> None:
        super().__init__(db)
        self._escrow_data = DictDB(self._ESCROW_DATA, db, value_type=str)
        self._escrow_count = VarDB(self._ESCROW_COUNT, db, value_type=int)
        self._tctdapp_addr = VarDB(self._TCTDAPP_ADDR, db, value_type=Address)
        self._token_addr = VarDB(self._TOKEN_ADDR, db, value_type=Address)

    def on_install(self) -> None:
        super().on_install()

    def on_update(self) -> None:
        super().on_update()

    def isOwner(self) -> bool:
        if self.msg.sender != self.owner:
            revert("only owner")
            return False
        else:
            return True

    @external
    def setTokenAddr(self, _addr: Address):
        if self.isOwner():
            self._token_addr.set(_addr)

    @external
    def setTCTAddr(self, _addr: Address):
        if self.isOwner():
            self._tctdapp_addr.set(_addr)

    @external(readonly=True)
    def getTokenAddr(self) -> Address:
        return self._token_addr.get()
    
    @external(readonly=True)
    def getTCTAddr(self) -> Address:
        return self._tctdapp_addr.get()
    
    @external
    def tokenFallback(self, _from: Address, _value: int, _data: bytes):
        if self.msg.sender != self._token_addr.get():
            revert("Unknown token address")

    @external
    def createEscrow(self, _carNumber: str, _price: int, _buyer: Address) -> int:
        tctDapp = self.create_interface_score(self._tctdapp_addr.get(), tctDappInterface)
        if self.msg.sender != tctDapp.getCarOwner(_carNumber):
            revert("only car owner can sell car")
        
        escrowCount = self._escrow_count.get()
        escrowCount += 1

        escrowData = {
            "CARNUMBER" : _carNumber,
            "PRICE" : _price,
            "SELLER" : self.msg.sender.__str__(),
            "BUYER" : _buyer.__str__(),
            "DEPOSITED" : False,
            "BUYERAPPROVE" : False,
            "SELLERAPPROVE" : False,
            "START" : self.now(),
            "LIVED" : True
        }

        escrowDataStr = json_dumps(escrowData)

        self._escrow_data[escrowCount] = escrowDataStr
        self._escrow_count.set(escrowCount)
        return escrowCount

    @external(readonly=True)
    def getEscrowStr(self, _orderNumber : int) -> str:
        return self._escrow_data[_orderNumber]

    @external(readonly=True)
    def getEscrow(self, _orderNumber : int) -> dict:
        return json_loads(self._escrow_data[_orderNumber])

    @external 
    def deposit(self, _orderNumber : int):
        escrowData = json_loads(self._escrow_data[_orderNumber])
        if escrowData["DEPOSITED"] == True:
            revert("already DEPOSITED")
        if Address.from_string(escrowData["BUYER"]) != self.msg.sender:
            revert("is not buyer")

        token_score = self.create_interface_score(self._token_addr.get(), TokenInterface)
        token_score.transferFrom(self.msg.sender,self.address ,escrowData["PRICE"])
        
        escrowData["DEPOSITED"] = True
        self._escrow_data[_orderNumber] = json_dumps(escrowData)


    @external
    def approveEscrow(self, _orderNumber : int):
        escrowData = json_loads(self._escrow_data[_orderNumber])
        
        if self.msg.sender != Address.from_string(escrowData["SELLER"]) and self.msg.sender != Address.from_string(escrowData["BUYER"]):
            revert("you are not buyer or seller")

        if self.msg.sender == Address.from_string(escrowData["BUYER"]) and escrowData["DEPOSITED"] == True:
            escrowData["BUYERAPPROVE"] = True
        
        if self.msg.sender == Address.from_string(escrowData["SELLER"]):
            escrowData["SELLERAPPROVE"] = True
        
        if escrowData["SELLERAPPROVE"] and escrowData["BUYERAPPROVE"]:
            #token transfer to Seller
            token_score = self.create_interface_score(self._token_addr.get(), TokenInterface)
            token_score.transfer(Address.from_string(escrowData["SELLER"]),escrowData["PRICE"])
            
            #owner change seller to buyer
            tctDapp = self.create_interface_score(self._tctdapp_addr.get(), tctDappInterface)
            tctDapp.ownerChange(Address.from_string(escrowData["SELLER"]), Address.from_string(escrowData["BUYER"]), escrowData["CARNUMBER"])
            
            escrowData["LIVED"] = False
        
        self._escrow_data[_orderNumber] = json_dumps(escrowData)
