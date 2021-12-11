// form 유효성 체크 로직 구현


// form element 선택
const usernameEl = document.querySelector('#username');
const emailEl = document.querySelector('#email');
const passwordEl = document.querySelector('#password');
const confirmPasswordEl = document.querySelector('#confirm-password');

// form submit 이벤트 정의
const signupForm = document.querySelector('#signup');
signupForm.addEventListener('click', function(e) {
    // <form> submit의 기본동작을 방지한다.
    e.preventDefault();    
   
    // <form> 필드 값들의 유효성을 체크한다
    let isUsernameValid = checkUsername(),
        isEmailValid = checkEmail(),
        isPasswordValid = checkPassword(),
        isConfirmPasswordValid = checkConfirmPassword();

    let isFormValid = isUsernameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid;

    // <form> 필드값들이 유효한 경우
    if (isFormValid) {
        // 서버로 요청하거나 행동을 정의한다.
    }
});


const checkUsername = () => {
    let valid = false;

    const min = 3,
        max = 25;

    const username = usernameEl.value.trim();

    if (!isRequired(username)) {
        showError(usernameEl, '이름을 입력해주세요');
    } else if (!isBetween(username.length, min, max)) {
        showError(usernameEl, `이름은 ${min}지에서 ${max}자 사이여야 합니다.`)
    } else {
        showSuccess(usernameEl);
        valid = true;
    }
    return valid;
};


const checkEmail = () => {
    let valid = false;
    const email = emailEl.value.trim();
    if (!isRequired(email)) {
        showError(emailEl, '이메일은 공백일 수 없습니다');
    } else if (!isEmailValid(email)) {
        showError(emailEl, '유효하지 않는 이메일입니다')
    } else {
        showSuccess(emailEl);
        valid = true;
    }
    return valid;
};

// 비밀번호를 확인한다
const checkPassword = () => {
    let valid = false;

    const password = passwordEl.value.trim();

    if (!isRequired(password)) {
        showError(passwordEl, '비밀번호는 공백일 수 없습니다');
    } else if (!isPasswordValid(password)) {
        showError(passwordEl, '비밀번호는 최소 8자이상, 대문자 1자 이상, 특수기호(!@#$%^&*) 1자 이상, 숫자 1자 이상으로 이루어져야합니다.');
    } else {
        showSuccess(passwordEl);
        valid = true;
    }

    return valid;
};

// 비밀번호 재입력을 확인한다
const checkConfirmPassword = () => {
    let valid = false;
    
    const confirmPassword = confirmPasswordEl.value.trim();
    const password = passwordEl.value.trim();

    if (!isRequired(confirmPassword)) {
        showError(confirmPasswordEl, '비밀번호를 다시 입력해주세요');
    } else if (password !== confirmPassword) {
        showError(confirmPasswordEl, '비밀번호 재입력값이 틀립니다');
    } else {
        showSuccess(confirmPasswordEl);
        valid = true;
    }

    return valid;
};

// 사용자가 입력 시 바로 변화 이벤트를 주지 않고 0.5초 딜레이를 준다.
const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        // 기존에 이벤트가 걸려있다면 해제
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // 새로운 타이머 적용
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

// form 내 input값이 변하는 경우 이벤트를 등록
signupForm.addEventListener('input', debounce(function(e) {
    const id = e.target.id;
    console.log(id);
    switch (id) {
        case 'username': 
            checkUsername();
            break;
        case 'email':
            checkEmail();
            break;
        case 'password':
            checkPassword();
            break;
        case 'confirm-password':
            checkConfirmPassword();
            break;
        default:
            console.error(`unknown input id : ${id}`);
            break;
    }
}));

// 필드 별 제약 조건 정의
// 필수인 경우
const isRequired = (value) => value == '' ? false : true;
// 특정 값이 min과 max 사이인 경우
const isBetween = (length, min, max) => length < min || length > max ? false : true;
// 유효한 이메일인지 확인
const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
// 유효한 비밀번호인지 확인
const isPasswordValid = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password);
};


// 필드 메세지 출력 정의
// 유효하지 않은 경우 각 필드 <small>에 에러 메세지를 보여준다.
const showError = (input, message) => {
    // input의 부모 필드를 가져온다
    const formField = input.parentElement;

    formField.classList.remove('success');
    formField.classList.add('error');

    // 에러 메세지를 보여준다
    const error = formField.querySelector('small');
    error.textContent = message;    
};

// 유효한 필드에 성공 메세지를 출력
const showSuccess = (input, message) => {
    const formField = input.parentElement;

    formField.classList.remove('error');
    formField.classList.add('success');

    const error = formField.querySelector('small');
    error.textContent = '';
};
