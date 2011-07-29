

function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"") };
	

Selenium.prototype.doAlertmsg = function (locator, value) {
    /**
    *  this displays a msg to the user and writes such to the log
    *  the test script is paused until the user responds to the alert msg
    *
    */
    alert(value); // this gets auto logged...
};


Selenium.prototype.doTypeStuff = function(locator,value){
/*
    locator is valid xpath or selenium target
    value provides what stuff to type based upon the below input...
    
    
    #   (pound sound)   = any number
    _   (underscore)    = any letter
    *   (asteric)       = any typeable character
 
    /   escapte char    
    /#          = a number
    ///'        = /'
    
    [] spcefic -> single<- letter or digit that are allowed OR a range 
    {} is always a quantifier for a -> single <- letter or digit what preceeds it
    || provides a method for a range of numeric values from lowest to highest
    [] {} all allow for ranges i.e. a - dash implies a range from lowest to higest
    
    [0-9]       = a digit from 0 to 9
    [5-8]       = a digit from 5 to 8
    [a-Z]       = a letter from lowercase a to uppercase Z
    [3-9]{15}   = 15 digits long each digit can be 3 thru 9
    Z[a-z]{10}  = Capital Z followed by 10 lower case letters
    [A-Z][a-z]{3-15} = a Capital Letter followed by 3-15 lower case letters
    Z.[ab12]     = Z (.) period followed by either an a or b or 1 or 2
    [ZT], this  = Z, this  or T, this
    [a-g]{12]   = 12 letters a-g
    #{27}       = 27 digits
    
    |1-24|      = any number from 1 to 24 
    |7.2-9|     = any number from 7.2 to 9

    spaces between [] {} and ||  are ignored
*/
 
    var element = this.page().findElement(locator);
    var tmpexp = trim(value);
    var allowedNums = "0123456789";
    var allowedAlpha = "abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var allowedPunc = " .,!:;?/|{}()$%^&#+-/<>=_\@\\\~\`\""
    var allowedChars='';
    var achar='';
    var anintchar;
    var rnum;
    var rstring='';
    var fstring='';
    var fromval='';
    var toval='';
    var dashpos;
    var canbe='';
    var endbrkpos;1
    var btwnbrks;
    var declen=0;
    var frmlen=0;
    var tolen=0;
    var perpos=0;
    var frmrcount;
    var torcount;
    var rcount;
    var rval;
    var lastchar='';
    var controlChars="#_*[/|";
    
    
    while (tmpexp.length > 0) {
 
        frmrcount = 1;
        torcount = 1;
        allowedChars = ""  ;
        canbe='';
        fromval='';
        toval='';
        rcount=1; // always have at least one char if get this far...
        
        achar = tmpexp.substring(0,1);
        
        if (achar == '#')  
            canbe = allowedNums; 
            
        if (achar == '_') 
            canbe = allowedAlpha;
            
        if (achar == '*') 
            canbe = allowedNums + allowedAlpha + allowedPunc; 
             
        if (achar == '/') {
             rstring+=tmpexp.substring(2,1)
             tmpexp = tmpexp.substring(1); 
             rcount=-1; } //  we have our char...
             
        if (achar=='|') {
            // need to parse the string between the brackets
            fstring = tmpexp.substring(1);
            endbrkpos = fstring.indexOf("|");
            btwnbrks = tmpexp.substring(1,endbrkpos+1);
            btwnbrks = btwnbrks.replace(" ","");
            // will always have a dash .... but just in case will check...
            if (btwnbrks.indexOf("-") > 0) {
                dashpos = btwnbrks.indexOf("-");
                fromval = btwnbrks.substring(0,dashpos);
                toval = btwnbrks.substring(dashpos+1) ; 
                // now we need to see if have a float or int 
                rval = -1.0;
                if ( fromval.indexOf(".") >=0  || toval.indexOf(".") >=0  ) {
                    // get decimal length...
                    
                    frmlen = fromval.substring(fromval.indexOf(".") +1).length;
                    tolen = toval.substring(toval.indexOf(".") + 1).length;
                    if ( frmlen >= tolen)
                        declen = frmlen;
                    else
                        declen = tolen;
                    fromval = parseFloat(fromval);
                    toval = parseFloat(toval); 
                    while (rval < fromval || rval > toval) 
                        // random returns number btwn 0 and 1
                        rval = Math.random() * (toval - fromval + 1) + fromval;
                    fstring=rval.toString();
                    perpos = fstring.indexOf(".");
                    fstring = fstring.substring(0,perpos+declen + 1);
                    rstring+= fstring;
                    }
                else {
                    fromval = parseInt(fromval);
                    toval = parseInt(toval); 
                    while (rval < fromval || rval > toval)
                        // Math.floor rounds down to the nearest int
                        rval = Math.floor(Math.random() * (toval - fromval + 1) + fromval);
                    rstring += rval.toString(); 
                    }
                rcount = -1;
                tmpexp = tmpexp.substring(endbrkpos);
                }
             }
             
             
        if (achar=='[') {
            // need to parse the string between the brackets
            endbrkpos = tmpexp.indexOf("]");
            btwnbrks = tmpexp.substring(1,endbrkpos+1);
            btwnbrks = btwnbrks.replace(" ","");
            // now does it have a dash (-) in it?
            if (btwnbrks.indexOf("-") > 0) {
                dashpos = btwnbrks.indexOf("-");
                fromval = btwnbrks.substring(0,dashpos);
                toval = btwnbrks.substring(dashpos+1)  ;
                }
            else
                canbe = btwnbrks;
                
            tmpexp = tmpexp.substring(endbrkpos);
            }   
              
        // now see if have qualifier i.e. { as the next char
        if (tmpexp.substring(2,1) == "{") {
           endbrkpos = tmpexp.indexOf("}");
           btwnbrks = tmpexp.substring(2,endbrkpos+1);
           btwnbrks = btwnbrks.replace(" ","");
           if (btwnbrks.indexOf("-") > 0) {
                dashpos = btwnbrks.indexOf("-");
                frmrcount = parseInt(btwnbrks.substring(0,dashpos));
                torcount = parseInt(btwnbrks.substring(dashpos+1));
                if (frmrcount <= torcount) {
                    rcount = -1;
                    
                    // this doesn't work some times goes into infinity.... grap...
                    while (rcount < frmrcount || rcount > torcount)
                        rcount = Math.floor(Math.random() * (torcount - frmrcount + 1) + frmrcount); 
                    }
                }
            else
                rcount = parseInt(btwnbrks); 
            tmpexp = tmpexp.substring(endbrkpos)
            }

        if (canbe != '' ) 
            allowedChars = canbe;
        else {
            if (fromval.length >0 && toval.length > 0 && fromval <= toval) {
                allowedChars="";
                while (fromval <= toval) {
                    allowedChars += fromval;
                    anintchar = fromval.charCodeAt(0);
                    anintchar += 1; 
                    fromval =  String.fromCharCode(anintchar); 
                    }
                }
            }
            
        if (controlChars.indexOf(achar) < 0) 
            rstring+= achar;
        else {
            while (rcount > 0) {
                rnum= Math.floor(Math.random() * allowedChars.length);
                rstring+= allowedChars.substring(rnum,rnum+1); 
                rcount=rcount-1; 
                }
            }
            
        if (tmpexp.length > 1 ) 
            tmpexp = tmpexp.substring(1);
        else 
            tmpexp = "";
        }
  
    this.browserbot.replaceText(element, "");
    if (rstring.length > 0) {
        lastchar =  rstring[( rstring.length ) -1 ];
        rstring = rstring.substring(0,((rstring.length) - 1) );
        }
    this.browserbot.replaceText(element,  rstring);
    this.doTypeKeys(locator,lastchar);
 
    LOG.info("Typed: " + rstring + lastchar);  
};



