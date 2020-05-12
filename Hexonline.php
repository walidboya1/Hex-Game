<html><head>

<title>Hex Game</title>

 <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="keywords" content="">


 <link href="assets/css/core.min.css" rel="stylesheet">
    <link href="assets/css/thesaas.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">

    <!-- Favicons -->
    <link rel="icon" href="assets/logo.png">

<script type="text/javascript" src="hex.js"></script>
</head>
<body >


    <!-- Scripts -->
    <script src="assets/js/core.min.js"></script>
    <script src="assets/js/thesaas.min.js"></script>


<!--
      |‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒
      | Topbar
      |‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒
      !-->
      <nav class="topbar topbar-expand-md topbar-nav-centered">
        <div class="container">
          
          <div class="topbar-left">
            <button class="topbar-toggler">&#9776;</button>
            <a class="topbar-brand" href="index.html">

            </a>
          </div>


       

          <div class="topbar-right">
            <button class="drawer-toggler ml-12" style="color: white;">&#9776;</button>
          
<div class="drawer">
      <div class="drawer-content">
      	     <button class="drawer-close"></button>
      <div class="drawer-backdrop"></div>
      <br>
      <br>
<form name="OptionsForm">
  <div align="center">
 <div>   
     <input type="button" class="btn btn-primary" value="NEW" onclick="javascript:Init()">
     <input type="button" class="btn btn-primary" value="HELP" onclick="javascript:ShowHelp()" name="HelpButton">
</div>
   
             
        <hr>

<div>

      <input type="radio" name="Red" checked="" value="Red: Player" onclick="javascript:SetOption(0,0)"> Red: Player
      <input type="radio" name="Red" value="Red: Computer" onclick="javascript:SetOption(0,1)"> Red: Computer
          <br>
          <br>
                Level:
                  <input type="radio" name="RedLevel" value="1" onclick="javascript:SetLevel(0,1)">1
                  <input type="radio" name="RedLevel" checked="" value="2" onclick="javascript:SetLevel(0,2)">2
                  <input type="radio" name="RedLevel" value="3" onclick="javascript:SetLevel(0,3)">3

</div>
   
             
        <hr>

   
<div>
      <input type="radio" name="Blue" value="Blue: Player" onclick="javascript:SetOption(1,0)"> Blue: Player
      <input type="radio" name="Blue" checked="" value="Blue: Computer" onclick="javascript:SetOption(1,1)"> Blue: Computer

          <br>
          <br>
                Level:
                  <input type="radio" name="BlueLevel" value="1" onclick="javascript:SetLevel(1,1)">1
                  <input type="radio" name="BlueLevel" value="2" onclick="javascript:SetLevel(1,2)">2
                  <input type="radio" name="BlueLevel" checked="" value="3" onclick="javascript:SetLevel(1,3)">3

</div>
   
             
        <hr>

        
<div>
      <input type="radio" name="Start" checked="" value="Red" onclick="javascript:SetOption(2,1)"> Red begins
      <input type="radio" name="Start" value="Blue" onclick="javascript:SetOption(2,0)"> Blue begins
</div>
   
             
        <hr>

         
<div>        
      <input type="checkbox" name="Swap"  checked=""> swap rule
</div>
   
             
        <hr>

    
<div>
      <input type="button" class="btn btn-outline btn-primary px-10" value="<<" onclick="javascript:Back();Back()" title="two moves back">
      <input type="button" class="btn btn-outline btn-primary px-10" value="<" onclick="javascript:Back()" title="one move back">
      <input type="button" class="btn btn-outline btn-primary px-10" value=" 0 " disabled="" name="Moves">
      <input type="button" class="btn btn-outline btn-primary px-10" value=">" onclick="javascript:Replay()" title="one move forward">
      <input type="button" class="btn btn-outline btn-primary px-10" value=">>" onclick="javascript:Replay();Replay()" title="two moves forward">
<br>
<br>
      <input size="18" name="Msg" readonly="">
</div>
   
             
        <hr>

      
<div>
       Move list:<br><textarea cols="14" rows="3" name="MoveList"></textarea>
       <br>
       <input type="button" value="GET" onclick="javascript:GetMoveList()">
       <input type="button" value="APPLY" onclick="javascript:ApplyMoveList()">
          
</div>

<br>

     
</div>
    </div>
  </div>
</nav>
    <!------------->


    <!-- Header -->
    <header class="header header-inverse h-fullscreen p-0 bg-primary overflow-hidden" style="background-image: linear-gradient(to right, #434343 0%, black 100%);">
      <canvas class="constellation"></canvas>

      <div class="container text-center">


<br>
<br>

     
<div align="center">

  <td>&nbsp;</td>
<table noborder="">
<tbody><tr>
  <td><table border="0" cellpadding="10" cellspacing="10" ><tbody><tr><td background="hex_t.gif" align="center"><font size="1">
      <script language="JavaScript">
      k=0;
      for (i=0; i < Size-1; i++)
      { document.write("<nobr>");
        for (j=0; j <= i; j++)
        { document.write("<IMG src=\"test.png\" border=0 onMouseDown=\"Clicked("+eval(i-j)+","+j+")\" title='"+String.fromCharCode(65+j)+eval(i-j+1)+"' alt='"+String.fromCharCode(65+j)+eval(i-j+1)+"'>");
          ImgNum[i-j][j]=k++;
        }
        document.writeln("</nobr><br>");
      }
      for (i=Size-1; i >= 0; i--)
      { document.write("<nobr>");
        for (j=0; j <= i; j++)
        { document.write("<IMG src=\"test.png\" border=0 onMouseDown=\"Clicked("+eval(Size-1-j)+","+eval(Size-1-i+j)+")\" title='"+String.fromCharCode(65+Size-1-i+j)+eval(Size-j)+"' alt='"+String.fromCharCode(65+Size-1-i+j)+eval(Size-j)+"'>");
          ImgNum[Size-1-j][Size-1-i+j]=k++;
        }
        document.writeln("</nobr><br>");
      }
      </script>

      </font></td></tr></tbody></table>
  </td>
  <td>&nbsp;</td>
 

</tr>
</tbody></table>



</form>
</div>
<script language="JavaScript">
  Init();
  setInterval("Timer()",300);
</script>


 </div>
    </header>
    <!-- END Header -->
</body></html>
