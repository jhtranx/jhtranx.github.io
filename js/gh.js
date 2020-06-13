// toggle mobile navigation
function toggleMobileNav() {
	if( $("nav").hasClass("mobile") ) {
		$("nav").removeClass("mobile");
	}
	else {
		$("nav").addClass("mobile");
	}
}

// hide mobile nav when clicking outside of nav area
$("html").click(function() {
	$("nav").removeClass("mobile");
});

$("nav").click(function(e){
    e.stopPropagation();
});

// hide nav on scroll down
var scrolled = false;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $("nav").outerHeight();

$(window).scroll(function(event){
    scrolled = true;
});

setInterval(function() {
    if (scrolled) {
        hasScrolled();
        scrolled = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    
    if(Math.abs(lastScrollTop - st) <= delta) // make sure user scrolled more than delta
        return;
    
    if (st > lastScrollTop && st > navbarHeight) {
		if( !$("nav").hasClass("mobile") ) {
			$("nav").removeClass("nav-show").addClass("nav-hide");
		}
    } 
	else {
        if(st + $(window).height() < $(document).height()) {
            $("nav").removeClass("nav-hide").addClass("nav-show");
        }
    }
    
    lastScrollTop = st;
}

// for dyanmic background
const [red, green, blue] = [23, 43, 100]
const section1 = document.querySelector('.section1')

window.addEventListener('scroll', () => {
  const y = 1 + (window.scrollY || window.pageYOffset) / 100
  const [r, g, b] = [red/y, green/y, blue/y].map(Math.round)
  section1.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
})