Selenium.prototype.doClickLabels = function(locator,value){
/*
locator     is not used
value       is/are the labels to be clicked on

Example     ClickLabels  |     | 1,2,3   will click on labels 1, 2 and 3

Great routine when have 30 labels on a page to click on, can do it all from
   one command.
*/

  var indexs = trim(value);
  var xpath = "xpath=(//label)"
  var anindex;
  var clickon;
  
  while ( indexs.length > 0 ) {
    
    if (indexs.indexOf(",") > 0) {
        anindex=indexs.substring(0,indexs.indexOf(","));
        indexs = indexs.substring(indexs.indexOf(",")+1); }
    else {
        anindex=indexs;
        indexs=""; }
    
    clickon = xpath + "[" + anindex + "]"
    this.doClick(clickon);
    
    // log what we did....
    LOG.info("Clicked on: " + clickon);  
    } 
};


Selenium.prototype.doTypeRDate = function(locator,value){
 /**
    This function will type a random date into the locator provided
    Example TypeRDate | locator | value
    locator can be xpath in short or long format
    long format example //x:html/x:body...etc..
    short format example xpath=(input)[2]

    value can be blank or a date or date configuration

    Date format is mm/dd/yy[yy]  ( with the slashes)
    mm can be 1 or 2 digits
    dd can be 1 or 2 digits
    yyyy  || yy  4 or 2 digit year

    Example:  3/9/2011 is March 9th 2011
    
    a date configuration string can also be used
    # is placeholder for any number
    
    thus    #/#/##      will give a randomly generated date of the form 3/5/34
            ##/##/####  will give a randomly generated date of the form 10/19/2014
            #/##/#####  will give a randomly generated date of the form 1/19/1917
 

    range of  dates is  + or - 100 years depending on the format used...
    i.e. if a generated two digit year + 2000 is > this year then year = 19XX else 20XX

    oh yes you could make this function a little smaller, but I didn't want to include a date library....
*/
 
     // All locator-strategies are automatically handled by "findElement"
    var element = this.page().findElement(locator);
    var dateStr = trim(value);
    var rmonth="";
    var ryear="";
    var rday="";
    var lastchar='';
    var isadate = true;
    var tempstr="";
    var firstslash=0;
    var secondslash=0;
    var max=0;
    var min=0;
    var d = new Date();
    var curyear = parseInt(d.getFullYear());
    var yearlen=0;
    var i=0;
    var monthdays = new Array();
    
    monthdays[0] = 31; // Jan
    monthdays[1] = 28; // feb
    monthdays[2] = 31; // mar
    monthdays[3] = 30; // apr
    monthdays[4] = 31; // may
    monthdays[5] = 30; // june
    monthdays[6] = 31; // july
    monthdays[7] = 31; // aug
    monthdays[8] = 30; // sept
    monthdays[9] = 31; // oct
    monthdays[10] = 30; // nov
    monthdays[11] = 31; // dec
  
//  alert("here to start dateStr=" + dateStr);

    var  format = "MDY";
    var reg1 = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{2}$/
    var reg2 = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{4}$/
    
   if ( dateStr.indexOf("#") <  0 ) {
       // check if they passed us a valid date
       if ( (reg1.test(dateStr) == false) && (reg2.test(dateStr) == false) ) {isadate=false; } else {
           var parts = dateStr.split(RegExp.$1); // Split into 3 parts based on what the divider was
           // Check to see if the 3 parts end up making a valid date
           if (format.substring(0, 1) == "M") { var mm = parts[0]; } else _
              if (format.substring(1, 2) == "M") { var mm = parts[1]; } else { var mm = parts[2]; }
           if (format.substring(0, 1) == "D") { var dd = parts[0]; } else _
              if (format.substring(1, 2) == "D") { var dd = parts[1]; } else { var dd = parts[2]; }
           if (format.substring(0, 1) == "Y") { var yy = parts[0]; } else _
              if (format.substring(1, 2) == "Y") { var yy = parts[1]; } else { var yy = parts[2]; }
           if (parseFloat(yy) <= 50) { yy = (parseFloat(yy) + 2000).toString(); }
           if (parseFloat(yy) <= 99) { yy = (parseFloat(yy) + 1900).toString(); }
           var dt = new Date(parseFloat(yy), parseFloat(mm)-1, parseFloat(dd), 0, 0, 0, 0);
           if (parseFloat(dd) != dt.getDate()) { isadate = false; } else {
                if (parseFloat(mm)-1 != dt.getMonth()) { isadate =false; } 
                }
            }
        if (isadate == false) {
            // log the error and return
            LOG.error("TypeRDate Invalid Date: " + dateStr);
            return; 
            } 
       } 
    else
       {
        tempstr = dateStr;
        while (tempstr.length > 0)
            {
            achar = tempstr.substring(0,1);
            if (achar == "/" )
                {
                if (firstslash == 0) { firstslash = i; } else { secondslash= i; }
                }
            else 
                {
                if (firstslash == 0) { rmonth = rmonth + achar ; }
                if (firstslash > 0 && secondslash == 0) { rday = rday + achar; }
                if (firstslash > 0 &&  secondslash > 0) { ryear = ryear + achar; }
                }
            i = i+1;
            tempstr = tempstr.substring(1);
            }
            
        if (rmonth == "##" || rmonth == "#"  ) {
            if (rmonth == "##") { max=12;min=10; }
            if (rmonth == "#")  { max=9;min=1;  }
            rmonth = -1;
            while (rmonth< min || rmonth > max)
                rmonth =  Math.floor(Math.random() * (max-min +1)  + min);  // twelve months in a year
            }
            
        yearlen = ryear.length;
        if (ryear == "####" || ryear == "##"  ) {
            ryear = Math.floor(Math.random() * 99)  // we have 100 year possible spread
            if (yearlen > 2) {
                if (ryear + 2000 > curyear )  
                    ryear = ryear + 1900;
                else
                    ryear = ryear + 2000;
                }
            }
        if (ryear % 400 == 0 || (ryear % 100 != 0 && ryear % 4 == 0))
            monthdays[1] = 29; // feb leap year
            
        if (rday == "##" || rday == "#") {
            if (rday == "##") { max=31;min=10; }
            if (rday == "#")  { max=9;min=1;  }
            rday = -1;
            while (rday < min || rday > max)
                rday =  Math.floor(Math.random() * (max-min + 1)  + min);  // max days of the month 
            }
        
        dateStr = rmonth + "/" + rday + "/" + ryear;
        }
        
    // clear the field
    this.browserbot.replaceText(element, "");


    if (dateStr.length > 0) {
        lastchar =  dateStr[( dateStr.length ) -1 ];
        dateStr = dateStr.substring(0, (( dateStr.length) - 1) );
        }
    this.browserbot.replaceText(element,  dateStr);
    this.doTypeKeys(locator,lastchar);



    // now write the first name to the log
    LOG.info("Date Typed: " + dateStr + lastchar);
};
 

