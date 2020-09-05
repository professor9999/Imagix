// function validation() {
//     var fill = document.querySelectorAll('input');
//     var i;
//     for (i = 0; i < fill.length; i++) {
//         if (fill[i].value == "") {
//             var x = document.querySelectorAll('input')[i].id + "1";
//             document.getElementById(x).innerHTML = "**Field cannot be empty";
//         }
//     }
// }

// var validemail = document.getElementById('mail');
// validemail.addEventListener('change', checkMail);

// function checkMail(e) {
//     var regex = /^\w+@(gmail.com)$/;
//     if (!regex.test(validemail.value)) {
//         document.getElementById('mail1').innerHTML = "Invalid Mail";
//     }
// }

// var validlast = document.getElementById('last');
// validlast.addEventListener('change', checkLast);

// function checkLast() {
//     var regex = /^(\.[a-zA-Z]){0,}$/;
//     if (!regex.test(validlast.value)) {
//         document.getElementById('last1').innerHTML = "Invalid Last Name";
//     }
// }

// var date = document.getElementById('dob');
// date.addEventListener('change', calculateAge);


// function calculateAge() {
//     var dob = document.getElementById('dob').value;

//     var year = parseInt(dob.slice(0, 4), 10);
//     var month = parseInt(dob.slice(5, 7), 10);
//     var day = parseInt(dob.slice(8, 10), 10);

//     var currentDate = new Date();
//     var currentYear = currentDate.getFullYear();
//     var currentMonth = currentDate.getMonth() + 1;
//     var currentDay = currentDate.getDate();

//     var age = (currentYear - year) - 1;

//     if (month > currentMonth) {
//         age++;
//         document.getElementById('age1').innerHTML = age;
//         return true;
//     }
//     else if (currentMonth == month) {
//         if (day >= currentDay) {
//             age++;
//             document.getElementById('age1').innerHTML = age;
//             return true;
//         }
//     }

//     document.getElementById('age1').innerHTML = age;

// }







