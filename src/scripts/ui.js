const navToggle = document.querySelector("#nav-toggle");
const siteNav = document.querySelector("#nav");
const pages = document.querySelectorAll(".page");


// nav mobile responsive toggle function
if (navToggle && siteNav) {

  navToggle.addEventListener("click", function() {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", function(event) {
    if (event.target.closest("a") && window.matchMedia("(max-width: 760px)").matches) {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// change pages function
navToggle.addEventListener("click", function() {

});



// open popup form 



