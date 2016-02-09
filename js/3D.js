/*
Licensed under the MIT license.
http://www.opensource.org/licenses/mit-license.php

this file is part of HTMoL:
Copyright (C) 2014  Alvarez Rivera Leonardo,Becerra Toledo Francisco Javier, Vega Ramirez Adan
*/
function THREED(ObjRepre,main,ObjP)
{
    var ObjThis=this;
    this.ObjTools= new Tools();
    this.GeometryAtom=new THREE.SphereGeometry(.3,15,15);
    this.GeometryBond= new THREE.Geometry();
    this.scene;
    this.camera;
    this.renderer;
    this.controls;
    this.projector;
    this.BackgroundColor=0x000000;
    this.updatecontrols=false;
    this.LstButtonsChain=[];
    this.LstButtonsZoom=[];
    this.molecule;
    this.LstMarkers=[];
    this.AXIS= new THREE.AxisHelper( 500 );
    this.Selected= new AtomSelected();
    this.Data=[];
    this.currentframe=0;
    this.tatoms;
    this.nObjects;
    this.nObjectsBonds;
    this.localframe=0;   
    var light;
    var tmpatom=[];
    var Width = window.innerWidth;
    var Height = window.innerHeight;

    this.GetBackgroundColor=function()
    {
        try{
            ObjThis.renderer.setClearColor(ObjParameters.GetBackgroundColor(), 1);
        }
        catch(r)
        {
            ObjThis.renderer.setClearColor(ObjThis.BackgroundColor, 1);
        }
    }
    
    this.MakeScene=function(container)
    {       
            ObjThis.ObjTools.Representations=ObjRepre;  
            ObjThis.ObjTools.THREED=ObjThis; 
            ObjThis.scene = new THREE.Scene();

		
            ObjThis.camera = new THREE.PerspectiveCamera(45,Width/ Height, 0.1, 1000);
     
            ObjThis.camera.position.x = 0;ObjThis.camera.position.y = 0;ObjThis.camera.position.z = 100;ObjThis.camera.lookAt(ObjThis.scene.position);
            
            ObjThis.projector = new THREE.Projector();

            ObjThis.renderer = new THREE.WebGLRenderer();

            ObjThis.GetBackgroundColor();
          	
            ObjThis.AXIS.visible=false;
            ObjThis.scene.add( ObjThis.AXIS)
        		
            light = new THREE.PointLight( 0xffffff, 1, 1000 );light.position.set( ObjThis.camera.position.x, ObjThis.camera.position.y, ObjThis.camera.position.z );ObjThis.scene.add( light );

	        ObjThis.controls = new THREE.TrackballControls( ObjThis.camera );
			ObjThis.controls.rotateSpeed = 1.2;
			ObjThis.controls.zoomSpeed = 1.2;
			ObjThis.controls.panSpeed = 0.8;
			ObjThis.controls.noZoom = false;
			ObjThis.controls.noPan = false;
			ObjThis.controls.staticMoving = false;
			ObjThis.controls.dynamicDampingFactor = 0.3;
                                                
            ObjThis.renderer.setSize(Width, Height);
            
            document.addEventListener( 'mousedown', onDocumentMouseDown, false );
            window.addEventListener( 'resize', this.onWindowResize(Width,Height), false );
    }

    var LstObjects=[];
    //var frame=0;
    function framecounter(frame){        
        if(bndknowframe==true){
            totalframes=sizeglob/ObjThis.tatoms.length;
            data.innerHTML="frame " + (frame) + "(" + parseInt((frame*100)/totalframes1) +  "%) of " + parseInt(totalframes1);
        }else{
            totalframes=sizeglob/ObjThis.tatoms.length;
            data.innerHTML="frame " + (frame) + " of " + parseInt(totalframes);
        }
        
    }


    function onDocumentMouseDown( event )
    {
		var marginleft = document.getElementById("Contenedor").offsetLeft;
        var margintop = document.getElementById("Contenedor").offsetTop;
        if(ObjRepre.CPK.Bnd==true)
        LstObjects= ObjRepre.CPK.LstObjects3D;
        else
        LstObjects= ObjRepre.SpheresBonds.LstObjects3D;

        var vector = new THREE.Vector3( ((event.clientX-marginleft)/Width)*2-1, -  ((event.clientY-margintop)/Height)*2+1, 0.5 );
        ObjThis.projector.unprojectVector( vector, ObjThis.camera );
        
        var raycaster = new THREE.Raycaster( ObjThis.camera.position, vector.sub( ObjThis.camera.position ).normalize() );
        
    
        var intersects = raycaster.intersectObjects(LstObjects);
    
        
        if ( intersects.length > 0 )
        {       
            var object=null,values=null;
            
            
            for(i=0;i<intersects.length;i++)
            {
                if(intersects[i].object.material.visible==true)
                {
                    object=intersects[i].object;
                    values=object.position;
                    break;
                }
            }

            if(ObjRepre.Bonds.Bnd==true)
            {
                object=intersects[0].object;
                values=object.position;
            }

            for(var p in ObjThis.molecule.GetChain())
            {
                var chain=ObjThis.molecule.GetChain()[p];
                if(chain.State=='Active')
                {
                    for(var y in chain.GetAminoacid())
                    {
                        var a=chain.GetAminoacid()[y];
                        if(a.State=='Active')
                        {
                            for(var at in a.GetAtoms())
                            {
                                var atom=a.GetAtoms()[at];
                                if (atom.State=='Active'&&(atom.CPK.position==values||atom.Draw.position==values))
                                {   
                                   if(ObjThis.ObjTools.BndIdentify==true)
                                    {
                                    data.innerHTML=atom.NumberAtom+' '+atom.Element+' '+atom.NameAtom+' '+atom.X+' '+atom.Y+' '+atom.Z+' '+a.Name+' '+a.Number+' '+chain.Name+' ';
                                    }

                                    if(ObjThis.ObjTools.BndDistance==false&&ObjThis.ObjTools.BndAngle==false)
                                    {
                                        atom.Draw.material.wireframe=true;
                                        atom.Draw.material.color.setHex(0x40FF00);
                                        atom.CPK.material.wireframe=true;
                                        atom.CPK.material.color.setHex(0x40FF00);
                                        if(tmpatom.length==1)
                                        {
                                            tmpatom[0].Draw.material.wireframe=false;
                                            tmpatom[0].Draw.material.color.setHex(DataAtom[tmpatom[0].Element].color);
                                            tmpatom[0].CPK.material.wireframe=false;
                                            tmpatom[0].CPK.material.color.setHex(DataAtom[tmpatom[0].Element].color);
                                        }
                                        tmpatom.length=0;
                                        tmpatom.push(atom);
                                    }

                                    if(ObjThis.ObjTools.BndCenter==true)
                                    {
                                        ObjThis.CenterObjects(values.x,values.y,values.z);
                                    }

                                    if (ObjThis.ObjTools.BndNameAtom==true) 
                                    {
                                        ObjThis.NewMarker(atom,atom.NameAtom);
                                    }

                                    if(ObjThis.ObjTools.BndNumberAtom==true)
                                    {
                                        var number=parseInt(atom.NumberAtom);
                                        ObjThis.NewMarker(atom,number.toString());
                                    }

                                    if(ObjThis.ObjTools.BndDetailsAtom==true)
                                    {
                                        ObjThis.NewMarker(atom,a.Number+':'+a.Name+':'+chain.Name);
                                    }


                                    if(ObjThis.ObjTools.BndDistance==true)
                                    {
                                        ObjThis.Selected.LstAtoms.push(atom);
                                        atom.Draw.material.wireframe=true;
                                        atom.Draw.material.color.setHex(0x40FF00);
                                        if(ObjThis.Selected.LstAtoms[1]!=null)
                                        {
                                            var bond= new Bond();
                                            ObjThis.Selected.LstLines.push(ObjThis.DrawBond(ObjThis.Selected.LstAtoms[0],ObjThis.Selected.LstAtoms[1],bond));
                                            ObjThis.Selected.LstLines[0].material.color.setHex(0x40FF00);
                                            ObjThis.Selected.LstLines[0].material.linewidth=5;
                                            var dist=Math.sqrt(Math.pow(ObjThis.Selected.LstAtoms[0].X-ObjThis.Selected.LstAtoms[1].X,2)+Math.pow(ObjThis.Selected.LstAtoms[0].Y-ObjThis.Selected.LstAtoms[1].Y,2)+Math.pow(ObjThis.Selected.LstAtoms[0].Z-ObjThis.Selected.LstAtoms[1].Z,2));
                                            var midpoint=new Point(ObjThis.Selected.LstAtoms[0],ObjThis.Selected.LstAtoms[1]);
                                            
                                                
                                                function Point(atom1,atom2)
                                                {
                                                      this.X=(atom2.Draw.position.x+atom1.Draw.position.x)/2;
                                                      this.Y=(atom2.Draw.position.y+atom1.Draw.position.y)/2;
                                                      this.Z=(atom2.Draw.position.z+atom1.Draw.position.z)/2;
                                                }
                                            ObjThis.Selected.Marker=ObjThis.DrawMarker(midpoint,(dist/10).toFixed(3)+"nm");
                                            ObjThis.scene.add(ObjThis.Selected.Marker);
                                            ObjThis.Selected.LstLines[0].material.visible=true;
                                            ObjThis.Data.push(ObjThis.Selected);
                                            ObjThis.Selected=new AtomSelected();
                                        }
                                    }

                                    if(ObjThis.ObjTools.BndAngle==true)
                                    {
                                        ObjThis.Selected.LstAtoms.push(atom);
                                        atom.Draw.material.wireframe=true;
                                        atom.Draw.material.color.setHex(0x40FF00);
                                        if(ObjThis.Selected.LstAtoms[2]!=null)
                                        {
                                            var bond= new Bond();
                                            ObjThis.Selected.LstLines.push(ObjThis.DrawBond(ObjThis.Selected.LstAtoms[0],ObjThis.Selected.LstAtoms[1],bond));
                                            ObjThis.Selected.LstLines.push(ObjThis.DrawBond(ObjThis.Selected.LstAtoms[1],ObjThis.Selected.LstAtoms[2],bond));
                                            for(var t in ObjThis.Selected.LstLines)
                                            {
                                                var p = ObjThis.Selected.LstLines[t];
                                                p.material.color.setHex(0x40FF00);
                                                p.material.linewidth=5;
                                            }
                                            ObjThis.Selected.Marker=ObjThis.DrawMarker(ObjThis.Selected.LstAtoms[1],ObjP.GetAngle(ObjThis.Selected.LstAtoms)+String.fromCharCode( 176 ));
                                            ObjThis.Selected.Marker.position.y+=.4;
                                            ObjThis.scene.add(ObjThis.Selected.Marker);
                                            ObjThis.Selected.LstLines[0].material.visible=true;
                                            ObjThis.Selected.LstLines[1].material.visible=true;
                                            ObjThis.Data.push(ObjThis.Selected);
                                            ObjThis.Selected=new AtomSelected();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    function AtomSelected()
    {
	   this.LstAtoms=[];
	   this.Marker;
	   this.LstLines=[];
    }

    function Marker()
    {
        this.Atom=null;
        this.Draw=null;
    }


    this.DeleteMarkers=function()
    {
            if(ObjThis.LstMarkers.length>0)
            {
                for(var m in ObjThis.LstMarkers)
                {
                var marker=ObjThis.LstMarkers[m];
                ObjThis.scene.remove(marker.Draw);
                }
            }
            ObjThis.LstMarkers.length=0;
    }

    this.DeleteMeasures=function()
    {
        
        for(var t in ObjThis.Data)
        {
            var measure=ObjThis.Data[t];
            ObjThis.scene.remove(measure.Marker);
            for(var u in measure.LstAtoms)
            {
            var atom=measure.LstAtoms[u];
            atom.Draw.material.wireframe=false;
            atom.Draw.material.color.setHex(DataAtom[atom.Element].color);
            atom.CPK.material.color=atom.Draw.material.color;
            }
            
            for(var u in measure.LstLines)
            {
            var line=measure.LstLines[u];
            ObjThis.scene.remove(line);
            }
        }
        ObjThis.Data.length=0;
        
    }
   
    this.onWindowResize=function( num1,  num2)
    {
	ObjThis.camera.aspect = num1 / num2;
	ObjThis.camera.updateProjectionMatrix();

	ObjThis.renderer.setSize( num1,num2 );

    }

    this.getDataAtoms=function(){
    ObjThis.tatoms=ObjThis.molecule.GetAtoms();

    ObjThis.nObjects=ObjRepre.CPK.LstObjects3D.length;
    
    if(ObjRepre.Bonds.Bnd==true || ObjRepre.SpheresBonds.Bnd==true){
    ObjThis.nObjectsBonds=ObjRepre.Bonds.LstObjects3D.length;
    }
    
    ObjThis.nObjectsSk=ObjRepre.Skeleton.LstObjects3D.length;
   
    trjbnd=true;
    var button=document.getElementById("playpause");
    button.style.display="inline";
    }
                    
    this.Rendering=function(container)
    {
        $("#"+container.id).append( ObjThis.renderer.domElement );
        ObjThis.Render();
    }

    this.Render=function()
    {   
         if(trjbnd && autoplay){
            var x=0,y=0,z=0;
            if((pos*ObjThis.tatoms.length)==coordsX.length && bndbuffer==0){
             bndbuffer=1;
             pos=0;
            }else if((pos*ObjThis.tatoms.length)==coordsX1.length && bndbuffer==1){
             bndbuffer=0;
             pos=0;
            }

            if(ObjRepre.CPK.Bnd==true){
                for (var i = 0; i < ObjThis.nObjects; i++) {
                    if(!trjbnd){
                        break;
                    }
                    /* Para la trayectoria con representación CPK */
		   if(bndbuffer==0){
                    ObjRepre.CPK.LstObjects3D[i].position.x=coordsX[ObjThis.tatoms.length*pos+i];
                    ObjRepre.CPK.LstObjects3D[i].position.y=coordsY[ObjThis.tatoms.length*pos+i];
                    ObjRepre.CPK.LstObjects3D[i].position.z=coordsZ[ObjThis.tatoms.length*pos+i];
		    }else{
                    ObjRepre.CPK.LstObjects3D[i].position.x=coordsX1[ObjThis.tatoms.length*pos+i];
                    ObjRepre.CPK.LstObjects3D[i].position.y=coordsY1[ObjThis.tatoms.length*pos+i];
                    ObjRepre.CPK.LstObjects3D[i].position.z=coordsZ1[ObjThis.tatoms.length*pos+i];			
			}
                }

            }    

            if(ObjRepre.SpheresBonds.Bnd==true){
                for (var i = 0; i < ObjThis.nObjects; i++) {    
                    /*Para la trayectoria con representacion SphereBonds, solo las esferas*/
		    if(bndbuffer==0){
                    ObjRepre.SpheresBonds.LstObjects3D[i].position.x=coordsX[ObjThis.tatoms.length*pos+i]; 
                    ObjRepre.SpheresBonds.LstObjects3D[i].position.y=coordsY[ObjThis.tatoms.length*pos+i]; 
                    ObjRepre.SpheresBonds.LstObjects3D[i].position.z=coordsZ[ObjThis.tatoms.length*pos+i];
             	     }else{
                    ObjRepre.SpheresBonds.LstObjects3D[i].position.x=coordsX1[ObjThis.tatoms.length*pos+i];     
                    ObjRepre.SpheresBonds.LstObjects3D[i].position.y=coordsY1[ObjThis.tatoms.length*pos+i];     
                    ObjRepre.SpheresBonds.LstObjects3D[i].position.z=coordsZ1[ObjThis.tatoms.length*pos+i];
		     }		
		  }
            }

                
            if(ObjRepre.Bonds.Bnd==true || ObjRepre.SpheresBonds.Bnd==true){  
                    /*Para la trayectoria con representacion Bonds*/
                for (var i = 0; i < ObjThis.nObjectsBonds; i++) { 
                    var atom1=parseInt(ObjThis.molecule.GetBonds()[i].LstAtoms[0].NumberAtom)-1;
                    var atom2=parseInt(ObjThis.molecule.GetBonds()[i].LstAtoms[1].NumberAtom)-1;
                    ObjThis.molecule.GetBonds()[i].Draw.geometry.verticesNeedUpdate = true;
                    ObjThis.molecule.GetBonds()[i].Draw.position.x=0;
                    ObjThis.molecule.GetBonds()[i].Draw.position.y=0;
                    ObjThis.molecule.GetBonds()[i].Draw.position.z=0;
                    if(bndbuffer==0){
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[0].x = coordsX[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[0].y = coordsY[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[0].z = coordsZ[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[1].x = coordsX[ObjThis.tatoms.length*pos+atom2];
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[1].y = coordsY[ObjThis.tatoms.length*pos+atom2];
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[1].z = coordsZ[ObjThis.tatoms.length*pos+atom2];
                    }else{
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[0].x = coordsX1[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[0].y = coordsY1[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[0].z = coordsZ1[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[1].x = coordsX1[ObjThis.tatoms.length*pos+atom2];
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[1].y = coordsY1[ObjThis.tatoms.length*pos+atom2];
                    ObjRepre.Bonds.LstObjects3D[i].geometry.vertices[1].z = coordsZ1[ObjThis.tatoms.length*pos+atom2];
                    }
                }    
            }

                if(ObjRepre.Skeleton.Bnd==true){
                 for (var i = 0; i < ObjThis.nObjectsSk; i++) { 
                        var atom1=parseInt(ObjThis.molecule.GetBSkeleton()[i].LstAtoms[0].NumberAtom-1);
                        var atom2=parseInt(ObjThis.molecule.GetBSkeleton()[i].LstAtoms[1].NumberAtom-1);


                        ObjThis.molecule.GetBSkeleton()[i].Draw.geometry.verticesNeedUpdate = true;
                        ObjThis.molecule.GetBSkeleton()[i].Draw.position.x=0;
                        ObjThis.molecule.GetBSkeleton()[i].Draw.position.y=0;
                        ObjThis.molecule.GetBSkeleton()[i].Draw.position.z=0;

                    if(bndbuffer==0){
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[0].x = coordsX[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[0].y = coordsY[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[0].z = coordsZ[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[1].x = coordsX[ObjThis.tatoms.length*pos+atom2];
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[1].y = coordsY[ObjThis.tatoms.length*pos+atom2];
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[1].z = coordsZ[ObjThis.tatoms.length*pos+atom2];
                    }else{
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[0].x = coordsX1[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[0].y = coordsY1[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[0].z = coordsZ1[ObjThis.tatoms.length*pos+atom1];
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[1].x = coordsX1[ObjThis.tatoms.length*pos+atom2];
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[1].y = coordsY1[ObjThis.tatoms.length*pos+atom2];
                    ObjRepre.Skeleton.LstObjects3D[i].geometry.vertices[1].z = coordsZ1[ObjThis.tatoms.length*pos+atom2];
                    }    
                    }
                }

            //if(ObjRepre.CPK.Bnd==true){
            for (var i = 0; i < ObjThis.tatoms.length; i++) {    

                if(bndbuffer==0){
                  x+=parseFloat(coordsX[ObjThis.tatoms.length*pos+i]);
                  y+=parseFloat(coordsY[ObjThis.tatoms.length*pos+i]);
                  z+=parseFloat(coordsZ[ObjThis.tatoms.length*pos+i]);
                }else{
                  x+=parseFloat(coordsX1[ObjThis.tatoms.length*pos+i]); 
                  y+=parseFloat(coordsY1[ObjThis.tatoms.length*pos+i]); 
                  z+=parseFloat(coordsZ1[ObjThis.tatoms.length*pos+i]);
                }
                
                
            };
            x=x/parseInt(ObjThis.tatoms.length);
            y=y/parseInt(ObjThis.tatoms.length);
            z=z/parseInt(ObjThis.tatoms.length);
            framecounter(numframe+1);
            ObjThis.CenterObjects(x,y,z);
            //}  
            if(numframe<parseInt(totalframes)-1){
                numframe++;
                pos++;
            }else if(bndfinal==true){
                var button=document.getElementById("playpause");
                button.value="Play";
                trjbnd=false;
                numframe=0;
		        requireddata=false;
                totalframes1=totalframes;
		        totalframes=0;
		        pos=0;
                sizeglob=0;
		        readend=4999999;
		        readstart=0;
		        bndbuffer=0;
		        sizearrayp=0;
                coordsX= new Float32Array();
		        coordsX1=new Float32Array();
                coordsY= new Float32Array();
		        coordsY1=new Float32Array();	
                coordsZ= new Float32Array();
		        coordsZ1=new Float32Array();
                bndreview = true;
            }
        }
        
        requestAnimationFrame(ObjThis.Render);

        ObjThis.renderer.render(ObjThis.scene, ObjThis.camera);
        
        light.position.set( ObjThis.camera.position.x, ObjThis.camera.position.y, ObjThis.camera.position.z );
        if (ObjThis.updatecontrols==true) 
        ObjThis.controls.update();
    }

    
    this.DrawAtom=function(Obj,Geometry)
    {
		var AtomMaterial;
		try{
            AtomMaterial = new THREE.MeshLambertMaterial({color:DataAtom[Obj.Element].color});
		}catch(y)
		{
		    AtomMaterial = new THREE.MeshLambertMaterial({color:DataAtom['default'].color});
		}
            var Atom = new THREE.Mesh(Geometry,AtomMaterial);
			Atom.material.visible=false;
            Atom.position.x=Obj.X;
            Atom.position.y=Obj.Y;
            Atom.position.z=Obj.Z;
			ObjThis.scene.add(Atom);
            return Atom;
    }  

    this.DrawBond=function(atomo1,atomo2,bond)
    {
    this.GeometryBond=new THREE.Geometry();
    var matline;
    try{
        matline=new THREE.LineBasicMaterial({color:DataAtom[atomo1.Element].color});
    }catch(u)
    {
        matline=new THREE.LineBasicMaterial({color:DataAtom['default'].color});
    }
    
   
    var Vector1=new THREE.Vector3(atomo1.Draw.position.x,atomo1.Draw.position.y,atomo1.Draw.position.z);
    
    var Vector2=new THREE.Vector3(atomo2.Draw.position.x,atomo2.Draw.position.y,atomo2.Draw.position.z);
    
        this.GeometryBond.vertices.push(Vector1);
        this.GeometryBond.vertices.push(Vector2);


        
        var line= new THREE.Line(this.GeometryBond,matline);
        line.material.visible=false;
        bond.Draw=line;
        ObjThis.scene.add(line);
        return line;
    }

    this.DrawBondSkeleton=function(atom1,atom2,bond,size){
            this.GeometryBond=new THREE.Geometry();
            var matline;
            try{
                matline=new THREE.LineBasicMaterial({color: TypeStructure[bond.LstAtoms[0].Aminoacid.Type].color, linewidth:30});
            }catch(u)
            {
                matline=new THREE.LineBasicMaterial({color: TypeStructure[bond.LstAtoms[0].Aminoacid.Type].color, linewidth:30});
            }
        var tubepath = [new THREE.Vector3(atom1.X,atom1.Y,atom1.Z),new THREE.Vector3(atom2.X,atom2.Y,atom2.Z)];

        this.GeometryBond.vertices.push(tubepath[0]);
        this.GeometryBond.vertices.push(tubepath[1]);
        var line= new THREE.Line(this.GeometryBond,matline);
        line.material.visible=false;
        bond.Draw=line;
        ObjThis.scene.add(line);
        return bond;
    }

/*    this.DrawBondSkeleton=function(atom1,atom2,bond,size)
    {

    var tubepath = [new THREE.Vector3(atom1.X,atom1.Y,atom1.Z),new THREE.Vector3(atom2.X,atom2.Y,atom2.Z)];

    var actualextrudePath = new THREE.SplineCurve3(tubepath);

    actualextrudePath.dynamic = true;
    var innertube= new THREE.TubeGeometry(actualextrudePath, 1,size,10, false, true);
    var innertubeMesh = new THREE.Mesh(innertube, new THREE.MeshLambertMaterial(
                { color: TypeStructure[bond.LstAtoms[0].Aminoacid.Type].color}));
    innertubeMesh.material.visible=false;
    bond.Draw=innertubeMesh;
    ObjThis.scene.add(innertubeMesh);
    return bond;
    }

    this.NewMarker=function(atom,text)
    {
    var Mar=new Marker();
    var label=ObjThis.DrawMarker(atom,text);
    Mar.Atom=atom;
    Mar.Draw=label;
    ObjThis.LstMarkers.push(Mar);
    for(var i in ObjThis.LstMarkers)
    {
        var tmpMarker=ObjThis.LstMarkers[i];
        if(tmpMarker.Atom.NumberAtom==Mar.Atom.NumberAtom)
        {
        ObjThis.scene.remove(tmpMarker.Draw);
        ObjThis.LstMarkers.pop(tmpMarker);
        ObjThis.scene.add(Mar.Draw);
        ObjThis.LstMarkers.push(Mar);
        }
    }
    }*/
    
    this.DrawMarker=function(atom,text)
    {
        var MaterialMarker= new THREE.MeshBasicMaterial( { color:0xffffff , overdraw: false } );
        var GeometryMarker= new THREE.TextGeometry(text, {size: 0.4, height: 0, curveSegments: 1,font: 'optimer', weight: 'normal'});
        var textMesh = new THREE.Mesh( GeometryMarker, MaterialMarker );
        try{
            textMesh.position.set(atom.Draw.position.x,atom.Draw.position.y,atom.Draw.position.z+0.3 );
        }catch(t)
        {
            textMesh.position.set(atom.X,atom.Y,atom.Z+0.3 );
        }
        return textMesh;
    }

    this.DeleteButtons=function()
    {
         for(var i in ObjThis.LstButtonsChain)
        {
            try{
            menu.removeChild(ObjThis.LstButtonsChain[i]);
            }catch(t){}
        }
        ObjThis.LstButtonsChain.length=0;

        for(var i in ObjThis.LstButtonsZoom)
        {
            try{
            zoom.removeChild(ObjThis.LstButtonsZoom[i]);
            }catch(t){}
        }
        ObjThis.LstButtonsZoom.length=0;
    }
    
    this.Buttons=function(molecule)
    {
       

        for(var i in molecule.GetChain())
		{
		   var chain=molecule.GetChain()[i];
			var button = document.createElement( 'input' );
            button.type="button";
            button.value=chain.Name;
            button.id = chain.Name;
            button.onclick=ObjThis.ObjTools.SelectChain(chain,button);
            if(button.value!="undefined"){
			menu.appendChild( button );
			ObjThis.LstButtonsChain.push(button);
            }
		}

        button = document.createElement( 'input' );
        button.value = 'Pause';
        button.type="button";
        button.style.fontSize = "15px";
        button.id="playpause";
        button.style.display="none"
        button.onclick=PauseTraj();
        zoom.appendChild( button );
        ObjThis.LstButtonsZoom.push(button);


        var button = document.createElement( 'input' );
        button.value = '+';
        button.type="button";
        button.style.fontSize = "15px";
        button.onclick=ObjThis.ZOOMIN();
        zoom.appendChild( button );
        ObjThis.LstButtonsZoom.push(button);
        
        
        button = document.createElement( 'input' );
        button.value = '-';
        button.type="button";
        button.style.fontSize = "15px";
        button.onclick=ObjThis.ZOOMOUT();
        zoom.appendChild( button );
        ObjThis.LstButtonsZoom.push(button);

        button = document.createElement( 'input' );
        button.value = molecule.Name;
        button.type="button";
        button.style.fontSize = "15px";
        zoom.appendChild( button );
        ObjThis.LstButtonsZoom.push(button);

        button = document.getElementById( "CPK" ); 
        button.onclick=ObjRepre.CPK.Show();
      
        button = document.getElementById( "Spheres Bonds" );
        button.onclick=ObjRepre.SpheresBonds.Show();

        button = document.getElementById( "Skeleton" );
        button.onclick=ObjRepre.Skeleton.Show();

        button = document.getElementById( "Bonds" );
        button.onclick=ObjRepre.Bonds.Show();

        button = document.getElementById( "Identify" ); 
        button.onclick=ObjThis.ObjTools.Identify();

        button = document.getElementById( "Center" ); 
        button.onclick=ObjThis.ObjTools.Center();

        button = document.getElementById( "None1" ); 
        button.onclick=ObjThis.ObjTools.None();

        button = document.getElementById( "None2" ); 
        button.onclick=ObjThis.ObjTools.None();

        button = document.getElementById( "MoleculeCenter" ); 
        button.onclick=ObjThis.MoleculeCenter();

        button = document.getElementById( "NameAtom" ); 
        button.onclick=ObjThis.ObjTools.NameAtom();

        button = document.getElementById( "NumberAtom" ); 
        button.onclick=ObjThis.ObjTools.NumberAtom();

        button = document.getElementById( "DetailsAtom" ); 
        button.onclick=ObjThis.ObjTools.DetailsAtom();

        button = document.getElementById( "Distance" ); 
        button.onclick=ObjThis.ObjTools.Distance();

        button = document.getElementById( "Angle" ); 
        button.onclick=ObjThis.ObjTools.Angle();

        button = document.getElementById( "ShowMarkers" ); 
        button.onclick=ObjThis.ObjTools.ShowMarkers();

        button = document.getElementById( "HideMarkers" ); 
        button.onclick=ObjThis.ObjTools.HideMarkers();

        button = document.getElementById( "DeleteMarkers" ); 
        button.onclick=ObjThis.ObjTools.DeleteMarkers();

        button = document.getElementById( "DeleteMeasures" ); 
        button.onclick=ObjThis.ObjTools.DeleteMeasures();

        button = document.getElementById( "All" ); 
        button.onclick=ObjThis.ObjTools.All();

        button = document.getElementById( "Show" ); 
        button.onclick=ObjThis.ObjTools.SelectShow();

        button = document.getElementById( "DefaultColor" ); 
        button.onclick=ObjThis.ObjTools.DefaultColor();

        button = document.getElementById( "ViewHS" ); 
        button.onclick=ObjRepre.Skeleton.ViewHS();

        button = document.getElementById( "Axis" ); 
        button.onclick=ObjThis.ObjTools.Axis();

        for(var i=0;i < LstAminoacid.length; i++)
        {      
          var op=LstAminoacid[i]; 
          var an = document.getElementById(op); 
          an.onclick=ObjThis.ObjTools.ByAmino(ObjThis.molecule.GetChain(),op);
        }

        for(var i=0;i < LstAtoms.length; i++)
        {      
          var op=LstAtoms[i]; 
          var an = document.getElementById(op ); 
          an.onclick=ObjThis.ObjTools.ByAtoms(ObjThis.molecule.GetChain(),op);
        }

        for(var i in LstColors)
        {      
          var op=LstColors[i]; 
          var an = document.getElementById(op.name); 
          an.onclick=ObjThis.ObjTools.SelectColor(op.color);
        }

        for(var i in LstViews)
        {      
          var op=LstViews[i]; 
          var an = document.getElementById(op.name); 
          an.onclick=ObjThis.ObjTools.View(op.name);
        }

    }

    this.mesaje=function(c)
    {
        return function(event)
        {
            alert(c);
        }
    }

    this.MoleculeCenter=function()
    {
        return function(event)
        {
        ObjThis.CenterObjects(ObjP.PointCenter.X,ObjP.PointCenter.Y,ObjP.PointCenter.Z);
        }
    }
   
    this.CenterObjects=function(x,y,z)
    {   
        for(var i in ObjThis.molecule.GetAtoms())
        {   
            var atom=ObjThis.molecule.GetAtoms()[i];
            atom.Draw.position.x-=x;
            atom.Draw.position.y-=y;
            atom.Draw.position.z-=z;
            atom.CPK.position.x-=x;
            atom.CPK.position.y-=y;
            atom.CPK.position.z-=z;
        }
        
        for(var bs in ObjThis.molecule.GetBSkeleton())
        {
            var BS=ObjThis.molecule.GetBSkeleton()[bs];
            BS.Draw.position.x-=x;
            BS.Draw.position.y-=y;
            BS.Draw.position.z-=z;
        }

        for(var b in ObjThis.molecule.GetBonds())
        {
            var bond=ObjThis.molecule.GetBonds()[b];
            bond.Draw.position.x-=x;
            bond.Draw.position.y-=y;
            bond.Draw.position.z-=z;
        }

        for(var m in  ObjThis.LstMarkers)
        {
            var marker= ObjThis.LstMarkers[m];
            marker.Draw.position.x-=x;
            marker.Draw.position.y-=y;
            marker.Draw.position.z-=z;
        }
        
        for(var o in  ObjThis.Data)
        {
            var DT =  ObjThis.Data[o];
            for(var o in DT.LstLines)
            {
            var DL = DT.LstLines[o];
            DL.position.x-=x;
            DL.position.y-=y;
            DL.position.z-=z;
            }
            
            DT.Marker.position.x-=x;
            DT.Marker.position.y-=y;
            DT.Marker.position.z-=z;
        }
        
        ObjP.PointCenter.X-=x;ObjP.PointCenter.Y-=y;ObjP.PointCenter.Z-=z;
    }
    
    this.ZOOMIN= function()
    {
        return function (event){
        var Vx=ObjThis.scene.position.x-ObjThis.camera.position.x;
        var Vy=ObjThis.scene.position.y-ObjThis.camera.position.y;
        var Vz=ObjThis.scene.position.z-ObjThis.camera.position.z;
        
            ObjThis.camera.position.x=ObjThis.camera.position.x+(0.15*Vx);
            ObjThis.camera.position.y=ObjThis.camera.position.y+(0.15*Vy);
            ObjThis.camera.position.z=ObjThis.camera.position.z+(0.15*Vz);
        
        }
    }
    
    this.ZOOMOUT=function()
    {
        return function (event){
        var Vx=ObjThis.camera.position.x-ObjThis.scene.position.x;
        var Vy=ObjThis.camera.position.y-ObjThis.scene.position.y;
        var Vz=ObjThis.camera.position.z-ObjThis.scene.position.z;
        
            ObjThis.camera.position.x=ObjThis.scene.position.x+(1.15*Vx);
            ObjThis.camera.position.y=ObjThis.scene.position.y+(1.15*Vy);
            ObjThis.camera.position.z=ObjThis.scene.position.z+(1.15*Vz);
        }
    }

    function PauseTraj()
    {
       return function (event){
        var button=document.getElementById("playpause");
        if(bndreview){
        var main = new Main();
        main.trajreview();
        bndreview=!bndreview;
        button.value="Pause";
        }else if(!autoplay){
            autoplay=true;
        }else{
        trjbnd = !trjbnd;
        
        if (trjbnd) {
            button.value="Pause";
        }else{
            button.value="Play";
        }
        }
       }
    }
}
