
    $(window).load(function () {
    $('#cargando').hide(none);
    });
    // espera hasta que el DOM este cargado
    jQuery(document).ready(function () {
         // esconder el body para luego mostrarlo
         $('#cargando').hide();
    });
    // espera hasta que todo el contenido este descargado
        jQuery(window).load(function(){
         // mostrar la etiqueta body lentamente
         $('#cargando').fadeIn("slow");
    });
(function() {

    var width, height, largeHeader, canvas, ctx, circles, target, animateHeader = true;

    // Main
    initHeader();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: 0, y: height};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create particles
        circles = [];
        for(var x = 0; x < width*0.5; x++) {
            var c = new Circle();
            circles.push(c);
        }
        animate();
    }

    // Event handling
    function addListeners() {
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in circles) {
                circles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    // Canvas manipulation
    function Circle() {
        var _this = this;

        // constructor
        (function() {
            _this.pos = {};
            init();
            console.log(_this);
        })();

        function init() {
            _this.pos.x = Math.random()*width;
            _this.pos.y = height+Math.random()*100;
            _this.alpha = 0.1+Math.random()*0.3;
            _this.scale = 0.1+Math.random()*0.3;
            _this.velocity = Math.random();
        }

        this.draw = function() {
            if(_this.alpha <= 0) {
                init();
            }
            _this.pos.y -= _this.velocity;
            _this.alpha -= 0.0005;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,'+ _this.alpha+')';
            ctx.fill();
        };
    }

})();

//-------------------
function Particle( x, y, radius ) {
	this.init( x, y, radius );
}

Particle.prototype = {

	init: function( x, y, radius ) {

		this.alive = true;

		this.radius = radius || 10;
		this.wander = 0.15;
		this.theta = random( TWO_PI );
		this.drag = 0.92;
		this.color = '#fff';

		this.x = x || 0.0;
		this.y = y || 0.0;

		this.vx = 0.0;
		this.vy = 0.0;
	},

	move: function() {

		this.x += this.vx;
		this.y += this.vy;

		this.vx *= this.drag;
		this.vy *= this.drag;

		this.theta += random( -0.5, 0.5 ) * this.wander;
		this.vx += sin( this.theta ) * 0.1;
		this.vy += cos( this.theta ) * 0.1;

		this.radius *= 0.96;
		this.alive = this.radius > 0.5;
	},

	draw: function( ctx ) {

		ctx.beginPath();
		ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
		ctx.fillStyle = this.color;
		ctx.fill();
	}
};

// ----------------------------------------
// Example
// ----------------------------------------

var MAX_PARTICLES = 280;
var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];

var particles = [];
var pool = [];

var demo = Sketch.create({
	container: document.getElementById( 'container' )
});

demo.setup = function() {

	// Set off some initial particles.
	var i, x, y;

	for ( i = 0; i < 20; i++ ) {
		x = ( demo.width * 0.5 ) + random( -100, 100 );
		y = ( demo.height * 0.5 ) + random( -100, 100 );
		demo.spawn( x, y );
	}
};

demo.spawn = function( x, y ) {

	if ( particles.length >= MAX_PARTICLES )
		pool.push( particles.shift() );

	particle = pool.length ? pool.pop() : new Particle();
	particle.init( x, y, random( 5, 40 ) );

	particle.wander = random( 0.5, 2.0 );
	particle.color = random( COLOURS );
	particle.drag = random( 0.9, 0.99 );

	theta = random( TWO_PI );
	force = random( 2, 8 );

	particle.vx = sin( theta ) * force;
	particle.vy = cos( theta ) * force;

	particles.push( particle );
}

demo.update = function() {

	var i, particle;

	for ( i = particles.length - 1; i >= 0; i-- ) {

		particle = particles[i];

		if ( particle.alive ) particle.move();
		else pool.push( particles.splice( i, 1 )[0] );
	}
};

demo.draw = function() {

	demo.globalCompositeOperation  = 'lighter';

	for ( var i = particles.length - 1; i >= 0; i-- ) {
		particles[i].draw( demo );
	}
};

demo.mousemove = function() {

	var particle, theta, force, touch, max, i, j, n;

	for ( i = 0, n = demo.touches.length; i < n; i++ ) {

		touch = demo.touches[i], max = random( 1, 4 );
		for ( j = 0; j < max; j++ ) demo.spawn( touch.x, touch.y );
	}
};
