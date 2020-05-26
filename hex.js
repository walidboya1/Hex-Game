var i, j, IsOver=true, IsStart0=true, Start0, Size=11, IsRunning=false, LastEvent="";
var MoveCount, MaxMoveCount, MaxField=Size*Size, IsSwap, ActiveColor=0;
IsPlayer = new Array(2);
ImgNum = new Array(Size);
for (i=0; i<Size; i++)
  ImgNum[i] = new Array(Size);
Field = new Array(Size);
for (i=0; i<Size; i++)
  Field[i] = new Array(Size);
Pot = new Array(Size);
for (i=0; i<Size; i++)
  Pot[i] = new Array(Size); 
for (i=0; i<Size; i++)
{ for (j=0; j<Size; j++)
    Pot[i][j] = new Array(4); 
}

update = new Array(Size);
for (i=0; i<Size; i++)
  update[i] = new Array(Size); 
History = new Array(MaxField+1);
for (i=0; i<MaxField+1; i++)
  History[i] = new Array(2);
Pic= new Array(3);
Pic[0] = new Image();
Pic[0].src = "red.png";
Pic[1] = new Image();
Pic[1].src = "white.png";
Pic[2] = new Image();
Pic[2].src = "blue.png";


IsPlayer[0]=true;
IsPlayer[1]=false;


function Init()
{ if (IsRunning) { LastEvent="Init()"; return; }  
  var number, letter;
  for (number=0; number<Size; number++)
  { for (letter=0; letter<Size; letter++)
      Field[number][letter]=0;
  }
  if (IsStart0) Start0=true;
  else Start0=false;
  MoveCount=0;
  MaxMoveCount=0;
  RefreshScreen();
  IsOver=false;
  if ((MoveCount+Start0)%2==0) window.document.OptionsForm.Msg.value=" Blue to move.";
  else window.document.OptionsForm.Msg.value=" Red to move.";    
}

function RefreshScreen()
{ for (number=0; number<Size; number++)
  { for (letter=0; letter<Size; letter++)
    document.images[ImgNum[number][letter]].src = Pic[1+Field[number][letter]].src;
  }
  if (MoveCount<10)
    window.document.OptionsForm.Moves.value=" "+eval(MoveCount)+" ";
  else
    window.document.OptionsForm.Moves.value=MoveCount;
}

function SetOption(PLAYEER, mm)
{ if (IsRunning) { LastEvent="SetOption("+PLAYEER+","+mm+")"; return; }  
  if (PLAYEER<2) 
  { if ((mm==0))
      IsPlayer[PLAYEER]=true;
    else
      IsPlayer[PLAYEER]=false;
  }
  else IsStart0=mm; 
}



function Timer()
{ if (LastEvent!="")
  { eval(LastEvent);
    LastEvent="";
    return;
  }
  if (IsOver) return;
  if (IsRunning) return;
  if (IsPlayer[(MoveCount+Start0+1)%2]) {return; }
  IsRunning=true;

  if (SwapTest()) return;

  CheckPot();
  setTimeout("GetBestMove()",10);
}

function Back()
{ if (IsRunning) { LastEvent="Back()"; return; }  
  if (MoveCount>0)
  { IsOver=false;
    MoveCount--;
    var number=History[MoveCount][0];
    var letter=History[MoveCount][1];
    if ((MoveCount==1)&&(IsSwap))
    { Field[letter][number]=0;
      RefreshPic(letter, number);
      Field[number][letter]=((MoveCount+Start0)%2)*2-1;
      RefreshPic(number, letter);
    }
    else
    { Field[number][letter]=0;
      RefreshPic(number, letter);
    }  
    if (MoveCount<10)
      window.document.OptionsForm.Moves.value=" "+eval(MoveCount)+" ";
    else
      window.document.OptionsForm.Moves.value=MoveCount;
    if ((MoveCount+Start0)%2==0) window.document.OptionsForm.Msg.value=" Blue to move.";
    else window.document.OptionsForm.Msg.value=" Red to move.";  
  }
}

function Forward()
{ if (IsRunning) { LastEvent="Forward()"; return; }  
  if (MoveCount<MaxMoveCount)
  { var number=History[MoveCount][0];
    var letter=History[MoveCount][1];
    if (MoveCount<MaxMoveCount-1) { MakeMove(number, letter, false);}  
    else MakeMove(number, letter, true);     
  }
}


function SwapTest()
{ if (! window.document.OptionsForm.Swap.checked) return(false);
  var number, letter;
  if (MoveCount==1)
  { for (number=0; number<Size; number++)
    { for (letter=0; letter<Size; letter++)
      { if (Field[number][letter]!=0)
        {
          MakeMove(number, letter, false);
          IsRunning=false;
          return(true);
        }  
      }          
    }
  }  
  return(false);
}

