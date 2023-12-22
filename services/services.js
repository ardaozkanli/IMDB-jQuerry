export const url = "http://imdbproject.lumnion.com";

export const showErrorPopup =  function (errorMessage) {
    Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        confirmButtonText: 'Okey'
    });
}
export const showConfirmPopup = function(errorMessage){
    Swal.fire({
        icon:"error",
        title:"Does not match!",
        text:errorMessage,
        confirmButtonText:"Okey"
    })
}