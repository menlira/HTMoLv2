/*
Licensed under the MIT license.
http://www.opensource.org/licenses/mit-license.php

this file is part of HTMoL:
Copyright (C) 2014  Alvarez Rivera Leonardo,Becerra Toledo Francisco Javier, Vega Ramirez Adan
*/
function Atom(number,x,y,z,state,element,nameatom)
{
    this.Draw=null;
    this.CPK=null;
    this.X=x;
    this.Y=y;
    this.Z=z;
    this.State=state;
    this.NumberAtom=number;
    this.Element=element;
    this.NameAtom=nameatom;
    this.Aminoacid=null;
    this.coordsXtr=[];
    this.coordsYtr=[];
    this.coordsZtr=[];
}

function Aminoacid(number,name,state)
{
    this.Number=number;
    this.Name=name;
    this.State=state;
    this.LstAtoms=[];
    this.Type=null;
    
    this.GetAtoms=function()
    {
        return this.LstAtoms;
    }
}

function Chain(name,state)
{
    this.Name=name;
    this.State=state;
    this.LstAminoAcid=[];
    this.LstSkeleton=[];
    
    this.GetSkeleton=function()
    {
        return this.LstSkeleton;
    }
    
    this.GetAminoacid=function()
    {
        return this.LstAminoAcid;
    }
    
}

function Molecule(mivar)
{
    this.Name='';
    this.LstChain=[];
    this.LstAtoms=[];
    this.LstBonds=[];
    this.LstBondsSkeleton=[];
    this.LstHelixAndSheet=[];
    this.Frames=0;
    this.TrjPath="";

    this.GetChain=function()
    {
        return this.LstChain;
    }
    
    this.GetBonds=function()
    {
        return this.LstBonds;
    }
    
    this.GetAtoms=function()
    {
        return this.LstAtoms;
    }
    
    this.GetBSkeleton=function()
    {
        return this.LstBondsSkeleton;
    }
    
}

function Bond()
{
    this.LstAtoms=[];
    this.Draw;
}

function HelixAndSheet()
{
    this.NumberAmino1=0;
    this.Chain='';
    this.NumberAmino2=0;
    this.Type='';
    this.LstAminoacid=[];
    this.LastAminoacid=null;
}

