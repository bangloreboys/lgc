pragma solidity ^0.4.18;

contract ContractLG {
    // title & status
    string title;
    string status;   // INITIATED, IN-RFP, IN-NEGOTIATION, SIGNED, AMENDMENT1, AMENDMENT2
    // contract validity
    string commencementDate;
    string tenure;
    string warranty;
    //address
    string eyAddress;
    string partyAddress;
    // desc
    string contractDescription;

    // constructor
    //function ContractLG(string _title, string _status, string _commdate, string _tenure, string _warranty, string _eyaddress, string _partyaddress, string _contdesc) public {
    function ContractLG() public {
        title = "Contract for Landing Gears for B777 Fleet within Etihad";
        //title = _title;
        status = "INITIATED";
        //status = _status;
        commencementDate = "DD-MM-20YY";
        //commencementDate = _commdate;
        tenure = "10 years";
        //tenure = _tenure;
        warranty = "5 years";
        //warranty = _warranty;
        eyAddress = "Etihad Airways P.J.S.C.,POB 35566,Abu Dhabi,United Arab Emirates.";
        //eyAddress = _eyaddress;
        partyAddress = "Star Gears, Gears Street, P.O Box 162738, Machines";
        //partyAddress = _partyaddress;
        contractDescription = "This is the first version of the contract";
        //contractDescription = _contdesc;
    }

    // getter functions
    function viewStatus() public view returns (string) {
        return status;
    }
    function viewTitle() public view returns (string) {
        return title;
    }
    function viewValidity() public view returns (string, string, string) {
        return (commencementDate, tenure, warranty);
    }
    function viewAddress() public view returns (string, string) {
        return (eyAddress, partyAddress);
    }
    function viewDescription() public view returns (string) {
        return contractDescription;
    }

    // setter functions
    function setStatus(string pstatus) public {
        status = pstatus;
    }
    function setTitle(string ptitile) public {
        title = ptitile;
    }
    function setValidity(string pdate, string ptenure, string pwarranty) public {
        commencementDate = pdate;
        tenure = ptenure;
        warranty = pwarranty;
    }
    function setAddress(string peyaddress, string ppartyaddress) public {
        eyAddress = peyaddress;
        partyAddress = ppartyaddress;
    }
    function setDescription(string pdescription) public {
        contractDescription = pdescription;
    }
}