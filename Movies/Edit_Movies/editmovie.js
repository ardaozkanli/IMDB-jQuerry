import { url, showErrorPopup } from "../../services/services.js";

let queryString = window.location.search;
let params = new URLSearchParams(queryString);
let movie_id = params.get("v");
console.log(movie_id);

function checkAccessToken() {
  let accessToken = sessionStorage.getItem("access_token");
  if (accessToken) {
    console.log("Token is valid user has entered");
    console.log(accessToken);
  } else {
    console.log("Token is not valid user has to login");
    window.location.href = "../../Auth/Login/login.html";
  }
}

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
      let items = response.data;
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

let movieData = [];
function getMovieById() {
  $.ajax({
    type: "GET",
    url: `${url}/get-movie/${movie_id}`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
    },
    success: function (response) {
      console.log(response.data);
      movieData = response.data;

      let starKeysObject = {};

      for (let key in movieData) {
        if (key.includes("Star")) {
          starKeysObject[key] = movieData[key];
        }
      }
      let starNames = Object.values(starKeysObject);
      let currentStarObj = starNames.join(", ");

      $("#exampleInputCertificate").append(
        new Option(movieData.Certificate, movieData.Certificate)
      );
      $("#exampleInputDirectors").append(
        new Option(movieData.Director, movieData.Director)
      );
      $("#exampleInputGross").val(movieData.Gross);
      $("#exampleInputRating").val(movieData.IMDB_Rating);
      $("#exampleInputCertificate").val(movieData.Certificate);
      $("#exampleInputScore").val(movieData.Meta_score);
      $("#exampleInputVote").val(movieData.No_of_Votes);
      $("#exampleInputOverview").val(movieData.Overview);
      $("#exampleInputPosterLink").val(movieData.Poster_Link);
      $("#exampleInputReleased").val(movieData.Released_Year);
      $("#exampleInputTitle").val(movieData.Series_Title);
      $("#exampleInputTime").val(movieData.Runtime);
      $("#exampleInputStarName").val(currentStarObj);
      $("#exampleInputGenre").val(movieData.Genre);
      setStarNames("#exampleInputStarName", currentStarObj);
      setGenres("#exampleInputGenre", movieData.Genre);
    },
    error: function (error) {
      showErrorPopup(error.responseJSON.message);
    },
  });
}

$(".log-out-btn").click(function () {
  sessionStorage.removeItem("access_token");
});

function setStarNames(id, starNames) {
  let $starSelect = $(id);
  $starSelect.empty();

  starNames.split(", ").forEach((starName) => {
    $starSelect.append(
      `<option value="${starName}" selected>${starName}</option>`
    );
  });
}

function setGenres(id, Genres) {
  let $genreSelect = $(id);
  $genreSelect.empty();

  let options = Genres.map(
    (item) => `<option value="${item}" selected>${item}</option>`
  );
  $genreSelect.html(options.join(""));
}

$("#exampleInputGenre,#exampleInputStarName").select2({
  theme: "bootstrap-5",
  width: $(this).data("width")
    ? $(this).data("width")
    : $(this).hasClass("w-100")
    ? "100%"
    : "style",
  placeholder: $(this).data("placeholder"),
});

$(document).ready(function () {
  checkAccessToken();
  getMovieById();
  selectBoxItems(`${url}/get-certificates`, "exampleInputCertificate");
  selectBoxItems(`${url}/get-directors`, "exampleInputDirectors");
  selectBoxItems(`${url}/get-genres`, "exampleInputGenre");
  selectBoxItems(`${url}/get-stars`, "exampleInputStarName");

  $(".form-container").submit(function (event) {
    event.preventDefault();

    let genre = $("#exampleInputGenre").val();
    let starNameArray = $("#exampleInputStarName").val();
    let certificate = $("#exampleInputCertificate").val();
    let director = $("#exampleInputDirectors").val();
    let gross = parseInt($("#exampleInputGross").val(), 10);
    let imdbRating = parseFloat($("#exampleInputRating").val());
    let metaScore = parseFloat($("#exampleInputScore").val());
    let noVotes = parseFloat($("#exampleInputVote").val());
    let posterLink = $("#exampleInputPosterLink").val();
    let releasedYear = parseInt($("#exampleInputReleased").val(), 10);
    let runtime = $("#exampleInputTime").val();
    let seriesTitle = $("#exampleInputTitle").val();
    let overview = $("#exampleInputOverview").val();

    let movieData = {
      Certificate: certificate,
      Director: director,
      Gross: gross,
      IMDB_Rating: imdbRating,
      Meta_score: metaScore,
      No_of_Votes: noVotes,
      Poster_Link: posterLink,
      Released_Year: releasedYear,
      Runtime: runtime,
      Series_Title: seriesTitle,
      Overview: overview,
      Stars: starNameArray,
      Genre: genre,
    };
    console.log(JSON.stringify(movieData));

    $.ajax({
      type: "POST",
      url: `${url}/edit-movie/${movie_id}`,
      data: JSON.stringify(movieData),
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      success: function (response) {
        console.log(response);
        window.location.href = "../movies.html";
      },
      error: function (error) {
        showErrorPopup(error.responseJSON.message);
      },
    });
  });
});