function Process(ObjRepre)
{
    this.Model= new Molecule();
    this.representation= ObjRepre;
    this.PointCenter=new point3D();
    this.bndPDB=false;
    this.CameraZ=10;
    var cont=0;
    var ObjP=this;
	this.ReadFile= function(URL)
	   {
		   var text = $.ajax({
		       url: URL, 
			   dataType: 'text',
			   async: false     
		   }).responseText;
		   if (text!=null&&text.substr(0,6)!="<html>"){
	        return this.Parse(text);
	    	}
	       else
	        return null;
	   }
	   
	  this.Parse= function(text)
	   {
	   	  this.Model=new Molecule();
	      var cmpAmino='',cmpChain='';
	      var chain=new Chain();
	      var aminoacid=new Aminoacid();
	      var bond=new Bond();
	      var lines=text.split("\n");
	      var val,val2;
	      
	      for(var i=0; i<lines.length; ++i)
	      {
	       if(lines[i].substr(0,7)=="NFRAMES"){
	       	this.Model.Frames=lines[i].substr(10);
	       }
	       if(lines[i].substr(0,7)=="TRJPATH"){
	       	this.Model.TrjPath=lines[i].substr(10);
	       }
		   if(lines[i].substr(0,6)=="HEADER")
		   {
			this.Model.Name=lines[i].substr(62,4);
		   }
		   if(lines[i].substr(0,5)=="HELIX"||lines[i].substr(0,5)=="SHEET")
		   {
			ObjP.bndPDB=true;
			var helix= new HelixAndSheet();
			if(lines[i].substr(0,5)=="HELIX"){
			    helix.Chain=lines[i].substr(18,2);
			    helix.NumberAmino1=lines[i].substr(21,4);
			    helix.NumberAmino2=lines[i].substr(33,4);
			    helix.Type='A';
			}
			
			if(lines[i].substr(0,5)=="SHEET"){
			    helix.Chain=lines[i].substr(20,2);
			    helix.NumberAmino1=lines[i].substr(22,4);
			    helix.NumberAmino2=lines[i].substr(33,4);
			    helix.Type='S';
			}
			this.Model.LstHelixAndSheet.push(helix);
		   }
		   
		   if(lines[i].substr(0,4)=="ATOM")
		   {
	        var atom=new Atom(lines[i].substr(6,5),parseFloat(lines[i].substr(30,8)),parseFloat(lines[i].substr(38,8)),parseFloat(lines[i].substr(46,8)),'Active',lines[i].substr(11,5).trim().substr(0,1),lines[i].substr(11,6).trim().replace(/\s/g,"&"));
						
			this.PointCenter.X+=atom.X;this.PointCenter.Y+=atom.Y;this.PointCenter.Z+=atom.Z;
            
            var tmpMax=0;
            if (atom.Z<0)
            	tmpMax=atom.Z*-1;
            else
            	tmpMax=atom.Z;

			if(ObjP.CameraZ<tmpMax)
			ObjP.CameraZ=tmpMax;

			if(cont==0){
			cmpAmino=lines[i].substr(22,4);cmpChain=lines[i].substr(20,2);aminoacid=new Aminoacid(cmpAmino,lines[i].substr(17,3),'Active');chain=new Chain(cmpChain,'Active');
			}
			if(cmpAmino!=lines[i].substr(22,4)){
			cmpAmino=lines[i].substr(22,4);chain.LstAminoAcid.push(aminoacid);aminoacid=new Aminoacid(cmpAmino,lines[i].substr(17,3),'Active');
		       }
		       if(cmpChain!=lines[i].substr(20,2)){
			cmpChain=lines[i].substr(20,2);this.Model.LstChain.push(chain);chain=new Chain(cmpChain,'Active');}
		       
		       aminoacid.LstAtoms.push(atom);	       
		       this.Model.LstAtoms.push(atom);

		     
		       if(atom.NameAtom=='C'||atom.NameAtom=='O3\'')
		       var atomtmp=atom;
		       
		       
		       if((atom.NameAtom=='N'||atom.NameAtom=='P')&&cont>1)
		       bond=this.AddBond(bond,atomtmp,atom);
		       
	
		       if(atom.NameAtom=='CA'||atom.NameAtom=='P')
		       {
			aminoacid.Type='T';
			atom.Aminoacid=aminoacid;
		    chain.LstSkeleton.push(atom);
		       }
		       cont++;	
		   }
	      }
		  
	      this.PointCenter.X=this.PointCenter.X/this.Model.GetAtoms().length;
	      this.PointCenter.Y=this.PointCenter.Y/this.Model.GetAtoms().length;
	      this.PointCenter.Z=this.PointCenter.Z/this.Model.GetAtoms().length;
	      chain.LstAminoAcid.push(aminoacid);
	      this.Model.LstChain.push(chain);
	      return this.Model;
	   }


	
	this.Points=function(Q,P,Value)
	{
	    var Vx=P.X-Q.X;
	    var Vy=P.Y-Q.Y;
	    var Vz=P.Z-Q.Z;
	    
	    var point = new point3D();
	    point.X=Q.X+(Value*Vx);
	    point.Y=Q.Y+(Value*Vy);
	    point.Z=Q.Z+(Value*Vz);
	    
	    return point;
	}
	
	function point3D()
	{
	    this.X=0;
	    this.Y=0;
	    this.Z=0;
	}

	this.AddBond=function(bond,atom,union)
	{
		try
		{
		    var distancia=Math.sqrt(Math.pow(atom.X-union.X,2)+Math.pow(atom.Y-union.Y,2)+Math.pow(atom.Z-union.Z,2));
		    if(distancia<2)
		    {
			bond.LstAtoms.push(atom);
			bond.LstAtoms.push(union);
			this.Model.LstBonds.push(bond);
		    }
		}catch(e)
		{}
	    return bond=new Bond();
	}

    this.Spheres=function(chains,Obj3D)
	{
		for(var p in chains)
		{
			var chain=chains[p];
			for(var y in chain.GetAminoacid())
			{
				var a=chain.GetAminoacid()[y];
				for(var at in a.GetAtoms())
				{
					var atom=a.GetAtoms()[at];
					atom.Draw= Obj3D.DrawAtom(atom,Obj3D.GeometryAtom);
					if(ObjP.representation.SpheresBonds.Bnd==true)
					atom.Draw.material.visible=true;
					try{
						atom.CPK= Obj3D.DrawAtom(atom,DataAtom[atom.Element].Geometry);
					}catch(o)
					{
						atom.CPK= Obj3D.DrawAtom(atom,DataAtom['default'].Geometry);
					}
						
					if(ObjP.representation.CPK.Bnd==true)
					atom.CPK.material.visible=true;           
				    ObjP.representation.CPK.LstObjects3D.push(atom.CPK);
				    ObjP.representation.SpheresBonds.LstObjects3D.push(atom.Draw);
				}
			}
		}
	}

	this.SecondaryStructureByPDB=function()
	{
	    for(var p in ObjP.Model.GetChain())
	    {
		var chain=ObjP.Model.GetChain()[p];
		var cont=0;
		var lst=chain.GetAminoacid();
		for(i=0;i<lst.length;i++)
		{
		    for(var o in this.Model.LstHelixAndSheet)
		    {
			var p = this.Model.LstHelixAndSheet[o];
			if(p.Chain==chain.Name)
			{
			    if(parseInt( lst[i].Number)>=p.NumberAmino1&&parseInt( lst[i].Number)<=p.NumberAmino2)
			    {
				lst[i].Type=p.Type;
				p.LstAminoacid.push(lst[i]);
			    }
			    if(parseInt( lst[i].Number)==parseInt( p.NumberAmino2)+1)
			    {
				p.LastAminoacid=lst[i];
			    }
			}
		    }
		}
	    }
	}
	
	this.AlgorithmGOR=function()
	{
	   for(var p in ObjP.Model.GetChain())
	    {
		var chain=ObjP.Model.GetChain()[p];
		var cont=0;
		var lst=chain.GetAminoacid();
		for(i=0;i<lst.length;i++)
		{
		var alfa=0;
		var beta=0;
		var turn=0;
	           
		    for(j=i-8;j<=i+8;j++)
		    {
				try{
			        alfa+=ALFA[lst[j].Name][cont];
				    beta+=Sheet[lst[j].Name][cont];
				    turn+=Turns[lst[j].Name][cont];
				}catch(t)
				{
				    
				}
				cont++;
		    }
		    if(lst[i].Name=='A  '||lst[i].Name=='  A'||lst[i].Name=='U  '||lst[i].Name=='  U'||lst[i].Name=='C  '||lst[i].Name=='  C')
		    {
				lst[i].Type='T';
		    }
		    else
		    {
			    if(beta>turn&&beta>alfa)
			    lst[i].Type='S';
			    if(turn>beta&&turn>alfa)
			    lst[i].Type='T';
			    if(alfa>beta&&alfa>turn)
			    lst[i].Type='A';
		    }
		    cont=0;
		}
	    }
	}

	this.GetAngle=function(Data)
	{
	    var V1=[Data[1].X-Data[0].X,Data[1].Y-Data[0].Y,Data[1].Z-Data[0].Z];
	    var V2=[Data[1].X-Data[2].X,Data[1].Y-Data[2].Y,Data[1].Z-Data[2].Z];
	    
	    var tmp=((V1[0]*V2[0])+(V1[1]*V2[1])+(V1[2]*V2[2]))/(Math.sqrt(Math.pow(V1[0],2)+Math.pow(V1[1],2)+Math.pow(V1[2],2))*Math.sqrt(Math.pow(V2[0],2)+Math.pow(V2[1],2)+Math.pow(V2[2],2)));
	    var angulo=(180*Math.acos(tmp))/Math.PI;
	   
	    return angulo.toFixed(2);
	}

	
}