function MakeMove(number, letter, playerturn)
{ var ActColol, border, numbers=number, letters=letter;
  if (MoveCount==1)
  { if (Field[number][letter]!=0)
    { Field[number][letter]=0;
      RefreshPic(number, letter);
      numbers=letter; 
      letters=number;
      IsSwap=1;
    } 
    else IsSwap=0; 
  }
  ActColol=((MoveCount+1+Start0)%2)*2-1;
  Field[numbers][letters]=ActColol;
  RefreshPic(numbers, letters);
  if (History[MoveCount][0]!=number)
  { History[MoveCount][0]=number;
    MaxMoveCount=MoveCount+1;
  }
  if (History[MoveCount][1]!=letter)
  { History[MoveCount][1]=letter;
    MaxMoveCount=MoveCount+1;
  }  
  MoveCount++;
  if (MaxMoveCount<MoveCount)
    MaxMoveCount=MoveCount;
  if (MoveCount<10)
    window.document.OptionsForm.Moves.value=" "+eval(MoveCount)+" ";
  else
    window.document.OptionsForm.Moves.value=MoveCount;  
  if ((MoveCount+Start0)%2==0) window.document.OptionsForm.Msg.value=" Blue to move.";
  else window.document.OptionsForm.Msg.value=" Red to move.";
  if ((MoveCount==2)&&(IsSwap>0))   
    window.document.OptionsForm.Msg.value=" Swap."+window.document.OptionsForm.Msg.value; 
  if (! playerturn) return; 
  CheckPot();
  if (ActColol<0)
  { if ((Pot[number][letter][2]>0)||(Pot[number][letter][3]>0)) return;
    window.document.OptionsForm.Msg.value=" Red has won !";
    Blink(0);
  }
  else
  { if ((Pot[number][letter][0]>0)||(Pot[number][letter][1]>0)) return;
    window.document.OptionsForm.Msg.value=" Blue has won !";
    Blink(0);
  }
  IsOver=true;
}

function RefreshPic(number, letter)
{ window.document.images[ImgNum[number][letter]].src = Pic[1+Field[number][letter]].src;
  if (MoveCount<10)
    window.document.OptionsForm.Moves.value=" "+eval(MoveCount)+" ";

  else
    window.document.OptionsForm.Moves.value=MoveCount;
}

function CheckPot()
{ var number, letter, border, addpot, mmp, PLAYEER, bb, dd=128;
  ActiveColor=((MoveCount+1+Start0)%2)*2-1;
  for (number=0; number<Size; number++)
  { for (letter=0; letter<Size; letter++)
    { for (border=0; border<4; border++)
      { Pot[number][letter][border]=20000;
      }  
    }    
  }
  for (number=0; number<Size; number++)
  { if (Field[number][0]==0) Pot[number][0][0]=dd;//blue border
    else
    { if (Field[number][0]>0) Pot[number][0][0]=0;
    }
    if (Field[number][Size-1]==0) Pot[number][Size-1][1]=dd;//blue border
    else
    { if (Field[number][Size-1]>0) Pot[number][Size-1][1]=0;
    }
  }
  for (letter=0; letter<Size; letter++)
  { if (Field[0][letter]==0) Pot[0][letter][2]=dd;//red border
    else
    { if (Field[0][letter]<0) Pot[0][letter][2]=0;
    }
    if (Field[Size-1][letter]==0) Pot[Size-1][letter][3]=dd;//red border
    else
    { if (Field[Size-1][letter]<0) Pot[Size-1][letter][3]=0;
    }
  }   
  for (border=0; border<2; border++)//blue potential
  { for (number=0; number<Size; number++)
    { for (letter=0; letter<Size; letter++)
        update[number][letter]=true;
    } 
    PLAYEER=0; 
    do
    { PLAYEER++;
      bb=0;
      for (number=0; number<Size; number++)
      { for (letter=0; letter<Size; letter++)
        { if (update[number][letter]) bb+=SetPot(number, letter, border, 1);
        }
      }
    }
    while ((bb>0)&&(PLAYEER<12));
  }
  for (border=2; border<4; border++)//red potential
  { for (number=0; number<Size; number++)
    { for (letter=0; letter<Size; letter++)
        update[number][letter]=true;
    } 
    PLAYEER=0; 
    do
    { PLAYEER++;
      bb=0;
      for (number=0; number<Size; number++)
      { for (letter=0; letter<Size; letter++)
        { if (update[number][letter]) bb+=SetPot(number, letter, border, -1);
        }
      }
    }
    while ((bb>0)&&(PLAYEER<12));
  }
}

