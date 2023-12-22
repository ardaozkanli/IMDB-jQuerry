import { url,showErrorPopup } from "../../services/services.js";

$(document).ready(function () {
    
    $("form.user-authentication").submit(function (event) {
        event.preventDefault();

        let userNameValue = $("#exampleInputUserName").val();
        let passwordValue = $("#exampleInputPassword1").val();


        console.log(`Username is : ${userNameValue}`);
        console.log(`Password is : ${passwordValue}`);
      

        
        $(this)[0].reset();

        //log infos 

        let loginData = {
            username: userNameValue,
            password: passwordValue
        };


            $.ajax({
                type: "POST",
                url: `${url}/login`,
                contentType: "application/json",
                data: JSON.stringify(loginData),
             
             
                success: function (response) {
                   console.log(response);
                   let accessToken = response.access_token;
    
                    console.log("Token: " + accessToken);
    
                    sessionStorage.setItem('access_token', accessToken);
                    window.location.href = "../../Movies/movies.html";
                },
                error: function (error) {
                   showErrorPopup(error.responseJSON.message)
                }
            });
       
      
    });

        
  
});