Selenium.prototype.doClickRLab = function(locator,value) {
    /**
    *
    This function will click randomly on any label that is on the current page
    Example, say the page has 15 labels ( xapth=(//label) ) 
    and we want to click randomly on any label between 5 and 15
    Then the call would be  ClickRLab  |  5  |  15  
    */
    var minrandomval;
    var maxrandomval;
    var randomnum;
    var xpath="//label";
    
    minrandomval = locator;
    maxrandomval = trim(value);
    
  
    if (minrandomval.length <= 0)
         minrandomval=1;
         
    if (maxrandomval.length <=0)
      maxrandomval = this.browserbot.evaluateXPathCount(xpath, this.browserbot.getDocument());
    
    // make sure no dumb user input....
    if (maxrandomval < minrandomval)
        {
         LOG.error("Random Click Label ERROR!!! MaxVal: " + maxrandomval + "Less than MinVal: " + minrandomval);
        return; 
        } 

    // now get a random number based upon the parms passed to the function
    if (maxrandomval == minrandomval)
        {
        randomnum = maxrandomval;
        }
    else
        {
        randomnum = -1
        while (randomnum < minrandomval  || randomnum > maxrandomval )
            {
            randomnum = Math.floor(Math.random() * ( maxrandomval+1));
            }
        }
        
    // now we have the random number to use to click on the label with
    xpath="xpath=(//label)[" + randomnum + "]"
    this.doClick(xpath);
    
    // log what we did....
    LOG.info("Clicked Label: xpath=((/label)[" + randomnum + "]");
        
    
};

 
Selenium.prototype.doSelectROpt= function(locator,value) 

