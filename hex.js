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
Bridge = new Array(Size);
for (i=0; i<Size; i++)
  Bridge[i] = new Array(Size); 
for (i=0; i<Size; i++)
{ for (j=0; j<Size; j++)
    Bridge[i][j] = new Array(4); 
}
Upd = new Array(Size);
for (i=0; i<Size; i++)
  Upd[i] = new Array(Size); 
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
  setTimeout("GetBestMove("+eval(((MoveCount+1+Start0)%2)*2-1)+")",10);
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

function Replay()
{ if (IsRunning) { LastEvent="Replay()"; return; }  
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
  if (MoveCount==0)
  { number=random(4);
    letter=random(4-number);
    if (random(2)<1)
    { number=Size-1-number;
      letter=Size-1-letter;
    }
    MakeMove(number, letter, false);
    IsRunning=false;
    return(true);
  }
  if (MoveCount==1)
  { for (number=0; number<Size; number++)
    { for (letter=0; letter<Size; letter++)
      { if (Field[number][letter]!=0)
        { if ((number+letter<2)||(number+letter>2*Size-4)) return(false);
          if ((number+letter==2)||(number+letter==2*Size-4)) { if (random(2)<1) return(false); }
          MakeMove(number, letter, false);
          IsRunning=false;
          return(true);
        }  
      }          
    }
  }  
  return(false);
}

function MakeMove(number, letter, finished)
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
  if (! finished) return; 
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


