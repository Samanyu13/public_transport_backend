async function AdminLogin() {
    var empid = document.getElementById('empid').value;
    var password = document.getElementById('password').value;
    var tosend = {};
    tosend.employeeID = empid;
    tosend.password = password;

    try {
        let result = await axios.post('http://localhost:3000/auth/adminAuth/login', tosend);
        console.log(result.data.about.data);
        if (result.data.success) {
            localStorage.setItem('user_token', result.data.about.data);
            window.location.href = "../../private/admin/dashboard";
        }
        else {
            document.getElementById('formError').innerHTML = result.data.about.comment;
        }
    }
    catch (err) {

    }

    // localStorage.setItem('user_details', JSON.stringify(result.data.data));


}
