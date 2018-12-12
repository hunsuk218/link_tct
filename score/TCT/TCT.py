from iconservice import *

TAG = 'TCTDapp'

class TCTDapp(IconScoreBase):
    _PERSON_NAME = '_person_name'
    _CAR_OWNER = '_car_owner'
    _REPAIR_COUNT = '_repair_count'
    _REPAIR_DATA = '_repiar_data'
    _ESCROW_ADDR = '_escrow_addr'
    
    def __init__(self, db: IconScoreDatabase) -> None:
        super().__init__(db)

        self._person_name = DictDB(self._PERSON_NAME, db, value_type=str)       #person name
        self._car_owner = DictDB(self._CAR_OWNER, db, value_type=Address)       #car Owner
        self._repair_count = DictDB(self._REPAIR_COUNT, db, value_type=int)     #count
        self._repair_data = DictDB(self._REPAIR_DATA, db, value_type=str, depth=2)       #repiar Data
        self._escrow_addr = VarDB(self._ESCROW_ADDR,db, value_type=Address)

    def on_install(self) -> None:
        """
            when deployed then this start.
            for first setting.
            ex) token Address 
        """
        super().on_install()
        
    def on_update(self) -> None:
        super().on_update()
    
    def isPerson(self, _from:Address) -> bool:
        if self._person_name[_from] == "":
            return False
        else:
            return True

    def isCar(self, _carNumber: str) -> bool:
        if self._car_owner[_carNumber] == None:
            return False
        else:
            return True
    
    @external
    def setEscrowAddr(self, _addr:Address):
        if self.msg.sender != self.owner:
            revert("It is only for owner")
        
        self._escrow_addr.set(_addr)

    @external
    def setPersonName(self, _name: str):
        if self.isPerson(self.msg.sender):
            revert("already person registed")
        else:
            self._person_name[self.msg.sender] = _name
            Logger.debug(f'Set Person')
            
    @external
    def setCar(self, _carNumber: str):
        if self.isCar(_carNumber):
            revert("already car registed")
        else:
            if self.isPerson(self.msg.sender):
                self._car_owner[_carNumber] = self.msg.sender
                Logger.debug(f'set car')
            else:
                revert("regist person first")
    
    @external(readonly=True)
    def getCarOwner(self, _carNumber: str) -> Address:
        return self._car_owner[_carNumber]
    
    @external(readonly=True)
    def getPersonName(self, _addr :Address) -> str:
        return self._person_name[_addr]

    @external(readonly=True)
    def getRepairCount(self, _carNumber: str) -> int:
        return self._repair_count[_carNumber]

        
    @external
    def setRepairInfo(self, _carNumber: str, _repairInfo: str, _repairStatus: str):
        if not self.isCar(_carNumber):
            revert("check car number OR regist car first")

        if not self.isPerson(self.msg.sender):
            revert("regist first")
        
        count = 0
        count = self.getRepairCount(_carNumber)
        count += 1
        self._repair_count[_carNumber] = count

        repairData = {
            'FROM' : self.msg.sender.__str__(),
            'REPAIRINFO' : _repairInfo,
            'REPAIRSTATUS' : _repairStatus,
            'REPAIRTIME' : self.now()
        }
        repairDataStr = json_dumps(repairData)
        
        self._repair_data[_carNumber][count] = repairDataStr
        Logger.debug(f'set repair data!! good!')
    

    #@external(readonly=True)
    #def getRepairInfo(self, _carNumber:str, _carCount : int) -> str:
        #return self._repair_data[_carNumber][_carCount]

    @external(readonly=True)
    def getRepairInfo(self, _carNumber:str, _carCount : int) -> dict:
        repairData = json_loads(self._repair_data[_carNumber][_carCount]) 
        return repairData

    @external
    def ownerChange(self, _from : Address, _to : Address, _carNumber : str):
        if self.msg.sender != self._escrow_addr.get():
            revert("It is only excuted from escrow!!")
        else:
            self._car_owner[_carNumber] = _to

