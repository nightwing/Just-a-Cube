/*

	TWIST NOTATION

	UPPERCASE = Clockwise to next 90 degree peg
	lowercase = Anticlockwise to next 90 degree peg



	FACE & SLICE ROTATION COMMANDS

	F	Front
	S 	Standing (rotate according to Front Face's orientation)
	B 	Back

	L 	Left
	M 	Middle (rotate according to Left Face's orientation)
	R 	Right

	U 	Up
	E 	Equator (rotate according to Up Face's orientation)
	D 	Down



	ENTIRE CUBE ROTATION COMMANDS

	X   Rotate entire cube according to Right Face's orientation
	Y   Rotate entire cube according to Up Face's orientation
	Z   Rotate entire cube according to Front Face's orientation



	NOTATION REFERENCES

	http://en.wikipedia.org/wiki/Rubik's_Cube#Move_notation
	http://en.wikibooks.org/wiki/Template:Rubik's_cube_notation
*/


window.addEventListener("load", function() {
	// -------------------- cuber --------------------
	var useLockedControls = true,
		controls = useLockedControls ? ERNO.Locked : ERNO.Freeform;

	var ua = navigator.userAgent,
		isIe = ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1;

	window.cubeGL = new ERNO.Cube({
		hideInvisibleFaces: true,
		controls: controls,
		renderer: isIe ? ERNO.renderers.IeCSS3D : null
	});

	const container = document.getElementById( 'container' );
	container.appendChild( cubeGL.domElement );

	if (controls === ERNO.Locked) {
		const fixedOrientation = new THREE.Euler(Math.PI * 0.1, Math.PI * -0.25, 0);
		cubeGL.object3D.lookAt(cubeGL.camera.position);
		cubeGL.rotation.x += fixedOrientation.x;
		cubeGL.rotation.y += fixedOrientation.y;
		cubeGL.rotation.z += fixedOrientation.z;
	}

	// The deviceMotion function provide some subtle mouse based motion
	// The effect can be used with the Freeform and Locked controls.
	// This could also integrate device orientation on mobile

	// var motion = deviceMotion( cubeGL, container );

	// motion.decay = 0.1; 				// The drag effect
	// motion.range.x = Math.PI * 0.06;	// The range of rotation
	// motion.range.y = Math.PI * 0.06;
	// motion.range.z = 0;
	// motion.paused = false;				// disables the effect

	cubeGL.twistDuration = 300;
	//cubeGL.twist('xY');
	//cubeGL.shuffle();
	//cubeGL.twist('d');
	//cubeGL.solve();
    
    
    cubeGL.addEventListener("onTwistComplete", function() {
        var solutionSteps = cubeGL.twistQueue.history.map(x=>x.command)
        
        document.querySelector(".history>.solution").innerHTML = solutionSteps.map(x=>{
            var lower = x.toLowerCase();
            if (x == lower) x = x.toUpperCase() + "'";
            return "<span style=color:" + (/[xyz]/i.test(x) ? "#c2f1c2" : (x.length == 2 ? "pink" : "") ) + ">" + x + "</span>"
        }).reverse().join(", ")
        
        var shuffleSteps = shuffleString.split("");
        document.querySelector(".history>.shuffle").innerHTML = shuffleSteps.map(x=>{
            var lower = x.toLowerCase();
            if (x == lower) x = x.toUpperCase() + "'";
            return "<span style=color:" + (/[xyz]/i.test(x) ? "#c2f1c2" : (x.length == 2 ? "pink" : "") ) + ">" + x + "</span>";
        }).reverse().join(", ")
    })

})

var shuffleString = ""
function cubeReset() {
    // for (var i = cubeGL.twistQueue.history.length; i>=0;i--)cubeGL.undo()
    shuffleString += cubeGL.twistQueue.history.map(x=>x.command).join("")
  
    var undoString = shuffleString.split("").map(x=>{
        var lower = x.toLowerCase();
        if (lower == x) 
            return x.toUpperCase();
        else
            return lower;
    }).reverse().join("");
    cubeGL.twist(undoString);  
}
function cubeShuffle() {
  cubeReset()
  shuffleString = cubeGL.shuffle(25);
}

function solveStep(q) {
    solver.logic(cubeGL)
    for(var i = 0; i<q; i++){
        lblSteps[i] && cubeGL.twist(lblSteps[i]);
    }
    console.log(lblSteps) 
}


function undoHistory(event) {
    var target = event.target
    var parent = target.parentElement
    if (target.localName !== "span") return
    var i = 0;
    while (i < parent.children.length) {
        if (parent.children[i] == target) {
            undoMany(i);
            break
        }
        i++
    }
}

function undoMany(q) {
    for(var i=q;i-->=0;)cubeGL.undo() 
}

