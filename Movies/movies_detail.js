import { showErrorPopup, url } from "../services/services.js";

$(document).ready(function () {
  let queryString = window.location.search;
  let params = new URLSearchParams(queryString);
  let movie_id = params.get("v");
  console.log(movie_id);

  $.ajax({
    type: "GET",
    url: `${url}/get-movie/${movie_id}`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
    },
    success: function (response) {
      console.log(response);
      if (response.data) {
        let movie = response.data;

        let starKeysObject = {};

        for (let key in movie) {
          if (key.includes("Star")) {
            starKeysObject[key] = movie[key];
          }
        }

        let starNames = Object.values(starKeysObject);
        let currentStarObj = starNames.join(", ");

        console.log(starKeysObject);

        let detailMovieItems = $(`
        <div class = "col-6 offset-3 mt-3">
                <div class="card rounded detail-card" data-movie-id="${movie._id}">
                <div class="card-img-top row">
                    <img src="${movie.Poster_Link}" alt="movie image" class="col-2 " />
                    <h1 class="card-title col-8 mt-4">${movie.Series_Title}</h1>
                </div>
                <div class="card-body row">
                    <ul class="detail-card-list ">
                        <li class="card-text"><strong>Certificate</strong>: ${movie.Certificate}</li>
                        <li class="card-text"><strong>Director</strong>: ${movie.Director}</li>
                        <li class="card-text"><strong>Genre</strong>: ${movie.Genre}</li>
                        <li class="card-text"><strong>Gross</strong>: ${movie.Gross} </li>
                        <li class="card-text"><strong>IMDB Rating</strong>: ${movie.IMDB_Rating}</li>
                        <li class="card-text"><strong>Meta Score</strong>: ${movie.Meta_score}</li>
                        <li class="card-text"><strong>No of Votes</strong>: ${movie.No_of_Votes}</li>
                        <li class="card-text"><strong>Overview</strong>: ${movie.Overview}</li>
                        <li class="card-text"><strong>Released Year</strong>: ${movie.Released_Year}</li>
                        <li class="card-text"><strong>Runtime</strong>: ${movie.Runtime}</li>
                        <li class="card-text"><strong>Stars</strong>: ${currentStarObj}</li>
                    </ul>
                  
                </div>
                <div data-bs-theme="dark">
                    <button type="button" class="btn-close btn-close-detail-card" aria-label="Close"></button>
                </div>
            </div>
            </div>
          
                    
                `);
        $(".detail-movie-card").append(detailMovieItems);
      }
    },
    error: function (error) {
      showErrorPopup(error.responseJSON.message);
    },
  });
  $(".detail-movie-card").on("click", ".btn-close", function () {
    window.location.href = "../Movies/movies.html";
  });
});