var corner=new Array(6);
function SetPot(number, letter, border, ActCol)
{ update[number][letter]=false;

  if (Field[number][letter]==-ActCol) return(0);
  var ll, addpot, dd=140;
  corner[0]=Potvalue(number+1,letter,border,ActCol);
  corner[1]=Potvalue(number,letter+1,border,ActCol);
  corner[2]=Potvalue(number-1,letter+1,border,ActCol);
  corner[3]=Potvalue(number-1,letter,border,ActCol);
  corner[4]=Potvalue(number,letter-1,border,ActCol);
  corner[5]=Potvalue(number+1,letter-1,border,ActCol);

  addpot=30000;
  for (ll=0; ll<6; ll++)
  { if (corner[ll]<0)
    { corner[ll]+=30000;
    }

    if (addpot>corner[ll]) addpot=corner[ll];     
  }


  if (Field[number][letter]==ActCol) 
  { if (addpot<Pot[number][letter][border]) 
    { Pot[number][letter][border]=addpot;
      Setupdate(number+1,letter,ActCol);
      Setupdate(number,letter+1,ActCol);
      Setupdate(number-1,letter+1,ActCol);
      Setupdate(number-1,letter,ActCol);
      Setupdate(number,letter-1,ActCol);
      Setupdate(number+1,letter-1,ActCol);
      return(1);
    }  
    return(0);
  }
  if (addpot+dd<Pot[number][letter][border]) //AI CHECk
  { Pot[number][letter][border]=addpot+dd;
    Setupdate(number+1,letter,ActCol);
    Setupdate(number,letter+1,ActCol);
    Setupdate(number-1,letter+1,ActCol);
    Setupdate(number-1,letter,ActCol);
    Setupdate(number,letter-1,ActCol);
    Setupdate(number+1,letter-1,ActCol);  
    return(1);
  }  
  return(0);
}

function Potvalue(number,letter,border,ActCol)
{ if (number<0) return(30000);
  if (letter<0) return(30000);
  if (number>=Size) return(30000);
  if (letter>=Size) return(30000);
  if (Field[number][letter]==0) return(Pot[number][letter][border]);
  if (Field[number][letter]==-ActCol) return(30000);
  return(Pot[number][letter][border]-30000);
}

function Setupdate(number,letter,ActCol)
{ if (number<0) return;
  if (letter<0) return;
  if (number>=Size) return;
  if (letter>=Size) return;
  update[number][letter]=true;
}




function GetBestMove()
{ var number, letter, border, number_b, letter_b, number_q=0, letter_q=0, ActCol, pp0, pp1;
  addpot=20000;
  
  for (number=0; number<Size; number++)
  { for (letter=0; letter<Size; letter++)
    { if (Field[number][letter]==0)
      {
        mmp=0;
        pp0=Pot[number][letter][0]+Pot[number][letter][1];
        pp1=Pot[number][letter][2]+Pot[number][letter][3];
        mmp+=pp0+pp1;
        if ((pp0<=268)||(pp1<=268)) mmp-=400; //140+128        
        if (mmp<addpot)
        { addpot=mmp; 
          number_b=number;
          letter_b=letter;
        }  
      }  
    }
  }
  
  MakeMove(number_b, letter_b, false);
  IsRunning=false;
  if ((Pot[number_b][letter_b][0]>140)||(Pot[number_b][letter_b][1]>140)) {return; }
    window.document.OptionsForm.Msg.value=" Blue has won !";
    Blink(-2);
  
  IsOver=true;
}


function Clicked(number, letter)
{ if (IsOver) return;
  if (IsRunning) { LastEvent="Clicked("+number+","+letter+")"; return; }  
  if (Field[number][letter]!=0) 
  { if ((MoveCount==1)&&(window.document.OptionsForm.Swap.checked)) MakeMove(number,letter,false);
    return;
  }  
  if (! IsPlayer[(MoveCount+Start0+1)%2]) return;
  MakeMove(number, letter, true);

}  




function Help()
{ alert("1. Players choose a colour and take turns. On each turn one counter is placed in an empty hexagonal cell"+
      "\n2. Counters may not be moved except with the swap rule"+
      "\n3. The first player to form a connected path of their counters linking the opposing sides of the board marked by their colour wins"+
      "\n4. The four corner hexagons belong to both adjacent sides"+
      "\n5. Swap rule: on their first move the second player may move normally, or choose to swap their piece with that placed by the first player."+
      "[This encourages the first player to only choose a moderately strong first move and so reduces any advantage of going first."+
      " Ignore the swap rule for the first few games.]");
}

function Blink(i)
{ IsRunning=true;

  if (i==-2)
  { CheckPot();
    setTimeout("Blink(0)",10);
    return;
  }    
  if (i==14)
  { IsRunning=false;
    return;
  }
  var number, letter, ActCol=(i%2)*(((MoveCount+Start0)%2)*2-1);  
  for (number=0; number<Size; number++)
  { for (letter=0; letter<Size; letter++)
    { if ((Pot[number][letter][0]+Pot[number][letter][1]<=0)||(Pot[number][letter][2]+Pot[number][letter][3]<=0))
      { Field[number][letter]=ActCol;
        RefreshPic(number, letter);
      }  
    }    
  }
  setTimeout("Blink("+eval(i+1)+")",200);
}