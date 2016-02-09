/*
Licensed under the MIT license.
http://www.opensource.org/licenses/mit-license.php

this file is part of HTMoL:
Copyright (C) 2014  Alvarez Rivera Leonardo,Becerra Toledo Francisco Javier, Vega Ramirez Adan
*/
function Representation()
{
   var ObjThis=this;
   this.molecule;
    
    function Object()
    {
        this.Draw;
        this.Atom;
    }

    function CPK()
    {
        this.Bnd=false;
        this.LstObjects3D=[];
        var Obj=this;
        
        this.Show=function()
        {    
            return function(event){
                Obj.Bnd=true;
                ObjThis.SpheresBonds.Bnd=false;
                ObjThis.Skeleton.Bnd=false;
                ObjThis.Bonds.Bnd=false;

                ObjThis.Bonds.Hide();
                ObjThis.Skeleton.Hide();

                for(var i in ObjThis.molecule.GetAtoms())
                {
                    var o = ObjThis.molecule.GetAtoms()[i];
                    if(o.State=='Active'){   
                    o.CPK.material.visible=true;
                    o.Draw.material.visible=false;
                    }
                }   
            }
        }

        this.Evaluation=function()
        {
                for(var i in ObjThis.molecule.GetAtoms())
                {
                    var o = ObjThis.molecule.GetAtoms()[i];
                    if(o.State=='Active'){
                        if(Obj.Bnd==true){
                        o.CPK.material.visible=true;
                        o.Draw.material.visible=false;
                        }
                        if(ObjThis.SpheresBonds.Bnd==true){
                        o.CPK.material.visible=false;
                        o.Draw.material.visible=true;
                        }
                    
                    }

                    if(o.State=='Inactive')
                    {
                        o.CPK.material.visible=false;
                        o.Draw.material.visible=false;
                    }
                }   
        }

        this.Delete=function(scene)
        {
            for(var o in Obj.LstObjects3D)
            {
                var Draw=Obj.LstObjects3D[o];
                scene.remove(Draw);
            }
            Obj.LstObjects3D.length=0;
        }
    }

    function Bonds()
    {
        this.Bnd=false;
        this.LstObjects3D=[];
        var Obj=this;

        this.Show=function()
        {
            return function(event)
            {
                Obj.Bnd=true;
                ObjThis.CPK.Bnd=false;
                ObjThis.Skeleton.Bnd=false;
                ObjThis.SpheresBonds.Bnd=false;

                ObjThis.Skeleton.Hide();

                for(var i in ObjThis.molecule.GetAtoms())
                {
                    var o = ObjThis.molecule.GetAtoms()[i];
                    o.CPK.material.visible=false;
                    o.Draw.material.visible=false;
                } 
                Obj.Evaluation();
            }
        }

        this.Evaluation=function()
        {

                if(Obj.Bnd==true||ObjThis.SpheresBonds.Bnd==true)
                {
                    for(var i in ObjThis.molecule.GetBonds())
                    {
                    var a=ObjThis.molecule.GetBonds()[i];
                    if(a.LstAtoms[0].State=='Inactive'||a.LstAtoms[1].State=='Inactive')
                        a.Draw.material.visible=false;
                    
                    if(a.LstAtoms[0].State=='Active'&&a.LstAtoms[1].State=='Active')
                        a.Draw.material.visible=true;
                    }
                }
        }

        this.Hide=function()
        {
             for(var i in ObjThis.molecule.GetBonds())
            {
                var a=ObjThis.molecule.GetBonds()[i];
                a.Draw.material.visible=false;
            }
        }

        this.MakeBonds=function(ObjP,Obj3D)
        {

            var bond= new Bond();
            for (var t in ObjThis.molecule.GetChain())
            {
                 var chn=ObjThis.molecule.GetChain()[t];
                 for(var r in chn.GetAminoacid())
                 {
                       var amn=chn.GetAminoacid()[r];
                       for(var s in amn.GetAtoms())
                       {
                            var atom=amn.GetAtoms()[s];
                            for(var b in AtomsBonds[atom.NameAtom])
                            {
                                  var val=AtomsBonds[atom.NameAtom][b];
                                  for(var s in amn.GetAtoms())
                                  {
                                       var atomb=amn.GetAtoms()[s];
                                       if(val==atomb.NameAtom)
                                       {
                                          bond=ObjP.AddBond(bond,atom,atomb);
                                       }
                                  }
                            }
                       }
                 }
            }

            var bonds =ObjThis.molecule.GetBonds(); 
            for(var t in bonds)
            {
              var o = bonds[t];
              var line=Obj3D.DrawBond(o.LstAtoms[0],o.LstAtoms[1],o);
              ObjP.representation.Bonds.LstObjects3D.push(line);
              if(ObjP.representation.SpheresBonds.Bnd==true||ObjP.representation.Bonds.Bnd==true)
              line.material.visible=true;
            }
    
        }

        this.Delete=function(scene)
        {
            for(var o in Obj.LstObjects3D)
            {
                var Draw=Obj.LstObjects3D[o];
                scene.remove(Draw);
            }
            Obj.LstObjects3D.length=0;
        }
    }

    function SpheresBonds()
    {
        this.Bnd=false;
        this.LstObjects3D=[];
        var Obj=this;
    
        this.Show=function()
        {    
            return function(event){
                Obj.Bnd=true;
                ObjThis.CPK.Bnd=false;
                ObjThis.Skeleton.Bnd=false;
               
                for (var o in ObjThis.CPK.LstObjects3D) {
                    ObjThis.CPK.LstObjects3D[o].material.visible=false;
                }

                ObjThis.Skeleton.Hide();

                ObjThis.Bonds.Evaluation();

                for(var i in ObjThis.molecule.GetAtoms())
                {
                    var o = ObjThis.molecule.GetAtoms()[i];
                    if(o.State=='Active'){
                    o.CPK.material.visible=false;
                    o.Draw.material.visible=true;
                    }
                }   
            }
        }   
    

        this.Delete=function(scene)
        {
            for(var o in Obj.LstObjects3D)
            {
                var Draw=Obj.LstObjects3D[o];
                scene.remove(Draw);
            }
            Obj.LstObjects3D.length=0;
        }
    }

    function Skeleton()
    {
        this.Bnd=false;
        this.LstObjects3D=[];

        var Obj=this;

        this.Show=function()
        {
            return function(event)
            {
                Obj.Bnd=true;
                ObjThis.CPK.Bnd=false;
                ObjThis.SpheresBonds.Bnd=false;
                ObjThis.Bonds.Bnd=false;

                ObjThis.Bonds.Hide();
            
                for(var i in ObjThis.molecule.GetAtoms())
                {
                var o = ObjThis.molecule.GetAtoms()[i];
                o.Draw.material.visible=false;
                o.CPK.material.visible=false;
                }

                for(var t in ObjThis.molecule.GetBSkeleton())
                {
                    var BondSkeleton=ObjThis.molecule.GetBSkeleton()[t];
        
                    if(BondSkeleton.LstAtoms[0].State=='Inactive')
                        BondSkeleton.Draw.material.visible=false;
                    
                    
                    if(BondSkeleton.LstAtoms[0].State=='Active')
                    {
                        BondSkeleton.Draw.material.visible=true;
                      //  BondSkeleton.Draw.material.color=BondSkeleton.LstAtoms[0].Draw.material.color;
                        BondSkeleton.LstAtoms[0].Draw.material.visible=true;
                        BondSkeleton.LstAtoms[1].Draw.material.visible=true;
                    }else
                    {
                        BondSkeleton.LstAtoms[1].Draw.material.visible=false; 
                    }
                }
            }
        }

        this.ViewHS=function()
        {
            return function (event)
            {
            
                for(var t in ObjThis.molecule.GetBSkeleton())
                {
                    var BondSkeleton=ObjThis.molecule.GetBSkeleton()[t];
                
                    if(BondSkeleton.LstAtoms[0].Aminoacid.Type=='S'||BondSkeleton.LstAtoms[0].Aminoacid.Type=='A')
                    {
                        if(BondSkeleton.LstAtoms[0].State=='Active'&&BondSkeleton.LstAtoms[1].State=='Active')
                        {
                            BondSkeleton.Draw.material.color.setHex(TypeStructure[BondSkeleton.LstAtoms[0].Aminoacid.Type].color);
                        }
                    }
                }
                  
            }
        }

        this.Hide=function()
        {
            for(var t in ObjThis.molecule.LstBondsSkeleton)
            {
                var bond= ObjThis.molecule.LstBondsSkeleton[t];
                bond.Draw.material.visible=false;
                bond.LstAtoms[0].Draw.material.visible=false;
                bond.LstAtoms[1].Draw.material.visible=false;
            }
        }

        this.Evaluation=function(color)
        {
            
            for(var t in ObjThis.molecule.GetBSkeleton())
            {
                    var BondSkeleton=ObjThis.molecule.GetBSkeleton()[t];
                    if(BondSkeleton.LstAtoms[0].State=='Inactive')
                        BondSkeleton.Draw.material.visible=false;
                    
                    if(BondSkeleton.LstAtoms[0].State=='Active'){
                        
                        if(color=='color')
                        BondSkeleton.Draw.material.color=BondSkeleton.LstAtoms[0].Draw.material.color;
                        if(Obj.Bnd==true)
                        {
                            BondSkeleton.Draw.material.visible=true;
                            BondSkeleton.LstAtoms[0].Draw.material.visible=true;
                            BondSkeleton.LstAtoms[1].Draw.material.visible=true; 
                        }
                    }else
                    {
                        BondSkeleton.LstAtoms[1].Draw.material.visible=false; 
                    }
                }
            
        }

        this.Make=function(Obj3D)
        {
            for (var o in ObjThis.molecule.GetChain())
            {
              var chain=ObjThis.molecule.GetChain()[o];
              for(i=0;i<chain.GetSkeleton().length;i++)
              {
              if(i>0){
              var BondSkeleton=new Bond();
              var distancia=Math.sqrt(Math.pow(chain.GetSkeleton()[i-1].X-chain.GetSkeleton()[i].X,2)+Math.pow(chain.GetSkeleton()[i-1].Y-chain.GetSkeleton()[i].Y,2)+Math.pow(chain.GetSkeleton()[i-1].Z-chain.GetSkeleton()[i].Z,2));
                if(distancia<8)
                {
                  BondSkeleton.LstAtoms.push(chain.GetSkeleton()[i-1]);
                  BondSkeleton.LstAtoms.push(chain.GetSkeleton()[i]);
                  BondSkeleton= Obj3D.DrawBondSkeleton(chain.GetSkeleton()[i-1],chain.GetSkeleton()[i],BondSkeleton,0.3);
                  if(Obj.Bnd==true){
                  BondSkeleton.Draw.material.visible=true;
                  BondSkeleton.LstAtoms[0].Draw.material.visible=true;
                  BondSkeleton.LstAtoms[1].Draw.material.visible=true;
                  }
                  Obj.LstObjects3D.push(BondSkeleton.Draw);
                  ObjThis.molecule.LstBondsSkeleton.push(BondSkeleton);
                }
              }
              }
            }
        }

        this.Delete=function(scene)
        {
          for(var o in Obj.LstObjects3D)
            {
                var Draw=Obj.LstObjects3D[o];
                scene.remove(Draw);
            }
            Obj.LstObjects3D.length=0;   
        }
    }
    
    this.CPK=new CPK();
    this.SpheresBonds=new SpheresBonds();
    this.Skeleton=new Skeleton();
    this.Bonds=new Bonds();
}


