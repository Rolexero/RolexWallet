const loginForm = document.querySelector('form.login');
const signupForm = document.querySelector('form.signup');
const loginBtn = document.querySelector('label.login');
const signUpBtn = document.querySelector('label.signup');
const signUpLink = document.querySelector('.signup-link a');
const logInText = document.querySelector('.title-text .login');
const signUpText = document.querySelector('.title-text .signup');

signupForm.addEventListener('submit', submitForm);
loginForm.addEventListener('submit', loginUser);

signUpBtn.addEventListener('click', () => {
    loginForm.style.marginLeft = '-50%';
    logInText.style.marginLeft = '-55%';
})

loginBtn.addEventListener('click', () => {
    loginForm.style.marginLeft = '0%';
    logInText.style.marginLeft = '0%';
})

signUpLink.addEventListener('click', () => {
    signUpBtn.click();
    return false;
})

signupForm.btnClick.addEventListener('click', ()=>{
    document.querySelector('#generateAcc').value = Math.floor(1000000000 + Math.random() * 9000000000);
})

let selectOpt = document.querySelector("select");

const api_url = "https://api.paystack.co/bank";
getBankName_api(api_url);
let optionBanks = ``;

async function getBankName_api(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const bankName = data.data;
            bankName.forEach(bankname => {
            const bank = bankname.name;
            const bankCode = bankname.code;
            optionBanks += `
                <option value="${bank}">${bank}</option>
            `
        });
        }catch (error) {
            console.log(error);
        }
        selectOpt.innerHTML += optionBanks;
    }

    function toastError(errorValue) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "5000",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
          }
         return toastr["error"](errorValue);
    }

    function toastSuccess(successValue) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
          }
         toastr["success"](successValue);
    }

    function testFullName(event) {
        let pattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/g;
        let firstSpan = document.querySelector('#span1');
        if (Number.isInteger(parseFloat(signupForm.fname.value)) || pattern.test(signupForm.fname.value)) {
            firstSpan.innerText = "invalid input"
            signupForm.fname.style.border = "2px solid red";
            signupForm.fname.style.outline = "none";
            toastError("Full name cannot contain number or special characters");
        }else if (!(Number.isInteger(parseFloat(signupForm.fname.value)) || pattern.test(signupForm.fname.value))) {
            firstSpan.innerText = "valid input";
            signupForm.fname.style.border = "2px solid green";
            return true;
        }else{
            firstSpan.innerText = ""
            signupForm.fname.style.border = "";
        }
    }

    function testPassword() {
       if (signupForm.pswd.value.length < 7 ) {
           toastError("password should be more than 6 letters");
       }else{
           return true;
       }
    }

    function submitForm(event) {
        let newUser;
        event.preventDefault();
       let testName =  testFullName();
       let testPass = testPassword();
       let testEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       let database_ref = database.ref();
       console.log(database_ref)
       if (testName && testPass && testEmail.test(signupForm.email.value)) {
              auth.createUserWithEmailAndPassword(signupForm.email.value, signupForm.pswd.value).then(()=>{
                    let user = auth.currentUser;
                    let userId;
                    if (user !== null) {
                        userId = user.uid;
                    }
                    newUser = {
                        fullName: signupForm.fname.value,
                        userBank: signupForm.selectValue.value,
                        accNo: signupForm.generateAcc.value,
                        accountBalance: new Intl.NumberFormat('en-NG', {
                            style:"currency",
                            currency: "NGN"
                    }).format(parseInt(signupForm.accBal.value)),
                        Email: signupForm.email.value,
                        userFb: "https://www.facebook.com/",
                        userTw: "https://twitter.com/",
                        last_login: Date.now()
                    };
                    database_ref.child('users/' + userId).set(newUser);
                    toastSuccess(`Your account was successfully created, you can now login to your bank app`);
                    window.setTimeout('location.reload()', 2500);
              }).catch((error)=>{
                return toastError(error.message);
              })
        }
    }

        function loginUser(event) {
            event.preventDefault();
            auth.signInWithEmailAndPassword(loginForm.email.value, loginForm.pass.value).then(()=>{
                toastSuccess('Successfully signed in');
                setTimeout(()=>{
                    window.location.href = './iPortfolio/index.html';
            }, 2500);
            }).catch((error)=>{
                return toastError(error.message);
            })
        }
        
    
