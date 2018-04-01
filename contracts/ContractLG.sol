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
    function ContractLG() public {
        title = "Contract for Landing Gears for B777 Fleet within Etihad";
        status = "INITIATED";
        commencementDate = "DD-MM-20YY";
        tenure = "10 years";
        warranty = "5 years";
        eyAddress = "Etihad Airways P.J.S.C.,POB 35566,Abu Dhabi,United Arab Emirates.";
        partyAddress = "Star Gears, Gears Street, P.O Box 162738, Machines";
        contractDescription = "This is the first version of the contract";
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