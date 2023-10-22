var a_width =1;
var menu = new Object();
$(document).ready(function(){

    init_menu();

/*
* 	After the click on the hamburger, show hor hide the element which are out of the container frame
*/
    if(('#f-menu-horizontal nav.hamburger a.dropdown-toggle' ).length){

        $('#f-menu-horizontal nav.hamburger a.dropdown-toggle' ).click( function( e ) {
            e.preventDefault();

            $(this).closest('nav.hamburger').toggleClass('toggled-on');

            var _this = $(this).toggleClass('toggled-on').attr('aria-expanded',$(this).attr('aria-expanded') === 'false' ? 'true' : 'false');

            _this = _this.find('i.fa').toggleClass('fa-navicon fa-chevron-up');

            if((_this).closest('a').hasClass('toggled-on'))
            {
                $("#f-menu-horizontal nav.menu .hamburger-item").show();
            }
            else{
                $("#f-menu-horizontal nav.menu .hamburger-item").hide();
            }

        });
    }

    if(('#f-menu-vertical nav.vhamburger a.dropdown-toggle' ).length){
        $('.vhamburger a.dropdown-toggle' ).click( function( e ) {
            e.preventDefault();

            t= $(this);
            // Togle Toogle the class and the aria-expanded attribut
            t.toggleClass('toggled-on').attr('aria-expanded',$(this).attr('aria-expanded') === 'false' ? 'true' : 'false');
            t.find('i.fa').toggleClass('fa-navicon fa-close');

            $("#f-menu-vertical nav.menu").toggleClass('hide');

            // Colse all toogled-on menu
            $( '#f-menu-vertical nav.menu li.active' ).each(function(){
                $(this).removeClass('active').first().children('div').find('a.toggled-on').removeClass('toggled-on').find('i.fa').eq(0).toggleClass('fa-angle-down fa-angle-up').closest('div').eq(0).next('ul.sub-menu').removeClass("toggled-on");
                //next('a.dropdown-toggle').removeClass('toggled-on'); // TODO
            })

        });
    };

    /*
    * Open ot close the sub-menu
    */
    $( 'nav.menu .dropdown-toggle' ).click( function( e ) {
        e.preventDefault();

        // Add or remove the toggled-on class and change the aria-expand status of the link
        var _this = $(this).toggleClass('toggled-on').attr('aria-expanded',$(this).attr('aria-expanded') === 'false' ? 'true' : 'false');

        _this = _this.find('i.fa').toggleClass('fa-angle-down fa-angle-up');


        // find the closest parent div and go to the first ul.sub-menu, then add/remove the class toggled-on to the ué
        _this.closest('div').eq(0).next('ul').toggleClass('toggled-on')
            // Go up to the closest hasChildren class and look at all system/brother of .hasChildren
            .closest('.hasChildren').toggleClass("active").eq(0).siblings(".hasChildren")
            // Find .dropdown-toggle and do a forwach for all of them
            .find('.dropdown-toggle').each(function(){
            // remove the toggled-on class and change the axia-expanded status of each links
            $(this).removeClass('toggled-on').attr('aria-expanded','false')
                // change the icon
                .find('i.fa').removeClass('fa-angle-up').addClass('fa-angle-down')
                // move up to the closest div and go to the next ul (ul.sub-menu) and remove the toggled-on class to close the menu
                .closest('div').eq(0).next('ul').removeClass('toggled-on')
                .closest('li').eq(0).removeClass('active');
        });

    } );

    var size=container_width();
    console.log("menu object", menu);
    console.log("init size", size);
    console.log("?",$('nav#menu ul').first().children('li:last-child').data("li"));

    $(window).resize(function()
    {

        if($('#f-menu-horizontal nav.menu ul').first().children('li.hamburger-item:hidden').length){
            $('#f-menu-horizontal .hamburger').show();
        }
        else
        {
            $('#f-menu-horizontal .hamburger').hide();
        }

        // Check if the window size decrease
        if(container_width() < size)
        {
            size= container_width()
            console.log("diminue");
            console.log("?",$('nav-menu ul').first().children('li:visible:last').data("li"));


            let lastLiDataNumber = $('nav.menu ul').first().children('li:visible:last').data("li");

            if(lastLiDataNumber != undefined){
                console.log("Last visisble:",lastLiDataNumber);
                //console.log("Width:",menu[lastLiDataNumber].w_total_prev);
                //console.log("width:",container_width());
                if(menu[lastLiDataNumber].w_total_prev >= container_width())
                {
                    //$('nav#menu li[data-li="'+ lastLiDataNumber +'"]').prependTo("#hamburger-display ul");
                    $('nav.menu li[data-li="'+ lastLiDataNumber +'"]').addClass("hamburger-item");
                    $('nav.menu li[data-li="'+ lastLiDataNumber +'"]').hide();
                }
            }
        }

        // Check if the window size increase
        if(container_width() > size)
        {
            size= container_width();
            console.log("Augmente");


            let firstLiDataNumber = $('nav.menu ul').first().children('li:hidden:first').data("li");


            if(firstLiDataNumber != undefined){
                console.log("first hidden:",firstLiDataNumber);
                console.log("Width:",menu[firstLiDataNumber].w_total_prev);
                console.log("width:",container_width());
                if(container_width() - menu[firstLiDataNumber].w_total_prev > menu[firstLiDataNumber].w_total)
                {
                    //$('nav#menu li[data-li="'+ lastLiDataNumber +'"]').prependTo("#hamburger-display ul");
                    $('nav.menu li[data-li="'+ firstLiDataNumber +'"]').removeClass("hamburger-item");
                    $('nav.menu li[data-li="'+ firstLiDataNumber +'"]').show();
                }
            }

        }
    });
});