{
//  SELECT RANDOM OPTION ......
// locator is valid xpath expression or xpath=validexpression
// if value is provided then it is the option to be selected, else a random option is selected
// if value = "all" then will randomly select all selects on the current web page....

var numoptions;
var randomoption;
var option;
var xopath;
var passedopt=trim(value.toLowerCase());
var i;
var doing_all=false;

// append the /option  to get the optoins that the locator has
// remember locator comes into us with an xpath long form so able to append the option finder to it....
// need to strip off xpath= if the locator starts with it
// for some reason the xpathcount doesn't like having it there....

if ( passedopt.indexOf("all") >= 0 )
    {
        xopath="(//select)";
        i= this.browserbot.evaluateXPathCount(xopath, this.browserbot.getDocument());
        doing_all=true;
    }
else
     i = 1;

while (i > 0)
    {
    if (doing_all == true)
          xopath = "(//select)[" + i + "]/option";
    else
        {
        if (locator.indexOf("xpath=") >= 0 )
           xopath = locator.substring(6) + "/option";
        else
          xopath=locator + "/option" ;
        }

    numoptions = this.browserbot.evaluateXPathCount(xopath, this.browserbot.getDocument());
    randomoption = Math.floor(Math.random() * numoptions);

    if (passedopt.length > 0 && doing_all == false) { // alert("suing passedop=" + passedopt);
            randomoption=value; }

    if (doing_all == true)
        {
            xopath= "xpath=(//select)[" + i + "]"
        }
    else
        {
        if (locator.indexOf("xpath=") < 0 )
           xopath= "xpath=" + locator;
        else
           xopath= locator;
        }
              
    this.doSelect(xopath,"index=" + randomoption);
    option = this.getSelectedValue(xopath);

    // now write  to the log
    LOG.info("Option: " + option + " Index #: " + randomoption + " Selected out of: " + numoptions + " Options");
    i=i-1;

    }
};


