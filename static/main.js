let navBtn = document.getElementsByClassName('nav-btn');
let sidenav = document.getElementsByClassName('navigation')
let isClicked = false;
console.log(navBtn)
navBtn[0].addEventListener('click' , (e)=>{
    if(isClicked){
        isClicked = false;
    }else{
        isClicked = true;
        sidenav[0].style.transform = 'scaleX(1)'
        sidenav[0].style.left = 0;
    }
})
document.getElementById('close').addEventListener('click' , (e)=>{
    if(isClicked){
        isClicked = false;
        sidenav[0].style.transform = 'scaleX(0)';

    }else{
        isClicked = true;
        sidenav[0].style.transform = 'scaleX(1)';
        sidenav[0].style.left = 0;
    }
})