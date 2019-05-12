
//add class header 

    window.onscroll = function() {myFunction()};

    function myFunction() {
        if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
            document.getElementById("main-header").className = "sticky";
        } else {
            document.getElementById("main-header").className = "";
        }
    }