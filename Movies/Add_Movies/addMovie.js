import { url, showErrorPopup } from "../../services/services.js";

$(document).ready(function () {
  $("#exampleInputGenre,#exampleInputStarName").select2({
    theme: "bootstrap-5",
    width: $(this).data("width")
      ? $(this).data("width")
      : $(this).hasClass("w-100")
      ? "100%"
      : "style",
    placeholder: $(this).data("placeholder"),
  });

  $(".form-container").submit(function (event) {
    event.preventDefault();

    let starName = $("#exampleInputStarName").val();
    let certificate = $("#exampleInputCertificate").val();
    let director = $("#exampleInputDirectors").val();
    let genre = $("#exampleInputGenre").val();
    let gross = $("#exampleInputGross").val();
    let imdbRating = $("#exampleInputRating").val();
    let metaScore = $("#exampleInputScore").val();
    let noOfVotes = $("#exampleInputVote").val();
    let posterLink = $("#exampleInputPosterLink").val();
    let releasedYear = $("#exampleInputReleased").val();
    let runtime = $("#exampleInputTime").val();
    let seriesTitle = $("#exampleInputTitle").val();
    let overview = $("#exampleInputOverview").val();

    let movieData = {
      Certificate: certificate,
      Director: director,
      Genre: genre,
      Gross: gross,
      IMDB_Rating: imdbRating,
      Meta_score: metaScore,
      No_of_Votes: noOfVotes,
      Poster_Link: posterLink,
      Released_Year: releasedYear,
      Runtime: runtime,
      Series_Title: seriesTitle,
      Overview: overview,
      Stars: starName,
    };

    let postMovieData = JSON.stringify(movieData);
    console.log(postMovieData);

    //reseting the inputs
    $(this)[0].reset();

    $.ajax({
      url: `${url}/add-movie`,
      type: "POST",
      data: postMovieData,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      contentType: "application/json",
      success: function (response) {
        console.log(response);
        window.location.href = "../movies.html";
      },
      error: function (error) {
        showErrorPopup(error.responseJSON.message);
      },
    });
  });

  function selectBoxItems(apiUrl, selectBoxId) {
    $.ajax({
      url: apiUrl,
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      success: function (response) {
        let selectBox = $(`#${selectBoxId}`);
        selectBox.empty();
        let items = response.data;
        console.log(items);
        for (let i = 0; i < items.length; i++) {
          let option = $("<option>").text(items[i]);
          selectBox.append(option);
        }
      },
      error: function (error) {
        showErrorPopup(error.responseJSON.message);
      },
    });
  }
  selectBoxItems(`${url}/get-certificates`, "exampleInputCertificate");
  selectBoxItems(`${url}/get-directors`, "exampleInputDirectors");
  selectBoxItems(`${url}/get-genres`, "exampleInputGenre");
  selectBoxItems(`${url}/get-stars`, "exampleInputStarName");
});