function init_menu()
{
    /*
    * Loop the element of the first level only
    */
    $('nav.menu ul').first().children('li').each(function(index)
    {
        // Add a data attrobut with the order number of the element (from 0 up to the number of elements)
        $(this).attr("data-li",index)
        // Calculate the width and the padding of the container of the link(s)
        let div = $(this).first().children('div');
        let div_padding = Math.ceil((div.outerWidth() -  div.width()) - (div.outerWidth() - div.innerWidth()));
        let div_border = Math.ceil(div.outerWidth() - div.innerWidth());
        let div_paddingBorder = div_padding +  div_border;
        /* Calculate the width of the link inside of the div */
        // A li which has children, has to links, one for the link, one for for the drop menu
        if($(this).hasClass("hasChildren")){

            //$(this).attr("style","border:1px solid blue !important");
            // Get the width of the first a
            let a1 = $(this).first().children('div').first().children('a:nth-child(1)');
            let a1_border = Math.ceil(a1.outerWidth() - a1.innerWidth());
            let a1_wwidth = Math.ceil(a1.width());
            a1_width = a1_wwidth + a1_border;

            // Get the width of the second a
            let a2 = $(this).first().children('div').first().children('a:nth-child(2)');
            let a2_border = Math.ceil(a2.outerWidth() - a2.innerWidth());
            let a2_wwidth = Math.ceil(a2.width());
            a2_width = a2_wwidth + a2_border;

            a_width = a1_width + a2_width +6; //+5 is marge
            //console.log("a_width:", a_width);

        }

        else
        {
            /* It caintains one a for the link */
            let a = $(this).first().children('div').first().children('a');

            let a_padding = Math.ceil((a.outerWidth() -  a.width()) - (a.outerWidth() - a.innerWidth()));
            let a_border = Math.ceil(a.outerWidth() - a.innerWidth());
            let a_wwidth = Math.ceil(a.width());
            let a_paddingBorder = a_padding +  a_border;
            a_width = a_wwidth + a_border;
        }

        // Save the values in the menu object
        menu[index] = {
            index: index,
            div_padding: div_padding,
            div_border: div_border,
            div_paddingBorder: div_paddingBorder,
            a_width: a_width,
            w_total: div_paddingBorder + a_width,
            w_total_prev: div_paddingBorder + a_width , // Total de la largeur + total de la largeur des élélements précédents
            //w_container: w_container,
            name:"li-"+index
        };
    });
    /*
    * Loop the object menu, which containe the element sizes (width)
    * The loop look for the size of the first element.
    * Then it look for the size of the next element and save the sum to w_total_prev of the next element.
    * It does the same until the last element.
    * The goal is to know the width of one, two, three or more element, comparing with the window width.
    */
    var totalWidth=0;
    for(let x=0; x < Object.keys(menu).length; x++)
    {
        if(x>0){
            //console.log("x-1:",x-1);
            menu[x].w_total_prev = menu[x-1].w_total_prev + menu[x].w_total;
        }
        totalWidth += menu[x].w_total
    }

    for(let y = Object.keys(menu).length-1; y > 0; y--)
    {
        if(menu[y].w_total_prev >= container_width())
        {
            $('.hamburger').show();
            //$('nav#menu li[data-li="'+ lastLiDataNumber +'"]').prependTo("#hamburger-display ul");
            $('nav.menu li[data-li="'+ y +'"]').addClass("hamburger-item");
            $('nav.menu li[data-li="'+ y +'"]').hide();
        }
    }
}

function container_width()
{
    let container = $('#f-menu-horizontal nav.menu ul')
    let c_border = Math.ceil(container.outerWidth() - container.innerWidth());
    let c_wwidth = Math.ceil(container.width());
    return w_container = c_border + c_wwidth;
}