function CheckPot()
{ var number, letter, border, addpot, mmp, PLAYEER, bb, dd=128;
  ActiveColor=((MoveCount+1+Start0)%2)*2-1;
  for (number=0; number<Size; number++)
  { for (letter=0; letter<Size; letter++)
    { for (border=0; border<4; border++)
      { Pot[number][letter][border]=20000;
        Bridge[number][letter][border]=0;
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
        Upd[number][letter]=true;
    } 
    PLAYEER=0; 
    do
    { PLAYEER++;
      bb=0;
      for (number=0; number<Size; number++)
      { for (letter=0; letter<Size; letter++)
        { if (Upd[number][letter]) bb+=SetPot(number, letter, border, 1);
        }
      }
      for (number=Size-1; number>=0; number--)
      { for (letter=Size-1; letter>=0; letter--)
        { if (Upd[number][letter]) bb+=SetPot(number, letter, border, 1);
        }
      }
    }
    while ((bb>0)&&(PLAYEER<12));
  }
  for (border=2; border<4; border++)//red potential
  { for (number=0; number<Size; number++)
    { for (letter=0; letter<Size; letter++)
        Upd[number][letter]=true;
    } 
    PLAYEER=0; 
    do
    { PLAYEER++;
      bb=0;
      for (number=0; number<Size; number++)
      { for (letter=0; letter<Size; letter++)
        { if (Upd[number][letter]) bb+=SetPot(number, letter, border, -1);
        }
      }
      for (number=Size-1; number>=0; number--)
      { for (letter=Size-1; letter>=0; letter--)
        { if (Upd[number][letter]) bb+=SetPot(number, letter, border, -1);
        }
      }
    }
    while ((bb>0)&&(PLAYEER<12));
  }
}

var corner=new Array(6);
function SetPot(number, letter, border, ActCol)
{ Upd[number][letter]=false;
  Bridge[number][letter][border]=0;
  if (Field[number][letter]==-ActCol) return(0);
  var ll, addpot, corcon=0, PLAYEER, finished=0, dd=140, bb=66;
  if (ActCol!=ActiveColor) bb=52;
  corner[0]=PotVal(number+1,letter,border,ActCol);
  corner[1]=PotVal(number,letter+1,border,ActCol);
  corner[2]=PotVal(number-1,letter+1,border,ActCol);
  corner[3]=PotVal(number-1,letter,border,ActCol);
  corner[4]=PotVal(number,letter-1,border,ActCol);
  corner[5]=PotVal(number+1,letter-1,border,ActCol);
  for (ll=0; ll<6; ll++)
  { if ((corner[ll]>=((30000)))&&(corner[(ll+2)%6]>=30000))
    { if (corner[(ll+1)%6]<0) corcon+=32;
      else corner[(ll+1)%6]+=128; //512;
    }
  }  
  for (ll=0; ll<6; ll++)
  { if ((corner[ll]>=30000)&&(corner[(ll+3)%6]>=30000))
    { corcon+=30;
    }
  }
  addpot=30000;
  for (ll=0; ll<6; ll++)
  { if (corner[ll]<0)
    { corner[ll]+=30000;
    }

    if (addpot>corner[ll]) addpot=corner[ll];     
  }

  
  if ((number>0)&&(number<Size-1)&&(letter>0)&&(letter<Size-1)) Bridge[number][letter][border]+=corcon;
  else Bridge[number][letter][border]-=2;
  if (((number==0)||(number==Size-1))&&((letter==0)||(letter==Size-1))) Bridge[number][letter][border]/=2; // /=4
  if (Bridge[number][letter][border]>68) Bridge[number][letter][border]=68; //66
  
  if (Field[number][letter]==ActCol)
  { if (addpot<Pot[number][letter][border]) 
    { Pot[number][letter][border]=addpot;
      SetUpd(number+1,letter,ActCol);
      SetUpd(number,letter+1,ActCol);
      SetUpd(number-1,letter+1,ActCol);
      SetUpd(number-1,letter,ActCol);
      SetUpd(number,letter-1,ActCol);
      SetUpd(number+1,letter-1,ActCol);
      return(1);
    }  
    return(0);
  }
  if (addpot+dd<Pot[number][letter][border]) 
  { Pot[number][letter][border]=addpot+dd;
    SetUpd(number+1,letter,ActCol);
    SetUpd(number,letter+1,ActCol);
    SetUpd(number-1,letter+1,ActCol);
    SetUpd(number-1,letter,ActCol);
    SetUpd(number,letter-1,ActCol);
    SetUpd(number+1,letter-1,ActCol);  
    return(1);
  }  
  return(0);
}

function PotVal(number,letter,border,ActCol)
{ if (number<0) return(30000);
  if (letter<0) return(30000);
  if (number>=Size) return(30000);
  if (letter>=Size) return(30000);
  if (Field[number][letter]==0) return(Pot[number][letter][border]);
  if (Field[number][letter]==-ActCol) return(30000);
  return(Pot[number][letter][border]-30000);
}

function SetUpd(number,letter,ActCol)
{ if (number<0) return;
  if (letter<0) return;
  if (number>=Size) return;
  if (letter>=Size) return;
  Upd[number][letter]=true;
}



function random(PLAYEER)
{ return(Math.floor(Math.random()*1000)%PLAYEER);
}





function sign(x)
{ if (x<0) return(-1);
  if (x>0) return(1);
  return(0);
}  

function GetBestMove(theCol)
{ var number, letter, border, number_b, letter_b, ff=0, number_q=0, letter_q=0, ActCol, pp0, pp1;
  corner=new Array();
  
  
  if (MoveCount>0) ff=190/(MoveCount*MoveCount);
  addpot=20000;
  for (number=0; number<Size; number++)
  { for (letter=0; letter<Size; letter++)
    { if (Field[number][letter]!=0)
      { number_q+=2*number+1-Size;
        letter_q+=2*letter+1-Size;
      }
    }
  }
  number_q=sign(number_q);
  letter_q=sign(letter_q);
  for (number=0; number<Size; number++)
  { for (letter=0; letter<Size; letter++)
    { if (Field[number][letter]==0)
      { mmp=Math.random();
        mmp+=(Math.abs(number-5)+Math.abs(letter-5))*ff;
        mmp+=8*(number_q*(number-5)+letter_q*(letter-5))/(MoveCount+1);
        pp0=Pot[number][letter][0]+Pot[number][letter][1];
        pp1=Pot[number][letter][2]+Pot[number][letter][3];
        mmp+=pp0+pp1;
        if ((pp0<=268)||(pp1<=268)) mmp-=400; //140+128
        corner[number*Size+letter]=mmp;          
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
  if (theCol<0)
  { if ((Pot[number_b][letter_b][2]>140)||(Pot[number_b][letter_b][3]>140)) {return; }
    window.document.OptionsForm.Msg.value=" Red has won !";
    Blink(-2);
  }
  else
  { if ((Pot[number_b][letter_b][0]>140)||(Pot[number_b][letter_b][1]>140)) {return; }
    window.document.OptionsForm.Msg.value=" Blue has won !";
    Blink(-2);
  }
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
  window.document.OptionsForm.HelpButton.focus();
  window.document.OptionsForm.HelpButton.blur();
}  

function RefreshPic(number, letter)
{ window.document.images[ImgNum[number][letter]].src = Pic[1+Field[number][letter]].src;
  if (MoveCount<10)
    window.document.OptionsForm.Moves.value=" "+eval(MoveCount)+" ";

  else
    window.document.OptionsForm.Moves.value=MoveCount;
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

function Help()
{ alert("Hex is a board game for two players. It was"+
      "\nindependently invented by Piet Hein in 1942"+
      "\nand John Nash in 1948 and became popular"+
      "\nafter 1950 under the name Hex."+
      "\nHex is most commonly played on a board with"+
      "\n11x11 cells, but it can also be played on a"+
      "\nboard of another size. The red player trys"+
      "\nto connect the two red borders with a chain"+
      "\nof red cells by coloring empty cells red,"+
      "\nwhile the blue player trys the same with the"+
      "\nblue borders."+
      "\nThe game can never end with a draw:"+
      "\nWhen all cells have been colored, there must"+
      "\nexists either a red chain or a blue chain."+
      "\nThe player who moves first has a big advantage."+
      "\nIn order to compense this, there is often used"+
      "\nthe so-called 'swap rule': After the first move,"+
      "\nthe second player is allowed to swap the sides."+
      "\nIn order to apply the swap rule click again on"+
      "\nthe cell which was selected in the first move."+
      "\nGood luck!");
}

function Blink(PLAYEER)
{ IsRunning=true;
  if (PLAYEER==-2)
  { setTimeout("Blink(-1)",10);
    return;
  }
  if (PLAYEER==-1)
  { CheckPot();
    setTimeout("Blink(0)",10);
    return;
  }    
  if (PLAYEER==14)
  { IsRunning=false;
    return;
  }
  var number, letter, ActCol=(PLAYEER%2)*(((MoveCount+Start0)%2)*2-1);  
  for (number=0; number<Size; number++)
  { for (letter=0; letter<Size; letter++)
    { if ((Pot[number][letter][0]+Pot[number][letter][1]<=0)||(Pot[number][letter][2]+Pot[number][letter][3]<=0))
      { Field[number][letter]=ActCol;
        RefreshPic(number, letter);
      }  
    }    
  }
  setTimeout("Blink("+eval(PLAYEER+1)+")",200);
}